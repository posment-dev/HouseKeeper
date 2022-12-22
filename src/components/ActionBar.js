import React from 'react';

import Search from './Search';
import {
    handleAddTask,
    handleUpdateSort,
    handleUpdateFilter,
    refreshSortTasksAction,
    toggleFullEditModeAction,
    handleRemoveSelectedTasks,
    togglePauseInput,
} from '../redux/store';
import { useDispatch } from 'react-redux';
import { SortByEnum, Actions } from '../Constants/Enums'

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
//import ReplayCircleFilledIcon from '@mui/icons-material/ReplayCircleFilled';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { grey } from '@mui/material/colors';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';

import PropTypes from 'prop-types';

const ActionBar = (props) => {

    const { sortBy, filter, editModeTasks, pauseInput} = props;
    const dispatch = useDispatch();

    const submitAddTask = () => {
        let task = {
            name: 'New Task',
            days_repeat: 10,
        }
        dispatch(handleAddTask(task));
    }

    const handleSortByChange = (sortByEvent) => dispatch(handleUpdateSort(sortByEvent));

    const handleFilterChange = (filterValue) => dispatch(handleUpdateFilter(filterValue));

    const handleToggleFullEdit = () => dispatch(toggleFullEditModeAction());

    const handleTogglePauseInput = () => dispatch(togglePauseInput());

    const handleRemoveSelected = () => {
        dispatch(handleRemoveSelectedTasks());
        handleToggleFullEdit();
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

    return (
        <Stack
            spacing={0}
            sx={{ width: '95%'}}
        >
            <Stack
                direction='row'
                justifyContent='space-between'
                alignItems='center'
                sx={{ width: '95%'}}
            >
                <Button
                    variant='text'
                    onClick={() => handleToggleFullEdit()}
                >{editModeTasks ? 'Done' : 'Edit Tasks'}</Button>
                <Search
                    filter={filter}
                    handleFilterChange={handleFilterChange}
                    label='Search Task'
                />
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
                <IconButton onClick={() => submitAddTask()} aria-label="add">
                    <AddCircleIcon />
                </IconButton>
            </Stack>
            {
                editModeTasks ?
                (
                    <Stack
                        direction='row'
                        justifyContent='flex-start'
                        alignItems='center'
                    >
                        <Button
                            variant='text'
                            color='secondary'
                            onClick={() => handleTogglePauseInput()}
                        >Set Pause</Button>
                        <Button
                            variant='text'
                            color='secondary'
                            onClick={() => handleRemoveSelected()}
                        >Remove</Button>
                    </Stack>
                ) : ''
            }
            {
                editModeTasks && pauseInput ?
                (
                    <Stack
                        direction='row'
                        justifyContent='flex-start'
                        alignItems='center'
                    >
                        <FormControl sx={{ minWidth: 80 }} margin='normal'>
                            <TextField
                                id="pause"
                                type="number"
                                value={filter}
                                onChange={(e) => handleFilterChange(e.target.value) }
                                label="How many days?"
                                variant="outlined"
                                placeholder="Pause..."
                                size="small"
                            />
                        </FormControl>
                        <Button
                            variant='text'
                            color='secondary'
                            onClick={() => handleRemoveSelected()}
                        >Save</Button>
                        <Button
                            variant='text'
                            color='secondary'
                            onClick={() => handleTogglePauseInput()}
                        >Cancel</Button>
                    </Stack>
                ) : ''
            }
        </Stack>
    );
}

ActionBar.propTypes = {
    sortBy: PropTypes.string,
    filter: PropTypes.string,
}

export default ActionBar;