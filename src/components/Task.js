import React from 'react';
import PropTypes from 'prop-types'

import { handleRemoveTask, handleResetTask } from '../redux/store';
import { useDispatch } from 'react-redux';

const Task = (props) => {


	const { task, loading } = props;
    const dispatch = useDispatch();

    const removeTask = task => {
        dispatch(handleRemoveTask(task));
    }

    const resetTask = task => {
        dispatch(handleResetTask(task));
    }

    if (loading === true) {
        return (<h3>Loading...</h3>)
    }

	return(
		<li key={task.id} className='task-list-item'>
			<div className='task-details'>
				<p>{task.name}</p>
				<p>to repeat in {task.days_repeat} days</p>
			</div>
			<button onClick={() => resetTask(task)} className='task-reset'>
				Reset
			</button>
			<button onClick={() => removeTask(task)} className='task-remove'>
				Remove
			</button>
		</li>
	)

}

Task.propTypes = {
	task: PropTypes.object,
	loading: PropTypes.bool
};

export default Task;