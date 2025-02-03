import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, RadioGroup, FormControlLabel, Radio, Typography, Avatar, Input, Grid2 as Grid, Card } from '@mui/material';
import { styled } from '@mui/system';
import http from '../../../http';
import UserContext from '../../../contexts/UserContext'
import { UserProvider } from '../../../contexts/UserContext'
import { WindowSharp } from '@mui/icons-material';
import * as yup from 'yup';
import { ToastContainer, toast } from "react-toastify";
import Sidebar from "./UserSidebar";

const ProfileBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    marginTop: "0.3em",
}));

const MyOrdersPage = () => {
    const [userId, setUserId] = useState(null);
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState([]);
    const [loading, setLoading] = useState(true);

    //TODO: function to buy order again

    // function to get order by cust id
    const GetOrderByCustId = (custId) => {
        http.get(`/order/customerId?custId=${custId}`)
            .then((res) => {
                setOrders(res.data || [])
                console.log("API response:", res.data);
            })
            .catch((error) => {
                setLoading(false);
                setError(error)
                console.error("Error fetching orders:", error);
            })
    }

    useEffect(() => {
        http
            .get("/auth/current-user", { withCredentials: true }) // withCredentials ensures cookies are sent
            .then((res) => {
                console.log(res);
                setUserId(res.data.id);
                GetOrderByCustId(res.data.id);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch user data", err);
                setError("Failed to fetch user data");
                setLoading(false);
            });
    }, []);

    return (
        <Box sx={{ display: "flex", height: "100vh", marginTop: "2em" }}>
            {/* Sidebar */}
            <Box sx={{ width: "250px",}}>
                <Sidebar />
            </Box>
            {/* Main Content */}
            <Box sx={{ flex: 1, padding: "2em", backgroundColor: "#ffffff", borderTopRightRadius: "16px", borderBottomRightRadius: "16px", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", height: "100vh", flexDirection: "column",}}>
                {/* Order History */}
                <Typography variant="h3" sx={{ my: 2 }}>
                    Order History
                </Typography>
                <Grid container spacing={3}>
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <Grid item xs={12} md={12} lg={12} key={order.orderId}>
                                <Card sx={{ p: 2, borderRadius: "12px", boxShadow: 3, width: "100%", maxWidth: "1200px", margin: "0 auto", }}>
                                    <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                                        {order.orderItems.map((item, i) => {
                                            return (
                                                <Box key={item.productName || i} sx={{ mb: 2 }}>
                                                    <Typography variant='h6'>
                                                        {item.productName} <Typography variant="subtitle1">
                                                            x {item.quantity}
                                                        </Typography>
                                                    </Typography>
                                                </Box>
                                            )
                                        })}
                                        <Box sx={{ marginLeft: "auto" }}>
                                            <Typography variant="h6" color="primary">
                                                Price: ${order.totalPrice.toFixed(2)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                        Rate products by date
                                    </Typography>
                                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                        <Button variant="contained" color="secondary">
                                            Review
                                        </Button>
                                        <Button variant="contained" color="primary">
                                            Buy Again
                                        </Button>
                                    </Box>
                                </Card>
                            </Grid>
                        ))
                    ) : (
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            No Past Orders.
                        </Typography>
                    )}
                </Grid>
            </Box>
        </Box>
    );
}

export default MyOrdersPage;