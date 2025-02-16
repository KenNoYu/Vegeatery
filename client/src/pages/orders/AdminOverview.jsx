import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Card, CardContent, Typography, Box, Grid2 as Grid} from '@mui/material';
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

    return (
        <Box p={3}>
            {/* Sales Summary and Quick Stats */}
            <Grid container spacing={3}>
                {/* Sales Chart */}
                <Grid item xs={12} md={12}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold">Sales Summary</Typography>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={salesSummary.salesData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line type="monotone" dataKey="sales" stroke="#3f51b5" strokeWidth={2} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Quick Stats */}
                <Grid item xs={12} md={3}>
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
            {/*
            <Card sx={{ mt: 3 }}>
                <CardContent>
                    <Typography variant="h6" fontWeight="bold">Top Selling Products</Typography>
                    {topProducts.map(product => (
                        <Box key={product.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: '#f5f5f5', mb: 2, borderRadius: 2 }}>
                            <Box>
                                <Typography fontWeight="medium" variant="subtitle1">{product.name}</Typography>
                                <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                    {product.tags.map(tag => (
                                        <Badge key={tag} sx={{ p: 0.5, bgcolor: '#e0e0e0', borderRadius: 1 }}>{tag}</Badge>
                                    ))}
                                </Box>
                            </Box>
                            <Box textAlign="right">
                                <Typography color="error" fontWeight="bold">Earnings: {product.earnings}</Typography>
                                <Typography variant="caption" color="textSecondary">x {product.orders}</Typography>
                            </Box>
                        </Box>
                    ))}
                </CardContent>
            </Card>
            */}
        </Box>
    )
};

export default OrderDashboard;