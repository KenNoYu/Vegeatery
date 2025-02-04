import { Box, Typography, LinearProgress, Button, Card, CardContent, Grid2 as Grid, Input, IconButton } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
// import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../../../http';
import dayjs from 'dayjs';
import UserContext from '../../../contexts/UserContext';
import global from '../../../global';
import RoleGuard from '../../../utils/RoleGuard';

const PointsHistory = () => {
    RoleGuard('User');

    const points = 10; // Current points
    const maxPoints = 276; // Points required for the next tier
    const rewards = [
      {
        pointid: 1,
        discount: '10% OFF',
        description: 'Get a 10% off your next order!',
        expiryDate: '21/12/2024',
      },
      {
        pointid: 2,
        discount: '5% OFF',
        description: 'Get a 5% off your next order!',
        expiryDate: '28/12/2024',
      },
    ];
  
    return (
      <Box 
        sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          backgroundColor: '#F5F5F5', 
          padding: '2rem' 
        }}
      >
        {/* Header Section */}
        <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>
          Sustainable Points
        </Typography>
  
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', color: '#C2185B' }}>
          Bronze Member <StarIcon sx={{ marginLeft: '0.5rem' }} />
        </Typography>
  
        {/* Points Bar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', width: '100%', maxWidth: '500px' }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
            {points} pts
          </Typography>
          <LinearProgress
            variant="determinate"
            value={(points / maxPoints) * 100}
            sx={{ flexGrow: 1, height: '10px', borderRadius: '5px', backgroundColor: '#E0E0E0' }}
          />
          <Typography>{points} / {maxPoints}</Typography>
        </Box>
  
        <Typography variant="body2" sx={{ marginBottom: '2rem' }}>
          * {points} pts will be expired on <b>01/06/2025</b>
        </Typography>
  
        {/* Rewards Section */}
        <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '1rem' }}>
          Your Rewards
        </Typography>
  
        <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
          {rewards.map((reward) => (
            <Grid item xs={12} sm={6} md={4} key={reward.pointid} sx={{ display: 'flex', justifyContent: 'center' }}>
              <Card sx={{ backgroundColor: '#E3F2FD', boxShadow: 3, width: '100%', maxWidth: '300px' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', marginBottom: '0.5rem', textAlign: 'center' }}>
                    {reward.discount}
                  </Typography>
                  <Typography variant="body2" sx={{ marginBottom: '0.5rem', textAlign: 'center' }}>
                    {reward.description}
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ marginBottom: '1rem', textAlign: 'center' }}>
                    Expires on {reward.expiryDate}
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ textTransform: 'none', fontWeight: 'bold', backgroundColor: '#C6487E', '&:hover': { backgroundColor: '#B0376D' } }}
                  >
                    Order Now
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  };
  
  export default PointsHistory;

