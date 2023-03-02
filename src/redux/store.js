import { createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';
import { SortByEnum } from '../Constants/Enums'
import { calcProgress } from '../Constants/StaticFunctions';

//const URL = 'http://127.0.0.1:5000/api/v1/'
const URL = 'http://192.168.1.221:5000/api/v1/'
const TASKS_API_URL = URL + 'tasks'
const BUDGET_API_URL = URL + 'budget'

const SORTING_DEFAULT = SortByEnum.name

// Changing Tasks
const ADD_TASK = 'ADD_TASK'
const SET_TASKS = 'SET_TASKS'
const REMOVE_TASK = 'REMOVE_TASK'
const UPDATE_TASK = 'UPDATE_TASK'
const UPDATE_NAME = 'UPDATE_NAME'
const UPDATE_DAYS = 'UPDATE_DAYS'
const UPDATE_PROGRESS = 'UPDATE_PROGRESS'
const RESET_TIME_TASK = 'RESET_TIME_TASK'
const TOGGLE_EDIT_MODE = 'TOGGLE_EDIT_MODE'
const PAUSE_TASK = 'PAUSE_TASK'
const REMOVE_PAUSE = 'REMOVE_PAUSE'
const TOGGLE_SELECT_TASK = 'TOGGLE_SELECT_TASK'
const DESELECT_ALL_TASKS = 'DESELECT_ALL_TASKS'
const SELECT_ALL_TASKS = 'SELECT_ALL_TASKS'
// Changing UI
const SORT_TASK_LIST = 'SORT_TASK_LIST'
const UPDATE_SORTBY = 'UPDATE_SORTBY'
const UPDATE_FILTER = 'UPDATE_FILTER'
const FILTER_TASKS = 'FILTER_TASKS'
const TOGGLE_FULL_EDIT_MODE = 'TOGGLE_FULL_EDIT_MODE'
const TOGGLE_SET_PAUSE_INPUT = 'TOGGLE_SET_PAUSE_INPUT'
const UPDATE_PAUSE_INPUT = 'UPDATE_PAUSE_INPUT'


function addTaskAction (task) {
    return {
    type: ADD_TASK,
    task,
    }
}

export function handleAddTask(task, cb = () => {}) {
    return (dispatch, getState) => {
        let newId = 1;
        if (getState().tasks.length > 0) {
            newId = 1 + Math.max.apply(null, getState().tasks.map(t => t.id));
        }
        const newTask = {
            ...task,
            id: newId,
        }
        dispatch(addTaskAction(newTask));
        dispatch(refreshSortTasksAction());
        return axios.post(TASKS_API_URL, {
            name: task.name,
            days_repeat: task.days_repeat
        })
        .then(() => cb() )
        .catch((err) => {
        console.log(err);
        dispatch(removeTaskAction(newId));
        alert('Add new Task failed. Try again.');
        })
    }
}

export function setTasksAction (tasks) {
    return {
    type: SET_TASKS,
    tasks,
    }
}

function removeTaskAction (id) {
    return {
    type: REMOVE_TASK,
    id,
    }
}

export function handleRemoveTask(task, cb = () => {}) {
    return async (dispatch) => {
        dispatch(removeTaskAction(task.id));
        return axios.delete(TASKS_API_URL + '/' + task.id)
        .then(() => cb() )
        .catch((err) => {
            console.log(err);
            dispatch(addTaskAction(task));
            alert('Deleting Task failed. Try again.');
        })
    }
}

export function handleRemoveSelectedTasks(cb = () => {}) {
    return (dispatch, getState) => {
        const selected = getState().tasks.reduce((filtered, task) => {
            if (task.isSelected === true) {
                return [...filtered, task];
            }
            return filtered;
        }, []);
        selected.forEach(t => dispatch(removeTaskAction(t.id)));
        const selectedIds = selected.map(t => t.id);
        const body = {data: JSON.stringify(selectedIds)};
        return axios.delete(TASKS_API_URL, body)
        .then(() => cb() )
        .catch((err) => {
            console.log(err);
            selected.forEach(t => dispatch(addTaskAction(t)));
            alert('Deleting Task failed. Try again.');
        })
    }
}

export function updateTaskNameAction (id, name) {
    return {
        type: UPDATE_NAME,
        id,
        name,
    }
}

export function updateTaskDaysAction (id, days_repeat) {
    return {
        type: UPDATE_DAYS,
        id,
        days_repeat,
    }
}

function updateTaskAction (id, name, days_repeat) {
    return {
        type: UPDATE_TASK,
        id,
        name,
        days_repeat,
    }
}

export function handleUpdateTask (id, name, days_repeat, cb = () => {}) {
    return async (dispatch) => {
        dispatch(updateTaskAction(id, name));
        dispatch(refreshSortTasksAction());
        let urlAdd = '?';
        if (name) {
            urlAdd += 'name=' + name + '&';
        }
        if (days_repeat) {
            urlAdd += 'days_repeat=' + days_repeat;
        }
        return axios.put(TASKS_API_URL + '/' + id + urlAdd)
        .then(() => cb() )
        .catch((err) => {
            console.log(err);
            dispatch(handleInitialData());
            alert('Updating Task failed. Try again.');
        })
    }
}

function resetTimeTaskAction (id) {
    return {
        type: RESET_TIME_TASK,
        id,
    }
}

export function handleResetTask(task, cb = () => {}) {
    return async (dispatch) => {
        dispatch(resetTimeTaskAction(task.id));
        dispatch(refreshSortTasksAction());
        return axios.put(TASKS_API_URL + '/reset/' + task.id)
        .then(() => cb() )
        .catch((err) => {
            console.log(err);
            dispatch(updateTaskAction(task));
            alert('Reseting Task failed. Try again.');
        })
    }
}

export function updateProgressAction () {
    return {
        type: UPDATE_PROGRESS,
    }
}

export function toggleEditModeAction (id) {
    return {
        type: TOGGLE_EDIT_MODE,
        id,
    }
}

function sortTaskListAction (sortByValue) {
    return {
        type: SORT_TASK_LIST,
        sortByValue,
    }
}

function updateSortByAction (sortByValue) {
    return {
        type: UPDATE_SORTBY,
        sortByValue,
    }
}

export function refreshSortTasksAction () {
    return (dispatch, getState) => {
        const currSortBy = getState().sortBy;
        dispatch(sortTaskListAction(currSortBy))
    }
}

export function handleUpdateSort (sortByValue) {
    return dispatch => {
        dispatch(updateSortByAction(sortByValue));
        dispatch(sortTaskListAction(sortByValue))
    }
}

export function toggleSelectTaskAction (id) {
    return {
        type: TOGGLE_SELECT_TASK,
        id,
    }
}

export function selectAllTasksAction () {
    return {
        type: SELECT_ALL_TASKS,
    }
}

export function deselectAllTasksAction () {
    return {
        type: DESELECT_ALL_TASKS,
    }
}

function pauseTaskAction (taskId, duration) {
    return {
        type: PAUSE_TASK,
        taskId,
        duration,
    }
}

export function handlePauseSelectedTask (duration, cb = () => {}) {
    return async (dispatch, getState) => {
        const selected = getState().tasks.filter( task => {
            if (task.isSelected === true) {
                return task;
            }
            return null;
        });
        let pauseMap = new Map();
        selected.forEach(t => {
            dispatch(pauseTaskAction(t.id, duration));
            pauseMap.set(t.id, duration);
        });
        const body = Object.fromEntries(pauseMap);
        console.log(body);
        return axios.put(TASKS_API_URL + '/pauses', body)
        .then(() => cb() )
        .catch((err) => {
            console.log(err);
            selected.forEach(t => dispatch(removePauseAction(t.id)));
            alert('Reseting Task failed. Try again.');
        })
    }
}

function removePauseAction (taskId) {
    return {
        type: REMOVE_PAUSE,
        taskId,
    }
}

export function handleRemoveSelectedPause (cb = () => {}) {
    return (dispatch, getState) => {
        const selected = getState().tasks.reduce((filtered, task) => {
            if (task.isSelected === true) {
                if (task.pause.length > 0) {
                    return [...filtered, task.pause[0]];
                }
            }
            return filtered;
        }, []);
        selected.forEach(p => dispatch(removePauseAction(p.taskId)));
        const selectedIds = selected.map(p => p.taskId);
        const body = {data: JSON.stringify(selectedIds)};
        dispatch(refreshSortTasksAction());
        return axios.delete(TASKS_API_URL + '/pauses', body)
        .then(() => cb() )
        .catch((err) => {
        console.log(err);
        selected.forEach(p => dispatch(pauseTaskAction(p.taskId, p.duration)));
        alert('Remove Pause failed. Try again.');
        })
    }
}

export function handleInitialData() {
    return async (dispatch) => {
        return Promise.all([
            axios.get(TASKS_API_URL),
            axios.get(BUDGET_API_URL + '/categories')
        ]).then((values) => {
            console.log(values);
            const Tasks = values[0].data.Tasks
            dispatch(setTasksAction(Tasks));
            dispatch(sortTaskListAction(SORTING_DEFAULT));
            dispatch(setAllCategoriesAction(values[1].data));
        })
    }
}

//helper
function compareTaskByDate (a,b) {
  if ( (100 - calcProgress(a)) * a.days_repeat < (100 - calcProgress(b)) * b.days_repeat ){
    return -1;
  }
  if ( (100 - calcProgress(a)) * a.days_repeat > (100 - calcProgress(b)) * b.days_repeat ){
    return 1;
  }
  return 0;
}

function compareTaskByName (a,b) {
    let nameA = a.name.toLowerCase(),
      nameB = b.name.toLowerCase()
    if ( nameA < nameB ){
        return -1;
    }
    if ( nameA > nameB ){
        return 1;
    }
        return 0;
}

function initialiseTask (task) {
    return {
        ...task,
        isVisible: true,
        isSelected: false,
    }
}

Date.prototype.addMsec = function(msec) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + (msec / 1000 / 60 / 60 / 24));
    return date;
}

