# OnTheFrig - Weekly Schedule Planner & Early Reader Visual Board

A responsive, printable weekly schedule planner and daily visual routine board designed to organize homeschool tasks, chores, and daily routines for children of all ages — including early readers and preschoolers. Build weekly schedules, assign single or recurring tasks with picture icons, switch between a 7-day landscape master schedule and an interactive early reader picture routine board, hear tasks read aloud, and print clean landscape sheets for the fridge.

---

## Key Features

### 1. 🧸 Early Reader & Visual Icon Support
* **Visual Icons for Every Task:** Non-readers and early readers can look at an icon (like 🪥 Toothbrush, 🦷 Tooth, 🛏️ Bed, 👕 Clothes, 🧼 Wash Hands, 📚 Books, 🍎 Snack) and immediately understand what needs to be done.
* **Smart Auto-Detection:** As you type task names like *"Brush teeth"*, *"Math lesson"*, *"Pack backpack"*, or *"Tidy toys"*, the app automatically detects and selects the corresponding visual icon.
* **Interactive Icon Palette:** Choose from curated early childhood categories (Hygiene, Meals, Learning, Chores, Play, and Rewards) or custom icons.
* **🧸 Early Reader Picture Routine Board:** Switch from the weekly grid to a dedicated picture-card daily routine view featuring extra-large icons, high-contrast checkmarks, and cheerful tactile interaction.
* **🔊 Read Aloud (Text-to-Speech):** Tap the speaker icon (🔊) next to any task in Early Reader Mode to have the browser speak the task aloud for children who are learning to read.

### 2. 📅 Multi-Child Profile Management & 7-Day Grid
* **Child Tabs:** Easily switch between different children (`[ Child 1 ] [ Child 2 ] [+ Add Child]`).
* **Manage Profiles:** Add, rename, or delete child profiles at any time.
* **Isolated Calendars:** Each child maintains their own independent weekly schedules and history.
* **Task Editing & Safe Deletion:** Edit task details, priority, and icons directly without having to delete and re-create. Safe deletion prompts prevent accidental loss of recurring tasks.

### 3. Multi-Day & Recurring Tasks
* **Flexible Day Selector:** Select any combination of days using interactive day chips.
* **Quick Presets:** One-click presets for **"Weekdays"** (Mon–Fri), **"Weekends"** (Sat–Sun), **"All 7 Days"**, and **"Clear Days"**.
* **Recurring Series Management:** When deleting or editing recurring tasks, choose whether to update a single instance or the entire series across the week.

### 4. Historical Week Logging & Navigation
* **Week-by-Week Navigation:** Browse past, current, and future weeks using `◀ Prev Week`, `Next Week ▶`, or the date picker.
* **Historical Logs:** Past weeks remain saved in local storage and can be referenced at any time.
* **"Copy Last Week's Schedule":** Quickly populate the current week by copying forward tasks from the previous week with a single click.

### 5. Data Persistence & Device Sharing
* **Automatic Local Storage:** All child profiles, weekly schedules, task icons, states, and autocomplete history persist in the browser (`localStorage`).
* **Backup & Share:**
  * **Export Backup:** Download a `.json` backup file of all child profiles and schedules.
  * **Import Backup:** Restore or share schedules across devices by loading the backup file.

### 6. Print & Mobile Ready
* **Fridge-Ready Landscape Print:** Formatted via `@media print` to fit standard letter paper in landscape mode, printing both text and early reader icons cleanly.
* **Early Reader Sheet Print:** In Early Reader Mode, print a daily picture card sheet to place on a bedroom door or low on the fridge.
* **Responsive Design:** Adapts smoothly across mobile phones, tablets (iPads), and desktop monitors.

---

## Project Structure

```
OnTheFrig/
├── index.html      # Main web application entry
├── schedule.html   # HTML alias
├── style.css       # Responsive styling, Early Reader UI, and @media print layout
└── script.js       # State management, early reader icons, speech synthesis & persistence
```

---

## How to Use

1. **Open the App:** Open `index.html` in any web browser.
2. **Select or Add a Child:** Click an existing tab or click `+ Add Child` to set up a new profile.
3. **Choose View Mode:**
   * **📅 Weekly Grid:** Complete 7-day master view.
   * **🧸 Early Reader Mode:** Daily picture routine view with large visual cards and audio read-aloud.
4. **Add Tasks with Visual Icons:**
   * Enter the task name (e.g., *"Brush Teeth"*, *"Math lesson"*, *"Tidy bedroom"*).
   * Notice the icon automatically updates to 🪥 or choose any icon from the quick chips / *"More Icons..."* menu.
   * Choose the time of day (Morning, Lunch, Afternoon, Nighttime).
   * Check *"Must be done"* if it's high priority.
   * Select one or more days (or use quick presets).
   * Click **"+ Add Task"**.
5. **Print:** Click **"🖨️ Print Schedule"** to generate a clean, landscape printable sheet for the fridge.

---

## Hosting on the Web

Because OnTheFrig is a pure client-side static web application with no server dependencies:
* **GitHub Pages:** Push this repository to GitHub and enable GitHub Pages in repository settings for a free instant URL.
* **Netlify / Vercel / Cloudflare Pages:** Connect your repository or drag-and-drop the folder for instant deployment.
