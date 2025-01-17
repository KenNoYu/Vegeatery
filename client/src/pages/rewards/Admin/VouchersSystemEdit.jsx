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
    InputLabel
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import http from '../../../http';
import dayjs from 'dayjs';

const AdminVouchersSystemEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [voucher, setVoucher] = useState({
        voucherName: '',
        voucherDescription: '',
        expiryDate: '',
        tierId: '',
    });

    const [tiers, setTiers] = useState([]);
    const [loading, setLoading] = useState(true);
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

        if (voucher.voucherDescription.length > 100) {
            setErrorMessage("Voucher description cannot exceed 100 characters.");
            return;
        }

        if (!voucher.voucherName.trim()) {
            setErrorMessage("Voucher name cannot be empty.");
            return;
        }

        if (!voucher.voucherDescription.trim()) {
            setErrorMessage("Voucher description cannot be empty.");
            return;
        }

        const currentDate = new Date();
        const expiryDate = new Date(voucher.expiryDate);
        
        if (expiryDate <= currentDate) {
            setErrorMessage("Expiry date must be in the future.");
            return;
        }

        if (!voucher.tierId) {
            setErrorMessage("Please select a tier for the voucher.");
            return;
        }

        try {
            await http.put(`/vouchers/${id}`, voucher);
            navigate('/rewards/admin/voucherssystem');
        } catch (error) {
            console.error('Error updating voucher:', error);
            setErrorMessage("Failed to update voucher. Please try again later.");
        }
    };

    if (loading) {
        return <LinearProgress />;
    }

    return (
        <Box>
            <Typography variant="h4">Edit Voucher</Typography>
            {errorMessage && <Typography color="error">{errorMessage}</Typography>} {/* Display error message */}
            <Box mt={2}>
                <TextField
                    label="Voucher Name"
                    value={voucher.voucherName}
                    onChange={(e) => setVoucher({ ...voucher, voucherName: e.target.value })}
                    fullWidth
                />
                <TextField
                    label="Description"
                    value={voucher.voucherDescription}
                    onChange={(e) => setVoucher({ ...voucher, voucherDescription: e.target.value })}
                    fullWidth
                    multiline
                />
                <TextField
                    label="Expiry Date"
                    type="date"
                    value={dayjs(voucher.expiryDate).format('YYYY-MM-DD')}
                    onChange={(e) => setVoucher({ ...voucher, expiryDate: e.target.value })}
                    fullWidth
                />
                <FormControl fullWidth>
                    <InputLabel>Tier</InputLabel>
                    <Select
                        value={voucher.tierId}
                        onChange={(e) => setVoucher({ ...voucher, tierId: e.target.value })}
                    >
                        {tiers.map((tier) => (
                            <MenuItem key={tier.tierId} value={tier.tierId}>
                                {tier.tierName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Box mt={2}>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        Save Changes
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default AdminVouchersSystemEdit;
