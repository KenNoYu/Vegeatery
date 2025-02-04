import { Box, Typography, Button, Card, CardContent, Grid, Input, IconButton, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import http from '../../../http';
import RoleGuard from '../../../utils/RoleGuard';

const VouchersSystemAdd = () => {
    RoleGuard('Admin');
    const [tiers, setTiers] = useState([]);
    const [vouchers, setVouchers] = useState([]);
    const [voucher, setNewVoucher] = useState({
        voucherName: '', discountPercentage: 1.0, expiryDate: '', tierId: '',
        tier: { tierId: '', tierName: '', minPoints: 0 }
    });
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch tiers and vouchers
        fetchTiers();
        fetchVouchers();
    }, []);

    const fetchTiers = async () => {
        try {
            const { data } = await http.get('/tiers');
            setTiers(data);
        } catch (error) {
            console.error('Error fetching tiers:', error);
        }
    };

    const fetchVouchers = async () => {
        try {
            const { data } = await http.get('/vouchers');
            setVouchers(data);
        } catch (error) {
            console.error('Error fetching vouchers:', error);
        }
    };

    const handleAddVoucher = async () => {
        // Validate that all required fields are filled
        if (!voucher.voucherName || voucher.discountPercentage == null || !voucher.expiryDate || !voucher.tierId) {
            setErrorMessage('Please fill in all required fields before adding the voucher.');
            return;
        }

        // Voucher name validation
        if (voucher.voucherName.length > 50) {
            setErrorMessage("Voucher name cannot exceed 50 characters.");
            return;
        }

        if (!voucher.voucherName.trim()) {
            setErrorMessage("Name of voucher cannot be empty.");
            return;
        }

        // Discount percentage validation
        if (voucher.discountPercentage <= 0 || voucher.discountPercentage > 100) {
            setErrorMessage("Discount percentage must be between 1 and 100.");
            return;
        }

        // Date validation: Ensure it's not an earlier or current date
        const currentDate = new Date();
        const expiryDate = new Date(voucher.expiryDate);

        // Compare only the date part, ignoring time
        if (expiryDate <= currentDate.setHours(0, 0, 0, 0)) {
            setErrorMessage("Expiry date must be in the future.");
            return;
        }

        // Tier validation: Ensure a tier is selected
        if (!voucher.tierId) {
            setErrorMessage("Please select a tier for the voucher.");
            return;
        }

        // Update voucher object with full tier details when creating a voucher
        const selectedTier = tiers.find((tier) => tier.tierId === voucher.tierId);

        const newVoucher = {
            ...voucher,
            tier: selectedTier ? selectedTier : { tierId: 1, tierName: "Bronze", minPoints: 0 } // Default tier if not selected
        };

        try {
            // Send the POST request
            await http.post('/vouchers', newVoucher);
            navigate('/admin/rewards');

            // Refresh the voucher list and reset the form state
            fetchVouchers();
            setVoucher({
                voucherName: '',
                discountPercentage: 1.0,
                expiryDate: '',
                tierId: '',
                tier: { tierId: '', tierName: '', minPoints: 0 }
            });
            setErrorMessage(''); // Clear any previous error message

        } catch (error) {
            console.error("Failed to add voucher:", error);

        }
    };

    return (
        <Box sx={{
            maxWidth: 1200,
            minHeight: 500,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FFFFFF',
            padding: '2rem',
            boxShadow: 3,
            borderRadius: 2,
            overflow: "hidden",
            overflowY: "auto",
            overflowX: "hidden",
            paddingBottom: '2rem',
            marginTop: '2rem'
        }}>
            <Typography variant="h4" fontWeight="bold" mb={2}>Add New Voucher</Typography>
            {errorMessage && <Typography color="error">{errorMessage}</Typography>}

            <Card sx={{ backgroundColor: '#E7F0FA', padding: '2rem', borderRadius: 2 }}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Voucher Name"
                                value={voucher.voucherName}
                                onChange={(e) => setNewVoucher({ ...voucher, voucherName: e.target.value })} />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField fullWidth label="Discount (%)"
                                type="number"
                                value={voucher.discountPercentage}
                                onChange={(e) => setNewVoucher({
                                    ...voucher,
                                    discountPercentage: parseFloat(e.target.value) || 0
                                })}
                                inputProps={{ step: "0.01", min: "1", max: "100" }} />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Expiry Date"
                                type="date"
                                value={voucher.expiryDate}
                                onChange={(e) => setNewVoucher({ ...voucher, expiryDate: e.target.value })}
                                InputLabelProps={{ shrink: true }} />
                        </Grid>

                        <Grid item xs={12}>
                            <Select fullWidth
                                value={voucher.tierId}
                                onChange={(e) => setNewVoucher({ ...voucher, tierId: e.target.value })}
                                displayEmpty>
                                <MenuItem value="" disabled>Select Tier</MenuItem>
                                {tiers.map((tier) => (
                                    <MenuItem key={tier.tierId} value={tier.tierId}>{tier.tierName}</MenuItem>
                                ))}
                            </Select>
                        </Grid>

                        <Grid item xs={12} display="flex" justifyContent="space-between">
                            <Button onClick={() => navigate('/rewards/admin/voucherssystem')} variant="contained" sx={{
                                textTransform: 'none',
                                color: '#C6487E',
                                backgroundColor: '#FFFFFF',
                                borderColor: '#C6487E',
                                '&:hover': {
                                    backgroundColor: '#E7ABC5',
                                    color: '#FFFFFF'
                                }
                            }}>
                                Back
                            </Button>
                            <Button onClick={handleAddVoucher} variant="contained" sx={{
                                textTransform: 'none',
                                color: '#FFFFFF',
                                backgroundColor: '#C6487E',
                                '&:hover': { backgroundColor: '#E7ABC5' }
                            }}>
                                Add
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};

export default VouchersSystemAdd;