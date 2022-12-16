import React from 'react';

import Task from './Task';
import { handleAddTask, handleRemoveTask, handleResetTask } from '../redux/store';
import { useDispatch } from 'react-redux';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

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
            </Stack>
        </Box>
    );
}

TaskList.propTypes = {
    tasks: PropTypes.array,
    loading: PropTypes.bool
}

export default TaskList;