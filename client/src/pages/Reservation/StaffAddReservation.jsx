import React, { useState, useEffect } from "react";
import { Button, Grid, TextField, Box, Typography } from "@mui/material";
import DateSelector from "./Components/DateSelector";
import { useTheme } from '@mui/material/styles';
import { styled } from "@mui/system";
import axios from "axios";
import http from '../../http';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { parse, isBefore, isDate } from 'date-fns';
import emailjs from "@emailjs/browser";

import RoleGuard from '../../utils/RoleGuard';

const DetailsTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputLabel-root.Mui-focused": {
    color: "black", // Label color when focused and at the top
  },
  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": {
      borderColor: "black", // Outline on hover
    },
    "&.Mui-focused fieldset": {
      borderColor: "black", // Outline when focused
    },
  },
  "& .MuiInputLabel-root": {
    color: "black", // Label color
  },
  "& .Mui-focused": {
    color: "black", // Label when focused
  },
}));

const StaffAddReservation = () => {
  RoleGuard('Staff');
  const theme = useTheme();
  const navigate = useNavigate();
  const [view, setView] = useState("details"); // 'details' or 'seats'
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
  });
  const [selectedTables, setSelectedTables] = useState([]);

  useEffect(() => {
    const fetchTables = async () => {
      setLoading(true); // Start loading when fetching starts

      try {

        // Fetch tables 
        let url = "/Reservation/GetTables";
        if (selectedDate && selectedTime) {
          url += `?date=${selectedDate}&timeSlot=${selectedTime}`;
        }

        const response = await http.get(url);
        setTables(response.data);

      } catch (error) {
        console.error("Error fetching data", error);
        toast.error("Failed to load data.");
      } finally {
        setLoading(false); // Stop loading state in all cases
      }
    };

    fetchTables(); // Invoke the function

  }, [selectedDate, selectedTime]); // Runs when selectedDate or selectedTime changes



  // Mock data for times
  const times = [
    "11:00am", "11:30am", "12:00pm", "12:30pm",
    "1:00pm", "1:30pm", "2:00pm", "2:30pm",
    "3:00pm", "3:30pm", "4:00pm", "4:30pm",
    "5:00pm", "5:30pm", "6:00pm", "6:30pm",
    "7:00pm", "7:30pm", "8:00pm", "8:30pm",
  ];

  const isDateTimeBeforeNow = (date, time) => {
    const formattedDate = parse(time, 'h:mma', new Date(date)); // Parse the time into a date object
    return isBefore(formattedDate, new Date()); // Compare it with the current date and time
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setSelectedTables([]);
    if (selectedTime) {
      if (isDateTimeBeforeNow(date, selectedTime)) {
        setSelectedTime(null)
      }
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTables([]);
    setSelectedTime(time);
  };

  const handleViewChange = () => {
    setView(view === "details" ? "seats" : "details");
  };

  const handleTableClick = (id) => {
    setTables((prevTables) => {
      let updatedTables = [...prevTables];
      let newSelectedTables = [...selectedTables];

      // Find the table being selected
      const tableIndex = updatedTables.findIndex((table) => table.id === id);
      if (tableIndex !== -1) {
        const table = updatedTables[tableIndex];

        if (selectedTables.includes(id)) {
          // Deselect the table
          newSelectedTables = newSelectedTables.filter(tableId => tableId !== id);
          updatedTables[tableIndex] = { ...table, status: "available" };
        } else {
          if (selectedTables.length >= 2) {
            toast.warning("You can only select up to 2 tables.");
            return prevTables;
          }

          // Select the table
          newSelectedTables.push(id);
          updatedTables[tableIndex] = { ...table, status: "selected" };
        }
      }

      setSelectedTables(newSelectedTables);
      return updatedTables;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!selectedDate) {
      toast.error("Please select a date.");
      return;
    } else if (!selectedTime) {
      toast.error("Please select a time.");
      return
    } else if (!formData.firstName || formData.firstName.trim() === "") {
      toast.error("First Name is required.");
      return;
    } else if (!formData.lastName || formData.lastName.trim() === "") {
      toast.error("Last Name is required.");
      return;
    } else if (!formData.email || formData.email.trim() === "") {
      toast.error("Email is required.");
      return;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    } else if (!formData.mobileNumber || formData.mobileNumber.trim() === "") {
      toast.error("Mobile Number is required.");
      return;
    } else if (!/^\+?[\d\s-]+$/.test(formData.mobileNumber)) {
      toast.error("Mobile Number must be valid.");
      return;
    } else if (!selectedTables || selectedTables.length == 0) {
      toast.error("Please select at least one table.");
      return;
    }

    toast.info("Processing...")

    const reservationData = {
      "reservationDate": selectedDate,
      "customerName": `${formData.firstName} ${formData.lastName}`,
      "customerEmail": formData.email,
      "customerPhone": formData.mobileNumber,
      "timeSlot": selectedTime,
      "status": "Pending",
      "tableIds": selectedTables
    };

    console.log(reservationData)

    try {
      const response = await http.post("/Reservation/CreateReservation", reservationData);
      console.log(response.data);
      toast.success("Reservation created successfully!");

      const logData = {
        "reservationId": response.data.reservation.id,
        "action": "created",
        "reservationDate": selectedDate,
        "timeSlot": selectedTime,
        "tables": selectedTables.join(", "),
        "doneBy": "staff"
      }

      const logResponse = await http.post("/Reservation/CreateReservationLog", logData);
      console.log("Reservation log created:", logResponse.data);

      const emailParams = {
        customer_name: reservationData.customerName,
        customer_email: reservationData.customerEmail,
        reservation_date: new Intl.DateTimeFormat('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }).format(new Date(reservationData.reservationDate)),
        reservation_time: reservationData.timeSlot,
        table_numbers: selectedTables.join(", ") // Convert array to string
      };

      await emailjs.send(
        "service_1yw1hkh",
        "template_5lv58es",
        emailParams,
        "HpadWHSOZyo_0NyHD"
      );

      navigate("/staff/reservationlogs"); // Redirect after success
    } catch (error) {
      toast.error("Failed to create reservation.");
      console.error("Error:", error.response?.data || error.message);
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 7,
        boxShadow: 2,
        borderRadius: '20px',
        backgroundColor: 'white',
        overflow: 'auto',
      }}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          width: '80%',
          height: '80vh',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          flexDirection: 'row',
          borderTopRightRadius: '20px',
          borderBottomRightRadius: '20px',
        }}
      >

        <Box
          sx={{
            flex: 1,
            p: 3,
          }}
        >
          <Button
            onClick={() => navigate('/staff/viewreservations')}
            sx={{
              textTransform: 'none',
              color: 'black',
              marginTop: '-50px',
              marginBottom: '50px',
              '&:hover': {
                color: 'grey',
              },
            }}
          >
            Back
          </Button>

          

          {/* Date Selector */}
          <DateSelector
            selectedDate={selectedDate}
            onDateChange={handleDateSelect}
          />

          {/* Time Selector */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              gap: 1,
              justifyContent: "center",
              mt: 3,
              mb: 3,
            }}
          >
            {times.map((time) => {
              const isPast = isDateTimeBeforeNow(selectedDate, time);
              return (
                <Button
                  key={time}
                  variant="outlined"
                  onClick={() => !isPast && handleTimeSelect(time)} // Only handle click if time is not in the past
                  sx={{
                    borderColor: selectedTime === time ? "none" : "black",
                    backgroundColor: selectedTime === time ? '#C6487E' : "white",
                    width: "90px",
                    opacity: isPast ? 0.5 : 1, // Grey out past times
                    cursor: isPast ? "not-allowed" : "pointer",
                    pointerEvents: isPast ? "none" : "auto", // Disable click for past times
                    color: selectedTime === time ? "white" : "black",
                    "&:hover": {
                      backgroundColor: selectedTime === time ? "none" : "#E7ABC5",
                    },
                  }}
                >
                  {time}
                </Button>
              );
            })}
          </Box>
        </Box>

        {/* Right Half: Details or Seats View */}
        <Box
          sx={{
            flex: 1,
            p: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >

          <Typography variant="h6" gutterBottom>
            Create Reservation
          </Typography>
          {view === "details" ? (
            <Box
              component="form"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <DetailsTextField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
              />
              <DetailsTextField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
              />
              <DetailsTextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
              />
              <DetailsTextField
                label="Mobile Number"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleInputChange}
                variant="outlined"
                fullWidth
              />

              <Button variant="contained" onClick={handleViewChange} sx={{
                backgroundColor: '#C6487E',
                color: "white",
                "&:hover": {
                  backgroundColor: "#E7ABC5"
                }
              }}>
                Select Seats
              </Button>
            </Box>
          ) : (
            <Box sx={{ textAlign: "center" }}>
              <Grid container spacing={2} justifyContent="center">
                {tables.map((table) => (
                  <Grid item xs={6} lg={4} key={table.id}>
                    <Button
                      variant="contained"
                      sx={{
                        padding: "20px",
                        backgroundColor:
                          table.status === "available"
                            ? "white"
                            : table.status === "unavailable"
                              ? '#585858'
                              : '#C6487E',
                        color: table.status === "unavailable" || table.status === "selected" ? "#fff" : "#000",
                        cursor: table.status !== "unavailable" ? "pointer" : "not-allowed",
                      }}
                      onClick={() =>
                        table.status !== "unavailable" && handleTableClick(table.id)
                      }
                    >
                      Table {table.id}<br />
                      {table.capacity} Pax
                    </Button>
                  </Grid>
                ))}
              </Grid>
              <Box sx={{ mt: 3 }}>
                <Button
                  variant="outlined"
                  onClick={handleViewChange}
                  sx={{
                    mr: 2,
                    border: "1px solid black",
                    color: "black",
                    "&:hover": {
                      backgroundColor: "#E7ABC5"
                    }
                  }}
                >
                  Back
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#C6487E',
                    color: "white",
                    "&:hover": {
                      backgroundColor: "#E7ABC5"
                    }
                  }}
                  onClick={handleSubmit}

                >Confirm</Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
      <ToastContainer />
    </Box >
  );
};

export default StaffAddReservation;
