import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid2 as Grid, Button, TextField, Paper } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import http from '../../http';
import * as yup from "yup";
import { useFormik } from "formik";

const Orders = () => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [pnumber, setPnumber] = useState('');
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
                                            borderRadius: "2px",
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
                            <Typography variant="h6" gutterBottom>
                                Carbon Tracker
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* Order Summary */}
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
                                color="primary"
                                fullWidth
                                sx={{ marginTop: 2 }}
                                onClick={addOrder}
                            >
                                Pay Online
                            </Button>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );

};

export default Orders;