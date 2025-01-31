import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid2 as Grid, Button, TextField, Paper, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import http from '../../http';
import * as yup from "yup";
import { useFormik } from "formik";
import DateSelector from "../Reservation/Components/DateSelector";
import { parse, isBefore, isDate } from 'date-fns';
import theme from '../../themes/MyTheme';

const Orders = () => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [points, setPoints] = useState(0);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [pnumber, setPnumber] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: {
            fullname: "",
            email: "",
            address: "",
            pnumber: "",
        },
        validationSchema: yup.object({
            fullname: yup
                .string()
                .trim()
                .max(50, "Full name must be at most 50 characters")
                .required("Full name is required"),
            email: yup
                .string()
                .trim()
                .email("Invalid email address")
                .max(50, "Email must be at most 50 characters")
                .required("Email is required"),
            address: yup
                .string()
                .trim()
                .min(8, "Address must be at least 8 characters")
                .max(100, "Address must be at most 100 characters")
                .required("Address is required"),
            pnumber: yup
                .string()
                .trim()
                .matches(/^\d+$/, "Phone number must contain only digits")
                .min(8, "Phone number must be at least 8 digits")
                .max(8, "Phone number must be at most 15 digits")
                .required("Phone number is required"),
        })
    });

    // get cart item
    const GetCartItems = () => {
        // autofill cartId next time
        http.get(`/ordercart?cartId=${1}`).then((res) => {
            console.log("API Response:", res.data);
            setCartItems(res.data);
            calculateTotal(res.data);
        })
            .catch((error) => {
                console.error("Error fetching cart items:", error);
            })
    };

    useEffect(() => {
        GetCartItems();
    }, []);

    // calculate total
    const calculateTotal = (cartItems) => {
        const totalAmount = cartItems.reduce((sum, item) => {
            const quantity = item.quantity || 1;
            return sum + quantity * item.productPrice;
        }, 0);
        setTotal(totalAmount);
    };

    const calculateTotalPoints = (cartItems) => {
        const totalPoints = cartItems.reduce((sum, item) => {
            const quantity = item.quantity || 1;
            return sum + quantity * item.productPoints;
        }, 0);
        setPoints(totalPoints);
    };

    // create new order & set status as Pending
    const addOrder = () => {
        const orderData = {
            // auto fill id next time
            cartId: 1,
            fullname: fullName,
            email: email,
            address: address,
            totalPoints: 0,
            status: "Pending",
            voucherId: null,
            // autofill session and customer id next time
            customerId: null,
            sessionId: null
        };

        http.post("/order/newOrder", orderData)
            .then((res) => {
                const orderId = res.data.orderId;
                toast.success("Order added!");
                navigate('/checkout', { state: { orderId } });
            })
            .catch((error) => {
                console.error("Error adding order", error);
                toast.error("Error adding order");
            });
    };

    // Mock data for pick up times
    const times = [
        "11:00AM - 11:15AM", "11:15AM - 11:30AM", "11:30AM - 11:45AM", "11:45AM - 12:00PM",
        "12:00PM - 12:15PM", "12:15PM - 12:30PM", "12:30PM - 12:45PM", "12:45PM - 1:00PM",
        "1:00PM - 1:15PM", "1:15PM - 1:30PM", "1:30PM - 1:45PM", "1:45PM - 2:00PM",
        "2:00PM - 2:15PM", "2:15PM - 2:30PM", "2:30PM - 2:45PM", "2:45PM - 3:00PM",
        "3:00PM - 3:15PM", "3:15PM - 3:30PM", "3:30PM - 3:45PM", "3:45PM - 4:00PM",
        "4:00PM - 4:15PM", "4:15PM - 4:30PM", "4:30PM - 4:45PM", "4:45PM - 5:00PM",
        "5:00PM - 5:15PM", "5:15PM - 5:30PM", "5:30PM - 5:45PM", "5:45PM - 6:00PM",
        "6:00PM - 6:15PM", "6:15PM - 6:30PM", "6:30PM - 6:45PM", "6:45PM - 7:00PM",
        "7:00PM - 7:15PM", "7:15PM - 7:30PM", "7:30PM - 7:45PM", "7:45PM - 8:00PM",
        "8:00PM - 8:15PM", "8:15PM - 8:30PM", "8:30PM - 8:45PM", "8:45PM - 9:00PM",
    ];

    // Dialog for Pick up Time
    const isDateTimeBeforeNow = (date, time) => {
        const formattedDate = parse(time, 'h:mma', new Date(date)); // Parse the time into a date object
        return isBefore(formattedDate, new Date()); // Compare it with the current date and time
    };

    const handleDateSelect = (date) => {
        const newDate = new Date(date);
        newDate.setHours(0, 0, 0, 0); // Set the time to noon to avoid timezone discrepancies
        setSelectedDate(date);
        if (selectedTime) {
            if (isDateTimeBeforeNow(date, selectedTime)) {
                setSelectedTime(null)
            }
        }
    };

    const handleTimeSelect = (time) => {
        setSelectedTime(time);
    };

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };

    const handleTimeChange = (event) => {
        setSelectedTime(event.target.value);
    };

    const handleDialogOpen = () => {
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const handleConfirm = () => {
        // Confirm the date and time selection
        console.log("Date Selected:", selectedDate);
        console.log("Time Selected:", selectedTime);
        handleDialogClose();
    };

    return (
        <Box>
            <Box sx={{ padding: 4 }}>
                <Grid container spacing={2}>
                    {/* Customer Details */}
                    <Grid size={{ xs: 12, md: 6, lg: 8 }} container spacing={2}>
                        <Paper elevation={3} sx={{ padding: 4 }}>
                            <Typography variant="h6" gutterBottom>
                                Customer Information
                            </Typography>
                            <TextField
                                fullWidth
                                label="Full Name"
                                name="fullname"
                                value={formik.values.fullname}
                                onChange={(e) => {
                                    formik.handleChange(e);
                                    setFullName(e.target.value);
                                }}
                                onBlur={formik.handleBlur}
                                error={formik.touched.fullname && Boolean(formik.errors.fullname)}
                                helperText={formik.touched.fullname && formik.errors.fullname}
                                margin="dense"
                                color="c4c4c4"
                                slotProps={{
                                    input: {
                                        sx: {
                                            borderRadius: "8px",
                                            "&:hover fieldset": { borderColor: "#FF69B4" }, // Hover effect
                                            "&.Mui-focused fieldset": { borderColor: "#B0B0B0" }, // Focus effect
                                        },
                                    },
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                name="email"
                                value={formik.values.email}
                                onChange={(e) => {
                                    formik.handleChange(e);
                                    setEmail(e.target.value);
                                }}
                                onBlur={formik.handleBlur}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                                margin="dense"
                                color="c4c4c4"
                                slotProps={{
                                    input: {
                                        sx: {
                                            borderRadius: "8px",
                                            "&:hover fieldset": { borderColor: "#FF69B4" }, // Hover effect
                                            "&.Mui-focused fieldset": { borderColor: "#B0B0B0" }, // Focus effect
                                        },
                                    },
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Phone Number"
                                name="pnumber"
                                value={formik.values.pnumber}
                                onChange={(e) => {
                                    formik.handleChange(e);
                                    setPnumber(e.target.value);
                                }}
                                onBlur={formik.handleBlur}
                                error={formik.touched.pnumber && Boolean(formik.errors.pnumber)}
                                helperText={formik.touched.pnumber && formik.errors.pnumber}
                                margin="dense"
                                color="c4c4c4"
                                slotProps={{
                                    input: {
                                        sx: {
                                            borderRadius: "8px",
                                            "&:hover fieldset": { borderColor: "#FF69B4" }, // Hover effect
                                            "&.Mui-focused fieldset": { borderColor: "#B0B0B0" }, // Focus effect
                                        },
                                    },
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Address"
                                name="address"
                                value={formik.values.address}
                                onChange={(e) => {
                                    formik.handleChange(e);
                                    setAddress(e.target.value);
                                }}
                                onBlur={formik.handleBlur}
                                error={formik.touched.address && Boolean(formik.errors.address)}
                                helperText={formik.touched.address && formik.errors.address}
                                margin="dense"
                                color="c4c4c4"
                                slotProps={{
                                    input: {
                                        sx: {
                                            borderRadius: "8px",
                                            "&:hover fieldset": { borderColor: "#FF69B4" }, // Hover effect
                                            "&.Mui-focused fieldset": { borderColor: "#B0B0B0" }, // Focus effect
                                        },
                                    },
                                }}
                            />
                            <Typography variant="h6" gutterBottom>
                                Pick-Up Timing
                            </Typography>
                            {/* Display selected date and time */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                {/* Only show the selected date and time if they exist */}
                                {selectedDate && selectedTime ? (
                                    <>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#292827' }}>
                                            Pick-Up Timing
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: '#292827' }}>
                                            {`${new Date(selectedDate).toLocaleDateString('en-GB', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                timeZone: 'UTC',
                                            })} at ${selectedTime}`}
                                        </Typography>
                                    </>
                                ) : (
                                    <>
                                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#292827' }}>
                                            Pick-Up Timing
                                        </Typography>
                                        <Typography variant="body1" sx={{ color: '#585858' }}>
                                            No date and timing selected
                                        </Typography>
                                    </>
                                )}

                                <Button
                                    variant="contained"
                                    color="Accent"
                                    onClick={handleDialogOpen}
                                >
                                    Select Pick-Up Time
                                </Button>
                            </Box>
                            {/* TODO: Pick up Timing for the day */}
                            <Typography variant="h6" gutterBottom>
                                Carbon Tracker
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    Total Eco Points Earned
                                </Typography>


                                <Typography variant="subtitle1">
                                    {points} Points
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Order Summary */}
                    {/*
                    <Grid size={{ xs: 12, md: 6, lg: 4 }}>
                        <Paper elevation={3} sx={{ padding: 4 }}>
                            <Typography variant="h5" gutterBottom>
                                Checkout-Summary
                            </Typography>
                            {
                                cartItems.map((product, i) => {
                                    return (
                                        <Typography variant="body1" sx={{ marginBottom: 2 }} key={product.productId || i}>
                                            {product.productName} x{product.quantity} : ${product.productPrice?.toFixed(2)}
                                        </Typography>
                                    );
                                })
                            }
                            <Typography variant="body1" sx={{ marginBottom: 2 }}>
                                Total: ${total?.toFixed(2)}
                            </Typography>
                            <Button
                                variant="contained"
                                color="Accent"
                                fullWidth
                                sx={{ marginTop: 2 }}
                                onClick={addOrder}
                            >
                                Pay Online
                            </Button>
                        </Paper>
                    </Grid>
                    */}
                </Grid>
            </Box>

            {/* Dialog for Date and Time Selection */}
            <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="lg">
                <DialogTitle>Select Pick-Up Date & Time</DialogTitle>
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
                            <DateSelector selectedDate={selectedDate} onDateChange={handleDateSelect} />

                            {/* Time Selector */}
                            <Box
                                sx={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: 1,
                                    justifyContent: "center",
                                    mt: 3,
                                    mb: 3,
                                }}
                            >
                                {times.map((time) => {
                                    const isPast = isDateTimeBeforeNow(selectedDate, time); // Add your isDateTimeBeforeNow logic
                                    return (
                                        <Button
                                            key={time}
                                            variant="contained"
                                            color={selectedTime === time ? "Accent" : "default"}
                                            onClick={() => !isPast && handleTimeSelect(time)} // Only handle click if time is not in the past
                                            sx={{
                                                backgroundColor: selectedTime === time ? "primary.main" : "transparent",
                                                width: "500px",
                                                opacity: isPast ? 0.5 : 1, // Grey out past times
                                                cursor: isPast ? "not-allowed" : "pointer",
                                                pointerEvents: isPast ? "none" : "auto", // Disable click for past times
                                                "&:hover": {
                                                    backgroundColor: selectedTime === time ? "none" : "#E7ABC5",
                                                },
                                            }}
                                        >
                                            {time}
                                        </Button>
                                    );
                                })}
                            </Box>
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="Accent">Cancel</Button>
                    <Button onClick={handleDialogClose} color="Accent">Confirm</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );

};

export default Orders;