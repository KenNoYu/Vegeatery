import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@emotion/react";

const ConfirmationPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "90vh",
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
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <img
            src="/assets/reservationicons/Confirm.png"
            alt="Confirmed Reservation"
            style={{ width: '70px', height: '70px', opacity: 0.6 }}
          />
        </div>

        <Typography variant="h4" >
          Reservation Confirmed!
        </Typography>
        <Typography variant="body1" width={'60%'} fontSize={18} >
          <br />An email has been sent to confirm your reservation. You may view, edit, and cancel, under your profile. <br /><br />
          Note that reservations will only be held for 15 minutes. <br /><br />
          Thank you and see you at Vegeatery!
        </Typography>

        <Button variant="contained" onClick={() => navigate('/user/reservations')} sx={{
          backgroundColor: theme.palette.Accent.main,
          color: theme.palette.primary.main,
          marginTop: 3,
          "&:hover": {
            backgroundColor: "#E7ABC5"
          }
        }}>
          View Reservations
        </Button>
      </Box>

    </Box>
  );
};

export default ConfirmationPage;
