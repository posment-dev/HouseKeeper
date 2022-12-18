import React from 'react';
import PropTypes from 'prop-types'

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

import { handleRemoveTask, handleResetTask, handleUpdateTask, toggleEditModeAction, handleUpdateTaskName, handleUpdateTaskDays} from '../redux/store';
import { useDispatch } from 'react-redux';

const Task = (props) => {


	const { task, loading } = props;
    const dispatch = useDispatch();

    const removeTask = () => {
        dispatch(handleRemoveTask(task));
    }

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
    	dispatch(handleUpdateTaskName(task.id, name));
    }

    const handleChangeDays = (days_repeat) => {
    	dispatch(handleUpdateTaskDays(task.id, days_repeat));	
    }

    const calcProgress = (last_reset, days_repeat) => {
        const now = new Date();
        const lReset = new Date(last_reset);
        // const daysSince = (now.getTime() - lReset.getTime()) / (1000 * 3600 * 24);
        const daysSince = (now.getTime() - lReset.getTime()) / (1000 * 60);
        return Math.min(100 * daysSince / days_repeat, 100);
    }

    if (loading === true) {
        return (<h3>Loading...</h3>)
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
	            <Grid item  xs={5} md={4} sx={{marginTop:1, marginBottom:1}}>    
	                {
	                	task.editMode ? (<TextField
								            label='Task Name'
											onChange={(event) => handleChangeName(event.target.value)}
											name='name'
											type='text'
											defaultValue={task.name}
											variant='outlined'
											color='primary'
						/>) : (<Typography variant='h6' component='div'>
				                    {task.name}
				                </Typography>
				        )
	                }
	            </Grid>
	            <Grid item xs={3} md={2} sx={{marginTop:1, marginBottom:1}}>
	                {
	                	task.editMode ? (<TextField
								            label="repeat interval (days):"
											onChange={(event) => handleChangeDays(event.target.value)}
											name='interval'
											type='number'
											defaultValue={task.days_repeat}
											variant='outlined'
											color='primary'
		                />) : (<Typography variant='body1' component='div'>
				                    repeat interval (days): {task.days_repeat}
				                </Typography>)
	                }
	            </Grid>
	            <Grid item xs={4} md={6} container justifyContent='flex-end'>
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
	            color={calcProgress(task.last_reset, task.days_repeat) < 90 ? 'primary' : 'secondary'}
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