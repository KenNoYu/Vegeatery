import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { Dashboard, ShoppingCart, Event } from '@mui/icons-material';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { Box } from '@mui/system';
import { Link, useLocation } from 'react-router-dom'; // React Router imports
import vegeateryWhiteHorizontal from '../../../assets/logo/vegeateryWhiteHorizontal.png';

const AdminSidebar = () => {
  const location = useLocation(); // Get the current route path

  // List items data
  const menuItems = [
    { id: 'users', text: 'Store Users', icon: <Dashboard />, path: '/admin/accounts' },
    { id: 'role', text: 'Role Modify', icon: <ShoppingCart />, path: '/admin/roleModify' }
  ];

  // Function to check if a route is active
  const isRouteActive = (path) => {
    // If no route is selected, default to the first item's path ("/overview")
    return location.pathname === path || (location.pathname === '/' && path === '/admin/accounts');
  };

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      PaperProps={{
        sx: {
          backgroundColor: '#1a1a1a',
          width: 240,
          height: '250vh',
          padding: '2em 0.5em',
          position: 'fixed',
          marginTop: '64px',
          boxSizing: 'border-box',
          zIndex: "500",
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
        <img src={vegeateryWhiteHorizontal} alt="Logo" style={{ height: 40, marginRight: 8 }} />
      </Box>

      <List>
        {menuItems.map((item, index) => (
          <ListItem
            button
            key={item.id}
            component={Link} // Use Link from React Router
            to={item.path} // Link to respective path
            sx={{
              backgroundColor: isRouteActive(item.path) ? '#C6487E' : 'transparent',
              color:'#FFFFFF',
              borderRadius: isRouteActive(item.path) ? '20px' : '0px',
              marginBottom: '8px',
              '&:hover': {
                backgroundColor: isRouteActive(item.path) ? '#A83866' : '#D3D3D3',
              },
            }}
          >
            <ListItemIcon
              sx={{
                color: '#FFFFFF',
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

export default AdminSidebar;
