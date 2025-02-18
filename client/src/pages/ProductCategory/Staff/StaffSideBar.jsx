import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Star, CardGiftcard,  } from '@mui/icons-material';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { Box } from '@mui/system';
import { Link, useLocation } from 'react-router-dom'; // React Router imports
import vegeateryWhiteHorizontal from '../../../assets/logo/vegeateryWhiteHorizontal.png';



const StaffSidebar = () => {
  const location = useLocation(); // Get the current route path

  // List items data
  const menuItems = [
    { id: 'Stocks', text: 'Stocks', icon: <Inventory2Icon />, path: '/staff/viewstocks' },
    { id: 'Logs', text: "Logs", icon: <Star />, path: '/staff/productlogs' },
  ];

  // Function to check if a route is active
  const isRouteActive = (path) => {
    // If no route is selected, default to the first item's path ("/overview")
    return location.pathname === path || (location.pathname === '/' && path === '/admin/store');
  };

  return (
      <Drawer
        variant="permanent"
        anchor="left"
        PaperProps={{
          sx: {
            backgroundColor: '#1a1a1a',
            width: 240,
            height: '100vh',
            borderRight: '0.5px solid #000000',
            padding: '2em 0.5em',
            position: 'fixed',
            marginTop: '64px', // Dynamically adjust based on navbar height
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
  
  export default StaffSidebar;
  
