import { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Tabs, Tab, Grid, Card, CardContent, CardMedia, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import http from '../../http';
import { toast } from 'react-toastify';
import RoleGuard from '../../utils/RoleGuard';

const CategoryList = () => {
  RoleGuard('Admin');
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
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
          navigate(`/viewcategories/${firstCategoryId}`); // Update the URL
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
    navigate(`/viewcategories/${categoryId}`); // Update the URL with the selected category
  };

  return (
    <Container
      sx={{
        border: '1px solid #ccc', // Border around the entire container
        borderRadius: '8px', // Rounded corners for the container
        backgroundColor: 'white', // White background for the container
        padding: '16px', // Padding inside the container
        marginTop: '20px',
        marginBottom: '20px',
        boxShadow: 2, // Optional: add a shadow for extra depth
        height: '1075px',
        maxWidth: '1200px', // Set a max width for the container (adjust as needed)
        width: '100%', // Ensure the container takes up the full width of the parent element
      }}
    >
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5" gutterBottom style={{ marginLeft: '10px' }}>
          Categories
        </Typography>

        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/addproduct`)}
            style={{ marginBottom: '16px', background: '#C6487E', color: '#FFFFFF' }}
          >
            Add Product
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate(`/addcategory`)}
            style={{ marginBottom: '16px', marginLeft: '20px', background: '#C6487E', color: '#FFFFFF', }}
          >
            Add Category
          </Button>
        </Box>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <Box>
          {/* Horizontal navbar for categories */}
          <Tabs
            aria-label="Category Tabs"
            textColor="primary"
            indicatorColor="primary"
            value={`/viewcategories/${currentCategoryId}`} // Highlight based on the current category ID in URL

          >
            {categories.map((category) => (
              <Tab
                key={category.categoryId}
                label={`${category.categoryName} (${category.totalProduct} Items)`} // Display category name with the product count
                onClick={(event) => handleCategoryClick(event, category.categoryId)} // Handle category click
                value={`/viewcategories/${category.categoryId}`} // Ensure the selected tab stays highlighted
                sx={{
                  border: '2px solid #ccc', // Add border around each tab
                  borderRadius: '8px', // Rounded corners
                  margin: '10px', // Add space between tabs
                  padding: '40px', // Padding inside each tab
                  '&.Mui-selected': {
                    backgroundColor: '#', // Highlight the selected tab with a light background
                    color: '#1976d2', // Change the text color of the selected tab
                  },
                  '&:hover': {
                    backgroundColor: '#e0e0e0', // Hover effect to change background color
                  },
                }}
              />
            ))}
          </Tabs>
        </Box>
      )}

      {/* Display products for the selected category */}
      {currentCategoryId && loadingProducts ? (
        <CircularProgress />
      ) : currentCategoryId ? (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>Products in this Category</Typography>
          <Grid container spacing={2} justifyContent="flex-start"> {/* Add spacing for space between items */}
            {products.length > 0 ? (
              products.map((product) => (
                <Grid item xs={12} sm={6} md={3} key={product.productId} sx={{ padding: '0' }}>
                  <Card
                    sx={{
                      border: '1px solid #ccc',
                      borderRadius: '16px',
                      boxShadow: 2,
                      overflow: 'hidden',
                      height: '90%',
                      width: '100%',
                      margin: '0',
                    }}
                  >
                    <Box
                      sx={{
                        padding: '8px',
                        overflow: 'hidden',
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={`${import.meta.env.VITE_FILE_BASE_URL}${product.imageFile}`}
                        alt={product.productPrice}
                        onClick={() => navigate(`/product/${product.productId}`)}
                        sx={{
                          objectFit: 'cover',
                          height: '200px',
                          width: '100%',
                          borderRadius: '16px',
                        }}
                      />
                    </Box>
                    <CardContent>
                      <Typography variant="h6">{product.productName}</Typography>
                      <Typography variant="body2">Price: ${product.productPrice}</Typography>
                      <Typography variant="body2">{product.productPoints} Sustainable Points</Typography>
                      <Button
                        onClick={() => navigate(`/editproduct/${product.productId}`)}
                        sx={{ cursor: 'pointer', marginTop: '10px' }}
                      >
                        Edit
                      </Button>
                    </CardContent>
                  </Card>
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
  );
};

export default CategoryList;