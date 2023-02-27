import React from 'react';

import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import { useDispatch } from 'react-redux';

import {
    removeSelectedEntryAction,
    handleSetDefaultCatByEntry,
    handleResetTotalsAndEntries,
} from '../redux/store';

const SetDefaultCategory = (props) => {

  const { selectedEntries } = props;
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const entry = selectedEntries[0];

  const handleJaClick = () => {
    dispatch(handleSetDefaultCatByEntry(selectedEntries[0]));
  	dispatch(removeSelectedEntryAction(selectedEntries[0]));
    //dispatch(handleResetTotalsAndEntries());
  	navigate('/budget');
  }

  const handleNeinClick = () => {
    dispatch(removeSelectedEntryAction(selectedEntries[0]));
    navigate('/budget');
  }

  return (
    <Stack direction='column' spacing='2' alignItems='center' mt={2}>
        <Paper>Do you want to set to following default?</Paper>
        <Paper>Description: {entry.description}</Paper>
        <Paper>Category: {entry.category}</Paper>
        <Stack direction='row' spacing='2' alignItems='center' mt={2}>
            <Button variant="contained" onClick={() => handleJaClick()}>Yes</Button>
            <Button variant="contained" onClick={() => handleNeinClick()}>No</Button>
        </Stack>
    </Stack>
  );  

}

export default SetDefaultCategory;
