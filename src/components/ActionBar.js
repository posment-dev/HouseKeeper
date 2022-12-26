import React from 'react';

import Search from './Search';
import {
    handleAddTask,
    handleUpdateSort,
    handleUpdateFilter,
    toggleFullEditModeAction,
    handleRemoveSelectedTasks,
    togglePauseInput,
    deselectAllTasksAction,
    handleRemoveSelectedPause,
    handlePauseSelectedTask,
    updatePauseInputAction,
} from '../redux/store';
import { useDispatch } from 'react-redux';
import { SortByEnum } from '../Constants/Enums'

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';

import PropTypes from 'prop-types';

const ActionBar = (props) => {

    const { sortBy, filter, editModeTasks, pauseInput} = props;
    const dispatch = useDispatch();

    const buttonTheme = createTheme({
      palette: {
        neutral: {
          main: '#64748B',
          contrastText: '#fff',
        },
      },
    });

    const submitAddTask = () => {
        let task = {
            name: 'New Task',
            days_repeat: 10,
        }
        dispatch(handleAddTask(task));
    }

    const handleRemoveSelected = () => {
        dispatch(handleRemoveSelectedTasks());
        handleToggleFullEdit();
    }

    const handleSortByChange = (sortByEvent) => dispatch(handleUpdateSort(sortByEvent));

    const handleFilterChange = (filterValue) => dispatch(handleUpdateFilter(filterValue));

    const handleToggleFullEdit = () => {
        dispatch(toggleFullEditModeAction());
        dispatch(deselectAllTasksAction());
    }

    const handleTogglePauseInput = () => {
        dispatch(togglePauseInput());
        dispatch(updatePauseInputAction(0));
    }

    const handlePauseInputChange = (duration) => dispatch(updatePauseInputAction(duration));

    const handlePauseSelected = () => {
        dispatch(handlePauseSelectedTask(pauseInput.duration));
        handleTogglePauseInput();
    }

    const handleRemovePauseSelected = () => dispatch(handleRemoveSelectedPause());
    

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
            <ThemeProvider theme={buttonTheme}>
                <Stack
                    direction='row'
                    justifyContent='space-between'
                    alignItems='center'
                    sx={{ width: '95%'}}
                    spacing={1}
                >
                    <Button
                        variant='contained'
                        onClick={() => handleToggleFullEdit()}
                    >{editModeTasks ? 'Done' : 'Edit'}</Button>
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
                    <IconButton
                        sx={{
                            bgcolor: 'grey.300',
                            '&:hover': {
                                bgcolor: 'grey.200',
                            },
                        }}
                        color='primary'
                        size='small'
                        onClick={() => submitAddTask()}
                    >
                        <AddIcon />
                    </IconButton>
                </Stack>
                {
                    editModeTasks ?
                    (
                        <Stack
                            direction='row'
                            justifyContent='flex-start'
                            alignItems='center'
                            spacing={2}
                        >
                            <Button
                                variant='contained'
                                color='neutral'
                                onClick={() => handleTogglePauseInput()}
                            >Pause</Button>
                            <Button
                                variant='contained'
                                color='neutral'
                                onClick={() => handleRemovePauseSelected()}
                            >Reactivate</Button>
                            <Button
                                variant='contained'
                                color='neutral'
                                onClick={() => handleRemoveSelected()}
                            >Remove</Button>
                        </Stack>
                    ) : ''
                }
                {
                    editModeTasks && pauseInput.show ?
                    (
                        <Stack
                            direction='row'
                            justifyContent='flex-start'
                            alignItems='center'
                            spacing={1}
                        >
                            <FormControl margin='normal'>
                                <TextField
                                    sx={{
                                        width: { sm: 100, md: 200 },
                                    }}
                                    id="pause"
                                    type="number"
                                    value={pauseInput.duration}
                                    onChange={(e) => handlePauseInputChange(e.target.value) }
                                    label="number days?"
                                    variant="outlined"
                                    placeholder="Pause..."
                                    size="small"
                                />
                            </FormControl>
                            <Button
                                variant='contained'
                                color='neutral'
                                onClick={() => handlePauseSelected()}
                            >Save</Button>
                            <Button
                                variant='contained'
                                color='neutral'
                                onClick={() => handleTogglePauseInput()}
                            >Cancel</Button>
                        </Stack>
                    ) : ''
                }
            </ThemeProvider>
        </Stack>
    );
}

ActionBar.propTypes = {
    sortBy: PropTypes.string,
    filter: PropTypes.string,
}

export default ActionBar;