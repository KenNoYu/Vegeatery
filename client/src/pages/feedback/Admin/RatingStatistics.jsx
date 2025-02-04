import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Typography, Box, Button, TextField } from '@mui/material';
import http from '../../../http';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import RoleGuard from '../../../utils/RoleGuard';
import FeedbackSidebar from "./FeedbackSidebar.jsx";



ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RatingStatistics = () => {
    RoleGuard('Admin');

    const [ratingsData, setRatingsData] = useState([]);
    const [responseMessage, setResponseMessage] = useState('');
    const [responseType, setResponseType] = useState('');
    const [startDate, setStartDate] = useState(dayjs().subtract(7, 'day'));
    const [endDate, setEndDate] = useState(dayjs());

    useEffect(() => {
        fetchRatings();
    }, [startDate, endDate]);

    const fetchRatings = async () => {
        try {
            console.log("Fetching feedback data...");
            const response = await http.get('/GeneralFeedback');
            const feedbacks = response.data;
            console.log("Raw feedbacks:", feedbacks);

            const filteredFeedbacks = feedbacks.filter((feedback) => {
                const feedbackDate = dayjs(feedback.CreatedAt).startOf('day'); // Adjusted property name
                return feedbackDate.isBetween(startDate, endDate, null, '[]');
            });

            // Dynamically count ratings
            const ratingsCount = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

            filteredFeedbacks.forEach((feedback) => {
                const rating = feedback.rating;
                if (rating >= 1 && rating <= 5) {
                    ratingsCount[rating] = (ratingsCount[rating] || 0) + 1;
                }
            });

            // Convert ratingsCount object to array of objects for chart
            const formattedData = Object.entries(ratingsCount).map(([rating, count]) => ({
                rating: parseInt(rating),
                count
            }));

            setRatingsData(formattedData);
            setResponseMessage('Successfully loaded ratings data.');
            setResponseType('success');
        } catch (error) {
            console.error('Error fetching feedback:', error);
            setResponseMessage('Failed to fetch feedback data.');
            setResponseType('fail');
        }
    };

    const handleGenerate = () => {
        if (endDate.isBefore(startDate)) {
            setResponseMessage('End date cannot be before start date.');
            setResponseType('fail');
        } else {
            fetchRatings();
        }
    };

    const data = {
        labels: ratingsData.map(item => `${item.rating} Rating`),
        datasets: [
            {
                label: 'Number of Ratings',
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                data: ratingsData.map(item => item.count),
            },
        ],
    };

    return (
        <Box
        sx={{
            marginBottom: 2
        }}
        >

            <Box sx={{ display: "flex", height: "100vh", marginTop: "2em", overflow: "hidden" }}>
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
                    <Typography variant="h4" fontWeight="bold" mt={5} ml={3} mb={2}>
                        Feedback Ratings Statistics
                    </Typography>
                    <Box display="flex" justifyContent="center" alignItems="center" gap={2} mb={2} mt={5}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                                label="Start Date"
                                value={startDate}
                                onChange={(newValue) => setStartDate(newValue)}
                                renderInput={(params) => <TextField {...params} />}
                                maxDate={dayjs()}
                            />
                            <DatePicker
                                label="End Date"
                                value={endDate}
                                onChange={(newValue) => setEndDate(newValue)}
                                renderInput={(params) => <TextField {...params} />}
                                maxDate={dayjs()}
                            />
                        </LocalizationProvider>
                        <Button variant="contained" onClick={handleGenerate}>
                            Generate
                        </Button>
                    </Box>
                    <Box width="50%" margin="auto" marginTop={10}>
                        <Bar data={data} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                    </Box>
                    {responseMessage && (
                        <Typography textAlign="center" color={responseType === 'success' ? 'green' : 'red'}>
                            {responseMessage}
                        </Typography>
                    )}
                </Box>
            </Box>
        </Box>
    );
};

export default RatingStatistics;
