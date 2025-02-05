import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Avatar,
  Input,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
} from "@mui/material";
import { styled } from "@mui/system";
import http from "../../../http";
import UserContext from "../../../contexts/UserContext";
import { UserProvider } from "../../../contexts/UserContext";
import { WindowSharp } from "@mui/icons-material";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import CircularProgress from "@mui/material/CircularProgress";
import { Link, Navigate } from "react-router-dom";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { useParams } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import { useNavigate } from "react-router-dom";

// Styling for the custom components
const ProfileBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  backgroundColor: "#f9f9f9",
  marginTop: "0.3em",
}));

const ProfileImage = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(12),
  height: theme.spacing(12),
  marginBottom: theme.spacing(2),
}));

const ProfileDetailsBox = styled(Box)(({ theme }) => ({
  width: "100%",
  maxWidth: "800px",
  marginTop: theme.spacing(3),
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.1)",
  padding: theme.spacing(4),
}));

const ProfileSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const EditButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#C6487E",
  color: "#fff",
  width: "100%",
  marginBottom: theme.spacing(2),
  "&:hover": {
    backgroundColor: "#A83866",
  },
}));

const updateProfileSchema = yup.object().shape({
  username: yup
    .string()
    .trim()
    .min(8, "Username must be at least 8 characters")
    .max(20, "Username must be at most 20 characters")
    .matches(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, underscores, and hyphens"
    )
    .required("Username is required"),
  email: yup
    .string()
    .trim()
    .email("Enter a valid email")
    .max(50, "Email must be at most 50 characters")
    .required("Email is required"),
  dob: yup
    .date()
    .required("Date of birth is required")
    .max(new Date(), "Date of birth must be in the past"),
  contact: yup
    .string()
    .trim()
    .matches(/^\d{10}$/, "Contact number must be 10 digits long") // Example: 10 digits for illustration
    .required("Contact number is required"),
  gender: yup.string(), // Optional field, so no validation required
  diet: yup.string(), // Optional field, so no validation required
  allergy: yup
    .string()
    .max(100, "Allergy info should not exceed 100 characters")
    .matches(
      /^[a-zA-Z0-9.,\s-]*$/,
      "Allergy info can only contain letters, numbers, periods, commas, spaces, and hyphens"
    ),
  meal: yup.string(), // Optional field, so no validation required
});

