import React from 'react';
import PropTypes from 'prop-types';

import {
  DataGrid,
} from '@mui/x-data-grid';
import Stack from '@mui/material/Stack';


const BudgetTotals = (props) => {

  const { totals } = props;

  const totals_array = Object.keys(totals).map((key, index) => {
    return {
      id: index,
      category: key,
      value: totals[key]
    }
  });

  const totals_columns = [
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
  ];

  return (
    <Stack direction='column'>
      <h3>Category Totals</h3>
      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={totals_array}
          columns={totals_columns}
          pageSize={20}
          rowsPerPageOptions={[20]}
        />
      </div>
    </Stack>
  );  

}

export default BudgetTotals;
