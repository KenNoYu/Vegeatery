import React, { useEffect, useState } from 'react';
import http from '../../http';
import { Box, Typography, CircularProgress, Tabs, Tab, Button, Grid2 as Grid } from '@mui/material';
import dayjs from 'dayjs';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [currentTab, setCurrentTab] = useState(0);
    const start = `${startDate}T00:00:00`;
    const end = `${endDate}T23:59:59`;

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

    // Convert tab index to status string
    const currentTabToStatus = (tabIndex) => {
        switch (tabIndex) {
            case 0:
                return 'All Orders';
            case 1:
                return 'In-Progress';
            case 2:
                return 'Completed';
            default:
                return 'All Orders';
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

    if (loading) {
        return (
            <Box>
                <Typography variant="h5" sx={{ my: 2 }}>
                    Orders
                </Typography>
                <Tabs value={currentTab} onChange={handleTabChange}>
                    <Tab label="All Orders" />
                    <Tab label="In-Progress" />
                    <Tab label="Completed" />
                </Tabs>

                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <TextField
                        label="From"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="To"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                    />
                    <Button variant="contained" onClick={() => GetOrderByStatusAndDate(start, end, currentTabToStatus(currentTab))}>
                        Filter
                    </Button>
                    <Button variant="outlined">Export as CSV</Button>
                </Box>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Id</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Address</TableCell>
                                <TableCell>Pick-Up Time</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <Box sx={{ mt: 2 }}><CircularProgress />;</Box>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        )
    }

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h5" gutterBottom>
                Orders
            </Typography>
            <Tabs value={currentTab} onChange={handleTabChange} sx={{ mb: 2 }}>
                <Tab label="All Orders" />
                <Tab label="In-Progress" />
                <Tab label="Completed" />
            </Tabs>

            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                    label="From"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    label="To"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                />
                <Button variant="contained" onClick={() => GetOrderByStatusAndDate(start, end, currentTabToStatus(currentTab))}>
                    Filter
                </Button>
                <Button variant="outlined">Export as CSV</Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Pick-Up Time</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/*
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{order.name}</TableCell>
                                <TableCell>{order.address}</TableCell>
                                <TableCell>{order.pickUpTime}</TableCell>
                                <TableCell>{order.status}</TableCell>
                                <TableCell>
                                    <Button variant="outlined" size="small">
                                        Details
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}*/}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    )
};

export default AdminOrders;