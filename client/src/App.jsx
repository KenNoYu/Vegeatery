import "./App.css";
import { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Container,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Button,
  Tooltip,
} from "@mui/material";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import MyTheme from "./themes/MyTheme";
import DarkTheme from "./themes/DarkTheme";
import http from "./http";
import UserContext from "./contexts/UserContext";
import logoLight from "./assets/logo/vegeateryMain.png";
import logoDark from "./assets/logo/vegeateryWhite.png";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

// PRODUCTS
import CategoryList from "./pages/ProductCategory/ViewCategories";
import AddCategory from "./pages/ProductCategory/AddCategory";
import AddProduct from "./pages/ProductCategory/AddProduct";
import ProductDetails from "./pages/ProductCategory/ProductDetails";
import EditProduct from "./pages/ProductCategory/EditProduct";
import UserMenu from "./pages/ProductCategory/User/UserMenu";
import EditCategory from "./pages/ProductCategory/EditCategory";
import UserProductDetails from "./pages/ProductCategory/User/UserProductDetails";
import StaffStockPage from "./pages/ProductCategory/Staff/StaffDashboard";
import StaffProductLogs from "./pages/ProductCategory/Staff/StaffLogs"

// REWARDS
import PointsSystem from "./pages/rewards/User/PointsSystem";
import PointsHistory from "./pages/rewards/User/PointsHistory";
import AdminVouchersSystem from "./pages/rewards/Admin/VouchersSystem";
import AdminVouchersSystemEdit from "./pages/rewards/Admin/VouchersSystemEdit";
import VouchersSystemAdd from "./pages/rewards/Admin/VouchersSystemAdd";
import PointsRange from "./pages/rewards/Admin/PointsRange";

// FEEDBACKS
import GeneralFeedback from "./pages/feedback/User/GeneralFeedback";
import GeneralFeedbackAdd from "./pages/feedback/User/GeneralFeedbackAdd";
import AdminGeneralFeedback from "./pages/feedback/Admin/GeneralFeedback";
import RatingStatistics from "./pages/feedback/Admin/RatingStatistics";

// RESERVATIONS
import ReservationPage from "./pages/Reservation/AddReservation";
import ConfirmationPage from "./pages/Reservation/ConfirmedReservation";
import StaffReservations from "./pages/Reservation/StaffReservations";
import StaffReserveLogs from "./pages/Reservation/StaffLogs";
import StaffFocusedReservation from "./pages/Reservation/StaffFocusedReservation";
import StaffAddReservation from "./pages/Reservation/StaffAddReservation";

// ORDERS
import Cart from "./pages/orders/Cart";
import Orders from "./pages/orders/Order";
import Checkout from "./pages/orders/Checkout";
import OrderConfirmation from "./pages/orders/OrderConfirmation";
import StaffOrders from "./pages/orders/StaffOrders";
import AdminOrders from "./pages/orders/AdminOrders";

import Register from "./pages/Accounts/User/Register";
import Login from "./pages/Accounts/User/Login";
import Home from "./pages/Home";
import MyForm from "./pages/MyForm";

// Accounts
import UserOverview from "./pages/Accounts/User/UserOverview";
import Profile from "./pages/Accounts/User/Profile";
import Unauthorized from "./pages/Accounts/User/Unauthorized";
import Accounts from "./pages/Accounts/Admin/Accounts";
import RequestPasswordReset from "./pages/Accounts/User/RequestPasswordReset";
import ResetPassword from "./pages/Accounts/User/ResetPassword";
import MyOrdersPage from "./pages/Accounts/User/OrderHistory";
import UserProfileView from "./pages/Accounts/Admin/UserProfileView";
import RoleModify from "./pages/Accounts/Admin/RoleModify";

// Navbar
import { CircularProgress } from "@mui/material"; // import CircularProgress
import { AccountCircle } from "@mui/icons-material"; // Import AccountCircle icon