//recuder
function tasks (state = [], action) {
    switch(action.type) {
    case ADD_TASK :
        return state.concat([{
            ...initialiseTask(action.task),
            last_reset: new Date(),
            pause: [],
        }]);
    case SET_TASKS :
        return action.tasks.map(task => {
            return initialiseTask(task)
        });
    case REMOVE_TASK :
        return state.filter(task => task.id !== action.id);
    case UPDATE_TASK :
        return state.map((task) => {
            if (task.id !== action.id) {
                return task;
            }
            return {
                ...task,
                name: action.name
        }});
    case UPDATE_NAME :
        return state.map((task) => {
            if (task.id !== action.id) {
                return task;
            }
            return {
                ...task,
                name: action.name
        }});
    case UPDATE_DAYS :
        return state.map((task) => {
            if (task.id !== action.id) {
                return task;
            }
            return {
                ...task,
                days_repeat: action.days_repeat
        }});
    case RESET_TIME_TASK :
        return state.map((task) => {
            if (task.id !== action.id) {
                return task;
            }
            return {
                ...task,
                last_reset: new Date()
        }});
    case UPDATE_PROGRESS :
        return state;
    case TOGGLE_EDIT_MODE : 
        return state.map((task) => {
            if (task.id !== action.id) {
                return task;
            }
            return {
                ...task,
                editMode: ! task.editMode
        }});
    case SORT_TASK_LIST :
        if (action.sortByValue === null) {
            action.sortByValue = store.getState(sortBy);
        }
        if (action.sortByValue === SortByEnum.nextEnding) {
            return state.slice().sort(compareTaskByDate);
        }
        if (action.sortByValue === SortByEnum.name) {
            return state.slice().sort(compareTaskByName);
        }
        return state;
    case FILTER_TASKS :
        if (action.filterValue) {
            return state.slice().map(task => {
                if ( task.name.toLowerCase()
                    .includes(action.filterValue.toLowerCase()) ) {
                    return {
                        ...task,
                        isVisible: true,
                    }
                } else {
                    return {
                        ...task,
                        isVisible: false,
                        isSelected: false,
                    }
                }
            })
        }
        return state.slice().map(task => {
            return {
                ...task,
                isVisible: true,
            }
        })
    case TOGGLE_SELECT_TASK :
        return state.map((task) => {
            if (task.id !== action.id) {
                return task;
            }
            return {
                ...task,
                isSelected: ! task.isSelected
        }});
    case DESELECT_ALL_TASKS :
        return state.map((task) => {
            return {
                ...task,
                isSelected: false
        }});
    case SELECT_ALL_TASKS :
        return state.map((task) => {
            return {
                ...task,
                isSelected: true
        }});
    case PAUSE_TASK :
        return state.map((task) => {
            if (task.id !== action.taskId) {
                return task;
            }
            const newPause = [{
                duration: action.duration,
                starting: new Date(),
                taskId: action.taskId
            }]
            return {
                ...task,
                pause: newPause,
            }
        })
    case REMOVE_PAUSE :
        return state.map((task) => {
            if (task.id !== action.taskId) {
                return task;
            }
            let result = {
                ...task,
                pause: [],
            }
            if (task.pause.length > 0) {
                // calculate and set new last reset date
                const fullMsec = task.pause[0].duration * 24 * 60 * 60;
                const startDate = new Date(task.pause[0].starting);
                const startNowSec = (new Date() - startDate) / 1000;
                const secondsAddLastReset = Math.min(fullMsec, startNowSec);
                let lastReset = new Date(result.last_reset);
                lastReset.setSeconds(lastReset.getSeconds() + secondsAddLastReset);
                console.log(result.last_reset);
                console.log(secondsAddLastReset)
                result.last_reset = lastReset;
                console.log(result.last_reset);
            }
            return result;
        })
    default :
        return state;
    }
}

