document.addEventListener('DOMContentLoaded', function() {
            // --- STATE MANAGEMENT ---
            let tasks = [];
            const taskHistory = new Set();
            const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
            const timeBlocks = ['Morning', 'Lunch', 'Afternoon', 'Nighttime'];

            // --- DOM ELEMENT REFERENCES ---
            const childNameInput = document.getElementById('childName');
            const weekDateInput = document.getElementById('weekDate');
            const taskNameInput = document.getElementById('taskName');
            const dayOfWeekSelect = document.getElementById('dayOfWeek');
            const timeOfDaySelect = document.getElementById('timeOfDay');
            const isMustDoCheckbox = document.getElementById('isMustDo');
            const addTaskBtn = document.getElementById('addTaskBtn');
            const printBtn = document.getElementById('printBtn');
            const scheduleGrid = document.getElementById('schedule-grid-container');
            const taskHistoryDatalist = document.getElementById('taskHistory');
            const displayName = document.getElementById('displayName');
            const displayDate = document.getElementById('displayDate');

            // --- FUNCTIONS ---

            /**
             * Renders the entire weekly schedule based on the current tasks array
             */
            const renderSchedule = () => {
                // Update header
                displayName.textContent = childNameInput.value ? `${childNameInput.value}'s Schedule` : "Child's Schedule";
                displayDate.textContent = weekDateInput.value ? `Week of ${formatDate(weekDateInput.value)}` : "Week of...";

                // Clear existing grid
                scheduleGrid.innerHTML = '';

                // Create a column for each day of the week
                days.forEach(day => {
                    const dayColumn = document.createElement('div');
                    dayColumn.className = 'day-column';
                    
                    const dayHeader = document.createElement('h3');
                    dayHeader.textContent = day;
                    dayColumn.appendChild(dayHeader);

                    // Create blocks for Morning, Lunch, etc. within each day
                    timeBlocks.forEach(block => {
                        const tasksForBlock = tasks.filter(task => task.day === day && task.time === block);

                        if (tasksForBlock.length > 0) {
                            const timeBlockDiv = document.createElement('div');
                            timeBlockDiv.className = 'time-block';
                            
                            const blockHeader = document.createElement('h4');
                            blockHeader.textContent = block;
                            timeBlockDiv.appendChild(blockHeader);

                            const taskList = document.createElement('ul');
                            tasksForBlock.forEach(task => {
                                const taskItem = document.createElement('li');
                                
                                const checkbox = document.createElement('input');
                                checkbox.type = 'checkbox';
                                checkbox.className = 'task-checkbox';

                                const taskNameSpan = document.createElement('span');
                                taskNameSpan.className = 'task-name';
                                
                                // Make text bold if it's a must-do task
                                taskNameSpan.innerHTML = task.mustDo ? `<strong>${task.name}</strong>` : task.name;

                                taskItem.appendChild(checkbox);
                                taskItem.appendChild(taskNameSpan);
                                taskList.appendChild(taskItem);
                            });
                            timeBlockDiv.appendChild(taskList);
                            dayColumn.appendChild(timeBlockDiv);
                        }
                    });
                    
                    scheduleGrid.appendChild(dayColumn);
                });
            };

            /**
             * Adds a new task to the tasks array and re-renders the schedule
             */
            const addTask = () => {
                const name = taskNameInput.value.trim();
                if (!name) {
                    alert('Please enter a task name.');
                    return;
                }

                tasks.push({
                    id: Date.now(),
                    name: name,
                    day: dayOfWeekSelect.value,
                    time: timeOfDaySelect.value,
                    mustDo: isMustDoCheckbox.checked
                });

                // Add to history and update datalist
                if (!taskHistory.has(name)) {
                    taskHistory.add(name);
                    updateTaskHistoryDatalist();
                }

                // Clear inputs
                taskNameInput.value = '';
                isMustDoCheckbox.checked = false;
                
                renderSchedule();
            };

            /**
             * Updates the datalist for task name autocomplete
             */
            const updateTaskHistoryDatalist = () => {
                taskHistoryDatalist.innerHTML = '';
                taskHistory.forEach(task => {
                    const option = document.createElement('option');
                    option.value = task;
                    taskHistoryDatalist.appendChild(option);
                });
            };
            
            /**
             * Formats a date string (YYYY-MM-DD) into a more readable format
             */
            const formatDate = (dateString) => {
                const date = new Date(dateString);
                // Adjust for timezone offset to prevent showing the previous day
                const userTimezoneOffset = date.getTimezoneOffset() * 60000;
                const adjustedDate = new Date(date.getTime() + userTimezoneOffset);
                return adjustedDate.toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                });
            };


            // --- EVENT LISTENERS ---
            addTaskBtn.addEventListener('click', addTask);
            printBtn.addEventListener('click', () => window.print());
            childNameInput.addEventListener('input', renderSchedule);
            weekDateInput.addEventListener('input', renderSchedule);
            
            // Set initial date to today
            weekDateInput.value = new Date().toISOString().split('T')[0];

            // --- INITIAL RENDER ---
            renderSchedule();
        });