function App() {
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Function to close the menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    http
      .get("/Auth/auth", { withCredentials: true })
      .then((res) => {
        setUser(res.data.user);
        setLoading(false); // Update loading state when data is fetched
      })
      .catch((err) => {
        console.error("Error fetching user data", err);
        setLoading(false); // Stop loading even if there's an error
      });
  }, []);

  const logout = () => {
    // Send POST request to logout and clear cookie
    http
      .post("/auth/logout", {}, { withCredentials: true })
      .then((res) => {
        console.log(res.data.message); // Log the logout success message
        localStorage.clear(); // Optionally clear localStorage as well
        window.location = "/"; // Redirect to the login or home page
      })
      .catch((err) => {
        console.error("Error during logout", err);
      });
  };

  // track if app bar is dark
  const currentThemeIsDark = user?.role === "Admin" || user?.role === "Staff";
  const currentLogo =
    currentThemeIsDark && user?.role === "Admin"
      ? logoDark
      : currentThemeIsDark
      ? logoDark
      : logoLight;

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <ThemeProvider theme={MyTheme}>
          <ThemeProvider theme={currentThemeIsDark ? DarkTheme : MyTheme}>
            <AppBar position="fixed" className="AppBar">
              <Container>
                <Toolbar
                  disableGutters={true}
                  sx={{ width: "100%", justifyContent: "space-between" }}
                >
                  {/* Left side: 3 directories */}
                  <Box sx={{ display: "flex", gap: 3 }}>
                    {/* Conditional Rendering based on user.role */}
                    {loading ? (
                      <CircularProgress color="inherit" />
                    ) : user ? (
                      <>
                        {/* Show navigation for 'admin' role */}
                        {user.role === "Admin" && (
                          <>
                            <Link to="/admin/overview">
                              <Typography>Overview</Typography>
                            </Link>
                            <Link to="/admin/store">
                              <Typography>Store</Typography>
                            </Link>
                            <Link to="/admin/rewards">
                              <Typography>Rewards</Typography>
                            </Link>
                          </>
                        )}

                      {/* Show navigation for 'staff' role */}
                      {user.role === "Staff" && (
                        <>
                          <Link to="/staff/vieworders">
                            <Typography>Orders</Typography>
                          </Link>
                          <Link to="/staff/viewstocks">
                            <Typography>Products</Typography>
                          </Link>
                          <Link to="/staff/viewreservations">
                            <Typography>Reservations</Typography>
                          </Link>
                        </>
                      )}

                        {/* Show navigation for 'customer' role */}
                        {user.role === "User" && (
                          <>
                            <Link to="/user/store">
                              <Typography>Store</Typography>
                            </Link>
                            <Link to="/user/rewards">
                              <Typography>Rewards</Typography>
                            </Link>
                            <Link to="/user/feedback">
                              <Typography>Feedback</Typography>
                            </Link>
                          </>
                        )}
                      </>
                    ) : (
                      // Show default navigation for unauthenticated users
                      <>
                        <Link to="/user/store">
                          <Typography>Store</Typography>
                        </Link>
                        <Link to="/rewards">
                          <Typography>Rewards</Typography>
                        </Link>
                        <Link to="/feedback">
                          <Typography>Feedback</Typography>
                        </Link>
                      </>
                    )}
                  </Box>

                  {/* Center logo (now an image) */}
                  <Box
                    sx={{
                      flexGrow: 1,
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Link to="/">
                      <img
                        src={currentLogo}
                        alt="Vegeatery Logo"
                        style={{ height: "50px", width: "auto" }}
                      />
                    </Link>
                  </Box>

                  {/* Right side: 2 directories and sign-in button */}
                  <Box sx={{ display: "flex", gap: 3, alignItems: "center" }}>
                    {loading ? (
                      <CircularProgress color="inherit" />
                    ) : user ? (
                      <>
                        {/* Show navigation for 'admin' role */}
                        {user.role === "Admin" && (
                          <>
                            <Link to="/admin/accounts">
                              <Typography>Accounts</Typography>
                            </Link>
                            <Link to="/admin/feedback">
                              <Typography>Feedback</Typography>
                            </Link>
                          </>
                        )}

                        {/* Show navigation for 'staff' role */}
                        {user.role === "Staff" && <></>}

                        {/* Show navigation for 'customer' role */}
                        {user.role === "User" && (
                          <>
                            <Link to="/reserve">
                              <Typography>Reserve</Typography>
                            </Link>
                            <Cart />
                          </>
                        )}
                      </>
                    ) : (
                      // Show default navigation for unauthenticated users
                      <>
                        <Link to="/reserve">
                          <Typography>Reserve</Typography>
                        </Link>
                      </>
                    )}

                    {loading ? ( // Show loading spinner until user state is set
                      <CircularProgress color="inherit" />
                    ) : user ? (
                      <>
                        {/* Profile Icon and Menu */}
                        <IconButton onClick={handleMenuClick} color="inherit">
                          <AccountCircle />
                        </IconButton>

                        {/* Menu for profile options */}
                        <Menu
                          anchorEl={anchorEl}
                          open={Boolean(anchorEl)}
                          onClose={handleMenuClose}
                        >
                          <MenuItem onClick={handleMenuClose}>
                            <Link
                              to="/overview"
                              style={{ textDecoration: "none", color: "black" }}
                            >
                              Account Overview
                            </Link>
                          </MenuItem>
                          <MenuItem onClick={logout}>Logout</MenuItem>
                        </Menu>
                      </>
                    ) : (
                      <>
                        <Link to="/register">
                          <Typography color="Accent">
                            <b>Register</b>
                          </Typography>
                        </Link>
                        <Link to="/login">
                          <Typography color="Accent">
                            <b>Login</b>
                          </Typography>
                        </Link>
                      </>
                    )}
                  </Box>
                </Toolbar>
              </Container>
            </AppBar>
          </ThemeProvider>

          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>

          {/* SideBar Content */}
          <Container maxWidth={false} disableGutters>
            <Routes>
              <Route path={"/staff/viewstocks"} element={<StaffStockPage />} />
              <Route path={"/staff/productlogs"} element={<StaffProductLogs />} />
              <Route path={"/viewcategories/:id"} element={<CategoryList />} />
              <Route path={"/admin/store"} element={<CategoryList />} />
              <Route path="/editproduct/:productId" element={<EditProduct />} />
              <Route path="/user/store" element={<UserMenu />} />
              <Route path={"/userviewcategories/:id"} element={<UserMenu />} />
              <Route path="/user/profile/:userId" element={<UserProfileView />}/>
              <Route path="/admin/roleModify" element={<RoleModify />} />
              <Route path="/admin/accounts" element={<Accounts />} />
              <Route path="/user/profile" element={<Profile />} />
              <Route path="/overview" element={<UserOverview />} />
              <Route path="/user/orders" element={<MyOrdersPage />} />
            </Routes>
          </Container>

          <Container sx={{ paddingTop: "64px" }}>
            <Routes>
              {/* ACCOUNTS */}
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/form" element={<MyForm />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/requestreset" element={<RequestPasswordReset />} />
              <Route path="/passwordreset" element={<ResetPassword />} />

              {/* PRODUCTS */}
              <Route path={"/addcategory"} element={<AddCategory />} />
              <Route path={"/addproduct"} element={<AddProduct />} />
              <Route path="/product/:productId" element={<ProductDetails />} />
              <Route path={"/editcategory/:categoryId"} element={<EditCategory />} />
              <Route path={"/userproduct/:productId"} element= {<UserProductDetails />} />

              {/* RESERVATION */}
              <Route path="/reserve" element={<ReservationPage />} />
              <Route path="/reserve/confirmed" element={<ConfirmationPage />} />
              <Route path="/staff/viewreservations" element={<StaffReservations />}/>
              <Route path="/staff/reservationlogs" element={<StaffReserveLogs />}/>
              <Route path="/staff/viewreservations/:id" element={<StaffFocusedReservation />}/>
              <Route path="/staff/addreservation" element={<StaffAddReservation />}/>

              {/* REWARDS */}
              <Route path="/user/rewards" element={<PointsSystem />} />
              <Route path="/user/pointshistory" element={<PointsHistory />} />
              <Route path="/admin/rewards" element={<AdminVouchersSystem />} />
              <Route path="/rewards/admin/voucherssystem/edit/:id" element={<AdminVouchersSystemEdit />}/>
              <Route path="/admin/voucherssystemadd" element={<VouchersSystemAdd />}/>
              <Route path="/admin/pointsrange" element={<PointsRange />} />
              <Route path="/user/feedback" element={<GeneralFeedback />} />
              <Route path="/user/generalfeedbackadd" element={<GeneralFeedbackAdd />}/>
              <Route path="/admin/feedback" element={<AdminGeneralFeedback />}/>
              <Route path="/admin/ratingstatistics" element={<RatingStatistics />}/>

              {/* ORDERS */}
              <Route path={"/orders"} element={<Orders />} />
              <Route path={"/checkout"} element={<Checkout />} />
              <Route path={"/orderconfirmation"} element={<OrderConfirmation />}/>
              <Route path={"/staff/vieworders"} element={<StaffOrders />} />
              <Route path={"/admin/orders"} element={<AdminOrders />} />
            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
