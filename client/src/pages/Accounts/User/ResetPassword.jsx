import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  CircularProgress,
  styled,
} from "@mui/material";
import { useLocation } from "react-router-dom";
import http from "../../../http";
import { useNavigate } from "react-router-dom";
import vegeateryMain from "../../../assets/logo/vegeateryMain.png";

const ResetPassword = () => {
  const navigate = useNavigate();

  // Use URLSearchParams to extract the token and email from the query string
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

  const LogoContainer = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    display: "flex",
    justifyContent: "center", // Center the logo
  }));

  const Title = styled(Typography)(({ theme }) => ({
    marginBottom: theme.spacing(3),
    fontWeight: 600,
    color: "#000000",
    textAlign: "center", // Center the title
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

  useEffect(() => {
    // Check if token and email are available, otherwise show an error
    if (!token) {
      setMessage("Invalid or expired reset token.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      // Send the reset request with token and email to the backend
      console.log(
        "Sending data to reset password:",
        JSON.stringify({ resetCode: token, newPassword: password }, null, 2)
      );

      await http.post("/reset-password/confirm", {
        resetCode: token,
        newPassword: password,
      });
      console.log("Password reset successful!");
      setMessage("Your password has been reset successfully!");
      navigate("/login");
    } catch (error) {
      // Handle error appropriately
      console.error("Error during password reset:", error);
      setMessage("An error occurred while resetting the password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <StyledContainer maxWidth="sm">
      <StyledContent>
        <LogoContainer>
          <img
            src={vegeateryMain}
            alt="Vegeatery Logo"
            style={{ height: "7em", width: "auto" }}
          />
        </LogoContainer>
        <Title variant="h4" gutterBottom>
          Reset Your Password
        </Title>
        <form onSubmit={handleSubmit}>
          <TextField
            label="New Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
          <TextField
            label="Confirm Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
            {loading ? "Resetting..." : "Reset Password"}
          </StyledButton>
        </form>
        {message && (
          <Typography
            color={message.includes("error") ? "error" : "success"}
            variant="body2"
          >
            {message}
          </Typography>
        )}
      </StyledContent>
    </StyledContainer>
  );
};

export default ResetPassword;
