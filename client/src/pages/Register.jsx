import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormControl,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import http from "../http";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Register() {
  const navigate = useNavigate();

  // Meal types options
  const mealTypes = [
    "Vegetarian",
    "Vegan",
    "Non-Vegetarian",
    "Gluten-Free",
    "Keto",
    "Other",
  ];
  const dietPreference = [
    "Vegetarian",
    "Vegan",
    "Non-Vegetarian",
    "Gluten-Free",
    "Keto",
    "Other",
  ];

  const formik = useFormik({
    initialValues: {
      username: '',
  password: '',
  email: '',
  dob: '',
  contact: '',
  gender: '',
  diet: '',
  allergy: '',
  meal: '',
  promotions: false,
  agreement: false,
    },
    validationSchema: yup.object({
      username: yup
        .string()
        .trim()
        .min(3, "Name must be at least 3 characters")
        .max(50, "Name must be at most 50 characters")
        .required("Name is required")
        .matches(
          /^[a-zA-Z '-,.]+$/,
          "Name can only contain letters, spaces, and characters: ' - , ."
        ),
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
        .required("Password is required")
        .matches(
          /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/,
          "Password must contain at least 1 letter and 1 number"
        ),
      confirmPassword: yup
        .string()
        .trim()
        .required("Confirm password is required")
        .oneOf([yup.ref("password")], "Passwords must match"),
      gender: yup.string().required("Gender is required"),
      dateOfBirth: yup.date().required("Date of birth is required"),
      contactNumber: yup
        .string()
        .trim()
        .matches(/^\d+$/, "Contact number must only contain numbers")
        .required("Contact number is required"),
      dietPreference: yup.string().required("Diet preference is required"),
      allergyInfo: yup
        .string()
        .max(100, "Allergy info should not exceed 100 characters"),
      mealType: yup.string().required("Meal type is required"),
      receivePromotions: yup.boolean(),
      agreement: yup
        .boolean()
    }),
    onSubmit: (data) => {
      data.username = data.username.trim();
      data.email = data.email.trim().toLowerCase();
      data.password = data.password.trim();
      data.confirmPassword = data.confirmPassword.trim();
      data.contactNumber = data.contactNumber.trim();
      data.dateOfBirth = new Date(data.dateOfBirth).toISOString();
      data.dietPreference = data.dietPreference.trim();
      data.allergyInfo = data.allergyInfo.trim();
      data.mealType = data.mealType.trim();
      data.receivePromotions = data.receivePromotions;
      data.agreement = data.agreement;
      data.gender = data.gender;
      http
        .post("/Auth/register", data)
        .then((res) => {
          console.log(res.data);
          navigate("/overview");
        })
        .catch((err) => {
          toast.error(`${err.response.data.message}`);
        });
    },
  });

  return (
    <Box
      sx={{
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Typography variant="h5" sx={{ my: 2 }}>
        Register
      </Typography>
      <Box
        component="form"
        sx={{ maxWidth: "500px" }}
        onSubmit={formik.handleSubmit}
      >
        {/* Name */}
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Username"
          name="username"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={formik.touched.username && formik.errors.username}
        />

        {/* Email */}
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

        {/* Password */}
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
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />

        {/* Confirm Password */}
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.confirmPassword &&
            Boolean(formik.errors.confirmPassword)
          }
          helperText={
            formik.touched.confirmPassword && formik.errors.confirmPassword
          }
        />
        {/* Gender */}
        <TextField
          fullWidth
          margin="dense"
          select
          label="Gender"
          name="gender"
          value={formik.values.gender}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.gender && Boolean(formik.errors.gender)}
          helperText={formik.touched.gender && formik.errors.gender}
        >
          <MenuItem value="Male">Male</MenuItem>
          <MenuItem value="Female">Female</MenuItem>
          <MenuItem value="Others">Others</MenuItem>
          <MenuItem value="Prefer not to say">Prefer not to say</MenuItem>
        </TextField>
        {/* Date of Birth */}
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Date of Birth"
          name="dateOfBirth"
          type="date"
          value={formik.values.dateOfBirth}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          InputLabelProps={{ shrink: true }}
          error={
            formik.touched.dateOfBirth && Boolean(formik.errors.dateOfBirth)
          }
          helperText={formik.touched.dateOfBirth && formik.errors.dateOfBirth}
        />

        {/* Contact Number */}
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Contact Number"
          name="contactNumber"
          value={formik.values.contactNumber}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.contactNumber && Boolean(formik.errors.contactNumber)
          }
          helperText={
            formik.touched.contactNumber && formik.errors.contactNumber
          }
        />
        {/* Diet Preference */}
        <TextField
          select
          fullWidth
          margin="dense"
          label="Diet Preference"
          name="dietPreference"
          value={formik.values.dietPreference}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.dietPreference &&
            Boolean(formik.errors.dietPreference)
          }
          helperText={
            formik.touched.dietPreference && formik.errors.dietPreference
          }
        >
          {dietPreference.map((diet, index) => (
            <MenuItem key={index} value={diet}>
              {diet}
            </MenuItem>
          ))}
        </TextField>
        {/* Allergy Info */}
        <TextField
          fullWidth
          margin="dense"
          autoComplete="off"
          label="Allergy Info (Optional)"
          name="allergyInfo"
          value={formik.values.allergyInfo}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={
            formik.touched.allergyInfo && Boolean(formik.errors.allergyInfo)
          }
          helperText={formik.touched.allergyInfo && formik.errors.allergyInfo}
        />

        {/* Meal Type */}
        <TextField
          select
          fullWidth
          margin="dense"
          label="Meal Type"
          name="mealType"
          value={formik.values.mealType}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.mealType && Boolean(formik.errors.mealType)}
          helperText={formik.touched.mealType && formik.errors.mealType}
        >
          {mealTypes.map((meal, index) => (
            <MenuItem key={index} value={meal}>
              {meal}
            </MenuItem>
          ))}
        </TextField>

        {/* Receive Promotions */}
        <FormControlLabel
          control={
            <Checkbox
              name="receivePromotions"
              checked={formik.values.receivePromotions}
              onChange={(e) => {
                formik.setFieldValue("receivePromotions", e.target.checked);
                formik.setFieldTouched("receivePromotions", true); // Trigger touched
              }}
              onBlur={formik.handleBlur}
            />
          }
          label="Receive Email Promotions"
        />
        {/* Agreement to Terms */}
        <FormControlLabel
          control={
            <Checkbox
              name="agreement"
              checked={formik.values.agreement}
              onChange={(e) => {
                formik.setFieldValue("agreement", e.target.checked);
                formik.setFieldTouched("agreement", true); // Trigger touched
              }}
            />
          }
          label="I agree to the terms & policy"
        />
        {formik.touched.agreement && formik.errors.agreement && (
          <Typography color="error">{formik.errors.agreement}</Typography>
        )}

        {/* Submit Button */}
        <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">
          Register
        </Button>
      </Box>

      <ToastContainer />
    </Box>
  );
}

export default Register;
