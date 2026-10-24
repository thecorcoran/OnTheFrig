document.addEventListener('DOMContentLoaded', function() {
    // --- CONSTANTS & CONFIG ---
    const STORAGE_KEY = 'onthefrig_schedule_data_v2';
    const OLD_STORAGE_KEY = 'onthefrig_schedule_data';
    const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const TIME_BLOCKS = ['Morning', 'Snack', 'Lunch', 'Afternoon', 'Nighttime'];

    // Visual Icon Categories
    const ICON_CATEGORIES = {
        'Hygiene & Routine': [
            { icon: '🪥', label: 'Toothbrush' },
            { icon: '🦷', label: 'Tooth' },
            { icon: '🧼', label: 'Wash Hands' },
            { icon: '🛁', label: 'Bath' },
            { icon: '🚿', label: 'Shower' },
            { icon: '🚽', label: 'Bathroom' },
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
        { keywords: ['quiet time', 'rest', 'nap', 'timer', 'meeting', 'work'], icon: '⏰' }
    ];

    // --- APPLICATION STATE ---
    let state = {
        version: 2,
        activeChildId: 'child_1',
        children: [
            { id: 'child_1', name: "Family Member" }
        ],
        selectedWeek: '', // YYYY-MM-DD (snapped to Monday)
        activeView: 'weekly', // 'weekly' or 'daily'
        calendarDateMode: 'dated', // 'dated' or 'general'
        lastPrinted: null, // { timestamp: string, time: number }
        selectedReaderDay: 'Monday', // Day selected in Daily View
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
    const viewDailyBtn = document.getElementById('viewDailyBtn');
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
    const printStatusBanner = document.getElementById('printStatusBanner');
    const printStatusText = document.getElementById('printStatusText');
    const lastPrintedHint = document.getElementById('lastPrintedHint');
    const toastNotification = document.getElementById('toastNotification');
    const offlineStatus = document.getElementById('offlineStatus');
    const installPwaBtn = document.getElementById('installPwaBtn');
    const calendarDateRadios = document.querySelectorAll('input[name="calendarDateMode"]');

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
        return '⭐'; // Default pleasant icon
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

    // --- TOAST NOTIFICATIONS ---
    let toastTimer = null;
    function showToast(message, duration = 4000) {
        if (!toastNotification) return;
        toastNotification.textContent = message;
        toastNotification.style.display = 'flex';
        clearTimeout(toastTimer);
        toastTimer = setTimeout(() => {
            toastNotification.style.display = 'none';
        }, duration);
    }

    // --- PRINT STATUS TRACKING ---
    function markCalendarAsPrinted() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
        const dateStr = now.toLocaleDateString([], { month: 'short', day: 'numeric' });
        const formatted = `${dateStr} at ${timeStr}`;
        state.lastPrinted = {
            timestamp: formatted,
            time: Date.now()
        };
        saveState();
        renderPrintStatus();
        showToast(`🖨️ Calendar printed on ${formatted}! Ready for the fridge.`);
    }

    function renderPrintStatus() {
        if (state.lastPrinted && state.lastPrinted.timestamp) {
            if (printStatusBanner) {
                printStatusBanner.style.display = 'inline-flex';
            }
            if (printStatusText) {
                printStatusText.textContent = `Last printed: ${state.lastPrinted.timestamp}`;
            }
            if (lastPrintedHint) {
                lastPrintedHint.textContent = `✅ Last printed: ${state.lastPrinted.timestamp}`;
            }
        } else {
            if (printStatusBanner) {
                printStatusBanner.style.display = 'none';
            }
            if (lastPrintedHint) {
                lastPrintedHint.textContent = '';
            }
        }
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
                        ? parsed.children.map(c => (c.name === 'Child' ? { ...c, name: 'Family Member' } : c))
                        : [{ id: 'child_1', name: 'Family Member' }],
                    selectedWeek: parsed.selectedWeek || getMondayIsoString(new Date()),
                    activeView: (parsed.activeView === 'early_reader' || parsed.activeView === 'daily') ? 'daily' : 'weekly',
                    calendarDateMode: parsed.calendarDateMode || 'dated',
                    lastPrinted: parsed.lastPrinted || null,
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
                let childName = (parsedV1.childName && parsedV1.childName.trim()) || 'Family Member';
                if (childName === 'Child') childName = 'Family Member';
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
                    calendarDateMode: 'dated',
                    lastPrinted: null,
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
        state.calendarDateMode = 'dated';
        state.lastPrinted = null;
        state.children = [{ id: 'child_1', name: 'Family Member' }];
    };

    const saveState = () => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) {
            console.error('Error saving state to localStorage:', e);
        }
    };

    // --- STATE ACCESSORS ---
    function getActiveMember() {
        if (!Array.isArray(state.children) || state.children.length === 0) {
            state.children = [{ id: 'child_1', name: 'Family Member' }];
            state.activeChildId = 'child_1';
        }
        return state.children.find(c => c.id === state.activeChildId) || state.children[0];
    }

    function getMemberWeekTasks(memberId) {
        if (!state.schedules[memberId]) {
            state.schedules[memberId] = {};
        }
        if (!state.schedules[memberId][state.selectedWeek]) {
            state.schedules[memberId][state.selectedWeek] = [];
        }
        return state.schedules[memberId][state.selectedWeek];
    }

    function getCurrentWeekTasks() {
        const activeMember = getActiveMember();
        return getMemberWeekTasks(activeMember.id);
    }

    function setCurrentWeekTasks(tasks) {
        const activeMember = getActiveMember();
        if (!state.schedules[activeMember.id]) {
            state.schedules[activeMember.id] = {};
        }
        state.schedules[activeMember.id][state.selectedWeek] = tasks;
        saveState();
    }

    // --- RENDERING ---
    function renderFamilyMemberChips() {
        if (!childTabsContainer) return;

        // Remember which member IDs were checked before re-rendering
        const previouslyChecked = new Set();
        const existingCheckboxes = document.querySelectorAll('input[name="assignChild"]');
        existingCheckboxes.forEach(cb => {
            if (cb.checked) previouslyChecked.add(cb.value);
        });

        // Default to active member if nothing was selected
        if (previouslyChecked.size === 0) {
            previouslyChecked.add(state.activeChildId);
        }

        childTabsContainer.innerHTML = '';
        state.children.forEach(member => {
            const isViewing = (member.id === state.activeChildId);

            const chip = document.createElement('div');
            chip.className = `family-chip ${isViewing ? 'active-viewing' : ''}`;

            // Checkbox for task assignment
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.name = 'assignChild';
            checkbox.value = member.id;
            checkbox.className = 'family-chip-checkbox';
            checkbox.id = `assign_${member.id}`;
            checkbox.checked = previouslyChecked.has(member.id);
            checkbox.title = `Check to assign new task to ${member.name}`;

            checkbox.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            // Member label & viewing badge
            const label = document.createElement('label');
            label.className = 'family-chip-label';
            label.htmlFor = `assign_${member.id}`;

            const nameSpan = document.createElement('span');
            nameSpan.className = 'family-chip-name';
            nameSpan.textContent = member.name;
            label.appendChild(nameSpan);

            if (isViewing) {
                const viewingBadge = document.createElement('span');
                viewingBadge.className = 'viewing-badge';
                viewingBadge.textContent = 'Viewing';
                viewingBadge.title = `Currently viewing ${member.name}'s schedule`;
                label.appendChild(viewingBadge);
            }

            // Clicking the chip background switches active schedule view to this member
            chip.addEventListener('click', (e) => {
                if (e.target !== checkbox) {
                    if (state.activeChildId !== member.id) {
                        state.activeChildId = member.id;
                        saveState();
                        renderAll();
                    }
                }
            });

            chip.appendChild(checkbox);
            chip.appendChild(label);
            childTabsContainer.appendChild(chip);
        });
    }

    function syncChildAssignChips() {
        const checkboxes = document.querySelectorAll('input[name="assignChild"]');
        if (checkboxes.length === 0) return;
        const checkedCount = Array.from(checkboxes).filter(cb => cb.checked).length;
        if (checkedCount <= 1) {
            checkboxes.forEach(cb => {
                cb.checked = (cb.value === state.activeChildId);
            });
        }
    }

    function syncCalendarDateRadios() {
        const mode = state.calendarDateMode || 'dated';
        calendarDateRadios.forEach(radio => {
            radio.checked = (radio.value === mode);
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

    // Render VIEW 1: Weekly Grid
    function renderWeeklySchedule() {
        const activeMember = getActiveMember();
        const currentTasks = getCurrentWeekTasks();

        displayName.textContent = activeMember.name ? `${activeMember.name}'s Schedule` : "Family Member's Schedule";
        
        // Requirement 6: Display Date mode
        if (state.calendarDateMode === 'general') {
            displayDate.textContent = 'General Weekly Routine (Reusable)';
        } else {
            displayDate.textContent = `Week of ${formatDate(state.selectedWeek)}`;
        }
        weekDateInput.value = state.selectedWeek;

        scheduleGrid.innerHTML = '';

        DAYS.forEach((day, dayIndex) => {
            const dayColumn = document.createElement('div');
            dayColumn.className = 'day-column';
            
            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-column-header';

            const dayTitle = document.createElement('h3');
            dayTitle.textContent = day;
            dayHeader.appendChild(dayTitle);

            // Requirement 6: Add numerical date under day name if dated mode
            if (state.calendarDateMode === 'dated') {
                const parts = state.selectedWeek.split('-');
                const mon = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
                const dayDate = new Date(mon);
                dayDate.setDate(mon.getDate() + dayIndex);
                const monthShort = dayDate.toLocaleDateString('en-US', { month: 'short' });
                
                const dateSpan = document.createElement('span');
                dateSpan.className = 'day-numerical-date';
                dateSpan.textContent = `${monthShort} ${dayDate.getDate()}`;
                dayHeader.appendChild(dateSpan);
            }

            dayColumn.appendChild(dayHeader);

            let dayHasTasks = false;

            TIME_BLOCKS.forEach(block => {
                const tasksForBlock = currentTasks.filter(t => t.day === day && t.time === block);

                if (tasksForBlock.length > 0) {
                    dayHasTasks = true;
                    const timeBlockDiv = document.createElement('div');
                    timeBlockDiv.className = 'time-block';
                    
                    const blockHeader = document.createElement('h4');
                    const blockIcon = block === 'Morning' ? '🌅' : block === 'Snack' ? '🍎' : block === 'Lunch' ? '🥪' : block === 'Afternoon' ? '☀️' : '🌙';
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

                        // Visual icon badge
                        const taskIconSpan = document.createElement('span');
                        taskIconSpan.className = 'task-icon';
                        taskIconSpan.textContent = task.icon || '⭐';

                        // Task text
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

                        // Action Buttons (Edit & Delete)
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

    // Render VIEW 2: Daily View (Picture Routine Cards)
    function renderEarlyReaderBoard() {
        const activeMember = getActiveMember();
        const currentTasks = getCurrentWeekTasks();
        const selectedDay = state.selectedReaderDay || 'Monday';

        readerDisplayName.textContent = activeMember.name ? `${activeMember.name}'s Daily Routine` : "Family Member's Daily Routine";

        // Requirement 6: Date formatting in daily view
        if (state.calendarDateMode === 'dated') {
            const dayIndex = DAYS.indexOf(selectedDay);
            const parts = state.selectedWeek.split('-');
            const mon = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
            const dayDate = new Date(mon);
            dayDate.setDate(mon.getDate() + (dayIndex >= 0 ? dayIndex : 0));
            const fullDateStr = dayDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
            readerDisplayDate.textContent = fullDateStr;
        } else {
            readerDisplayDate.textContent = `${selectedDay} Routine (General)`;
        }

        // Render Day Selector Tabs
        readerDaySelector.innerHTML = '';
        DAYS.forEach(day => {
            const dayBtn = document.createElement('button');
            dayBtn.type = 'button';
            dayBtn.className = `reader-day-btn ${day === selectedDay ? 'active' : ''}`;
            dayBtn.textContent = day.substr(0, 3);
            dayBtn.title = `View ${day}'s routine`;
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
            blockCard.className = 'reader-block-card';

            const blockHeader = document.createElement('div');
            blockHeader.className = 'reader-block-header';

            const blockIcon = block === 'Morning' ? '🌅' : block === 'Snack' ? '🍎' : block === 'Lunch' ? '🥪' : block === 'Afternoon' ? '☀️' : '🌙';
            const blockTitle = document.createElement('h3');
            blockTitle.textContent = `${blockIcon} ${block}`;

            const countBadge = document.createElement('span');
            countBadge.className = 'reader-block-count';
            countBadge.textContent = `${blockTasks.length} task${blockTasks.length === 1 ? '' : 's'}`;

            blockHeader.appendChild(blockTitle);
            blockHeader.appendChild(countBadge);
            blockCard.appendChild(blockHeader);

            if (blockTasks.length === 0) {
                const emptyMsg = document.createElement('div');
                emptyMsg.className = 'reader-empty-msg';
                emptyMsg.textContent = 'No routines scheduled for this time.';
                blockCard.appendChild(emptyMsg);
            } else {
                const taskCardsList = document.createElement('div');
                taskCardsList.className = 'reader-task-cards';

                blockTasks.forEach(task => {
                    const cardItem = document.createElement('div');
                    cardItem.className = `reader-card-item ${task.completed ? 'completed' : ''}`;

                    // Left: Large visual icon
                    const iconBox = document.createElement('div');
                    iconBox.className = 'reader-card-icon';
                    iconBox.textContent = task.icon || '⭐';

                    // Middle: Text & Priority Tag
                    const contentBox = document.createElement('div');
                    contentBox.className = 'reader-card-content';

                    const titleSpan = document.createElement('div');
                    titleSpan.className = 'reader-card-title';
                    titleSpan.textContent = task.name;
                    contentBox.appendChild(titleSpan);

                    if (task.mustDo) {
                        const tag = document.createElement('span');
                        tag.className = 'reader-card-tag';
                        tag.textContent = '⭐ Priority';
                        contentBox.appendChild(tag);
                    }

                    // Right: Actions (Read Aloud speaker & Checkmark)
                    const actionsBox = document.createElement('div');
                    actionsBox.className = 'reader-card-actions';

                    const speakBtn = document.createElement('button');
                    speakBtn.type = 'button';
                    speakBtn.className = 'btn-speak no-print';
                    speakBtn.textContent = '🔊';
                    speakBtn.title = `Listen to "${task.name}" read aloud`;
                    speakBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        speakTask(task.name, task.time);
                    });

                    const checkMark = document.createElement('button');
                    checkMark.type = 'button';
                    checkMark.className = `reader-card-check ${task.completed ? 'checked' : ''}`;
                    checkMark.textContent = task.completed ? '✓' : '';
                    checkMark.title = task.completed ? 'Completed' : 'Tap to complete';
                    checkMark.addEventListener('click', () => {
                        toggleTaskCompleted(task.id);
                    });

                    actionsBox.appendChild(speakBtn);
                    actionsBox.appendChild(checkMark);

                    cardItem.appendChild(iconBox);
                    cardItem.appendChild(contentBox);
                    cardItem.appendChild(actionsBox);

                    // Clicking the card body also toggles completion
                    cardItem.addEventListener('click', (e) => {
                        if (e.target.closest('.btn-speak')) return;
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
    function speakTask(taskName) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const textToSay = `${taskName}`;
            const utterance = new SpeechSynthesisUtterance(textToSay);
            utterance.rate = 0.9;
            utterance.pitch = 1.05;
            window.speechSynthesis.speak(utterance);
        }
    }

    function switchViewMode(mode) {
        const isDaily = (mode === 'daily' || mode === 'early_reader');
        state.activeView = isDaily ? 'daily' : 'weekly';
        saveState();

        if (isDaily) {
            if (viewDailyBtn) viewDailyBtn.classList.add('active');
            if (viewWeeklyBtn) viewWeeklyBtn.classList.remove('active');
            printableArea.style.display = 'none';
            earlyReaderView.style.display = 'block';
            printHint.textContent = "Prints today's daily visual routine card sheet for the fridge or bedroom door";
            renderEarlyReaderBoard();
        } else {
            if (viewWeeklyBtn) viewWeeklyBtn.classList.add('active');
            if (viewDailyBtn) viewDailyBtn.classList.remove('active');
            printableArea.style.display = 'block';
            earlyReaderView.style.display = 'none';
            printHint.textContent = "Fits cleanly onto landscape letter paper for your fridge";
            renderWeeklySchedule();
        }
    }

    function renderAll() {
        renderFamilyMemberChips();
        syncCalendarDateRadios();
        renderPrintStatus();
        updateTaskHistoryDatalist();
        if (state.activeView === 'daily' || state.activeView === 'early_reader') {
            switchViewMode('daily');
        } else {
            switchViewMode('weekly');
        }
    }

    // --- FAMILY MEMBER PROFILE ACTIONS ---
    function addChild() {
        const name = prompt("Enter the family member's name:");
        if (!name || !name.trim()) return;

        const newId = `child_${Date.now()}`;
        state.children.push({ id: newId, name: name.trim() });
        state.activeChildId = newId;
        saveState();
        renderAll();
    }

    function renameChild() {
        const activeMember = getActiveMember();
        const newName = prompt(`Enter new name for ${activeMember.name}:`, activeMember.name);
        if (!newName || !newName.trim()) return;

        activeMember.name = newName.trim();
        saveState();
        renderAll();
    }

    function deleteChild() {
        const activeMember = getActiveMember();
        if (state.children.length <= 1) {
            alert('You must have at least one family member profile.');
            return;
        }

        if (confirm(`Are you sure you want to delete ${activeMember.name} and all their weekly schedules?`)) {
            delete state.schedules[activeMember.id];
            state.children = state.children.filter(c => c.id !== activeMember.id);
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
        saveState();
        renderAll();
    }

    function copyPreviousWeekSchedule() {
        const activeMember = getActiveMember();
        const prevWeekDate = addWeeksToIsoDate(state.selectedWeek, -1);
        const memberSchedules = state.schedules[activeMember.id] || {};
        const prevWeekTasks = memberSchedules[prevWeekDate] || [];

        if (prevWeekTasks.length === 0) {
            alert(`No tasks found in the previous week (${formatDate(prevWeekDate)}) for ${activeMember.name}.`);
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
        showToast(`📋 Copied ${clonedTasks.length} tasks from last week!`);
    }

    function clearThisWeek() {
        const activeMember = getActiveMember();
        const currentTasks = getCurrentWeekTasks();
        if (currentTasks.length === 0) return;

        if (confirm(`Clear all tasks for ${activeMember.name} on the week of ${formatDate(state.selectedWeek)}?`)) {
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

    function getSelectedAssignMembers() {
        const selected = [];
        const checkboxes = document.querySelectorAll('input[name="assignChild"]');
        checkboxes.forEach(cb => {
            if (cb.checked) selected.push(cb.value);
        });
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

        const targetMemberIds = getSelectedAssignMembers();
        if (targetMemberIds.length === 0) {
            alert('Please select at least one family member to assign this task to.');
            return;
        }

        const time = timeOfDaySelect.value;
        const mustDo = isMustDoCheckbox.checked;
        const icon = state.selectedTaskIcon || detectIconForTask(name);
        const isRecurring = selectedDays.length > 1;

        // Add task for each selected member
        targetMemberIds.forEach((memberId) => {
            const memberTasks = getMemberWeekTasks(memberId);
            const recurringGroupId = isRecurring ? `rec_${Date.now()}_${memberId}_${Math.random().toString(36).substr(2, 5)}` : null;

            selectedDays.forEach((day, idx) => {
                memberTasks.push({
                    id: `task_${Date.now()}_${memberId}_${idx}_${Math.random().toString(36).substr(2, 4)}`,
                    name: name,
                    icon: icon,
                    day: day,
                    time: time,
                    mustDo: mustDo,
                    completed: false,
                    recurringGroupId: recurringGroupId
                });
            });

            if (!state.schedules[memberId]) {
                state.schedules[memberId] = {};
            }
            state.schedules[memberId][state.selectedWeek] = memberTasks;
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

        if (task.recurringGroupId) {
            const seriesTasks = currentTasks.filter(t => t.recurringGroupId === task.recurringGroupId && t.id !== task.id);
            if (seriesTasks.length > 0) {
                const updateAll = confirm(`Update task details across all other recurring days this week?`);
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
                        children: Array.isArray(imported.children) && imported.children.length > 0 ? imported.children : [{ id: 'child_1', name: 'Family Member' }],
                        selectedWeek: imported.selectedWeek || getMondayIsoString(new Date()),
                        activeView: (imported.activeView === 'early_reader' || imported.activeView === 'daily') ? 'daily' : 'weekly',
                        calendarDateMode: imported.calendarDateMode || 'dated',
                        lastPrinted: imported.lastPrinted || null,
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
                    showToast("✅ Schedule data imported successfully!");
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

    if (viewWeeklyBtn) {
        viewWeeklyBtn.addEventListener('click', () => switchViewMode('weekly'));
    }
    if (viewDailyBtn) {
        viewDailyBtn.addEventListener('click', () => switchViewMode('daily'));
    }

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

    // Family Member Assign Presets
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

    // Calendar Date Mode radios
    calendarDateRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.checked) {
                state.calendarDateMode = e.target.value;
                saveState();
                renderAll();
            }
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

    // Print Listener & Tracking
    printBtn.addEventListener('click', () => {
        window.print();
        setTimeout(() => {
            if (!state.lastPrinted || (Date.now() - state.lastPrinted.time > 4000)) {
                markCalendarAsPrinted();
            }
        }, 1200);
    });

    window.addEventListener('afterprint', () => {
        markCalendarAsPrinted();
    });

    exportDataBtn.addEventListener('click', exportBackup);
    importFileInput.addEventListener('change', importBackup);

    // --- SERVICE WORKER & OFFLINE SUPPORT ---
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js').catch((err) => {
                console.log('SW registration error:', err);
            });
        });
    }

    function updateNetworkStatus() {
        if (!offlineStatus) return;
        if (navigator.onLine) {
            offlineStatus.textContent = '📶 Offline Ready';
            offlineStatus.className = 'offline-badge';
            offlineStatus.title = 'Works 100% offline — all changes save automatically to your device';
        } else {
            offlineStatus.textContent = '⚡ Offline Mode';
            offlineStatus.className = 'offline-badge offline-active';
            offlineStatus.title = 'You are currently offline. All changes are saved locally to your device.';
            showToast('⚡ Offline mode: All changes are saved locally to your device.');
        }
    }

    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    updateNetworkStatus();

    // PWA Install Prompt handling
    let deferredPrompt = null;
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (installPwaBtn) {
            installPwaBtn.style.display = 'inline-flex';
            installPwaBtn.addEventListener('click', () => {
                installPwaBtn.style.display = 'none';
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then(() => {
                    deferredPrompt = null;
                });
            });
        }
    });

    // --- INITIAL STARTUP ---
    loadState();
    setSelectedFormIcon('🪥', false);
    renderAll();
});
