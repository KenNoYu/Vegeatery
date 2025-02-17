import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Card, CardContent, Typography, Box, Grid2 as Grid } from '@mui/material';
import { User, Calendar, Package } from 'lucide-react';
import http from '../../http';

const OrderDashboard = () => {
    const [orderData, setOrderData] = useState([]);
    const [topProducts, setTopProducts] = useState([]);
    const [salesSummary, setSalesSummary] = useState({
        totalOrders: 0,
        totalSales: 0,
        salesData: []
    });

    useEffect(() => {
        http.get('/stripe/sales-summary')
            .then((res) => {
                console.log(res.data);
                setOrderData(res.data)
                setSalesSummary(res.data)
                getTopOrders();
            })
            .catch((err) => {
                console.error('Failed to fetch order stats:', err)
            });
    }, []);

    const stats = [
        { icon: <Package />, label: 'Orders', value: orderData.totalOrders },
        // reservations wait for chloe's part first
        { icon: <Calendar />, label: 'Reservations', value: '10' },
        { icon: <User />, label: 'Total Users', value: '' }
    ];

    const getTopOrders = () => {
        http.get("/product/TopOrders")
            .then((res) => {
                setTopProducts(res.data)
            })
            .catch((err) => {
                console.error('Failed to fetch order stats:', err)
            });
    }

    return (
        <Box p={3}>
            {/* Sales Summary and Quick Stats */}
            <Grid container spacing={5}>
                {/* Sales Chart */}
                <Grid item xs={12} md={9} lg={9}>
                    <Card sx={{ height: 350, width: { xs: '80vw', md: '60vw', lg: '45vw' } }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold">Sales Summary</Typography>
                            <Box sx={{ width: '100%', height: 280 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={salesSummary.salesData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Line type="monotone" dataKey="sales" stroke="#3f51b5" strokeWidth={2} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Quick Stats */}
                <Grid item xs={12} md={3} lg={3}>
                    {stats.map((stat, index) => (
                        <Card key={index} sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', p: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {stat.icon}
                                <Typography fontWeight="medium">{stat.label}</Typography>
                            </Box>
                            <Typography variant="h6" fontWeight="bold">{stat.value}</Typography>
                        </Card>
                    ))}
                </Grid>
            </Grid>

            {/* Top Selling Products */}
            <Card sx={{ mt: 3 }}>
                <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                        Top Selling Products
                    </Typography>

                    {topProducts.length > 0 ? (
                        topProducts.map((product) => (
                            <Box
                                key={product.productId}
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    p: 2,
                                    bgcolor: '#f5f5f5',
                                    mb: 2,
                                    borderRadius: 2,
                                }}
                            >
                                {/* Product Image */}
                                <Box
                                    sx={{
                                        width: 60,
                                        height: 60,
                                        overflow: 'hidden',
                                        borderRadius: 2,
                                        mr: 2,
                                    }}
                                >
                                    <img
                                        src={`${import.meta.env.VITE_FILE_BASE_URL}${product.imageFile}`}
                                        alt={product.productName}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            borderRadius: '10px',
                                        }}
                                    />
                                </Box>

                                {/* Product Info */}
                                <Box>
                                    <Typography fontWeight="medium" variant="subtitle1">
                                        {product.productName}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                        {product.tags.map((tag) => (
                                            <Badge
                                                key={tag}
                                                sx={{
                                                    p: 0.5,
                                                    bgcolor: '#e0e0e0',
                                                    borderRadius: 1,
                                                    fontSize: '0.75rem',
                                                }}
                                            >
                                                {tag}
                                            </Badge>
                                        ))}
                                    </Box>
                                </Box>

                                {/* Product Earnings */}
                                <Box textAlign="right">
                                    <Typography color="error" fontWeight="bold">
                                        Earnings: ${product.earnings * product.quantityBought}
                                    </Typography>
                                    <Typography variant="caption" color="textSecondary">
                                        x{product.quantityBought} Sold
                                    </Typography>
                                </Box>
                            </Box>
                        ))
                    ) : (
                        // No Sales Message
                        <Box
                            sx={{
                                textAlign: 'center',
                                py: 5,
                            }}
                        >
                            <Typography variant="h6" color="textSecondary">
                                No products have been sold yet.
                            </Typography>
                        </Box>
                    )}
                </CardContent>
            </Card>
        </Box>
    )
};

export default OrderDashboard;