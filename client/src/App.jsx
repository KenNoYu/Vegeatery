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
  Button
} from "@mui/material";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import MyTheme from "./themes/MyTheme";
import http from "./http";
import UserContext from "./contexts/UserContext";
import logo from './assets/logo/vegeateryMain.png';

// PRODUCTS
import CategoryList from './pages/ProductCategory/ViewCategories';
import AddCategory from './pages/ProductCategory/AddCategory';
import AddProduct from './pages/ProductCategory/AddProduct';
import ProductDetails from './pages/ProductCategory/ProductDetails';
import EditProduct from './pages/ProductCategory/EditProduct';

// REWARDS
import PointsSystem from './pages/rewards/User/PointsSystem';
import PointsHistory from './pages/rewards/User/PointsHistory';
import AdminVouchersSystem from './pages/rewards/Admin/VouchersSystem';
import AdminVouchersSystemEdit from './pages/rewards/Admin/VouchersSystemEdit';
import PointsRange from './pages/rewards/Admin/PointsRange';

// FEEDBACKS
import GeneralFeedback from './pages/feedback/User/GeneralFeedback';
import GeneralFeedbackEdit from './pages/feedback/User/GeneralFeedbackEdit';
import AdminGeneralFeedback from './pages/feedback/Admin/GeneralFeedback';

// RESERVATIONS
import ReservationPage from "./pages/Reservation/AddReservation";
import ConfirmationPage from "./pages/Reservation/ConfirmedReservation";
import StaffReservations from "./pages/Reservation/StaffReservations";
import StaffReserveLogs from "./pages/Reservation/StaffLogs";
import StaffFocusedReservation from "./pages/Reservation/StaffFocusedReservation";

// ORDERS
import Cart from './pages/orders/Cart';
import Orders from './pages/orders/Order';
import Checkout from './pages/orders/Checkout';
import OrderConfirmation from './pages/orders/OrderConfirmation';
import StaffOrders from './pages/orders/StaffOrders';

import Tutorials from "./pages/Tutorials";
import AddTutorial from "./pages/AddTutorial";
import EditTutorial from "./pages/EditTutorial";
import MyForm from "./pages/MyForm";
import Register from "./pages/Accounts/User/Register";
import Login from "./pages/Accounts/User/Login";
import Home from "./pages/Home";
import ProductsTemp from "./pages/ProductTemporary";

// Accounts
import UserOverview from "./pages/Accounts/User/UserOverview";
import Profile from "./pages/Accounts/User/Profile";
import Unauthorized from "./pages/Accounts/User/Unauthorized";
import Accounts from "./pages/Accounts/Admin/Accounts";

// Navbar
import { CircularProgress } from "@mui/material"; // import CircularProgress
import { AccountCircle } from '@mui/icons-material'; // Import AccountCircle icon

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
          console.log(res.data.user.id);
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
        console.log(res.data.message);  // Log the logout success message
        localStorage.clear();  // Optionally clear localStorage as well
        window.location = "/";  // Redirect to the login or home page
      })
      .catch((err) => {
        console.error("Error during logout", err);
      });
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <ThemeProvider theme={MyTheme}>
        <AppBar position="static" className="AppBar">
      <Container>
        <Toolbar disableGutters={true} sx={{ width: "100%", justifyContent: "space-between" }}>
          {/* Left side: 3 directories */}
          <Box sx={{ display: "flex", gap: 3 }}>
            <Link to="/store">
              <Typography>Store</Typography>
            </Link>
            <Link to="/rewards">
              <Typography>Rewards</Typography>
            </Link>
            <Link to="/reserve">
              <Typography>Reserve</Typography>
            </Link>
          </Box>

          {/* Center logo (now an image) */}
          <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
            <Link to="/home">
              <img src={logo} alt="Vegeatery Logo" style={{ height: "50px", width: "auto" }} />
            </Link>
          </Box>

          {/* Right side: 2 directories and sign-in button */}
          <Box sx={{ display: "flex", gap: 3 }}>
            <Link to="/story">
              <Typography>Our Story</Typography>
            </Link>
            <Link to="/feedback">
              <Typography>Feedback</Typography>
            </Link>

            {loading ? (  // Show loading spinner until user state is set
              <CircularProgress color="inherit" />
            ) : user ? (
              <>
                {/* Profile Icon and Menu */}
                <IconButton
                  onClick={handleMenuClick}
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>

                {/* Menu for profile options */}
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                >
                  <MenuItem onClick={handleMenuClose}>
                    <Link to="/overview" style={{ textDecoration: 'none', color: 'black' }}>
                      Manage Profile
                    </Link>
                  </MenuItem>
                  <MenuItem onClick={logout}>Logout</MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Link to="/register"><Typography color="Accent"><b>Register</b></Typography></Link>
                <Link to="/login"><Typography color="Accent"><b>Login</b></Typography></Link>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
              <Container>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path={"/productsTemporary"} element={<ProductsTemp />} />
                  <Route path="/tutorials" element={<Tutorials />} />
                  <Route path="/addtutorial" element={<AddTutorial />} />
                  <Route path="/edittutorial/:id" element={<EditTutorial />} />
                  {/* ACCOUNTS */}
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/form" element={<MyForm />} />
                  <Route path="/overview" element={<UserOverview />} />
                  <Route path="/overview/profile" element={<Profile />} />
                  <Route path="/unauthorized" element={<Unauthorized />} />
                  <Route path="/Admin/Accounts" element={<Accounts />} />
                  {/* PRODUCTS */}
                  <Route path={"/addcategory"} element={<AddCategory />} />
                  <Route path={"/viewcategories"} element={<CategoryList />} />
                  <Route path={"/addproduct"} element={<AddProduct />} />
                  <Route path={"/viewcategories/:id"} element={<CategoryList />} />
                  <Route path="/product/:productId" element={<ProductDetails />} />
                  <Route path="/editproduct/:productId" element={<EditProduct />} />
                  {/* RESERVATION */}
                  <Route path="/reserve" element={<ReservationPage/>} />
                  <Route path="/reserve/confirmed" element={<ConfirmationPage/>} />
                  <Route path="/staff/viewreservations" element={<StaffReservations/>} />
                  <Route path="/staff/reservationlogs" element={<StaffReserveLogs/>} />
                  <Route path="/staff/viewreservations/:id" element={<StaffFocusedReservation/>}/>
                  {/* REWARDS */}
                  <Route path="/rewards/user/pointssystem" element={<PointsSystem />} />
                  <Route path="/rewards/user/pointshistory" element={<PointsHistory />} />
                  <Route path="/rewards/admin/voucherssystem" element={<AdminVouchersSystem />} />
                  <Route path="/rewards/admin/pointsrange" element={<PointsRange />} />
                  <Route path="/feedback/user/generalfeedback" element={<GeneralFeedback />} />
                  <Route path="/general-feedback/edit/:id" element={<GeneralFeedbackEdit />} />
                  <Route path="/feedback/admin/generalfeedback" element={<AdminGeneralFeedback />} />
                  {/* ORDERS */}
                  <Route path={"/cart"} element={<Cart />} />
                  <Route path={"/orders"} element={<Orders />} />
                  <Route path={"/checkout"} element={<Checkout />} />
                  <Route path={"/orderconfirmation"} element={<OrderConfirmation />} />
                  <Route path={"/stafforders"} element={<StaffOrders />} />
                </Routes>
              </Container>
            </ThemeProvider>
          </Router>
        </UserContext.Provider>
  );
}

export default App;
