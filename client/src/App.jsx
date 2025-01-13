import './App.css';
import { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import PointsSystem from './pages/rewards/User/PointsSystem';
import PointsHistory from './pages/rewards/User/PointsHistory';
import AdminVouchersSystem from './pages/rewards/Admin/VouchersSystem';
import PointsRange from './pages/rewards/Admin/PointsRange';
import GeneralFeedback from './pages/feedback/User/GeneralFeedback';
import GeneralFeedbackEdit from './pages/feedback/User/GeneralFeedbackEdit';
import AdminGeneralFeedback from './pages/feedback/Admin/GeneralFeedback';
import http from './http';
import UserContext from './contexts/UserContext';

const theme = createTheme({
  typography: {
    fontFamily: "'Poppins', sans-serif",
  },
});

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get('/user/auth').then((res) => {
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
              <Toolbar disableGutters={true}>
                <Link to="/">
                  <Typography variant="h6" component="div">
                    Learning
                  </Typography>
                </Link>
                <Box sx={{ flexGrow: 1 }}></Box>
                {user && (
                  <Typography>{user.name}</Typography>
                )}
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
