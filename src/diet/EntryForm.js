import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import {
    setNewEntryWalkDist,
    setNewEntryLastFood,
    setNewEntryRunDist,
    setNewEntryFirstFood,
    setNewEntryWeight,
    setNewEntryCirc,
    setNewEntryDate,
    handleAddDietEntry,
    handleUpdateDietEntry,
} from '../redux/store';
import { useDispatch } from 'react-redux';

const EntryForm = (props) => {

  const { newEntry, isUpdate } = props;
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleChangeDate = (date) => {
    dispatch(setNewEntryDate(date));
  }
  const handleChangeWeight = (weight) => {
    dispatch(setNewEntryWeight(weight));
  }
  const handleChangeCirc = (circ) => {
    dispatch(setNewEntryCirc(circ));
  }
  const handleChangeFirstFood = (firstFood) => {
    dispatch(setNewEntryFirstFood(firstFood));
  }
  const handleChangeLastFood = (lastFood) => {
    dispatch(setNewEntryLastFood(lastFood));
  }
  const handleChangeRun = (runDist) => {
    dispatch(setNewEntryRunDist(runDist));
  }
  const handleChangeWalk = (walkDist) => {
    dispatch(setNewEntryWalkDist(walkDist));
  }

  const handleSubmitNewEntry = () => {
    console.log('Update?: ' + isUpdate);
    if (isUpdate) {
      dispatch(handleUpdateDietEntry(newEntry));
    } else {
      dispatch(handleAddDietEntry(newEntry));
    }
    navigate('/diet');
  }

  const handleCancel = () => {
    navigate('/diet');
  }

  return (
    <Stack direction='column' spacing={2}>
      <TextField
        id="date"
        label="Date"
        value={newEntry.date}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          handleChangeDate(event.target.value);
        }}
      />
      <TextField
        id="weight"
        label="Weight"
        value={newEntry.weight}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          handleChangeWeight(event.target.value);
        }}
      />
      <TextField
        id="circ"
        label="Circumference"
        value={newEntry.circumference}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          handleChangeCirc(event.target.value);
        }}
      />
      <TextField
        id="ff"
        label="Time First Food"
        value={newEntry.first_food_time}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          handleChangeFirstFood(event.target.value);
        }}
      />
      <TextField
        id="lf"
        label="Time Last Food"
        value={newEntry.last_food_time}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          handleChangeLastFood(event.target.value);
        }}
      />
      <TextField
        id="run"
        label="Running Distance"
        value={newEntry.run_distance}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          handleChangeRun(event.target.value);
        }}
      />
      <TextField
        id="walk"
        label="Walking Distance"
        value={newEntry.walk_distance}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          handleChangeWalk(event.target.value);
        }}
      />
      <Stack direction='row'>
        <Button
            variant='contained'
            onClick={() => handleSubmitNewEntry()}
        >Submit</Button>
        <Button
            variant='contained'
            onClick={() => handleCancel()}
        >Cancel</Button>
      </Stack>
    </Stack>
  );  

}

export default EntryForm;
