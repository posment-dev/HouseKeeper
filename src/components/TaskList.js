import React from 'react';

import Task from './Task';
import MyProgressBar from './MyProgressBar';
import { handleAddTask } from '../redux/store';
import { useDispatch } from 'react-redux';

import PropTypes from 'prop-types';

const TaskList = (props) => {

    const { tasks, loading } = props;
    const dispatch = useDispatch();

    const submitAddTask = (event) => {
        event.preventDefault();
        let task = {
            name: 'newDefaultTask',
            days_repeat: 10,
        }
        dispatch(handleAddTask(task));
    }

    const calcDaysSinceReset = (lastReset) => {
        console.log('Parameter: ' + lastReset);
        const now = new Date();
        const lReset = new Date(lastReset);
        console.log('Today: ' + now);
        // const daysSince = (now.getTime() - lReset.getTime()) / (1000 * 3600 * 24);
        const daysSince = (now.getTime() - lReset.getTime()) / (1000 * 60);
        console.log('Result: ' + daysSince);
        return daysSince;
    }

    if (loading === true) {
        return (<h3>Loading...</h3>)
    }

    return (
        <ol className='task-list'>
            {tasks.map((task) => (
                <div key={task.id}>
                    <Task key={task.id} task={task} loading={loading} />
                    <li key={task.id * -1}>
                        <MyProgressBar maxDays={task.days_repeat} daysSinceReset={calcDaysSinceReset(task.last_reset)}/>
                    </li>
                </div>
            ))}
        </ol>
    );
}

TaskList.propTypes = {
    tasks: PropTypes.array,
    loading: PropTypes.bool
}

export default TaskList;