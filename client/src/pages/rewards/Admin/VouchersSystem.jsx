import { Box, Typography, Button, Card, CardContent, Grid, Input, IconButton, MenuItem, Select, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Container } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import http from '../../../http';
import RoleGuard from '../../../utils/RoleGuard';
import RewardsSidebar from "./RewardsSidebar.jsx";


const AdminVouchersSystem = () => {
  RoleGuard('Admin');
  const [tiers, setTiers] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [openModal, setOpenModal] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    fetchVouchers();
  }, []);


  const fetchVouchers = async () => {
    try {
      const { data } = await http.get('/vouchers');
      setVouchers(data);
    } catch (error) {
      console.error('Error fetching vouchers:', error);
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

  const groupedVouchers = {
    Gold: vouchers.filter(v => v.tier?.tierName === 'Gold'),
    Silver: vouchers.filter(v => v.tier?.tierName === 'Silver'),
    Bronze: vouchers.filter(v => v.tier?.tierName === 'Bronze')
  };

  const tierStyles = {
    Gold: { backgroundColor: '#E5D040', color: '#000' },
    Silver: { backgroundColor: '#C0C0C0', color: '#000' },
    Bronze: { backgroundColor: '#CD7F32', color: '#FFF' }
  };

  return (
    <Container disableGutters
      sx={{
        marginBottom: 2
      }}
    >

      <Box sx={{ display: "flex", height: "100vh", marginTop: "2em", overflow: "hidden", overflowX: "hidden" }}>
        {/* Sidebar */}
        <RewardsSidebar />
        {/* Main Content */}
        <Box
          sx={{
            marginLeft: "240px",
            flexGrow: 1,
            padding: 5,
            backgroundColor: "#FFFFFF",
            marginTop: "5px",
            paddingLeft: "3em",
            overflowX: "hidden",
          }}
        >

          <Typography variant="h4" fontWeight="bold" mt={5} ml={3} mb={2}> Voucher System</Typography>


          <Box mt={4} ml={3} width="100%">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginTop: '50px', }}>
              <Typography variant="h5" fontWeight='bold'>Available Vouchers</Typography>
              <Button
                variant="contained"
                sx={{
                  textTransform: 'none',
                  color: '#FFFFFF',
                  backgroundColor: '#C6487E',
                  '&:hover': {
                    backgroundColor: '#E7ABC5'
                  }
                }}
                onClick={() => navigate('/admin/voucherssystemadd')}
              >
                ADD NEW VOUCHER
              </Button>
            </Box>

            {Object.entries(groupedVouchers).map(([tier, vouchers]) => (
              <Box key={tier} mt={2} sx={{ width: '100%' }}>
                <Typography variant="h5" sx={{
                  fontWeight: 'bold',
                  marginTop: '50px',
                }} >
                  {tier}
                </Typography>
                <Grid container spacing={2}>
                  {vouchers.map(voucher => (
                    <Grid item xs={12} sm={6} md={4} key={voucher.voucherId}>
                      <Card sx={tierStyles[tier]}>
                        <CardContent>
                          <Typography variant="h6">{voucher.voucherName}</Typography>
                          <Typography>Discount: {voucher.discountPercentage}%</Typography>
                          <Box mt={2} display="flex" justifyContent="space-between">
                            <Button
                              variant="contained"
                              sx={{ textTransform: 'none', color: '#FFFFFF', backgroundColor: '#C6487E', '&:hover': { backgroundColor: '#E7ABC5' } }}
                              component={Link}
                              to={`/rewards/admin/voucherssystem/edit/${voucher.voucherId}`}>
                              EDIT
                            </Button>
                            <Button
                              variant="outlined"
                              sx={{
                                textTransform: 'none',
                                color: '#C6487E',
                                backgroundColor: '#FFFFFF',
                                borderColor: '#C6487E',
                                '&:hover': {
                                  backgroundColor: '#E7ABC5',
                                  color: '#FFFFFF'
                                }
                              }}
                              onClick={() => setOpenModal(voucher.voucherId)}>
                              DELETE
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Dialog open={Boolean(openModal)} onClose={() => setOpenModal(null)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this voucher? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(null)} sx={{
            textTransform: 'none',
            color: '#C6487E',
            backgroundColor: '#FFFFFF',
            borderColor: '#C6487E',
            '&:hover': {
              backgroundColor: '#E7ABC5',
              color: '#FFFFFF',
            }
          }}>CANCEL</Button>
          <Button onClick={() => { handleDeleteVoucher(openModal); setOpenModal(null); }} sx={{
            backgroundColor: '#C6487E',
            '&:hover': {
              backgroundColor: '#E7ABC5'
            }
          }}>DELETE</Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
};

export default AdminVouchersSystem;