//reducer
function sortBy (state = SORTING_DEFAULT, action) {
    switch (action.type) {
        case UPDATE_SORTBY :
            return action.sortByValue;
        default :
            return state;
    }
}

function updateFilterAction (filterValue) {
    return {
        type: UPDATE_FILTER,
        filterValue,
    }
}

function filterTasksAction (filterValue) {
    return {
        type: FILTER_TASKS,
        filterValue,
    }
}

export function handleUpdateFilter (filterValue) {
    return dispatch => {
        dispatch(updateFilterAction(filterValue));
        dispatch(filterTasksAction(filterValue));
    }
}

//reducer
function filter (state = '', action) {
    switch (action.type) {
        case UPDATE_FILTER :
            return action.filterValue;
        default :
            return state;
    }
}

export function toggleFullEditModeAction () {
    return {
        type: TOGGLE_FULL_EDIT_MODE,
    }
}

//reducer
function editModeTasks (state = false, action) {
    switch (action.type) {
        case TOGGLE_FULL_EDIT_MODE :
            return ! state;
        default :
            return state;
    }
}

export function updatePauseInputAction (duration) {
    return {
        type: UPDATE_PAUSE_INPUT,
        duration,
    }
}

export function togglePauseInput () {
    return {
        type: TOGGLE_SET_PAUSE_INPUT,
    }
}

