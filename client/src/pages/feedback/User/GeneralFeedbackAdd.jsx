import React, { useState, useEffect } from "react";
import { Box, Card, CardContent, Typography, TextField, IconButton, Button, Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import http from "../../../http";
import { useNavigate } from "react-router-dom";
import RoleGuard from '../../../utils/RoleGuard';

const BASE_URL = "http://localhost:7273/uploads";

const GeneralFeedbackAdd = () => {
    RoleGuard('User');

    const [feedbacks, setFeedbacks] = useState([]);
    const [form, setForm] = useState({ feedbackTitle: "", imagePath: null, rating: 1, review: "" });
    const [editId, setEditId] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [userId, setUserId] = useState(null);
    const [openModal, setOpenModal] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await http.get("/Auth/auth", { withCredentials: true });
                setUserId(response.data.user.id);
            } catch (error) {
                console.error("Error fetching user data", error);
            }
        };
        fetchUser();
    }, []);

    const handleSubmit = async () => {
        try {
            const formData = new FormData();
            formData.append("feedbackTitle", form.feedbackTitle);
            formData.append("Rating", form.rating);
            formData.append("Review", form.review);
            formData.append("userId", userId);
            if (form.imagePath && typeof form.imagePath !== "string") {
                formData.append("ImagePath", form.imagePath);
            }

            if (editId) {
                await http.put(`/GeneralFeedback/${editId}`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } else {
                await http.post("/GeneralFeedback", formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            setForm({ feedbackTitle: "", imagePath: null, rating: 1, review: "" });
            setEditId(null);
            navigate(`/user/feedback`);
        } catch (error) {
            console.error("Error submitting feedback:", error);
            setErrorMessage("Failed to submit feedback. Please try again.");
        }
    };

    const handleStarClick = (rating) => {
        setForm({ ...form, rating });
    };

    return (
        <Box sx={{
            marginTop: '5em',
            marginLeft: 'auto',
            marginRight: 'auto',
            maxWidth: 1200,
            minHeight: 500,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#FFFFFF',
            padding: '2rem',
            boxShadow: 3,
            borderRadius: 2,
            overflow: "hidden",
            overflowY: "auto",
            overflowX: "hidden",
            paddingBottom: '2rem'
        }}>
            <Typography variant="h4" fontWeight="bold" mb={2}>General Feedback</Typography>
            {errorMessage && (
                <Typography color="error" gutterBottom>
                    {errorMessage}
                </Typography>
            )}

            <Card sx={{ backgroundColor: '#E7F0FA', padding: '2rem', borderRadius: 2 }}>
                <CardContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Feedback Title"
                                value={form.feedbackTitle}
                                onChange={(e) => setForm({ ...form, feedbackTitle: e.target.value })}
                                fullWidth
                                margin="normal"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Typography variant="h6">Rating</Typography>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <IconButton
                                        key={star}
                                        onClick={() => handleStarClick(star)}
                                        sx={{ color: star <= form.rating ? "#FFD700" : "#D3D3D3" }}
                                    >
                                        {star <= form.rating ? <StarIcon /> : <StarBorderIcon />}
                                    </IconButton>
                                ))}
                            </Box>
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Review"
                                value={form.review}
                                onChange={(e) => setForm({ ...form, review: e.target.value })}
                                fullWidth
                                multiline
                                minRows={4}
                            />
                        </Grid>

                        <Grid item xs={12} display="flex" flexDirection="column" alignItems="flex-start">
                            <Button
                                variant="contained"
                                component="label"
                                sx={{
                                    marginTop: 1,
                                    width: "170px",
                                    height: "40px",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                            >
                                Upload Image
                                <input
                                    type="file"
                                    hidden
                                    accept="image/*"
                                    onChange={(e) =>
                                        setForm({ ...form, imagePath: e.target.files[0] })
                                    }
                                />
                            </Button>

                            {form.imagePath && (
                                <Box mt={2} display="flex" flexDirection="column">
                                    <img
                                        src={
                                            typeof form.imagePath === "string"
                                                ? form.imagePath
                                                : URL.createObjectURL(form.imagePath)
                                        }
                                        alt="Preview"
                                        style={{ width: "100px", height: "auto" }}
                                    />
                                    <Typography variant="body2" color="textSecondary" mt={1}>
                                        {typeof form.imagePath === "string"
                                            ? form.imagePath
                                            : URL.createObjectURL(form.imagePath)}
                                    </Typography>
                                </Box>
                            )}

                            <Grid container spacing={2} justifyContent="space-between" mt={5} >

                                <Button onClick={() => navigate('/user/feedback')} variant="contained" sx={{
                                    textTransform: 'none',
                                    color: '#C6487E',
                                    backgroundColor: '#FFFFFF',
                                    borderColor: '#C6487E',
                                    '&:hover': {
                                        backgroundColor: '#E7ABC5',
                                        color: '#FFFFFF',
                                    }
                                }}>
                                    BACK
                                </Button>

                                <Button
                                    variant="contained"
                                    onClick={() => setOpenModal(true)}
                                    sx={{
                                        color: '#FFFFFF',
                                        backgroundColor: '#C6487E',
                                        '&:hover': {
                                            backgroundColor: '#E7ABC5'
                                        }
                                    }}>
                                    SUBMIT FEEDBACK
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Confirmation Modal */}
            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                <DialogTitle>Confirm Submission</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to submit this feedback?</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(false)} sx={{
                        textTransform: 'none',
                        color: '#C6487E',
                        backgroundColor: '#FFFFFF',
                        borderColor: '#C6487E',
                        '&:hover': {
                            backgroundColor: '#E7ABC5',
                            color: '#FFFFFF',
                        }
                    }}>CANCEL</Button>
                    <Button onClick={handleSubmit} sx={{
                        backgroundColor: '#C6487E',
                        '&:hover': {
                            backgroundColor: '#E7ABC5'
                        }
                    }}>SUBMIT</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default GeneralFeedbackAdd;