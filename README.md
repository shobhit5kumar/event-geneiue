# 🧞 EventGenie AI — Intelligent Event Planning & Financial Co-Pilot

**EventGenie AI** is a complete, responsive, full-stack event planning web application engineered for organizing weddings, birthday milestones, college tech fests, corporate conferences, and community celebrations.

It marries **generative AI planning** with **strict deterministic financial arithmetic**, milestone checklist tracking, hour-by-hour event-day run sheets, advisory vendor inspection guides, and a conversational event co-pilot.

---

## 🌟 Key Features

### 1. 🧠 AI Event Plan Synthesis
- **Dynamic Plan Generation:** Personalizes every event based on event type, guest count, location, target budget, date, and theme.
- **Curated Venue Ideas:** Detailed capacity analysis, pros, cons, and estimated budget range.
- **Decor, Ambience & Lighting:** Cohesive theme concepts, entrance styling, table arrangements, lighting schemes, and interactive photo booth designs.
- **Catering & Beverage Strategy:** Multi-course menus, dietary accommodations (Vegan/GF), signature cocktails and zero-proof mocktails with per-guest cost benchmarks.
- **Entertainment Flow:** Music styles, live band/DJ cues, and crowd engagement highlights.

### 2. 💰 Smart Budget Planner (Strict Deterministic Arithmetic)
- **Programmatic Precision:** Calculates category totals, remaining balances, and expense percentages using pure programmatic math—never hallucinating arithmetic sums.
- **Real-Time Sliders:** Adjust guest count and target budget to dynamically re-baseline category allocations.
- **Itemized Expense Tracker:** Add, edit, remove, and toggle "Paid" escrow status for line items.
- **Budget Health Gauge:** Dynamic progress bar showing allocated vs. spent vs. remaining cushion with over-budget alerts.
- **Advisory Disclaimers:** Explicitly marked as estimates, not binding quotes.

### 3. 📋 Milestone Checklist & Master Run Sheet
- **Phased Milestones:** Organized into *6+ Months Out*, *2-3 Months Out*, *1 Month Out*, *1 Week Out*, and *Event Day*.
- **Interactive Checklists:** Mark tasks complete, filter by status or critical priority, and view live completion progress gauges.
- **Event-Day Master Schedule:** Chronological hour-by-hour operational run sheet from vendor load-in to midnight sendoff.

### 4. 🏢 Vendor Hub & Custom Directory
- **Advisory Negotiation Guide:** Category breakdown (Venue, Catering, Decor, Photography, Entertainment) with *Key Questions to Ask* and *Red Flags to Watch Out For*.
- **Personal Vendor Directory:** Add and manage confirmed vendors, contact persons, phone numbers, quotes, and contract notes.
- **Clear Disclaimer:** Explicitly notes suggestions are planning categories, not endorsed vendor listings.

### 5. 💬 Conversational AI Co-Pilot (Dual-Engine)
- **Gemini Live AI:** Connects to Google Gemini models securely via a server-side proxy when `GEMINI_API_KEY` is provided. API keys are never exposed in frontend code.
- **Offline Contextual Domain Engine (Demo Mode):** Fully functional offline heuristic AI engine pre-loaded with event planning intelligence. Clearly labelled with a status badge.
- **Quick-Prompt Chips:** One-click prompts for budget-saving hacks, photo booth ideas, polite RSVP reminders, signature drink recipes, and rain contingency plans.

### 6. 💾 Save & Manage Events (Full CRUD)
- **Pre-Loaded Sample Events:**
  1. *Royal Botanical Garden Wedding* (200 guests, $35,000 budget)
  2. *Cyberpunk Neon 21st Birthday* (80 guests, $6,500 budget)
  3. *TechNova College Tech Fest & Gala* (500 guests, $15,000 budget)
- **Dossier Export & Print:** Print-ready formatting for PDF export, and one-click JSON backup export/import.

---

## 🏗️ Technical Stack & Architecture

- **Frontend:** HTML5, Modern Vanilla CSS3 (Custom design system, glassmorphism, responsive grid/flexbox, print styles), Vanilla ES6+ JavaScript modules.
- **Backend:** Python 3.14 Standard Library HTTP Server with REST endpoints (Zero third-party pip dependencies required).
- **Data Persistence:** Local JSON data store (`data/events.json`) with synchronized browser `localStorage` fallback.
- **Security:** Secure server-side environment variable handling for AI keys.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Python 3.10+ (Python 3.14 is installed and verified on this system).
- Modern web browser (Chrome, Edge, Firefox, Safari).

### 2. Start the Local Server
Open a terminal in the project directory and run:
```bash
python server.py
```

### 3. Open the Application
Navigate in your browser to:
```
http://localhost:3000
```

### 4. (Optional) Configure Gemini API Key
To connect live Gemini AI:
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. Edit `.env` and set your key:
   ```env
   GEMINI_API_KEY=your_actual_key_here
   ```
3. Alternatively, click the **⚙️ Settings** button in the web application navigation bar to set the key directly for your session.
4. If no key is set, the application operates in **Demo AI Mode** with 100% feature availability!

---

## 🧪 Testing User Flows

1. **Explore Existing Events:** Use the event selector in the top bar to switch between the *Wedding*, *Birthday*, and *College Gala* plans.
2. **Create a Plan:** Click **✨ New Event Plan**, fill in the event form, and click **Synthesize AI Plan** to watch the animated generation workflow.
3. **Edit Budget:** Open the **Smart Budget Planner** tab, adjust the budget slider, toggle line item payment status, and add new expenses.
4. **Complete Tasks:** Open the **Checklist** tab, mark items complete, and watch the completion percentage update.
5. **Chat with AI:** Open the **EventGenie Assistant** tab and click any quick-prompt chip (e.g., *"💡 Budget Optimization"*).
6. **Export Dossier:** Switch to the **Export & Dossier** tab and click **🖨️ Print / Save as PDF**.
