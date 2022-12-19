import React from 'react';

import Task from './Task';
import Search from './Search';
import { handleAddTask, handleUpdateSort, handleUpdateFilter, refreshSortTasksAction } from '../redux/store';
import { useDispatch } from 'react-redux';
import { SortByEnum } from '../Constants/Enums'

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
//import IconButton from '@mui/material/IconButton';
//import ReplayCircleFilledIcon from '@mui/icons-material/ReplayCircleFilled';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { grey } from '@mui/material/colors';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

import PropTypes from 'prop-types';

const TaskList = (props) => {

    const { tasks, sortBy, filter, loading } = props;
    const dispatch = useDispatch();

    const buttonTheme = createTheme({
      palette: {
        primary: {
            main: grey[900],
        },
      }
    });

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
        dispatch(refreshSortTasksAction());
    }

    const handleSortByChange = (sortByEvent) => {
        dispatch(handleUpdateSort(sortByEvent));
    }

    const handleFilterChange = (filterValue) => {
        dispatch(handleUpdateFilter(filterValue));
    }

    /*const handleRefreshClick = () => {
        dispatch(updateProgressAction());
    }

    
    <Grid item xs={5} container justifyContent='flex-end'>
        <IconButton onClick={() => updateProgressAction()}>
            <ReplayCircleFilledIcon />
        </IconButton>
    </Grid>
    */

    if (loading === true) {
        return (<h3>Loading...</h3>)
    }

    return (
        <Box sx={{ width: '98%', p: 2 }} spacing={2}>
            <Typography variant='h2' component='div'>
                Task List
            </Typography>
            <Stack sx={{ width: '95%'}}>
                <Grid spacing={2} container justifyContent='flex-start'>
                    <Grid item xs={6} container justifyContent='flex-start'>
                        <Search
                            filter={filter}
                            handleFilterChange={handleFilterChange}
                            label='Search Task'
                        />
                    </Grid>
                    <Grid item xs={6} container justifyContent='flex-end'>
                        <FormControl sx={{ minWidth: 120 }} margin='normal' size='small'>
                            <InputLabel id="demo-select-small">SortBy</InputLabel>
                            <Select
                                id="sort-by-select"
                                value={sortBy}
                                label='SortBy'
                                onChange={(event) => handleSortByChange(event.target.value)}
                            >
                                {
                                    Object.values(SortByEnum).map(value => {
                                        return (
                                            <MenuItem key={value} value={value}>{value}</MenuItem>
                                        )
                                    })
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Stack>
            <Stack sx={{ width: '95%'}} spacing={1}>
                {tasks.map(task => {
                    return (
                        <Task
                            key={task.id}
                            task={task}
                            isVisible={task.isVisible}
                        />
                    )    
                })}
                <ThemeProvider theme={buttonTheme}>
                    <Button variant='contained' color='primary' startIcon={<AddCircleIcon />} onClick={() => submitAddTask()}>
                        Add Task
                    </Button>
                </ThemeProvider>
            </Stack>
        </Box>
    );
}

TaskList.propTypes = {
    tasks: PropTypes.array,
    loading: PropTypes.bool
}

export default TaskList;