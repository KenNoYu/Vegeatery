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
import Tutorials from "./pages/Tutorials";
import AddTutorial from "./pages/AddTutorial";
import EditTutorial from "./pages/EditTutorial";
import MyForm from "./pages/MyForm";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import http from "./http";
import UserContext from "./contexts/UserContext";
import logo from "./assets/logo/vegeateryMain.png";
import UserOverview from "./pages/UserOverview";
import Profile from "./pages/Profile";
import { CircularProgress } from "@mui/material"; // import CircularProgress
import { AccountCircle } from '@mui/icons-material';
import Unauthorized from "./pages/Unauthorized";
import Accounts from "./pages/Accounts";

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
    if (localStorage.getItem("accessToken")) {
      http
        .get("/Auth/auth")
        .then((res) => {
          console.log(res.data.user.id);
          setUser(res.data.user);
          setLoading(false); // Update loading state when data is fetched
        })
        .catch((err) => {
          console.error("Error fetching user data", err);
          setLoading(false); // Stop loading even if there's an error
        });
    } else {
      setLoading(false); // If no token, stop loading
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
              <Route path="/tutorials" element={<Tutorials />} />
              <Route path="/addtutorial" element={<AddTutorial />} />
              <Route path="/edittutorial/:id" element={<EditTutorial />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/form" element={<MyForm />} />
              <Route path="/overview" element={<UserOverview />} />
              <Route path="/overview/profile" element={<Profile />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/Admin/Accounts" element={<Accounts />} />
            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
