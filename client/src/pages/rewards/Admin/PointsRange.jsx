import React, { useState, useEffect } from "react";
import { Box, Card, CardContent, Typography, TextField, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import http from "../../../http"; // Adjust the path to your http.js

const PointsRange = () => {
  const [tiers, setTiers] = useState([]);
  const [editMode, setEditMode] = useState(null); // ID of the tier in edit mode
  const [updatedTier, setUpdatedTier] = useState({});
  const [error, setError] = useState(null); // To handle errors

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
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Manage Tier Points Range
      </Typography>
      {error && (
        <Typography variant="body1" color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
        {tiers.map((tier) => (
          <Card key={tier.tierId} sx={{ width: "300px", padding: "16px" }}>
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
                  <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                    <IconButton onClick={handleSaveClick} color="primary">
                      <SaveIcon />
                    </IconButton>
                    <IconButton onClick={handleCancelClick} color="secondary">
                      <CancelIcon />
                    </IconButton>
                  </Box>
                </>
              ) : (
                <>
                  <Typography>Min Points: {tier.minPoints}</Typography>
                  <IconButton
                    onClick={() => handleEditClick(tier)}
                    sx={{ color: "orange" }}
                  >
                    <EditIcon />
                  </IconButton>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default PointsRange;
