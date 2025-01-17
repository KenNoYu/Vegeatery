import React, { useState, useEffect } from 'react';
import { Box, Drawer, Typography, Button, Grid, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import http from '../../http';
import { useTheme } from '@mui/material/styles';
import { ToastContainer, toast } from "react-toastify";
import DateSelector from "./Components/DateSelector";
import isDateTimeBeforeNow from "./AddReservation";

const StaffFocusedReservation = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const { id } = useParams();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [unreserveOpen, setUnreserveOpen] = useState(false);

  const handleUnreserveOpen = () => setUnreserveOpen(true);
  const handleUnreserveClose = () => setUnreserveOpen(false);

  const handleUnreserveConfirm = () => {
    onUnreserveConfirm(reservation.id); // Perform the cancellation action
    setUnreserveOpen(false); // Close the modal
  };

  const [tables, setTables] = useState([
    { id: 1, status: "available", pax: 2 },
    { id: 2, status: "unavailable", pax: 2 },
    { id: 3, status: "available", pax: 2 },
    { id: 4, status: "available", pax: 4 },
    { id: 5, status: "available", pax: 4 },
    { id: 6, status: "unavailable", pax: 5 },
  ]);

  const times = [
    "11:00am", "11:30am", "12:00pm", "12:30pm",
    "1:00pm", "1:30pm", "2:00pm", "2:30pm",
    "3:00pm", "3:30pm", "4:00pm", "4:30pm",
    "5:00pm", "5:30pm", "6:00pm", "6:30pm",
    "7:00pm", "7:30pm", "8:00pm", "8:30pm",
  ];

  const fetchReservationById = async () => {
    setLoading(true);
    try {
      const response = await http.get(`/Reservation/GetReservationById/${id}`);
      console.log(response.data);
      setReservation(response.data);
    } catch (error) {
      console.error("Error fetching reservation:", error);
    } finally {
      setLoading(false);
    }
  };

  const onUnreserveConfirm = async (reservationId) => {
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
        "tables": reservation.tables
      }

      console.log(logData)

      const logResponse = await http.post("/Reservation/CreateReservationLog", logData);
      console.log("Reservation log created:", logResponse.data);

      toast.success("Reservation cancelled!");
      navigate("/staff/viewreservations")
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      toast.error("Failed to cancel reservation.");
    }
  };

  useEffect(() => {
    fetchReservationById();
  }, [id]);

  if (loading) {
    toast.info("Loading reservation...");
    return null;
  }

  return (

    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '40px',
        boxShadow: 2,
        borderRadius: '20px'
      }}
    >
      <Box
        sx={{
          width: '20%',
          height: '80vh',
          backgroundColor: 'black',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderTopLeftRadius: '20px',
          borderBottomLeftRadius: '20px'
        }}
      >
        <Typography variant="h6" color="primary">Sidebar Content</Typography>
      </Box>
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
          overflow: 'auto',
        }}
      >

        <Box
          sx={{
            flex: 1,
            p: 4,
          }}
        >
          <Button
      onClick={() => navigate('/staff/viewreservations')}
      sx={{
        textTransform: 'none',
        color: 'black',
        '&:hover': {
          color: 'grey',
        },
      }}
    >
      Back
    </Button>

          {/* Date Selector */}
          <DateSelector
            selectedDate={reservation.reservationDate}
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
              return (
                <Button
                  key={time}
                  variant="outlined"
                  color={reservation.timeSlot === time ? "primary" : "default"}
                  sx={{
                    backgroundColor: reservation.timeSlot === time ? theme.palette.Accent.main : "primary",
                    width: "90px",
                    "&:hover": {
                      backgroundColor: reservation.timeSlot === time ? "none" : "#E7ABC5",
                    },
                  }}
                >
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

          <Typography variant="h5" gutterBottom>
            {reservation.customerName} <br/>
            <Typography>
            {reservation.customerPhone} | {reservation.customerEmail}
            </Typography>
          </Typography>
          <Box sx={{ textAlign: "center", marginTop: "20px" }}>
            <Grid container spacing={2} justifyContent="center">
              {tables.map((table) => (
                <Grid item xs={12} sm={8} md={6} lg={4} key={table.id}>
                  <Button
                    variant="contained"
                    sx={{
                      padding: "20px",
                      backgroundColor:
                      reservation.tables.split(",").includes(String(table.id))
                          ? theme.palette.Accent.main
                          : table.status === "unavailable"
                            ? theme.palette.secondaryText.main
                            : theme.palette.primary.main,
                      color: table.status === "unavailable" || reservation.tables.split(",").includes(String(table.id)) ? "#fff" : "#000",
                      cursor: table.status !== "unavailable" ? "pointer" : "not-allowed",
                    }}
                  >
                    Table {table.id}<br />
                    {table.pax} Pax
                  </Button>
                </Grid>
              ))}
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
                sx={{
                  backgroundColor: theme.palette.Accent.main,
                  color: theme.palette.primary.main,
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

      {/* Confirmation Modal */}
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
              backgroundColor: theme.palette.Accent.main,
              '&:hover': {
                backgroundColor: '#E7ABC5',
              },
            }}
          >
            Yes, Unreserve
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default StaffFocusedReservation;
