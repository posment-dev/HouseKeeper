import React from 'react';

import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';

import PropTypes from 'prop-types';

const Search = (props) => {

	const { filter, handleFilterChange, label} = props;

	return (
		<FormControl sx={{ minWidth: 120 }} margin='normal'>
		    <TextField
				id="search-field"
				className="text"
				type="search"
				value={filter}
				onChange={(e) => handleFilterChange(e.target.value) }
				label={label}
				variant="outlined"
				placeholder="Search..."
				size="small"
		    />
		  </FormControl>
	)
}

Search.propTypes = {
    filter: PropTypes.string
}

export default Search;