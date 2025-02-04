// src/pages/StaffReservations.js
import React, { useState, useEffect } from 'react';
import { Box, Drawer, Typography, ToggleButtonGroup, ToggleButton, Stack, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import http from '../../http';
import { useTheme } from '@mui/material/styles';

import RoleGuard from '../../utils/RoleGuard';


const StaffReserveLogs = () => {
  RoleGuard('Staff');
  const navigate = useNavigate();
  const theme = useTheme();
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    try {
      const response = await http.get("/Reservation/GetReservationLogs");
      console.log(response.data);  // Log the response data for debugging
      setLogs(response.data);  // Assuming you have a state called 'reservations'
    } catch (error) {
      console.error("Error fetching reservation logs:", error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

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
          backgroundColor: 'white',
          width: '100%',
          height: '80vh',
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          flexDirection: 'column',
          borderTopRightRadius: '20px',
          borderBottomRightRadius: '20px',
          overflow: 'auto',
        }}
      >
        <Box sx={{ width: '80%', margin: '50px 0', display: "flex", justifyContent: "center" }}>


          <ToggleButtonGroup value="audit" sx={{
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
              textTransform: "none"
            }} onClick={() => navigate("/staff/viewreservations")}>
              Reservations
            </ToggleButton>
            <ToggleButton value="audit" sx={{
              textTransform: "none"
            }}>
              Audit Log
            </ToggleButton>
          </ToggleButtonGroup>

        </Box>

        {/* logs List */}
        {logs.length > 0 ? (
          <Stack spacing={2} sx={{ width: "80%", marginBottom: "50px" }}>
            {logs.map((logs) => (
              <Card
                key={logs.id}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px",
                  backgroundColor:
                    logs.action === "created"
                      ? "#90EE90"
                      : logs.action === "seated"
                        ? theme.palette.secondary.main
                        : logs.action === "edited"
                          ? "#FBE970"
                          : "#E7ABC5"
                }}
              >
                <CardContent sx={{ flex: "1" }}>
                  <Typography variant="h6">
                    {logs.reservation.customerName}
                  </Typography>
                  <Typography variant="body2">
                    {logs.reservation.customerPhone} | {logs.reservation.customerEmail}
                  </Typography>
                  <Typography variant="body2" sx={{ marginTop: "10px" }}>
                    Table(s) {logs.tables}
                  </Typography>
                </CardContent>
                <Typography variant="h6" sx={{ marginRight: "20px", textAlign: "center" }}>
                  {logs.reservation.timeSlot} <br />
                  <Typography variant="body2">
                    {logs.action} by {logs.doneBy}
                  </Typography>
                </Typography>

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
            No logs!
          </Typography>
        )}

      </Box>
    </Box>
  );
};

export default StaffReserveLogs;
