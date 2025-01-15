import { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Tabs, Tab, Grid, Card, CardContent, CardMedia, Button } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import http from '../../http';
import { toast } from 'react-toastify';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Get the selected category ID from the URL
  const currentCategoryId = location.pathname.split('/')[2] || null;

  useEffect(() => {
    // Fetch categories from the API
    http
      .get('/Category/categories')
      .then((res) => {
        setCategories(res.data);
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
        .get(`/Category/products?categoryId=${currentCategoryId}`)
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
    navigate(`/viewcategories/${categoryId}`); // Update the URL with the selected category
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Categories</Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Box>
          {/* Horizontal navbar for categories */}
          <Tabs
            aria-label="Category Tabs"
            textColor="primary"
            indicatorColor="primary"
            centered
            value={`/viewcategories/${currentCategoryId}`} // Highlight based on the current category ID in URL
          >
            {categories.map((category) => (
              <Tab
                key={category.categoryId}
                label={category.categoryName}
                onClick={(event) => handleCategoryClick(event, category.categoryId)} // Handle category click
                value={`/viewcategories/${category.categoryId}`} // Ensure the selected tab stays highlighted
              />
            ))}
          </Tabs>
        </Box>
      )}
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => navigate(`/addproduct`)} 
        style={{ marginBottom: '16px' }}
      >
        Add Product
      </Button>

      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => navigate(`/addcategory`)} 
        style={{ marginBottom: '16px', marginLeft: '20px' }}
      >
        Add Category
      </Button>

      {/* Display products for the selected category */}
      {currentCategoryId && loadingProducts ? (
        <CircularProgress />
      ) : currentCategoryId ? (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>Products in this Category</Typography>
          <Grid container spacing={2}>
            {products.length > 0 ? (
              products.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.productId}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="140"
                      image={`${import.meta.env.VITE_FILE_BASE_URL}${product.imageFile}`} // Display product image
                      alt={product.productPrice}
                      onClick={() => navigate(`/product/${product.productId}`)} style={{ cursor: 'pointer' }}
                    />
                    <CardContent>
                      <Typography variant="h6">{product.productName}</Typography>
                      <Typography variant="body2">{product.productDescription}</Typography>
                      <Typography variant="body2">Price: ${product.productPrice}</Typography>
                      <Button onClick={() => navigate(`/editproduct/${product.productId}`)} style={{ cursor: 'pointer' }}>Edit</Button>
                    </CardContent>
                    
                  </Card>
                </Grid>
              ))
            ) : (
              <Typography style={{ marginTop: '50px', marginLeft: '20px' }} >No products found for this category.</Typography>
            )}
          </Grid>
        </Box>
      ) : (
        <Typography
        >Select a category to view products.</Typography>
      )}
    </Container>
  );
};

export default CategoryList;
