import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import {
  DataGrid,
} from '@mui/x-data-grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import {
    setNewEntryAction,
    initializeNewEntryAction,
} from '../redux/store';
import { useDispatch } from 'react-redux';

const DietTable = (props) => {

  const { dietEntries } = props;
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleRowDoubleClick = (params) => {
    const date = params.row.date;
    const choosenEntry = dietEntries.find(e => e.date === date);
    dispatch(setNewEntryAction(choosenEntry));
    navigate('/diet/updateEntry');
  }

  const handleNewEntry = () => {
    dispatch(initializeNewEntryAction());
    navigate('/diet/newEntry'); 
  }

  const columns = [
    { field: 'date', headerName: 'Date', minWidth: 120 },
    { 
      field: 'weight', headerName: 'Weight (kg)', type: 'number', minWidth: 120,
      valueFormatter: (params) => {
        const valueFormatted = params.value / 10.0;
        return `${valueFormatted}`;
      },
    },
    { field: 'circumference', headerName: 'Circumf. (cm)', type: 'number', minWidth: 120 },
    { field: 'first_food_time', headerName: 'First Food Eaten', type: 'number', minWidth: 120 },
    { field: 'last_food_time', headerName: 'Last Food Eaten', type: 'number', minWidth: 120 },
    { field: 'run_distance', headerName: 'Run (km)', type: 'number', minWidth: 120 },
    { field: 'walk_distance', headerName: 'Walk (km)', type: 'number', minWidth: 120 },
  ];

  return (
    <Stack direction='column' spacing={2}>
      <h3>Entries</h3>
      <Button
          variant='contained'
          onClick={() => handleNewEntry()}
      >New Entry</Button>
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={dietEntries}
          columns={columns}
          onRowDoubleClick={handleRowDoubleClick}
          pageSize={10}
          rowsPerPageOptions={[10]}
        />
      </div>
    </Stack>
  );  

}

export default DietTable;
