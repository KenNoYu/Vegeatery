import React, { useState, useEffect } from "react";
import { Box, Button, List, ListItem, ListItemText, Paper } from "@mui/material";
import http from "../../../http"; // Adjust the path to your http.js

const AdminGeneralFeedback = () => {
  const [feedbackList, setFeedbackList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await http.get(`/GeneralFeedback`);
        setFeedbackList(response.data);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
        setErrorMessage("Failed to fetch feedbacks. Please try again later.");
      }
    };

    fetchFeedbacks();
  }, []);

  return (
    <Box sx={{ padding: 4 }}>
      <h2>User Feedback</h2>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <List sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {feedbackList.map((feedback) => (
          <Paper
            key={feedback.id}
            elevation={3}
            sx={{
              padding: 2,
              borderRadius: 2,
              backgroundColor: "#f9f9f9",
              border: "1px solid #ddd",
            }}
          >
            <ListItem disablePadding>
            <ListItemText
                primary={`Title: ${feedback.feedbackTitle}`}
                secondary={
                  <>
                    <p>{`Rating: ${feedback.rating}`}</p>
                    <p>{feedback.review}</p>
                  </>
                }
                sx={{ marginRight: 2 }}
              />
              <Button
                variant="outlined"
                onClick={() => console.log(`Write to user: ${feedback.userId}`)}
              >
                Write to User
              </Button>
            </ListItem>
          </Paper>
        ))}
      </List>
    </Box>
  );
};

export default AdminGeneralFeedback;
