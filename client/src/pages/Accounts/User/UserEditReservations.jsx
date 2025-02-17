import React, { useState, useEffect } from 'react';
import { Box, Drawer, Typography, Button, Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, } from '@mui/material';
import { styled } from '@mui/system';
import http from '../../../http';
import UserContext from '../../../contexts/UserContext'
import { UserProvider } from '../../../contexts/UserContext'
import { WindowSharp } from '@mui/icons-material';
import * as yup from 'yup';
import { ToastContainer, toast } from "react-toastify";
import Sidebar from "./UserSidebar";
import { useTheme } from '@emotion/react';
import RoleGuard from "../../../utils/RoleGuard.js";
import { useNavigate, useParams } from 'react-router-dom';
import DateSelector from '../../Reservation/Components/DateSelector.jsx';
import { parse, isBefore, isDate } from 'date-fns';


const EditMyReservationsPage = () => {
  RoleGuard('User');
  const navigate = useNavigate();
  const theme = useTheme();
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [reservation, setReservation] = useState(null);

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedTables, setSelectedTables] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [unreserveOpen, setUnreserveOpen] = useState(false);
  const [confirmChangesOpen, setConfirmChangesOpen] = useState(false);

  const handleUnreserveOpen = () => setUnreserveOpen(true);
  const handleUnreserveClose = () => setUnreserveOpen(false);

  const handleConfirmChangesOpen = () => setConfirmChangesOpen(true);
  const handleConfirmChangesClose = () => setConfirmChangesOpen(false);

  const handleUnreserveConfirm = () => {
    onUnreserveConfirm(reservation.id); // Perform the cancellation action
    setUnreserveOpen(false); // Close the modal
  };


  const [tables, setTables] = useState([]);

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

  const fetchReservationById = async () => {
    setLoading(true);
    try {
      const response = await http.get(`/Reservation/GetReservationById/${id}`);
      console.log(response.data);
      setReservation(response.data);
      setSelectedDate(response.data.reservationDate);
      setSelectedTime(response.data.timeSlot);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        navigate('/user/reservations');
      } else {
        console.error("Error fetching reservation:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchTables = async (date, timeSlot, reservationId) => {
    if (!date || !timeSlot || !reservationId) return; // Avoid fetching if no data
    try {
      const response = await http.get(`/Reservation/GetTables?date=${date}&timeSlot=${timeSlot}&reservationId=${reservationId}`);
      console.log("Tables fetched:", response.data);
      setTables(response.data);
      reservation.tables.forEach((table) => {
        handleTableClick(table.id, "selected");
      });

      response.data.forEach((table) => {
        if (table.status === "unavailable") {
          handleTableClick(table.id, "unavailable");
        }
      });

    } catch (error) {
      console.error("Error fetching tables:", error);
      toast.error("Failed to load tables.");
    }
  };

  const onUnreserveConfirm = async (reservationId) => {
    if (!user) {
      toast.error("User is not authenticated.");
      return;
    }
    try {
      const response = await http.put("/Reservation/Unreserve", null, {
        params: { reservationId },
      });
      console.log(response.data);

      const logData = {
        "reservationId": reservationId,
        "action": "cancelled",
        "reservationDate": reservation.reservationDate,
        "timeSlot": reservation.timeSlot,
        "tables": reservation.tables.map(table => table.id).join(", "),
        "doneBy": user.username
      }

      console.log(logData)

      const logResponse = await http.post("/Reservation/CreateReservationLog", logData);
      console.log("Reservation log created:", logResponse.data);

      toast.success("Reservation cancelled!");
      navigate("/user/reservations")
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      toast.error("Failed to cancel reservation.");
    }
  };

  const onConfirmChanges = async () => {
    if (!selectedTables || selectedTables.length === 0) {
      toast.warn("Please select 1 or 2 tables")
      return;
    }
    try {
      const updatedData = {
        customerName: reservation.customerName,
        customerPhone: reservation.customerPhone,
        customerEmail: reservation.customerEmail,
        status: reservation.status,
        reservationDate: selectedDate,
        timeSlot: selectedTime,
        tableIds: selectedTables,
      };

      console.log(updatedData)

      const response = await http.put(`/Reservation/UpdateReservation/${reservation.id}`, updatedData);
      const logData = {
        reservationId: reservation.id,
        action: "updated",
        reservationDate: selectedDate,
        "timeSlot": reservation.timeSlot + " → " + selectedTime,
        "tables": reservation.tables.map(table => table.id).join(", ") + " → " + selectedTables,
        doneBy: user.username
      };

      await http.post("/Reservation/CreateReservationLog", logData);

      toast.success("Reservation updated successfully!");
      setConfirmChangesOpen(false);
      navigate('/user/reservations')
    } catch (error) {
      console.error("Error updating reservation:", error);
      toast.error("Failed to update reservation.");
    }
  };

  useEffect(() => {
    fetchReservationById();
  }, [id]);

  useEffect(() => {
    if (reservation) {
      fetchTables(selectedDate, selectedTime, reservation.id);
    }
  }, [reservation, selectedDate, selectedTime]);

  useEffect(() => {
    if (reservation) {
      const fetchUser = async () => {
        setLoading(true); // Start loading when fetching starts

        try {
          let userData = null;

          // Try fetching user data
          try {
            const userResponse = await http.get("/Auth/current-user", { withCredentials: true });
            if (userResponse.data) {
              setUser(userResponse.data);
              userData = userResponse.data;

              if (userData.email !== reservation.customerEmail) {
                toast.error("This reservation does not belong to you.");
                navigate("/user/reservations"); // Navigate to reservations if it doesn't belong to the user
              } else if (reservation.status === "seated") {
                toast.error("This reservation has been completed.");
                navigate("/user/reservations");
              }

            }
          } catch (userError) {
            console.warn("User not logged in or authentication failed.");
            setUser(null); // Ensure user state is cleared if no user is found
          }

        } catch (error) {
          console.error("Error fetching data", error);
          toast.error("Failed to load data.");
        } finally {
          setLoading(false); // Stop loading state in all cases
        }
      };

      fetchUser(); // Invoke the function
    }


  }, [reservation]);
  

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (selectedTime) {
      if (isDateTimeBeforeNow(date, selectedTime)) {
        setSelectedTime(null)
      }
    }
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleTableClick = (id, status = "available") => { 
    let newSelectedTables = [...selectedTables];
    setTables((prevTables) => {
      // Create a new array to maintain immutability
      let updatedTables = prevTables.map((table) => {
        if (table.id === id) {
          if (status === "unavailable") {
            return { ...table, status: "unavailable" };
          } else if (status === "selected" && !selectedTables.includes(id)) {
            newSelectedTables.push(id);
            return { ...table, status: "selected" };
          } else if (status === "available") {
            if (selectedTables.includes(id)) {
              // Deselect the table
              newSelectedTables = newSelectedTables.filter(tableId => tableId !== id);
              return { ...table, status: "available" };
            } else {
              if (selectedTables.length >= 2) {
                toast.warning("You can only select up to 2 tables.");
                return table;
              }
              // Select the table
              newSelectedTables.push(id);
              return { ...table, status: "selected" };
            }
          }
        }
        return table;
      });
  
      return updatedTables;
    });
  
    // Move this outside of setTables to ensure it gets the latest value
    setSelectedTables(newSelectedTables);
    console.log("Updated Selected Tables:", newSelectedTables);
  };

  if (loading) {
    toast.info("Loading reservation...");
    return null;
  }


  return (
    <Box sx={{ display: "flex", height: "100%", marginTop: "2em" }}>
      {/* Sidebar */}
      <Sidebar />
      {/* Main Content */}
      <Box sx={{
        height: "100vh",
        marginLeft: "240px",
        flex: 1,
        marginTop: "0.5em",
        padding: "2em",
        backgroundColor: "#ffffff",
        borderTopRightRadius: "1em",
        borderBottomRightRadius: "1em",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        flexDirection: "column",
      }}>
        
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
            p: 4,
          }}
        >
          <Button
            onClick={() => navigate('/user/reservations')}
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
                <Button key={time}
                  variant="outlined"
                  sx={{
                    borderColor: selectedTime === time ? "none" : "black",
                    backgroundColor: selectedTime === time ? '#C6487E' : "primary",
                    width: "90px",
                    color: selectedTime === time ? "white" : "black",
                    cursor: isPast ? "not-allowed" : "pointer",
                    opacity: isPast ? 0.5 : 1,
                    pointerEvents: isPast ? "none" : "auto",
                    "&:hover": { backgroundColor: selectedTime === time ? "none" : "#E7ABC5" }
                  }}
                  onClick={() => !isPast && handleTimeSelect(time)}>
                  {time}
                </Button>
              );
            })}
          </Box>
        </Box>

        <Box
          sx={{
            flex: 1,
            p: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box sx={{ textAlign: "center", marginTop: "20px" }}>
            <Grid container spacing={2} justifyContent="center">
              {tables.map((table) => {
                return (
                  <Grid item xs={6} lg={4} key={table.id}>
                    <Button
                      variant="contained"
                      sx={{
                        padding: "20px",
                        backgroundColor:
                          table.status === "selected" ? '#C6487E' :
                            table.status === "available" ? "white" :
                              '#585858',
                        color: table.status === "selected" || table.status === "unavailable" ? "#fff" : "#000",
                        cursor: table.status !== "unavailable" ? "pointer" : "not-allowed",
                      }}
                      onClick={() =>
                        table.status !== "unavailable" && handleTableClick(table.id)
                      }
                    >
                      Table {table.id}<br />
                      {table.pax} Pax
                    </Button>
                  </Grid>
                )
              })}
            </Grid>
            <Box sx={{ mt: 3, display: "flex", justifyContent: "space-around" }}>
              <Button
                variant="outlined"
                onClick={() => handleUnreserveOpen()}
                sx={{
                  mr: 2,
                  border: "1px solid black",
                  color: "black",
                  "&:hover": {
                    backgroundColor: "#E7ABC5"
                  }
                }}
              >
                Unreserve
              </Button>
              <Button
                variant="contained"
                onClick={handleConfirmChangesOpen}
                sx={{
                  backgroundColor: '#C6487E',
                  color: "white",
                  "&:hover": {
                    backgroundColor: "#E7ABC5"
                  }
                }}

              >Confirm Changes</Button>
            </Box>
          </Box>
        </Box>

      </Box>
      <ToastContainer />

      {/* Modals */}

      {/* Unreserve Confirmation Modal */}
      <Dialog
        open={unreserveOpen}
        onClose={handleUnreserveClose}
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-description"
      >
        <DialogTitle id="confirmation-dialog-title">
          Are you sure you want to cancel this reservation?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="confirmation-dialog-description">
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          {/* Cancel Button */}
          <Button onClick={handleUnreserveClose} sx={{ color: 'gray' }}>
            No, Keep It
          </Button>
          {/* Confirm Button */}
          <Button
            onClick={handleUnreserveConfirm}
            sx={{
              color: 'white',
              backgroundColor: '#C6487E',
              '&:hover': {
                backgroundColor: '#E7ABC5',
              },
            }}
          >
            Yes, Unreserve
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Changes Modal */}
      <Dialog
        open={confirmChangesOpen}
        onClose={handleConfirmChangesClose}
        aria-labelledby="confirm-changes-dialog-title"
        aria-describedby="confirm-changes-dialog-description"
      >
        <DialogTitle id="confirm-changes-dialog-title">Confirm Changes</DialogTitle>
        <DialogContent>
          <DialogContentText id="confirm-changes-dialog-description">
            Are you sure you want to confirm the changes made to this reservation?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmChangesClose} sx={{ color: 'gray' }}>
            No, Go Back
          </Button>
          <Button
            onClick={onConfirmChanges}
            sx={{
              color: 'white',
              backgroundColor: '#C6487E',
              '&:hover': {
                backgroundColor: '#E7ABC5',
              },
            }}
          >
            Yes, Confirm Changes
          </Button>
        </DialogActions>
      </Dialog>

      </Box>
    </Box>
  );
}

export default EditMyReservationsPage;