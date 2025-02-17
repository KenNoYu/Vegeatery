import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid2 as Grid, Button, CircularProgress, Drawer, IconButton, List, ListItem, ListItemText, Divider, TextField } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import http from '../../http';
import RoleGuard from '../../utils/RoleGuard';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Cart = () => {
    RoleGuard('User');
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [totalPoints, setPoints] = useState(0);
    const [user, setUser] = useState(null);
    const [cartOpen, setCartOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const toggleCart = (open) => () => {
        setCartOpen(open);
    };

    // get user info
    useEffect(() => {
        http
            .get("/auth/current-user", { withCredentials: true }) // withCredentials ensures cookies are sent
            .then((res) => {
                setUser(res);
            })
            .catch((err) => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (cartOpen && user?.data.cartId) {
            setLoading(true); // Set loading to true when opening the cart
            GetCartItems();
        }
    }, [cartOpen, user]);

    // Fetch the cart items
    const GetCartItems = () => {
        // autofill cartId next time
        http.get(`/ordercart?cartId=${user.data.cartId}`).then((res) => {
            console.log("API Response:", res.data);
            setCartItems(res.data);
            calculateTotal(res.data);
            calculateTotalPoints(res.data);
            setLoading(false);
        })
            .catch((error) => {
                console.error("Error fetching cart items:", error);
                setLoading(false);
            })
    };

    // Update cart item
    const UpdateCartItems = (cartId, productId, quantity) => {
        setIsUpdating(true); // disables ui
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
                toast.success("Product Updated!");
            })
            .catch((error) => {
                console.error("Error Updating product", error);
                toast.error("Failed to update product.");
            })
            .finally(() => {
                setIsUpdating(false); // Re-enable UI
            });
    };

    // Calculate the total price for the cart
    const calculateTotal = (cartItems) => {
        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            setTotal(0);
            return 0;
        } else {
            const totalAmount = cartItems.reduce((sum, item) => {
                const quantity = item.quantity || 1;
                return sum + quantity * item.productPrice;
            }, 0);
            setTotal(totalAmount);
        }
    };

    const calculateTotalPoints = (cartItems) => {
        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            setPoints(0);
            return 0;
        } else {
            const totalPoints = cartItems.reduce((sum, item) => {
                const quantity = item.quantity || 1;
                return sum + (quantity * item.points);
            }, 0);
            setPoints(totalPoints);
        }
    };

    // Remove item from cart
    const RemoveCartItem = (productId) => {
        setIsUpdating(true); // Disable UI
        http.delete(`/ordercart?CartId=${user.data.cartId}&ProductId=${productId}`)
            .then((res) => {
                console.log("product deleted from cart");
                // Refresh cart data
                GetCartItems();
                toast.success(`Product deleted from cart!`);
            })
            .catch((error) => {
                console.error("Error deleting product from cart:", error);
                toast.error("Failed to delete product from cart.");
            })
            .finally(() => {
                setIsUpdating(false); // Re-enable UI
            });
    };

    const navigate = useNavigate();

    const handleCheckout = () => {
        console.log("Cart Items:", cartItems); // Debug
        if (!Array.isArray(cartItems) || cartItems.length === 0) {
            toast.error("Your cart is empty. Please add items before checking out.");
            return;
        }
        setCartOpen(false);
        navigate("/orders");
    };


    if (loading) {
        return (
            <>
                <IconButton onClick={() => setCartOpen(!cartOpen)} color="inherit">
                    <ShoppingCartIcon />
                </IconButton>

                <Drawer anchor="right" open={cartOpen} onClose={toggleCart(false)} ModalProps={{ keepMounted: true, }}>
                    <Box
                        sx={{
                            width: 350, // Set to a smaller width
                            padding: 2,
                            height: '50%', // Keep full height
                            overflow: 'auto', // Allow scrolling
                        }}
                        role="presentation"
                    >
                        <Typography variant="h6" sx={{ marginBottom: 2 }}>
                            PICK-UP
                        </Typography>
                        <Divider />
                        <List>
                            <ListItem>
                                <CircularProgress color="Primary" />
                            </ListItem>
                        </List>
                        <Divider sx={{ marginY: 2 }} />
                        <Box display="flex" justifyContent="space-between" marginBottom={2}>
                            <Typography variant="body1">Total Price:</Typography>
                            <Typography variant="body1">${total.toFixed(2)}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" marginBottom={2}>
                            <Typography variant="body1">Points:</Typography>
                            <Typography variant="body1">{total}</Typography>
                        </Box>
                        <Button variant="contained" color="Accent" fullWidth onClick={handleCheckout} >
                            Checkout
                        </Button>
                    </Box>
                </Drawer>
            </>
        )
    }


    return (
        <>
            <IconButton onClick={() => setCartOpen(!cartOpen)} color="inherit">
                <ShoppingCartIcon />
            </IconButton>

            <Drawer anchor="right" open={cartOpen} onClose={toggleCart(false)} ModalProps={{ keepMounted: true, disableEnforceFocus: true }}>
                {ToastContainer}
                <Box
                    sx={{
                        width: 350, // Set to a smaller width
                        padding: 2,
                        height: '50%', // Keep full height
                        overflow: 'auto', // Allow scrolling
                    }}
                    role="presentation"

                >
                    <Typography variant="h6" sx={{ marginBottom: 2, backgroundColor: "Accent" }} align='center'>
                        Your Cart | PICK-UP
                    </Typography>
                    <Divider />
                    <List>
                        {cartItems.length > 0 ? (
                            cartItems.map((product, index) => (
                                <ListItem key={product.productId} sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    paddingY: 1,
                                }}>
                                    <Box>
                                        <Typography variant="body1">{product.productName}</Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Price: ${product.productPrice.toFixed(2)} | Points: {product.points}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        <IconButton
                                            onClick={() => UpdateCartItems(user.data.cartId, product.productId, product.quantity - 1)}
                                            color="Accent"
                                            size="small"
                                            disabled={product.quantity === 1 || isUpdating}
                                        >
                                            <RemoveIcon />
                                        </IconButton>
                                        <TextField
                                            value={product.quantity}
                                            size="small"
                                            inputProps={{ readOnly: true, style: { textAlign: 'center', width: 40 } }}
                                            variant="outlined"
                                        />
                                        <IconButton
                                            onClick={() => UpdateCartItems(user.data.cartId, product.productId, product.quantity + 1)}
                                            color="Accent"
                                            size="small"
                                            disabled={product.quantity === 10 || isUpdating}
                                        >
                                            <AddIcon />
                                        </IconButton>
                                        <IconButton
                                            onClick={() => RemoveCartItem(product.productId)}
                                            color="error"
                                            size="small"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                </ListItem>
                            ))
                        ) : (
                            <ListItem>
                                <ListItemText>You Have No Products in Cart</ListItemText>
                            </ListItem>
                        )}
                    </List>
                    <Divider sx={{ marginY: 2 }} />
                    <Box display="flex" justifyContent="space-between" marginBottom={2}>
                        <Typography variant="body1">Total Price:</Typography>
                        <Typography variant="body1">${total.toFixed(2)}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" marginBottom={2}>
                        <Typography variant="body1">Points:</Typography>
                        <Typography variant="body1">{total}</Typography>
                    </Box>
                    <Button variant="contained" color="Accent" fullWidth onClick={handleCheckout} disabled={cartItems.length === 0 || isUpdating}>
                        Checkout
                    </Button>
                    {ToastContainer}
                </Box>
            </Drawer>
            <ToastContainer position="top-center" autoClose={3000} />
        </>
    );
};

export default Cart;