import React from 'react';
import { Box, Button, Typography, Container } from '@mui/material';
import { Link } from 'react-router-dom';  // If you're using react-router for navigation

const Unauthorized = () => {
  return (
    <Container 
      maxWidth="sm"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Box 
        sx={{
          textAlign: 'center',
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: '#fff',
        }}
      >
        <Typography 
          variant="h1" 
          sx={{
            fontSize: '6rem',
            fontWeight: 'bold',
            color: '#f44336',  // Red for error
            marginBottom: 2
          }}
        >
          403
        </Typography>
        <Typography 
          variant="h6" 
          sx={{
            color: '#333',
            marginBottom: 2,
            fontWeight: 500
          }}
        >
          Unauthorized Access
        </Typography>
        <Typography 
          variant="body1" 
          sx={{
            color: '#666',
            marginBottom: 4
          }}
        >
          You don't have permission to access this page.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to="/" // Home page link
          sx={{
            paddingX: 4,
            paddingY: 1.5,
            fontSize: '1rem',
            textDecoration: 'none',
          }}
        >
          Go to Homepage
        </Button>
      </Box>
    </Container>
  );
};

export default Unauthorized;
