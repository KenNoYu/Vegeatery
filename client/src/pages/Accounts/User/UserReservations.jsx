import React, { useState, useEffect } from 'react';
import { Box, Button, CardContent, Typography, Grid2 as Grid, Card, Stack } from '@mui/material';
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
import { useNavigate } from 'react-router-dom';


const MyReservationsPage = () => {
  RoleGuard('User');
  const myTheme = useTheme();
  const navigate = useNavigate()
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pendingReservations, setPendingReservations] = useState([]);
  const [pastReservations, setPastReservations] = useState([]);

  useEffect(() => {
    http
      .get("/auth/current-user", { withCredentials: true }) // withCredentials ensures cookies are sent
      .then((res) => {
        console.log(res);
        setUser(res.data);
        fetchPendingReservations(res.data.id);
        fetchPastReservations(res.data.id);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch user data", err);
        setError("Failed to fetch user data");
        setLoading(false);
      });
  }, []);

  const fetchPendingReservations = async (userId) => {
    try {
      const response = await http.get(`/Reservation/UserPending/${userId}`);
      setPendingReservations(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch pending reservations.');
      setLoading(false);
      toast.error('Error fetching reservations');
    }
  };

  const fetchPastReservations = async (userId) => {
    try {
      const response = await http.get(`/Reservation/UserPast/${userId}`);
      setPastReservations(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch pending reservations.');
      setLoading(false);
      toast.error('Error fetching reservations');
    }
  };

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
        <Typography variant="h5" sx={{ my: 2 }}>
          Upcoming Reservations
        </Typography>
        {pendingReservations.length > 0 ? (
          <Stack spacing={2} sx={{ width: "100%", marginBottom: "50px" }}>
            {pendingReservations.map((reservation) => (
              <Card
                key={reservation.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: " 5px 20px",
                  backgroundColor: myTheme.palette.secondary.main
                }}
              >
                <CardContent sx={{ flex: "1" }}>
                  <Typography variant="h6">
                    {
                      new Intl.DateTimeFormat('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      }).format(new Date(reservation.reservationDate))
                    }, {reservation.customerName}
                  </Typography>
                  <Typography variant="body2">
                    {reservation.timeSlot}
                  </Typography>
                  <Typography variant="body2" sx={{ marginTop: "10px" }}>
                    Table(s) {reservation.tables.map(table => table.tableNumber).join(", ")}
                  </Typography>
                </CardContent>
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: "#C6487E",
                    color: "white",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate(`/user/reservations/${reservation.id}`)}
                >
                  EDIT
                </Button>


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
            No upcoming reservations!
          </Typography>
        )}

        
        {pastReservations.length > 0 && (
          <Stack spacing={2} sx={{ width: "100%", marginBottom: "50px" }}>
          <Typography variant="h5" sx={{ my: 2 }}>
          Past Reservations
          </Typography>
            {pastReservations.map((reservation) => (
              <Card
                key={reservation.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: " 5px 20px",
                  backgroundColor: myTheme.palette.secondary.main
                }}
              >
                <CardContent sx={{ flex: "1" }}>
                  <Typography variant="h6">
                    {
                      new Intl.DateTimeFormat('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      }).format(new Date(reservation.reservationDate))
                    }, {reservation.customerName}
                  </Typography>
                  <Typography variant="body2">
                    {reservation.timeSlot}
                  </Typography>
                  <Typography variant="body2" sx={{ marginTop: "10px" }}>
                    Table(s) {reservation.tables.map(table => table.tableNumber).join(", ")}
                  </Typography>
                </CardContent>

              </Card>
            ))}
          </Stack>
        )}
      </Box>
    </Box>
  );
}

export default MyReservationsPage;