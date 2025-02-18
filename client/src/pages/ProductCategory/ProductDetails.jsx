import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, CircularProgress, Box, Grid, Card, CardMedia, Button } from '@mui/material';
import http from '../../http';
import { toast } from 'react-toastify';
import RoleGuard from '../../utils/RoleGuard';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function ProductDetails() {
  RoleGuard('Admin');
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState();
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
    <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '30px' }}>
      <Box
        sx={{
          position: 'relative', // Needed for absolute positioning of buttons
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '20px',
          backgroundColor: 'white',
          width: '100%',
          maxWidth: '1400px',
          boxShadow: 2,
        }}
      >
        {/* Buttons at the top */}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            position: 'absolute',
            top: '20px',
            left: 0,
          }}
        >
          <Button sx={{ marginLeft: '20px' }} style={{ background: '#C6487E', color: '#FFFFFF' }} onClick={() => navigate('/admin/store')} startIcon={<ArrowBackIcon />}>
            Go Back
          </Button>
        </Box>
        {/* Form Fields Container */}
        <Box
          component="form"
          sx={{
            display: 'flex',
            flexDirection: 'row', // Ensures left and right fields are side by side
            gap: '20px', // Adds spacing between left and right sections
            marginTop: '60px', // Pushes the form down to avoid overlap with buttons
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : product ? (
            <>
              {/* Left Side - Product Information & Pricing/Stock */}
              <Box sx={{ flex: 6 }}>
                <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px', marginBottom: '16px', height: 'auto', width: '600px', overflow: 'hidden', wordWrap: 'break-word', whiteSpace: 'normal' }}>
                  <Grid item xs={12} sx={{ marginBottom: '10px' }}>
                    <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px', marginBottom: '20px' }}>
                      <Typography variant="h7"><strong>Product Name: </strong>{product.productName}</Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sx={{ marginBottom: '10px' }}>
                    <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px', marginBottom: '20px', height: '115px', overflow: "auto" }}>
                      <Typography variant="body1" color="textSecondary">
                        <strong>Description:</strong> {product.productDescription}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sx={{ marginBottom: '10px' }}>
                    <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px', height: '115px' }}>
                      <Typography variant="body1" color="textSecondary">
                        <strong>Ingredients:</strong> {product.ingredients}
                      </Typography>
                    </Box>
                  </Grid>
                </Box>

                <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px', marginBottom: '16px', width: '600px' }}>

                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px' }}>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Product Points: $</strong>{product.productPoints}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px' }}>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Price: $</strong>{product.productPrice}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px' }}>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Discount: $</strong>{product.discountedPrice} ({product.discountPercentage}% off)
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px' }}>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Stocks: </strong>{product.stocks}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px' }}>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Category: </strong>{product?.categoryName || 'Loading...'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px' }}>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Contains: </strong>{product.allergyIngredients}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>

              {/* Right Side - Image and Category */}
              <Box sx={{ width: '50%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  padding: '10px',
                  marginBottom: '6px',
                  height: '428px',
                  display: 'flex', // Center the content vertically and horizontally
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden', // Prevent image overflow outside the container
                }}>
                  <Card sx={{ boxShadow: 'none', width: '90%', display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '16px' }}>
                    <CardMedia
                      component="img"
                      height="200"
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



                <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px', marginBottom: '16px', marginTop: '10px' }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px' }}>
                        <Typography variant="body2" color="textSecondary">
                        <strong>Calories: </strong>{product.calories}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px' }}>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Fats (g): </strong>{product.fats}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px' }}>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Carbs (g): </strong>{product.carbs}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px' }}>
                        <Typography variant="body2" color="textSecondary">
                          <strong>Protein (g): </strong>{product.protein}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Box>
              </Box>

            </>
          ) : (
            <Typography variant="h6" color="error">
              Product not found.
            </Typography>
          )}
        </Box>
      </Box>
    </Container >
  );
}

export default ProductDetails;
