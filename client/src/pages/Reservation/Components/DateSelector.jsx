import React, { useState } from "react";
import { Button, Box, Typography } from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import { useTheme } from '@mui/material/styles';

const DateSelector = ({ selectedDate, onDateChange}) => {
  const theme = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date()); // Tracks the current week

  // Function to get all days of the current week
  const getWeekDates = (date) => {
    const week = [];
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay()); // Set to Sunday

    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  // Handlers for previous/next week
  const handlePrevWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() - 7);
    setCurrentDate(newDate);
  };

  const handleNextWeek = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + 7);
    setCurrentDate(newDate);
  };

  const handleDateClick = (date) => {
    const formattedDate = date.toISOString().split("T")[0]; // Convert to YYYY-MM-DD format
    console.log(formattedDate);
    onDateChange(formattedDate);
  };

  // Generate dates for the current week
  const weekDates = getWeekDates(currentDate);

  const isDateBeforeToday = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset to start of the day for comparison
    return date < today;
  };

  return (
    <Box
      sx={{
        textAlign: "center",
        fontFamily: "'Arial', sans-serif",
        marginBottom: "1rem",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <Button
          sx={{
            minWidth: "auto",
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
          }}
          onClick={handlePrevWeek}
        >
          <ArrowBack sx={{
            color: "black",
            "&:hover": {
              color: theme.palette.secondaryText.main
            }
            }}/>
        </Button>
        <Typography variant="h6" sx={{ margin: "0 1rem", width: "50%" }}>
          {weekDates[0].toLocaleDateString("en-US", { month: "long" })}{" "}
          {weekDates[0].getFullYear()}
        </Typography>
        <Button
          sx={{
            minWidth: "auto",
            background: "none",
            border: "none",
            fontSize: "1.5rem",
            cursor: "pointer",
          }}
          onClick={handleNextWeek}
        >
          <ArrowForward  sx={{
            color: "black",
            "&:hover": {
              color: theme.palette.secondaryText.main
            }
            }}/>
        </Button>
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-around" }}>
      {weekDates.map((date, index) => {
          const isBeforeToday = isDateBeforeToday(date);
          return (
            <Button
              key={index}
              sx={{
                background:
                  selectedDate === date.toISOString().split("T")[0] ? theme.palette.Accent.main : "#fff",
                color: selectedDate === date.toISOString().split("T")[0] ? "primary" : "black",
                padding: "0.5rem",
                flex: "1",
                textAlign: "center",
                fontSize: "0.5rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                "&:hover": {
                  backgroundColor: selectedDate === date.toISOString().split("T")[0] ? "none" : "#E7ABC5"
                },
                // Disable and grey out past dates
                opacity: isBeforeToday ? 0.5 : 1,
                pointerEvents: isBeforeToday ? "none" : "auto",
              }}
              onClick={() => !isBeforeToday && handleDateClick(date)} // Only handle click if not disabled
            >
              <Typography variant="body2">
                {date.toLocaleDateString("en-US", { weekday: "short" })}
              </Typography>
              <Typography variant="h6">{date.getDate()}</Typography>
            </Button>
          );
        })}
      </Box>
    </Box>
  );
};

export default DateSelector;
