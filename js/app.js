/**
 * EventGenie AI - Main Application Logic & State Controller
 * Manages Event CRUD, Programmatic Budget Calculations, Checklists, Vendors, and UI Views
 */

class EventGenieApp {
  constructor() {
    this.events = [];
    this.currentEvent = null;
    this.currentTab = 'overview';
    this.checklistFilter = 'all';
    this.chatMessages = [];
    this.isAiGenerating = false;

    this.init();
  }

  async init() {
    // 1. Initialize AI Engine & check backend connection
    await aiEngine.checkBackendStatus();
    this.updateAiStatusBadge();

    // 2. Load events (from Server API, or LocalStorage, or Default Samples)
    await this.loadEvents();

    // 3. Bind UI event listeners
    this.bindEvents();

    // 4. Render initial view
    this.renderEventSelector();
    this.renderCurrentEvent();
    this.renderQuickPrompts();
    this.renderVendorGuide();

    // Initialize initial chat greeting
    this.initChatWelcome();
  }

  /**
   * Loads events from backend API or local storage
   */
  async loadEvents() {
    try {
      const res = await fetch('/api/events');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          this.events = data;
        }
      }
    } catch (e) {
      console.warn('API /api/events not available, using local cache');
    }

    // Check LocalStorage if server didn't provide events
    if (this.events.length === 0) {
      const stored = localStorage.getItem('eventgenie_events');
      if (stored) {
        try {
          this.events = JSON.parse(stored);
        } catch (e) {
          console.error('Failed to parse cached events', e);
        }
      }
    }

    // If still empty, use rich sample events
    if (this.events.length === 0) {
      this.events = JSON.parse(JSON.stringify(DEFAULT_EVENTS));
      this.saveEvents();
    }

    // Set first event as active
    this.currentEvent = this.events[0];
  }

  /**
   * Persists events to both localStorage and backend API
   */
  async saveEvents() {
    // 1. Save to local storage for instant offline persistence
    localStorage.setItem('eventgenie_events', JSON.stringify(this.events));

    // 2. Save to backend REST API
    try {
      await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.events)
      });
    } catch (e) {
      // Backend not running, silent pass
    }
  }

  /**
   * Update AI Mode badge across navbar and chat
   */
  updateAiStatusBadge() {
    const badgeEl = document.getElementById('ai-mode-badge');
    const chatBadgeEl = document.getElementById('chat-ai-status');
    const isGemini = aiEngine.mode === 'gemini';

    const text = isGemini ? 'Gemini AI Live' : 'Demo AI Mode (Fully Functional)';
    const cls = isGemini ? 'badge-emerald' : 'badge-purple';

    if (badgeEl) {
      badgeEl.className = `badge ${cls}`;
      badgeEl.innerHTML = `<span class="pulse-dot"></span> ${text}`;
    }
    if (chatBadgeEl) {
      chatBadgeEl.className = `badge ${cls}`;
      chatBadgeEl.innerHTML = `<span class="pulse-dot"></span> ${text}`;
    }
  }

  /**
   * Switch between Landing view and Workspace view
   */
  switchView(view) {
    const landing = document.getElementById('landing-view');
    const app = document.getElementById('app-view');

    if (view === 'app') {
      landing.classList.add('hidden');
      app.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      landing.classList.remove('hidden');
      app.classList.add('hidden');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /**
   * Switch tabs within Workspace (Overview, Budget, Checklist, Vendors, AI Chat)
   */
  switchTab(tabId) {
    this.currentTab = tabId;

    // Update tab button classes
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    // Update tab panel visibility
    document.querySelectorAll('.tab-content-panel').forEach(panel => {
      panel.classList.toggle('active', panel.id === `tab-panel-${tabId}`);
    });

    // Specific renders if needed
    if (tabId === 'budget') this.renderBudgetTab();
    if (tabId === 'checklist') this.renderChecklistTab();
    if (tabId === 'vendors') this.renderVendorsTab();
    if (tabId === 'overview') this.renderOverviewTab();
    if (tabId === 'export') this.renderExportTab();
  }

  /**
   * Switch active event
   */
  selectEvent(eventId) {
    const evt = this.events.find(e => e.id === eventId);
    if (evt) {
      this.currentEvent = evt;
      this.renderCurrentEvent();
      this.showToast(`Switched to "${evt.title}"`, 'info');
    }
  }

  /**
   * Renders the event selector dropdown
   */
  renderEventSelector() {
    const selector = document.getElementById('event-select-dropdown');
    if (!selector) return;

    selector.innerHTML = this.events.map(e => `
      <option value="${e.id}" ${this.currentEvent && this.currentEvent.id === e.id ? 'selected' : ''}>
        ${this.getEventTypeIcon(e.type)} ${e.title}
      </option>
    `).join('');
  }

  getEventTypeIcon(type) {
    switch (type) {
      case 'wedding': return '💍';
      case 'birthday': return '🎂';
      case 'college': return '🎓';
      case 'corporate': return '💼';
      case 'community': return '🎉';
      default: return '✨';
    }
  }

  /**
   * Full re-render of current event data into all tabs & headers
   */
  renderCurrentEvent() {
    if (!this.currentEvent) return;
    const evt = this.currentEvent;

    // Update Quick Header Stats
    const headerTitle = document.getElementById('header-event-title');
    if (headerTitle) headerTitle.textContent = evt.title;

    // Days until event calculation
    const daysUntilEl = document.getElementById('stat-days-until');
    if (daysUntilEl) {
      const target = new Date(evt.date);
      const today = new Date();
      const diffTime = target - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      daysUntilEl.textContent = diffDays > 0 ? `${diffDays} Days` : 'Event Day!';
    }

    const statBudgetEl = document.getElementById('stat-budget-total');
    if (statBudgetEl) statBudgetEl.textContent = `${evt.currency}${evt.targetBudget.toLocaleString()}`;

    const statGuestsEl = document.getElementById('stat-guest-count');
    if (statGuestsEl) statGuestsEl.textContent = `${evt.guestCount} Guests`;

    // Tasks completed %
    const statTasksEl = document.getElementById('stat-tasks-progress');
    if (statTasksEl) {
      const totalTasks = evt.checklist.length;
      const doneTasks = evt.checklist.filter(t => t.completed).length;
      const pct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
      statTasksEl.textContent = `${pct}% (${doneTasks}/${totalTasks})`;
    }

    // Render active tab
    this.renderOverviewTab();
    this.renderBudgetTab();
    this.renderChecklistTab();
    this.renderVendorsTab();
    this.renderExportTab();
  }

  /**
   * Render Tab 1: Overview & AI Plan
   */
  renderOverviewTab() {
    const evt = this.currentEvent;
    if (!evt) return;

    // Hero plan banner
    document.getElementById('plan-event-title').textContent = evt.title;
    document.getElementById('plan-event-subtitle').textContent = `Host: ${evt.hostName || 'Host'} • ${evt.location} • ${evt.date}`;
    document.getElementById('plan-executive-summary').textContent = evt.plan.executiveSummary;
    document.getElementById('plan-theme-badge').textContent = `Theme: ${evt.theme}`;

    // Color Palette Swatches
    const paletteContainer = document.getElementById('plan-color-palette');
    if (paletteContainer) {
      paletteContainer.innerHTML = evt.plan.colorPalette.map(c => `
        <div class="palette-chip" title="${c.hex}">
          <span class="palette-color-dot" style="background-color: ${c.hex};"></span>
          <span>${c.name}</span>
        </div>
      `).join('');
    }

    // Venues section
    const venuesContainer = document.getElementById('plan-venues-list');
    if (venuesContainer) {
      venuesContainer.innerHTML = evt.plan.venues.map(v => `
        <div class="venue-card-item">
          <div class="flex items-center justify-between" style="margin-bottom: 0.35rem;">
            <strong>${v.name}</strong>
            <span class="badge badge-purple">${v.type}</span>
          </div>
          <p style="font-size: 0.85rem; margin-bottom: 0.5rem; color: var(--accent-cyan);">Est. Cost: ${v.estimatedCost} • Capacity: ${v.capacity}</p>
          <div style="font-size: 0.85rem; line-height: 1.4;">
            <p><span style="color: var(--accent-emerald);">✔ Pros:</span> ${v.pros}</p>
            <p><span style="color: var(--accent-amber);">⚠ Note:</span> ${v.cons}</p>
          </div>
        </div>
      `).join('');
    }

    // Decor & Ambience
    const decor = evt.plan.decor;
    document.getElementById('plan-decor-concept').textContent = decor.concept;
    document.getElementById('plan-decor-entrance').textContent = decor.entrance;
    document.getElementById('plan-decor-tables').textContent = decor.tables;
    document.getElementById('plan-decor-lighting').textContent = decor.lighting;
    document.getElementById('plan-decor-photobooth').textContent = decor.photobooth;

    // Catering Strategy
    const catering = evt.plan.catering;
    document.getElementById('plan-catering-style').textContent = catering.style;
    document.getElementById('plan-catering-perguest').textContent = `~${evt.currency}${catering.perGuestEstimate || Math.round((evt.targetBudget * 0.34) / evt.guestCount)} / guest`;
    
    document.getElementById('plan-catering-apps').innerHTML = catering.appetizers.map(a => `<li>${a}</li>`).join('');
    document.getElementById('plan-catering-mains').innerHTML = catering.mains.map(m => `<li>${m}</li>`).join('');
    document.getElementById('plan-catering-desserts').innerHTML = catering.desserts.map(d => `<li>${d}</li>`).join('');
    document.getElementById('plan-catering-drinks').innerHTML = catering.signatureDrinks.map(d => `<li>${d}</li>`).join('');

    // Entertainment
    const ent = evt.plan.entertainment;
    document.getElementById('plan-ent-genre').textContent = ent.musicGenre;
    document.getElementById('plan-ent-highlights').innerHTML = ent.highlights.map(h => `<li>${h}</li>`).join('');
  }

  /**
   * Render Tab 2: Smart Budget Planner (Programmatic Arithmetic)
   */
  renderBudgetTab() {
    const evt = this.currentEvent;
    if (!evt) return;

    // Strict Programmatic Calculation of Totals
    let totalEstimated = 0;
    let totalActual = 0;
    let totalPaid = 0;

    evt.budget.categories.forEach(cat => {
      cat.items.forEach(item => {
        totalEstimated += Number(item.estimated) || 0;
        totalActual += Number(item.actual) || 0;
        if (item.paid) {
          totalPaid += Number(item.actual) || 0;
        }
      });
    });

    const targetBudget = evt.targetBudget;
    const remainingBudget = targetBudget - totalActual;
    const isOverBudget = totalActual > targetBudget;
    const budgetPctUsed = Math.min(100, Math.round((totalActual / targetBudget) * 100));

    // Update Header Metric Displays
    document.getElementById('budget-target-display').textContent = `${evt.currency}${targetBudget.toLocaleString()}`;
    document.getElementById('budget-actual-display').textContent = `${evt.currency}${totalActual.toLocaleString()}`;
    document.getElementById('budget-paid-display').textContent = `${evt.currency}${totalPaid.toLocaleString()}`;
    
    const remainingEl = document.getElementById('budget-remaining-display');
    remainingEl.textContent = `${evt.currency}${Math.abs(remainingBudget).toLocaleString()} ${isOverBudget ? '(Over)' : 'Left'}`;
    remainingEl.style.color = isOverBudget ? 'var(--accent-rose)' : 'var(--accent-emerald)';

    // Update Progress Bar
    const barFill = document.getElementById('budget-progress-fill');
    barFill.style.width = `${budgetPctUsed}%`;
    barFill.classList.toggle('overbudget', isOverBudget);

    document.getElementById('budget-progress-text').textContent = `${budgetPctUsed}% of target budget committed (${evt.currency}${totalActual.toLocaleString()} / ${evt.currency}${targetBudget.toLocaleString()})`;

    // Budget Sliders sync
    const guestInput = document.getElementById('adjust-guest-count');
    const budgetInput = document.getElementById('adjust-target-budget');
    if (guestInput) guestInput.value = evt.guestCount;
    if (budgetInput) budgetInput.value = evt.targetBudget;

    // Render Categories & Itemized Tables
    const container = document.getElementById('budget-categories-container');
    if (!container) return;

    container.innerHTML = evt.budget.categories.map(cat => {
      const catActual = cat.items.reduce((s, i) => s + (Number(i.actual) || 0), 0);
      const catEst = cat.items.reduce((s, i) => s + (Number(i.estimated) || 0), 0);

      return `
        <div class="budget-cat-card" data-cat-id="${cat.id}">
          <div class="budget-cat-header">
            <div class="flex items-center gap-2">
              <span style="font-size: 1.25rem;">${this.getCategoryIcon(cat.icon)}</span>
              <div>
                <strong>${cat.name}</strong>
                <span class="badge badge-purple" style="margin-left: 0.5rem;">${cat.percentage}% allocation</span>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div style="text-align: right;">
                <span style="font-size: 0.85rem; color: var(--text-muted);">Committed:</span>
                <strong style="color: var(--accent-cyan); font-size: 1.05rem; margin-left: 0.35rem;">${evt.currency}${catActual.toLocaleString()}</strong>
              </div>
              <button class="btn btn-secondary btn-sm" onclick="app.openAddItemModal('${cat.id}')">
                + Add Item
              </button>
            </div>
          </div>

          <div style="overflow-x: auto;">
            <table class="budget-items-table">
              <thead>
                <tr>
                  <th>Item / Description</th>
                  <th style="width: 130px;">Est. Cost</th>
                  <th style="width: 130px;">Actual Cost</th>
                  <th style="width: 110px;">Status</th>
                  <th>Notes</th>
                  <th style="width: 80px; text-align: right;">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${cat.items.length === 0 ? `
                  <tr><td colspan="6" style="text-align: center; color: var(--text-dim); padding: 1.5rem;">No expense items added yet. Click "+ Add Item" above.</td></tr>
                ` : cat.items.map(item => `
                  <tr>
                    <td><strong>${item.name}</strong></td>
                    <td style="color: var(--text-muted);">${evt.currency}${Number(item.estimated).toLocaleString()}</td>
                    <td>
                      <input type="number" 
                             class="item-cost-input" 
                             value="${item.actual}" 
                             style="width: 100px; padding: 0.25rem 0.5rem; font-size: 0.85rem;"
                             onchange="app.updateItemCost('${cat.id}', '${item.id}', this.value)" />
                    </td>
                    <td>
                      <button class="badge ${item.paid ? 'badge-emerald' : 'badge-amber'}" 
                              style="cursor: pointer;"
                              onclick="app.toggleItemPaid('${cat.id}', '${item.id}')">
                        ${item.paid ? '✔ Paid' : '⏳ Pending'}
                      </button>
                    </td>
                    <td style="font-size: 0.825rem; color: var(--text-muted);">${item.notes || '—'}</td>
                    <td style="text-align: right;">
                      <button class="btn-icon btn-danger btn-sm" 
                              title="Delete Item"
                              onclick="app.deleteBudgetItem('${cat.id}', '${item.id}')">
                        🗑️
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `;
    }).join('');
  }

  getCategoryIcon(iconName) {
    switch (iconName) {
      case 'building': return '🏛️';
      case 'utensils': return '🍽️';
      case 'sparkles': return '✨';
      case 'camera': return '📷';
      case 'music': return '🎵';
      case 'gift': return '🎁';
      default: return '🏷️';
    }
  }

  /**
   * Update item actual cost
   */
  updateItemCost(catId, itemId, newValue) {
    const cat = this.currentEvent.budget.categories.find(c => c.id === catId);
    if (!cat) return;
    const item = cat.items.find(i => i.id === itemId);
    if (item) {
      item.actual = Math.max(0, parseFloat(newValue) || 0);
      this.saveEvents();
      this.renderBudgetTab();
      this.showToast('Budget cost updated', 'info');
    }
  }

  /**
   * Toggle item paid status
   */
  toggleItemPaid(catId, itemId) {
    const cat = this.currentEvent.budget.categories.find(c => c.id === catId);
    if (!cat) return;
    const item = cat.items.find(i => i.id === itemId);
    if (item) {
      item.paid = !item.paid;
      this.saveEvents();
      this.renderBudgetTab();
      this.showToast(`Marked as ${item.paid ? 'Paid' : 'Pending'}`, 'info');
    }
  }

  /**
   * Delete budget line item
   */
  deleteBudgetItem(catId, itemId) {
    const cat = this.currentEvent.budget.categories.find(c => c.id === catId);
    if (!cat) return;
    cat.items = cat.items.filter(i => i.id !== itemId);
    this.saveEvents();
    this.renderBudgetTab();
    this.showToast('Item deleted', 'info');
  }

  /**
   * Re-calculate budget when budget or guest count sliders change
   */
  recalculateBudgetSettings(newBudget, newGuests) {
    const evt = this.currentEvent;
    if (!evt) return;

    evt.targetBudget = Math.max(500, parseFloat(newBudget) || evt.targetBudget);
    evt.guestCount = Math.max(5, parseInt(newGuests) || evt.guestCount);

    // Recompute category baseline targets programmatically
    evt.budget.categories.forEach(cat => {
      cat.estimatedAmount = Math.round((evt.targetBudget * cat.percentage) / 100);
    });

    this.saveEvents();
    this.renderCurrentEvent();
    this.showToast(`Budget adjusted to ${evt.currency}${evt.targetBudget.toLocaleString()} for ${evt.guestCount} guests`, 'success');
  }

  /**
   * Render Tab 3: Checklist & Run Sheet
   */
  renderChecklistTab() {
    const evt = this.currentEvent;
    if (!evt) return;

    // Filter checklist tasks
    let tasks = evt.checklist;
    if (this.checklistFilter === 'pending') {
      tasks = tasks.filter(t => !t.completed);
    } else if (this.checklistFilter === 'completed') {
      tasks = tasks.filter(t => t.completed);
    } else if (this.checklistFilter === 'high') {
      tasks = tasks.filter(t => t.priority === 'high');
    }

    const tasksContainer = document.getElementById('checklist-tasks-container');
    if (tasksContainer) {
      if (tasks.length === 0) {
        tasksContainer.innerHTML = `
          <div class="glass-card" style="text-align: center; padding: 3rem;">
            <p style="color: var(--text-muted); font-size: 1.1rem;">No tasks match the selected filter.</p>
          </div>
        `;
      } else {
        tasksContainer.innerHTML = tasks.map(task => `
          <div class="checklist-task-card ${task.completed ? 'completed' : ''}">
            <div class="custom-checkbox ${task.completed ? 'checked' : ''}" 
                 onclick="app.toggleTaskCompleted('${task.id}')">
              ${task.completed ? '✔' : ''}
            </div>
            <div style="flex: 1;">
              <div class="flex items-center gap-2" style="margin-bottom: 0.25rem;">
                <strong class="task-title" style="font-size: 0.95rem;">${task.title}</strong>
                <span class="badge ${task.priority === 'high' ? 'badge-rose' : task.priority === 'medium' ? 'badge-amber' : 'badge-cyan'}">
                  ${task.priority}
                </span>
                <span class="badge badge-purple" style="font-size: 0.7rem;">${task.milestone}</span>
              </div>
              <p style="font-size: 0.85rem; color: var(--text-muted);">${task.notes || ''}</p>
            </div>
            <div style="text-align: right;">
              <button class="btn-icon btn-danger btn-sm" onclick="app.deleteTask('${task.id}')">🗑️</button>
            </div>
          </div>
        `).join('');
      }
    }

    // Render Event-Day Run Sheet timeline
    const scheduleContainer = document.getElementById('timeline-runsheet-container');
    if (scheduleContainer) {
      scheduleContainer.innerHTML = evt.schedule.map(item => `
        <div class="timeline-event-node">
          <div class="timeline-node-pin"></div>
          <div class="glass-card" style="padding: 1rem 1.25rem;">
            <div class="flex items-center justify-between" style="margin-bottom: 0.35rem;">
              <div class="flex items-center gap-2">
                <span class="badge badge-cyan" style="font-size: 0.85rem; font-weight: 700;">${item.time}</span>
                <strong style="font-size: 1rem;">${item.title}</strong>
              </div>
              <span class="badge badge-purple">${item.category}</span>
            </div>
            <p style="font-size: 0.875rem; color: var(--text-muted);">${item.description}</p>
          </div>
        </div>
      `).join('');
    }
  }

  toggleTaskCompleted(taskId) {
    const task = this.currentEvent.checklist.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      this.saveEvents();
      this.renderChecklistTab();
      this.renderCurrentEvent();
      this.showToast(task.completed ? 'Task completed! 🎉' : 'Task reopened', 'info');
    }
  }

  deleteTask(taskId) {
    this.currentEvent.checklist = this.currentEvent.checklist.filter(t => t.id !== taskId);
    this.saveEvents();
    this.renderChecklistTab();
    this.renderCurrentEvent();
    this.showToast('Task removed', 'info');
  }

  /**
   * Render Tab 4: Vendors
   */
  renderVendorsTab() {
    const evt = this.currentEvent;
    if (!evt) return;

    // Custom Vendors
    const customContainer = document.getElementById('custom-vendors-grid');
    if (customContainer) {
      if (evt.vendors.length === 0) {
        customContainer.innerHTML = `
          <div class="glass-card" style="grid-column: 1 / -1; text-align: center; padding: 3rem;">
            <p style="color: var(--text-muted); font-size: 1.1rem; margin-bottom: 1rem;">No custom vendors added yet.</p>
            <button class="btn btn-primary" onclick="app.openAddVendorModal()">+ Add Your First Vendor</button>
          </div>
        `;
      } else {
        customContainer.innerHTML = evt.vendors.map(v => `
          <div class="custom-vendor-card">
            <div>
              <div class="flex items-center justify-between" style="margin-bottom: 0.5rem;">
                <span class="badge badge-purple">${v.category}</span>
                <span class="badge ${v.status === 'Booked' ? 'badge-emerald' : v.status === 'Deposit Paid' ? 'badge-cyan' : 'badge-amber'}">
                  ${v.status}
                </span>
              </div>
              <h3 style="font-size: 1.15rem; margin-bottom: 0.35rem;">${v.name}</h3>
              <p style="font-size: 0.85rem; color: var(--text-highlight); margin-bottom: 0.75rem;">
                Quote: ${evt.currency}${Number(v.quoteAmount || 0).toLocaleString()}
              </p>
              <div style="font-size: 0.85rem; line-height: 1.6; color: var(--text-muted); margin-bottom: 1rem;">
                <p>👤 Contact: ${v.contactPerson || '—'}</p>
                <p>📞 Phone: ${v.phone || '—'}</p>
                <p>✉️ Email: ${v.email || '—'}</p>
                ${v.notes ? `<p style="margin-top: 0.5rem; color: var(--text-dim); font-style: italic;">"${v.notes}"</p>` : ''}
              </div>
            </div>
            <div class="flex justify-between items-center" style="border-top: 1px solid var(--border-subtle); padding-top: 0.75rem;">
              <span style="font-size: 0.75rem; color: var(--text-dim);">User saved entry</span>
              <button class="btn-icon btn-danger btn-sm" onclick="app.deleteVendor('${v.id}')">🗑️</button>
            </div>
          </div>
        `).join('');
      }
    }
  }

  deleteVendor(vendorId) {
    this.currentEvent.vendors = this.currentEvent.vendors.filter(v => v.id !== vendorId);
    this.saveEvents();
    this.renderVendorsTab();
    this.showToast('Vendor removed from directory', 'info');
  }

  /**
   * Render Advisory Knowledge Base
   */
  renderVendorGuide() {
    const guideContainer = document.getElementById('vendor-advisory-guide-container');
    if (!guideContainer) return;

    guideContainer.innerHTML = VENDOR_ADVISORY_GUIDE.map(item => `
      <div class="vendor-guide-card">
        <div class="flex items-center justify-between" style="margin-bottom: 0.75rem;">
          <div class="flex items-center gap-2">
            <span style="font-size: 1.5rem;">${this.getCategoryIcon(item.icon)}</span>
            <h3 style="font-size: 1.15rem;">${item.category}</h3>
          </div>
          <span class="badge badge-cyan">Rec. Budget: ${item.recommendedPct}</span>
        </div>
        <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
          <strong>Planning Role:</strong> ${item.importance}
        </p>
        <div style="background: rgba(11, 17, 32, 0.5); padding: 1rem; border-radius: var(--radius-sm); border: 1px solid var(--border-subtle); margin-bottom: 0.75rem;">
          <h4 style="font-size: 0.85rem; color: #a78bfa; margin-bottom: 0.5rem;">💡 Key Questions to Ask Vendors:</h4>
          <ul style="font-size: 0.85rem; margin-left: 1.25rem; color: var(--text-muted);">
            ${item.keyQuestions.map(q => `<li style="margin-bottom: 0.25rem;">${q}</li>`).join('')}
          </ul>
        </div>
        <div style="font-size: 0.825rem; color: #fda4af;">
          <strong>⚠ Red Flags:</strong> ${item.redFlags.join(' • ')}
        </div>
      </div>
    `).join('');
  }

  /**
   * Render Tab 5: AI Assistant & Quick Chips
   */
  renderQuickPrompts() {
    const chipsContainer = document.getElementById('chat-quick-chips');
    if (!chipsContainer) return;

    chipsContainer.innerHTML = QUICK_PROMPTS.map(p => `
      <button class="quick-chip" onclick="app.sendChatMessage('${p.prompt.replace(/'/g, "\\'")}')">
        ${p.label}
      </button>
    `).join('');
  }

  initChatWelcome() {
    if (this.chatMessages.length === 0) {
      this.chatMessages.push({
        sender: 'ai',
        text: `### Hello! I am your EventGenie AI Co-Pilot 🧞✨\n\nI am actively assisting you with **${this.currentEvent.title}** (${this.currentEvent.guestCount} guests, ${this.currentEvent.currency}${this.currentEvent.targetBudget} budget).\n\nYou can ask me for budget optimization tricks, signature cocktail recipes, rain contingency planning, timeline adjustments, or click any prompt on the left to get started!`,
        source: aiEngine.mode === 'gemini' ? 'Gemini AI Live' : 'Demo AI Mode (Contextual Domain Engine)'
      });
      this.renderChatScroll();
    }
  }

  async sendChatMessage(customText = null) {
    const input = document.getElementById('chat-input-text');
    const text = customText || (input ? input.value.trim() : '');
    if (!text) return;

    if (input && !customText) input.value = '';

    // Add user message
    this.chatMessages.push({
      sender: 'user',
      text: text
    });
    this.renderChatScroll();

    // Show temporary typing bubble
    const typingMsg = {
      sender: 'ai',
      text: 'Thinking and analyzing event parameters...',
      isTyping: true
    };
    this.chatMessages.push(typingMsg);
    this.renderChatScroll();

    // Query AI engine
    try {
      const response = await aiEngine.chat(text, this.currentEvent, this.chatMessages);
      this.chatMessages = this.chatMessages.filter(m => !m.isTyping);
      this.chatMessages.push({
        sender: 'ai',
        text: response.reply,
        source: response.source
      });
    } catch (err) {
      this.chatMessages = this.chatMessages.filter(m => !m.isTyping);
      this.chatMessages.push({
        sender: 'ai',
        text: 'I encountered a temporary connection issue. However, you can review our Smart Budget and Checklist tabs anytime!',
        source: 'System'
      });
    }

    this.renderChatScroll();
  }

  renderChatScroll() {
    const scrollArea = document.getElementById('chat-messages-container');
    if (!scrollArea) return;

    scrollArea.innerHTML = this.chatMessages.map(m => {
      if (m.sender === 'user') {
        return `
          <div class="chat-bubble chat-bubble-user">
            ${this.escapeHtml(m.text)}
          </div>
        `;
      } else {
        const formatted = this.formatMarkdown(m.text);
        return `
          <div class="chat-bubble chat-bubble-ai">
            ${m.source ? `<div style="font-size: 0.72rem; color: var(--accent-cyan); margin-bottom: 0.5rem; text-transform: uppercase; letter-spacing: 0.05em;">[${m.source}]</div>` : ''}
            <div>${formatted}</div>
          </div>
        `;
      }
    }).join('');

    scrollArea.scrollTop = scrollArea.scrollHeight;
  }

  /**
   * Render Tab 6: Dossier Export
   */
  renderExportTab() {
    const evt = this.currentEvent;
    if (!evt) return;

    document.getElementById('export-title').textContent = evt.title;
    document.getElementById('export-meta').textContent = `${evt.type.toUpperCase()} • ${evt.date} • ${evt.location} • ${evt.guestCount} Guests • Budget: ${evt.currency}${evt.targetBudget.toLocaleString()}`;
    document.getElementById('export-summary').textContent = evt.plan.executiveSummary;
  }

  /**
   * Trigger Browser Print / Save PDF
   */
  printEventDossier() {
    window.print();
  }

  /**
   * Export JSON Backup
   */
  exportEventJson() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.currentEvent, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `${this.currentEvent.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_dossier.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    this.showToast('Event Dossier JSON downloaded', 'success');
  }

  /**
   * Create New Event Wizard Submission
   */
  async handleCreateEventSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = {
      type: form.eventType.value,
      title: form.eventTitle.value.trim() || 'My Celebration',
      hostName: form.hostName.value.trim() || 'Event Host',
      date: form.eventDate.value || '2026-12-01',
      location: form.eventLocation.value.trim() || 'Metropolitan Area',
      guestCount: parseInt(form.guestCount.value) || 100,
      theme: form.eventTheme.value.trim() || 'Modern Elegant',
      targetBudget: parseFloat(form.targetBudget.value) || 10000,
      currency: form.currency.value || '$',
      specialNotes: form.specialNotes.value.trim() || ''
    };

    // Show loading state in modal
    const bodyEl = document.getElementById('new-event-modal-body');
    const footerEl = document.getElementById('new-event-modal-footer');
    bodyEl.innerHTML = `
      <div class="ai-generating-overlay">
        <div class="genie-spinner"></div>
        <h3 style="font-size: 1.35rem; margin-bottom: 0.5rem;">EventGenie AI is Synthesizing Your Master Plan</h3>
        <p style="color: var(--accent-cyan); font-size: 0.95rem; margin-bottom: 1.5rem;" id="ai-loading-step">
          Analyzing scale for ${formData.guestCount} guests & calculating optimal budget allocation...
        </p>
        <div style="font-size: 0.85rem; color: var(--text-dim); max-width: 400px;">
          Curating venues, crafting culinary course blueprints, structuring milestone checklists, and programming hour-by-hour run sheets.
        </div>
      </div>
    `;
    footerEl.classList.add('hidden');

    // Artificial animated steps for delightful UX
    const stepEl = document.getElementById('ai-loading-step');
    setTimeout(() => { if (stepEl) stepEl.textContent = 'Curating venue concepts & color harmony palettes...'; }, 800);
    setTimeout(() => { if (stepEl) stepEl.textContent = 'Generating programmatic category breakdowns & itemized costs...'; }, 1600);

    // Call AI Engine
    setTimeout(async () => {
      const generated = await aiEngine.generateEventPlan(formData);

      const newEvent = {
        id: `event-${Date.now()}`,
        ...formData,
        plan: generated.plan,
        budget: generated.budget,
        checklist: generated.checklist,
        schedule: generated.schedule,
        vendors: generated.vendors || []
      };

      this.events.unshift(newEvent);
      this.currentEvent = newEvent;
      await this.saveEvents();

      // Close modal and reset
      this.closeModal('new-event-modal');
      this.renderEventSelector();
      this.renderCurrentEvent();
      this.switchView('app');
      this.switchTab('overview');
      this.showToast(`✨ Generated master plan for "${newEvent.title}"!`, 'success');
      
      // Reset modal body
      this.resetNewEventModalForm();
    }, 2200);
  }

  resetNewEventModalForm() {
    const bodyEl = document.getElementById('new-event-modal-body');
    const footerEl = document.getElementById('new-event-modal-footer');
    if (footerEl) footerEl.classList.remove('hidden');
    if (bodyEl) {
      bodyEl.innerHTML = `
        <form id="create-event-form" onsubmit="app.handleCreateEventSubmit(event)">
          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Event Type *</label>
              <select name="eventType" required>
                <option value="wedding">💍 Wedding</option>
                <option value="birthday">🎂 Birthday Party</option>
                <option value="college">🎓 College Fest / Gala</option>
                <option value="corporate">💼 Corporate Gala</option>
                <option value="community">🎉 Community Celebration</option>
                <option value="party">✨ Private Party</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Target Date *</label>
              <input type="date" name="eventDate" value="2026-11-20" required />
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Event Name / Title *</label>
            <input type="text" name="eventTitle" placeholder="e.g. Royal Twilight Wedding or Cyber 21st" required />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Host / Organizer Name</label>
              <input type="text" name="hostName" placeholder="e.g. Sarah & David or Student Council" />
            </div>
            <div class="form-group">
              <label class="form-label">City / Location *</label>
              <input type="text" name="eventLocation" placeholder="e.g. Chicago, IL or Downtown Campus" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label">Estimated Guest Count *</label>
              <input type="number" name="guestCount" value="120" min="5" max="5000" required />
            </div>
            <div class="form-group">
              <label class="form-label">Target Total Budget *</label>
              <div class="flex gap-2">
                <select name="currency" style="width: 80px;">
                  <option value="$">$ USD</option>
                  <option value="₹">₹ INR</option>
                  <option value="€">€ EUR</option>
                  <option value="£">£ GBP</option>
                </select>
                <input type="number" name="targetBudget" value="15000" min="500" required />
              </div>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Theme & Vibe Concept *</label>
            <input type="text" name="eventTheme" placeholder="e.g. Enchanted Forest, Neon Retro Synth, Minimalist Chic" required />
          </div>

          <div class="form-group">
            <label class="form-label">Special Constraints, Food Preferences, or Music Vibe</label>
            <textarea name="specialNotes" rows="2" placeholder="e.g. Needs vegan options, acoustic harp for vows, outdoor tent backup..."></textarea>
          </div>
        </form>
      `;
    }
  }

  /**
   * Modal Management
   */
  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.add('active');
  }

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove('active');
  }

  openAddItemModal(catId) {
    document.getElementById('modal-add-item-cat-id').value = catId;
    this.openModal('add-item-modal');
  }

  handleAddItemSubmit(e) {
    e.preventDefault();
    const catId = document.getElementById('modal-add-item-cat-id').value;
    const name = document.getElementById('item-name-input').value.trim();
    const est = parseFloat(document.getElementById('item-est-input').value) || 0;
    const actual = parseFloat(document.getElementById('item-actual-input').value) || est;
    const notes = document.getElementById('item-notes-input').value.trim();

    if (!name) return;

    const cat = this.currentEvent.budget.categories.find(c => c.id === catId);
    if (cat) {
      cat.items.push({
        id: `item-${Date.now()}`,
        name,
        estimated: est,
        actual: actual,
        paid: false,
        notes
      });
      this.saveEvents();
      this.renderBudgetTab();
      this.closeModal('add-item-modal');
      this.showToast(`Added "${name}" to budget`, 'success');
      e.target.reset();
    }
  }

  openAddTaskModal() {
    this.openModal('add-task-modal');
  }

  handleAddTaskSubmit(e) {
    e.preventDefault();
    const title = document.getElementById('task-title-input').value.trim();
    const milestone = document.getElementById('task-milestone-input').value;
    const priority = document.getElementById('task-priority-input').value;
    const deadline = document.getElementById('task-deadline-input').value;
    const notes = document.getElementById('task-notes-input').value.trim();

    if (!title) return;

    this.currentEvent.checklist.push({
      id: `chk-${Date.now()}`,
      title,
      milestone,
      deadline,
      priority,
      completed: false,
      notes
    });

    this.saveEvents();
    this.renderChecklistTab();
    this.renderCurrentEvent();
    this.closeModal('add-task-modal');
    this.showToast('New task added to checklist', 'success');
    e.target.reset();
  }

  openAddVendorModal() {
    this.openModal('add-vendor-modal');
  }

  handleAddVendorSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('vendor-name-input').value.trim();
    const category = document.getElementById('vendor-cat-input').value;
    const contact = document.getElementById('vendor-contact-input').value.trim();
    const phone = document.getElementById('vendor-phone-input').value.trim();
    const email = document.getElementById('vendor-email-input').value.trim();
    const status = document.getElementById('vendor-status-input').value;
    const quote = parseFloat(document.getElementById('vendor-quote-input').value) || 0;
    const notes = document.getElementById('vendor-notes-input').value.trim();

    if (!name) return;

    this.currentEvent.vendors.push({
      id: `v-${Date.now()}`,
      name,
      category,
      contactPerson: contact,
      phone,
      email,
      status,
      quoteAmount: quote,
      notes
    });

    this.saveEvents();
    this.renderVendorsTab();
    this.closeModal('add-vendor-modal');
    this.showToast(`Saved vendor "${name}"`, 'success');
    e.target.reset();
  }

  openApiKeyModal() {
    const existing = localStorage.getItem('eventgenie_custom_api_key') || '';
    const input = document.getElementById('settings-api-key-input');
    if (input) input.value = existing;
    this.openModal('settings-api-key-modal');
  }

  async handleSaveApiKey() {
    const key = document.getElementById('settings-api-key-input').value;
    const res = await aiEngine.setApiKey(key);
    this.updateAiStatusBadge();
    this.closeModal('settings-api-key-modal');
    this.showToast(res.message || 'Settings saved', 'success');
  }

  /**
   * Delete current event
   */
  deleteCurrentEvent() {
    if (this.events.length <= 1) {
      this.showToast('You must have at least one event in your planner.', 'error');
      return;
    }

    if (confirm(`Are you sure you want to delete "${this.currentEvent.title}"?`)) {
      this.events = this.events.filter(e => e.id !== this.currentEvent.id);
      this.currentEvent = this.events[0];
      this.saveEvents();
      this.renderEventSelector();
      this.renderCurrentEvent();
      this.showToast('Event deleted', 'info');
    }
  }

  /**
   * Reset to default rich sample events
   */
  resetToSampleEvents() {
    if (confirm('Reset to the 3 pre-configured demo events (Wedding, Birthday, College Gala)?')) {
      this.events = JSON.parse(JSON.stringify(DEFAULT_EVENTS));
      this.currentEvent = this.events[0];
      this.saveEvents();
      this.renderEventSelector();
      this.renderCurrentEvent();
      this.showToast('Demo sample events restored', 'success');
    }
  }

  /**
   * Toast notification display
   */
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : type === 'error' ? 'toast-error' : ''}`;
    toast.innerHTML = `
      <span>${type === 'success' ? '✅' : type === 'error' ? '⚠️' : 'ℹ️'}</span>
      <span>${this.escapeHtml(message)}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  /**
   * Markdown formatting helper for chat
   */
  formatMarkdown(text) {
    if (!text) return '';
    let html = this.escapeHtml(text);

    // Headers
    html = html.replace(/^### (.*$)/gim, '<h4>$1</h4>');
    html = html.replace(/^## (.*$)/gim, '<h3>$1</h3>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    // Blockquote
    html = html.replace(/^> (.*$)/gim, '<blockquote style="border-left: 3px solid var(--accent-purple); padding-left: 0.75rem; margin: 0.5rem 0; color: #cbd5e1;">$1</blockquote>');
    // Unordered lists
    html = html.replace(/^\s*-\s+(.*$)/gim, '<li>$1</li>');
    html = html.replace(/^\s*\*\s+(.*$)/gim, '<li>$1</li>');
    // Ordered lists
    html = html.replace(/^\s*\d+\.\s+(.*$)/gim, '<li>$1</li>');

    // Paragraph breaks
    html = html.replace(/\n\n/g, '<br><br>');

    return html;
  }

  escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Global event listeners
   */
  bindEvents() {
    // Event dropdown change
    const selector = document.getElementById('event-select-dropdown');
    if (selector) {
      selector.addEventListener('change', (e) => this.selectEvent(e.target.value));
    }

    // Tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => this.switchTab(e.currentTarget.dataset.tab));
    });

    // Checklist filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.checklistFilter = e.currentTarget.dataset.filter;
        this.renderChecklistTab();
      });
    });

    // Chat enter key
    const chatInput = document.getElementById('chat-input-text');
    if (chatInput) {
      chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.sendChatMessage();
        }
      });
    }

    // Modal background close
    document.querySelectorAll('.modal-overlay').forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.classList.remove('active');
        }
      });
    });
  }
}

// Global instance
let app;
window.addEventListener('DOMContentLoaded', () => {
  app = new EventGenieApp();
  window.app = app;
});
window.EventGenieApp = EventGenieApp;
