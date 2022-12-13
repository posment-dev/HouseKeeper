import { createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api/v1/tasks'

const ADD_TASK = 'ADD_TASK'
const SET_TASKS = 'SET_TASKS'
const REMOVE_TASK = 'REMOVE_TASK'
const UPDATE_TASK = 'UPDATE_TASK'
const RESET_TIME_TASK = 'RESET_TIME_TASK'
const TOGGLE_EDIT_MODE = 'TOGGLE_EDIT_MODE'

export function addTaskAction (task) {
    return {
    type: ADD_TASK,
    task,
    }
}

export function handleAddTask(task, cb = () => {}) {
    return (dispatch) => {
        dispatch(addTaskAction(task));
        return axios.post("http://localhost:5050/task/add", task)
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

export function updateTaskAction (task) {
    return {
        type: UPDATE_TASK,
        task,
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

export function toggleEditModeAction (id) {
    return {
        type: TOGGLE_EDIT_MODE,
        id,
    }
}

export function handleInitialData() {
    return async (dispatch) => {
        return Promise.all([
            axios.get(API_URL),
        ]).then(([tasks]) => {
            console.log(tasks);
            dispatch(setTasksAction(tasks.data.Tasks));
        })
    }
}


//recuders
function tasks (state = [], action) {
    switch(action.type) {
    case ADD_TASK :
        return state.concat([action.task]);
    case SET_TASKS :
        return action.tasks;
    case REMOVE_TASK :
        return state.filter(task => task.id !== action.id);
    case UPDATE_TASK :
        return state.map((task, index) => {
            if (task.id !== action.task.id) {
                return task;
            }
            return {
                ...task,
                ...action.task
        }});
    case RESET_TIME_TASK :
        return state.map((task, index) => {
            if (task.id !== action.id) {
                return task;
            }
            return {
                ...task,
                last_reset: new Date()
        }});
    case TOGGLE_EDIT_MODE : 
        return state.map((task, index) => {
            if (task.id !== action.id) {
                return task;
            }
            return {
                ...task,
                editMode: ! task.editMode
        }});
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
    loading,
}), applyMiddleware(thunk, checker, logger))

export default store;