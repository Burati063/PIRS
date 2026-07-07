import * as React from 'react';
import { useState } from 'react'; 
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import ReportIcon from '@mui/icons-material/Report';
import SendIcon from '@mui/icons-material/Send';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PeopleIcon from '@mui/icons-material/People';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import Avatar  from '@mui/material/Avatar';
import {alpha} from '@mui/material/styles';
import Dashboard from '../Dashboard/Dashboard';
import Reports from '../Reports/Reports'
import Transactions from '../Transactions/Transactions';
import Submitted from '../Reports/Submitted';
import Rejected from '../Reports/Rejected';
import Approved from '../Reports/Approved';
import Contractors from '../Contractors/Contractors';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import Account from '../Account/Account'
import { useEffect } from 'react';
import {Link} from 'react-router-dom'
const apiKey = import.meta.env.VITE_API_URL
const drawerWidth = 240;
const companyId = localStorage.getItem('userId')
const menusItems = [
  { name: 'Home', route: <Dashboard/>,Icon: <HomeIcon />},
  { name: 'New Reports',Icon:<ReportIcon />, route: <Reports companyId={companyId} reportStatus={0}/> },
  { name: 'Submitted',Icon:<SendIcon />, route: <Submitted companyId={companyId}/> },
  { name: 'Rejected',Icon:<CancelIcon />, route: <Rejected companyId={companyId}/> },
  { name: 'Approved',Icon:<CheckCircleIcon />, route: <Approved companyId={companyId}/> },
  { name: 'Contractors',Icon:<PeopleIcon />, route: <Contractors companyId={companyId}/> },
  { name: 'Transactions',Icon:<SwapHorizIcon />, route: <Transactions companyId={companyId}/> },
  { name: 'Log Out',Icon:<Link to="../"><ExitToAppIcon /></Link>, route:''  },


];
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function MiniDrawer() {
  const theme = useTheme();
  const [companyInfo,setCompanyInfo] = useState(new Object())
  const [open, setOpen] = useState(false);
  const [MainContent,SetMainContent] = useState(<Dashboard/>);
  const [title,setTitle] = useState("Home")
  useEffect(()=>{fetch(`${apiKey}/${companyId}`)
  .then((res)=>res.json())
  .then((data)=>{setCompanyInfo(data)
  console.log(data)})},[])
  const handleDrawerOpen = () => {
    setOpen(true);
  };
  const handleIconCLick = (obj) =>{
    setTitle(obj.name); SetMainContent(obj.route)
  }
  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{ backgroundColor: alpha('#42a5f5',1) }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }} >
            {title}
          </Typography>
          <Avatar src={`${apiKey}/${companyInfo.logo}`} onClick={()=>{setTitle('Account'); SetMainContent(<Account/>)}}>A</Avatar>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menusItems.map((obj, indx) => (
            <ListItem key={obj.name} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
               onClick={(e)=>{handleIconCLick(obj)}}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {obj.Icon}
                </ListItemIcon>
                <ListItemText primary={obj.name} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" display="flex"minHeight={"90vh"} gap={"1rem"} justifyContent="center" alignItems="center" sx={{ flexGrow: 1,pt: 3}}>
        <DrawerHeader />
        {MainContent}
      </Box>
    </Box>
  );
}
