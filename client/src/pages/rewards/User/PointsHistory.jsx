import React, { useEffect, useState, useContext } from 'react';
import { Box, Typography, Button, Card, CardContent, Grid, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import http from '../../../http';
import dayjs from 'dayjs';
import UserContext from '../../../contexts/UserContext';
import RoleGuard from '../../../utils/RoleGuard';
import RewardsSidebar from "./RewardsSidebar.jsx";



const PointsHistory = () => {
    RoleGuard('User');
    const { user } = useContext(UserContext);
    const [pointsHistory, setPointsHistory] = useState([]);
    const [bonusPointsHistory, setBonusPointsHistory] = useState([]);


    useEffect(() => {
        http.get("/auth/current-user", { withCredentials: true })
            .then((res) => {
                setUser(res.data);
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

            // Fetch bonus points history
            http.get(`/PointsHistory/bonus/${user.id}`)
                .then((res) => {
                    setBonusPointsHistory(res.data);
                })
                .catch((err) => {
                    console.error("Error fetching bonus points history", err);
                });
        }
    }, [user]);

    return (
        <Box sx={{ display: "flex", height: "100vh", marginTop: "2em", overflow: "hidden" }}>
            {/* Sidebar */}
            <RewardsSidebar />
            {/* Main Content */}
            <Box
                sx={{
                    marginLeft: "240px",
                    width: "80%",
                    padding: 5,
                    backgroundColor: "#FFFFFF",
                    marginTop: "5px",
                    paddingLeft: "3em",
                    overflowX: "hidden",
                }}
            >
                <Container maxWidth="md">
                    <Box p={3} mt={10} bgcolor="white" mb={5}>
                        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={5}>
                            Points History
                        </Typography>
                        <Grid container spacing={2} justifyContent="center">
                            {pointsHistory.length > 0 || bonusPointsHistory.length > 0 ? (
                                [...pointsHistory, ...bonusPointsHistory].sort((a, b) =>
                                    new Date(b.date || b.createdAt) - new Date(a.date || a.createdAt)
                                ).map((history, index) => (
                                    <Grid item xs={12} key={index}>
                                        <Card sx={{ backgroundColor: history.totalPoints ? '#E3F2FD' : '#FFF3E0' }}>
                                            <CardContent>
                                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                                    <Typography variant="h6" fontWeight="bold">
                                                        {history.orderId ? `OrderID: #Vegeatery${history.orderDate.substring(0, 10).replace(/-/g, "").slice(0, 6)}${history.orderId}` : history.description}
                                                    </Typography>
                                                    <Typography variant="h6" fontWeight="bold" marginRight={2} color={history.totalPoints ? "black" : "green"}>
                                                        +{history.totalPoints || history.points} pts
                                                    </Typography>
                                                </Box>
                                                <Typography sx={{ color: "#817F7F" }}>
                                                    Date: {dayjs(history.date || history.createdAt).format('DD/MM/YYYY HH:mm')}
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
            </Box>
        </Box>
    );
};

export default PointsHistory;
