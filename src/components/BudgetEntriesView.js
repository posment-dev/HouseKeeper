import React from 'react';
import PropTypes from 'prop-types';

import BudgetDateFilter from './BudgetDateFilter';
import BudgetEntries from './BudgetEntries';

import Stack from '@mui/material/Stack';

const BudgetEntriesView = (props) => {

  const { entries, dateRange, selectedEntries} = props;

  return (
    <Stack direction='column' spacing={2} mt={2}>
      <BudgetDateFilter
        dateRange={dateRange}
      />
      <BudgetEntries
        entries={entries}
        selectedEntries={selectedEntries}
      />
    </Stack>
  );  

}

export default BudgetEntriesView;
