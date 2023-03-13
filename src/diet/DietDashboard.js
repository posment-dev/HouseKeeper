import React from 'react';
import PropTypes from 'prop-types';

import DietTable from '../diet/DietTable';

import Stack from '@mui/material/Stack';

const BudgetTable = (props) => {

  const { dietEntries } = props;

  return (
    <Stack direction='column' spacing={2} mt={2}>
      <DietTable
        dietEntries={dietEntries}
      />
    </Stack>
  );  

}

export default BudgetTable;
