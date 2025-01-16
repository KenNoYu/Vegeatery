import React, { useState, useEffect } from 'react';
import { Box, Button, TextField, RadioGroup, FormControlLabel, Radio, Typography, Avatar, Input } from '@mui/material';
import { styled } from '@mui/system';
import http from '../http';
import UserContext from '../contexts/UserContext'
import { UserProvider } from '../contexts/UserContext'
import { WindowSharp } from '@mui/icons-material';
import * as yup from 'yup';
import { ToastContainer, toast } from "react-toastify";

// Styling for the custom components
const ProfileBox = styled(Box)(({ theme }) => ({
    padding: theme.spacing(4),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}));

const ProfileImage = styled(Avatar)(({ theme }) => ({
    width: theme.spacing(12),
    height: theme.spacing(12),
    marginBottom: theme.spacing(2),
}));

const ProfileDetailsBox = styled(Box)(({ theme }) => ({
    width: '100%',
    maxWidth: '800px',
    marginTop: theme.spacing(3),
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.1)',
    padding: theme.spacing(4),
}));

const ProfileSection = styled(Box)(({ theme }) => ({
    marginBottom: theme.spacing(4),
}));

const EditButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#C6487E',
    color: '#fff',
    marginLeft: theme.spacing(2),
    '&:hover': {
        backgroundColor: '#A83866',
    },
}));

