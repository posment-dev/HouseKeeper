import React from 'react';
import PropTypes from 'prop-types'

import Box from '@mui/material/Box';
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
	        <Box sx={{ display: 'flex', alignItems: 'flex-end'}}>
	            <Box sx={{ m: 1, position: 'relative', width: '20%'}}>    
	                {
	                	task.editMode ? (<TextField
								            label='Task Name'
											onChange={(event) => handleChangeName(event.target.value)}
											name='name'
											type='text'
											defaultValue={task.name}
											variant='outlined'
											color='primary'
						/>) : (<Typography variant='h4' component='div'>
				                    {task.name}
				                </Typography>
				        )
	                }
	            </Box>
	            <Box sx={{ m: 1, position: 'relative', width: '15%'}}>
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
	            </Box>
	            <Box sx={{ m: 1, position: 'relative', width: '60%'}} />
	            <Box sx={{ m: 1, position: 'relative' }}>
	                <IconButton onClick={() => resetTask()} aria-label="reset">
	                    <CheckBoxIcon />
	                </IconButton>
	            </Box>
	            <Box sx={{ m: 1, position: 'relative' }}>
	            	{
	            		task.editMode ? (<IconButton onClick={() => handleSaveTask()} aria-label="save">
				                    <SaveIcon />
				                </IconButton>
	            		) : (<IconButton onClick={() => toggleEditMode()} aria-label="edit">
			                    <EditIcon />
			                </IconButton>
	            		)
	            	}
	            </Box>
	            <Box sx={{ m: 1, position: 'relative' }}>
	                <IconButton onClick={() => removeTask()} aria-label="delete">
	                    <DeleteIcon />
	                </IconButton>
	            </Box>
	        </Box>
	        <LinearProgress
	            key={task.id}
	            color={calcProgress(task.last_reset, task.days_repeat) < 80 ? 'primary' : 'secondary'}
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