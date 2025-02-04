import { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Button, Grid, TextField, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import http from '../../../http';
import { toast } from 'react-toastify';

const UserMenu = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // State for filtered products
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [filterValue, setFilterValue] = useState('');  // State for search filter value
  const [priceFilter, setPriceFilter] = useState(''); // State for price filter
  const [caloriesFilter, setCaloriesFilter] = useState(''); // State for calories filter
  const [pointsFilter, setPointsFilter] = useState(''); // State for points filter

  useEffect(() => {
    // Fetch categories from the API
    http
      .get('/Category/categories')
      .then((res) => {
        setCategories(res.data);
        if (res.data.length > 0) {
          const firstCategoryId = res.data[0].categoryId;
          setCurrentCategoryId(firstCategoryId);
          navigate(`/userviewcategories/${firstCategoryId}`);
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
          setFilteredProducts(res.data); // Initialize filtered products with all fetched products
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

  useEffect(() => {
    let filtered = [...products];

    // Apply the first filter (search by product name)
    if (filterValue) {
      filtered = filtered.filter((product) =>
        product.productName.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    // Apply the second filter (price order sorting)
    if (priceFilter === 'lowest') {
      filtered = filtered.sort((a, b) => a.productPrice - b.productPrice); // Sort from highest to lowest
    } else if (priceFilter === 'highest') {
      filtered = filtered.sort((a, b) => b.productPrice - a.productPrice); // Sort from lowest to highest
    }

    // Apply the third filter (calories order sorting)
    if (caloriesFilter == 'lowest') {
      filtered = filtered.sort((a, b) => a.calories - b.calories); // Sort from highest to lowest
    } else if (caloriesFilter === 'highest') {
      filtered = filtered.sort((a, b) => b.calories - a.calories); // Sort from lowest to highest
    }

    // Apply the fourth filter (points order sorting)
    if (pointsFilter == 'lowest') {
      filtered = filtered.sort((a, b) => a.productPoints - b.productPoints); // Sort from highest to lowest
    } else if (pointsFilter === 'highest') {
      filtered = filtered.sort((a, b) => b.productPoints - a.productPoints); // Sort from lowest to highest
    }

    setFilteredProducts(filtered);
  }, [filterValue, priceFilter, caloriesFilter, pointsFilter, products]);

  // When the user changes the price filter
  const handlePriceChange = (e) => {
    setPriceFilter(e.target.value);
    setCaloriesFilter("");  // Reset calories filter
    setPointsFilter("");  // Reset points filter
  };

  // When the user changes the calories filter
  const handleCaloriesChange = (e) => {
    setCaloriesFilter(e.target.value);
    setPriceFilter("");  // Reset price filter
    setPointsFilter("");  // Reset points filter
  };

  // When the user changes the points filter
  const handlePointsChange = (e) => {
    setPointsFilter(e.target.value);
    setPriceFilter("");  // Reset price filter
    setCaloriesFilter("");  // Reset calories filter
  };


  const handleCategoryClick = (event, categoryId) => {
    event.preventDefault();
    setCurrentCategoryId(categoryId);
    navigate(`/userviewcategories/${categoryId}`);
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

 

  return (
    <>
      <Grid container spacing={2}>
        {/* Full-width Navbar */}
        <Grid item xs={12}>
          <Container
            sx={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              backgroundColor: 'white',
              padding: '16px',
              marginTop: '60px',
              boxShadow: 2,
              maxWidth: '1200px',
              width: '100%',
            }}
          >
            {loading ? (
              <CircularProgress />
            ) : (
              <Box>
                <Box display="flex" gap={2} sx={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                  {categories.length === 0 ? (
                    <Typography>No categories available</Typography>
                  ) : (
                    categories.map((category) => (
                      <Button
                        key={category.categoryId}
                        onClick={(event) => handleCategoryClick(event, category.categoryId)}
                        sx={{
                          paddingLeft: '100px',
                          paddingRight: '100px',
                          backgroundColor: 'transparent',
                          color: currentCategoryId === category.categoryId ? '#C6487E' : '#000',
                          textDecoration: currentCategoryId === category.categoryId ? 'underline' : 'none',
                          '&:hover': {
                            backgroundColor: 'transparent',
                            color: '#C6487E',
                            textDecoration: 'underline',
                          },
                        }}
                      >
                        {category.categoryName}
                      </Button>
                    ))
                  )}
                </Box>
              </Box>
            )}
          </Container>
        </Grid>

        {/* Combined Container for Filters + Products */}
        <Grid item xs={12}>
          <Container
            sx={{
              border: '1px solid #ccc',
              borderRadius: '8px',
              backgroundColor: 'white',
              padding: '16px',
              marginBottom: '20px',
              boxShadow: 2,
              maxWidth: '1200px',
              width: '100%',
            }}
          >
            <Grid container spacing={10}>
              {/* Left Column - Search and Filters */}
              <Grid item xs={12} sm={4} md={3}>
                <Box
                  sx={{
                    backgroundColor: 'white',

                    padding: '8px',

                  }}
                >
                  {/* Search Filter Input */}
                  <TextField
                    label="Search Products"
                    variant="outlined"
                    fullWidth
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                    sx={{ marginBottom: '20px' }}
                  />

                  {/* Price Filter */}
                  <FormControl fullWidth>
                    <InputLabel id="price-filter-label">Price Order</InputLabel>
                    <Select labelId="price-filter-label" value={priceFilter} onChange={handlePriceChange} label="Price Order">
                      <MenuItem value="lowest">Lowest to Highest</MenuItem>
                      <MenuItem value="highest">Highest to Lowest</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Calories Filter */}
                  <FormControl fullWidth sx={{ marginTop: '20px' }}>
                    <InputLabel id="calories-filter-label">Calories Order</InputLabel>
                    <Select
                      labelId="calories-filter-label"
                      value={caloriesFilter}
                      onChange={handleCaloriesChange}
                      label="Calories Order"
                    >
                      <MenuItem value="lowest">Lowest to Highest</MenuItem>
                      <MenuItem value="highest">Highest to Lowest</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Points Filter */}
                  <FormControl fullWidth sx={{ marginTop: '20px' }}>
                    <InputLabel id="points-filter-label">Points Order</InputLabel>
                    <Select labelId="points-filter-label" value={pointsFilter} onChange={handlePointsChange} label="Points Order">
                      <MenuItem value="lowest">Lowest to Highest</MenuItem>
                      <MenuItem value="highest">Highest to Lowest</MenuItem>
                    </Select>
                  </FormControl>

                  {/* Remove Filters Button */}
                  <Button
                    variant="outlined"
                    color="#FFFFF"
                    sx={{ marginTop: '20px', width: '100%' }}
                    onClick={() => {
                      setPriceFilter('');
                      setCaloriesFilter('');
                      setPointsFilter('');
                    }}
                  >
                    Remove Filters
                  </Button>
                </Box>
              </Grid>

              {/* Right Column - Products */}
              <Grid item xs={12} sm={8} md={9}>
                {currentCategoryId && loadingProducts ? (
                  <CircularProgress />
                ) : currentCategoryId ? (
                  <Grid container spacing={2}>
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <Grid item xs={12} sm={4} md={4} key={product.productId}>
                          <Box
                            sx={{
                              border: '1px solid #ccc',
                              borderRadius: '16px',
                              boxShadow: 2,
                              overflow: 'hidden',
                              height: '100%',
                              width: '100%',
                            }}
                          >
                            <Box sx={{ padding: '20px' }}>
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
                            <Box sx={{ padding: '16px' }}>
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
                      <Typography sx={{ marginTop: '50px', marginLeft: '20px' }}>
                        No products found for this category.
                      </Typography>
                    )}
                  </Grid>
                ) : (
                  <Typography>Select a category to view products.</Typography>
                )}
              </Grid>
            </Grid>
          </Container>
        </Grid>
      </Grid>


    </>
  );
};

export default UserMenu;
