import React from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Delete from '@mui/icons-material/Delete';

import { handleRemoveTask, handleAddTask } from '../redux/store';
import { useDispatch } from 'react-redux';

import PropTypes from 'prop-types';

const TaskList = (props) => {

    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: theme.palette.common.black,
          color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
          fontSize: 14,
        },
      }));

    const { tasks, loading } = props;
    const dispatch = useDispatch();

    const submitAddTask = (event) => {
        event.preventDefault();
        let task = {
            name: 'newDefaultTask',
            days_repeat: 10,
        }
        dispatch(handleAddTask(task));
      }

    const removeTask = task => {
        dispatch(handleRemoveTask(task));
    }

    if (loading === true) {
        return (<h3>Loading...</h3>)
    }

    return (
        <div>
            <h1>Tasks</h1>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Task Name</StyledTableCell>
                            <StyledTableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tasks.map((task) => (
                        <TableRow
                            key={task.id}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <StyledTableCell component="th" scope="row">
                                {task.name}
                            </StyledTableCell>
                            <StyledTableCell align='right'>
                            <IconButton
                                type='submit'
                                color='primary'
                                size='large'
                                onClick={() => { removeTask(task) }}
                            >
                                <Delete />
                            </IconButton>
                            </StyledTableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

TaskList.propTypes = {
    tasks: PropTypes.array,
    loading: PropTypes.bool
}

export default TaskList;