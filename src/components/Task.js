import React from 'react';
import PropTypes from 'prop-types'

import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import LinearProgress from '@mui/material/LinearProgress';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import Checkbox from '@mui/material/Checkbox';

import {
	handleResetTask,
	handleUpdateTask,
	toggleEditModeAction,
	updateTaskNameAction,
	updateTaskDaysAction,
	toggleSelectTaskAction
} from '../redux/store';
import { useDispatch } from 'react-redux';
import { calcProgress, isPaused, calcPauseRestDays } from '../Constants/StaticFunctions';

const Task = (props) => {

	const { task, editModeTasks} = props;
    const dispatch = useDispatch();

    const resetTask = () => {
        dispatch(handleResetTask(task));
    }

    const toggleEditMode = () => {
        dispatch(toggleEditModeAction(task.id));
    }

    const handleSaveTask = () => {
    	dispatch(handleUpdateTask(task.id, task.name, task.days_repeat));
    	toggleEditMode();
    }

    const handleChangeName = (name) => {
    	dispatch(updateTaskNameAction(task.id, name));
    }

    const handleChangeDays = (days_repeat) => {
    	dispatch(updateTaskDaysAction(task.id, days_repeat));	
    }

    const handleChangeSelected = () => {
    	dispatch(toggleSelectTaskAction(task.id));
    }

    if (task.isVisible === false) {
    	return null
    }

    const subText = isPaused(task) ? 'Paused for ' + calcPauseRestDays(task.pause[0]) + ' more days' : 'repeat interval (days): ' + task.days_repeat

	return(
		<Stack direction='column'>
			<Stack
		        sx={{
		            width: '100%',
		            bgcolor: 'grey.300',
		            borderRadius: 2,
		            border: '2px grey',
		        }}
		        direction='row'
		        justifyContent='space-between'
	            alignItems='center'
		    >
		        
	        	{
	        		editModeTasks ? (
		        		<Checkbox
		        			checked={task.isSelected}
		        			onChange={() => handleChangeSelected()}
		        			color='default'
						/>	
			        ) : ''
	        	}
	            {
	            	task.editMode ?
	                (
	                	<Stack direction='column'>	
	                		<TextField
					            label='Task Name'
								onChange={(event) => handleChangeName(event.target.value)}
								name='name'
								type='text'
								margin='normal'
								defaultValue={task.name}
								variant='outlined'
								color='primary'
							/>
							<TextField
					            label="repeat interval (days):"
								onChange={(event) => handleChangeDays(event.target.value)}
								name='interval'
								type='number'
								margin='normal'
								defaultValue={task.days_repeat}
								variant='outlined'
								color='primary'
	        				/>
	        			</Stack>
	    			)
					: 
					(
						<Stack direction='column' sx={{ml: editModeTasks ? 0 : 4}}>
							<Typography variant='h7' component='div'>
								{task.name}
							</Typography>
							<Typography variant='body2' component='div'>
								{subText}
							</Typography>
						</Stack>
					)
				}
				{
					! editModeTasks && ! isPaused(task) ? (<IconButton onClick={() => resetTask()} aria-label="reset">
						<CheckBoxIcon />
					</IconButton>) : ''
				}
				{
					task.editMode && editModeTasks ? (<IconButton onClick={() => handleSaveTask()} aria-label="save">
							<SaveIcon />
						</IconButton>
					) : editModeTasks ? 
						(<IconButton onClick={() => toggleEditMode()} aria-label="edit">
							<EditIcon />
						</IconButton>
					) : ''
				}
			</Stack>
	        <LinearProgress
	            key={task.id}
	            color={calcProgress(task) < 85 ? 'primary' : 'secondary'}
	            sx={{
	                '& .MuiLinearProgress-barColorPrimary': {
	                    bgcolor: "green",
	                },
	                '& .MuiLinearProgress-barColorSecondary': {
	                    bgcolor: "red",
	                    opacity: 0.6,
	                },
	                height: 10,
	                borderRadius: 2,
	            }}
	            variant='determinate'
	            value={calcProgress(task)}
	        />
	    </Stack>
	)

}

Task.propTypes = {
	task: PropTypes.object,
	editModeTasks: PropTypes.bool
};

export default Task;