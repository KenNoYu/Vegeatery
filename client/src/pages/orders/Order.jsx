import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid2 as Grid, Button, TextField, Paper } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import http from '../../http';

const Orders = () => {
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [address, setAddress] = useState('');
    const [pnumber, setPnumber] = useState('');
    const navigate = useNavigate();

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
                                variant="outlined"
                                margin="normal"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                variant="outlined"
                                margin="normal"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                label="Phone Number"
                                variant="outlined"
                                margin="normal"
                                value={pnumber}
                                onChange={(e) => setPnumber(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                label="Address"
                                variant="outlined"
                                margin="normal"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
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