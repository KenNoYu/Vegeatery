import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, RadioGroup, FormControlLabel, Radio, Typography, Avatar, Input, Grid2 as Grid } from '@mui/material';
import { styled } from '@mui/system';
import http from '../../../http';
import UserContext from '../../../contexts/UserContext'
import { UserProvider } from '../../../contexts/UserContext'
import { WindowSharp } from '@mui/icons-material';
import * as yup from 'yup';
import { ToastContainer, toast } from "react-toastify";

const MyOrdersPage = () => {
    const [userId, setUserId] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    //TODO: function to buy order again

    // function to get order by cust id
    const GetOrderByCustId = () => {
        http.get(`/order/customerId?custId=${userId}`)
            .then((res) => {
                setOrders(res.data || [])
                console.log("API response:", res.data);
            })
            .catch((error) => {
                setLoading(false);
                console.error("Error fetching orders:", error);
            })
    }

    // Use useEffect to fetch user id when the component loads
    useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            http
                .get("/Auth/auth")
                .then((res) => {
                    setUserId(res.data.user.id);
                })
                .catch((err) => {
                    console.error("Error fetching user data", err);
                });
        }
        GetOrderByCustId();
        setLoading(false);
    }, []);

    return (
        <ProfileBox>
            loading ? (
            <Typography variant="body1">Loading profile...</Typography>
            ) : error ? (
            <Typography variant="body1" color="error">
                Error fetching profile: {error}
            </Typography>
            ) : userId ? (
            <>
                {/* OrderHistory */}
                <Typography variant="h5" sx={{ my: 2 }}>
                    Orders History
                </Typography>
                <Grid container spacing={2} columns={12}>
                    {orders.length > 0 ? (
                        orders.map((order, i) => {
                            return (
                                <Box key={order.orderId} sx={{ mb: 2, mt: 2, p: 2, border: '1px solid #ccc' }}>
                                    <Typography variant="h6">Order ID: {order.orderId}</Typography>
                                    <Typography variant="h6">{order.orderId}</Typography>
                                    {order.items.map((item, i) => {
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
                                    <Typography variant="h6">Date Ordered: {order.orderDate}</Typography>
                                    <Typography variant="h6">Price: {order.totalPrice}</Typography>
                                    <Button
                                        variant="contained"
                                    >
                                        Review
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color='Accent'
                                    >
                                        Buy Again
                                    </Button>
                                </Box>
                            )
                        })
                    ) : (
                        <Typography variant="body1" sx={{ mt: 2 }}>
                            No {currentTabToStatus(currentTab).replace('-', ' ')} orders.
                        </Typography>
                    )}
                </Grid>
            </>
            )
        </ProfileBox>
    );
}