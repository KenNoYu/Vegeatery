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
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MyTheme from "./themes/MyTheme";

// import Tutorials from "./pages/Tutorials";
// import AddTutorial from "./pages/AddTutorial";
// import EditTutorial from "./pages/EditTutorial";
// import MyForm from "./pages/MyForm";
// import Register from "./pages/Register";
// import Login from "./pages/Login";

import PointsSystem from './pages/rewards/User/PointsSystem';
import PointsHistory from './pages/rewards/User/PointsHistory';
import AdminVouchersSystem from './pages/rewards/Admin/VouchersSystem';
import PointsRange from './pages/rewards/Admin/PointsRange';
import GeneralFeedback from './pages/feedback/User/GeneralFeedback';
import GeneralFeedbackEdit from './pages/feedback/User/GeneralFeedbackEdit';
import AdminGeneralFeedback from './pages/feedback/Admin/GeneralFeedback';

import http from "./http";
import UserContext from "./contexts/UserContext";
import logo from './assets/logo/vegeateryMain.png';



const theme = createTheme({
  typography: {
    fontFamily: "'Poppins', sans-serif",
  },
});

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get("/user/auth").then((res) => {
        setUser(res.data.user);
      });
    }
  }, []);

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
              <Route path="/rewards/user/pointssystem" element={<PointsSystem />} />
              <Route path="/rewards/user/pointshistory" element={<PointsHistory />} />
              <Route path="/rewards/admin/voucherssystem" element={<AdminVouchersSystem />} />
              <Route path="/rewards/admin/pointsrange" element={<PointsRange />} />
              <Route path="/feedback/user/generalfeedback" element={<GeneralFeedback/>} />
              <Route path="/general-feedback/edit/:id" element={<GeneralFeedbackEdit/>} />
              <Route path="/feedback/admin/generalfeedback" element={<AdminGeneralFeedback/>} />


            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
