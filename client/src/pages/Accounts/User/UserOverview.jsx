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
  IconButton,
  LinearProgress,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import Sidebar from "./UserSidebar.jsx";
import { styled } from "@mui/system";

function UserOverview() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

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
        console.log(res);
        setUser(res);
        getCustOrders(res.data.id)
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
      <Box sx={{ display: "flex", height: "100vh", marginTop: "2em" }}>
        {/* Sidebar */}
        <Box sx={{ width: "20%" }}>
          <Sidebar />
        </Box>

        {/* Main Content */}
        <Box
          sx={{
            width: "80%",
            padding: 5,
            backgroundColor: "#FFFFFF",
            marginTop: "5px",
            paddingLeft: "3em",
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
                src="/path-to-default-avatar.png"
                sx={{
                  width: 120,
                  height: 120,
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
              <Typography variant="h3" fontWeight="bold" gutterBottom>
                {user.data.username}
              </Typography>
              <Typography variant="h5" color="textSecondary" gutterBottom>
                BRONZE
                {/* Membership Tier: {user.membershipTier} */}
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
                  width: "100%",
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
            <Typography variant="h6" gutterBottom>
              Upcoming Reservations
            </Typography>
            <Card sx={{ mb: 2 }}>
              <CardContent
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Box>
                  <Typography variant="body1">4 Dec 2024, 7:00pm</Typography>
                  <Typography variant="caption" color="textSecondary">
                    15 Pax
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<EditIcon />}
                >
                  Edit Details
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardContent
                sx={{ display: "flex", justifyContent: "space-between" }}
              >
                <Box>
                  <Typography variant="body1">8 Dec 2024, 1:00pm</Typography>
                  <Typography variant="caption" color="textSecondary">
                    1 Baby Chair
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<EditIcon />}
                >
                  Edit Details
                </Button>
              </CardContent>
            </Card>
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Recent Purchases */}
          <Box>
            <Typography variant="h6" gutterBottom>
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