const updateProfileSchema = yup.object().shape({
    username: yup
      .string()
      .trim()
      .min(8, 'Username must be at least 8 characters')
      .max(20, 'Username must be at most 20 characters')
      .matches(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens')
      .required('Username is required'),
    email: yup
      .string()
      .trim()
      .email('Enter a valid email')
      .max(50, 'Email must be at most 50 characters')
      .required('Email is required'),
    dob: yup
      .date()
      .required('Date of birth is required')
      .max(new Date(), 'Date of birth must be in the past'),
    contact: yup
      .string()
      .trim()
      .matches(/^\d{10}$/, 'Contact number must be 10 digits long') // Example: 10 digits for illustration
      .required('Contact number is required'),
    gender: yup.string(), // Optional field, so no validation required
    diet: yup.string(), // Optional field, so no validation required
    allergy: yup
      .string()
      .max(100, 'Allergy info should not exceed 100 characters')
      .matches(/^[a-zA-Z0-9.,\s-]*$/, 'Allergy info can only contain letters, numbers, periods, commas, spaces, and hyphens'),
    meal: yup.string(), // Optional field, so no validation required
  });

export default function ProfilePage() {
    const [userId, setUserId] = useState(null);
    const [user, setUser] = useState({
        username: '',
        email: '',
        mobile: '',
        dob: '',
        dietaryPreference: '',
        allergyInfo: '',
        mealTypes: '',
        gender: '',
    });
    const [loading, setLoading] = useState(true); // Add loading state
    const [error, setError] = useState(null);  // Add error state

    // Function to fetch the user info from the API
    const fetchUserInfo = async () => {
        try {
            const response = await http.get('/Auth/current-user', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}` // Assuming you store the JWT token in localStorage
                }
            });

            const userData = response.data;
            console.log(response.data);
            setUser({
                username: userData.username,
                email: userData.email,
                mobile: userData.contactNumber,
                dob: userData.dateofBirth,
                dietaryPreference: userData.dietPreference,
                allergyInfo: userData.allergyInfo,
                mealTypes: userData.mealTypes,
                gender: userData.gender,
            });
            console.log(user.dietaryPreference);

            setLoading(false);  // Once data is fetched, loading is false
        } catch (error) {
            setError('Failed to fetch user data');
            setLoading(false);
        }
    };

    // Use useEffect to fetch user info when the component loads
    useEffect(() => {
        if (localStorage.getItem("accessToken")) {
            http
                .get("/Auth/auth")
                .then((res) => {
                    setUserId(res.data.user.id);
                })
                .catch((err) => {
                    console.error("Error fetching user data", err);
                });
        }
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
        }
        const validationErrors = updateProfileSchema.validate(updateUserDto, { abortEarly: false});

        if (validationErrors.error) {
            // Handle validation errors, e.g., display them to the user
            console.error(validationErrors.error);
            return;
          }
        
        http.put(`/Account/${userId}`, updateUserDto)
            .then(response => {
                console.log('Profile updated successfully:', response.data.message);
                alert('Profile updated successfully!');
                setIsEditing(false); // Disable edit mode after saving
            })
            .catch(error => {
                console.error('Error updating profile:', error);
                alert('Error updating profile, please try again.');
            });
    };

    const handleDeleteAccount = async () => {
        const confirm = window.confirm('Are you sure you want to delete your account? This action is irreversible.');
        if (!confirm) return;

        try {
            const response = await http.delete(`/Account/${userId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}` // Assuming you store the JWT token in localStorage
                }
            });

            console.log('Account deleted successfully:', response.data.message);
            window.location = "/login";
            // Handle successful deletion (e.g., redirect to login page)
            alert('Your account has been deleted successfully.');
        } catch (error) {
            console.error('Error deleting account:', error);
            alert('Error deleting your account, please try again.');
        }
    };

    const DeleteAccountButton = ({ userId }) => {
        return (
            <Button variant="contained" color="error" onClick={handleDeleteAccount}>
                Delete Account
            </Button>
        );
    };

    

    return (
        <ProfileBox>
            {loading ? (
                <Typography variant="body1">Loading profile...</Typography>
            ) : error ? (
                <Typography variant="body1" color="error">
                    Error fetching profile: {error}
                </Typography>
            ) : userId ? (
                <>
                    {/* Profile Image */}
                    <ProfileImage
                        alt={user.username}
                        src="/path-to-default-avatar.png" // Default avatar
                    />
                    <Typography variant="h5" fontWeight="bold">{user.username}</Typography>
                    <Typography variant="subtitle1" color="textSecondary">Joined Since 14 October 2023</Typography>
                    <EditButton onClick={handleEditClick}>
                        {isEditing ? 'Cancel' : 'Edit Profile'}
                    </EditButton>
                    {/* Personal Details Section */}
                    <ProfileDetailsBox>
                        <ProfileSection>
                            <Typography variant="h6" fontWeight="bold">Personal Details</Typography>
                            <TextField
                                fullWidth
                                label="Username"
                                name="username"
                                value={user.username}
                                onChange={handleInputChange}
                                margin="normal"
                                disabled={!isEditing}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&.Mui-focused': {
                                            fieldset: {
                                                borderColor: '#C6487E !important',
                                            },
                                            '& legend': {
                                                color: '#C6487E !important',
                                            },
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
                                    '& .MuiOutlinedInput-root': {
                                        '&.Mui-focused': {
                                            fieldset: {
                                                borderColor: '#C6487E !important',
                                            },
                                            '& legend': {
                                                color: '#C6487E !important',
                                            },
                                        },
                                    },
                                }} />
                            <TextField
                                fullWidth
                                label="Mobile Number"
                                name="mobile"
                                value={user.mobile}
                                onChange={handleInputChange}
                                margin="normal"
                                disabled={!isEditing}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&.Mui-focused': {
                                            fieldset: {
                                                borderColor: '#C6487E !important',
                                            },
                                            '& legend': {
                                                color: '#C6487E !important',
                                            },
                                        },
                                    },
                                }} />
                            <TextField
                                fullWidth
                                label="Date of Birth"
                                name="dob"
                                value={user.dob}
                                onChange={handleInputChange}
                                margin="normal"
                                disabled={!isEditing}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&.Mui-focused': {
                                            fieldset: {
                                                borderColor: '#C6487E !important',
                                            },
                                            '& legend': {
                                                color: '#C6487E !important',
                                            },
                                        },
                                    },
                                }} />
                        </ProfileSection>

                        <ProfileSection>
                            <Typography variant="h6" fontWeight="bold">Gender</Typography>
                            <RadioGroup
                                row
                                name="gender"
                                value={user.gender} // This binds the current gender to the radio buttons
                                onChange={handleInputChange} // This updates the gender when a different radio button is selected
                            >
                                <FormControlLabel value="male" control={<Radio />} label="Male" disabled={!isEditing} sx={{
                                    '& .MuiRadio-root': {
                                        color: user.gender === 'male' ? '#C6487E' : 'inherit',
                                    },
                                }} />
                                <FormControlLabel value="female" control={<Radio />} label="Female" disabled={!isEditing} sx={{
                                    '& .MuiRadio-root': {
                                        color: user.gender === 'female' ? '#C6487E' : 'inherit',
                                    },
                                }} />
                                <FormControlLabel value="others" control={<Radio />} label="Others" disabled={!isEditing} sx={{
                                    '& .MuiRadio-root': {
                                        color: user.gender === 'others' ? '#C6487E' : 'inherit',
                                    },
                                }} />
                                <FormControlLabel value="prefer_not_say" control={<Radio />} label="Prefer not to say" disabled={!isEditing} sx={{
                                    '& .MuiRadio-root': {
                                        color: user.gender === 'prefer_not_say' ? '#C6487E' : 'inherit',
                                    },
                                }} />
                            </RadioGroup>
                        </ProfileSection>

                        {/* Dietary Details Section */}
                        <ProfileSection>
                            <Typography variant="h6" fontWeight="bold">Dietary Details</Typography>
                            <TextField
                                fullWidth
                                label="Dietary Preference"
                                name="dietaryPreference"
                                value={user.dietaryPreference}
                                onChange={handleInputChange}
                                margin="normal"
                                disabled={!isEditing}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&.Mui-focused': {
                                            fieldset: {
                                                borderColor: '#C6487E !important',
                                            },
                                            '& legend': {
                                                color: '#C6487E !important',
                                            },
                                        },
                                    },
                                }} />
                            <TextField
                                fullWidth
                                label="Allergy Info"
                                name="allergyInfo"
                                value={user.allergyInfo}
                                onChange={handleInputChange}
                                margin="normal"
                                disabled={!isEditing}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&.Mui-focused': {
                                            fieldset: {
                                                borderColor: '#C6487E !important',
                                            },
                                            '& legend': {
                                                color: '#C6487E !important',
                                            },
                                        },
                                    },
                                }} />
                            <TextField
                                fullWidth
                                label="Meal Types"
                                name="mealTypes"
                                value={user.mealTypes}
                                onChange={handleInputChange}
                                margin="normal"
                                disabled={!isEditing}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        '&.Mui-focused': {
                                            fieldset: {
                                                borderColor: '#C6487E !important',
                                            },
                                            '& legend': {
                                                color: '#C6487E !important',
                                            },
                                        },
                                    },
                                }} />
                        </ProfileSection>

                        {/* Save Button */}
                        {isEditing && (
                            <Box textAlign="right">
                                <EditButton onClick={handleSaveProfile}>Save Profile</EditButton>
                                <DeleteAccountButton userId={userId} />
                            </Box>
                        )}
                    </ProfileDetailsBox>
                </>
            ) : (
                <Typography variant="body1">No user data available.</Typography>
            )}
        </ProfileBox>
    );

}
