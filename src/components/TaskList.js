import React from 'react';

import Task from './Task';
import ActionBar from './ActionBar';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';

import PropTypes from 'prop-types';

const TaskList = (props) => {

    const { tasks, sortBy, filter, editModeTasks, pauseInput, loading } = props;

    if (loading === true) {
        return (<h3>Loading...</h3>)
    }

    return (
        <Box sx={{ width: '98%', p: 2 }} spacing={2}>
            <Typography variant='h2' component='div'>
                Task List
            </Typography>
            <ActionBar sortBy={sortBy} filter={filter} editModeTasks={editModeTasks} pauseInput={pauseInput} />
            <Stack sx={{ width: '95%'}} spacing={1}>
                {tasks.map(task => {
                    return (
                        <Task
                            key={task.id}
                            task={task}
                            editModeTasks={editModeTasks}
                        />
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