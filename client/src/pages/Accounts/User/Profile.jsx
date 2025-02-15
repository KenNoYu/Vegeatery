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
} from "@mui/material";
import { styled } from "@mui/system";
import http from "../../../http";
import UserContext from "../../../contexts/UserContext";
import { UserProvider } from "../../../contexts/UserContext";
import { WindowSharp } from "@mui/icons-material";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import Sidebar from "./UserSidebar";
import CircularProgress from "@mui/material/CircularProgress";
import { Link } from "react-router-dom";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import RoleGuard from "../../../utils/RoleGuard";

// Styling for the custom components
const ProfileBox = styled(Box)(({ theme }) => ({
  marginLeft: "240px",
  width: "100%",
  height: "100%",
  flexGrow: 1,
  paddingTop: "3em",
  paddingRight: "3em",
  backgroundColor: "#FFFFFF",
}));

const ProfileImage = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(12),
  height: theme.spacing(12),
  marginBottom: theme.spacing(2),
}));

const ProfileDetailsBox = styled(Box)(({ theme }) => ({
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
  profileImage: yup.string().nullable().notRequired(),
  username: yup
    .string()
    .trim()
    .min(8, "Username must be at least 8 characters")
    .max(20, "Username must be at most 20 characters")
    .matches(
      /^[a-zA-Z0-9_-]+$/,
      "Username can only contain letters, numbers, underscores, and hyphens"
    ),
  email: yup
    .string()
    .trim()
    .email("Enter a valid email")
    .max(50, "Email must be at most 50 characters"),
  dob: yup
    .date()
    .max(new Date(), "Date of birth must be in the past"),
  contact: yup
    .string()
    .trim()
    .matches(/^\d{8}$/, "Contact number must be 8 digits long"), // Example: 10 digits for illustration
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

export default function ProfilePage() {
  RoleGuard(["User", "Admin", "Staff"]);
  const [imageFile, setImageFile] = useState(null);
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState({
    profileImage: "",
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
      const response = await http.get("/Auth/current-user", {
        withCredentials: true,
      });

      const userData = response.data;
      setUser({
        profileImage: userData.imageFile,
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
  
  // Use useEffect to fetch user info when the component loads
  useEffect(() => {
    http
      .get("/Auth/auth", { withCredentials: true })
      .then((res) => {
        setUserId(res.data.user.id);
      })
      .catch((err) => {
        console.error("Error fetching user data", err);
      });
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

  const onFileChange = (e) => {
    let file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024) {
        toast.error('Maximum file size is 1MB');
        return;
      }

      let formData = new FormData();
      formData.append('file', file);
      http.post('/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then((res) => {
          setImageFile(res.data.filename);
        })
        .catch(function (error) {
          console.log(error.response);
        });
    }
  };

  // Handle save profile - Axios PUT request
  const handleSaveProfile = async () => {
    const updateUserDto = {
      profileImage: imageFile || null,
      username: user.username,
      email: user.email,
      dob: user.dob,
      contact: user.mobile,
      gender: user.gender,
      diet: user.dietaryPreference,
      allergy: user.allergyInfo,
      meal: user.mealTypes,
    };
    
    try {
      await updateProfileSchema.validate(updateUserDto, {
        abortEarly: false,
      });

      http
      .put(`/Account/${userId}`, updateUserDto)
      .then((response) => {
        console.log("Profile updated successfully:", response.data.message);
        alert("Profile updated successfully!");
        setIsEditing(false); // Disable edit mode after saving
        window.location = "/user/profile";
      })
      .catch((error) => {
        console.error("Error updating profile:", error);
        alert("Error updating profile, please try again.");
      });
    } catch (error) {
      if (error.inner) {
        error.inner.forEach((err) => {
          console.error(`${error.path}: ${err.message}`);
        });
      } else {
        console.error("Unknown error:", error);
      }
    } 
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

      console.log("Account deleted successfully:", response.data.message);

      // Logout the user after deleting the account
      http
        .post("/auth/logout", {}, { withCredentials: true })
        .then((res) => {
          console.log(res.data.message);
          window.location = "/";
        })
        .catch((err) => {
          console.error("Error during logout", err);
        });

      // Handle successful deletion (e.g., redirect to login page)
      alert("Your account has been deleted successfully.");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Error deleting your account, please try again.");
    }
  };

  const StyledTierName = styled(Typography)(({ theme, tierColor }) => ({
    textTransform: "uppercase",
    fontWeight: "bold",
    textShadow: `2px 2px 4px rgba(0, 0, 0, 0.2)`,
    letterSpacing: "0.1em",
    color: tierColor,
  }));

  const TierDisplay = ({ tierName }) => {
    const getTierColor = (tier) => {
      switch (tier?.toLowerCase()) {
        case "bronze":
          return "#CD7F32"; // Bronze hex code
        case "silver":
          return "#C0C0C0"; // Silver hex code
        case "gold":
          return "#FFD700"; // Gold hex code
        default:
          return "textSecondary";
      }
    };

    const tierColor = getTierColor(tierName);

    return (
      <StyledTierName variant="h5" tierColor={tierColor} gutterBottom>
        {tierName}
      </StyledTierName>
    );
  };

  return (
    <Box sx={{ display: "flex", height: "100%", marginTop: "2em", width: "100%" }}>
      <Sidebar />
      <ProfileBox>
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
                  src={imageFile ? `${import.meta.env.VITE_FILE_BASE_URL}${imageFile}` : `${import.meta.env.VITE_FILE_BASE_URL}${user.profileImage}`}
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
                  <div> {/* Added a wrapping div */}
                    <Button variant="contained" component="label" sx={{fontWeight: "bold"}}>
                      Upload Image
                      <input hidden accept="image/*" multiple type="file" onChange={onFileChange} />
                    </Button>
                  </div> // Close the wrapping div
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
                <TierDisplay tierName={user.tierName} />
                <Typography variant="h3" fontWeight="bold" gutterBottom>
                  {user.username}
                </Typography>
                <Typography
                  variant="subtitle2"
                  sx={{
                    width: "fit-content",
                    backgroundColor: "#007BFF",
                    color: "white",
                    borderRadius: "12px",
                    padding: "4px 12px",
                    display: "inline-block",
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
            <ProfileDetailsBox sx={{
              width: "90%",
              marginLeft: "auto",
              marginRight: "auto"
            }}>
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
              </ProfileSection>

              <ProfileSection>
                <Typography variant="h6" fontWeight="bold">
                  Gender
                </Typography>
                <RadioGroup
                  row
                  name="gender"
                  value={user.gender || "prefer_not_say"}
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
