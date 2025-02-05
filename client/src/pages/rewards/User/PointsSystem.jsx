import React, { useEffect, useState } from 'react';
import { Box, Typography, LinearProgress, Button, Card, CardContent, Grid } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import http from '../../../http';
import dayjs from 'dayjs';
import RoleGuard from '../../../utils/RoleGuard';
import { useNavigate } from 'react-router-dom';

const PointsSystem = () => {
  RoleGuard('User');
  const [vouchers, setVouchers] = useState([]);
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchVouchers(userId);
    }
  }, [userId]); 

  const fetchUserData = async () => {
    try {
      const { data } = await http.get('/Auth/current-user');
      setUserId(data);
      console.log(data.id);
      fetchVouchers(data.userId);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };


  const updateUserData = async () => {
    try {
      const { data } = await http.put(`/users/${userId.id}/points`, { points: 0 }); // Dummy update
      setUserId((prev) => ({ ...prev, totalPoints: data.newTotalPoints, tierName: data.newTier }));
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };
  
  useEffect(() => {
    if (userId) {
      updateUserData();
    }
  }, [userId?.totalPoints]);

  const fetchVouchers = async () => {
    try {
      const { data } = await http.get(`/vouchers/user/${userId.id}`);
      setVouchers(data);
    } catch (error) {
      console.error('Error fetching vouchers:', error);
    }
  };

  if (!userId) return <Typography>Loading...</Typography>;

  // Calculate progress capped at 100% when points are 777 or more
  const progress = userId.totalPoints >= 777 ? 100 : (userId.totalPoints / 777) * 100;



  return (
    <Box sx={{ maxWidth: 1200, minHeight: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', padding: '2rem', boxShadow: 3, borderRadius: 2, overflow: "hidden", overflowY: "auto", overflowX: "hidden", paddingBottom: '2rem', marginTop: '2rem' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom textAlign="center">
        Sustainable Points
      </Typography>

      <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', color: '#C2185B' }}>
        {userId.tierName} Member <StarIcon sx={{ marginLeft: '0.5rem' }} />
      </Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', maxWidth: 500, mb: 2 }}>
        <Typography variant="h6" fontWeight="bold">
          {userId.totalPoints} pts
        </Typography>
        <LinearProgress variant="determinate" value={progress} sx={{ flexGrow: 1, height: '10px', borderRadius: '5px', backgroundColor: '#E0E0E0', '& .MuiLinearProgress-bar': { backgroundColor: '#C2185B' } }} />
        <Typography>777 pts</Typography>
      </Box>

      <Typography variant="body2" sx={{ marginBottom: '2rem' }}>
        * {userId.totalPoints} pts will be expired on <b>01/06/2025</b>
      </Typography>

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
                <Button onClick={() => navigate('/user/store')} variant="contained" fullWidth sx={{ textTransform: 'none', color: '#FFFFFF', backgroundColor: '#C2185B', '&:hover': { backgroundColor: '#E7ABC5' } }}>
                  USE VOUCHER
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PointsSystem;