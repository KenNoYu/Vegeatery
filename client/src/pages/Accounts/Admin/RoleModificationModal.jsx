import React from 'react';
import { Modal, Box, Typography, RadioGroup, FormControlLabel, Radio, Button, Grid } from '@mui/material';

const RoleModificationModal = ({ open, handleClose, user, selectedRole, handleRoleChange, handleSubmit }) => {
    return (
        <Modal open={open} onClose={handleClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 400,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 4,
                    outline: 'none',
                }}
            >
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {user.username}'s Profile
                </Typography>

                <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong> Joined on{" "}</strong>
                    {new Date(user.createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })}
                </Typography>

                <Typography variant="body1" sx={{ mb: 2 }}>
                    <strong>Current Role:</strong> {user.roleName}
                </Typography>

                <Typography variant="h6" sx={{ mt: 3, mb: 1, fontWeight: 'medium' }}>
                    Modify Role
                </Typography>

                <RadioGroup value={selectedRole} onChange={handleRoleChange} sx={{ mb: 3 }}>
                    <FormControlLabel value="User" control={<Radio />} label="User" />
                    <FormControlLabel value="Staff" control={<Radio />} label="Staff" />
                    <FormControlLabel value="Admin" control={<Radio />} label="Admin" />
                </RadioGroup>

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Button
                            onClick={handleSubmit}
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{
                                backgroundColor: '#007BFF',
                                '&:hover': {
                                    backgroundColor: '#0056b3',
                                },
                                borderRadius: '10px',
                                p: 1.5,
                                textTransform: 'none',
                            }}
                        >
                            Modify Role
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
};

export default RoleModificationModal;
