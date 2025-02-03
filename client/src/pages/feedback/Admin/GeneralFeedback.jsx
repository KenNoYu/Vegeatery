import React, { useState, useEffect } from "react";
import { Box, Button, List, ListItem, ListItemText, Paper, Typography } from "@mui/material";
import { Star, StarBorder } from "@mui/icons-material";
import http from "../../../http"; // Adjust the path to your http.js
import RoleGuard from '../../../utils/RoleGuard';


const AdminGeneralFeedback = () => {
  RoleGuard('Admin');

  const [feedbackList, setFeedbackList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

const renderStars = (rating) => {
    const maxStars = 5;
    return [...Array(maxStars)].map((_, index) =>
      index < rating ? <Star key={index} sx={{ color: "#FFD700" }} /> : <StarBorder key={index} />
    );
  };

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
      <Typography variant="h4" fontWeight="bold" mb={2}>Customer Feedback</Typography>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <List sx={{ display: "flex", flexDirection: "column", gap: 2, width: '100%' }}>
        {feedbackList.map((feedback) => (
          <Paper
            key={feedback.id}
            elevation={3}
            sx={{
              padding: 2,
              borderRadius: 2,
              backgroundColor: "#f9f9f9",
              border: "1px solid #ddd",
              display: "flex",
            flexDirection: "column",
            gap: 2,
            }}
          >
            <ListItem disablePadding>
            <ListItemText
                primary={`Title: ${feedback.feedbackTitle}`}
                secondary={
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>Rating:</Typography>
                    <Box>{renderStars(feedback.rating)}</Box>
                  </Box>
                    <Box sx={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                    <Typography variant="body2">{feedback.review}</Typography>
                  </Box>
                  </>
                }
                sx={{ marginRight: 2 }}
              />
              <Button
                variant="outlined"
                color="black"
                onClick={() => console.log(`Write to user: ${feedback.userId}`)}
                sx={{ minWidth: '150px', 
                  alignSelf: 'flex-start',
                  textTransform: 'none',
                  color: '#FFFFFF',
                  backgroundColor: '#C6487E',
                  '&:hover': { backgroundColor: '#E7ABC5' }
                
                }}
              >
                WRITE TO USER
              </Button>
            </ListItem>
          </Paper>
        ))}
      </List>
    </Box>
  );
};

export default AdminGeneralFeedback;
