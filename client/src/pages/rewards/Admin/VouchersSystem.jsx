import { Box, Typography, LinearProgress, Button, Card, CardContent, Grid2 as Grid, Input, IconButton, MenuItem, Select } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
// import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../../../http';
import dayjs from 'dayjs';


const AdminVouchersSystem = () => {
    const [tiers, setTiers] = useState([]);
    const [vouchers, setVouchers] = useState([]);
    const [newVoucher, setNewVoucher] = useState({ name: '', description: '', expiryDate: '', tierId: '' });

    useEffect(() => {
        // Fetch tiers and vouchers
        fetchTiers();
        fetchVouchers();
    }, []);

    const fetchTiers = async () => {
        const { data } = await http.get('/tiers');
        setTiers(data);
    };

    const fetchVouchers = async () => {
        const { data } = await http.get('/vouchers');
        setVouchers(data);
    };

    const handleAddVoucher = async () => {
        await http.post('/vouchers', newVoucher);
        fetchVouchers();
        setNewVoucher({ name: '', description: '', expiryDate: '', tierId: '' });
    };

    return (
        <Box>
            <Typography variant="h4">Admin Voucher System</Typography>
            <Box mt={2}>
                <Typography variant="h6">Add New Voucher</Typography>
                <Input
                    placeholder="Voucher Name"
                    value={newVoucher.name}
                    onChange={(e) => setNewVoucher({ ...newVoucher, name: e.target.value })}
                />
                <Input
                    placeholder="Description"
                    value={newVoucher.description}
                    onChange={(e) => setNewVoucher({ ...newVoucher, description: e.target.value })}
                />
                <Input
                    placeholder="Expiry Date"
                    type="date"
                    value={newVoucher.expiryDate}
                    onChange={(e) => setNewVoucher({ ...newVoucher, expiryDate: e.target.value })}
                />
                <Select
                    value={newVoucher.tierId}
                    onChange={(e) => setNewVoucher({ ...newVoucher, tierId: e.target.value })}
                    displayEmpty
                >
                    <MenuItem value="" disabled>
                        Select Tier
                    </MenuItem>
                    {tiers.map((tier) => (
                        <MenuItem key={tier.tierId} value={tier.tierId}>
                            {tier.tierName}
                        </MenuItem>
                    ))}
                </Select>
                <Button onClick={handleAddVoucher}>Add Voucher</Button>
            </Box>

            <Box mt={4}>
                <Typography variant="h6">Vouchers List</Typography>
                <Grid container spacing={2}>
                    {vouchers.map((voucher) => (
                        <Grid item xs={12} sm={6} md={4} key={voucher.voucherId}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6">{voucher.voucherName}</Typography>
                                    <Typography>{voucher.description}</Typography>
                                    <Typography>Expiry: {voucher.expiryDate}</Typography>
                                    <Typography>Tier: {voucher.tier?.tierName}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
};

export default AdminVouchersSystem;