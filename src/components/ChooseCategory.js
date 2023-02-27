import React from 'react';

import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import { useDispatch } from 'react-redux';

import {
    setAllCategoriesAction,
    removeSelectedEntryAction,
    handleSetCategory,
} from '../redux/store';

const ChooseCategory = (props) => {

  const { categories, selectedEntries} = props;
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const handleClick = (category) => {
  	//remove from selected
  	//set category for entry
  	//navigate back to Budget
  	dispatch(handleSetCategory(selectedEntries[0].id, category));
  	navigate('/budget/categories/default');
  }

  return (
    <Stack direction='column' spacing={1}>
    	{Object.keys(categories).map(cat => {
            return (
                <Stack
                    key={categories[cat]}
                    sx={{ backgroundColor: "white", border: 1}}
                    minHeight={30}
                    justifyContent="center"
                    alignItems="center"
                    onClick={() => handleClick({
						name: cat,
	                	id: categories[cat]
	                })}>
	                {cat}
                </Stack>
            )    
        })}
    </Stack>
  );  

}

export default ChooseCategory;