//reducer
function pauseInput (state = {show: false, duration: 0}, action) {
    switch (action.type) {
        case TOGGLE_SET_PAUSE_INPUT :
            return {...state, show: ! state.show};
        case UPDATE_PAUSE_INPUT :
            return {...state, duration: action.duration};
        default :
            return state;
    }
}

//reducer
function loading (state = true, action) {
    switch(action.type) {
        case SET_TASKS :
            return false;
        default :
            return state;
    }
}

// Budget Table Tasks
const SET_CATEGORY = 'SET_CATEGORY'
const SET_DEFAULT_CATEGORY_BY_ENTRY = 'SET_DEFAULT_CATEGORY_BY_ENTRY'
const SET_DATE_RANGE = 'SET_DATE_RANGE'
const ADD_ENTRY = 'ADD_ENTRY'
const ADD_SELECTED_ENTRY = 'ADD_SELECTED_ENTRY'
const REMOVE_SELECTED_ENTRY = 'REMOVE_SELECTED_ENTRY'
const SET_ENTRIES = 'SET_ENTRIES'
const SET_CATEGORY_TOTALS = 'SET_CATEGORY_TOTALS'
const SET_ALL_CATEGORIES = 'SET_ALL_CATEGORIES'
const ADJUST_TOTALS = 'ADJUST_TOTALS'
const UPDATE_TOTALS_FROM_ENTRIES = 'UPDATE_TOTALS_FROM_ENTRIES'
const SET_DATE_RANGE_OBJECT = 'SET_DATE_RANGE_OBJECT'

const DATE_RANGE_DEFAULT = getLastMonth();

function dateToString(date) {
    return dateFormat(date.getFullYear() + '-' + (date.getMonth()+1) + '-' + date.getDate());
}

