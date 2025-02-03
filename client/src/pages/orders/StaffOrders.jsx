import React, { useEffect, useState } from 'react';
import http from '../../http';
import { Box, Typography, CircularProgress, Tabs, Tab, Button, Grid2 as Grid } from '@mui/material';
import dayjs from 'dayjs';


const StaffOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [currentTab, setCurrentTab] = useState(0);
    const start = `${date}T00:00:00`;
    const end = `${date}T23:59:59`;

    // Get Orders by status and date
    const GetOrderByStatusAndDate = (start, end, status) => {
        setLoading(true);

        http.get(`/order/dateAndStatus?startDate=${start}&endDate=${end}&status=${status}`)
            .then((res) => {
                setLoading(false);
                setOrders(res.data || []);
                console.log("API response:", res.data);
            })
            .catch((error) => {
                setLoading(false);
                console.error("Error fetching orders:", error);
            })
    }

    // Update Order status
    const UpdateOrderStatus = (orderId, status) => {
        setLoading(true);
        const orderData = {
            orderId: orderId,
            status: status,
        }

        http.put("/order/updateStatus", orderData)
            .then((res) => {
                setLoading(false);
                GetOrderByStatusAndDate(start, end, currentTabToStatus(currentTab));
            })
            .catch((res) => {
                setLoading(false);
                console.error("Error updating orders:", error);
            })
    }

    // Convert tab index to status string
    const currentTabToStatus = (tabIndex) => {
        switch (tabIndex) {
            case 0:
                return 'New';
            case 1:
                return 'In-Progress';
            case 2:
                return 'Ready';
            default:
                return 'New';
        }
    };

    // Handle Tab Change
    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
        GetOrderByStatusAndDate(start, end, currentTabToStatus(newValue));
    };

    // Fetch orders on initial render
    useEffect(() => {
        GetOrderByStatusAndDate(start, end, currentTabToStatus(currentTab));
    }, []);

    // Get button text based on current tab
    const getButtonText = () => {
        switch (currentTab) {
            case 0:
                return 'Send To Kitchen';
            case 1:
                return 'Mark as Ready';
            case 2:
                return 'Mark as Completed';
            default:
                return '';
        }
    };

    // Get next status based on current tab
    const getNextStatus = () => {
        switch (currentTab) {
            case 0:
                return 'In-Progress';
            case 1:
                return 'Ready';
            case 2:
                return 'Completed';
            default:
                return '';
        }
    };

    // convert back to 12 hour clock
    const convertTo12HourFormat = (timeStr) => {
        if (!timeStr) return null;
    
        const [hours, minutes] = timeStr.split(":").map(Number);
        const period = hours >= 12 ? "PM" : "AM";
        let displayHours = hours % 12;
    
        if (displayHours === 0) displayHours = 12; // Handle 12 AM/PM case
    
        return `${displayHours}:${String(minutes).padStart(2, "0")}${period}`;
    };

    if (loading) {
        return (
            <Box>
                <Typography variant="h5" sx={{ my: 2 }}>
                    Orders
                </Typography>
                <Tabs value={currentTab} onChange={handleTabChange}>
                    <Tab label="New Orders" />
                    <Tab label="In-Progress" />
                    <Tab label="Ready" />
                </Tabs>
                <Box sx={{ mt: 2 }}><CircularProgress />;</Box>
            </Box>

        )
    }

    // Update page dynamically
    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Active Orders
            </Typography>
            <Tabs value={currentTab} onChange={handleTabChange}>
                <Tab label="New Orders" />
                <Tab label="In-Progress" />
                <Tab label="Ready" />
            </Tabs>
            <Grid container spacing={2}>
                {orders.length > 0 ? (
                    orders.map((order, i) => {
                        console.log(order.orderId)
                        return (
                            <Box key={order.orderId} sx={{ mb: 2, mt: 2, p: 2, border: '1px solid #ccc' }}>
                                <Typography variant="h6">Order ID: {order.orderId}</Typography>
                                {order.items.map((item, i) => {
                                    console.log(item.productId)
                                    return (
                                        <Box key={item.productName || i} sx={{ mb: 2 }}>
                                            <Typography variant="subtitle1">
                                                x{item.quantity} {item.productName}
                                            </Typography>
                                        </Box>
                                    )
                                })}
                                <Typography>Pick-Up Time: {convertTo12HourFormat(order.timeSlot)}</Typography>
                                <Typography>Status: {order.status}</Typography>
                                <Button
                                    variant="contained"
                                    onClick={() => UpdateOrderStatus(order.orderId, getNextStatus())}
                                >
                                    {getButtonText()}
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
        </Box>
    )
};

export default StaffOrders;