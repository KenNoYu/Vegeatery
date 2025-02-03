import React, { useEffect, useState } from 'react';
import http from '../../http';
import { Box, Typography, CircularProgress, Tabs, Tab, Button, Grid2 as Grid } from '@mui/material';
import dayjs from 'dayjs';
import DateSelector from "../Reservation/Components/DateSelector";

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

    // Dialog for Pick up Time
    const isDateTimeBeforeNow = (date, time) => {
        const formattedDate = parse(time, 'h:mma', new Date(date)); // Parse the time into a date object
        return isBefore(formattedDate, new Date()); // Compare it with the current date and time
    };

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

    const handleEndDialogOpen = () => {
        setEndDateDialog(true);
    };

    const handleEndDialogClose = () => {
        setEndDateDialog(false);
    };

    // handle row expanded
    const toggleRow = (id) => {
        setExpandedRow(expandedRow === id ? null : id);
    };

    // handle export to csv
    const exportToCSV = () => {
        try {
          // Check if there are any orders to export
          if (!orders || orders.length === 0) {
            alert("No orders available to export.");
            return;
          }
      
          // Construct CSV headers
          const headers = [
            "Id,Name,Service,Address,Pick-Up Time,Status,Products",
          ];
      
          // Generate CSV rows
          const rows = orders.map((order) => {
            try {
              const products = order.items
                .map((item) => {
                  // Check for missing or undefined fields
                  const itemName = item.productName || "Unknown Item";
                  const quantity = item.quantity || 0;
                  const price = item.price != null ? `$${detail.price.toFixed(2)}` : "$0.00";
      
                  return `${itemName} x${quantity} @ ${price}`;
                })
                .join(" | ");
      
              return `"${order.id || "Unknown ID"}","${order.name || "Unknown Name"}","${order.service || "Unknown Service"}","${order.address || "Unknown Address"}","${order.pickUpTime || "Unknown Time"}","${order.status || "Unknown Status"}","${products}"`;
            } catch (error) {
              console.error("Error processing order details:", order, error);
              return `"Error processing order details"`;
            }
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
          alert("An error occurred while exporting the CSV. Please try again.");
        }
      };

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

                <Box sx={{ display: "flex", justifyContent: 'space-between', gap: 2, mb: 2 }}>
                    <Button
                        variant="outlined"
                        color="secondary"
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
                        color="secondary"
                        onClick={handleEndDialogOpen}
                    >
                        {`${new Date(endDate).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                        })}`}
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
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

            <Box sx={{ display: "flex", justifyContent: 'space-between', gap: 2, mb: 2 }}>
                <Button
                    variant="outlined"
                    color="secondary"
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
                    color="secondary"
                    onClick={handleEndDialogOpen}
                >
                    {`${new Date(endDate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                    })}`}
                </Button>
                <Button
                    variant="outlined"
                    color="secondary"
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
                        {/* TODO: This thing here
                        {orders.map((order) => (
                            <React.Fragment key={order.id}>
                            <TableRow>
                                <TableCell>{order.id}</TableCell>
                                <TableCell>{order.name}</TableCell>
                                <TableCell>{order.address}</TableCell>
                                <TableCell>{order.pickUpTime}</TableCell>
                                <TableCell>{order.status}</TableCell>
                                <TableCell>
                                    <Button 
                                    variant="outlined" 
                                    size="small"
                                    onClick={() => toggleRow(order.id)}
                                    >
                                        {expandedRow === order.id ? "Collapse" : "Expand"}
                                    </Button>
                                </TableCell>
                            </TableRow>
                            {expandedRow === order.id && (
                            <TableRow>
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
                        ))}*/}
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
                            <DateSelector selectedDate={startDate} onDateChange={handleStartDateSelect} />
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleStartDialogClose} color="Accent">Cancel</Button>
                    <Button onClick={handleStartDialogClose} color="Accent">Confirm</Button>
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
                            <DateSelector selectedDate={endDate} onDateChange={handleEndDateSelect} />
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEndDialogClose} color="Accent">Cancel</Button>
                    <Button onClick={handleEndDialogClose} color="Accent">Confirm</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
};

export default AdminOrders;