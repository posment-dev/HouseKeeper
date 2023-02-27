import React from 'react';
import PropTypes from 'prop-types';

import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';


import { useDispatch } from 'react-redux';

import {
    setDateRangeAction,
    handleFilterByDate,
    handleSetNewDateRangeByDefaults,
} from '../redux/store';

const BudgetDateFilter = (props) => {

  const { dateRange } = props;
  const dispatch = useDispatch();

  const handleSetNewDateRange = (from, to) => {
    dispatch(setDateRangeAction(from, to));
  }

  const handleSetNewDateRangeByType = (type) => {
    dispatch(handleSetNewDateRangeByDefaults(type));
    handleSubmitDateFilter();
  }

  const handleSubmitDateFilter = () => {
    dispatch(handleFilterByDate())
  }

  return (
    <Stack direction='column' spacing={2} mt={2}>
      <form>
        <TextField
            label='Date From (yyyy-mm-dd)'
            type='text'
            value={dateRange.from}
            onChange={(e) => handleSetNewDateRange(e.target.value, dateRange.to)}
            name='DateFrom'
            variant='outlined'
            color='primary'
        />
        <TextField
            label='Date To (yyyy-mm-dd)'
            type='text'
            value={dateRange.to}
            onChange={(e) => handleSetNewDateRange(dateRange.from, e.target.value)}
            name='DateTo'
            variant='outlined'
            color='primary'
        />
        <IconButton
            color='primary'
            size='large'
            onClick={() => handleSubmitDateFilter()}
        >
          <SearchIcon />
        </IconButton>
      </form>
      <Stack direction='row' spacing={1} mt={1} alignItems='center'>
        <Button variant="contained" onClick={() => handleSetNewDateRangeByType('this')}>This Month</Button>
        <Button variant="contained" onClick={() => handleSetNewDateRangeByType('last')}>Last Month</Button>
        <Button variant="contained" onClick={() => handleSetNewDateRangeByType('last6')}>Last 6 Month</Button>
        <Button variant="contained" onClick={() => handleSetNewDateRangeByType('last12')}>Last 12 Month</Button>
      </Stack>
    </Stack>
  );  
}

export default BudgetDateFilter;
