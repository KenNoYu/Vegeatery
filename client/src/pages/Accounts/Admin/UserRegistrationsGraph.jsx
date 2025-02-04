import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { Typography, Box, Button, TextField } from "@mui/material";
import http from "../../../http";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import RoleGuard from "../../../utils/RoleGuard";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const UserRegistrationsGraph = () => {
  RoleGuard("Admin");

  const [registrationsData, setRegistrationsData] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");
  const [responseType, setResponseType] = useState("");
  const [startDate, setStartDate] = useState(dayjs().subtract(30, "day")); // Default to past 30 days
  const [endDate, setEndDate] = useState(dayjs());

  useEffect(() => {
    fetchRegistrations();
  }, [startDate, endDate]);

  const fetchRegistrations = async () => {
    try {
      const response = await http.get("/Account"); // Adjust API endpoint as needed
      const registrations = response.data;

      // Filter registrations based on selected date range
      const filteredRegistrations = registrations.filter((registration) => {
        const registrationDate = dayjs(registration.createdAt).startOf("day");
        return registrationDate.isBetween(startDate, endDate, null, "[]");
      });

      // Group registrations by day
      const registrationsCount = {};
      filteredRegistrations.forEach((registration) => {
        const date = dayjs(registration.createdAt).format("YYYY-MM-DD");
        registrationsCount[date] = (registrationsCount[date] || 0) + 1;
      });

      // Convert registrationsCount to an array for chart data
      const formattedData = Object.entries(registrationsCount).map(
        ([date, count]) => ({
          date,
          count,
        })
      );

      setRegistrationsData(formattedData);
      setResponseMessage("Successfully loaded registrations data.");
      setResponseType("success");
    } catch (error) {
      console.error("Error fetching registrations:", error);
      setResponseMessage("Failed to fetch registrations data.");
      setResponseType("fail");
    }
  };

  const handleGenerate = () => {
    if (endDate.isBefore(startDate)) {
      setResponseMessage("End date cannot be before start date.");
      setResponseType("fail");
    } else {
      fetchRegistrations();
    }
  };

  const data = {
    labels: registrationsData.map((item) => item.date),
    datasets: [
      {
        label: "Number of Registrations",
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        data: registrationsData.map((item) => item.count),
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <Box>
      <Typography variant="h4" textAlign="center" mb={5}>
        User Registrations Statistics
      </Typography>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap={2}
        mb={5}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            sx={{
              mr: 2,
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused": {
                  fieldset: {
                    borderColor: "#C6487E !important", // Keep your border color
                  },
                },
              },
              "& .MuiInputLabel-root": {
                // Target the label specifically
                color: "black", // Default label color
                "&.Mui-focused": {
                  // Label styles when focused
                  color: "black !important", // Black on focus
                },
              },
            }}
            label="Start Date"
            value={startDate}
            onChange={(newValue) => setStartDate(newValue)}
            renderInput={(params) => (
              <TextField {...params} size="small" sx={{ width: "150px" }} />
            )}
            maxDate={dayjs()}
          />
          <DatePicker
            sx={{
              mr: 2,
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused": {
                  fieldset: {
                    borderColor: "#C6487E !important", // Keep your border color
                  },
                },
              },
              "& .MuiInputLabel-root": {
                // Target the label specifically
                color: "black", // Default label color
                "&.Mui-focused": {
                  // Label styles when focused
                  color: "black !important", // Black on focus
                },
              },
            }}
            label="End Date"
            value={endDate}
            onChange={(newValue) => setEndDate(newValue)}
            renderInput={(params) => (
              <TextField {...params} size="small" sx={{ width: "150px" }} />
            )}
            maxDate={dayjs()}
          />
        </LocalizationProvider>
        <Button
          variant="contained"
          onClick={handleGenerate}
          sx={{
            fontSize: "0.75rem", 
            padding: "6px 12px",
            backgroundColor: "#C6487E",
            padding: "10px",
            fontSize: "1rem",
            color: "#fff",
            borderRadius: "8px",
            "&:hover": { backgroundColor: "#C6487E" },
          }}
        >
          Generate
        </Button>
      </Box>
      <Box width="80%" margin="auto">
        <Line
          data={data}
          options={{ responsive: true, plugins: { legend: { display: true } } }}
        />
      </Box>
      {responseMessage && (
        <Typography
          textAlign="center"
          color={responseType === "success" ? "green" : "red"}
        >
          {responseMessage}
        </Typography>
      )}
    </Box>
  );
};

export default UserRegistrationsGraph;
