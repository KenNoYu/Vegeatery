import React, { useState, useEffect } from "react";
import { Box, Card, CardContent, Typography, TextField, IconButton, Button, Grid } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star"; 
import StarBorderIcon from "@mui/icons-material/StarBorder"; 
import http from "../../../http"; 
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:7273/uploads";

const GeneralFeedbackAdd = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [form, setForm] = useState({ feedbackTitle: "", imagePath: null, rating: 1, review: "" });
  const [editId, setEditId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const fetchFeedbacks = async () => {
    try {
      const response = await http.get("/GeneralFeedback");
      console.log("Fetched feedbacks:", response.data); // Debug fetched data
      setFeedbacks(
        (response.data || []).map((feedback) => ({
          ...feedback,
          Review: feedback.Review || "", // Ensure Review is always a string
        }))
      );
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
      setErrorMessage("Failed to fetch feedbacks. Please try again later.");
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("feedbackTitle", form.feedbackTitle);
      formData.append("Rating", form.rating);
      formData.append("Review", form.review);

      // Ensure ImagePath is appended only if it exists and is not a string (to handle updates)
      if (form.imagePath && typeof form.imagePath !== "string") {
        formData.append("ImagePath", form.imagePath);
      }

      // Determine whether to send a POST or PUT request
      if (editId) {
        await http.put(`/GeneralFeedback/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await http.post("/GeneralFeedback", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        navigate('/feedback/user/generalfeedback');
      }

      // Reset form and reload feedback list
      setForm({ imagePath: null, rating: 1, review: "" });
      setEditId(null);
      fetchFeedbacks(); // Refresh the feedback list
    } catch (error) {
      console.error("Error submitting feedback:", error);
      setErrorMessage("Failed to submit feedback. Please try again.");
    }
  };

  const handleDelete = async (feedbackId) => {
    try {
      if (!feedbackId || typeof feedbackId !== "number") {
        throw new Error("Invalid feedback ID.");
      }

      console.log("Attempting to delete feedback with ID:", feedbackId); // Debug
      await http.delete(`/GeneralFeedback/${feedbackId}`);
      console.log("Feedback deleted successfully."); // Debug
      fetchFeedbacks(); // Refresh the feedback list
    } catch (error) {
      console.error("Error deleting feedback:", error);
      setErrorMessage("Failed to delete feedback. Please ensure the feedback ID is valid and try again.");
    }
  };


  const handleEdit = (feedback) => {
    navigate(`/general-feedback/edit/${feedback.feedbackId}`);
  };

  const handleStarClick = (rating) => {
    setForm({ ...form, rating });
  };

  useEffect(() => {
    fetchFeedbacks().catch((error) => console.error("Fetch feedbacks failed: ", error));
  }, []);

  return (
    <Box sx={{
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
      paddingBottom: '2rem',
      marginTop: '2rem'
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

              {/* Image Preview and URL */}
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

                <Button onClick={() => navigate('/feedback/user/generalfeedback')} variant="contained" sx={{
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

                <Button onClick={handleSubmit} variant="contained" sx={{
                  textTransform: 'none',
                  color: '#FFFFFF',
                  backgroundColor: '#C6487E',
                  '&:hover': { backgroundColor: '#E7ABC5' }
                }}>
                  SUBMIT FEEDBACK
                </Button>

              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default GeneralFeedbackAdd;
