import { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import http from '../../../http';
import { toast } from 'react-toastify';

const UserMenu = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const [currentCategoryId, setCurrentCategoryId] = useState(null);  // Track selected category

  useEffect(() => {
    // Fetch categories from the API
    http
      .get('/Category/categories')
      .then((res) => {
        setCategories(res.data);
        if (res.data.length > 0) {
          // Set the first category as default if categories are available
          const firstCategoryId = res.data[0].categoryId;
          setCurrentCategoryId(firstCategoryId);
          navigate(`/userviewcategories/${firstCategoryId}`); // Update the URL
        }
      })
      .catch((err) => {
        const message = err.response?.data?.message || 'Error fetching categories';
        toast.error(message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (currentCategoryId) {
      // Fetch products for the selected category
      setLoadingProducts(true);
      http
        .get(`/Product/products?categoryId=${currentCategoryId}`)
        .then((res) => {
          setProducts(res.data);
        })
        .catch((err) => {
          const message = err.response?.data?.message || 'Error fetching products';
          toast.error(message);
        })
        .finally(() => {
          setLoadingProducts(false);
        });
    }
  }, [currentCategoryId]);

  const handleCategoryClick = (event, categoryId) => {
    event.preventDefault(); // Prevent default navigation
    setCurrentCategoryId(categoryId); // Set the selected category ID
    navigate(`/userviewcategories/${categoryId}`); // Update the URL with the selected category
  };

  // get user info if available
  useEffect(() => {
    http
      .get("/auth/current-user", { withCredentials: true }) // withCredentials ensures cookies are sent
      .then((res) => {
        console.log(res);
        setUser(res);
        console.log(res.data.cartId)
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch user data", err);
        setError("Failed to fetch user data");
        setLoading(false);
      });
  }, []);

  // handle add to cart button
  const addToCart = (cartId, productId, productName, quantity) => {
    const cartData = {
      // auto fill id next time
      cartId: cartId,
      productId: productId,
      productName: productName,
      quantity: quantity,
    };

    http.post("/ordercart", cartData)
      .then((res) => {
        console.log("Added to cart:", res.data);
        alert(`Product added to cart!`);
      })
      .catch((error) => {
        console.error("Error adding product to cart:", error);
        alert("Failed to add product to cart.");
      });
  };

  return (
    <>
      {/* First Container - Category Navigation */}
      <Container
        sx={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          backgroundColor: 'white',
          padding: '16px',
          marginTop: '20px',
          boxShadow: 2,
          maxWidth: '1200px',
          width: '100%',
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : (
          <Box>
            {/* Navbar for categories */}
            <Box display="flex" justifyContent="space-between" sx={{ overflowX: 'auto' }}>
              {categories.map((category) => (
                <Button
                  key={category.categoryId}
                  onClick={(event) => handleCategoryClick(event, category.categoryId)}
                  sx={{
                    paddingLeft: '100px',
                    paddingRight: '100px',
                    backgroundColor: 'transparent',
                    color: currentCategoryId === category.categoryId ? '#C6487E' : '#000',
                    textDecoration: currentCategoryId === category.categoryId ? 'underline' : 'none', // Underline when active
                    '&:hover': {
                      backgroundColor: 'transparent',
                      color: '#C6487E', // Change text color on hover
                      textDecoration: 'underline', // Underline on hover
                    },
                  }}
                >
                  {category.categoryName}
                </Button>
              ))}
            </Box>
          </Box>
        )}
      </Container>

      {/* Second Container - Display Products for the selected category */}
      <Container
        sx={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          backgroundColor: 'white',
          padding: '16px',
          marginTop: '20px',
          marginBottom: '20px',
          boxShadow: 2,
          height: 'auto',
          maxWidth: '1200px',
          width: '100%',
        }}
      >
        {currentCategoryId && loadingProducts ? (
          <CircularProgress />
        ) : currentCategoryId ? (
          <Box mt={4}>
            <Grid container spacing={2} justifyContent="flex-start">
              {products.length > 0 ? (
                products.map((product) => (
                  <Grid item xs={12} sm={6} md={3} key={product.productId} sx={{ padding: '0' }}>
                    <Box
                      sx={{
                        border: '1px solid #ccc',
                        borderRadius: '16px',
                        boxShadow: 2,
                        overflow: 'hidden',
                        height: '100%',
                        width: '100%',
                        margin: '0',
                      }}
                    >
                      <Box sx={{ padding: '20px', overflow: 'hidden' }}>
                        <img
                          src={`${import.meta.env.VITE_FILE_BASE_URL}${product.imageFile}`}
                          alt={product.productName}
                          onClick={() => navigate(`/product/${product.productId}`)}
                          style={{
                            objectFit: 'cover',
                            height: '150px',
                            width: '100%',
                            borderRadius: '16px',
                          }}
                        />
                      </Box>
                      <Box sx={{ padding: '20px' }}>
                        <Typography variant="h6">{product.productName}</Typography>
                        <Typography variant="body2">Price: ${product.productPrice}</Typography>
                        <Typography variant="body2">{product.productPoints} Sustainable Points</Typography>
                        <Button
                          variant='contained'
                          color={user ? 'Accent' : 'secondary'}
                          onClick={() => addToCart(user.data.cartId, product.productId, product.productName, 1)}
                          sx={{ cursor: user ? 'pointer' : 'not-allowed', marginTop: '10px' }}
                          disabled={!user} // Disable if user is not logged in
                        >
                          Add to Cart
                        </Button>
                        {!user && (
                          <Typography variant="body2" color="error" sx={{ marginTop: '5px' }}>
                            You must log in to purchase.
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Grid>
                ))
              ) : (
                <Typography style={{ marginTop: '50px', marginLeft: '20px' }}>No products found for this category.</Typography>
              )}
            </Grid>
          </Box>
        ) : (
          <Typography>Select a category to view products.</Typography>
        )}
      </Container>
    </>
  );
};

export default UserMenu;
