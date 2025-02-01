import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { Dashboard, ShoppingCart, Event } from '@mui/icons-material';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { Box } from '@mui/system';
import { Link, useLocation } from 'react-router-dom'; // React Router imports
import vegeateryHorontalLogo from '../../../assets/logo/vegeateryHorizontal.png';

const Sidebar = () => {
  const location = useLocation(); // Get the current route path

  // List items data
  const menuItems = [
    { id: 'overview', text: 'Overview', icon: <Dashboard />, path: '/overview' },
    { id: 'orders', text: 'My Orders', icon: <ShoppingCart />, path: '/user/orders' },
    { id: 'reservations', text: 'My Reservations', icon: <Event />, path: '/user/reservations' },
    { id: 'profile', text: 'Manage Profile', icon: <ManageAccountsIcon />, path: '/user/profile' },
  ];

  // Function to check if a route is active
  const isRouteActive = (path) => {
    // If no route is selected, default to the first item's path ("/overview")
    return location.pathname === path || (location.pathname === '/' && path === '/overview');
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      PaperProps={{
        sx: {
          backgroundColor: '#FFFFFF',
          width: 240,
          height: '120vh',
          borderRight: '0.5px solid #000000',
          padding: '2em 0.5em',
          position: 'sticky',
          marginTop: '5px', // Dynamically adjust based on navbar height
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 4,
        }}
      >
        {/* Logo */}
        <img src={vegeateryHorontalLogo} alt="Logo" style={{ height: 40, marginRight: 8 }} />
      </Box>

      <List>
        {menuItems.map((item, index) => (
          <ListItem
            button
            key={item.id}
            component={Link} // Use Link from React Router
            to={item.path} // Link to respective path
            sx={{
              backgroundColor: isRouteActive(item.path) ? '#D81B60' : 'transparent',
              color: isRouteActive(item.path) ? '#FFFFFF' : 'inherit',
              borderRadius: isRouteActive(item.path) ? '20px' : '0px',
              marginBottom: '8px',
              '&:hover': {
                backgroundColor: isRouteActive(item.path) ? '#D81B60' : '#F1F1F1',
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: isRouteActive(item.path) ? '#FFFFFF' : 'inherit',
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
