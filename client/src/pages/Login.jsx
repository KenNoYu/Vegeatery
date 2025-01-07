import React, { useContext } from "react";
import { Box, Typography, TextField, Button, Grid2 } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import http from "../http";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserContext from "../contexts/UserContext";
// import loginbanner from "../assets/loginbanner.jpg";

function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: yup.object({
      email: yup
        .string()
        .trim()
        .email("Enter a valid email")
        .max(50, "Email must be at most 50 characters")
        .required("Email is required"),
      password: yup
        .string()
        .trim()
        .min(8, "Password must be at least 8 characters")
        .max(50, "Password must be at most 50 characters")
        .required("Password is required"),
    }),
    onSubmit: (data) => {
      data.email = data.email.trim().toLowerCase();
      data.password = data.password.trim();
      http
        .post("/auth/login", data)
        .then((res) => {
          localStorage.setItem("accessToken", res.data.accessToken);
          setUser(res.data.user);
          navigate("/");
        })
        .catch(function (err) {
          toast.error(`${err.response.data.message}`);
        });
    },
  });

  return (
    <Box
      sx={{
        marginTop: 8,
        display: "flex",
        justifyContent: "center", // Center both boxes horizontally
        alignItems: "center",
        height: "100vh", // Make it take up the full viewport height
        backgroundColor: "#f5f5f5", // Soft background color
        padding: "0", // Padding around the container
      }}
    >
      {/* Grid Container for Side by Side Layout */}
      <Grid2 container spacing={4} sx={{ height: "100%", maxWidth: "1200px" }}>
        {/* Banner Section */}
        <Grid2 item xs={12} md={6}>
          <Box
            sx={{
              backgroundImage: `url(${loginbanner})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              height: "100%",
              borderRadius: "10px", // Slight border radius for smooth edges
              display: "flex",
              flexDirection: "column",
              justifyContent: "center", // Center content vertically
              color: "#fff", // Text color for readability
              padding: "40px",
              boxSizing: "border-box", // Include padding in the height calculation
              borderTopLeftRadius: "10px", // Rounded corners for top left
              borderBottomLeftRadius: "10px",
            }}
          >
            <Typography variant="h1" sx={{ mb: 2, fontSize: "2.5rem" }}>
              Vegeatery
            </Typography>
            <Typography variant="h2" sx={{ mb: 2, fontSize: "1.5rem" }}>
              "Meals catered to your lifestyle"
            </Typography>

            <Typography variant="h3" sx={{ mb: 2, fontSize: "1.25rem" }}>
              Who are we?
            </Typography>
            <Typography variant="h5" sx={{ mb: 2, fontSize: "1rem" }}>
              Our plant-based business offers nutritious, customizable meals to
              meet diverse dietary needs, from vegan to gluten-free. With a
              focus on sustainability and fresh ingredients, we make healthy
              eating easy and enjoyable for everyone.
            </Typography>
          </Box>
        </Grid2>

        {/* Login Form Section */}
        <Grid2 item xs={12} md={6}>
          <Box
            sx={{
              backgroundColor: "#ffffff",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center", // Center content vertically
              borderRadius: "10px",
              boxSizing: "border-box", // Include padding in the height calculation
              borderTopRightRadius: "10px", // Rounded corners for top right
              borderBottomRightRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Light shadow for depth
              padding: "40px",
            }}
          >
            <Typography variant="h1" sx={{ my: 2, fontSize: "2rem" }}>
              Login
            </Typography>
            <Box
              component="form"
              sx={{ maxWidth: "500px", margin: "0 auto" }}
              onSubmit={formik.handleSubmit}
            >
              <TextField
                fullWidth
                margin="dense"
                autoComplete="off"
                label="Email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
              />
              <TextField
                fullWidth
                margin="dense"
                autoComplete="off"
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
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 2, padding: "10px 0", fontSize: "1rem" }}
                type="submit"
              >
                Login
              </Button>
            </Box>
          </Box>
        </Grid2>
      </Grid2>

      <ToastContainer />
    </Box>
  );
}

export default Login;
