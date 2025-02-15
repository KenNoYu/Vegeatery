import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Button, Card, CardContent, Grid, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import http from '../../../http';
import dayjs from 'dayjs';
import UserContext from '../../../contexts/UserContext';
import RoleGuard from '../../../utils/RoleGuard';

const PointsHistory = () => {
    RoleGuard('User');
    const { user } = useContext(UserContext);
    const [pointsHistory, setPointsHistory] = useState([]);

    useEffect(() => {
      http.get("/auth/current-user", { withCredentials: true }) 
          .then((res) => {
              setUser(res.data);  // FIXED: Store only user data
          })
          .catch((err) => {
              console.error("Failed to fetch user data", err);
          });
  }, []);
  

    useEffect(() => {
        if (user && user.id) {
            http.get(`/PointsHistory/${user.id}`)
                .then((res) => {
                    setPointsHistory(res.data);
                })
                .catch((err) => {
                    console.error("Error fetching points history", err);
                });
        }
    }, [user]);

    return (
        <Container maxWidth="md">
            <Box p={3} mt={10} bgcolor="white" borderRadius={2} boxShadow={3} mb={5}>
                <Typography variant="h4" fontWeight="bold" mt={5} ml={3} mb={2} textAlign="center">
                    Points History
                </Typography>
                <Grid container spacing={2} justifyContent="center">
                    {pointsHistory.length > 0 ? (
                        pointsHistory.map((history) => (
                            <Grid item xs={12} key={history.orderId}>
                                <Card sx={{backgroundColor: '#E3F2FD'}}>
                                    <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                                        <Typography variant="h6" fontWeight="bold">
                                            OrderID: #Vegeatery{history.orderDate.substring(0, 10).replace(/-/g, "").slice(0, 6)}{history.orderId}
                                        </Typography>
                                        <Typography variant="h6" color="#FFFFF" fontWeight="bold" marginRight={2}>
                                            +{history.totalPoints} pts
                                        </Typography>
                                        </Box>
                                        <Typography mb={1} sx={{color:"#817F7F"}}>
                                            Date: {dayjs(history.orderDate).format('DD/MM/YYYY HH:mm')}
                                        </Typography> 
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Typography>No points history found.</Typography>
                    )}
                </Grid>
            </Box>
        </Container>
    );
};

export default PointsHistory;
