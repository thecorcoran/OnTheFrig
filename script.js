document.addEventListener('DOMContentLoaded', function() {
    // --- CONSTANTS & CONFIG ---
    const STORAGE_KEY = 'onthefrig_schedule_data_v2';
    const OLD_STORAGE_KEY = 'onthefrig_schedule_data';
    const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const TIME_BLOCKS = ['Morning', 'Lunch', 'Afternoon', 'Nighttime'];

    // --- APPLICATION STATE ---
    let state = {
        version: 2,
        activeChildId: 'child_1',
        children: [
            { id: 'child_1', name: "Child" }
        ],
        selectedWeek: '', // YYYY-MM-DD (snapped to Monday)
        schedules: {
            // "child_1": { "2026-08-31": [ ...tasks ] }
        },
        taskHistory: []
    };

    // --- DOM REFERENCES ---
    const childTabsContainer = document.getElementById('childTabsContainer');
    const addChildBtn = document.getElementById('addChildBtn');
    const renameChildBtn = document.getElementById('renameChildBtn');
    const deleteChildBtn = document.getElementById('deleteChildBtn');

    const prevWeekBtn = document.getElementById('prevWeekBtn');
    const nextWeekBtn = document.getElementById('nextWeekBtn');
    const currentWeekBtn = document.getElementById('currentWeekBtn');
    const weekDateInput = document.getElementById('weekDate');
    const copyPrevWeekBtn = document.getElementById('copyPrevWeekBtn');
    const clearWeekBtn = document.getElementById('clearWeekBtn');

    const taskNameInput = document.getElementById('taskName');
    const timeOfDaySelect = document.getElementById('timeOfDay');
    const isMustDoCheckbox = document.getElementById('isMustDo');
    const dayChipsContainer = document.getElementById('dayChipsContainer');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskHistoryDatalist = document.getElementById('taskHistory');

    const presetWeekdaysBtn = document.getElementById('presetWeekdays');
    const presetWeekendsBtn = document.getElementById('presetWeekends');
    const presetEverydayBtn = document.getElementById('presetEveryday');
    const presetClearDaysBtn = document.getElementById('presetClearDays');

    const displayName = document.getElementById('displayName');
    const displayDate = document.getElementById('displayDate');
    const scheduleGrid = document.getElementById('schedule-grid-container');
    const printBtn = document.getElementById('printBtn');

    const exportDataBtn = document.getElementById('exportDataBtn');
    const importFileInput = document.getElementById('importFileInput');

    // --- DATE HELPERS ---
    function getMondayIsoString(dateInput) {
        let d;
        if (typeof dateInput === 'string' && dateInput.includes('-')) {
            const parts = dateInput.split('-');
            d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        } else {
            d = new Date(dateInput || new Date());
        }
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday is start
        const monday = new Date(d.setDate(diff));
        const y = monday.getFullYear();
        const m = String(monday.getMonth() + 1).padStart(2, '0');
        const dayNum = String(monday.getDate()).padStart(2, '0');
        return `${y}-${m}-${dayNum}`;
    }

    function addWeeksToIsoDate(isoDate, weeks) {
        const parts = isoDate.split('-');
        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        d.setDate(d.getDate() + (weeks * 7));
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const dayNum = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${dayNum}`;
    }

    function formatDate(dateString) {
        if (!dateString) return 'Week of...';
        const parts = dateString.split('-');
        if (parts.length !== 3) return dateString;
        const date = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        return date.toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    }

    // --- STORAGE & MIGRATION ---
    const loadState = () => {
        try {
            const rawV2 = localStorage.getItem(STORAGE_KEY);
            if (rawV2) {
                const parsed = JSON.parse(rawV2);
                state = {
                    version: 2,
                    activeChildId: parsed.activeChildId || 'child_1',
                    children: Array.isArray(parsed.children) && parsed.children.length > 0
                        ? parsed.children
                        : [{ id: 'child_1', name: 'Child' }],
                    selectedWeek: parsed.selectedWeek || getMondayIsoString(new Date()),
                    schedules: (typeof parsed.schedules === 'object' && parsed.schedules !== null) ? parsed.schedules : {},
                    taskHistory: Array.isArray(parsed.taskHistory) ? parsed.taskHistory : []
                };
                return;
            }

            // Check for v1 migration
            const rawV1 = localStorage.getItem(OLD_STORAGE_KEY);
            if (rawV1) {
                const parsedV1 = JSON.parse(rawV1);
                const childId = 'child_1';
                const childName = (parsedV1.childName && parsedV1.childName.trim()) || 'Child';
                const weekDate = parsedV1.weekDate ? getMondayIsoString(parsedV1.weekDate) : getMondayIsoString(new Date());

                state = {
                    version: 2,
                    activeChildId: childId,
                    children: [{ id: childId, name: childName }],
                    selectedWeek: weekDate,
                    schedules: {
                        [childId]: {
                            [weekDate]: Array.isArray(parsedV1.tasks) ? parsedV1.tasks : []
                        }
                    },
                    taskHistory: Array.isArray(parsedV1.taskHistory) ? parsedV1.taskHistory : []
                };
                saveState();
                return;
            }
        } catch (e) {
            console.error('Error loading state from localStorage:', e);
        }

        // Fresh state fallback
        state.selectedWeek = getMondayIsoString(new Date());
    };

    const saveState = () => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.error('Error saving state to localStorage:', e);
        }
    };

    // --- STATE ACCESSORS ---
    function getActiveChild() {
        return state.children.find(c => c.id === state.activeChildId) || state.children[0];
    }

    function getCurrentWeekTasks() {
        if (!state.schedules[state.activeChildId]) {
            state.schedules[state.activeChildId] = {};
        }
        if (!state.schedules[state.activeChildId][state.selectedWeek]) {
            state.schedules[state.activeChildId][state.selectedWeek] = [];
        }
        return state.schedules[state.activeChildId][state.selectedWeek];
    }

    function setCurrentWeekTasks(tasks) {
        if (!state.schedules[state.activeChildId]) {
            state.schedules[state.activeChildId] = {};
        }
        state.schedules[state.activeChildId][state.selectedWeek] = tasks;
        saveState();
    }

    // --- RENDERING ---
    function renderChildTabs() {
        childTabsContainer.innerHTML = '';
        state.children.forEach(child => {
            const tabBtn = document.createElement('button');
            tabBtn.type = 'button';
            tabBtn.className = `child-tab ${child.id === state.activeChildId ? 'active' : ''}`;
            tabBtn.textContent = child.name;
            tabBtn.addEventListener('click', () => {
                state.activeChildId = child.id;
                saveState();
                renderAll();
            });
            childTabsContainer.appendChild(tabBtn);
        });
    }

    function updateTaskHistoryDatalist() {
        taskHistoryDatalist.innerHTML = '';
        state.taskHistory.forEach(taskName => {
            const option = document.createElement('option');
            option.value = taskName;
            taskHistoryDatalist.appendChild(option);
        });
    }

    function renderSchedule() {
        const activeChild = getActiveChild();
        const currentTasks = getCurrentWeekTasks();

        // Update Headers
        displayName.textContent = activeChild.name ? `${activeChild.name}'s Schedule` : "Child's Schedule";
        displayDate.textContent = `Week of ${formatDate(state.selectedWeek)}`;
        weekDateInput.value = state.selectedWeek;

        // Clear grid
        scheduleGrid.innerHTML = '';

        // Render Day Columns
        DAYS.forEach(day => {
            const dayColumn = document.createElement('div');
            dayColumn.className = 'day-column';
            
            const dayHeader = document.createElement('h3');
            dayHeader.textContent = day;
            dayColumn.appendChild(dayHeader);

            let dayHasTasks = false;

            // Render Time Blocks
            TIME_BLOCKS.forEach(block => {
                const tasksForBlock = currentTasks.filter(t => t.day === day && t.time === block);

                if (tasksForBlock.length > 0) {
                    dayHasTasks = true;
                    const timeBlockDiv = document.createElement('div');
                    timeBlockDiv.className = 'time-block';
                    
                    const blockHeader = document.createElement('h4');
                    blockHeader.textContent = block;
                    timeBlockDiv.appendChild(blockHeader);

                    const taskList = document.createElement('ul');

                    tasksForBlock.forEach(task => {
                        const taskItem = document.createElement('li');
                        if (task.completed) {
                            taskItem.classList.add('completed');
                        }

                        // Checkbox
                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.className = 'task-checkbox';
                        checkbox.checked = !!task.completed;
                        checkbox.title = 'Mark task completed';
                        checkbox.addEventListener('change', () => toggleTaskCompleted(task.id));

                        // Task text (sanitized)
                        const taskNameSpan = document.createElement('span');
                        taskNameSpan.className = 'task-name';
                        if (task.mustDo) {
                            const strong = document.createElement('strong');
                            strong.textContent = task.name;
                            taskNameSpan.appendChild(strong);
                        } else {
                            taskNameSpan.textContent = task.name;
                        }

                        // Delete button
                        const deleteBtn = document.createElement('button');
                        deleteBtn.type = 'button';
                        deleteBtn.className = 'delete-task-btn no-print';
                        deleteBtn.textContent = '✕';
                        deleteBtn.title = 'Delete task';
                        deleteBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            deleteTask(task.id);
                        });

                        taskItem.appendChild(checkbox);
                        taskItem.appendChild(taskNameSpan);
                        taskItem.appendChild(deleteBtn);
                        taskList.appendChild(taskItem);
                    });

                    timeBlockDiv.appendChild(taskList);
                    dayColumn.appendChild(timeBlockDiv);
                }
            });

            if (!dayHasTasks) {
                const emptyHint = document.createElement('div');
                emptyHint.className = 'day-empty-hint';
                emptyHint.textContent = 'No tasks';
                dayColumn.appendChild(emptyHint);
            }

            scheduleGrid.appendChild(dayColumn);
        });
    }

    function renderAll() {
        renderChildTabs();
        renderSchedule();
        updateTaskHistoryDatalist();
    }

    // --- CHILD PROFILE ACTIONS ---
    function addChild() {
        const name = prompt("Enter the child's name:");
        if (!name || !name.trim()) return;

        const newId = `child_${Date.now()}`;
        state.children.push({ id: newId, name: name.trim() });
        state.activeChildId = newId;
        saveState();
        renderAll();
    }

    function renameChild() {
        const activeChild = getActiveChild();
        const newName = prompt(`Enter new name for ${activeChild.name}:`, activeChild.name);
        if (!newName || !newName.trim()) return;

        activeChild.name = newName.trim();
        saveState();
        renderAll();
    }

    function deleteChild() {
        const activeChild = getActiveChild();
        if (state.children.length <= 1) {
            alert('You must have at least one child profile.');
            return;
        }

        if (confirm(`Are you sure you want to delete ${activeChild.name} and all their weekly schedules?`)) {
            // Delete schedules
            delete state.schedules[activeChild.id];
            // Remove from children list
            state.children = state.children.filter(c => c.id !== activeChild.id);
            // Switch active child to the first remaining child
            state.activeChildId = state.children[0].id;
            saveState();
            renderAll();
        }
    }

    // --- WEEK NAVIGATION ACTIONS ---
    function shiftWeek(weeksOffset) {
        state.selectedWeek = addWeeksToIsoDate(state.selectedWeek, weeksOffset);
        saveState();
        renderSchedule();
    }

    function jumpToCurrentWeek() {
        state.selectedWeek = getMondayIsoString(new Date());
        saveState();
        renderSchedule();
    }

    function copyPreviousWeekSchedule() {
        const activeChild = getActiveChild();
        const prevWeekDate = addWeeksToIsoDate(state.selectedWeek, -1);
        const childSchedules = state.schedules[activeChild.id] || {};
        const prevWeekTasks = childSchedules[prevWeekDate] || [];

        if (prevWeekTasks.length === 0) {
            alert(`No tasks found in the previous week (${formatDate(prevWeekDate)}) for ${activeChild.name}.`);
            return;
        }

        const currentTasks = getCurrentWeekTasks();
        if (currentTasks.length > 0) {
            const proceed = confirm(
                `This week already has ${currentTasks.length} task(s).\n\nDo you want to replace this week's tasks with the ${prevWeekTasks.length} task(s) from last week?`
            );
            if (!proceed) return;
        }

        // Clone tasks with fresh IDs and reset completion
        const clonedTasks = prevWeekTasks.map((t, idx) => ({
            id: `task_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 4)}`,
            name: t.name,
            day: t.day,
            time: t.time,
            mustDo: !!t.mustDo,
            completed: false,
            recurringGroupId: t.recurringGroupId ? `rec_clone_${Date.now()}_${t.recurringGroupId}` : null
        }));

        setCurrentWeekTasks(clonedTasks);
        renderSchedule();
    }

    function clearThisWeek() {
        const activeChild = getActiveChild();
        const currentTasks = getCurrentWeekTasks();
        if (currentTasks.length === 0) return;

        if (confirm(`Clear all tasks for ${activeChild.name} on the week of ${formatDate(state.selectedWeek)}?`)) {
            setCurrentWeekTasks([]);
            renderSchedule();
        }
    }

    // --- TASK ACTIONS ---
    function getSelectedDays() {
        const selected = [];
        const checkboxes = document.querySelectorAll('input[name="taskDay"]');
        checkboxes.forEach(cb => {
            if (cb.checked) selected.push(cb.value);
        });
        return selected;
    }

    function setDayCheckboxes(dayValues) {
        const checkboxes = document.querySelectorAll('input[name="taskDay"]');
        checkboxes.forEach(cb => {
            cb.checked = dayValues.includes(cb.value);
        });
    }

    function addTask() {
        const name = taskNameInput.value.trim();
        if (!name) {
            alert('Please enter a task name.');
            taskNameInput.focus();
            return;
        }

        const selectedDays = getSelectedDays();
        if (selectedDays.length === 0) {
            alert('Please select at least one day for this task.');
            return;
        }

        const time = timeOfDaySelect.value;
        const mustDo = isMustDoCheckbox.checked;
        const isRecurring = selectedDays.length > 1;
        const recurringGroupId = isRecurring ? `rec_${Date.now()}_${Math.random().toString(36).substr(2, 5)}` : null;

        const currentTasks = getCurrentWeekTasks();

        // Create a task entry for each selected day
        selectedDays.forEach((day, idx) => {
            currentTasks.push({
                id: `task_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 4)}`,
                name: name,
                day: day,
                time: time,
                mustDo: mustDo,
                completed: false,
                recurringGroupId: recurringGroupId
            });
        });

        // Add to history
        if (!state.taskHistory.includes(name)) {
            state.taskHistory.push(name);
            updateTaskHistoryDatalist();
        }

        // Reset inputs
        taskNameInput.value = '';
        isMustDoCheckbox.checked = false;

        saveState();
        renderSchedule();
        taskNameInput.focus();
    }

    function toggleTaskCompleted(taskId) {
        const currentTasks = getCurrentWeekTasks();
        const task = currentTasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            saveState();
            renderSchedule();
        }
    }

    function deleteTask(taskId) {
        const currentTasks = getCurrentWeekTasks();
        const taskIndex = currentTasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) return;

        const targetTask = currentTasks[taskIndex];

        // If part of a recurring series this week
        if (targetTask.recurringGroupId) {
            const groupCount = currentTasks.filter(t => t.recurringGroupId === targetTask.recurringGroupId).length;
            if (groupCount > 1) {
                const deleteSeries = confirm(
                    `"${targetTask.name}" occurs on multiple days this week.\n\nClick "OK" to remove ALL recurring days, or "Cancel" to remove only ${targetTask.day}.`
                );

                if (deleteSeries) {
                    const filtered = currentTasks.filter(t => t.recurringGroupId !== targetTask.recurringGroupId);
                    setCurrentWeekTasks(filtered);
                } else {
                    currentTasks.splice(taskIndex, 1);
                    saveState();
                }
                renderSchedule();
                return;
            }
        }

        currentTasks.splice(taskIndex, 1);
        saveState();
        renderSchedule();
    }

    // --- DATA BACKUP & SHARE (EXPORT / IMPORT) ---
    function exportBackup() {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", `onthefrig_backup_${state.selectedWeek}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
    }

    function importBackup(e) {
        const file = e.target.files && e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const imported = JSON.parse(event.target.result);
                if (!imported.children || !imported.schedules) {
                    throw new Error("Invalid schedule file format.");
                }

                if (confirm("Importing this backup will merge with or replace your current schedule data. Continue?")) {
                    state = {
                        version: 2,
                        activeChildId: imported.activeChildId || (imported.children[0] && imported.children[0].id) || 'child_1',
                        children: Array.isArray(imported.children) ? imported.children : [{ id: 'child_1', name: 'Child' }],
                        selectedWeek: imported.selectedWeek || getMondayIsoString(new Date()),
                        schedules: imported.schedules || {},
                        taskHistory: Array.isArray(imported.taskHistory) ? imported.taskHistory : []
                    };
                    saveState();
                    renderAll();
                    alert("Schedule data imported successfully!");
                }
            } catch (err) {
                alert("Error importing file: " + err.message);
            }
            // Reset file input
            importFileInput.value = '';
        };
        reader.readAsText(file);
    }

    // --- ATTACH EVENT LISTENERS ---
    addChildBtn.addEventListener('click', addChild);
    renameChildBtn.addEventListener('click', renameChild);
    deleteChildBtn.addEventListener('click', deleteChild);

    prevWeekBtn.addEventListener('click', () => shiftWeek(-1));
    nextWeekBtn.addEventListener('click', () => shiftWeek(1));
    currentWeekBtn.addEventListener('click', jumpToCurrentWeek);
    weekDateInput.addEventListener('change', (e) => {
        if (e.target.value) {
            state.selectedWeek = getMondayIsoString(e.target.value);
            saveState();
            renderSchedule();
        }
    });

    copyPrevWeekBtn.addEventListener('click', copyPreviousWeekSchedule);
    clearWeekBtn.addEventListener('click', clearThisWeek);

    addTaskBtn.addEventListener('click', addTask);
    taskNameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTask();
        }
    });

    // Preset Days
    presetWeekdaysBtn.addEventListener('click', () => {
        setDayCheckboxes(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
    });
    presetWeekendsBtn.addEventListener('click', () => {
        setDayCheckboxes(['Saturday', 'Sunday']);
    });
    presetEverydayBtn.addEventListener('click', () => {
        setDayCheckboxes(DAYS);
    });
    presetClearDaysBtn.addEventListener('click', () => {
        setDayCheckboxes([]);
    });

    printBtn.addEventListener('click', () => window.print());

    exportDataBtn.addEventListener('click', exportBackup);
    importFileInput.addEventListener('change', importBackup);

    // --- INITIAL STARTUP ---
    loadState();
    setDayCheckboxes(['Monday']);
    renderAll();
});