function dateFormat(stringDate) {
    let splitted = stringDate.split('-');
    if (splitted[1].length === 1) {
        splitted[1] = '0' + splitted[1];
    }
    if (splitted[2].length === 1) {
        splitted[2] = '0' + splitted[2];
    }
    return splitted[0] + '-' + splitted[1] + '-' + splitted[2]
}

function getThisMonth() {
    const date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);    
    return {
        from: dateToString(firstDay),
        to: dateToString(date)
    };
}

function getLastMonth() {
    const date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth()-1, 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth(), 0);
    return {
        from: dateToString(firstDay),
        to: dateToString(lastDay)
    };
}

function getLast6Month() {
    const date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth()-6, date.getDate());    
    return {
        from: dateToString(firstDay),
        to: dateToString(date)
    };
}

function getLast12Month() {
    const date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth()-12, date.getDate());    
    return {
        from: dateToString(firstDay),
        to: dateToString(date)
    };
}

function setDateRangeByObjectAction(dateRange) {
    return {
        type: SET_DATE_RANGE_OBJECT,
        dateRange
    }
}

export function handleSetNewDateRangeByDefaults(type, cb = () => {}) {
    return (dispatch) => {
        switch(type) {
            case 'this' :
                dispatch(setDateRangeByObjectAction(getThisMonth()));
                return cb();
            case 'last' :
                dispatch(setDateRangeByObjectAction(getLastMonth()));
                return cb();
            case 'last6' :
                dispatch(setDateRangeByObjectAction(getLast6Month()));
                return cb();
            case 'last12' :
                dispatch(setDateRangeByObjectAction(getLast12Month()));
                return cb();
            default :
                dispatch(setDateRangeByObjectAction(DATE_RANGE_DEFAULT));
                return cb();
        }
    }
}

function addEntryAction(entry) {
    return {
        type: ADD_ENTRY,
        entry
    }
}

function setEntriesAction(entries) {
    return {
        type: SET_ENTRIES,
        entries
    }
}

function setCategoryTotalsAction(totals) {
    return {
        type: SET_CATEGORY_TOTALS,
        totals
    }
}

function setCategoryAction(id, category) {
    return {
        type: SET_CATEGORY,
        id,
        category
    }
}

function adjustTotalsAction(value, oldCategoryName, newCategoryName) {
    return {
        type: ADJUST_TOTALS,
        value,
        oldCategoryName,
        newCategoryName
    }
}

export function handleSetCategory(id, category, cb = () => {}) {
    return async (dispatch, getState) => {
        const entry = getState().entries.find(entry => entry.id === id);
        let oldCategoryName = entry.category;
        dispatch(setCategoryAction(id, category.name));
        dispatch(adjustTotalsAction(entry.value, oldCategoryName, category.name));
        return axios.put(BUDGET_API_URL + '/entries/' + id + '?category=' + category.id)
        .then(() => cb() )
        .catch((err) => {
            console.log(err);
            dispatch(setCategoryAction(id, oldCategoryName));
            dispatch(adjustTotalsAction(entry.value, category.name, oldCategoryName))
            alert('Updating entry category failed. Try again.');
        })
    }
}

function setDefaultCategoryByEntryAction(entry) {
    return {
        type: SET_DEFAULT_CATEGORY_BY_ENTRY,
        entry
    }
}

function updateTotalsFromEntriesAction(entries) {
    return {
        type: UPDATE_TOTALS_FROM_ENTRIES,
        entries
    }
}

export function handleSetDefaultCatByEntry(entry, cb = () => {}) {
    return async (dispatch, getState) => {
        dispatch(setDefaultCategoryByEntryAction(entry));
        dispatch(updateTotalsFromEntriesAction(getState().entries));
        return axios.post(BUDGET_API_URL + '/categories/default?entryId=' + entry.id)
        .then(() => cb() )
        .catch((err) => {
            console.log(err);
            alert('Updating default category failed. Try again.');
        })
    }
}

export function setDateRangeAction(from, to) {
    return {
        type: SET_DATE_RANGE,
        from,
        to
    }
}

export function handleResetTotalsAndEntries(cb = () => {}) {
    return async (dispatch, getState) => {
        const body = getState().dateRange;
        return Promise.all([
            axios.get(BUDGET_API_URL + '/entries', {params: body}),
            axios.get(BUDGET_API_URL + '/categories/totals', {params: body}),
        ]).then((values) => {
            dispatch(setEntriesAction(values[0].data.Entries));
            dispatch(setCategoryTotalsAction(values[1].data));
        })
    }
}

