import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid2 as Grid, Card, CardContent, Button, TextField, CircularProgress } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import http from '../../http';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);

    // Fetch the cart items
    const GetCartItems = () => {
        // autofill cartId next time
        http.get(`/ordercart?cartId=${1}`).then((res) => {
            console.log("API Response:", res.data);
            setCartItems(res.data);
            calculateTotal(res.data);
            setLoading(false);
        })
            .catch((error) => {
                console.error("Error fetching cart items:", error);
                setLoading(false);
            })
    };

    useEffect(() => {
        GetCartItems();
    }, []);

    // Update cart item
    const UpdateCartItems = (cartId, productId, quantity) => {
        const cartData = {
            // auto fill id next time
            cartId: cartId,
            productId: productId,
            quantity: quantity,
        };

        http.put("/ordercart", cartData)
            .then((res) => {
                console.log("Updated Cart");
                // Refresh cart data
                GetCartItems();
                // Recalculate the total after updating
                calculateTotal(
                    cartItems.map((item) =>
                        item.productId === productId ? { ...item, quantity: quantity } : item
                    )
                );
                toast.success("Product Updated!");
            })
            .catch((error) => {
                console.error("Error Updating product", error);
                toast.error("Failed to update product.");
            });
    };

    // Calculate the total price for the cart
    const calculateTotal = (cartItems) => {
        const totalAmount = cartItems.reduce((sum, item) => {
            const quantity = item.quantity || 1;
            return sum + quantity * item.productPrice;
        }, 0);
        setTotal(totalAmount);
    };

    // Remove item from cart
    const RemoveCartItem = (productId) => {
        http.delete(`/ordercart?CartId=${1}&ProductId=${productId}`).then((res) => {
            console.log("product deleted from cart");
            // Refresh cart data
            GetCartItems();
            // Recalculate the total after updating
            calculateTotal(
                cartItems.map((item) =>
                    item.productId === productId ? { ...item, quantity: quantity } : item
                )
            );
            toast.success(`Product deleted from cart!`);
        })
            .catch((error) => {
                console.error("Error deleting product from cart:", error);
                toast.error("Failed to delete product from cart.");
            })
    };

    const navigate = useNavigate();

    const handleCheckout = () => {
        // Redirect to the /orders page
        navigate("/orders");
    };

    if (loading) {
        return (
            <Box>
                <Typography variant="h5" sx={{ my: 2 }}>
                    Your Cart
                </Typography>
                <Grid container spacing={2}><CircularProgress />;</Grid>
            </Box>
        )
    }

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Your Cart
            </Typography>

            <Grid container spacing={2}>
                {cartItems.length > 0 ? (
                    cartItems.map((product, i) => {
                        return (
                            <Grid item xs={12} md={6} lg={4} key={product.productId || i}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6">
                                            {product.productName}
                                        </Typography>
                                        <Typography color="text.secondary">
                                            Price: ${product.productPrice?.toFixed(2)}
                                        </Typography>
                                        <Box sx={{ my: 1 }}>
                                            <TextField
                                                label="Quantity"
                                                type="number"
                                                size="small"
                                                value={product.quantity}
                                                onChange={(e) =>
                                                    UpdateCartItems(1, product.productId, Number(e.target.value))
                                                }
                                            />
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                                            <Button
                                                color="error"
                                                onClick={() => RemoveCartItem(product.productId)}
                                            >
                                                Remove
                                            </Button>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        )
                    })
                ) : (
                    <Grid item xs={12}>
                        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
                            Your cart is empty.
                        </Typography>
                    </Grid>
                )}
            </Grid>

            {cartItems.length > 0 && (
                <Box sx={{ mt: 3, textAlign: 'right' }}>
                    <Typography variant="h6">
                        Total: ${total?.toFixed(2)}
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCheckout}
                    >
                        Checkout
                    </Button>
                </Box>
            )}
        </Box>
    );
};

export default Cart;