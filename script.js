document.addEventListener('DOMContentLoaded', function() {
    // --- CONSTANTS & CONFIG ---
    const STORAGE_KEY = 'onthefrig_schedule_data_v2';
    const OLD_STORAGE_KEY = 'onthefrig_schedule_data';
    const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const TIME_BLOCKS = ['Morning', 'Lunch', 'Afternoon', 'Nighttime'];

    // Early Reader Icon Categories
    const ICON_CATEGORIES = {
        'Hygiene & Routine': [
            { icon: '🪥', label: 'Toothbrush' },
            { icon: '🦷', label: 'Tooth' },
            { icon: '🧼', label: 'Wash Hands' },
            { icon: '🛁', label: 'Bath' },
            { icon: '🚿', label: 'Shower' },
            { icon: '🚽', label: 'Potty' },
            { icon: '🪮', label: 'Brush Hair' },
            { icon: '🌅', label: 'Wake Up' },
            { icon: '🌙', label: 'Bedtime' },
            { icon: '🛏️', label: 'Make Bed' },
            { icon: '👕', label: 'Get Dressed' },
            { icon: '👟', label: 'Put Shoes On' }
        ],
        'Meals & Snacks': [
            { icon: '🍎', label: 'Fruit / Snack' },
            { icon: '🥣', label: 'Breakfast / Cereal' },
            { icon: '🥪', label: 'Lunch / Sandwich' },
            { icon: '🍽️', label: 'Dinner / Plate' },
            { icon: '🥛', label: 'Milk / Drink' },
            { icon: '💧', label: 'Water Bottle' },
            { icon: '🥕', label: 'Vegetables' },
            { icon: '🍌', label: 'Banana' }
        ],
        'Learning & School': [
            { icon: '📚', label: 'Reading / Books' },
            { icon: '📖', label: 'Story Time' },
            { icon: '✏️', label: 'Writing / Pencil' },
            { icon: '🔢', label: 'Math / Numbers' },
            { icon: '🎒', label: 'Backpack' },
            { icon: '🎨', label: 'Art & Crafts' },
            { icon: '✂️', label: 'Scissors / Cut' },
            { icon: '🎹', label: 'Piano / Music' },
            { icon: '💻', label: 'Computer / Tablet' },
            { icon: '🔬', label: 'Science' }
        ],
        'Chores & Help': [
            { icon: '🧸', label: 'Clean Up Toys' },
            { icon: '🧹', label: 'Sweep / Chore' },
            { icon: '🧺', label: 'Laundry / Clothes' },
            { icon: '🗑️', label: 'Take Out Trash' },
            { icon: '🪴', label: 'Water Plants' },
            { icon: '🐕', label: 'Feed Dog / Pet' },
            { icon: '🐈', label: 'Cat Care' },
            { icon: '🥣', label: 'Clear Dishes' }
        ],
        'Play, Exercise & Rewards': [
            { icon: '⚽', label: 'Play Outside / Soccer' },
            { icon: '🚲', label: 'Bike Ride' },
            { icon: '🧩', label: 'Puzzle / Board Game' },
            { icon: '🌳', label: 'Park / Playground' },
            { icon: '⭐', label: 'Star / Reward' },
            { icon: '🏆', label: 'Trophy / Great Job' },
            { icon: '❤️', label: 'Kindness / Heart' },
            { icon: '⏰', label: 'Timer / Quiet Time' }
        ]
    };

    // Keyword to icon auto-detection map
    const AUTO_ICON_KEYWORDS = [
        { keywords: ['brush', 'teeth', 'toothbrush', 'brush teeth', 'brushing teeth'], icon: '🪥' },
        { keywords: ['tooth', 'dentist', 'floss'], icon: '🦷' },
        { keywords: ['bed', 'make bed', 'sheets'], icon: '🛏️' },
        { keywords: ['dress', 'dressed', 'clothes', 'pajama', 'pajamas', 'outfit'], icon: '👕' },
        { keywords: ['shoe', 'shoes'], icon: '👟' },
        { keywords: ['wash hands', 'hand wash', 'soap', 'wash hand'], icon: '🧼' },
        { keywords: ['bath', 'bathe', 'tub'], icon: '🛁' },
        { keywords: ['shower'], icon: '🚿' },
        { keywords: ['potty', 'toilet', 'bathroom'], icon: '🚽' },
        { keywords: ['hair', 'comb', 'hairbrush'], icon: '🪮' },
        { keywords: ['backpack', 'bag', 'pack bag', 'pack pack'], icon: '🎒' },
        { keywords: ['read', 'reading', 'book', 'books', 'chapter', 'phonics'], icon: '📚' },
        { keywords: ['story', 'bedtime story'], icon: '📖' },
        { keywords: ['math', 'lesson', 'numbers', 'counting', 'addition'], icon: '🔢' },
        { keywords: ['write', 'writing', 'pencil', 'homework', 'copywork', 'handwriting'], icon: '✏️' },
        { keywords: ['art', 'paint', 'draw', 'drawing', 'craft', 'crafts', 'coloring'], icon: '🎨' },
        { keywords: ['music', 'piano', 'guitar', 'instrument', 'sing', 'violin'], icon: '🎹' },
        { keywords: ['snack', 'fruit', 'apple'], icon: '🍎' },
        { keywords: ['breakfast', 'cereal', 'oatmeal', 'pancake'], icon: '🥣' },
        { keywords: ['lunch', 'sandwich'], icon: '🥪' },
        { keywords: ['dinner', 'supper', 'meal', 'eat'], icon: '🍽️' },
        { keywords: ['water', 'drink water', 'hydrate'], icon: '💧' },
        { keywords: ['milk'], icon: '🥛' },
        { keywords: ['toy', 'toys', 'clean toys', 'tidy', 'pick up toys', 'lego'], icon: '🧸' },
        { keywords: ['chore', 'chores', 'sweep', 'vacuum', 'dust', 'mop', 'clean room'], icon: '🧹' },
        { keywords: ['trash', 'garbage', 'recycle'], icon: '🗑️' },
        { keywords: ['laundry', 'fold clothes', 'dirty clothes'], icon: '🧺' },
        { keywords: ['pet', 'dog', 'puppy', 'walk dog', 'feed dog'], icon: '🐕' },
        { keywords: ['cat', 'kitty', 'feed cat'], icon: '🐈' },
        { keywords: ['plant', 'plants', 'garden', 'water plants'], icon: '🪴' },
        { keywords: ['outside', 'outdoor', 'play outside', 'sport', 'sports', 'soccer', 'ball'], icon: '⚽' },
        { keywords: ['bike', 'bicycle', 'scooter', 'ride'], icon: '🚲' },
        { keywords: ['game', 'puzzle', 'board game', 'games'], icon: '🧩' },
        { keywords: ['park', 'playground', 'walk', 'nature'], icon: '🌳' },
        { keywords: ['sleep', 'bedtime', 'goodnight', 'night', 'sleepy'], icon: '🌙' },
        { keywords: ['wake', 'wake up', 'morning routine', 'sunshine'], icon: '🌅' },
        { keywords: ['star', 'reward', 'prize', 'goal'], icon: '⭐' },
        { keywords: ['quiet time', 'rest', 'nap', 'timer'], icon: '⏰' }
    ];

    // --- APPLICATION STATE ---
    let state = {
        version: 2,
        activeChildId: 'child_1',
        children: [
            { id: 'child_1', name: "Child" }
        ],
        selectedWeek: '', // YYYY-MM-DD (snapped to Monday)
        activeView: 'weekly', // 'weekly' or 'early_reader'
        selectedReaderDay: 'Monday', // Day selected in Early Reader view
        selectedTaskIcon: '🪥', // Current icon in task form
        isIconUserModified: false,
        schedules: {},
        taskHistory: []
    };

    // Pending delete target state
    let pendingDeleteTask = null;
    let pendingEditTaskId = null;

    // --- DOM REFERENCES ---
    const childTabsContainer = document.getElementById('childTabsContainer');
    const addChildBtn = document.getElementById('addChildBtn');
    const renameChildBtn = document.getElementById('renameChildBtn');
    const deleteChildBtn = document.getElementById('deleteChildBtn');

    const viewWeeklyBtn = document.getElementById('viewWeeklyBtn');
    const viewEarlyReaderBtn = document.getElementById('viewEarlyReaderBtn');
    const printableArea = document.getElementById('printableArea');
    const earlyReaderView = document.getElementById('earlyReaderView');
    const printHint = document.getElementById('printHint');

    const prevWeekBtn = document.getElementById('prevWeekBtn');
    const nextWeekBtn = document.getElementById('nextWeekBtn');
    const currentWeekBtn = document.getElementById('currentWeekBtn');
    const weekDateInput = document.getElementById('weekDate');
    const copyPrevWeekBtn = document.getElementById('copyPrevWeekBtn');
    const clearWeekBtn = document.getElementById('clearWeekBtn');

    const taskNameInput = document.getElementById('taskName');
    const timeOfDaySelect = document.getElementById('timeOfDay');
    const isMustDoCheckbox = document.getElementById('isMustDo');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskHistoryDatalist = document.getElementById('taskHistory');
    const previewEmoji = document.getElementById('previewEmoji');
    const autoIconBadge = document.getElementById('autoIconBadge');
    const quickIconsContainer = document.getElementById('quickIconsContainer');
    const openMoreIconsBtn = document.getElementById('openMoreIconsBtn');

    const childAssignChipsContainer = document.getElementById('childAssignChipsContainer');
    const presetActiveChildOnlyBtn = document.getElementById('presetActiveChildOnly');
    const presetAllChildrenBtn = document.getElementById('presetAllChildren');

    const presetWeekdaysBtn = document.getElementById('presetWeekdays');
    const presetWeekendsBtn = document.getElementById('presetWeekends');
    const presetEverydayBtn = document.getElementById('presetEveryday');
    const presetClearDaysBtn = document.getElementById('presetClearDays');

    const displayName = document.getElementById('displayName');
    const displayDate = document.getElementById('displayDate');
    const scheduleGrid = document.getElementById('schedule-grid-container');
    const printBtn = document.getElementById('printBtn');

    const readerDisplayName = document.getElementById('readerDisplayName');
    const readerDisplayDate = document.getElementById('readerDisplayDate');
    const readerDaySelector = document.getElementById('readerDaySelector');
    const readerRoutineContainer = document.getElementById('readerRoutineContainer');

    const exportDataBtn = document.getElementById('exportDataBtn');
    const importFileInput = document.getElementById('importFileInput');

    // Modals
    const iconModal = document.getElementById('iconModal');
    const closeIconModalBtn = document.getElementById('closeIconModalBtn');
    const iconCategoriesContainer = document.getElementById('iconCategoriesContainer');

    const editTaskModal = document.getElementById('editTaskModal');
    const closeEditModalBtn = document.getElementById('closeEditModalBtn');
    const cancelEditTaskBtn = document.getElementById('cancelEditTaskBtn');
    const saveEditTaskBtn = document.getElementById('saveEditTaskBtn');
    const editTaskName = document.getElementById('editTaskName');
    const editTimeOfDay = document.getElementById('editTimeOfDay');
    const editIsMustDo = document.getElementById('editIsMustDo');
    const editIconPicker = document.getElementById('editIconPicker');

    const deleteModal = document.getElementById('deleteModal');
    const closeDeleteModalBtn = document.getElementById('closeDeleteModalBtn');
    const cancelDeleteModalBtn = document.getElementById('cancelDeleteModalBtn');
    const deleteSingleBtn = document.getElementById('deleteSingleBtn');
    const deleteSeriesBtn = document.getElementById('deleteSeriesBtn');
    const deleteModalMessage = document.getElementById('deleteModalMessage');

    // --- DATE HELPERS ---
    function getMondayIsoString(dateInput) {
        let d;
        if (typeof dateInput === 'string' && dateInput.includes('-')) {
            const parts = dateInput.split('-');
            d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
        } else if (dateInput instanceof Date) {
            d = new Date(dateInput.getFullYear(), dateInput.getMonth(), dateInput.getDate());
        } else {
            d = new Date();
        }
        d.setHours(0, 0, 0, 0);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday is week start
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

    function getTodayDayName() {
        const dayIndex = new Date().getDay();
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return dayNames[dayIndex];
    }

    // --- AUTO ICON DETECTION ---
    function detectIconForTask(taskName) {
        if (!taskName) return '🪥';
        const lower = taskName.toLowerCase().trim();
        for (const item of AUTO_ICON_KEYWORDS) {
            for (const kw of item.keywords) {
                if (lower.includes(kw)) {
                    return item.icon;
                }
            }
        }
        return '⭐'; // Default pleasant reward icon if not matched
    }

    function setSelectedFormIcon(icon, isUserAction = true) {
        state.selectedTaskIcon = icon;
        previewEmoji.textContent = icon || '🚫';
        if (isUserAction) {
            state.isIconUserModified = true;
            autoIconBadge.style.display = 'none';
        }

        const chips = quickIconsContainer.querySelectorAll('.icon-chip');
        chips.forEach(chip => {
            if (chip.getAttribute('data-icon') === icon) {
                chip.classList.add('active');
            } else {
                chip.classList.remove('active');
            }
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
                    activeView: parsed.activeView || 'weekly',
                    selectedReaderDay: parsed.selectedReaderDay || getTodayDayName(),
                    selectedTaskIcon: '🪥',
                    isIconUserModified: false,
                    schedules: (typeof parsed.schedules === 'object' && parsed.schedules !== null) ? parsed.schedules : {},
                    taskHistory: Array.isArray(parsed.taskHistory) ? parsed.taskHistory : []
                };

                // Sanitize tasks (ensure icon field exists)
                Object.keys(state.schedules).forEach(cId => {
                    const childWeeks = state.schedules[cId] || {};
                    Object.keys(childWeeks).forEach(wKey => {
                        const tasks = childWeeks[wKey];
                        if (Array.isArray(tasks)) {
                            tasks.forEach(t => {
                                if (t.icon === undefined) {
                                    t.icon = detectIconForTask(t.name);
                                }
                            });
                        }
                    });
                });
                return;
            }

            // Check for v1 migration
            const rawV1 = localStorage.getItem(OLD_STORAGE_KEY);
            if (rawV1) {
                const parsedV1 = JSON.parse(rawV1);
                const childId = 'child_1';
                const childName = (parsedV1.childName && parsedV1.childName.trim()) || 'Child';
                const weekDate = parsedV1.weekDate ? getMondayIsoString(parsedV1.weekDate) : getMondayIsoString(new Date());
                const rawTasks = Array.isArray(parsedV1.tasks) ? parsedV1.tasks : [];
                const migratedTasks = rawTasks.map(t => ({
                    ...t,
                    icon: detectIconForTask(t.name)
                }));

                state = {
                    version: 2,
                    activeChildId: childId,
                    children: [{ id: childId, name: childName }],
                    selectedWeek: weekDate,
                    activeView: 'weekly',
                    selectedReaderDay: getTodayDayName(),
                    selectedTaskIcon: '🪥',
                    isIconUserModified: false,
                    schedules: {
                        [childId]: {
                            [weekDate]: migratedTasks
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
        state.selectedReaderDay = getTodayDayName();
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
        if (!Array.isArray(state.children) || state.children.length === 0) {
            state.children = [{ id: 'child_1', name: 'Child' }];
            state.activeChildId = 'child_1';
        }
        return state.children.find(c => c.id === state.activeChildId) || state.children[0];
    }

    function getChildWeekTasks(childId) {
        if (!state.schedules[childId]) {
            state.schedules[childId] = {};
        }
        if (!state.schedules[childId][state.selectedWeek]) {
            state.schedules[childId][state.selectedWeek] = [];
        }
        return state.schedules[childId][state.selectedWeek];
    }

    function getCurrentWeekTasks() {
        const activeChild = getActiveChild();
        return getChildWeekTasks(activeChild.id);
    }

    function setCurrentWeekTasks(tasks) {
        const activeChild = getActiveChild();
        if (!state.schedules[activeChild.id]) {
            state.schedules[activeChild.id] = {};
        }
        state.schedules[activeChild.id][state.selectedWeek] = tasks;
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
                syncChildAssignChips();
            });
            childTabsContainer.appendChild(tabBtn);
        });
    }

    function renderChildAssignChips() {
        childAssignChipsContainer.innerHTML = '';
        state.children.forEach(child => {
            const label = document.createElement('label');
            label.className = 'child-assign-chip';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = 'assignChild';
            checkbox.value = child.id;
            checkbox.checked = (child.id === state.activeChildId);

            const span = document.createElement('span');
            span.textContent = child.name;

            label.appendChild(checkbox);
            label.appendChild(span);
            childAssignChipsContainer.appendChild(label);
        });
    }

    function syncChildAssignChips() {
        const checkboxes = document.querySelectorAll('input[name="assignChild"]');
        if (checkboxes.length === 0) {
            renderChildAssignChips();
            return;
        }
        // Update active child default if only one was selected
        const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
        if (checkedCount <= 1) {
            checkboxes.forEach(cb => {
                cb.checked = (cb.value === state.activeChildId);
            });
        }
    }

    function updateTaskHistoryDatalist() {
        taskHistoryDatalist.innerHTML = '';
        state.taskHistory.forEach(taskName => {
            const option = document.createElement('option');
            option.value = taskName;
            taskHistoryDatalist.appendChild(option);
        });
    }

    // Render VIEW 1: Weekly Grid
    function renderWeeklySchedule() {
        const activeChild = getActiveChild();
        const currentTasks = getCurrentWeekTasks();

        displayName.textContent = activeChild.name ? `${activeChild.name}'s Schedule` : "Child's Schedule";
        displayDate.textContent = `Week of ${formatDate(state.selectedWeek)}`;
        weekDateInput.value = state.selectedWeek;

        scheduleGrid.innerHTML = '';

        DAYS.forEach(day => {
            const dayColumn = document.createElement('div');
            dayColumn.className = 'day-column';
            
            const dayHeader = document.createElement('h3');
            dayHeader.textContent = day;
            dayColumn.appendChild(dayHeader);

            let dayHasTasks = false;

            TIME_BLOCKS.forEach(block => {
                const tasksForBlock = currentTasks.filter(t => t.day === day && t.time === block);

                if (tasksForBlock.length > 0) {
                    dayHasTasks = true;
                    const timeBlockDiv = document.createElement('div');
                    timeBlockDiv.className = 'time-block';
                    
                    const blockHeader = document.createElement('h4');
                    const blockIcon = block === 'Morning' ? '🌅' : block === 'Lunch' ? '🥪' : block === 'Afternoon' ? '☀️' : '🌙';
                    blockHeader.textContent = `${blockIcon} ${block}`;
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

                        // Icon badge for early readers
                        const taskIconSpan = document.createElement('span');
                        taskIconSpan.className = 'task-icon';
                        taskIconSpan.textContent = task.icon || '⭐';

                        // Task text (with clean unfragmented wrapping)
                        const taskNameSpan = document.createElement('span');
                        taskNameSpan.className = 'task-name';
                        if (task.mustDo) {
                            const strong = document.createElement('strong');
                            strong.textContent = task.name;
                            taskNameSpan.appendChild(strong);
                            const star = document.createElement('span');
                            star.className = 'task-must-do-badge';
                            star.textContent = ' ⭐';
                            taskNameSpan.appendChild(star);
                        } else {
                            taskNameSpan.textContent = task.name;
                        }

                        // Action Buttons (Edit & Delete - overlay on hover)
                        const actionDiv = document.createElement('div');
                        actionDiv.className = 'task-item-actions no-print';

                        const editBtn = document.createElement('button');
                        editBtn.type = 'button';
                        editBtn.className = 'task-btn-action';
                        editBtn.textContent = '✏️';
                        editBtn.title = 'Edit task';
                        editBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            openEditTaskModal(task.id);
                        });

                        const deleteBtn = document.createElement('button');
                        deleteBtn.type = 'button';
                        deleteBtn.className = 'task-btn-action delete-task-btn';
                        deleteBtn.textContent = '✕';
                        deleteBtn.title = 'Delete task';
                        deleteBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            requestDeleteTask(task.id);
                        });

                        actionDiv.appendChild(editBtn);
                        actionDiv.appendChild(deleteBtn);

                        taskItem.appendChild(checkbox);
                        taskItem.appendChild(taskIconSpan);
                        taskItem.appendChild(taskNameSpan);
                        taskItem.appendChild(actionDiv);
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

    // Render VIEW 2: Early Reader Picture Routine Board
    function renderEarlyReaderBoard() {
        const activeChild = getActiveChild();
        const currentTasks = getCurrentWeekTasks();
        const selectedDay = state.selectedReaderDay || 'Monday';

        readerDisplayName.textContent = activeChild.name ? `${activeChild.name}'s Daily Routine` : "Child's Routine";
        readerDisplayDate.textContent = `${selectedDay} • Week of ${formatDate(state.selectedWeek)}`;

        // Render Day Selector Tabs
        readerDaySelector.innerHTML = '';
        DAYS.forEach(day => {
            const dayBtn = document.createElement('button');
            dayBtn.type = 'button';
            dayBtn.className = `reader-day-btn ${day === selectedDay ? 'active' : ''}`;
            dayBtn.textContent = day.substr(0, 3);
            dayBtn.title = `View ${day}'s picture routine`;
            dayBtn.addEventListener('click', () => {
                state.selectedReaderDay = day;
                saveState();
                renderEarlyReaderBoard();
            });
            readerDaySelector.appendChild(dayBtn);
        });

        // Filter tasks for selected day
        const dayTasks = currentTasks.filter(t => t.day === selectedDay);
        readerRoutineContainer.innerHTML = '';

        TIME_BLOCKS.forEach(block => {
            const blockTasks = dayTasks.filter(t => t.time === block);

            const blockCard = document.createElement('div');
            blockCard.className = `reader-block-card time-${block}`;

            const blockHeader = document.createElement('div');
            blockHeader.className = 'reader-block-header';

            const blockTitle = document.createElement('h3');
            const blockIcon = block === 'Morning' ? '🌅' : block === 'Lunch' ? '🥪' : block === 'Afternoon' ? '☀️' : '🌙';
            blockTitle.textContent = `${blockIcon} ${block}`;

            const countBadge = document.createElement('span');
            countBadge.className = 'reader-block-count';
            countBadge.textContent = `${blockTasks.filter(t => t.completed).length}/${blockTasks.length}`;

            blockHeader.appendChild(blockTitle);
            blockHeader.appendChild(countBadge);
            blockCard.appendChild(blockHeader);

            if (blockTasks.length === 0) {
                const emptyMsg = document.createElement('div');
                emptyMsg.className = 'reader-empty-msg';
                emptyMsg.textContent = 'No tasks for this time';
                blockCard.appendChild(emptyMsg);
            } else {
                const taskCardsList = document.createElement('div');
                taskCardsList.className = 'reader-task-cards';

                blockTasks.forEach(task => {
                    const cardItem = document.createElement('div');
                    cardItem.className = `reader-card-item ${task.completed ? 'completed' : ''}`;

                    const iconBox = document.createElement('div');
                    iconBox.className = 'reader-card-icon';
                    iconBox.textContent = task.icon || '⭐';

                    const contentBox = document.createElement('div');
                    contentBox.className = 'reader-card-content';

                    const titleSpan = document.createElement('span');
                    titleSpan.className = 'reader-task-title';
                    titleSpan.textContent = task.name;

                    contentBox.appendChild(titleSpan);

                    if (task.mustDo) {
                        const tag = document.createElement('span');
                        tag.className = 'reader-task-tag';
                        tag.textContent = '⭐ High Priority';
                        contentBox.appendChild(tag);
                    }

                    const actionsBox = document.createElement('div');
                    actionsBox.className = 'reader-card-actions';

                    const speakBtn = document.createElement('button');
                    speakBtn.type = 'button';
                    speakBtn.className = 'btn-speak no-print';
                    speakBtn.textContent = '🔊';
                    speakBtn.title = 'Hear task read aloud';
                    speakBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        speakTask(task.name, block);
                    });

                    const checkMark = document.createElement('div');
                    checkMark.className = 'reader-big-check';
                    checkMark.textContent = task.completed ? '✓' : '';

                    actionsBox.appendChild(speakBtn);
                    actionsBox.appendChild(checkMark);

                    cardItem.appendChild(iconBox);
                    cardItem.appendChild(contentBox);
                    cardItem.appendChild(actionsBox);

                    cardItem.addEventListener('click', () => {
                        toggleTaskCompleted(task.id);
                    });

                    taskCardsList.appendChild(cardItem);
                });

                blockCard.appendChild(taskCardsList);
            }

            readerRoutineContainer.appendChild(blockCard);
        });
    }

    // Read Aloud Speech Synthesis
    function speakTask(taskName, blockTime) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const textToSay = `${taskName}`;
            const utterance = new SpeechSynthesisUtterance(textToSay);
            utterance.rate = 0.9;
            utterance.pitch = 1.1;
            window.speechSynthesis.speak(utterance);
        }
    }

    function switchViewMode(mode) {
        state.activeView = mode;
        saveState();
        if (mode === 'early_reader') {
            viewEarlyReaderBtn.classList.add('active');
            viewWeeklyBtn.classList.remove('active');
            printableArea.style.display = 'none';
            earlyReaderView.style.display = 'block';
            printHint.textContent = "Prints today's visual picture routine card sheet for the fridge or bedroom door";
            renderEarlyReaderBoard();
        } else {
            viewWeeklyBtn.classList.add('active');
            viewEarlyReaderBtn.classList.remove('active');
            printableArea.style.display = 'block';
            earlyReaderView.style.display = 'none';
            printHint.textContent = "Fits cleanly onto landscape letter paper for your fridge";
            renderWeeklySchedule();
        }
    }

    function renderAll() {
        renderChildTabs();
        renderChildAssignChips();
        updateTaskHistoryDatalist();
        if (state.activeView === 'early_reader') {
            switchViewMode('early_reader');
        } else {
            switchViewMode('weekly');
        }
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
            delete state.schedules[activeChild.id];
            state.children = state.children.filter(c => c.id !== activeChild.id);
            state.activeChildId = state.children[0].id;
            saveState();
            renderAll();
        }
    }

    // --- WEEK NAVIGATION ACTIONS ---
    function shiftWeek(weeksOffset) {
        state.selectedWeek = addWeeksToIsoDate(state.selectedWeek, weeksOffset);
        saveState();
        renderAll();
    }

    function jumpToCurrentWeek() {
        state.selectedWeek = getMondayIsoString(new Date());
        state.selectedReaderDay = getTodayDayName();
        saveState();
        renderAll();
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

        const clonedTasks = prevWeekTasks.map((t, idx) => ({
            id: `task_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 4)}`,
            name: t.name,
            icon: t.icon || detectIconForTask(t.name),
            day: t.day,
            time: t.time,
            mustDo: !!t.mustDo,
            completed: false,
            recurringGroupId: t.recurringGroupId ? `rec_clone_${Date.now()}_${t.recurringGroupId}` : null
        }));

        setCurrentWeekTasks(clonedTasks);
        renderAll();
    }

    function clearThisWeek() {
        const activeChild = getActiveChild();
        const currentTasks = getCurrentWeekTasks();
        if (currentTasks.length === 0) return;

        if (confirm(`Clear all tasks for ${activeChild.name} on the week of ${formatDate(state.selectedWeek)}?`)) {
            setCurrentWeekTasks([]);
            renderAll();
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

    function getSelectedAssignChildren() {
        const selected = [];
        const checkboxes = document.querySelectorAll('input[name="assignChild"]');
        checkboxes.forEach(cb => {
            if (cb.checked) selected.push(cb.value);
        });
        // Fallback to active child if none selected
        if (selected.length === 0) {
            selected.push(state.activeChildId);
        }
        return selected;
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

        const targetChildIds = getSelectedAssignChildren();
        if (targetChildIds.length === 0) {
            alert('Please select at least one child to assign this task to.');
            return;
        }

        const time = timeOfDaySelect.value;
        const mustDo = isMustDoCheckbox.checked;
        const icon = state.selectedTaskIcon || detectIconForTask(name);
        const isRecurring = selectedDays.length > 1;

        // Add task for each selected child
        targetChildIds.forEach((childId) => {
            const childTasks = getChildWeekTasks(childId);
            const recurringGroupId = isRecurring ? `rec_${Date.now()}_${childId}_${Math.random().toString(36).substr(2, 5)}` : null;

            selectedDays.forEach((day, idx) => {
                childTasks.push({
                    id: `task_${Date.now()}_${childId}_${idx}_${Math.random().toString(36).substr(2, 4)}`,
                    name: name,
                    icon: icon,
                    day: day,
                    time: time,
                    mustDo: mustDo,
                    completed: false,
                    recurringGroupId: recurringGroupId
                });
            });

            if (!state.schedules[childId]) {
                state.schedules[childId] = {};
            }
            state.schedules[childId][state.selectedWeek] = childTasks;
        });

        if (!state.taskHistory.includes(name)) {
            state.taskHistory.push(name);
            updateTaskHistoryDatalist();
        }

        // Reset inputs
        taskNameInput.value = '';
        isMustDoCheckbox.checked = false;
        state.isIconUserModified = false;
        setSelectedFormIcon('🪥', false);
        autoIconBadge.style.display = 'none';

        saveState();
        renderAll();
        taskNameInput.focus();
    }

    function toggleTaskCompleted(taskId) {
        const currentTasks = getCurrentWeekTasks();
        const task = currentTasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            saveState();
            renderAll();
        }
    }

    // Safe Delete Workflow
    function requestDeleteTask(taskId) {
        const currentTasks = getCurrentWeekTasks();
        const targetTask = currentTasks.find(t => t.id === taskId);
        if (!targetTask) return;

        if (targetTask.recurringGroupId) {
            const groupCount = currentTasks.filter(t => t.recurringGroupId === targetTask.recurringGroupId).length;
            if (groupCount > 1) {
                pendingDeleteTask = targetTask;
                deleteModalMessage.textContent = `"${targetTask.name}" occurs on ${groupCount} days this week. How would you like to delete it?`;
                deleteModal.style.display = 'flex';
                return;
            }
        }

        // Single instance delete
        const taskIndex = currentTasks.indexOf(targetTask);
        if (taskIndex !== -1) {
            currentTasks.splice(taskIndex, 1);
            saveState();
            renderAll();
        }
    }

    function executeDeleteSingle() {
        if (!pendingDeleteTask) return;
        const currentTasks = getCurrentWeekTasks();
        const taskIndex = currentTasks.findIndex(t => t.id === pendingDeleteTask.id);
        if (taskIndex !== -1) {
            currentTasks.splice(taskIndex, 1);
            saveState();
            renderAll();
        }
        closeDeleteModal();
    }

    function executeDeleteSeries() {
        if (!pendingDeleteTask) return;
        const currentTasks = getCurrentWeekTasks();
        const filtered = currentTasks.filter(t => t.recurringGroupId !== pendingDeleteTask.recurringGroupId);
        setCurrentWeekTasks(filtered);
        renderAll();
        closeDeleteModal();
    }

    function closeDeleteModal() {
        pendingDeleteTask = null;
        deleteModal.style.display = 'none';
    }

    // Edit Task Dialog
    function openEditTaskModal(taskId) {
        const currentTasks = getCurrentWeekTasks();
        const task = currentTasks.find(t => t.id === taskId);
        if (!task) return;

        pendingEditTaskId = taskId;
        editTaskName.value = task.name;
        editTimeOfDay.value = task.time;
        editIsMustDo.checked = !!task.mustDo;

        editIconPicker.innerHTML = '';
        const commonIcons = ['🪥', '🦷', '🛏️', '👕', '🧼', '🛁', '🚽', '🎒', '📚', '✏️', '🍎', '🍽️', '🧸', '🧹', '🐕', '⚽', '🎹', '🌙', '⭐', ''];
        commonIcons.forEach(ic => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = `icon-chip ${task.icon === ic ? 'active' : ''}`;
            btn.setAttribute('data-icon', ic);
            btn.textContent = ic || '🚫';
            btn.addEventListener('click', () => {
                editIconPicker.querySelectorAll('.icon-chip').forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
            });
            editIconPicker.appendChild(btn);
        });

        editTaskModal.style.display = 'flex';
    }

    function saveEditTask() {
        if (!pendingEditTaskId) return;
        const currentTasks = getCurrentWeekTasks();
        const task = currentTasks.find(t => t.id === pendingEditTaskId);
        if (!task) return;

        const newName = editTaskName.value.trim();
        if (!newName) {
            alert('Task name cannot be empty.');
            return;
        }

        const activeChip = editIconPicker.querySelector('.icon-chip.active');
        const selectedIcon = activeChip ? activeChip.getAttribute('data-icon') : (task.icon || detectIconForTask(newName));

        task.name = newName;
        task.time = editTimeOfDay.value;
        task.mustDo = editIsMustDo.checked;
        task.icon = selectedIcon;

        // If part of recurring group, offer to update series name/icon
        if (task.recurringGroupId) {
            const seriesTasks = currentTasks.filter(t => t.recurringGroupId === task.recurringGroupId && t.id !== task.id);
            if (seriesTasks.length > 0) {
                const updateAll = confirm(`Update task name, time, and icon across all other recurring days this week?`);
                if (updateAll) {
                    seriesTasks.forEach(st => {
                        st.name = task.name;
                        st.time = task.time;
                        st.mustDo = task.mustDo;
                        st.icon = task.icon;
                    });
                }
            }
        }

        saveState();
        renderAll();
        closeEditModal();
    }

    function closeEditModal() {
        pendingEditTaskId = null;
        editTaskModal.style.display = 'none';
    }

    // Full Icons Modal
    function buildIconModalCategories() {
        iconCategoriesContainer.innerHTML = '';
        Object.entries(ICON_CATEGORIES).forEach(([categoryName, iconsList]) => {
            const group = document.createElement('div');
            group.className = 'icon-category-group';

            const title = document.createElement('div');
            title.className = 'icon-category-title';
            title.textContent = categoryName;

            const grid = document.createElement('div');
            grid.className = 'icon-category-grid';

            iconsList.forEach(item => {
                const btn = document.createElement('button');
                btn.type = 'button';
                btn.className = 'modal-icon-btn';
                btn.textContent = item.icon;
                btn.title = item.label;
                btn.addEventListener('click', () => {
                    setSelectedFormIcon(item.icon, true);
                    iconModal.style.display = 'none';
                });
                grid.appendChild(btn);
            });

            group.appendChild(title);
            group.appendChild(grid);
            iconCategoriesContainer.appendChild(group);
        });
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
                if (!imported || typeof imported !== 'object') {
                    throw new Error("Invalid file format.");
                }

                if (confirm("Importing this backup will replace your current schedule data with the backup. Continue?")) {
                    state = {
                        version: 2,
                        activeChildId: imported.activeChildId || (imported.children && imported.children[0] && imported.children[0].id) || 'child_1',
                        children: Array.isArray(imported.children) && imported.children.length > 0 ? imported.children : [{ id: 'child_1', name: 'Child' }],
                        selectedWeek: imported.selectedWeek || getMondayIsoString(new Date()),
                        activeView: imported.activeView || 'weekly',
                        selectedReaderDay: imported.selectedReaderDay || getTodayDayName(),
                        selectedTaskIcon: '🪥',
                        isIconUserModified: false,
                        schedules: (typeof imported.schedules === 'object' && imported.schedules !== null) ? imported.schedules : {},
                        taskHistory: Array.isArray(imported.taskHistory) ? imported.taskHistory : []
                    };

                    Object.keys(state.schedules).forEach(cId => {
                        const childWeeks = state.schedules[cId] || {};
                        Object.keys(childWeeks).forEach(wKey => {
                            const tasks = childWeeks[wKey];
                            if (Array.isArray(tasks)) {
                                tasks.forEach(t => {
                                    if (t.icon === undefined) {
                                        t.icon = detectIconForTask(t.name);
                                    }
                                });
                            }
                        });
                    });

                    saveState();
                    renderAll();
                    alert("Schedule data imported successfully!");
                }
            } catch (err) {
                alert("Error importing file: " + err.message);
            }
            importFileInput.value = '';
        };
        reader.readAsText(file);
    }

    // --- ATTACH EVENT LISTENERS ---
    addChildBtn.addEventListener('click', addChild);
    renameChildBtn.addEventListener('click', renameChild);
    deleteChildBtn.addEventListener('click', deleteChild);

    viewWeeklyBtn.addEventListener('click', () => switchViewMode('weekly'));
    viewEarlyReaderBtn.addEventListener('click', () => switchViewMode('early_reader'));

    prevWeekBtn.addEventListener('click', () => shiftWeek(-1));
    nextWeekBtn.addEventListener('click', () => shiftWeek(1));
    currentWeekBtn.addEventListener('click', jumpToCurrentWeek);
    weekDateInput.addEventListener('change', (e) => {
        if (e.target.value) {
            state.selectedWeek = getMondayIsoString(e.target.value);
            saveState();
            renderAll();
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

    // Auto-detect icon when typing task name
    taskNameInput.addEventListener('input', (e) => {
        const val = e.target.value;
        if (!state.isIconUserModified && val.trim().length > 1) {
            const detected = detectIconForTask(val);
            if (detected) {
                setSelectedFormIcon(detected, false);
                autoIconBadge.style.display = 'inline-block';
            }
        }
    });

    // Quick icon chip clicks
    quickIconsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.icon-chip');
        if (btn) {
            const icon = btn.getAttribute('data-icon');
            setSelectedFormIcon(icon, true);
        }
    });

    openMoreIconsBtn.addEventListener('click', () => {
        buildIconModalCategories();
        iconModal.style.display = 'flex';
    });
    closeIconModalBtn.addEventListener('click', () => iconModal.style.display = 'none');
    iconModal.addEventListener('click', (e) => {
        if (e.target === iconModal) iconModal.style.display = 'none';
    });

    // Child Assign Presets
    presetActiveChildOnlyBtn.addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('input[name="assignChild"]');
        checkboxes.forEach(cb => {
            cb.checked = (cb.value === state.activeChildId);
        });
    });

    presetAllChildrenBtn.addEventListener('click', () => {
        const checkboxes = document.querySelectorAll('input[name="assignChild"]');
        checkboxes.forEach(cb => {
            cb.checked = true;
        });
    });

    // Edit modal listeners
    closeEditModalBtn.addEventListener('click', closeEditModal);
    cancelEditTaskBtn.addEventListener('click', closeEditModal);
    saveEditTaskBtn.addEventListener('click', saveEditTask);
    editTaskModal.addEventListener('click', (e) => {
        if (e.target === editTaskModal) closeEditModal();
    });

    // Delete modal listeners
    closeDeleteModalBtn.addEventListener('click', closeDeleteModal);
    cancelDeleteModalBtn.addEventListener('click', closeDeleteModal);
    deleteSingleBtn.addEventListener('click', executeDeleteSingle);
    deleteSeriesBtn.addEventListener('click', executeDeleteSeries);
    deleteModal.addEventListener('click', (e) => {
        if (e.target === deleteModal) closeDeleteModal();
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
    setSelectedFormIcon('🪥', false);
    renderAll();
});
