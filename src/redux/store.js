import { createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000/api/v1/tasks'

const ADD_TASK = 'ADD_TASK'
const SET_TASKS = 'SET_TASKS'
const REMOVE_TASK = 'REMOVE_TASK'
const UPDATE_TASK = 'UPDATE_TASK'
const RESET_TIME_TASK = 'RESET_TIME_TASK'

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
        let indextoUpdate = state.findIndex(task => task.id === action.id);
        state[indextoUpdate] = action.task;
        return state;
    case RESET_TIME_TASK :
        return state
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