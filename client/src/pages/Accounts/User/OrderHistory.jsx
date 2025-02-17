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
import NoOrders from "../../../assets/NoOrders.png"
import { useNavigate } from 'react-router-dom';

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
    const navigate = useNavigate();

    const StoreNav = () => {
        navigate("/user/store");
    };
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
        <Box sx={{ display: "flex", height: "100%", marginTop: "2em" }}>
            {/* Sidebar */}
            <Sidebar />
            {/* Main Content */}
            <Box sx={{
                height: "100vh",
                marginLeft: "240px",
                flex: 1,
                marginTop: "0.5em",
                padding: "2em",
                backgroundColor: "#ffffff",
                borderTopRightRadius: "1em",
                borderBottomRightRadius: "1em",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                flexDirection: "column",
                overflow: "auto"
            }}>
                {/* Order History */}
                <Typography variant="h3" sx={{ my: 2, fontWeight: 'bold' }}>
                    Order History
                </Typography>
                <Grid container spacing={4} justifyContent="center">
                    {orders.length > 0 ? (
                        orders.map((order) => {
                            // Format the order date
                            const orderDate = new Date(order.orderDate).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                            });

                            // Calculate total points earned from all items
                            const totalPoints = order.orderItems.reduce((sum, item) => sum + item.pointsEarned, 0);

                            return (
                                <Grid item xs={12} key={order.orderId}>
                                    <Card
                                        sx={{
                                            p: 3,
                                            borderRadius: "16px",
                                            boxShadow: 4,
                                            width: { xs: "95vw", sm: "90vw", md: "85vw", lg: "80vw" },
                                            margin: "0 auto",
                                        }}
                                    >
                                        {/* Order Header */}
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                mb: 3,
                                                p: 2,
                                                borderRadius: "8px",
                                            }}
                                        >
                                            <Typography variant="h5" fontWeight="bold">
                                                Order ID: #{order.orderId}
                                            </Typography>
                                            <Typography variant="body1" color="textSecondary">
                                                Collection Date: {orderDate}
                                            </Typography>
                                        </Box>

                                        {/* Order Items */}
                                        {order.orderItems.map((item, i) => (
                                            <Box
                                                key={item.productId || i}
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 3,
                                                    mb: 3,
                                                    borderBottom: "1px solid #e0e0e0",
                                                    pb: 2,
                                                }}
                                            >
                                                <img
                                                    src={`${import.meta.env.VITE_FILE_BASE_URL}${item.imageFile}`}
                                                    alt={item.productName}
                                                    style={{
                                                        width: "120px",
                                                        height: "120px",
                                                        objectFit: "cover",
                                                        borderRadius: "8px",
                                                    }}
                                                />
                                                <Box>
                                                    <Typography variant="h6" fontWeight="bold">
                                                        {item.productName}
                                                    </Typography>
                                                    <Typography variant="body1" color="textSecondary">
                                                        Quantity: {item.quantity}
                                                    </Typography>
                                                </Box>
                                                <Typography
                                                    variant="h6"
                                                    fontWeight="bold"
                                                    sx={{ marginLeft: "auto" }}
                                                >
                                                    ${item.price.toFixed(2)}
                                                </Typography>
                                            </Box>
                                        ))}

                                        {/* Total Price & Points */}
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection:"column",
                                                alignItems: "end",
                                                mt: 2,
                                                mb: 2,
                                                p: 2,
                                                borderRadius: "8px",
                                            }}
                                        >
                                            <Typography variant="h6 " fontWeight="bold">
                                                Total: ${order.totalPrice.toFixed(2)}
                                            </Typography>
                                            <Typography variant="h6" fontWeight="bold">
                                                Points Earned: {order.totalPoints}
                                            </Typography>
                                            <Typography variant="h6" fontWeight="bold">
                                                Status: {order.status}
                                            </Typography>
                                        </Box>

                                        {/* Action Buttons */}
                                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                                            <Button variant="contained" color="Accent" size="large">
                                                Review
                                            </Button>
                                            <Button variant="contained" color="Accent" size="large">
                                                Buy Again
                                            </Button>
                                        </Box>
                                    </Card>
                                </Grid>
                            );
                        })
                    ) : (
                        <Box sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "100%",
                            textAlign: "center",
                            mt: 4
                        }}>
                            {/* Illustration */}
                            <img
                                src={NoOrders}
                                alt="No orders"
                                style={{ width: "200px", height: "auto", marginBottom: "1em" }}
                            />
                            {/* Message */}
                            <Typography variant="h5" sx={{ mb: 2, color: "text.secondary" }}>
                                No Past Orders
                            </Typography>
                            <Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
                                Oops! It looks like you haven't placed any orders yet. Start exploring our products!
                            </Typography>
                            {/* Call-to-Action Button */}
                            <Button
                                variant="contained"
                                color="Accent"
                                sx={{ borderRadius: "8px", textTransform: "none", fontSize: "1rem" }}
                                onClick={StoreNav}
                            >
                                Explore Products
                            </Button>
                        </Box>
                    )}
                </Grid>
            </Box>
        </Box>
    );
}

export default MyOrdersPage;