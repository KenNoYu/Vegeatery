// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { Box, TextField, Button, Typography } from "@mui/material";
// import http from "../../../http"; // Adjust the path to your http.js

// const GeneralFeedbackEdit = () => {
//   const { id } = useParams(); // Get the ID from the URL
//   const [feedback, setFeedback] = useState({ feedbackTitle: "", imagePath: "", rating: 1, review: "" });
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [errorMessage, setErrorMessage] = useState("");

//   useEffect(() => {
//     const fetchFeedback = async () => {
//       try {
//         const response = await http.get(`/GeneralFeedback/${id}`);
//         setFeedback(response.data);
//       } catch (error) {
//         console.error("Error fetching feedback:", error);
//         setErrorMessage("Failed to fetch feedback. Please try again later.");
//       }
//     };

//     fetchFeedback();
//   }, [id]);

//   const handleFileChange = (event) => {
//     setSelectedFile(event.target.files[0]);
//   };

//   const handleSubmit = async () => {
//     try {
//       const formData = new FormData();
//       formData.append("FeedbackTitle", feedback.feedbackTitle);
//       formData.append("Rating", feedback.rating);
//       formData.append("Review", feedback.review);

//       if (selectedFile) {
//         formData.append("imageFile", selectedFile);
//       }

//       await http.put(`/GeneralFeedback/${id}`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });


//       // if (feedback.imagePath) {
//       //   formData.append("ImagePath", feedback.imagePath);
//       // }

//       // await http.put(`/GeneralFeedback/${id}`, formData, {
//       //   headers: { "Content-Type": "multipart/form-data" },
//       // });



//       // Handle success (e.g., redirect back or show a success message)
//     } catch (error) {
//       console.error("Error updating feedback:", error);
//       setErrorMessage("Failed to update feedback. Please try again.");
//     }
//   };

//   return (
//     <Box>
//       <Typography variant="h5" fontWeight='bold'>Edit Feedback</Typography>
//       {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
//       <TextField
//         label="Feedback Title"
//         value={feedback.feedbackTitle}
//         onChange={(e) => setFeedback({ ...feedback, feedbackTitle: e.target.value })}
//         fullWidth
//       />
//       <TextField
//         label="Rating"
//         type="number"
//         value={feedback.rating}
//         onChange={(e) => setFeedback({ ...feedback, rating: +e.target.value })}
//         fullWidth
//       />
//       <TextField
//         label="Review"
//         value={feedback.review}
//         onChange={(e) => setFeedback({ ...feedback, review: e.target.value })}
//         fullWidth
//       />

//       {feedback.imagePath && (
//         <Box my={2}>
//           <Typography>Current Image:</Typography>
//           <img
//             src={feedback.imagePath}
//             alt="Feedback"
//             style={{ width: "200px", height: "auto", marginTop: "8px" }}
//           />
//         </Box>
//       )}

//       <input type="file" onChange={handleFileChange} accept="image/*" />


//       <Button variant="contained" onClick={handleSubmit}>
//         Save Changes
//       </Button>
//     </Box>
//   );
// };

// export default GeneralFeedbackEdit;
