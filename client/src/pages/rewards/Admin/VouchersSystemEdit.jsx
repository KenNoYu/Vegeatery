import {
    Box,
    Typography,
    LinearProgress,
    Button,
    Card,
    CardContent,
    Grid,
    TextField,
    IconButton,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import http from '../../../http';
import dayjs from 'dayjs';
import RoleGuard from '../../../utils/RoleGuard';

const AdminVouchersSystemEdit = () => {
    RoleGuard('Admin');
    const { id } = useParams();
    const navigate = useNavigate();

    const [voucher, setVoucher] = useState({
        voucherName: '', discountPercentage: 1.0, tierId: '',
        tier: { tierId: '', tierName: '', minPoints: 0 } // Added tier object
    });

    const [tiers, setTiers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openModal, setOpenModal] = useState(null);
    const [errorMessage, setErrorMessage] = useState(""); // To display error messages

    useEffect(() => {
        const fetchVoucherAndTiers = async () => {
            try {
                const voucherResponse = await http.get(`/vouchers/${id}`);
                const tiersResponse = await http.get('/tiers');
                setVoucher(voucherResponse.data);
                setTiers(tiersResponse.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching voucher or tiers:', error);
                setErrorMessage("Failed to load voucher data. Please try again later.");
            }
        };

        fetchVoucherAndTiers();
    }, [id]);

    const handleSave = async () => {
        if (voucher.voucherName.length > 50) {
            setErrorMessage("Voucher name cannot exceed 50 characters.");
            return;
        }

        if (voucher.discountPercentage <= 0 || voucher.discountPercentage > 100) {
            setErrorMessage("Discount percentage must be between 1 and 100.");
            return;
        }

        if (!voucher.voucherName.trim()) {
            setErrorMessage("Voucher name cannot be empty.");
            return;
        }

        if (!voucher.tierId) {
            setErrorMessage("Please select a tier for the voucher.");
            return;
        }

        try {
            await http.put(`/vouchers/${id}`, voucher);
            navigate('/admin/rewards');
        } catch (error) {
            console.error('Error updating voucher:', error);
            setErrorMessage("Failed to update voucher. Please try again later.");
        }
    };

    if (loading) {
        return <LinearProgress />;
    }

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
            <Typography variant="h4" fontWeight="bold" mb={2}>Edit Voucher</Typography>
            {errorMessage && <Typography color="error">{errorMessage}</Typography>}
            <Card sx={{ backgroundColor: '#E7F0FA', padding: '2rem', borderRadius: 2 }}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Voucher Name"
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
                                onChange={(e) => setVoucher({ ...voucher, voucherName: e.target.value })}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Discount (%)"
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
                                onChange={(e) => setVoucher({
                                    ...voucher,
                                    discountPercentage: parseFloat(e.target.value) || 0
                                })}
                                inputProps={{ step: "0.01", min: "1", max: "100" }}
                            />
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
                                SAVE CHANGES
                            </Button>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Confirmation Modal */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                <DialogTitle>Confirm Submission</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to save these changes?</DialogContentText>
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
                    <Button onClick={handleSave} sx={{
                        backgroundColor: '#C6487E',
                        '&:hover': {
                            backgroundColor: '#E7ABC5'
                        }
                    }}>SUBMIT</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminVouchersSystemEdit;
