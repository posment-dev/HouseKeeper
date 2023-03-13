import React from 'react';
import { useNavigate } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

const NavBar = (props) => {

  const [anchorEl, setAnchorEl] = React.useState(null);

  const navigate = useNavigate();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    setAnchorEl(null);
  };

  return (
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position='relative'>
          <Toolbar>
            {/*<IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>*/}
            <Button href='/' color='inherit'>Home</Button>
            <Button href='/tasks' color='inherit'>Task List</Button>
            <div>
              <Button
                aria-label='budget menu'
                aria-controls='budget-menu-appbar'
                aria-haspopup="true"
                onClick={handleMenu}
                color='inherit'
              >
                Budget
              </Button>
              <Menu
                sx={{ mt: '40px' }}
                id='budget-menu-appbar'
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem>
                  <Button href='/budget' onClick={handleClose}>Dashboard</Button>
                </MenuItem>
                <MenuItem>
                  <Button href='/budget/totals' onClick={handleClose}>Category Totals</Button>
                </MenuItem>
                <MenuItem>
                  <Button href='/budget/entries' onClick={handleClose}>Entries</Button>
                </MenuItem>
                <MenuItem>
                  <Button href='/budget/fileupload' onClick={handleClose}>File Upload</Button>
                </MenuItem>
              </Menu>
            </div>
            <Button href='/diet' color='inherit'>Mirkos Diet</Button>
          </Toolbar>
        </AppBar>
      </Box>
    );
}

export default NavBar;