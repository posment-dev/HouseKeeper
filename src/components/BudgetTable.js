import React from 'react';
import PropTypes from 'prop-types';

import BudgetDateFilter from './BudgetDateFilter';
import BudgetTotals from './BudgetTotals';
import BudgetEntries from './BudgetEntries';

import Stack from '@mui/material/Stack';

const BudgetTable = (props) => {

  const { entries, dateRange, totals, selectedEntries} = props;

  return (
    <Stack direction='column' spacing={2} mt={2}>
      <BudgetDateFilter
        dateRange={dateRange}
      />
      <BudgetTotals
        totals={totals}
      />
      <BudgetEntries
        entries={entries}
        selectedEntries={selectedEntries}
      />
    </Stack>
  );  

}

export default BudgetTable;
