import * as React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import HomeIcon from '@mui/icons-material/Home';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';

import { Outlet } from 'react-router-dom';
 export default function Mainavigation() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerOpen = () => {
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: '#17B794' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="#app-bar-with-responsive-menu"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'Arial' ,
                fontWeight: 500,
                color: 'inherit',
                textDecoration: 'none',
                
                
              }}
            >
              EthioRush
            </Typography>

            <Box sx={{ flexGrow: 1 }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleDrawerOpen}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
            </Box>

            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="h5"
                noWrap
                component="a"
                href="#app-bar-with-responsive-menu"
                sx={{
                  mr: 2,
                  display: { xs: 'flex', md: 'none' },
                  flexGrow: 1,
                  fontFamily: 'Arial',
                  fontWeight: 500,
                  color: 'inherit',
                  textDecoration: 'none',
                }}
              >
                EthioRush
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="left"
        open={isDrawerOpen}
        onClose={handleDrawerClose}
      >
        <List >
        
          <ListItem component={Link} to="GetReportById" onClick={handleDrawerClose} sx={{ color: 'black',fontWeight:'bold',textTransform:'uppercase' }}>
            <ListItemIcon>
              <AssignmentIcon />
            </ListItemIcon>
            Reports
          </ListItem>
          <ListItem component={Link} to="GetReportById" onClick={handleDrawerClose} sx={{ color: 'black' ,fontWeight:'bold',textTransform:'uppercase'}}>
            <ListItemIcon>
              <BookmarkIcon/>
            </ListItemIcon>
             Saved Reports
          </ListItem>
          <ListItem component={Link} to="profile" onClick={handleDrawerClose} sx={{ color: 'black',fontWeight:'bold',textTransform:'uppercase' }}>
            <ListItemIcon>
              <AccountBoxIcon />
            </ListItemIcon>
            Profile
          </ListItem>
          <ListItem component={Link} to="Transaction" onClick={handleDrawerClose} sx={{ color: 'black',fontWeight:'bold',textTransform:'uppercase' }}>
            <ListItemIcon>
              <MonetizationOnIcon />
            </ListItemIcon>
            My Transaction
          </ListItem>
          <ListItem component={Link} to="../" onClick={handleDrawerClose} sx={{ color: 'black' ,fontWeight:'bold',textTransform:'uppercase'}}>
            <ListItemIcon>
              <ExitToAppIcon />
            </ListItemIcon>
            Logout
          </ListItem>
        </List>
      </Drawer>
      <Outlet/>
      
      
      
    </>
  );
}

