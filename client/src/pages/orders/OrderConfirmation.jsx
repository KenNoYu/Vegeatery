import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import http from '../../http';
import { Box, Typography, CircularProgress, Divider } from '@mui/material';
import RoleGuard from '../../utils/RoleGuard';
import emailjs from "@emailjs/browser";

const OrderConfirmation = () => {
    RoleGuard(["User", "Admin", "Staff"]);
    const [order, setOrder] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const orderId = searchParams.get('orderId');

    useEffect(() => {
        if (orderId) {
            getOrderByID(orderId);
        }
    }, [orderId]);

    // get user info
    useEffect(() => {
        http
            .get("/auth/current-user", { withCredentials: true }) // withCredentials ensures cookies are sent
            .then((res) => {
                console.log(res);
                setUser(res);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch user data", err);
                setLoading(false);
            });
    }, []);

    const updateStock = async (productId, quantity) => {
        console.log(`Making request to update stock for Product ID: ${productId} with Quantity: ${quantity}`);

        try {
            // Await the response of the PUT request
            const response = await http.put(`/Order/updateStock/${productId}`, quantity, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            // Log the response for debugging
            console.log('API Response:', response);

            // Check if the response is successful (status 200)
            if (response.status === 200) {
                console.log('Stock updated:', response.data);
                updateTotalBought(productId, quantity)
            } else {
                console.log('Error updating stock:', response.data);
            }
        } catch (error) {
            // Log detailed error info
            if (error.response) {
                // Server responded with an error (e.g., 400 or 500)
                console.error('API Error Response:', error.response);
            } else if (error.request) {
                // Request was made but no response received
                console.error('No response received:', error.request);
            } else {
                // Some other error occurred during setup
                console.error('Error Message:', error.message);
            }
        }
    };

    useEffect(() => {
        if (order) {
            order.orderItems.forEach(item => {
                if (item.productId) {
                    console.log(`Updating stock for Product ID: ${item.productId} with Quantity: ${item.quantity}`);
                    updateStock(item.productId, item.quantity); // Update stock for each product in the order
                } else {
                    console.error('Missing productId for item:', item); // Log if productId is missing
                }
            });
            UpdateOrderAsNew(order.orderId);       
            sendEmail();
            updateUserPoints();
        }
    }, [order]);

    useEffect(() => {
        if (Array.isArray(cartItems)){
            cartItems.forEach((item) => {
                deleteCartItems(user.data.cartId, item.productId);
            });
        }
    }, [cartItems]);

    // Update order status
    const UpdateOrderAsNew = (orderId) => {
        const updateData = {
            orderId: orderId,
            status: "New"
        }
        http.put("/order/UpdateStatus", updateData)
            .then((res) => {
            })
            .catch((error) => {
                console.error("Error fetching orders:", error);
            })
    }

    // update totalBought
    const updateTotalBought = (productId, quantity) => {
        const updateData = {
            productId: productId,
            quantity: quantity,
        }

        http.put("/product/updateTotalBought", updateData)
        .then((res) => {
            console.log(res);
        })
        .catch((error) => {
            console.error("Error fetching orders:", error);
        })
    }

    // Delete items in cart
    const deleteCartItems = (cartId, productId) => {
        http.delete(`/ordercart?CartId=${cartId}&ProductId=${productId}`)
            .then((res) => {
            })
            .catch((error) => {
                console.error("Error fetching orders:", error);
            })
    }

    const GetCartItems = () => {
        // autofill cartId next time
        http.get(`/ordercart?cartId=${user.data.cartId}`).then((res) => {
            setCartItems(res.data);
        })
            .catch((error) => {
                console.error("Error fetching cart items:", error);
            })
    };

    useEffect(() => {
        if (user?.data.cartId) {
            GetCartItems();
        }
    }, [user]);

    const sendEmail = async () => {
        const emailParams = {
            customer_name: order.fullName, // Customer's full name
            customer_email: order.email, // Customer's email
            order_confirmation: order.orderId, // Order ID
            order_date: new Intl.DateTimeFormat('en-CA', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }).format(new Date(order.orderDate)), // Formatted order date
            time_slot: order.timeSlot, // Time slot for the order
            order_items: order.orderItems.map(item => ({
                product_name: item.productName,
                quantity: item.quantity,
                price: item.price.toFixed(2)
            })), // Array of ordered items
            voucher_applied: order.voucherId != null, // Boolean to check if a voucher was used
            discount_amount: order.voucherId ? calculateDiscount().toFixed(2) : "0.00", // Discount amount
            discount_percent: order.voucherId ? (order.discountPercent * 100) : "0", // Discount percentage
            total_price: order.totalPrice.toFixed(2), // Total price,
            total_points: order.totalPoints
        };

        emailjs.send(
            "service_plo7m72",
            "template_nhrcr3o",
            emailParams,
            "NpgWlwY1lL3fFaX_P"
        ).then(() => {
            console.log("Email sent successfully!");
            setLoading(false);
        }).catch((error) => {
            console.error("Error sending email:", error);
            setLoading(false);
        });
    };

    const updateUserPoints = async () => {
        const userPoints = {
            points: order.totalPoints
        }
        console.log("Total points", order.totalPoints)

        http.put(`/Account/${user.data.id}/points`, userPoints)
            .then((res) => {
                console.log("Update API Response:", res.data);
                http.put(`/order/updatePoints/${user.data.id}`)
                .then((res) => {
                    console.log("Points updated based on order count:", res.data);
                })
                .catch((error) => {
                    console.error("Error updating points based on order count:", error);
                });
        })
        .catch((error) => {
            console.error("Error fetching orders:", error);
        })
}

    const getOrderByID = async (orderId) => {
        http.get(`/order/orderId?orderId=${orderId}`)
            .then((res) => {
                setOrder(res.data);
                console.log("Get API Response:", res.data);
            })
            .catch((error) => {
                console.error("Error fetching orders:", error);
            })
    };

    const calculateDiscount = () => {
        return ((order.totalPrice / (1 - order.discountPercent)) - order.totalPrice);
    }

    if (loading) {
        return <CircularProgress />;
    }

    if (!order) {
        return <Typography variant="h6">Order not found</Typography>;
    }

    return (
        <Box
            sx={{
                maxWidth: 500,
                margin: "auto",
                backgroundColor: "#F9F9F9",
                borderRadius: 2,
                padding: 4,
                boxShadow: 1,
                textAlign: "center",
                mt: 10
            }}
        >
            {/* Title */}
            <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
                Order Confirmation
            </Typography>
            <Typography variant="body1" sx={{ mb: 2, color: "#555" }}>
                Your order has been confirmed. A receipt has been sent to your email.
            </Typography>

            {/* Order Details */}
            <Box
                sx={{
                    backgroundColor: "#FFF",
                    borderRadius: 1,
                    padding: 2,
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                    textAlign: "left",
                }}
            >
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
                    ORDER NUMBER {order.orderId}
                </Typography>

                {/* Order Items */}
                {order.orderItems.map((item, index) => (
                    <Box
                        key={item.productId || index}
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            mb: 1,
                        }}
                    >
                        <Typography variant="body1" sx={{ color: "#333" }}>
                            • {item.productName}
                        </Typography>
                        <Typography variant="body1" sx={{ color: "#555" }}>
                            x{item.quantity} SGD {item.price.toFixed(2)}
                        </Typography>
                    </Box>
                ))}

                {/* Divider */}
                <Divider sx={{ my: 2 }} />

                {/* Summary */}
                {order.voucherId != null ? (
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography variant="body2" sx={{ color: "#555" }}>
                            Voucher Applied
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#555" }}>
                            SGD {calculateDiscount().toFixed(2)} ({order.discountPercent * 100}%)
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                        <Typography variant="body2" sx={{ color: "#555" }}>
                            Voucher Applied
                        </Typography>
                        <Typography variant="body2" sx={{ color: "#555" }}>
                            None
                        </Typography>
                    </Box>
                )}

                {/* Total */}
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        Total
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#E91E63" }}>
                        SGD {order.totalPrice.toFixed(2)}
                    </Typography>
                </Box>
            </Box>

            {/* Action Button */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="body1" sx={{ color: "#555", mb: 2 }}>
                    See you Soon!
                </Typography>
            </Box>
        </Box>
    );
};

export default OrderConfirmation;