import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, CircularProgress, Card, CardMedia, CardContent, Button } from '@mui/material';
import http from '../../http';
import { toast } from 'react-toastify';

function ProductDetails() {
  const { productId } = useParams(); // Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch product details from the API
    http
      .get(`/Category/${productId}`)
      .then((res) => {
        setProduct(res.data);
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
    <Container>
      {loading ? (
        <CircularProgress />
      ) : product ? (
        <Card>
          <CardMedia
            component="img"
            height="300"
            image={`${import.meta.env.VITE_FILE_BASE_URL}${product.imageFile}`} // Display product image
            alt={product.productName}
          />
          <CardContent>
            <Typography variant="h4">{product.productName}</Typography>
            <Typography variant="body1" color="textSecondary" gutterBottom>
              {product.productDescription}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Ingredients:</strong> {product.ingredients}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Calories:</strong> {product.calories} kcal
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Fats:</strong> {product.fats} g
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Carbs:</strong> {product.carbs} g
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Protein:</strong> {product.protein} g
            </Typography>
            <Typography variant="h6">Price: ${product.productPrice}</Typography>
            {product.discountPercentage > 0 && (
              <Typography variant="body2" color="primary">
                <strong>Discounted Price:</strong> ${product.discountedPrice} (-{product.discountPercentage}%)
              </Typography>
            )}
            <Button variant="contained" color="primary" onClick={() => navigate(`/viewcategories/${product.categoryId}`)} style={{ marginTop: '16px' }}>
              Back to Category
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Typography variant="h6" color="error">
          Product not found.
        </Typography>
      )}
    </Container>
  );
};

export default ProductDetails;
