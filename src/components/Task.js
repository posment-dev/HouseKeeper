import React from 'react';
import PropTypes from 'prop-types'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import LinearProgress from '@mui/material/LinearProgress';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import Checkbox from '@mui/material/Checkbox';

import {
	handleRemoveTask,
	handleResetTask,
	handleUpdateTask,
	toggleEditModeAction,
	updateTaskNameAction,
	updateTaskDaysAction,
	refreshSortTasksAction,
	toggleSelectTaskAction
} from '../redux/store';
import { useDispatch } from 'react-redux';
import { calcProgress } from '../Constants/StaticFunctions';

const Task = (props) => {


	const { task, isVisible} = props;
    const dispatch = useDispatch();

    const removeTask = () => {
    	confirmAlert({
			title: 'Confirm to Delete',
			message: 'Are you sure?',
			buttons: [
				{
			  		label: 'Yes',
			  		onClick: () => dispatch(handleRemoveTask(task)),
				},
				{
			  		label: 'Cancel',
				}
			]
		});
    }

    /*const removeTask = () => {
    	dispatch(handleRemoveTask(task));
    }*/

    const resetTask = () => {
        dispatch(handleResetTask(task));
        dispatch(refreshSortTasksAction());
    }

    const toggleEditMode = () => {
        dispatch(toggleEditModeAction(task.id));
    }

    const handleSaveTask = () => {
    	dispatch(handleUpdateTask(task.id, task.name, task.days_repeat));
    	toggleEditMode();
    	dispatch(refreshSortTasksAction());
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

    if (isVisible === false) {
    	return null
    }

	return(
		<Box
	        sx={{
	            width: '100%',
	            bgcolor: 'grey.300',
	            borderRadius: 2,
	            border: '2px grey',
	            '&:hover': {
	                bgcolor: 'grey.400',
	            },
	        }}
	    >
	        <Grid container spacing={2}>
	        	<Grid item xs='auto'>
	        		<Checkbox
	        			checked={task.isSelected}
	        			onChange={() => handleChangeSelected()}
	        			color='default'
					/>
	        	</Grid>
	            <Grid item xs={6}>    
	                {
	                	task.editMode ? (<TextField
								            label='Task Name'
											onChange={(event) => handleChangeName(event.target.value)}
											name='name'
											type='text'
											margin='normal'
											defaultValue={task.name}
											variant='outlined'
											color='primary'
						/>) : (<Typography variant='h7' component='div'>
				                    {task.name}
				                </Typography>
				        )
	                }
	                {
	                	task.editMode ? (<TextField
								            label="repeat interval (days):"
											onChange={(event) => handleChangeDays(event.target.value)}
											name='interval'
											type='number'
											margin='normal'
											defaultValue={task.days_repeat}
											variant='outlined'
											color='primary'
		                />) : (<Typography variant='body2' component='div'>
				                    repeat interval (days): {task.days_repeat}
				                </Typography>)
	                }
	            </Grid>
	            <Grid item xs={5} container justifyContent='flex-end'>
	                {
	                	! task.editMode ? (<IconButton onClick={() => resetTask()} aria-label="reset">
		                    <CheckBoxIcon />
		                </IconButton>) : ('')
	            	}
	            	{
	            		task.editMode ? (<IconButton onClick={() => handleSaveTask()} aria-label="save">
				                    <SaveIcon />
				                </IconButton>
	            		) : (<IconButton onClick={() => toggleEditMode()} aria-label="edit">
			                    <EditIcon />
			                </IconButton>
	            		)
	            	}
	            	{
	            		! task.editMode ? (<IconButton onClick={() => removeTask()} aria-label="delete">
	                    	<DeleteIcon />
	                	</IconButton>) : ('')
	            	}
	            </Grid>
	        </Grid>
	        <LinearProgress
	            key={task.id}
	            color={calcProgress(task.last_reset, task.days_repeat) < 85 ? 'primary' : 'secondary'}
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
	            value={calcProgress(task.last_reset, task.days_repeat)}
	        />
	    </Box>
	)

}

Task.propTypes = {
	task: PropTypes.object,
	loading: PropTypes.bool
};

export default Task;