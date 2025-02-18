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
import NoOrders from "../../../assets/NoOrders.png"

const UserOverview = () => {
  RoleGuard(["User", "Admin", "Staff"]);
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [pendingReservations, setPendingReservations] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const myTheme = useTheme();

  const handleClick = () => {
    navigate("/user/profile");
  };

  const StoreNav = () => {
    navigate("/user/store");
  };

  const checkoutNav = () => {
    navigate("/orders");
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

  // Delete items in cart
  const deleteCartItems = async (cartId, productId) => {
    http.delete(`/ordercart?CartId=${cartId}&ProductId=${productId}`)
      .then((res) => res)
      .catch((error) => {
        console.error("Error deleting cart item:", error);
        throw error; // Ensure errors propagate to `buyAgain`
      });
  }

  // get cart items
  const GetCartItems = () => {
    // autofill cartId next time
    http.get(`/ordercart?cartId=${user.data.cartId}`).then((res) => {
      setCartItems(res.data);
    })
      .catch((error) => {
        console.error("Error fetching cart items:", error);
      })
  };

  // handle add to cart button
  const addToCart = async (cartId, productId, productName, quantity) => {
    const cartData = {
      // auto fill id next time
      cartId: cartId,
      productId: productId,
      productName: productName,
      quantity: quantity,
    };

    http.post("/ordercart", cartData)
      .then((res) => res)
      .catch((error) => {
        console.error("Error adding product to cart:", error);
        throw error; // Ensure errors propagate to `buyAgain`
      });
  };

  useEffect(() => {
    if (user?.data.cartId) {
      GetCartItems();
    }
  }, [user]);

  const buyAgain = async (order) => {
    try { // Add a try-catch block for better error handling
      await GetCartItems();
      if (Array.isArray(cartItems) && cartItems.length > 0) {
        for (const item of cartItems) {
          await Promise.all(
            cartItems.map((item) => deleteCartItems(user.data.cartId, item.productId))
          );
        }
      }

      await Promise.all(
        order.orderItems.map((product) =>
          addToCart(user.data.cartId, product.productId, product.productName, product.quantity)
        )
      );

      checkoutNav();
    } catch (error) {
      console.error("Error during buy again process:", error);
    }
  };

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
              <>
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <img
                    src="/assets/reservationicons/NoReservations.png"
                    alt="No Reservations"
                    style={{ width: '70px', height: '70px', opacity: 0.6 }}
                  />
                  <Typography
                    variant="h6"
                    sx={{
                      color: "gray",
                      textAlign: "center",
                    }}
                  >
                    No upcoming reservations!
                  </Typography>
                </div>
              </>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          {/* Recent Purchases */}
          <Box>
            <Typography variant="h5" gutterBottom fontWeight="bold" mb="0.5em">
              Recent Purchases
            </Typography>
            {orders.length > 0 ? (
              orders
                .slice(0, 3) // Show only the 3 most recent orders
                .map((order, i) => {
                  // Format order date
                  const orderDate = new Date(order.orderDate).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  });

                  return (
                    <Card key={order.orderId || i} sx={{ mb: 2, boxShadow: 3, borderRadius: 2 }}>
                      <CardContent
                        sx={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 2,
                        }}
                      >
                        {/* Order Header */}
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                          }}
                        >
                          <Typography variant="subtitle1" fontWeight="bold">
                            Order ID: #{order.orderId}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Date: {orderDate}
                          </Typography>
                        </Box>

                        {/* Order Items */}
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                          {order.orderItems.map((item, index) => (
                            <Box
                              key={item.productId || index}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1,
                                bgcolor: '#f5f5f5',
                                p: 1,
                                borderRadius: 1,
                              }}
                            >
                              <img
                                src={`${import.meta.env.VITE_FILE_BASE_URL}${item.imageFile}`}
                                alt={item.productName}
                                style={{ width: 60, height: 60, borderRadius: 4 }}
                              />
                              <Box>
                                <Typography variant="body2" fontWeight="medium">
                                  {item.productName}
                                </Typography>
                                <Typography variant="caption" color="textSecondary">
                                  x{item.quantity}
                                </Typography>
                              </Box>
                            </Box>
                          ))}
                        </Box>

                        {/* Total and Actions */}
                        <Box
                          sx={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mt: 2,
                          }}
                        >
                          <Typography variant="subtitle1" fontWeight="bold">
                            Total: ${order.totalPrice.toFixed(2)}
                          </Typography>
                          <Button variant="contained" size="small" color="Accent" onClick={() => buyAgain(order)}>
                            Buy Again
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  );
                })
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  p: 3,
                  borderRadius: "8px",
                  m: "5%"
                }}
              >
                {/* Illustration */}
                <img
                  src={NoOrders} // Replace with your illustration path
                  alt="No purchases"
                  style={{ width: "120px", height: "auto", marginBottom: "1em" }}
                />
                {/* Message */}
                <Typography variant="body1" sx={{ color: "text.secondary", marginBottom: "1em" }}>
                  No past purchases yet. Start exploring our products!
                </Typography>
                <Button
                  variant="contained"
                  color="Accent"
                  sx={{ borderRadius: "8px", textTransform: "none", fontSize: "1rem" }}
                  onClick={StoreNav}
                >
                  Explore Products
                </Button>
              </Box>
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
