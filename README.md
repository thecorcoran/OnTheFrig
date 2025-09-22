# OnTheFrig - Weekly Schedule Planner

A simple, printable weekly schedule planner designed to help organize tasks for children. This web-based tool allows a user to dynamically build a weekly schedule, assign tasks to specific days and times, and then print a clean, easy-to-read version to post on the fridge (or anywhere else!).

## Features

- **Dynamic Schedule Grid:** The schedule is visually organized into columns for each day of the week.
- **Customizable Headers:** Set a custom name and week date for the schedule.
- **Task Management:**
    - Add tasks to specific days (Monday-Sunday).
    - Assign tasks to time blocks (Morning, Lunch, Afternoon, Nighttime).
    - Mark tasks as "Must-Do," which makes them appear bold for emphasis.
- **Task History:** The application remembers previously entered task names to make re-entry faster.
- **Print-Friendly:** A dedicated print button generates a clean, landscape-oriented version of the schedule, hiding all the input controls.
- **Real-time Updates:** The schedule display updates instantly as you add tasks or change the header information.

## How to Use

1.  Open the `index.html` file in any modern web browser.
2.  **(Optional)** Enter the child's name and select the starting date for the week.
3.  In the "Add a Task" section:
    -   Enter the name of the task.
    -   Select the day of the week.
    -   Select the time of day.
    -   Check the "Must-Do?" box if it's a high-priority task.
4.  Click the **"Add Task"** button. The task will appear on the schedule grid below.
5.  Repeat for all desired tasks.
6.  When you are finished, click the **"Print Schedule"** button to open your browser's print dialog.

## Project Structure

```
OnTheFrig/
├── index.html      # The main HTML file with the page structure.
├── style.css       # All styles for the application, including print-specific styles.
└── script.js       # All JavaScript logic for state management, DOM manipulation, and event handling.
```

## Technical Details

- **Frontend:** Built with plain HTML, CSS, and vanilla JavaScript.
- **State Management:** A simple `tasks` array in `script.js` holds the state of the schedule. The `renderSchedule()` function is called whenever the state changes to re-draw the UI.
- **Styling:**
    -   Uses CSS Grid Layout for both the input controls and the main schedule grid, providing a responsive and clean layout.
    -   Includes a `@media print` query to heavily modify the styles for a clean, paper-friendly output.

## Future Improvements

-   Allow tasks to be edited or deleted directly from the grid.
-   Persist the schedule data in the browser's `localStorage` so it isn't lost on page refresh.
-   Add the ability to re-order tasks within a time block.

---

*This project was created as a simple, client-side tool with no external dependencies.*