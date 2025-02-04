import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, IconButton, Grid, CardContent, Card , Button} from "@mui/material";
import http from "../../../http"; // Adjust the path to your http.js
import RoleGuard from '../../../utils/RoleGuard';

const PointsRange = () => {
  RoleGuard('Admin');
  const [editMode, setEditMode] = useState(null); // ID of the tier in edit mode
  const [updatedTier, setUpdatedTier] = useState({});
  const [error, setError] = useState(null); // To handle errors
  const [tiers, setTiers] = useState([]);


  // Fetch tiers from the API
  useEffect(() => {
    http
      .get("/tiers")
      .then((response) => {
        setTiers(response.data); // Adjust if response format differs
        setError(null); // Clear previous errors
      })
      .catch((err) => {
        setError("Failed to load tiers. Please try again later.");
      });
  }, []);

  const handleEditClick = (tier) => {
    setEditMode(tier.tierId); // Enter edit mode for the specific tier
    setUpdatedTier({ ...tier }); // Initialize the edit data for the selected tier
  };

  const handleInputChange = (field, value) => {
    if (updatedTier) {
      setUpdatedTier({ ...updatedTier, [field]: value });
    }
  };

  const handleSaveClick = () => {
    if (!updatedTier) return;

    http
      .put(`/tiers/${updatedTier.tierId}`, updatedTier)
      .then(() => {
        // Update the tiers list with the saved data
        setTiers((prevTiers) =>
          prevTiers.map((tier) =>
            tier.tierId === updatedTier.tierId ? updatedTier : tier
          )
        );
        setEditMode(null);
        setUpdatedTier(null);
        setError(null); // Clear any previous errors
      })
      .catch(() => {
        setError("Failed to save the changes due to overlapping of points. Please try again.");
      });
  };

  const handleCancelClick = () => {
    setEditMode(null);
    setUpdatedTier(null);
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
      overflow: 'hidden',
      marginTop: '2rem'
    }}>
      <Typography variant="h4" fontWeight="bold" mb={2}>
        Manage Tier Points Range
      </Typography>
      {error && (
        <Typography variant="body1" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

        <CardContent>
          <Grid container spacing={2}>
            {tiers.map((tier) => (
              <Grid item xs={12} key={tier.tierId}>
                <Card sx={{padding: '2rem', backgroundColor: '#E6F2FF', borderRadius: 2, width: '100%'}}>
                  <CardContent>
                    <Typography variant="h6">{tier.tierName} Tier</Typography>
                    {editMode === tier.tierId ? (
                      <>
                        <TextField
                          label="Min Points"
                          variant="outlined"
                          size="small"
                          value={updatedTier?.minPoints || ""}
                          onChange={(e) => handleInputChange("minPoints", e.target.value)}
                          sx={{ mb: 2, width: "100%" }}
                        />
                        <Box sx={{ display: "flex", justifyContent: "space-between", marginTop: 2 }}>
                          <Button onClick={handleSaveClick} variant="contained" sx={{
                            textTransform: 'none',
                            color: '#FFFFFF',
                            backgroundColor: '#C6487E',
                            '&:hover': { backgroundColor: '#E7ABC5' }
                          }}>
                            SAVE
                          </Button>
                          <Button onClick={handleCancelClick} variant="contained" sx={{
                            textTransform: 'none',
                            color: '#C6487E',
                            backgroundColor: '#FFFFFF',
                            borderColor: '#C6487E',
                            '&:hover': {
                                backgroundColor: '#E7ABC5',
                                color: '#FFFFFF'
                            }
                          }}>
                            CANCEL
                          </Button>
                        </Box>
                      </>
                    ) : (
                      <>
                        <Typography marginBottom={0}>Min Points: {tier.minPoints}</Typography>
                        <Button
                          onClick={() => handleEditClick(tier)}
                          sx={{
                            textTransform: 'none',
                            color: '#FFFFFF',
                            backgroundColor: '#C6487E',
                            '&:hover': { backgroundColor: '#E7ABC5' }
                          }}
                        >
                          EDIT
                        </Button>
                      </>
                    )}
                  </CardContent>
                  </Card>
              </Grid>
            ))}
          </Grid>
        </CardContent>
    </Box>
  );
};

export default PointsRange;
