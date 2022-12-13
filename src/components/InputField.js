import TextField from '@mui/material/TextField';

import PropTypes from 'prop-types';

const InputField = props => {

    const { name, label, type, value, defaultValue, handleChange } = props;

    return (
        <TextField
            label={label}
            type={type}
            value={value}
            onChange={handleChange}
            name={name}
            defaultValue={defaultValue}
            variant='outlined'
            color='primary'
        />
    )
}

InputField.propTypes = {
    type: PropTypes.string.isRequired,
    name: PropTypes.string,
    label: PropTypes.string,
    handleChange: PropTypes.func,
}

export default InputField;