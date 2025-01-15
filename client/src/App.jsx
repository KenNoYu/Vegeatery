import './App.css';
import { useState, useEffect } from 'react';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import MyTheme from './themes/MyTheme';
import CategoryList from './pages/ViewCategories';
import AddCategory from './pages/AddCategory';
import AddProduct from './pages/AddProduct';
import ProductDetails from './pages/ProductDetails';
import EditProduct from './pages/EditProduct';
import http from './http';
import UserContext from './contexts/UserContext';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("accessToken")) {
      http.get('/user/auth').then((res) => {
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
        

          <Container>
            <Routes>
              <Route path={"/addcategory"} element={<AddCategory />} />
              <Route path={"/viewcategories"} element={<CategoryList />} />
              <Route path={"/addproduct"} element={<AddProduct />} />
              <Route path={"/viewcategories/:id"} element={<CategoryList />} />
              <Route path="/product/:productId" element={<ProductDetails />} />
              <Route path="/editproduct/:productId" element={<EditProduct />} />
            </Routes>
          </Container>
        </ThemeProvider>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
