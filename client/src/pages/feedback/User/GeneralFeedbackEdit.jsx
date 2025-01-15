import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, TextField, Button } from "@mui/material";
import http from "../../../http"; // Adjust the path to your http.js

const GeneralFeedbackEdit = () => {
  const { id } = useParams(); // Get the ID from the URL
  const [feedback, setFeedback] = useState({ imagePath: "", rating: 1, review: "" });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await http.get(`/GeneralFeedback/${id}`);
        setFeedback(response.data);
      } catch (error) {
        console.error("Error fetching feedback:", error);
        setErrorMessage("Failed to fetch feedback. Please try again later.");
      }
    };

    fetchFeedback();
  }, [id]);

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("FeedbackTitle", feedback.feedbackTitle);
      formData.append("Rating", feedback.rating);
      formData.append("Review", feedback.review);
      if (feedback.imagePath) {
        formData.append("ImagePath", feedback.imagePath);
      }

      await http.put(`/GeneralFeedback/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Handle success (e.g., redirect back or show a success message)
    } catch (error) {
      console.error("Error updating feedback:", error);
      setErrorMessage("Failed to update feedback. Please try again.");
    }
  };

  return (
    <Box>
      <h2>Edit Feedback</h2>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <TextField
        label="Feedback Title"
        value={feedback.feedbackTitle}
        onChange={(e) => setFeedback({ ...feedback, feedbackTitle: e.target.value })}
        fullWidth
      />
      <TextField
        label="Rating"
        type="number"
        value={feedback.rating}
        onChange={(e) => setFeedback({ ...feedback, rating: +e.target.value })}
        fullWidth
      />
      <TextField
        label="Review"
        value={feedback.review}
        onChange={(e) => setFeedback({ ...feedback, review: e.target.value })}
        fullWidth
      />
      <Button variant="contained" onClick={handleSubmit}>
        Save Changes
      </Button>
    </Box>
  );
};

export default GeneralFeedbackEdit;
