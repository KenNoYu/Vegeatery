import { Box, Typography, Button, Card, CardContent, Grid, Input, IconButton, MenuItem, Select } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import http from '../../../http';

const AdminVouchersSystem = () => {
  const [tiers, setTiers] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [voucher, setNewVoucher] = useState({
    voucherName: '', discountPercentage: 1.0, expiryDate: '', tierId: '',
    tier: { tierId: '', tierName: '', minPoints: 0 } // Added tier object
  });
  const [errorMessage, setErrorMessage] = useState("");
  // const [editingVoucherId, setEditingVoucherId] = useState(null);

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


  const handleDeleteVoucher = async (voucherId) => {
    try {
      await http.delete(`/vouchers/${voucherId}`);
      fetchVouchers(); // Refresh the voucher list after deletion
    } catch (error) {
      console.error('Error deleting voucher:', error);
    }
  };

  return (
    <Box>
      <Typography variant="h4">Admin Voucher System</Typography>
      {errorMessage && <Typography color="error">{errorMessage}</Typography>} {/* Display error message */}
      <Box mt={2}>
        <Typography variant="h6">Add New Voucher</Typography>
        <Input
          placeholder="Voucher Name"
          value={voucher.voucherName}
          onChange={(e) => setNewVoucher({ ...voucher, voucherName: e.target.value })}
        />
        <Input
          placeholder="Discount"
          type="number"
          value={voucher.discountPercentage}
          onChange={(e) =>
            setNewVoucher({ ...voucher, discountPercentage: parseFloat(e.target.value) || 0 })
          }
          inputProps={{ step: "0.01", min: "1", max: "100" }}
        />

        <Input
          placeholder="Expiry Date"
          type="date"
          value={voucher.expiryDate}
          onChange={(e) => setNewVoucher({ ...voucher, expiryDate: e.target.value })}
        />
        <Select
          value={voucher.tierId}
          onChange={(e) => setNewVoucher({ ...voucher, tierId: e.target.value })}
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
                  <Typography>Discount: {voucher.discountPercentage}</Typography>
                  <Typography>Expiry: {voucher.expiryDate.split('T')[0]}</Typography>
                  <Typography>Tier: {voucher.tier?.tierName}</Typography>
                  <Box mt={2} display="flex" justifyContent="space-between">
                    <Button
                      variant="contained"
                      color="primary"
                      component={Link}
                      to={`/rewards/admin/voucherssystem/edit/${voucher.voucherId}`}>
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="black"
                      onClick={() => handleDeleteVoucher(voucher.voucherId)}>
                      Delete
                    </Button>
                  </Box>
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