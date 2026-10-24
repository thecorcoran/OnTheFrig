# On The Frig - Weekly Schedule Planner & Daily Visual Board

A responsive, printable weekly schedule planner and daily visual routine board designed to organize tasks, chores, and routines for the whole family — from preschoolers and early readers to teens and parents. Build weekly schedules, assign single or recurring tasks with visual icons, switch between a 7-day landscape master schedule and an interactive picture routine daily view, hear tasks read aloud, print clean landscape sheets for the fridge, and use the app completely offline.

---

## Key Features

### 1. 👨‍👩‍👧‍👦 Family-Wide Profiles & Multi-Member Assignment
* **Family Member Tabs:** Easily switch between different family members (`[ Member 1 ] [ Member 2 ] [+ Add Family Member]`).
* **Manage Profiles:** Add, rename, or delete member profiles at any time.
* **Whole-Family Assignment:** Assign any task to an individual or to everyone simultaneously with one click.
* **Isolated Calendars:** Each member maintains their own independent weekly schedules and history.

### 2. 📅 7-Day Weekly Grid & Reusable General Schedules
* **Dated or General (Reusable) Modes:** Toggle between:
  * **📅 Specific Dates:** Fills in numerical calendar dates under each day of the week (e.g. *Oct 24*, *10/24*).
  * **🔄 General Schedule:** Day names only without dates, perfect for printing a reusable fridge routine or chore chart to laminate.
* **Direct Schedule Switcher:** Toggle between **📅 Weekly Grid** and **📋 Daily View** directly above the schedule.
* **Task Editing & Safe Deletion:** Edit task details, priority, and icons directly. Safe deletion prompts prevent accidental loss of recurring tasks.

### 3. 📋 Daily View with Visual Routine Cards
* **Visual Icons for Every Task:** Quick visual comprehension for early readers or quick glance scanning for adults (🪥 Hygiene, 🥪 Meals, 📚 School/Work, 🧹 Chores, ⚽ Activities, 🌙 Routines).
* **Smart Auto-Detection:** Automatically detects and picks icons as you type task names (*"Brush teeth"*, *"Math lesson"*, *"Work meeting"*, *"Laundry"*).
* **🔊 Read Aloud (Text-to-Speech):** Tap the speaker icon (🔊) next to any task in Daily View to hear it spoken aloud.
* **Interactive Completion Checkmarks:** Tap cards or checkmarks to mark tasks complete in real-time.

### 4. 🖨️ Fridge-Ready Printing & Print Status Tracking
* **Print Status Indicator:** Clear indicator shows when the calendar was last sent to the printer (e.g., *"Last printed: Oct 24 at 9:15 AM"*).
* **Landscape Fridge Print:** Optimized with clean print stylesheets (`@media print`) for standard letter paper in landscape mode.
* **Daily Card Print:** Print a daily card checklist to stick on a bedroom door or fridge.

### 5. 📱 Responsive & Mobile-Optimized
* Built for desktop monitors, laptops, iPads/tablets, and mobile phones.
* Touch-friendly day selection chips, streamlined "+ Add Task" button placement, and flexible single/multi-column grid layouts.

### 6. 📴 Offline Usage & Progressive Web App (PWA)
On The Frig is designed to work anywhere, anytime without requiring internet:
1. **PWA Installation:** Install it directly onto your phone, tablet, or desktop via the browser's "Install App" button or "Add to Home Screen".
2. **Built-in Service Worker:** Assets are cached locally via `sw.js`. The app loads and functions seamlessly even in Airplane Mode or without Wi-Fi.
3. **Local-First Data:** All profiles, schedules, and preferences are stored in the browser (`localStorage`). No server or login needed.
4. **Standalone Local File:** You can also download or clone the repository and double-click `index.html` in any browser to use it completely offline!
5. **Backup & Share:** Download a `.json` backup file or import one on any device to transfer schedules.

---

## Project Structure

```
OnTheFrig/
├── index.html       # Main web application entry
├── schedule.html    # Web application mirror
├── style.css        # Responsive layout, print rules, and theme styles
├── script.js        # State, scheduling, speech synthesis & PWA logic
├── sw.js            # Service worker for offline caching
├── manifest.json    # Web App Manifest for PWA installation
├── icon-192.png     # PWA app icon (192x192)
├── icon-512.png     # PWA app icon (512x512)
└── README.md        # Documentation
```

---

## How to Use

1. **Open the App:** Open `index.html` in your web browser (or install as a PWA).
2. **Select or Add a Family Member:** Click a tab or click `+ Add Family Member`.
3. **Add Tasks:**
   * Enter the task name.
   * Select one or more days directly underneath (or click `Weekdays`, `Weekends`, or `All 7 Days`).
   * Select Time of Day (Morning, Lunch, Afternoon, Nighttime).
   * Check *"Must be done (High Priority ⭐)"* if needed, then click **"+ Add Task"** directly beside it.
4. **Toggle View:**
   * **📅 Weekly Grid:** 7-day overview.
   * **📋 Daily View:** Daily routine picture cards with audio read-aloud.
5. **Choose Calendar Date Mode:**
   * Select **📅 Specific Dates** to see exact numerical dates under each day.
   * Select **🔄 General (No Dates)** for a timeless reusable schedule.
6. **Print:** Click **"🖨️ Print Schedule"** to print a landscape page for the fridge. A confirmation badge will display your last print timestamp.

---

## Hosting on the Web

Because On The Frig is a client-side static web application with no server dependencies:
* **GitHub Pages:** Push to GitHub and enable GitHub Pages in repository settings for a free public URL.
* **Netlify / Vercel / Cloudflare Pages:** Connect the repo for automatic instant deployment.
