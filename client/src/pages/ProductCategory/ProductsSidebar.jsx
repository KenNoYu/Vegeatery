import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { Dashboard, ShoppingCart, Event, StackedBarChart, Feedback, Star, GifBoxRounded, GifBoxOutlined, CardGiftcard } from '@mui/icons-material';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import { Box } from '@mui/system';
import { Link, useLocation } from 'react-router-dom'; // React Router imports
import vegeateryWhiteHorizontal from '../../assets/logo/vegeateryWhiteHorizontal.png';



const ProductsSidebar = () => {
  const location = useLocation(); // Get the current route path

  // List items data
  const menuItems = [
    { id: 'Products', text: 'Products', icon: <CardGiftcard />, path: '/admin/viewcategories/1' },
    { id: 'Orders', text: "Orders", icon: <Star />, path: '/admin/orders' },
  ];

  // Function to check if a route is active
  const isRouteActive = (path) => {
    // If the path is "reservations", check if the current path starts with "/user/reservations"
    if (path === '/admin/viewcategories/1') {
      return location.pathname.startsWith('/admin/viewcategories');
    }
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
  
  export default ProductsSidebar;
  
