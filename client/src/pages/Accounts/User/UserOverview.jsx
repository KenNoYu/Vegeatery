import React, { useState, useEffect } from "react";
import http from "../../../http.js";
import {
  Grid,
  Box,
  Typography,
  Avatar,
  Button,
  Divider,
  Card,
  CardContent,
  Stack
} from "@mui/material";
import { ToastContainer, toast } from 'react-toastify';
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import Sidebar from "./UserSidebar.jsx";
import { styled } from "@mui/system";
import RoleGuard from "../../../utils/RoleGuard.js";
import { useTheme } from "@emotion/react";

const UserOverview = () => {
  RoleGuard(["User", "Admin", "Staff"]);
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [pendingReservations, setPendingReservations] = useState([]);
  const navigate = useNavigate();
  const myTheme = useTheme();

  const handleClick = () => {
    navigate("/user/profile");
  };

  const ProfileImage = styled(Avatar)(({ theme }) => ({
    width: theme.spacing(12),
    height: theme.spacing(12),
    marginBottom: theme.spacing(2),
  }));
  useEffect(() => {
    http
      .get("/auth/current-user", { withCredentials: true }) // withCredentials ensures cookies are sent
      .then((res) => {
        console.log(res.data.imageFile);
        setUser(res);
        setProfileImage(res.data.imageFile);
        getCustOrders(res.data.id);
        fetchPendingReservations(res.data.id);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch user data", err);
        setError("Failed to fetch user data");
        setLoading(false);
      });
  }, []);

  const getCustOrders = (userId) => {
    http.get(`/order/customerId?custId=${userId}`)
      .then((res) => {
        setLoading(false);
        setOrders(res.data || []);
        console.log("API response:", res.data);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error fetching orders:", error);
      })
  }

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

  const StyledTierName = styled(Typography)(({ theme, tierColor }) => ({
    textTransform: 'uppercase',
    fontWeight: 'bold',
    textShadow: `2px 2px 4px rgba(0, 0, 0, 0.2)`,
    letterSpacing: '0.1em',
    color: tierColor,
  }));

  const TierDisplay = ({ tierName }) => {
    const getTierColor = (tier) => {
      switch (tier?.toLowerCase()) {
        case 'bronze':
          return '#CD7F32'; // Bronze hex code
        case 'silver':
          return '#C0C0C0'; // Silver hex code
        case 'gold':
          return '#FFD700'; // Gold hex code
        default:
          return 'textSecondary';
      }
    };

    const tierColor = getTierColor(tierName);

    return (
      <StyledTierName variant="h5" tierColor={tierColor} gutterBottom>
        {tierName}
      </StyledTierName>
    );
  };


  // If still loading, show a loading message
  if (loading) {
    return <div>Loading...</div>;
  }

  // If there was an error, display the error message
  if (error) {
    return <div>{error}</div>;
  }

  // If user data is available, display the user profile
  if (user) {
    return (
      <Box sx={{ display: "flex", height: "100%", marginTop: "2em" }}>
        <Sidebar />
        <Box
          sx={{
            marginLeft: "240px",
            flexGrow: 1,
            height: "100%",
            paddingTop: "3em",
            paddingRight: "3em",
            paddingLeft: "3em",
            backgroundColor: "#FFFFFF",
            marginTop: "0.5em",
            borderTopRightRadius: "1em",
          }}
        >
          {/* Profile Header */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              width: "100%",
              padding: 3,
            }}
          >
            {/* 1st Column: Profile Image and Upload Image Button */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                padding: 2,
                textAlign: "center",
                borderRight: 2,
                borderColor: "divider",
              }}
            >
              <ProfileImage
                alt={user.username}
                src={
                  profileImage
                    ? `${import.meta.env.VITE_FILE_BASE_URL}${profileImage}`
                    : '/path/to/default-image.jpg'  // Provide a fallback image if no profile image is set
                }
                sx={{
                  width: 160,
                  height: 160,
                  borderRadius: "50%",
                  marginBottom: 2,
                  border: "4px solid #fff",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                }}
              />
            </Box>

            {/* 2nd Column: Membership Info */}
            <Box
              sx={{
                flex: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingLeft: 3,
                textAlign: "left",
              }}
            >
              <TierDisplay tierName={user.data.tierName} />
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                {user.data.username}
              </Typography>

              <Typography
                variant="subtitle2"
                sx={{
                  width: "fit-content",
                  backgroundColor: "#007BFF", // A stronger blue color
                  color: "white",
                  borderRadius: "12px",
                  padding: "4px 12px",
                  display: "inline-block", // To make sure the background wraps tightly around the text
                  marginBottom: 3,
                }}
              >
                {user.data.roleName}
              </Typography>

              <Typography variant="subtitle2" color="textSecondary">
                Joined on{" "}
                {new Date(user.data.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </Typography>
              {/* <Typography variant="subtitle2" color="textSecondary">
                  Expires: {user.membershipExpiration}
                </Typography> */}
            </Box>

            {/* 3rd Column: Edit and Delete Profile Buttons */}
            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: 2,
                marginTop: 3,
              }}
            >
              <Button
                onClick={handleClick}
                sx={{
                  backgroundColor: "#C6487E",
                  color: "#fff",
                  width: "60%",
                  marginBottom: 2,
                  "&:hover": {
                    backgroundColor: "#A83866",
                  },
                }}
              >
                View Profile
              </Button>
            </Box>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Upcoming Reservations */}
          <Box>
            <Typography variant="h5" gutterBottom fontWeight="bold" mb="0.5em">
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
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Recent Purchases */}
          <Box>
            <Typography variant="h5" gutterBottom fontWeight="bold" mb="0.5em">
              Recent Purchases
            </Typography>
            {orders.length > 0 ? (
              orders.map((order, i) => {
                return (
                  <Card sx={{ mb: 2 }}>
                    <CardContent
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Box key={order.orderId || i} sx={{ display: "flex", gap: 2 }}>
                        <Typography variant="body1">{order.date}</Typography>
                        {order.orderItems.map((item, i) => {
                          return (
                            <>
                              <img
                                src="/path/to/product.jpg"
                                alt="Product"
                                style={{ width: 80, height: 80 }}
                              />
                              <Box>
                                <Typography variant="body1">{item.productName}</Typography>
                                <Typography variant="caption" color="textSecondary">
                                  x{item.quantity}
                                </Typography>
                              </Box>
                            </>
                          )
                        })}
                      </Box>
                      <Box sx={{ textAlign: "right" }}>
                        <Typography variant="body1">$10.50</Typography>
                        <Button variant="contained" size="small">
                          Buy Again
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <Typography variant="body1" sx={{ mt: 2 }}>
                No Past Purchases
              </Typography>
            )}
          </Box>
        </Box>
      </Box>
    );
  }
  // Fallback rendering if no user or error
  return <div>No user data available.</div>;
}

export default UserOverview;
