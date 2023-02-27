import React from 'react';
import PropTypes from 'prop-types';

import BudgetDateFilter from './BudgetDateFilter';
import BudgetTotals from './BudgetTotals';

import Stack from '@mui/material/Stack';

const BudgetTotalsView = (props) => {

  const { dateRange, totals} = props;

  return (
    <Stack direction='column' spacing={2} mt={2}>
      <BudgetDateFilter
        dateRange={dateRange}
      />
      <BudgetTotals
        totals={totals}
      />
    </Stack>
  );  

}

export default BudgetTotalsView;
