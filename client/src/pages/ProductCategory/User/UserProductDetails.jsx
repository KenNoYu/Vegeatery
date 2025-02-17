import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, CircularProgress, Box, Grid, Card, CardMedia, Button } from '@mui/material';
import http from '../../../http';
import { toast } from 'react-toastify';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function UserProductDetails() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [user, setUser] = useState();

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

  useEffect(() => {
    http
      .get("/auth/current-user", { withCredentials: true }) // withCredentials ensures cookies are sent
      .then((res) => {
        console.log(res); // Log the full response
        // Log just the data part of the response
        console.log(res.data);
        // Set the user state with only the allergyInfo data
        setUser(res.data);

        console.log(res.data.cartId);
        setLoading(false); // Once data is fetched, loading is false
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
        toast.success(`${cartData.productName} added to Cart!`)
      })
      .catch((error) => {
        console.error("Error adding product to cart:", error);
        toast.error(`failed to add ${cartData.productName}to Cart!`)
      });
  };


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
          flexDirection: 'column', // Change to column for stacking elements
          alignItems: 'flex-start',
          position: 'relative', // Ensures absolute positioning works
        }}
      >
        {/* Button at the top-left */}
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'flex-start', // Align to the left
            marginBottom: '20px', // Space out the button
          }}
        >
          <Button
            sx={{ marginLeft: '20px' }}
            style={{ background: '#C6487E', color: '#FFFFFF' }}
            onClick={() => navigate('/user/store')}
            startIcon={<ArrowBackIcon />} // Add the back icon
          >
            Go Back
          </Button>
        </Box>

        {loading ? (
          <CircularProgress />
        ) : product ? (
          <>
            {/* Left Side - Image */}
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'row', marginBottom: '20px' }}>
              <Box sx={{ width: '50%', paddingRight: '20px' }}>
                <Box
                  sx={{
                    height: '500px',
                    display: 'flex',
                    justifyContent: 'center', // Center the content vertically and horizontally
                    alignItems: 'center',
                    overflow: 'hidden', // Prevent image overflow outside the container
                    borderRadius: '50px'
                  }}
                >
                  <Card sx={{ boxShadow: 'none', width: '80%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <CardMedia
                      component="img"
                      height="400"
                      image={`${import.meta.env.VITE_FILE_BASE_URL}${product.imageFile}`}
                      alt={product.productName}
                      sx={{
                        objectFit: 'cover', // Ensure the image fully covers the container
                        width: '100%', // Make sure it stretches to fill the container
                        height: '100%', // Ensure full height coverage
                      }}
                    />
                  </Card>
                </Box>
              </Box>

              {/* Right Side - Product Information */}
              <Box sx={{ width: '50%' }}>
                <Box sx={{ marginBottom: '16px', height: '600px' }}>
                  <Grid item xs={6}>
                    <Box sx={{ marginBottom: '10px', marginLeft: '30px', marginRight: '10px' }}>
                      <Typography variant="h4"><strong>{product.productName}</strong></Typography>
                    </Box>
                  </Grid>
                  <Grid container alignItems="center" spacing={2} sx={{ marginBottom: '10px', marginLeft: '12px', marginRight: '10px' }}>
                    {product.discountPercentage > 0 ? (
                      // Show Discounted Price & Percentage if a discount exists
                      <>
                        <Grid item>
                          <Typography variant="h5">
                            ${product.discountedPrice}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Typography variant="h6" color="textSecondary">
                            {product.discountPercentage}% off
                          </Typography>
                        </Grid>
                      </>
                    ) : (
                      // Show Actual Price if there's no discount
                      <Grid item>
                        <Typography variant="h5" color="textSecondary">
                          ${product.productPrice}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>



                  <Grid item xs={6}>
                    <Box sx={{ marginBottom: '20px', marginLeft: '30px', marginRight: '10px' }}>
                      <Typography variant="h6" color="#C6487E">
                        {product.productPoints} Sustainable Points
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ marginBottom: '20px', marginLeft: '30px', marginRight: '10px', height: '115px', width: '450px', overflow: 'hidden', wordWrap: 'break-word', whiteSpace: 'normal' }}>
                      <Typography variant="h8">
                        <strong>Description: </strong>{product.productDescription}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ marginBottom: '20px', marginLeft: '30px', marginRight: '10px', height: '115px', width: '450px', overflow: 'hidden', wordWrap: 'break-word', whiteSpace: 'normal' }}>
                      <Typography variant="h8">
                        <strong>Ingredients: </strong>{product.ingredients}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ marginLeft: '30px', marginRight: '10px', height: '70px', width: '450px' }}>
                      <Typography variant="h8">
                        <strong>Contains: </strong>{product.allergyIngredients}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h8" sx={{ marginLeft: '30px', marginRight: '10px', height: '115px' }}>
                      <strong>Nutrition Values: </strong>
                    </Typography>
                    <Box sx={{ marginLeft: '30px', marginRight: '10px', height: '50px' }}>
                      <Typography variant="h8">
                        {product.calories} Calories, {product.fats} Fats, {product.protein} Proteins, {product.carbs} Carbohydrates
                      </Typography>
                    </Box>
                  </Grid>
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                    <Button
                      variant="contained"
                      color={user ? 'Accent' : 'secondary'}
                      onClick={() => addToCart(user.cartId, product.productId, product.productName, 1)}
                      sx={{
                        width: '90%',  // Adjust width to fit within the container
                        maxWidth: '300px',  // Prevent it from being too large
                        cursor: user ? 'pointer' : 'not-allowed'
                      }}
                      disabled={!user} // Disable if user is not logged in or product is inactive
                    >
                      Add to Cart
                    </Button>
                  </Box>

                  {/* Show login warning if user is not logged in */}
                  {!user && (
                    <Typography variant="body2" color="error" sx={{ marginTop: '5px', textAlign: 'center' }}>
                      You must log in to purchase.
                    </Typography>
                  )}
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

export default UserProductDetails;
