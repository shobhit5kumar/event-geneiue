/**
 * EventGenie AI - Dual AI Engine
 * Handles live Google Gemini API calls via secure backend proxy OR
 * runs the rich offline heuristic domain intelligence engine in Demo Mode.
 */

class AIEngine {
  constructor() {
    this.mode = 'demo'; // 'gemini' | 'demo'
    this.apiEndpoint = '/api/ai';
    this.statusChecked = false;
  }

  /**
   * Check system status from backend server
   */
  async checkBackendStatus() {
    try {
      const response = await fetch('/api/status', { method: 'GET' });
      if (response.ok) {
        const data = await response.json();
        this.mode = data.hasGeminiKey ? 'gemini' : 'demo';
        this.statusChecked = true;
        return { connected: true, hasGeminiKey: data.hasGeminiKey, mode: this.mode };
      }
    } catch (e) {
      // Backend not running or static hosting, fallback smoothly to Demo mode
      this.mode = 'demo';
      this.statusChecked = true;
    }
    return { connected: false, hasGeminiKey: false, mode: 'demo' };
  }

  /**
   * Set API key dynamically via settings
   */
  async setApiKey(key) {
    try {
      const response = await fetch('/api/settings/key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key })
      });
      if (response.ok) {
        const data = await response.json();
        this.mode = data.success ? 'gemini' : 'demo';
        return data;
      }
    } catch (e) {
      console.warn('Backend not responding to key update, storing locally');
    }
    if (key && key.trim().length > 10) {
      localStorage.setItem('eventgenie_custom_api_key', key.trim());
      this.mode = 'gemini';
      return { success: true, message: 'Key saved locally in browser session' };
    } else {
      localStorage.removeItem('eventgenie_custom_api_key');
      this.mode = 'demo';
      return { success: true, message: 'Switched to Demo AI Mode' };
    }
  }

  /**
   * Send prompt to AI Assistant (Chat)
   */
  async chat(message, currentEvent = null, history = []) {
    // Check if custom key stored in localStorage
    const localKey = localStorage.getItem('eventgenie_custom_api_key');

    if (this.mode === 'gemini' || localKey) {
      try {
        const response = await fetch(`${this.apiEndpoint}/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message,
            eventContext: currentEvent ? {
              title: currentEvent.title,
              type: currentEvent.type,
              guests: currentEvent.guestCount,
              budget: `${currentEvent.currency}${currentEvent.targetBudget}`,
              theme: currentEvent.theme,
              location: currentEvent.location,
              date: currentEvent.date
            } : null,
            history: history.slice(-6),
            clientKey: localKey || undefined
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.reply) {
            return {
              reply: data.reply,
              source: 'Gemini AI Live',
              isDemo: false
            };
          }
        }
      } catch (err) {
        console.warn('Gemini proxy error, falling back to Domain Heuristic Engine:', err);
      }
    }

    // Heuristic Smart Domain Engine (Demo Mode)
    return {
      reply: this.generateSmartDemoReply(message, currentEvent),
      source: 'Demo AI Mode (Contextual Domain Engine)',
      isDemo: true
    };
  }

  /**
   * Generates a complete tailored event plan
   */
  async generateEventPlan(formData) {
    const localKey = localStorage.getItem('eventgenie_custom_api_key');

    if (this.mode === 'gemini' || localKey) {
      try {
        const response = await fetch(`${this.apiEndpoint}/plan`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            formData,
            clientKey: localKey || undefined
          })
        });

        if (response.ok) {
          const data = await response.json();
          if (data.plan && data.budget) {
            return {
              ...data,
              source: 'Gemini AI Live'
            };
          }
        }
      } catch (err) {
        console.warn('Gemini plan generation error, using Domain Heuristic Engine:', err);
      }
    }

    // High-Fidelity Heuristic Generation
    return this.generateHeuristicPlan(formData);
  }

  /**
   * High-Fidelity Heuristic Plan Generator (Demo Mode)
   * Programmatically computes customized venues, catering, decor, timeline, run-sheet & budget
   */
  generateHeuristicPlan(data) {
    const type = (data.type || 'party').toLowerCase();
    const guests = parseInt(data.guestCount) || 100;
    const budget = parseFloat(data.targetBudget) || 10000;
    const currency = data.currency || '$';
    const theme = data.theme || 'Modern Celebration';
    const location = data.location || 'Local Metro Area';
    const vibe = data.vibe || 'Festive, Memorable, Elegant';
    const notes = data.specialNotes || '';

    // Color palettes based on event type & theme keywords
    const colorPalette = this.selectColorPalette(type, theme);

    // Compute Venues
    const venues = this.suggestVenues(type, guests, budget, currency, location);

    // Compute Decor & Ambience
    const decor = this.suggestDecor(type, theme, vibe);

    // Compute Catering Strategy
    const catering = this.suggestCatering(type, guests, budget, notes);

    // Compute Entertainment
    const entertainment = this.suggestEntertainment(type, theme);

    // Compute Master Checklist
    const checklist = this.generateChecklist(type, data.date);

    // Compute Event-Day Run Sheet
    const schedule = this.generateSchedule(type);

    // Compute Programmatic Budget Allocation (Strict arithmetic)
    const budgetData = this.calculateSmartBudget(type, budget, guests, currency);

    // Initial advisory vendors
    const vendors = this.generateSuggestedVendors(type, location, budgetData);

    const executiveSummary = `A curated, premier ${type} experience celebrating "${data.title || theme}". Engineered for ${guests} guests in ${location} with an immersive ${theme.toLowerCase()} atmosphere, balanced culinary offerings, dynamic entertainment flow, and disciplined budget stewardship.`;

    return {
      plan: {
        executiveSummary,
        colorPalette,
        venues,
        decor,
        catering,
        entertainment
      },
      budget: budgetData,
      checklist,
      schedule,
      vendors,
      source: 'Demo AI Mode (Contextual Domain Engine)'
    };
  }

  /**
   * Strict Programmatic Budget Calculation (Arithmetic guarantee)
   */
  calculateSmartBudget(type, totalBudget, guests, currency) {
    let ratios;

    switch (type) {
      case 'wedding':
        ratios = [
          { id: 'cat-venue', name: 'Venue & Facilities', icon: 'building', pct: 28 },
          { id: 'cat-catering', name: 'Catering & Beverages', icon: 'utensils', pct: 34 },
          { id: 'cat-decor', name: 'Decor, Florals & Lighting', icon: 'sparkles', pct: 15 },
          { id: 'cat-photo', name: 'Photo & Videography', icon: 'camera', pct: 11 },
          { id: 'cat-entertainment', name: 'Music & Entertainment', icon: 'music', pct: 8 },
          { id: 'cat-misc', name: 'Invitations, Favors & Cushion', icon: 'gift', pct: 4 }
        ];
        break;
      case 'birthday':
        ratios = [
          { id: 'cat-venue', name: 'Venue / Space Rental', icon: 'building', pct: 25 },
          { id: 'cat-catering', name: 'Food, Drinks & Cake', icon: 'utensils', pct: 36 },
          { id: 'cat-decor', name: 'Theme Decor & Lighting', icon: 'sparkles', pct: 18 },
          { id: 'cat-entertainment', name: 'DJ, Games & Activities', icon: 'music', pct: 15 },
          { id: 'cat-misc', name: 'Photography & Favors', icon: 'camera', pct: 6 }
        ];
        break;
      case 'college':
        ratios = [
          { id: 'cat-venue', name: 'Campus Facilities & Logistics', icon: 'building', pct: 12 },
          { id: 'cat-catering', name: 'Attendee Meals & Refreshments', icon: 'utensils', pct: 36 },
          { id: 'cat-entertainment', name: 'Concert Stage, AV & Performers', icon: 'music', pct: 30 },
          { id: 'cat-decor', name: 'Stage Branding, Badges & Tents', icon: 'sparkles', pct: 12 },
          { id: 'cat-misc', name: 'Prizes, Trophies & Emergency', icon: 'gift', pct: 10 }
        ];
        break;
      case 'corporate':
        ratios = [
          { id: 'cat-venue', name: 'Conference Hall & AV Tech', icon: 'building', pct: 32 },
          { id: 'cat-catering', name: 'Executive Catering & Coffee', icon: 'utensils', pct: 35 },
          { id: 'cat-decor', name: 'Corporate Signage & Booths', icon: 'sparkles', pct: 13 },
          { id: 'cat-entertainment', name: 'Keynote Speaker & Host', icon: 'music', pct: 12 },
          { id: 'cat-misc', name: 'Collateral, Lanyards & Contingency', icon: 'gift', pct: 8 }
        ];
        break;
      default:
        ratios = [
          { id: 'cat-venue', name: 'Venue & Permits', icon: 'building', pct: 25 },
          { id: 'cat-catering', name: 'Catering & Refreshments', icon: 'utensils', pct: 35 },
          { id: 'cat-decor', name: 'Decor & Ambience', icon: 'sparkles', pct: 18 },
          { id: 'cat-entertainment', name: 'Music & Activities', icon: 'music', pct: 14 },
          { id: 'cat-misc', name: 'Supplies & Contingency', icon: 'gift', pct: 8 }
        ];
    }

    // Normalize ratios to ensure exact 100%
    const totalPct = ratios.reduce((sum, r) => sum + r.pct, 0);
    if (totalPct !== 100) {
      ratios[ratios.length - 1].pct += (100 - totalPct);
    }

    const categories = ratios.map((cat, idx) => {
      const estimatedAmount = Math.round((totalBudget * cat.pct) / 100);
      const items = this.generateSampleCategoryItems(cat.id, estimatedAmount, guests, type, currency);
      return {
        id: cat.id,
        name: cat.name,
        icon: cat.icon,
        percentage: cat.pct,
        estimatedAmount,
        items
      };
    });

    return { categories };
  }

  /**
   * Generate realistic category line items
   */
  generateSampleCategoryItems(catId, catTotal, guests, eventType, currency) {
    const items = [];
    const idPrefix = `item-${Math.floor(Math.random() * 10000)}`;

    if (catId.includes('venue')) {
      const mainRental = Math.round(catTotal * 0.85);
      const fees = catTotal - mainRental;
      items.push({
        id: `${idPrefix}-1`,
        name: `Primary Venue Space Reservation (${guests} capacity)`,
        estimated: mainRental,
        actual: mainRental,
        paid: false,
        notes: 'Covers standard rental window + load-in access'
      });
      if (fees > 0) {
        items.push({
          id: `${idPrefix}-2`,
          name: 'Site Security & Maintenance Deposit',
          estimated: fees,
          actual: fees,
          paid: false,
          notes: 'Refundable security escrow subject to post-event inspection'
        });
      }
    } else if (catId.includes('catering')) {
      const foodEst = Math.round(catTotal * 0.72);
      const bevEst = Math.round(catTotal * 0.20);
      const dessertEst = catTotal - foodEst - bevEst;
      const perHead = Math.round(foodEst / Math.max(1, guests));

      items.push({
        id: `${idPrefix}-1`,
        name: `Food Service (${guests} guests @ ~${currency}${perHead}/person)`,
        estimated: foodEst,
        actual: foodEst,
        paid: false,
        notes: 'Includes buffet/plated setup and basic service staff'
      });
      items.push({
        id: `${idPrefix}-2`,
        name: 'Beverages, Mocktails & Service Ware',
        estimated: bevEst,
        actual: bevEst,
        paid: false,
        notes: 'Assorted beverages, ice, glassware, and station supplies'
      });
      if (dessertEst > 0) {
        items.push({
          id: `${idPrefix}-3`,
          name: 'Cake & Specialty Dessert Station',
          estimated: dessertEst,
          actual: dessertEst,
          paid: false,
          notes: 'Custom centerpiece celebration cake and pastry assortment'
        });
      }
    } else if (catId.includes('decor')) {
      const mainDecor = Math.round(catTotal * 0.55);
      const lighting = Math.round(catTotal * 0.25);
      const photoZone = catTotal - mainDecor - lighting;

      items.push({
        id: `${idPrefix}-1`,
        name: 'Focal Stage / Head Table Backdrop & Florals',
        estimated: mainDecor,
        actual: mainDecor,
        paid: false,
        notes: 'Primary visual centerpiece installation'
      });
      items.push({
        id: `${idPrefix}-2`,
        name: 'Ambient Warm Lighting & Accent Rigging',
        estimated: lighting,
        actual: lighting,
        paid: false,
        notes: 'Uplights, string lights, or mood fixtures'
      });
      if (photoZone > 0) {
        items.push({
          id: `${idPrefix}-3`,
          name: 'Custom Interactive Photo Backdrop & Props',
          estimated: photoZone,
          actual: photoZone,
          paid: false,
          notes: 'Thematic photo wall for guest memories'
        });
      }
    } else if (catId.includes('photo')) {
      const photo = Math.round(catTotal * 0.7);
      const video = catTotal - photo;
      items.push({
        id: `${idPrefix}-1`,
        name: 'Lead Professional Photographer (Event Coverage)',
        estimated: photo,
        actual: photo,
        paid: false,
        notes: 'Captures full gallery of high-res edited digital photos'
      });
      if (video > 0) {
        items.push({
          id: `${idPrefix}-2`,
          name: 'Cinematic Video Highlight Reel',
          estimated: video,
          actual: video,
          paid: false,
          notes: '3-5 min highlight video montage'
        });
      }
    } else if (catId.includes('entertainment')) {
      const music = Math.round(catTotal * 0.75);
      const activities = catTotal - music;
      items.push({
        id: `${idPrefix}-1`,
        name: 'DJ / Live Music Performance & Sound System',
        estimated: music,
        actual: music,
        paid: false,
        notes: 'Professional audio PA system, microphones & MC hosting'
      });
      if (activities > 0) {
        items.push({
          id: `${idPrefix}-2`,
          name: 'Interactive Crowd Games & Special FX',
          estimated: activities,
          actual: activities,
          paid: false,
          notes: 'Confetti, sparkler sendoff, or party hosts'
        });
      }
    } else {
      // Misc / contingency
      const misc1 = Math.round(catTotal * 0.5);
      const reserve = catTotal - misc1;
      items.push({
        id: `${idPrefix}-1`,
        name: 'Invitations, Signage & Custom Favors',
        estimated: misc1,
        actual: misc1,
        paid: false,
        notes: 'Digital/print invitations and guest takeaway gifts'
      });
      items.push({
        id: `${idPrefix}-2`,
        name: 'Emergency Buffer & Overtime Contingency',
        estimated: reserve,
        actual: 0,
        paid: false,
        notes: 'Unassigned safety cushion for unforeseen expenses'
      });
    }

    return items;
  }

  selectColorPalette(type, theme) {
    const t = theme.toLowerCase();
    if (t.includes('cyber') || t.includes('neon') || t.includes('futur')) {
      return [
        { name: 'Cyber Cyan', hex: '#00F0FF' },
        { name: 'Neon Magenta', hex: '#FF007F' },
        { name: 'Electric Violet', hex: '#7928CA' },
        { name: 'Matte Obsidian', hex: '#111827' },
        { name: 'Laser Lime', hex: '#39FF14' }
      ];
    } else if (t.includes('gold') || t.includes('royal') || t.includes('luxury') || type === 'wedding') {
      return [
        { name: 'Deep Royal Navy', hex: '#0F172A' },
        { name: 'Champagne Gold', hex: '#D4AF37' },
        { name: 'Dusty Rose', hex: '#E0A9A5' },
        { name: 'Ivory Frost', hex: '#F8F6F0' },
        { name: 'Eucalyptus Green', hex: '#658C73' }
      ];
    } else if (t.includes('sunset') || t.includes('retro') || t.includes('summer')) {
      return [
        { name: 'Tangerine Coral', hex: '#F97316' },
        { name: 'Golden Amber', hex: '#F59E0B' },
        { name: 'Deep Terracotta', hex: '#C2410C' },
        { name: 'Warm Cream', hex: '#FEF3C7' },
        { name: 'Teal Shadow', hex: '#0D9488' }
      ];
    } else {
      return [
        { name: 'Deep Indigo', hex: '#4338CA' },
        { name: 'Sky Cyan', hex: '#0EA5E9' },
        { name: 'Violet Accent', hex: '#8B5CF6' },
        { name: 'Slate Gray', hex: '#334155' },
        { name: 'Luminous White', hex: '#F8FAFC' }
      ];
    }
  }

  suggestVenues(type, guests, budget, currency, location) {
    const venueBudget = Math.round(budget * 0.28);
    const low = Math.round(venueBudget * 0.8);
    const high = Math.round(venueBudget * 1.15);

    if (type === 'wedding') {
      return [
        {
          name: `${location} Botanical Glasshouse & Lawn`,
          type: 'Indoor / Outdoor Hybrid Garden',
          capacity: `Up to ${Math.round(guests * 1.25)} guests`,
          pros: 'Picturesque natural greenery, floor-to-ceiling glass, excellent sunset photo backdrops',
          cons: 'Outdoor sound volume ordinances apply after 11:00 PM',
          estimatedCost: `${currency}${low.toLocaleString()} - ${currency}${high.toLocaleString()}`
        },
        {
          name: `The Grand Heritage Ballroom at ${location}`,
          type: 'Historic Classical Ballroom',
          capacity: `Up to ${Math.round(guests * 1.4)} guests`,
          pros: 'All-weather climate control, crystal chandeliers, built-in bridal suites',
          cons: 'Requires selection from exclusive approved caterer list',
          estimatedCost: `${currency}${Math.round(low * 1.05).toLocaleString()} - ${currency}${Math.round(high * 1.1).toLocaleString()}`
        }
      ];
    } else if (type === 'birthday') {
      return [
        {
          name: `The Foundry Loft & Rooftop Lounge`,
          type: 'Modern Industrial Loft with Terrace',
          capacity: `Up to ${Math.round(guests * 1.3)} guests`,
          pros: 'Panoramic city skyline views, built-in sound system, vibrant party ambience',
          cons: 'Elevator access only, limited dedicated parking',
          estimatedCost: `${currency}${low.toLocaleString()} - ${currency}${high.toLocaleString()}`
        },
        {
          name: `Neon Oasis Private Event Space`,
          type: 'Boutique Lounge & Bar',
          capacity: `Up to ${Math.round(guests * 1.15)} guests`,
          pros: 'Pre-installed ambient club lighting, fully equipped bar, cozy lounge booths',
          cons: 'Fixed floor plan with limited space for large stage setups',
          estimatedCost: `${currency}${Math.round(low * 0.9).toLocaleString()} - ${currency}${Math.round(high * 0.95).toLocaleString()}`
        }
      ];
    } else {
      return [
        {
          name: `${location} Metro Center & Event Quad`,
          type: 'Multi-purpose Civic & Festival Grounds',
          capacity: `Up to ${Math.round(guests * 1.5)} guests`,
          pros: 'Extensive open space, heavy electrical hookups, scalable zone layouts',
          cons: 'Requires separate rental for staging and portable facilities',
          estimatedCost: `${currency}${low.toLocaleString()} - ${currency}${high.toLocaleString()}`
        }
      ];
    }
  }

  suggestDecor(type, theme, vibe) {
    return {
      concept: `A refined interpretation of "${theme}" emphasizing tactile textures, dynamic ambient lighting, and cohesive color accents.`,
      entrance: `Immersive welcome portal featuring themed signage, custom floor vinyl runners, and welcoming ambient lanterns.`,
      tables: `Thematic table settings with textured linens, low-profile botanical or geometric centerpieces, and warm LED micro-candles.`,
      lighting: `Dual-layer lighting scheme pairing warm perimeter wash fixtures (2700K) with controllable spotlight accents on focal zones.`,
      photobooth: `Customized 8x8 ft dimensional photo backdrop incorporating theme motifs, neon script headline, and curated handheld props.`
    };
  }

  suggestCatering(type, guests, budget, notes) {
    const cateringBudget = Math.round(budget * 0.35);
    const perGuest = Math.round(cateringBudget / Math.max(1, guests));

    return {
      style: type === 'wedding' ? 'Plated multi-course dinner with passed cocktail-hour canapés' : 'Curated gourmet chef stations & small plate grazing bars',
      appetizers: [
        'Artisanal Crostini with Whipped Ricotta & Honey Drizzle',
        'Crispy Herb Polenta Bites with Truffle Aioli',
        'Mini Gourmet Sliders (Beef & Plant-Based Impossible)'
      ],
      mains: [
        'Slow-Roasted Herb Crusted Entrée with Seasonal Root Glaze',
        'Pan-Seared Citrus Fish or Chicken with Wild Herb Infusion',
        'Velvety Wild Mushroom & Butternut Squash Risotto (Vegan/GF)'
      ],
      desserts: [
        'Signature Celebration Cake with layered sponge',
        'Petite Dessert Bar (Macarons, Tartlets & Espresso Shooters)'
      ],
      signatureDrinks: [
        'The Signature Sparkler (Botanical Gin or Elderflower Spritz with citrus twist)',
        'Golden Hour Mule (Bourbon or Spiced Ginger Beer with Fresh Mint)',
        'Berry Bliss Mocktail (Sparkling Blackberry, Thyme & Lime Soda)'
      ],
      perGuestEstimate: perGuest
    };
  }

  suggestEntertainment(type, theme) {
    return {
      musicGenre: type === 'wedding' ? 'Acoustic instrumental prelude transitioning into upbeat pop & funk reception band' : 'Dynamic multi-genre DJ set with live sax/percussion accompaniment',
      highlights: [
        'Curated musical entrance with theatrical spotlight cues',
        'Interactive host-guided celebration moments and audience engagement',
        'High-energy late evening dance floor crescendo with lighting transitions'
      ],
      keyMoments: [
        'Welcome Reception & Cocktail Hour',
        'Official Welcome & Host Remarks',
        'Main Dinner & Toast Segment',
        'Dance Floor Opening & Headline Celebration'
      ]
    };
  }

  generateChecklist(type, targetDate) {
    return [
      {
        id: `chk-gen-1`,
        title: 'Review and confirm primary venue contract with deposit',
        milestone: '6+ Months Out',
        deadline: 'Milestone 1',
        priority: 'high',
        completed: true,
        notes: 'Secured dates and confirmed load-in window'
      },
      {
        id: `chk-gen-2`,
        title: 'Interview & lock in lead caterer and beverage package',
        milestone: '6+ Months Out',
        deadline: 'Milestone 2',
        priority: 'high',
        completed: false,
        notes: 'Requested sample tasting menu'
      },
      {
        id: `chk-gen-3`,
        title: 'Book photographer/videographer and align on shot list',
        milestone: '2-3 Months Out',
        deadline: 'Milestone 3',
        priority: 'medium',
        completed: false,
        notes: 'Include candids and family portraits'
      },
      {
        id: `chk-gen-4`,
        title: 'Finalize theme decor installations, florists, and signage',
        milestone: '2-3 Months Out',
        deadline: 'Milestone 4',
        priority: 'medium',
        completed: false,
        notes: 'Confirm backdrop dimensions'
      },
      {
        id: `chk-gen-5`,
        title: 'Send formal invitations & track RSVP count',
        milestone: '1 Month Out',
        deadline: 'Milestone 5',
        priority: 'high',
        completed: false,
        notes: 'Track dietary restrictions'
      },
      {
        id: `chk-gen-6`,
        title: 'Finalize run-sheet with DJ/MC and test audio setup',
        milestone: '1 Week Out',
        deadline: 'Milestone 6',
        priority: 'high',
        completed: false,
        notes: 'Share playlist and cue points'
      },
      {
        id: `chk-gen-7`,
        title: 'Pack day-of emergency kit and distribute vendor contact list',
        milestone: 'Event Day',
        deadline: 'Event Morning',
        priority: 'high',
        completed: false,
        notes: 'Ensure all key coordinators have mobile numbers'
      }
    ];
  }

  generateSchedule(type) {
    if (type === 'wedding') {
      return [
        { time: '12:00 PM', title: 'Vendor Load-In & Decor Setup', description: 'Florists, lighting techs, and sound engineers arrive.', category: 'Setup', icon: 'truck' },
        { time: '03:00 PM', title: 'Bridal Party & Host Prep', description: 'Hair, makeup, and pre-ceremony photography.', category: 'Prep', icon: 'camera' },
        { time: '04:30 PM', title: 'Guest Arrival & Welcome Music', description: 'Acoustic music plays as guests find their seats.', category: 'Reception', icon: 'users' },
        { time: '05:00 PM', title: 'Ceremony Begins', description: 'Processional, exchange of vows, and celebration recessional.', category: 'Ceremony', icon: 'heart' },
        { time: '05:45 PM', title: 'Cocktail Hour & Passed Bites', description: 'Signature drinks served while portraits are taken.', category: 'Food', icon: 'glass-water' },
        { time: '07:00 PM', title: 'Grand Entry & Dinner Service', description: 'Welcome toasts, plated/buffet dinner, and dessert.', category: 'Dinner', icon: 'utensils' },
        { time: '08:30 PM', title: 'First Dance & Dance Floor Opens', description: 'High-energy celebration music and dancing.', category: 'Party', icon: 'music' },
        { time: '11:00 PM', title: 'Grand Sendoff & Event Conclusion', description: 'Sparklers or celebratory farewell promenade.', category: 'Farewell', icon: 'star' }
      ];
    } else {
      return [
        { time: '04:00 PM', title: 'Venue Access & Equipment Load-In', description: 'Sound checks, lighting installation, and food station setup.', category: 'Setup', icon: 'truck' },
        { time: '06:30 PM', title: 'Doors Open & Welcome Refreshments', description: 'Guests check in, background music, signature drinks served.', category: 'Reception', icon: 'users' },
        { time: '07:30 PM', title: 'Gourmet Food Stations & Grazing Open', description: 'Guests enjoy savory dishes and interactive stations.', category: 'Food', icon: 'utensils' },
        { time: '08:30 PM', title: 'Main Toast, Speeches or Highlight Activity', description: 'Keynote, birthday cake cutting, or awards announcement.', category: 'Highlight', icon: 'sparkles' },
        { time: '09:15 PM', title: 'DJ Set & Dance Floor Ignition', description: 'High tempo party music and interactive entertainment.', category: 'Party', icon: 'music' },
        { time: '11:30 PM', title: 'Last Call & Event Conclusion', description: 'Final songs, farewells, and designated rideshare assistance.', category: 'Wrap-up', icon: 'clock' }
      ];
    }
  }

  generateSuggestedVendors(type, location, budgetData) {
    return [
      {
        id: 'v-sugg-1',
        category: 'Venue',
        name: `Premier Event Space (${location})`,
        contactPerson: 'Venue Events Coordinator',
        phone: '+1 (555) 012-3400',
        email: 'inquiries@premiereventspace.com',
        status: 'Researching',
        quoteAmount: Math.round(budgetData.categories.find(c => c.id.includes('venue'))?.estimatedAmount || 2500),
        notes: 'Inquiry submitted for availability on target date.'
      },
      {
        id: 'v-sugg-2',
        category: 'Catering',
        name: `Artisan Culinary Co.`,
        contactPerson: 'Head Catering Sales Manager',
        phone: '+1 (555) 012-7800',
        email: 'orders@artisanculinaryco.com',
        status: 'Researching',
        quoteAmount: Math.round(budgetData.categories.find(c => c.id.includes('catering'))?.estimatedAmount || 3500),
        notes: 'Requested customized seasonal menu proposal.'
      }
    ];
  }

  /**
   * Smart Demo Chat Knowledge Engine
   */
  generateSmartDemoReply(query, currentEvent) {
    const q = query.toLowerCase();
    const evt = currentEvent || { title: 'Your Event', type: 'celebration', guestCount: 100, currency: '$', targetBudget: 10000 };

    if (q.includes('budget') || q.includes('save') || q.includes('cost') || q.includes('cheap')) {
      return `### 💡 High-Impact Budget Optimization Strategies for "${evt.title}"\n\nHere are 5 proven, practical ways to trim expenses without guests noticing any dip in quality:\n\n1. **Strategic Beverage Architecture:** Instead of a fully open premium spirits bar, offer a curated menu of 2 signature cocktails/mocktails alongside beer and house wine. This typically saves 25% to 35% on alcohol costs while feeling distinctly upscale.\n2. **Repurpose Floral & Decor Elements:** Design ceremony floral arches or entrance arrangements so they can be seamlessly moved during cocktail hour to frame the DJ booth, head table, or photo station.\n3. **Seasonal & Local Catering Swaps:** Ask your caterer for seasonal produce and local proteins. Out-of-season berries or imported seafood can inflate per-plate costs by $15-$25 per guest without adding substantial culinary value.\n4. **Digital + Handcrafted Hybrid Invitations:** Send elegant digital RSVP invitations (via QR code or web portal) and print only a limited batch of keepsake physical invitations for close family and VIPs.\n5. **Off-Peak Hour Negotiations:** If your date is flexible, booking on a Friday evening or Sunday afternoon often unlocks 15% to 20% discounts from premier venues and photographers.`;
    }

    if (q.includes('photo') || q.includes('booth') || q.includes('instagram') || q.includes('picture')) {
      return `### 📸 3 Immersive Photo & Interactive Installation Concepts\n\nFor a **${evt.theme || evt.type}** aesthetic, here are 3 visual setups that drive guest engagement:\n\n1. **The Living Neon Gallery:** Combine lush layered greenery (monstera, ruscus, or faux boxwood) with a custom warm-white or cyber-cyan LED neon sign featuring your event hashtag or motto. Accent with brass lanterns or acrylic pedestal plinths.\n2. **360-Degree Video Motion Platform:** Rather than standard printed photo strips, rent a slow-motion rotating video arm with branded animated video overlays. Guests receive instantaneous AirDrop/SMS clips ready to post on TikTok or Instagram.\n3. **Interactive Polaroid Memory Station:** Provide 3 vintage-style instant cameras with metallic Sharpies, washi tape, and a reclaimed wood or copper grid frame where guests pin their photos alongside personal handwritten notes.`;
    }

    if (q.includes('rsvp') || q.includes('message') || q.includes('invite') || q.includes('reminder')) {
      return `### 💌 Courteous & Effective RSVP Reminder Templates\n\n**Option 1: Friendly & Warm (Ideal for WhatsApp / Text):**\n> "Hi [Guest Name]! ✨ We're putting the finishing touches on the menu and seating plan for **${evt.title}** on [Date]. We'd absolutely love to celebrate with you! Could you kindly confirm your RSVP by this Friday at [Link]? Let us know if you have any dietary needs. Looking forward to seeing you!"\n\n**Option 2: Formal Email Reminder:**\n> "Dear [Guest Name],\n\nAs we finalize numbers with our culinary team for **${evt.title}**, we wanted to gently check in regarding your attendance. Kindly visit our portal at [Link] to confirm your RSVP before [Date]. If you have any special requirements, please reply to this note.\n\nWarm regards,\n${evt.hostName || 'The Host Team'}"`;
    }

    if (q.includes('drink') || q.includes('cocktail') || q.includes('mocktail') || q.includes('bar')) {
      return `### 🍸 Signature Beverage Program for "${evt.theme || evt.title}"\n\n1. **Cocktail 1: "The Grand Celebration"**\n   - *Base:* London Dry Gin or Silver Tequila\n   - *Mixers:* St. Germain Elderflower, Fresh Grapefruit Juice, Lime, topped with Prosecco\n   - *Garnish:* Dehydrated blood orange wheel and fresh rosemary sprig\n\n2. **Cocktail 2: "Velvet Twilight"**\n   - *Base:* Aged Bourbon or Dark Spiced Rum\n   - *Mixers:* Blackberry syrup, Angostura bitters, splash of ginger beer\n   - *Garnish:* Blackberries on a gold skewer with fresh mint\n\n3. **Zero-Proof Mocktail: "The Sparkling Botanical"**\n   - *Ingredients:* Crushed cucumber, lavender honey syrup, fresh lemon juice, sparkling mineral water\n   - *Garnish:* Cucumber ribbon and edible violet petals`;
    }

    if (q.includes('rain') || q.includes('weather') || q.includes('contingency') || q.includes('outdoor')) {
      return `### 🌧️ Rain & Weather Contingency Action Plan\n\n1. **The 72-Hour Decision Rule:** Establish a firm deadline 72 hours before the event with your venue manager and tent rental supplier to trigger "Plan B" without incurring emergency rush fees.\n2. **Clear Tent vs Solid Marquee:** If rain is likely, opt for a clear-top marquee. It preserves natural light and the outdoor feeling while providing 100% water protection.\n3. **Sidewall & Drainage Inspection:** Ensure sidewalls have weighted ground anchors. Verify that water runoff slopes away from guest arrival pathways and dance floors.\n4. **Comfort Amenities Station:** Position a tasteful umbrella stand with 30 uniform transparent golf umbrellas at the entrance, accompanied by a basket of rolled fleece pashminas if temperatures drop.`;
    }

    if (q.includes('schedule') || q.includes('timeline') || q.includes('time') || q.includes('rush')) {
      return `### ⏱️ Schedule Analysis & Flow Recommendations\n\nLooking at a typical timeline for **${evt.guestCount} guests**:\n\n- **Cocktail Hour Buffer:** Always allocate a generous 60-75 minutes for cocktail hour. This gives you ample cushion if the ceremony or arrival runs 15 minutes late without pushing back hot food service.\n- **Dinner Transition Timing:** Guests take approximately 15-20 minutes to find their assigned tables and take seats. Announce the invitation to be seated 15 minutes before plates are served.\n- **Toasts & Speeches:** Cap individual toasts at 3 to 4 minutes maximum. Schedule toasts during dinner service (between salad and main course) when guests are already comfortably seated with drinks in hand.`;
    }

    // Default intelligent assistant response
    return `### EventGenie AI Advisory for "${evt.title}"\n\nThank you for asking about **${query}**! As your event planning co-pilot, here are key insights tailored to your **${evt.type}** with **${evt.guestCount} guests** and a **${evt.currency}${evt.targetBudget}** budget:\n\n- **Guest Flow & Spacing:** For ${evt.guestCount} guests, plan for at least 15-18 sq ft per seated guest, or 10-12 sq ft for a standing cocktail reception to prevent congestion.\n- **Vendor Synergy:** Ensure your caterer, DJ/MC, and photographer are synchronized on the master run-sheet. The photographer must know when speeches and cake cuttings happen at least 10 minutes in advance to set lighting.\n- **Budget Stewardship:** Remember our category estimates are benchmark guidelines. Feel free to use the **Smart Budget Planner** tab to tweak line items, toggle actual paid expenses, and track your remaining balance in real time!\n\nWould you like me to draft an announcement, suggest specific vendor interview questions, or brainstorm customized theme decor for this?`;
  }
}

// Export singleton instance
const aiEngine = new AIEngine();
