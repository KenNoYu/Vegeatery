import React, { useState, useEffect } from "react";
import { Box, Card, CardContent, Typography, TextField, IconButton, Button, Stack, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { Star, StarBorder } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import http from "../../../http"; // Adjust the path to your http.js
import { useNavigate } from "react-router-dom";
import RoleGuard from '../../../utils/RoleGuard';

const BASE_URL = "http://localhost:7273/uploads";

const GeneralFeedback = () => {
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

    useEffect(() => {
        const fetchFeedbacks = async () => {
            if (!userId) return;
            try {
                const response = await http.get(`/GeneralFeedback/user/${userId}`);
                setFeedbacks(response.data || []);
            } catch (error) {
                console.error("Error fetching feedbacks:", error);
                setErrorMessage("Failed to fetch feedbacks. Please try again later.");
            }
        };
        fetchFeedbacks();
    }, [userId]);

    const handleDelete = async (feedbackId) => {
        try {
            if (!feedbackId || typeof feedbackId !== "number") {
                throw new Error("Invalid feedback ID.");
            }

            console.log("Attempting to delete feedback with ID:", feedbackId); // Debug
            await http.delete(`/GeneralFeedback/${feedbackId}`);
            console.log("Feedback deleted successfully."); // Debug
            // fetchFeedbacks(); // Refresh the feedback list
            setFeedbacks((prevFeedbacks) => prevFeedbacks.filter(feedback => feedback.feedbackId !== feedbackId));
        } catch (error) {
            console.error("Error deleting feedback:", error);
            setErrorMessage("Failed to delete feedback. Please ensure the feedback ID is valid and try again.");
        }
    };

    const handleEdit = (feedback) => {
        navigate(`/general-feedback/edit/${feedback.feedbackId}`);
    };

    const renderStars = (rating) => {
        const maxStars = 5;
        return [...Array(maxStars)].map((_, index) =>
            index < rating ? <Star key={index} sx={{ color: "#FFD700" }} /> : <StarBorder key={index} />
        );
    };

    return (
        <Box sx={{
            marginTop: '3em',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: '3em',
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
            <Typography variant="h4" fontWeight="bold" mt={5} >General Feedback</Typography>

            <Box mt={4} width="100%">

                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginTop: '50px', }}>
                    <Typography variant="h5" fontWeight='bold'>Past Feedback</Typography>
                    <Button
                        variant="contained"
                        sx={{
                            textTransform: 'none',
                            color: '#FFFFFF',
                            backgroundColor: '#C6487E',
                            '&:hover': {
                                backgroundColor: '#E7ABC5'
                            }
                        }}
                        onClick={() => navigate('/user/generalfeedbackadd')}
                    >
                        PROVIDE FEEDBACK
                    </Button>
                </Box>

                {feedbacks.length === 0 ? (
                    <Typography mt={2}>No general feedback has been provided yet.</Typography>
                ) : (
                    feedbacks.slice().reverse().map((feedback, index) => (
                        <Card key={feedback.feedbackId || `feedback-${index}`}
                            sx={{ marginBottom: 2, marginTop: 5, backgroundColor: "#E6F2FF" }}
                        >
                            <CardContent sx={{ marginTop: 1 }}>
                                <Stack spacing={2}>
                                    {feedback.imagePath ? (
                                        <img
                                            src={feedback.imagePath}
                                            alt="Feedback Image"
                                            style={{
                                                width: "100px",
                                                height: "100px",
                                                objectFit: "cover",
                                            }}
                                        />
                                    ) : (
                                        <Typography>No image provided</Typography>
                                    )}

                                    <Typography variant="h5" fontWeight="bold ">{feedback.feedbackTitle || "Untitled"}</Typography>
                                    <Typography>
                                        <span style={{ fontWeight: "bold" }}>Rating:</span> {renderStars(feedback.rating)}
                                    </Typography>
                                    <Typography>
                                        <span style={{ fontWeight: 'bold' }}>Review:</span> {feedback.review && feedback.review !== 'Not provided' ? feedback.review.trim() : "Not provided"}
                                    </Typography>

                                    <Box mt={2} display="flex" justifyContent="flex-end">
                                        <Button
                                            variant="outlined"
                                            sx={{
                                                textTransform: 'none',
                                                color: '#C6487E',
                                                backgroundColor: '#FFFFFF',
                                                borderColor: '#C6487E',
                                                '&:hover': {
                                                    backgroundColor: '#E7ABC5',
                                                    color: '#FFFFFF'
                                                }
                                            }}
                                            onClick={() => setOpenModal(feedback.feedbackId)}>
                                            DELETE
                                        </Button>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    ))
                )}
            </Box>

            <Dialog open={Boolean(openModal)} onClose={() => setOpenModal(null)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this feedback? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(null)} sx={{
                        textTransform: 'none',
                        color: '#C6487E',
                        backgroundColor: '#FFFFFF',
                        borderColor: '#C6487E',
                        '&:hover': {
                            backgroundColor: '#E7ABC5',
                            color: '#FFFFFF',
                        }
                    }}>CANCEL</Button>
                    <Button onClick={() => { handleDelete(openModal); setOpenModal(null); }} sx={{
                        backgroundColor: '#C6487E',
                        '&:hover': {
                            backgroundColor: '#E7ABC5'
                        }
                    }}>DELETE</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default GeneralFeedback;