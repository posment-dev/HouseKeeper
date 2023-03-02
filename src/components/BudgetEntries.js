import React from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import {
  DataGrid,
} from '@mui/x-data-grid';
import Stack from '@mui/material/Stack';


import { useDispatch } from 'react-redux';

import {
    removeSelectedEntryAction,
    addSelectedEntryAction,
} from '../redux/store';

const BudgetEntries = (props) => {

  const { entries, selectedEntries} = props;
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleRowClick = (params) => {
    const id = params.row.id;
    const filteredSelected = selectedEntries.find(e => e.id === id);
    if (filteredSelected === undefined) {
      dispatch(addSelectedEntryAction(entries.find(e => e.id === id)));
    } else {
      dispatch(removeSelectedEntryAction(filteredSelected));
    }
  };

  const handleRowDoubleClick = (params) => {
    const id = params.row.id;
    const choosenEntry = entries.find(e => e.id === id);
    dispatch(addSelectedEntryAction(choosenEntry));
    navigate('/budget/categories');
  }

  const columns = [
    { field: 'date', headerName: 'Date', minWidth: 120 },
    { field: 'category', headerName: 'Category', minWidth: 180 },
    {
      field: 'value',
      headerName: 'Value',
      type: 'number',
      minWidth: 120,
      valueFormatter: (params) => {
        const valueFormatted = Number(params.value / 100.0).toLocaleString('de-CH', { style: 'currency', currency: 'CHF' });
        return `${valueFormatted}`;
      },
    },
    { field: 'description', headerName: 'Description', minWidth: 480 },
    { field: 'id', headerName: 'Id', width: 40 },
  ];

  return (
    <Stack direction='column'>
      <h3>Entries</h3>
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          onRowDoubleClick={handleRowDoubleClick}
          rows={entries}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
        />
      </div>
    </Stack>
  );  

}

export default BudgetEntries;
