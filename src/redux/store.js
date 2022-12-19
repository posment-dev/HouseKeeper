import { createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';
import { SortByEnum } from '../Constants/Enums'
import { calcProgress } from '../Constants/StaticFunctions';

const API_URL = 'http://127.0.0.1:5000/api/v1/tasks'
//const API_URL = 'http://192.168.0.221:5000/api/v1/tasks'

const SORTING_DEFAULT = SortByEnum.Name

const ADD_TASK = 'ADD_TASK'
const SET_TASKS = 'SET_TASKS'
const REMOVE_TASK = 'REMOVE_TASK'
const UPDATE_TASK = 'UPDATE_TASK'
const UPDATE_NAME = 'UPDATE_NAME'
const UPDATE_DAYS = 'UPDATE_DAYS'
const UPDATE_PROGRESS = 'UPDATE_PROGRESS'
const RESET_TIME_TASK = 'RESET_TIME_TASK'
const TOGGLE_EDIT_MODE = 'TOGGLE_EDIT_MODE'
const SORT_TASK_LIST = 'SORT_TASK_LIST'
const UPDATE_SORTBY = 'UPDATE_SORTBY'
const UPDATE_FILTER = 'UPDATE_FILTER'
const FILTER_TASKS = 'FILTER_TASKS'

export function addTaskAction (task) {
    return {
    type: ADD_TASK,
    task,
    }
}

export function handleAddTask(task, cb = () => {}) {
    return (dispatch) => {
        dispatch(addTaskAction(task));
        return axios.post(API_URL + '?name=' + task.name + '&days_repeat=' + task.days_repeat)
        .then(() => cb() )
        .catch((err) => {
        console.log(err);
        dispatch(removeTaskAction(task.id));
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

export function removeTaskAction (id) {
    return {
    type: REMOVE_TASK,
    id,
    }
}

export function handleRemoveTask(task, cb = () => {}) {
    return async (dispatch) => {
        dispatch(removeTaskAction(task.id));
        return axios.delete(API_URL + '/' + task.id)
        .then(() => cb() )
        .catch((err) => {
            console.log(err);
            dispatch(addTaskAction(task));
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

export function handleUpdateTaskName (id, name, cb = () => {}) {
    return (dispatch) => {
        dispatch(updateTaskNameAction(id, name));
        return () => cb();
    }
}

export function updateTaskDaysAction (id, days_repeat) {
    return {
        type: UPDATE_DAYS,
        id,
        days_repeat,
    }
}

export function handleUpdateTaskDays (id, days_repeat, cb = () => {}) {
    return (dispatch) => {
        dispatch(updateTaskDaysAction(id, days_repeat));
        return () => cb();
    }
}

export function updateTaskAction (id, name, days_repeat) {
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
        let urlAdd = '?';
        if (name) {
            urlAdd += 'name=' + name + '&';
        }
        if (days_repeat) {
            urlAdd += 'days_repeat=' + days_repeat;
        }
        return axios.put(API_URL + '/' + id + urlAdd)
        .then(() => cb() )
        .catch((err) => {
            console.log(err);
            dispatch(handleInitialData());
            alert('Updating Task failed. Try again.');
        })
    }
}

export function resetTimeTaskAction (id) {
    return {
        type: RESET_TIME_TASK,
        id,
    }
}

export function handleResetTask(task, cb = () => {}) {
    return async (dispatch) => {
        dispatch(resetTimeTaskAction(task.id));
        return axios.put(API_URL + '/reset/' + task.id)
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

export function handleInitialData() {
    return async (dispatch) => {
        return Promise.all([
            axios.get(API_URL),
        ]).then(([tasks]) => {
            console.log(tasks);
            dispatch(setTasksAction(tasks.data.Tasks));
            dispatch(sortTaskListAction(SORTING_DEFAULT));
        })
    }
}


function compareTaskByDate (a,b) {
  if ( (100 - calcProgress(a.last_reset, a.days_repeat)) * a.days_repeat < (100 - calcProgress( b.last_reset, b.days_repeat)) * b.days_repeat ){
    return -1;
  }
  if ( (100 - calcProgress(a.last_reset, a.days_repeat)) * a.days_repeat > (100 - calcProgress( b.last_reset, b.days_repeat)) * b.days_repeat ){
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

//recuders
function tasks (state = [], action) {
    switch(action.type) {
    case ADD_TASK :
        return state.concat([{
            ...action.task,
            last_reset: new Date(),
        }]);
    case SET_TASKS :
        return action.tasks.map(task => {
            return {
                ...task,
                isVisible: true,
            }
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
        if (action.sortByValue === SortByEnum.NextEnding) {
            return state.slice().sort(compareTaskByDate);
        }
        if (action.sortByValue === SortByEnum.Name) {
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
    default :
        return state;
    }
}

function sortBy (state = SORTING_DEFAULT, action) {
    switch (action.type) {
        case UPDATE_SORTBY :
            return action.sortByValue;
        default :
            return state;
    }
}

function filter (state = '', action) {
    switch (action.type) {
        case UPDATE_FILTER :
            return action.filterValue;
        default :
            return state;
    }
}

function loading (state = true, action) {
    switch(action.type) {
        case SET_TASKS :
            return false;
        default :
            return state;
    }

}

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
    loading,
}), applyMiddleware(thunk, checker, logger))

export default store;