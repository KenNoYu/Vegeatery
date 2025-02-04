import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import http from '../../http';
import { Box, Typography, CircularProgress, Divider } from '@mui/material';
import RoleGuard from '../../utils/RoleGuard';

const OrderConfirmation = () => {
    RoleGuard('User');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const orderId = searchParams.get('orderId');
    console.log("ID", orderId)

    useEffect(() => {
        if (orderId) {
            getOrderByID(orderId);

        }
    }, [orderId]);

    // Update order status
    const UpdateOrderAsNew = (orderId) => {
        const updateData = {
            orderId: orderId,
            status: "New"
        }
        http.put("/order/UpdateStatus", updateData)
            .then((res) => {
                console.log("Update API Response:", res.data);
            })
            .catch((error) => {
                console.error("Error fetching orders:", error);
            })
    }

    const getOrderByID = async (orderId) => {
        http.get(`/order/orderId?orderId=${orderId}`)
            .then((res) => {
                UpdateOrderAsNew(orderId)
                console.log("Get API Response:", res.data);
                setOrder(res.data);
                setLoading(false);
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