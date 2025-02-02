import { Box, Typography, LinearProgress, Button, Card, CardContent, Grid2 as Grid, Input, IconButton, Container } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import http from '../../../http'; 
import dayjs from 'dayjs';
import RoleGuard from '../../../utils/RoleGuard';

const PointsSystem = () => {
  RoleGuard('user');
  const points = 100; // Current points
  const maxPoints = 276; // Points required for the next tier
  const [vouchers, setVouchers] = useState([]); // State to store fetched vouchers

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      const { data } = await http.get('/vouchers'); // Fetch vouchers from the API
      setVouchers(data); // Store the fetched vouchers
    } catch (error) {
      console.error('Error fetching vouchers:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200,
          minHeight: 500, 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      backgroundColor: '#FFFFFF', 
      padding: '2rem', 
      boxShadow: 3, 
      borderRadius: 2,
      overflow: "hidden",
      overflowY: "auto",  
      overflowX: "hidden",  
      paddingBottom: '2rem',
    marginTop: '2rem'}}
          >
    <Container maxWidth="md"
     sx={{ display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      py: 4,
      paddingBottom: '1rem',
      width: '100%' }}>
      {/* Header Section */}
      <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
        Sustainable Points
      </Typography>

      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', color: '#C2185B' }}>
        Bronze Member <StarIcon sx={{ marginLeft: '0.5rem' }} />
      </Typography>

      {/* Points Bar */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', maxWidth: 500, mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          {points} pts
        </Typography>
        <LinearProgress variant="determinate" 
        value={(points / maxPoints) * 100} 
        sx={{ 
          flexGrow: 1, 
          height: '10px', 
          borderRadius: '5px', 
          backgroundColor: '#E0E0E0',
          '& .MuiLinearProgress-bar': {
      backgroundColor: '#C2185B',
    }}} />
        <Typography>{points} / {maxPoints}</Typography>
      </Box>

      <Typography variant="body2" sx={{ marginBottom: '2rem' }}>
        * {points} pts will be expired on <b>01/06/2025</b>
      </Typography>

      {/* Rewards Section */}
      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '1rem' }}>
        Rewards Vouchers
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {vouchers.map((voucher) => (
          <Grid item xs={12} sm={6} md={4} key={voucher.voucherId} display="flex" justifyContent="center">
            <Card sx={{ backgroundColor: '#E3F2FD', boxShadow: 3, width: '100%', maxWidth: 300 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" textAlign="center" gutterBottom>
                  {voucher.voucherName}
                </Typography>
                <Typography variant="caption" display="block" textAlign="center" gutterBottom>
                  Expires on {dayjs(voucher.ExpiryDate).format('DD/MM/YYYY')}
                </Typography>
                <Button variant="contained" fullWidth sx={{ textTransform: 'none', color: '#FFFFFF', backgroundColor: '#C2185B', '&:hover': { backgroundColor: '#E7ABC5' } }}>
                  USE VOUCHER
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
    </Box>
  );
};

export default PointsSystem;
