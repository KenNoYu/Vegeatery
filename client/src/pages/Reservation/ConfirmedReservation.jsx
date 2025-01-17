import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ConfirmationPage = () => {

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          width: "80%",
          maxWidth: 1200,
          minHeight: 500,
          backgroundColor: "white",
          boxShadow: 3,
          borderRadius: 2,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >

        <Typography variant="h4" >
          Reservation Confirmed!
        </Typography> 
        <Typography variant="body1" >
          Thank you for your reservation. We look forward to serving you.
        </Typography>
      </Box>

    </Box>
  );
};

export default ConfirmationPage;
