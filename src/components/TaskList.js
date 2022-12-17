import React from 'react';

import Task from './Task';
import { handleAddTask } from '../redux/store';
import { useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import PropTypes from 'prop-types';

const TaskList = (props) => {

    const { tasks, loading } = props;
    const dispatch = useDispatch();

    const getHighestTaskId = () => {
        return Math.max.apply(null, tasks.map(t => t.id));
    }

    const submitAddTask = () => {
        let newId = getHighestTaskId() + 1;
        let task = {
            id: newId,
            name: 'New Task',
            days_repeat: 10,
            editMode: true,
        }
        dispatch(handleAddTask(task));
    }

    if (loading === true) {
        return (<h3>Loading...</h3>)
    }

    return (
        <Box sx={{ width: '98%', p: 2 }}>
            <Typography variant='h2' component='div'>
                Task List
            </Typography>
            <Stack sx={{ width: '95%'}} spacing={1}>
              {tasks.map(task => {
                return (
                <Task key={task.id} task={task} loading={loading} />
                )
              })}
              <Button variant="outlined" startIcon={<AddCircleIcon />} onClick={() => submitAddTask()}>
                Add Task
              </Button>
            </Stack>
        </Box>
    );
}

TaskList.propTypes = {
    tasks: PropTypes.array,
    loading: PropTypes.bool
}

export default TaskList;