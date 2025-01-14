import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import http from '../../http';
import { Box, Typography, CircularProgress } from '@mui/material';

const OrderConfirmation = () => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const orderId = searchParams.get('orderId');

    useEffect(() => {
        if (orderId) {
            fetchOrderDetails(orderId);
        }
    }, [orderId]);

    const fetchOrderDetails = async (orderId) => {
        try {
            const response = await http.get(`/order/${orderId}`);
            setOrder(response.data);
        } catch (error) {
            console.error('Error fetching order details:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (!order) {
        return <Typography variant="h6">Order not found</Typography>;
    }

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Order Confirmation
            </Typography>
            <Typography variant="h6" gutterBottom>
                Order ID: {order.orderId}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                Full Name: {order.fullName}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                Email: {order.email}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                Address: {order.address}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                Order Date: {new Date(order.orderDate).toLocaleString()}
            </Typography>
            <Typography variant="subtitle1" gutterBottom>
                Total Price: ${order.totalPrice.toFixed(2)}
            </Typography>
            <Typography variant="h5" gutterBottom>
                Items:
            </Typography>
            {order.orderItems.map((item, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1">
                        {item.productName} x {item.quantity} : ${item.price.toFixed(2)}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
};

export default OrderConfirmation;