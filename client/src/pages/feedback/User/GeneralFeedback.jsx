import React, { useState, useEffect } from "react";
import { Box, Card, CardContent, Typography, TextField, IconButton, Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import http from "../../../http"; // Adjust the path to your http.js
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:7273/uploads";

const GeneralFeedback = () => {
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

  useEffect(() => {
    fetchFeedbacks().catch((error) => console.error("Fetch feedbacks failed: ", error));
  }, []);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        General Feedback
      </Typography>
      {errorMessage && (
        <Typography color="error" gutterBottom>
          {errorMessage}
        </Typography>
      )}
      <Box sx={{ display: "flex", gap: 2, marginBottom: 2, flexWrap: "wrap" }}>
        <TextField
          label="Feedback Title"
          value={form.feedbackTitle}
          onChange={(e) => setForm({ ...form, feedbackTitle: e.target.value })}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Rating"
          type="number"
          value={form.rating}
          onChange={(e) => setForm({ ...form, rating: +e.target.value })}
          fullWidth
        />

        <TextField
          label="Review"
          value={form.review}
          onChange={(e) => setForm({ ...form, review: e.target.value })}
          fullWidth
        />

        <Button variant="contained" component="label">
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
          <img
            src={
              typeof form.imagePath === "string"
                ? form.imagePath
                : URL.createObjectURL(form.imagePath)
            }
            alt="Preview"
            style={{ width: "100px", height: "auto" }}
          />
        )}

        <IconButton onClick={handleSubmit}>
          {editId ? <SaveIcon /> : <SaveIcon />}
        </IconButton>

        <IconButton
          onClick={() => {
            setForm({ imagePath: null, rating: 1, review: "" });
            setEditId(null);
          }}
        >
          <CancelIcon />
        </IconButton>

      </Box>
      {feedbacks.length === 0 ? (
        <Typography>No general feedback has been provided yet.</Typography>
      ) : (
        feedbacks.map((feedback, index) => (
          <Card key={feedback.feedbackId || `feedback-${index}`}
            sx={{ marginBottom: 2 }}
          >
            <CardContent>
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

              <Typography variant="h6">{feedback.feedbackTitle || "Untitled"}</Typography>
              <Typography>Rating: {feedback.rating > 0 ? feedback.rating : "Not provided"}</Typography>
              <Typography>Review: {feedback.review && feedback.review !== 'Not provided' ? feedback.review.trim() : "Not provided"}</Typography>

              <IconButton onClick={() => handleEdit(feedback)}>
                <EditIcon />
              </IconButton>

              <IconButton onClick={() => handleDelete(feedback.feedbackId)}>
                <DeleteIcon />
              </IconButton>


            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default GeneralFeedback;
