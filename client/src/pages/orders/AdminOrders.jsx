import React, { useEffect, useState } from 'react';
import http from '../../http';
import {
    Box, Typography, CircularProgress, Tabs, Tab, Button, Grid2 as Grid, TableContainer, Paper, Table, TableHead, TableBody, TableCell, TableRow, Dialog,
    DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import dayjs from 'dayjs';
import DateSelector from "../Reservation/Components/DateSelector";
import AdminDateSelector from './AdminDateSelector';
import { ToastContainer, toast } from 'react-toastify';

const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [startDate, setStartDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [currentTab, setCurrentTab] = useState(0);
    const [StartDateDialog, setStartDateDialog] = useState(false);
    const [EndDateDialog, setEndDateDialog] = useState(false);
    const [expandedRow, setExpandedRow] = useState(null);

    const start = `${startDate}T00:00:00`;
    const end = `${endDate}T23:59:59`;

    // Get Orders by status and date
    const GetOrderByStatusAndDate = async (start, end, status) => {
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

    const GetAllOrders = async () => {
        http.get(`/order/allByDate?startDate=${start}&endDate=${end}`)
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

        if (newValue === 0) {
            GetAllOrders();
        } else {
            GetOrderByStatusAndDate(start, end, currentTabToStatus(newValue));
        }
    };

    // Fetch orders on initial render
    useEffect(() => {
        GetAllOrders();
    }, []);

    // Handling the date range
    const handleStartDateSelect = (date) => {
        setStartDate(date);
    };

    const handleEndDateSelect = (date) => {
        setEndDate(date);
    };

    // handling dialog
    const handleStartDialogOpen = () => {
        setStartDateDialog(true);
    };

    const handleStartDialogClose = () => {
        setStartDateDialog(false);
    };

    const handleStartDialogConfirm = (date) => {
        setStartDateDialog(false);
        setLoading(true);
        setStartDate(date);
        if (currentTab === 0) {
            GetAllOrders().then(() => {
                setLoading(false); // Set loading false once the data has been fetched
            });
        } else {
            GetOrderByStatusAndDate(startDate, endDate, currentTabToStatus(currentTab)).then(() => {
                setLoading(false); // Set loading false after fetching the data
            });
        }
    };

    const handleEndDialogOpen = () => {
        setEndDateDialog(true);
    };

    const handleEndDialogClose = () => {
        setEndDateDialog(false);
    };

    const handleEndDialogConfirm = (date) => {
        setEndDateDialog(false);
        setLoading(true);
        setEndDate(date);
        if (currentTab === 0) {
            GetAllOrders().then(() => {
                setLoading(false); // Set loading false once the data has been fetched
            });
        } else {
            GetOrderByStatusAndDate(startDate, endDate, currentTabToStatus(currentTab)).then(() => {
                setLoading(false); // Set loading false after fetching the data
            });
        }
    };

    // handle row expanded
    const exportToCSV = () => {
        try {
            // Check if there are any orders to export
            if (!orders || orders.length === 0) {
                alert("No orders available to export.");
                return;
            }
    
            // Construct CSV headers
            const headers = [
                "Id,Name,Address,Pick-Up Time,Status,Products",
            ];
    
            // Generate CSV rows
            const rows = orders.map((order) => {
                // Safely retrieve product details and format them
                const products = order.items
                    .map((item) => {
                        const itemName = item.productName || "Unknown Item";
                        const quantity = item.quantity || 0;
                        const price =
                            item.price != null ? `$${item.price.toFixed(2)}` : "$0.00";
    
                        return `${itemName} x${quantity} @ ${price}`;
                    })
                    .join(" | ");
    
                // Safely format order details
                const id = order.orderId || "Unknown ID";
                const name = order.fullName || "Unknown Name";
                const address = order.address || "Unknown Address";
                const pickUpTime = order.timeSlot || "Unknown Time";
                const status = order.status || "Unknown Status";
    
                return `"${id}","${name}","${address}","${pickUpTime}","${status}","${products}"`;
            });
    
            // Combine headers and rows into the final CSV content
            const csvContent = [headers, ...rows].join("\n");
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    
            // Create and trigger download
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "orders.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
    
            console.log("CSV export successful.");
        } catch (error) {
            console.error("Error exporting CSV:", error);
            toast.error(
                "An error occurred while exporting the CSV. Please try again."
            );
        }
    };

    // row toggling
    const toggleRow = (id) => {
        // If the clicked row is already expanded, collapse it. Otherwise, expand it.
        setExpandedRow(prevExpandedRow => (prevExpandedRow === id ? null : id));
    };
    

    if (loading) {
        return (
            <Box>
                <Typography variant="h5" sx={{ my: 2 }}>
                    Orders
                </Typography>
                <Tabs value={currentTab} onChange={handleTabChange} color="Accent">
                    <Tab label="All Orders" />
                    <Tab label="In-Progress" />
                    <Tab label="Completed" />
                </Tabs>

                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <Button
                        variant="outlined"
                        color="primaryText"
                        onClick={handleStartDialogOpen}
                    >
                        {`${new Date(startDate).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                        })}`}
                    </Button>
                    <Typography variant="body1">
                        To:
                    </Typography>
                    <Button
                        variant="outlined"
                        color="primaryText"
                        onClick={handleEndDialogOpen}
                    >
                        {`${new Date(endDate).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                        })}`}
                    </Button>
                </Box>
                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <Button
                        variant="outlined"
                        color="primaryText"
                        onClick={exportToCSV}
                    >
                        Export as CSV
                    </Button>
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
                            <Box sx={{color: "Primary" }}><CircularProgress />;</Box>
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
            <Tabs value={currentTab} onChange={handleTabChange} sx={{ mb: 2 }} color="Accent">
                <Tab label="All Orders" />
                <Tab label="In-Progress" />
                <Tab label="Completed" />
            </Tabs>

            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <Button
                    variant="outlined"
                    color="primaryText"
                    onClick={handleStartDialogOpen}
                >
                    {`${new Date(startDate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                    })}`}
                </Button>
                <Typography variant="body1">
                    To:
                </Typography>
                <Button
                    variant="outlined"
                    color="primaryText"
                    onClick={handleEndDialogOpen}
                >
                    {`${new Date(endDate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                    })}`}
                </Button>
            </Box>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                <Button
                    variant="outlined"
                    color="primaryText"
                    onClick={exportToCSV}
                >
                    Export as CSV
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Order Date</TableCell>
                            <TableCell>Pick-Up Time</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody sx={{
                        backgroundColor: 'transparent',
                    }}>
                        {orders.length > 0 ? (
                            orders.map((order, i) => (
                                <React.Fragment key={order.id || i}>
                                    <TableRow sx={{
                                        width: '100%',
                                        border: '1px solid black',
                                        borderRadius: '8px',
                                        marginTop: 2,
                                        marginBottom: 2, // Space between rows
                                        overflow: 'hidden', // Ensure border radius applies
                                    }}>
                                        <TableCell sx={{ flex: 1 }}>{order.orderId}</TableCell>
                                        <TableCell sx={{ flex: 1 }}>{order.fullName}</TableCell>
                                        <TableCell sx={{ flex: 1 }}>{order.address}</TableCell>
                                        <TableCell sx={{ flex: 1 }}>{order.orderDate}</TableCell>
                                        <TableCell sx={{ flex: 1 }}>{order.timeSlot}</TableCell>
                                        <TableCell sx={{ flex: 1 }}>{order.status}</TableCell>
                                        <TableCell sx={{ flex: 1 }}>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                color="Primary"
                                                onClick={() => toggleRow(order.orderId)}
                                            >
                                                {expandedRow === order.orderId ? "Collapse" : "Expand"}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                    {expandedRow === order.orderId && (
                                        <TableRow
                                            sx={{
                                                border: '1px solid black',
                                                borderRadius: '8px',
                                                marginBottom: 2,
                                                overflow: 'hidden',
                                                backgroundColor: '#f9f9f9', // Light background for expanded content
                                            }}>
                                            <TableCell colSpan={7}>
                                                {order.items.map((item, index) => (
                                                    <Box key={index} sx={{ ml: 2, my: 1 }}>
                                                        <Typography variant="body1">
                                                            x{item.quantity} {item.productName}
                                                        </Typography>
                                                    </Box>
                                                ))}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <Typography variant="body1">
                                
                            </Typography>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Dialog for start Date */}
            <Dialog open={StartDateDialog} onClose={handleStartDialogOpen} maxWidth="lg">
                <DialogTitle>Select Start Date</DialogTitle>
                <DialogContent>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: 4,
                            width: "100%",
                        }}
                    >
                        {/* Left Half: Date Selector & Time Selector */}
                        <Box sx={{ flex: 1, p: 4 }}>
                            {/* Date Selector */}
                            <AdminDateSelector selectedDate={startDate} onDateChange={handleStartDateSelect} allowPastDates={true}/>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleStartDialogClose} color="Accent">Cancel</Button>
                    <Button onClick={() => handleStartDialogConfirm(startDate)} color="Accent">Confirm</Button>
                </DialogActions>
            </Dialog>
            {/* Dialog for end Date */}
            <Dialog open={EndDateDialog} onClose={handleEndDialogClose} maxWidth="lg">
                <DialogTitle>Select Start Date</DialogTitle>
                <DialogContent>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            gap: 4,
                            width: "100%",
                        }}
                    >
                        {/* Left Half: Date Selector & Time Selector */}
                        <Box sx={{ flex: 1, p: 4 }}>
                            {/* Date Selector */}
                            <AdminDateSelector selectedDate={endDate} onDateChange={handleEndDateSelect} allowPastDates={true} />
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEndDialogClose} color="Accent">Cancel</Button>
                    <Button onClick={() => handleEndDialogConfirm(endDate)} color="Accent">Confirm</Button>
                </DialogActions>
            </Dialog>

            {/* ToastContainer for showing toasts */}
            <ToastContainer
                position="top-right"  // Position set to top-right
                autoClose={5000}
                hideProgressBar={false}
                closeOnClick
                rtl={false}
            />
        </Box>
    )
};

export default AdminOrders;