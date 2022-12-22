import React from 'react';

import Search from './Search';
import { handleAddTask, handleUpdateSort, handleUpdateFilter, refreshSortTasksAction } from '../redux/store';
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

import PropTypes from 'prop-types';

const ActionBar = (props) => {

    const { sortBy, filter } = props;
    const dispatch = useDispatch();

    const submitAddTask = () => {
        let task = {
            name: 'New Task',
            days_repeat: 10,
            editMode: true,
        }
        dispatch(handleAddTask(task));
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

    return (
        <Stack sx={{ width: '95%'}}>
            <Grid spacing={2} container justifyContent='flex-start'>
                <Grid item xs={6} container justifyContent='flex-start'>
                    <Search
                        filter={filter}
                        handleFilterChange={handleFilterChange}
                        label='Search Task'
                    />
                </Grid>
                <Grid item xs={5} container justifyContent='flex-end'>
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
                <Grid item xs={1} container justifyContent='center'>
                    <IconButton onClick={() => submitAddTask()} aria-label="add">
                        <AddCircleIcon />
                    </IconButton>
                </Grid>
            </Grid>
        </Stack>
    );
}

ActionBar.propTypes = {
    sortBy: PropTypes.string,
    filter: PropTypes.string,
}

export default ActionBar;