export default function UserProfileView() {
  const navigate = useNavigate();
  const { userId } = useParams();
  console.log(userId);
  const [user, setUser] = useState({
    username: "",
    email: "",
    mobile: "",
    dob: "",
    dietaryPreference: "",
    allergyInfo: "",
    mealTypes: "",
    gender: "",
  });
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state

  // Function to fetch the user info from the API
  const fetchUserInfo = async () => {
    try {
      const response = await http.get(`/Account/${userId}`, {
        withCredentials: true,
      });
      console.log("Ran");
      const userData = response.data;
      console.log(userData);
      setUser({
        username: userData.username,
        email: userData.email,
        mobile: userData.contactNumber,
        dob: userData.dateofBirth,
        dietaryPreference: userData.dietPreference,
        allergyInfo: userData.allergyInfo,
        mealTypes: userData.mealTypes,
        gender: userData.gender,
        roleName: userData.roleName,
        tierName: userData.tierName,
        createdAt: userData.createdAt,
      });

      setLoading(false); // Once data is fetched, loading is false
    } catch (error) {
      setError("Failed to fetch user data");
      setLoading(false);
    }
  };
  console.log(user);

  // Load the fetched user data on component mount
  useEffect(() => {
    fetchUserInfo();
    setLoading(false);
  }, []);

  const [isEditing, setIsEditing] = useState(false);

  // Toggle edit mode
  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // Handle save profile - Axios PUT request
  const handleSaveProfile = () => {
    const updateUserDto = {
      username: user.username,
      email: user.email,
      dob: user.dob,
      contact: user.mobile,
      gender: user.gender,
      diet: user.dietaryPreference,
      allergy: user.allergyInfo,
      meal: user.mealTypes,
    };
    const validationErrors = updateProfileSchema.validate(updateUserDto, {
      abortEarly: false,
    });

    if (validationErrors.error) {
      // Handle validation errors, e.g., display them to the user
      console.error(validationErrors.error);
      return;
    }

    http
      .put(`/Account/${userId}`, updateUserDto)
      .then((response) => {
        console.log("Profile updated successfully:", response.data.message);
        alert("Profile updated successfully!");
        setIsEditing(false); // Disable edit mode after saving
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        alert("Error updating profile, please try again.");
      });
  };

  const handleDeleteAccount = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete your account? This action is irreversible."
    );
    if (!confirm) return;

    try {
      const response = await http.delete(`/Account/${userId}`, {
        withCredentials: true,
      });

      // Handle successful deletion (e.g., redirect to login page)
      alert("Account has been deleted successfully.");
      navigate("/admin/accounts");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Error deleting your account, please try again.");
    }
  };

  return (
    <Box sx={{ display: "flex", height: "100%", marginTop: "2em" }}>
      {/* Sidebar */}
      <Box sx={{ height: "100%" }}>
        <AdminSidebar />
      </Box>
      <ProfileBox sx={{ paddingRight: "3em" }}>
        {loading ? (
          <Typography variant="body1">Loading profile...</Typography>
        ) : error ? (
          <Typography variant="body1" color="error">
            Error fetching profile: {error}
          </Typography>
        ) : userId ? (
          <>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                width: "100%",
                padding: 3,
              }}
            >
              {/* 1st Column: Profile Image and Upload Image Button */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: 2,
                  textAlign: "center",
                  borderRight: 2,
                  borderColor: "divider",
                }}
              >
                <ProfileImage
                  alt={user.username}
                  src="/path-to-default-avatar.png"
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    marginBottom: 2,
                    border: "4px solid #fff",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                  }}
                />

                {isEditing && (
                  <Button
                    sx={{
                      backgroundColor: "green",
                      color: "white",
                      padding: 1,
                      borderRadius: "5%",
                      "&:hover": {
                        backgroundColor: "darkgreen",
                      },
                      marginTop: 2,
                    }}
                  >
                    <AddPhotoAlternateIcon />
                    Change Profile
                  </Button>
                )}
              </Box>

              {/* 2nd Column: Membership Info */}
              <Box
                sx={{
                  flex: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  paddingLeft: 3,
                  textAlign: "left",
                }}
              >
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                  {user.username}
                </Typography>
                <Typography variant="h5" color="textSecondary" gutterBottom>
                  BRONZE
                  {/* Membership Tier: {user.membershipTier} */}
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{
                    width: "fit-content",
                    backgroundColor: "#007BFF", // A stronger blue color
                    color: "white",
                    borderRadius: "12px",
                    padding: "4px 12px",
                    display: "inline-block", // To make sure the background wraps tightly around the text
                    marginBottom: 3,
                  }}
                >
                  {user.roleName}
                </Typography>

                <Typography variant="subtitle2" color="textSecondary">
                  Joined on{" "}
                  {new Date(user.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </Typography>
                {/* <Typography variant="subtitle2" color="textSecondary">
                  Expires: {user.membershipExpiration}
                </Typography> */}
              </Box>

              {/* 3rd Column: Edit and Delete Profile Buttons */}
              <Box
                sx={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 2,
                  marginTop: 3,
                }}
              >
                <EditButton onClick={handleEditClick}>
                  {isEditing ? "Cancel" : "Edit Profile"}
                </EditButton>

                <Button
                  onClick={handleDeleteAccount}
                  variant="outlined"
                  color="error"
                  sx={{
                    width: "100%",
                    borderColor: "error.main",
                    color: "error.main",
                    "&:hover": {
                      backgroundColor: "red",
                      color: "white",
                    },
                  }}
                >
                  Delete Profile
                </Button>
              </Box>
            </Box>

            {/* Personal Details Section */}
            <ProfileDetailsBox sx={{ marginLeft: 2 }}>
              <ProfileSection>
                <Typography variant="h6" fontWeight="bold">
                  Personal Details
                </Typography>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={user.username}
                  onChange={handleInputChange}
                  margin="normal"
                  disabled={!isEditing}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused": {
                        fieldset: {
                          borderColor: "#C6487E !important", // Keep your border color
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
                  label="Email Address"
                  name="email"
                  type="email"
                  value={user.email}
                  onChange={handleInputChange}
                  margin="normal"
                  disabled={!isEditing}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused": {
                        fieldset: {
                          borderColor: "#C6487E !important", // Keep your border color
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
                  label="Mobile Number"
                  name="mobile"
                  value={user.mobile}
                  onChange={handleInputChange}
                  margin="normal"
                  disabled={!isEditing}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused": {
                        fieldset: {
                          borderColor: "#C6487E !important", // Keep your border color
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
                  label="Date of Birth"
                  name="dob"
                  value={new Date(user.dob).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                  onChange={handleInputChange}
                  margin="normal"
                  disabled={!isEditing}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused": {
                        fieldset: {
                          borderColor: "#C6487E !important", // Keep your border color
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
              </ProfileSection>

              <ProfileSection>
                <Typography variant="h6" fontWeight="bold">
                  Gender
                </Typography>
                <RadioGroup
                  row
                  name="gender"
                  value={user.gender}
                  onChange={handleInputChange}
                  sx={{
                    "& .MuiRadio-root": {
                      // Target all Radio components within the RadioGroup
                      color: "inherit", // Default color (usually gray)
                    },
                    "& .MuiRadio-root.Mui-checked": {
                      // Target checked Radio components
                      color: "#C6487E !important", // Your desired checked color
                    },
                  }}
                >
                  <FormControlLabel
                    value="Male"
                    control={<Radio />}
                    label="Male"
                    disabled={!isEditing}
                  />
                  <FormControlLabel
                    value="Female"
                    control={<Radio />}
                    label="Female"
                    disabled={!isEditing}
                  />
                  <FormControlLabel
                    value="Others"
                    control={<Radio />}
                    label="Others"
                    disabled={!isEditing}
                  />
                  <FormControlLabel
                    value="Prefer not to say"
                    control={<Radio />}
                    label="Prefer not to say"
                    disabled={!isEditing}
                  />
                </RadioGroup>
              </ProfileSection>
              <hr
                style={{
                  borderTop: "1px solid lightgrey",
                  marginTop: "2em",
                  marginBottom: "2em",
                }}
              ></hr>
              {/* Dietary Details Section */}
              <ProfileSection>
                <Typography variant="h6" fontWeight="bold">
                  Dietary Details
                </Typography>
                <TextField
                  fullWidth
                  label="Dietary Preference"
                  name="dietaryPreference"
                  value={user.dietaryPreference}
                  onChange={handleInputChange}
                  margin="normal"
                  disabled={!isEditing}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused": {
                        fieldset: {
                          borderColor: "#C6487E !important", // Keep your border color
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
                  label="Allergy Info"
                  name="allergyInfo"
                  value={user.allergyInfo}
                  onChange={handleInputChange}
                  margin="normal"
                  disabled={!isEditing}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused": {
                        fieldset: {
                          borderColor: "#C6487E !important", // Keep your border color
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
                  label="Meal Types"
                  name="mealTypes"
                  value={user.mealTypes}
                  onChange={handleInputChange}
                  margin="normal"
                  disabled={!isEditing}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused": {
                        fieldset: {
                          borderColor: "#C6487E !important", // Keep your border color
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
              </ProfileSection>

              {/* Save Button */}
              {isEditing && (
                <Box textAlign="right">
                  <EditButton onClick={handleSaveProfile}>
                    Save Profile
                  </EditButton>
                </Box>
              )}
            </ProfileDetailsBox>
          </>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <CircularProgress sx={{ marginRight: 2 }} />
            <Typography variant="body1">No user data available.</Typography>
          </Box>
        )}
      </ProfileBox>
    </Box>
  );
}
