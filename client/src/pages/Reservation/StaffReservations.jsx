import React, { useState, useEffect } from 'react'; import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  Container
} from "@mui/material";
import http from '../../http';
import { useTheme } from '@mui/material/styles';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import RoleGuard from '../../utils/RoleGuard';

const StaffReservations = () => {
  RoleGuard('Staff');
  const theme = useTheme();
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString("en-CA"))

  const fetchReservations = async (date) => {
    try {
      const formattedDate = date;
      console.log(formattedDate);
      const response = await http.get("/Reservation/GetReservations", {
        params: { date: formattedDate }
      });
      console.log(response.data);  // Log the response data for debugging
      setReservations(response.data);  // Assuming you have a state called 'reservations'
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    fetchReservations(newDate);
  };

  // Fetch reservations on component mount and when date changes
  useEffect(() => {
    fetchReservations(selectedDate);
  }, [selectedDate]);

  const seatReservation = async (reservationId, date, time, tables) => {
    try {
      const response = await http.put("/Reservation/SeatReservation", null, {
        params: { reservationId },
      });
      console.log(response.data);

      const logData = {
        "reservationId": reservationId,
        "action": "seated",
        "reservationDate": date,
        "timeSlot": time,
        "tables": tables.join(", "),
        "doneBy": "staff"
      }

      const logResponse = await http.post("/Reservation/CreateReservationLog", logData);
      console.log("Reservation log created:", logResponse.data);

      toast.success("Reservation marked as seated!");
      fetchReservations(selectedDate);
    } catch (error) {
      console.error("Error seating reservation:", error);
      toast.error("Failed to seat reservation.");
    }
  };

  return (
    <Container>

    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 15,
        boxShadow: 2,
        borderRadius: '20px',
      }}
    >
      
      <Box
        sx={{
          backgroundColor: 'white',
          width: '100%',
          height: '80vh',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          flexDirection: 'column',
          borderTopRightRadius: '20px',
          borderBottomRightRadius: '20px',
          overflow: "auto"
        }}
      >
        <Box sx={{ width: '80%', margin: '50px 0', display: "flex", justifyContent: "space-between" }}>
          {/* Date Selector */}
          <TextField
            label="Select Date"
            type="date"
            value={selectedDate}
            onChange={handleDateChange}
            sx={{
              cursor: "pointer",
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
                "& input": {
                  padding: "6px 10px",
                },
              },
              "& .MuiInputLabel-root": {
                color: "black", // Label color
              },
              "& .Mui-focused": {
                color: "black", // Label when focused
              },

            }}
            InputLabelProps={{
              shrink: true,
            }}
          />

            <ToggleButtonGroup value="reservations" sx={{
              backgroundColor: "#d9d9d9", // Light gray background
              borderRadius: "25px", // Rounded edges
              padding: "5px",
              height: "30px",
              "& .MuiToggleButton-root": {
                color: "#585858", // Default text color
                border: "none", // Remove default borders
                borderRadius: "20px",
                padding: "10px 20px",
                "&.Mui-selected": {
                  color: "#000", // Text color when selected
                  backgroundColor: "#fff", // White background for selected tab
                  fontWeight: 500,
                  "&:hover": {
                    backgroundColor: "white"
                  }
                },
                "&:not(.Mui-selected)": {
                  backgroundColor: "transparent", // Transparent for non-selected
                },
              },
            }}>
              <ToggleButton value="reservations" sx={{
              textTransform: "none"}}>
                Reservations
              </ToggleButton>
              <ToggleButton value="audit" sx={{
              textTransform: "none"}} onClick={() => navigate("/staff/reservationlogs")}>
                Audit Log
              </ToggleButton>
            </ToggleButtonGroup>

          <Button sx={{
            backgroundColor: '#C6487E',
            color: 'white',
            height: "35px",
            width: "152px",
          }} onClick={() => navigate("/staff/addreservation")}>
            Add
          </Button>
        </Box>
        {/* Reservations List */}
        {reservations.length > 0 ? (
          <Stack spacing={2} sx={{ width: "80%", marginBottom: "50px" }}>
            {reservations.map((reservation) => (
              <Card
                key={reservation.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px",
                  backgroundColor: theme.palette.secondary.main,
                  "&:hover": {
                    cursor: reservation.status === "seated" ? "not-allowed" : "pointer",
                    boxShadow: reservation.status === "seated" ? "none" : 3,
                  }
                }}
                onClick={() => {
                  if (reservation.status !== "seated") {
                    navigate(`/staff/viewreservations/${reservation.id}`);
                  }
                }}
              >
                <CardContent sx={{ flex: "1" }}>
                  <Typography variant="h6">
                    {reservation.customerName}
                  </Typography>
                  <Typography variant="body2">
                    {reservation.customerPhone} | {reservation.customerEmail}
                  </Typography>
                  <Typography variant="body2" sx={{ marginTop: "10px" }}>
                    Table(s) {reservation.tables.map(table => table.tableNumber).join(", ")}
                  </Typography>
                </CardContent>
                <Typography variant="h6" sx={{ marginRight: "20px" }}>
                  {reservation.timeSlot}
                </Typography>
                {reservation.status === "seated" ? (
                  <Button
                    variant="contained"
                    disabled
                    sx={{
                      backgroundColor: "gray",
                      color: "white",
                      cursor: "not-allowed",
                    }}
                  >
                    SEATED
                  </Button>
                ) : (
                  <Button
                  variant="contained"
                sx={{
                  color: "white",
                  backgroundColor: '#C6487E',
                  minWidth: "100px",
                  fontWeight: "bold",
                  textTransform: "none",
                }}
                onClick={(event) => {
                  event.stopPropagation(); 
                  seatReservation(
                    reservation.id,
                    reservation.reservationDate,
                    reservation.timeSlot,
                    reservation.tables.map(table => table.id)
                  );
                }}
                >
                SEAT
              </Button>
                )}
                  
              </Card>
        ))}
      </Stack>
      ) : (
      <Typography
        variant="h6"
        sx={{
          color: "gray",
          textAlign: "center",
          marginTop: "20px",
        }}
      >
        No reservations for this day!
      </Typography>
        )}

    </Box>
    <ToastContainer />
    </Box >
    </Container>
  );
};

export default StaffReservations;
