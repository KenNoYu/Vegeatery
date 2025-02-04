import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
  Paper,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from "@mui/material";
import { Star, StarBorder } from "@mui/icons-material";
import http from "../../../http";
import RoleGuard from '../../../utils/RoleGuard';
import emailjs from "emailjs-com";
import FeedbackSidebar from "./FeedbackSidebar.jsx";

const AdminGeneralFeedback = () => {
  RoleGuard('Admin');

  const [feedbackList, setFeedbackList] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [replyTitle, setReplyTitle] = useState("");
  const [replyText, setReplyText] = useState("");

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

  const handleWriteToUser = (feedback) => {
    console.log("Selected Feedback on Click:", feedback);

    setSelectedFeedback(feedback);
    setOpenModal(true);

  };



  const handleSendEmail = () => {
    if (!replyTitle || !replyText) {
      alert("Please fill in both the reply title and message.");
      return;
    }

    console.log("Selected feedback:", selectedFeedback); //debug

    const emailParams = {
      reply_to: selectedFeedback.email,  // Using the selected feedback's email
      greeting: `Dear User,`,
      reply_title: replyTitle,
      user_review: selectedFeedback.review,
      admin_reply: replyText
    };

    emailjs.send("service_s7lq1rg", "template_mgqtutr", emailParams, "OaX1IhmJOuKeWV97U")
      .then((response) => {
        console.log("Email successfully sent!", response);
        setOpenModal(false);
        setReplyTitle("");
        setReplyText("");
      })
      .catch((error) => {
        console.error("Failed to send email:", error);
      });
  };


  return (
    <Box sx={{
      display: "flex",
      height: "100vh",
      overflow: "hidden",
      marginBottom: 2
    }}
    >
      <Box sx={{ display: "flex", height: "100vh", marginTop: "2em" }}>
        {/* Sidebar */}
        <Box sx={{ width: "20%" }}>
          <FeedbackSidebar />
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            width: "80%",
            padding: 5,
            backgroundColor: "#FFFFFF",
            marginTop: "5px",
            paddingLeft: "3em",
            overflowX: "hidden",
          }}
        >

          <Typography variant="h4" fontWeight="bold" mt={5} ml={3} mb={2}>Customer Feedback</Typography>
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
                  marginLeft: 3,

                }}
              >
                <ListItem disablePadding>
                  <ListItemText
                    primary ={`Title: ${feedback.feedbackTitle}`}
                    secondary={
                      <>
                        <Box marginBottom={2} marginTop={2}>
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
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 'bold' }}>Rating:</Typography>
                          <Box>{renderStars(feedback.rating)}</Box>
                        </Box>
                        <Box sx={{ whiteSpace: 'normal', wordWrap: 'break-word', marginTop: 1, marginBottom: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>User's Email: {feedback.email}</Typography>
                        </Box>
                        <Box sx={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
                          <Typography variant="body1">{feedback.review}</Typography>
                        </Box>


                      </>
                    }
                    sx={{ marginRight: 2 }}
                  />
                  <Button
                    variant="outlined"
                    color="black"
                    onClick={() => handleWriteToUser(feedback)}
                    sx={{
                      minWidth: '150px',
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

        {/* Reply Modal */}
        <Dialog open={openModal} onClose={() => setOpenModal(false)}>
          <DialogTitle sx={{ backgroundColor: '#E6F2FF' }}>Reply to User</DialogTitle>
          <DialogContent sx={{ backgroundColor: '#E6F2FF' }}>
            <TextField label="Reply Title" fullWidth margin="dense" value={replyTitle} onChange={(e) => setReplyTitle(e.target.value)} />
            <TextField label="Reply Message" fullWidth multiline rows={4} margin="dense" value={replyText} onChange={(e) => setReplyText(e.target.value)} />
          </DialogContent>
          <DialogActions sx={{ backgroundColor: '#E6F2FF' }}>
            <Button onClick={() => setOpenModal(false)} sx={{
              textTransform: 'none',
              color: '#C6487E',
              backgroundColor: '#FFFFFF',
              borderColor: '#C6487E',
              '&:hover': {
                backgroundColor: '#E7ABC5',
                color: '#FFFFFF'
              }
            }}>CANCEL</Button>
            <Button onClick={handleSendEmail} sx={{
              alignSelf: 'flex-start',
              textTransform: 'none',
              color: '#FFFFFF',
              backgroundColor: '#C6487E',
              '&:hover': { backgroundColor: '#E7ABC5' }

            }} variant="contained">SEND</Button>
          </DialogActions>
        </Dialog>
      </Box>


    </Box>
  );
};

export default AdminGeneralFeedback;
