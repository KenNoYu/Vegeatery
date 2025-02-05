import React, { useState } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  styled,
} from "@mui/material";
import http from "../../../http";
import vegeateryMain from "../../../assets/logo/vegeateryMain.png";

const RequestPasswordReset = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const StyledContainer = styled(Container)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // Center content horizontally
    justifyContent: "center", // Center content vertically
    minHeight: "80vh", // Ensure full viewport height for vertical centering
    padding: theme.spacing(4),
    borderRadius: 30,
    marginTop: theme.spacing(8),
    boxShadow: theme.shadows[3],
    backgroundColor: "#ffffff", // White background
  }));

  const StyledContent = styled(Box)(({ theme }) => ({
    // Added a content box for centering
    width: "100%", // Take full width of the container
    maxWidth: "400px", // Set a maximum width if needed
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // Center content within the box
  }));

  const StyledButton = styled(Button)(({ theme }) => ({
    marginTop: theme.spacing(2),
    textTransform: "none",
    width: "100%",
    backgroundColor: "#C6487E",
    padding: "10px",
    fontSize: "1rem",
    color: "#fff",
    borderRadius: "8px",
    "&:hover": { backgroundColor: "#C6487E" }, // Full width within the content box
  }));

  const ErrorMessage = styled(Typography)(({ theme }) => ({
    marginTop: theme.spacing(2),
    color: theme.palette.error.main,
  }));

  const Title = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    fontWeight: 600,
    color: "#000000",
    textAlign: "center", // Center the title
  }));

  const LogoContainer = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    display: "flex",
    justifyContent: "center", // Center the logo
  }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      console.log("Requesting password reset for email:", email);

      // Send email request to the backend API
      const response = await http.post("/reset-password", { email });

      console.log("Response from backend:", response.data);
      setMessage(
        "If the email exists, a reset link has been sent to your inbox."
      );
    } catch (error) {
      // Log any error that occurs during the request
      if (error.response && error.response.data) {
        console.error("Error response from backend:", error.response.data);
        setMessage(error.response.data);
      } else {
        console.error("Error occurred while sending the reset email:", error);
        setMessage("An error occurred while sending the reset email.");
      }
    } finally {
      console.log("Request completed");
      setLoading(false);
    }
  };

  return (
    <StyledContainer maxWidth="sm">
      <StyledContent>
        {/* Wrap content in the styled box */}
        <LogoContainer>
          <img
            src={vegeateryMain}
            alt="Vegeatery Logo"
            style={{ height: "7em", width: "auto" }}
          />
        </LogoContainer>
        <Title variant="h4">Forgot your password?</Title>
        <Typography variant="body" sx={{textAlign: "center", marginBottom: "1em"}}>Please enter your email address you'd like your password reset information sent to</Typography>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          {/* Form takes full width */}
          <TextField
            label="Email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          />
          <StyledButton
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={20} color="white" />
            ) : (
              "Send Reset Link"
            )}
          </StyledButton>
        </form>
        {message && <ErrorMessage variant="body2">{message}</ErrorMessage>}
      </StyledContent>
    </StyledContainer>
  );
};

export default RequestPasswordReset;
