import { Box, Typography, Button, Card, CardContent, Grid, Input, IconButton, MenuItem, Select, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
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
        voucherName: '', discountPercentage: 1.0, tierId: '',
        tier: { tierId: '', tierName: '', minPoints: 0 }
    });
    const [errorMessage, setErrorMessage] = useState("");
    const [openModal, setOpenModal] = useState(null);
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
        if (!voucher.voucherName || voucher.discountPercentage == null || !voucher.tierId) {
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
            marginTop: '5em',
            marginLeft: 'auto',
            marginRight: 'auto',
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
        }}>
            <Typography variant="h4" fontWeight="bold" mb={2}>Add New Voucher</Typography>
            {errorMessage && <Typography color="error">{errorMessage}</Typography>}

            <Card sx={{ backgroundColor: '#E7F0FA', padding: '2rem', borderRadius: 2 }}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField fullWidth label="Voucher Name"
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "&.Mui-focused": {
                                            fieldset: {
                                                borderColor: "#C6487E !important",
                                            },
                                        },
                                    },
                                    "& .MuiInputLabel-root": {
                                        // Target the label specifically
                                        color: "black", // Default label color
                                        "&.Mui-focused": {
                                            // Label styles when focused
                                            color: "black !important", // Black on focus
                                        },
                                    },
                                }}
                                value={voucher.voucherName}
                                onChange={(e) => setNewVoucher({ ...voucher, voucherName: e.target.value })} />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField fullWidth label="Discount (%)"
                                type="number"
                                value={voucher.discountPercentage}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "&.Mui-focused": {
                                            fieldset: {
                                                borderColor: "#C6487E !important",
                                            },
                                        },
                                    },
                                    "& .MuiInputLabel-root": {
                                        // Target the label specifically
                                        color: "black", // Default label color
                                        "&.Mui-focused": {
                                            // Label styles when focused
                                            color: "black !important", // Black on focus
                                        },
                                    },
                                }}
                                onChange={(e) => setNewVoucher({
                                    ...voucher,
                                    discountPercentage: parseFloat(e.target.value) || 0
                                })}
                                inputProps={{ step: "0.01", min: "1", max: "100" }} />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                select
                                fullWidth
                                autoComplete="off"
                                label="Select Tier"
                                name="tier"
                                value={voucher.tierId}
                                onChange={(e) => setNewVoucher({ ...voucher, tierId: e.target.value })}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        "&.Mui-focused": {
                                            fieldset: {
                                                borderColor: "#C6487E !important",
                                            },
                                        },
                                    },
                                    "& .MuiInputLabel-root": {
                                        // Target the label specifically
                                        color: "black", // Default label color
                                        "&.Mui-focused": {
                                            // Label styles when focused
                                            color: "black !important", // Black on focus
                                        },
                                    },
                                }}
                            >
                                {tiers.map((tier) => (
                                    <MenuItem key={tier.tierId} value={tier.tierId}>{tier.tierName}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>

                        <Grid item xs={12} display="flex" justifyContent="space-between">
                            <Button onClick={() => navigate('/admin/rewards')} variant="contained" sx={{
                                textTransform: 'none',
                                color: '#C6487E',
                                backgroundColor: '#FFFFFF',
                                borderColor: '#C6487E',
                                '&:hover': {
                                    backgroundColor: '#E7ABC5',
                                    color: '#FFFFFF'
                                }
                            }}>
                                BACK
                            </Button>
                            <Button onClick={() => setOpenModal(true)} variant="contained" sx={{
                                textTransform: 'none',
                                color: '#FFFFFF',
                                backgroundColor: '#C6487E',
                                '&:hover': { backgroundColor: '#E7ABC5' }
                            }}>
                                ADD
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Confirmation Modal */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                <DialogTitle>Confirm Submission</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to add this new voucher?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(false)} sx={{
                        textTransform: 'none',
                        color: '#C6487E',
                        backgroundColor: '#FFFFFF',
                        borderColor: '#C6487E',
                        '&:hover': {
                            backgroundColor: '#E7ABC5',
                            color: '#FFFFFF',
                        }
                    }}>CANCEL</Button>
                    <Button onClick={handleAddVoucher} sx={{
                        backgroundColor: '#C6487E',
                        '&:hover': {
                            backgroundColor: '#E7ABC5'
                        }
                    }}>SUBMIT</Button>
                </DialogActions>
            </Dialog>

        </Box >
    );
};

export default VouchersSystemAdd;