import { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Tabs, Tab, Grid, Card, CardContent, CardMedia, Button, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
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

  const [currentCategoryId, setCurrentCategoryId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    http.get('/Category/categories')
      .then((res) => {
        setCategories(res.data);
        if (res.data.length > 0) {
          const firstCategoryId = res.data[0].categoryId;
          setCurrentCategoryId(firstCategoryId);
          navigate(`/viewcategories/${firstCategoryId}`);
        }
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Error fetching categories');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (currentCategoryId) {
      setLoadingProducts(true);
      http.get(`/Product/products?categoryId=${currentCategoryId}`)
        .then((res) => setProducts(res.data))
        .catch((err) => toast.error(err.response?.data?.message || 'Error fetching products'))
        .finally(() => setLoadingProducts(false));
    }
  }, [currentCategoryId]);

  const handleCategoryClick = (event, categoryId) => {
    event.preventDefault();
    setCurrentCategoryId(categoryId);
    navigate(`/viewcategories/${categoryId}`);
  };

  const handleEditCategory = (event, categoryId) => {
    event.stopPropagation();
    console.log("Navigating to:", `/editcategory/${categoryId}`);
    navigate(`/editcategory/${categoryId}`);
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? This will also delete all associated products.')) {
      http.delete(`/Category/${categoryId}`)
        .then(() => {
          toast.success('Category deleted successfully.');
          fetchCategories(); // Refresh categories after deletion
        })
        .catch((err) => toast.error(err.response?.data?.message || 'Error deleting category'));
    }
  };

  return (
    <Container sx={{ border: '1px solid #ccc', borderRadius: '8px', backgroundColor: 'white', padding: '16px', marginTop: '20px', marginBottom: '20px', boxShadow: 2, height: '1075px', maxWidth: '1200px', width: '100%' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" gutterBottom style={{ marginLeft: '10px' }}>Categories</Typography>

        <Box>
          <Button variant="contained" color="primary" onClick={() => navigate(`/addproduct`)} style={{ marginBottom: '16px', background: '#C6487E', color: '#FFFFFF' }}>Add Product</Button>
          <Button variant="contained" color="primary" onClick={() => navigate(`/addcategory`)} style={{ marginBottom: '16px', marginLeft: '20px', background: '#C6487E', color: '#FFFFFF' }}>Add Category</Button>
        </Box>
      </Box>

      {loading ? <CircularProgress /> : (
        <Box>
          <Tabs aria-label="Category Tabs" textColor="primary" indicatorColor="primary" value={`/viewcategories/${currentCategoryId}`}>
            {categories.map((category) => (
              <Tab
                key={category.categoryId}
                label={
                  <Box display="flex" alignItems="center">
                    {`${category.categoryName} (${category.totalProduct} Items)`}
                    
                    <IconButton size="small" color="error" onClick={() => handleDeleteCategory(category.categoryId)}><DeleteIcon /></IconButton>
                    <IconButton size="small" color="error" onClick={(event) => handleEditCategory(event,category.categoryId)}><EditIcon /></IconButton>
                  </Box>
                }
                onClick={(event) => handleCategoryClick(event, category.categoryId)}
                value={`/viewcategories/${category.categoryId}`}
                sx={{ border: '2px solid #ccc', borderRadius: '8px', margin: '10px', padding: '40px', '&.Mui-selected': { color: '#1976d2' }, '&:hover': { backgroundColor: '#e0e0e0' } }}
              />
            ))}
          </Tabs>
        </Box>
      )}

      {currentCategoryId && loadingProducts ? <CircularProgress /> : currentCategoryId ? (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>Products in this Category</Typography>
          <Grid container spacing={2} justifyContent="flex-start">
            {products.length > 0 ? products.map((product) => (
              <Grid item xs={12} sm={6} md={3} key={product.productId} sx={{ padding: '0' }}>
                <Card sx={{ border: '1px solid #ccc', borderRadius: '16px', boxShadow: 2, overflow: 'hidden', height: '90%', width: '100%', margin: '0' }}>
                  <Box sx={{ padding: '8px', overflow: 'hidden' }}>
                    <CardMedia component="img" image={`${import.meta.env.VITE_FILE_BASE_URL}${product.imageFile}`} alt={product.productPrice} onClick={() => navigate(`/product/${product.productId}`)} sx={{ objectFit: 'cover', height: '200px', width: '100%', borderRadius: '16px' }} />
                  </Box>
                  <CardContent>
                    <Typography variant="h6">{product.productName}</Typography>
                    <Typography variant="body2">Price: ${product.productPrice}</Typography>
                    <Typography variant="body2">{product.productPoints} Sustainable Points</Typography>
                    <Button onClick={() => navigate(`/editproduct/${product.productId}`)} sx={{ cursor: 'pointer', marginTop: '10px' }}>Edit</Button>
                  </CardContent>
                </Card>
              </Grid>
            )) : (
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
