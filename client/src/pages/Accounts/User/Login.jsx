import React, { useContext } from "react";
import { Box, Typography, TextField, Button, Grid } from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../../../http";
import { Bounce, ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import loginbanner from "../../../assets/loginbanner.jpg";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: yup.object({
      username: yup
        .string()
        .trim()
        .max(50, "Email must be at most 50 characters")
        .required("Username is required"),
      password: yup
        .string()
        .trim()
        .min(8, "Password must be at least 8 characters")
        .max(50, "Password must be at most 50 characters")
        .required("Password is required"),
    }),
    onSubmit: (data) => {
      data.username = data.username.trim().toLowerCase();
      data.password = data.password.trim();
      http
        .post("/auth/login", data, { withCredentials: true })
        .then(() => {
          window.location = "/overview";
        })
        .catch((err) => {
          const errorMessage =
            err.response?.data?.message || "Login failed. Please try again.";
          toast.error(errorMessage, {transition:Bounce}); // Simplified error handling
        });
    },
  });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Grid
        container
        sx={{
          maxWidth: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Login Form Section */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              backgroundColor: "#ffffff",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "5em",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: "2rem",
                fontWeight: "bold",
                mb: 3,
                alignSelf: "center",
              }}
            >
              Login
            </Typography>
            <Box
              component="form"
              sx={{ maxWidth: "400px", margin: "0 auto" }}
              onSubmit={formik.handleSubmit}
            >
              <TextField
                fullWidth
                label="Username / Email Address"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.username && Boolean(formik.errors.username)
                }
                helperText={formik.touched.username && formik.errors.username}
                margin="dense"
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
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={
                  formik.touched.password && Boolean(formik.errors.password)
                }
                helperText={formik.touched.password && formik.errors.password}
                margin="dense"
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
              <Button
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  backgroundColor: "#C6487E",
                  padding: "10px",
                  fontSize: "1rem",
                  color: "#fff",
                  borderRadius: "8px",
                  "&:hover": { backgroundColor: "#C6487E" },
                }}
                type="submit"
              >
                Login
              </Button>

              <Typography
                variant="body2"
                align="center"
                sx={{ mt: 2, color: "#6e6e6e" }}
              >
                <Button
                  onClick={() => navigate("/requestreset")} // Navigate to the forgot password page
                  sx={{ textDecoration: "none", color: "inherit" }}
                >
                  Forgot Password?
                </Button>
              </Typography>

              <Typography
                variant="body2"
                align="center"
                sx={{ mt: 2, color: "#6e6e6e" }}
              >
                Don’t have an account?{" "}
                <span style={{ color: "#FF69B4", cursor: "pointer" }}>
                  <Button
                    onClick={() => navigate("/register")} // Navigate to the registration page
                    sx={{ textDecoration: "none", color: "inherit" }}
                  >
                    Register here!
                  </Button>
                </span>
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
      <ToastContainer />
    </Box>
  );
}

export default Login;
