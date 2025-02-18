import React, { useEffect, useState } from 'react';
import { Box, Typography, LinearProgress, Button, Card, CardContent, Grid, Container } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import http from '../../../http';
import dayjs from 'dayjs';
import RoleGuard from '../../../utils/RoleGuard';
import { useNavigate } from 'react-router-dom';
import RewardsSidebar from "./RewardsSidebar.jsx";

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
      // Filter vouchers that are not in cooldown (LastUsedAt + 7 days <= today)
      const filteredVouchers = data.filter(voucher =>
        !voucher.LastUsedAt || dayjs(voucher.LastUsedAt).add(7, 'day').isBefore(dayjs())
      );

      setVouchers(filteredVouchers);
    } catch (error) {
      console.error('Error fetching vouchers:', error);
    }
  };


  if (!userId) return <Typography>Loading...</Typography>;

  // Calculate progress capped at 100% when points are 777 or more
  const progress = userId.totalPoints >= 777 ? 100 : (userId.totalPoints / 777) * 100;

  const groupedVouchers = {
    Gold: vouchers.filter(v => v.tier?.tierName === 'Gold'),
    Silver: vouchers.filter(v => v.tier?.tierName === 'Silver'),
    Bronze: vouchers.filter(v => v.tier?.tierName === 'Bronze')
  };

  // Define tier styles for vouchers
  const tierStyles = {
    Gold: { backgroundColor: '#E5D040', color: '#000' },
    Silver: { backgroundColor: '#C0C0C0', color: '#000' },
    Bronze: { backgroundColor: '#CD7F32', color: '#FFF' }
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", marginTop: "2em", overflow: "hidden", overflowX: "hidden" }}>
      {/* Sidebar */}
      <Box sx={{ width: "20%" }}>
        <RewardsSidebar />
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          width: "80%",
          padding: 5,
          backgroundColor: "#FFFFFF",
          marginTop: "5px",
          paddingLeft: "3em",
          overflowX: "hidden",
        }}
      >

        <Box sx={{ maxWidth: 1200, minHeight: 500, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFFFFF', padding: '2rem', overflow: "hidden", overflowY: "auto", overflowX: "hidden", paddingBottom: '2rem', marginTop: '2rem' }}>
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

          <Typography variant="body2" sx={{ marginBottom: '6rem' }}>
            * {userId.totalPoints} pts will be expired on <b>{dayjs(userId.pointsExpiryDate).format('DD/MM/YYYY')}</b>
          </Typography>

          <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center' }}>
            Your Rewards Vouchers
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            {vouchers.length > 0 ? (
              vouchers.map((voucher) => (
                <Grid item xs={12} sm={6} md={4} key={voucher.voucherId} display="flex" justifyContent="center">
                  <Card sx={tierStyles[userId.tierName] || { backgroundColor: '#E3F2FD', boxShadow: 3, width: '100%', maxWidth: 300 }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" textAlign="center" gutterBottom>
                        {voucher.voucherName}
                      </Typography>
                      <Typography variant="caption" display="block" textAlign="center" gutterBottom>
                        Cool down period of 1 week after use!
                      </Typography>
                      <Button onClick={() => navigate('/user/store')} variant="contained" fullWidth sx={{ textTransform: 'none', color: '#FFFFFF', backgroundColor: '#C2185B', '&:hover': { backgroundColor: '#E7ABC5' } }}>
                        BUY NOW
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12} display="flex" justifyContent="center">
                <Typography variant="body1">No vouchers are available.</Typography>
              </Grid>
            )}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default PointsSystem;