export function handleFilterByDate(cb = () => {}) {
    return async (dispatch, getState) => {
        const dateRange = getState().dateRange;
        dispatch(setDateRangeAction(dateFormat(dateRange.from), dateFormat(dateRange.to)));
        const body = getState().dateRange;
        return Promise.all([
            axios.get(BUDGET_API_URL + '/entries', {params: body}),
            axios.get(BUDGET_API_URL + '/categories/totals', {params: body}),
        ]).then((values) => {
            dispatch(setEntriesAction(values[0].data.Entries));
            dispatch(setCategoryTotalsAction(values[1].data));
        })
    }
}

export function addSelectedEntryAction (entry) {
    return {
        type: ADD_SELECTED_ENTRY,
        entry
    }
}

export function removeSelectedEntryAction (entry) {
    return {
        type: REMOVE_SELECTED_ENTRY,
        entry
    }
}

export function setAllCategoriesAction (categories) {
    return {
        type: SET_ALL_CATEGORIES,
        categories
    }
}

export function handleSetAllCategoriesAction () {
    return async (dispatch) => {
        return axios.get(BUDGET_API_URL + '/categories')
        .then((categories) => {
            dispatch(setAllCategoriesAction(categories.data));
        })
    }
}

//budget reducers
function entries (state = [], action) {
    switch(action.type) {
        case ADD_ENTRY :
            return state.concat(action.entry);
        case SET_CATEGORY :
            return state.map((entry) => {
                if (entry.id !== action.id) {
                    return entry;
                }
                return {
                    ...entry,
                    category: action.category
            }});
        case SET_ENTRIES :
            return action.entries;
        case SET_DEFAULT_CATEGORY_BY_ENTRY :
            return state.map(e => {
                if (e.category === 'Uncategorized' && e.description == action.entry.description) {
                    return {
                        ...e,
                        category: action.entry.category
                    }
                }
                return e;
            });
        default :
            return state;
    }
}

function selectedEntries (state = [], action) {
    switch(action.type) {
        case ADD_SELECTED_ENTRY :
            return state.concat([action.entry]);
        case SET_CATEGORY :
            return state.map((entry) => {
                if (entry.id !== action.id) {
                    return entry;
                }
                return {
                    ...entry,
                    category: action.category
            }});
        case REMOVE_SELECTED_ENTRY :
            return state.filter(entry => entry.id !== action.entry.id);
        default :
            return state;
    }
}

function categories (state = {}, action) {
    switch(action.type) {
        case SET_ALL_CATEGORIES : 
            return action.categories;
        default :
            return state;
    }
}

function totals (state = {}, action) {
    switch(action.type) {
        case SET_CATEGORY_TOTALS :
            return action.totals;
        case ADJUST_TOTALS :
            let newTotals = Object.assign({}, state);
            newTotals[action.oldCategoryName] -= action.value;
            newTotals[action.newCategoryName] += action.value;
            return newTotals;
        case UPDATE_TOTALS_FROM_ENTRIES :
            let newState = Object.assign({}, state);
            Object.keys(newState).forEach(t => newState[t] = 0);
            action.entries.forEach(e => newState[e.category] += e.value);
            return newState;
        default :
            return state;
    }
}


function dateRange (state = DATE_RANGE_DEFAULT, action) {
    switch (action.type) {
        case SET_DATE_RANGE :
            return {
                from: action.from,
                to: action.to
            };
        case SET_DATE_RANGE_OBJECT :
            return action.dateRange;
        default :
            return state;
    }
}


// Common Store Funtions

const checker = (store) => (next) => (action) => {
    return next(action)
}

const logger = (store) => (next) => (action) => {
    console.group(action.type);
    console.log('The action: ', action);
    const result = next(action);
    console.log('The new state: ', store.getState());
    console.groupEnd();
    return result;
}

const store = createStore(combineReducers({
    tasks,
    sortBy,
    filter,
    editModeTasks,
    pauseInput,
    entries,
    categories,
    totals,
    dateRange,
    selectedEntries,
    loading,
}), applyMiddleware(thunk, checker, logger))

export default store;