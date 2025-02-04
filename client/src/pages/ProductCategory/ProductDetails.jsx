import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, CircularProgress, Box, Grid, Card, CardMedia } from '@mui/material';
import http from '../../http';
import { toast } from 'react-toastify';
import RoleGuard from '../../utils/RoleGuard';

function ProductDetails() {
  RoleGuard('Admin');
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    http
      .get(`/Product/${productId}`)
      .then((res) => {
        setProduct(res.data);
        console.log('Product details:', res.data);  // Log product data to see categoryId
      })
      .catch((err) => {
        const message = err.response?.data?.message || 'Error fetching product details';
        toast.error(message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [productId]);


  return (
    <Container sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
      <Box
        sx={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '20px',
          backgroundColor: 'white',
          width: '100%',
          maxWidth: '1200px',
          boxShadow: 2,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-start',
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : product ? (
          <>
            {/* Left Side - Product Information & Pricing/Stock */}
            <Box sx={{ width: '60%', paddingRight: '20px' }}>
              <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px', marginBottom: '16px', height: '500px' }}>
                <Typography variant="h5" gutterBottom sx={{ margin: '10px' }}>
                  Product Information
                </Typography>
                <Grid item xs={6} sx={{ marginTop: '10px' }}>
                  <Typography variant="h8" gutterBottom sx={{ margin: '10px' }}>
                    Product Name
                  </Typography>
                  <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px', marginBottom: '20px', marginLeft: '10px', marginRight: '10px' }}>
                    <Typography variant="h6">{product.productName}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h8" gutterBottom sx={{ margin: '10px' }}>
                    Product Name
                  </Typography>
                  <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px', marginBottom: '20px', marginLeft: '10px', marginRight: '10px', height: '115px' }}>
                    <Typography variant="body1" color="textSecondary">
                      {product.productDescription}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h8" gutterBottom sx={{ margin: '10px' }}>
                    Product Name
                  </Typography>
                  <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px', marginLeft: '10px', marginRight: '10px', height: '115px' }}>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Ingredients:</strong> {product.ingredients}
                    </Typography>
                  </Box>
                </Grid>
              </Box>

              <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px', marginBottom: '16px' }}>
                <Typography variant="h5" gutterBottom sx={{ margin: '10px' }}>
                  Pricing and Stock
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="h8" gutterBottom sx={{ margin: '10px' }}>
                      Product Name
                    </Typography>
                    <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px', marginLeft: '5px', marginRight: '10px' }}>
                      <Typography variant="body2" color="textSecondary">
                        Price: ${product.productPrice}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h8" gutterBottom sx={{ margin: '10px' }}>
                      Product Name
                    </Typography>
                    <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px', marginLeft: '5px', marginRight: '10px' }}>
                      <Typography variant="body2" color="textSecondary">
                        Stock: {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h8" gutterBottom sx={{ margin: '10px' }}>
                      Product Name
                    </Typography>
                    <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px', marginLeft: '5px', marginRight: '10px' }}>
                      <Typography variant="body2" color="textSecondary">
                        Discount: {product.discountPercentage}% off
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h8" gutterBottom sx={{ margin: '10px' }}>
                      Product Name
                    </Typography>
                    <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px', marginLeft: '5px', marginRight: '10px', marginBottom: '10px' }}>
                      <Typography variant="body2" color="textSecondary">
                        Discounted Price: ${product.discountedPrice}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>

            {/* Right Side - Image and Category */}
            <Box sx={{ width: '40%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Box sx={{
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '10px',
                marginBottom: '6px',
                height: '500px',
                display: 'flex', // Center the content vertically and horizontally
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden', // Prevent image overflow outside the container
              }}>
                <Card sx={{ boxShadow: 'none', width: '90%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '16px' }}>
                  <CardMedia
                    component="img"
                    height="300"
                    image={`${import.meta.env.VITE_FILE_BASE_URL}${product.imageFile}`}
                    alt={product.productName}
                    sx={{
                      objectFit: 'cover',  // Ensure the image fully covers the container
                      width: '100%', // Make sure it stretches to fill the container
                      height: '100%', // Ensure full height coverage
                    }}
                  />
                </Card>
              </Box>


              <Box sx={{ marginTop: '20px' }}>
                <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px', marginBottom: '16px', height: '200px' }}>
                  <Typography variant="h5" gutterBottom>
                    Category
                  </Typography>
                  <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px', marginTop: '16px' }}>
                    <Typography variant="body2" color="textSecondary">
                      Category: {product?.categoryName || 'Loading...'}
                    </Typography>
                  </Box>

                  <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px', marginTop: '16px' }}>
                    <Typography variant="body2" color="textSecondary">
                      Points: {product.productPoints}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          </>
        ) : (
          <Typography variant="h6" color="error">
            Product not found.
          </Typography>
        )}
      </Box>
    </Container >
  );
}

export default ProductDetails;
