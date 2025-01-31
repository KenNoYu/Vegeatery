import React, { useState, useEffect } from 'react';
import http from "../../../http.js";
import { Grid, Box, Typography, Avatar, Button, Divider, Card, CardContent, IconButton, LinearProgress } from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom'; 

function UserOverview() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/overview/profile');
  }

  useEffect(() => {
    // Only make the request if there is a valid token in localStorage
    const token = localStorage.getItem("accessToken");
    console.log(token);

    if (token) {
      http
        .get("/Auth/current-user", {
          headers: {
            Authorization: `Bearer ${token}`  // Correct key for the JWT token in localStorage
          }
        })
        .then((res) => {
          console.log(res.data);
          setUser(res.data);  // Store the user data in state
          setLoading(false); // Stop loading once data is fetched
        })
        .catch((err) => {
          console.error("Failed to fetch user data", err);
          setError("Failed to fetch user data");  // Set error message
          setLoading(false);  // Stop loading even in case of error
        });
    } else {
      setLoading(false);  // If no token, stop loading
    }
  }, []);

  // If still loading, show a loading message
  if (loading) {
    return <div>Loading...</div>;
  }

  // If there was an error, display the error message
  if (error) {
    return <div>{error}</div>;
  }

  // If user data is available, display the user profile
  if (user) {
    return (
      <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <Box sx={{ width: '20%', backgroundColor: '#F8F9FB', padding: 2 }}>
        <Typography variant="h6" sx={{ paddingLeft: 2 }}>VEBEATERY</Typography>
        {/* Add Sidebar Menu here */}
      </Box>

      {/* Main Content */}
      <Box sx={{ width: '80%', padding: 3 }}>
        {/* Profile Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Avatar alt="User Photo" src="/path/to/avatar.jpg" sx={{ width: 80, height: 80 }} />
            <Box>
              <Typography variant="h5">{user.username}</Typography>
              <Typography variant="body1" color="textSecondary">BRONZE</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="body1">{user.totalPoints}</Typography>
                <LinearProgress variant="determinate" value={50} sx={{ width: '100px', height: 10, borderRadius: 5 }} />
                <Typography variant="body2" color="textSecondary">277 to Bronze</Typography>
              </Box>
              <Typography variant="caption" color="textSecondary">Joined Since  {new Date(user.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
              </Typography>
            </Box>
          </Box>
          <Button variant="outlined" startIcon={<EditIcon />} onClick={handleClick} style={{ color: '#C6487E' }}>Edit Profile</Button>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Upcoming Reservations */}
        <Box>
          <Typography variant="h6" gutterBottom>
            Upcoming Reservations
          </Typography>
          <Card sx={{ mb: 2 }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="body1">4 Dec 2024, 7:00pm</Typography>
                <Typography variant="caption" color="textSecondary">15 Pax</Typography>
              </Box>
              <Button variant="outlined" size="small" startIcon={<EditIcon />}>Edit Details</Button>
            </CardContent>
          </Card>
          <Card>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Box>
                <Typography variant="body1">8 Dec 2024, 1:00pm</Typography>
                <Typography variant="caption" color="textSecondary">1 Baby Chair</Typography>
              </Box>
              <Button variant="outlined" size="small" startIcon={<EditIcon />}>Edit Details</Button>
            </CardContent>
          </Card>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Recent Purchases */}
        <Box>
          <Typography variant="h6" gutterBottom>Recent Purchases</Typography>
          <Card sx={{ mb: 2 }}>
            <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <img src="/path/to/product.jpg" alt="Product" style={{ width: 80, height: 80 }} />
                <Box>
                  <Typography variant="body1">Green Bowl Bliss</Typography>
                  <Typography variant="caption" color="textSecondary">x2</Typography>
                </Box>
              </Box>
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="body1">$10.50</Typography>
                <Button variant="contained" size="small">Buy Again</Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
    );
  }

  // Fallback rendering if no user or error
  return <div>No user data available.</div>;
}

export default UserOverview;
