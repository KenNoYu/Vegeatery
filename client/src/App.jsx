import "./App.css";
import { useState, useEffect } from "react";
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import MyTheme from "./themes/MyTheme";
import Tutorials from "./pages/Tutorials";
import AddTutorial from "./pages/AddTutorial";
import EditTutorial from "./pages/EditTutorial";
import MyForm from "./pages/MyForm";
import Register from "./pages/Register";
import Login from "./pages/Login";
import http from "./http";
import UserContext from "./contexts/UserContext";
import logo from './assets/logo/vegeateryMain.png';

// PRODUCTS
import CategoryList from './pages/ProductCategory/ViewCategories';
import AddCategory from './pages/ProductCategory/AddCategory';
import AddProduct from './pages/ProductCategory/AddProduct';
import ProductDetails from './pages/ProductCategory/ProductDetails';
import EditProduct from './pages/ProductCategory/EditProduct';

// RESERVATIONS
import ReservationPage from "./pages/Reservation/AddReservation";
import ConfirmationPage from "./pages/Reservation/ConfirmedReservation";
import StaffReservations from "./pages/Reservation/StaffReservations";
import StaffReserveLogs from "./pages/Reservation/StaffLogs";
import StaffFocusedReservation from "./pages/Reservation/StaffFocusedReservation";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get("/user/auth").then((res) => {
        setUser(res.data.user);
      });
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location = "/";
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
  <Router>
    <ThemeProvider theme={MyTheme}>
      <AppBar position="static" className="AppBar">
        <Container>
          <Toolbar disableGutters={true} sx={{ width: '100%', justifyContent: 'space-between' }}>
            
            {/* Left side: 3 directories */}
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Link to="/store"><Typography>Store</Typography></Link>
              <Link to="/rewards"><Typography>Rewards</Typography></Link>
              <Link to="/reserve"><Typography>Reserve</Typography></Link>
            </Box>

            {/* Center logo (now an image) */}
            <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center' }}>
              <Link to="/home">
                <img 
                  src={logo} 
                  alt="Vegeatery Logo" 
                  style={{ height: '50px', width: 'auto' }} 
                />
              </Link>
            </Box>

            {/* Right side: 2 directories and sign-in button */}
            <Box sx={{ display: 'flex', gap: 3 }}>
              <Link to="/story"><Typography>Our Story</Typography></Link>
              <Link to="/feedback"><Typography>Feedback</Typography></Link>
              
              {user ? (
                <>
                  <Typography>{user.name}</Typography>
                  <Button onClick={logout} color="Accent">Logout</Button>
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
          <Route path="/" element={<Tutorials />} />
          <Route path="/tutorials" element={<Tutorials />} />
          <Route path="/addtutorial" element={<AddTutorial />} />
          <Route path="/edittutorial/:id" element={<EditTutorial />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/form" element={<MyForm />} />
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
         </Routes>
      </Container>
    </ThemeProvider>
  </Router>
</UserContext.Provider>
  );
}

export default App;
