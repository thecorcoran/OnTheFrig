# OnTheFrig - Weekly Schedule Planner

A responsive, printable weekly schedule planner designed to organize homeschool tasks, chores, and daily routines for multiple children. Build weekly schedules, assign single or recurring tasks across days and time blocks, view historical logs of previous weeks, and print clean landscape sheets for the fridge.

---

## Key Features

### 1. Multi-Child Profile Management
* **Child Tabs:** Easily switch between different children (`[ Child 1 ] [ Child 2 ] [+ Add Child]`).
* **Manage Profiles:** Add, rename, or delete child profiles at any time.
* **Isolated Calendars:** Each child maintains their own independent weekly schedules and history.

### 2. Multi-Day & Recurring Tasks
* **Flexible Day Selector:** Select any combination of days (e.g., Tuesday and Wednesday) using interactive day chips.
* **Quick Presets:** One-click presets for **"Weekdays"** (Mon–Fri), **"Weekends"** (Sat–Sun), **"All Days"**, and **"Clear"**.
* **Recurring Series Management:** Recurring tasks are linked. When deleting a recurring task, choose between deleting a single instance or the entire series.

### 3. Historical Week Logging & Navigation
* **Week-by-Week Navigation:** Browse past, current, and future weeks using `◀ Prev Week`, `Next Week ▶`, or the date picker (automatically normalized to Monday of that week).
* **Historical Logs:** Past weeks remain saved in the log and can be referenced at any time.
* **"Copy Last Week's Schedule":** Quickly populate the current week by copying forward tasks from the previous week with a single click.

### 4. Data Persistence & Device Sharing
* **Automatic Local Storage:** All child profiles, weekly schedules, task states, and autocomplete history persist in the browser (`localStorage`).
* **Backup & Share:**
  * **Export Backup:** Download a `.json` backup file of all child profiles and schedules.
  * **Import Backup:** Restore or share schedules across devices by loading the backup file.

### 5. Print & Mobile Ready
* **Fridge-Ready Landscape Print:** Formatted via `@media print` to fit standard letter paper in landscape mode, hiding all buttons, tabs, and controls.
* **Interactive Checkboxes:** Checkboxes can be ticked directly in the web app or checked off by hand with a pencil once printed.
* **Responsive Design:** Columns and controls adapt cleanly to mobile screens and tablets.

---

## Project Structure

```
OnTheFrig/
├── index.html      # Main web application entry
├── schedule.html   # HTML alias
├── style.css       # Responsive styling, modern UI, and @media print layout
└── script.js       # Core state management, localStorage persistence, and event handling
```

---

## How to Use

1. **Open the App:** Open `index.html` in any web browser.
2. **Select or Add a Child:** Click an existing tab or click `+ Add Child` to set up a new profile.
3. **Navigate the Week:** Use `◀ Prev Week` / `Next Week ▶` or click `Current Week`.
4. **Add Tasks:**
   * Enter the task name (or choose from history suggestions).
   * Choose the time of day (Morning, Lunch, Afternoon, Nighttime).
   * Check "Must be done" if it's high priority.
   * Select one or more days (or use quick presets).
   * Click **"+ Add Task"**.
5. **Copying from Last Week:** When starting a new week, click `📋 Copy Last Week's Schedule` to clone the previous week's tasks.
6. **Print:** Click **"🖨️ Print Schedule"** to generate a clean, one-page printable landscape schedule.

---

## Hosting on the Web

Because OnTheFrig is a pure client-side static web application with no server dependencies:
* **GitHub Pages:** Push this repository to GitHub and enable GitHub Pages in repository settings for a free instant URL.
* **Netlify / Vercel / Cloudflare Pages:** Drag-and-drop this project folder into Netlify Drop or connect your Git repository.
