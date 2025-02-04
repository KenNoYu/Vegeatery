import React, { useEffect } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';
import http from '../../http';
import { loadStripe } from '@stripe/stripe-js';
import RoleGuard from '../../utils/RoleGuard';

const stripePromise = loadStripe('pk_test_51QZWKZG2Vyjd8Bevj32U8i0SRUVWPuchLByOvA0G4locEVUpq6qNrF4jJnHmspyAtKQBC0VFjxtsRS8XppJxDFTc00B0A9uox3'); 

const Checkout = () => {
    RoleGuard('User');
    const navigate = useNavigate();
    const location = useLocation();
    const orderId = location.state?.orderId;

    // Create Stripe Checkout session
    const createCheckoutSession = async (orderId) => {
        const stripe = await stripePromise;

        http.post(`/checkout/checkout?orderId=${orderId}`)
            .then(async (res) => {
                console.log("Stripe Checkout Session created:", res.data);
                const result = await stripe.redirectToCheckout({
                    sessionId: res.data.sessionId,
                });

                if (result.error) {
                    console.error("Stripe Checkout error:", result.error.message);
                    toast.error(result.error.message);
                }
            })
            .catch((error) => {
                console.error("Error creating Stripe Checkout session", error);
                toast.error("Error creating Stripe Checkout session");
            });
    };

    useEffect(() => {
        if (orderId) {
            createCheckoutSession(orderId);
        } else {
            navigate('/orders');
        }
    }, [orderId]);

    return (
        <Box>
            <Box sx={{ padding: 4 }}>
                <Typography>
                    Redirecting to Payment <CircularProgress />
                </Typography>
            </Box>
        </Box>
    );
}

export default Checkout;