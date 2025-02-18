import { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Button, Grid, TextField, Select, MenuItem, InputLabel, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { styled } from "@mui/system";
import http from '../../../http';
import { toast } from 'react-toastify';


const DetailsTextField = styled(TextField)(({ theme }) => ({
  "& .MuiInputLabel-root.Mui-focused": {
    color: "black", // Label color when focused and at the top
  },
  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": {
      borderColor: "black", // Outline on hover
    },
    "&.Mui-focused fieldset": {
      borderColor: "black", // Outline when focused
    },
  },
  "& .MuiInputLabel-root": {
    color: "black", // Label color
  },
  "& .Mui-focused": {
    color: "black", // Label when focused
  },
}));

const DetailedSelect = styled(Select)(({ theme }) => ({
  "& .MuiInputLabel-root.Mui-focused": {
    color: "black", // Label color when focused and at the top
  },
  "& .MuiOutlinedInput-root": {
    "&:hover fieldset": {
      borderColor: "black", // Outline on hover
    },
    "&.Mui-focused fieldset": {
      borderColor: "black", // Outline when focused
    },
    "& fieldset": {
      borderColor: "black", // Default border color
      borderWidth: "1px", // Ensure the border width is consistent
    },
  },

  // Ensuring InputLabel stays in place and is styled properly
  "& .MuiInputLabel-root": {
    color: "black", // Label color
    "&.Mui-focused": {
      color: "black", // Keep the label color black when focused
    },
  },

  // Customizing the select dropdown icon
  "& .MuiSelect-icon": {
    color: "black", // Color of the dropdown icon
  },



  // Style for selected item
  "& .Mui-selected": {
    backgroundColor: "#c0c0c0", // Background of selected item
    "&:hover": {
      backgroundColor: "#b0b0b0", // Hover effect on selected item
    },
  },
}));


const CustomCheckbox = styled(Checkbox)(({ theme }) => ({
  color: "black", // Default color
  "&.Mui-checked": {
    color: "Green", // Color when checked
  },
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.1)", // Slight hover effect
  },
  "&.Mui-disabled": {
    color: "gray", // Color when disabled
  },
}));


const UserMenu = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [user, setUser] = useState({
    allergyInfo: "",
  });
  const navigate = useNavigate();
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [filterValue, setFilterValue] = useState('');  // State for search filter value
  const [priceFilter, setPriceFilter] = useState(''); // State for price filter
  const [caloriesFilter, setCaloriesFilter] = useState(''); // State for calories filter
  const [pointsFilter, setPointsFilter] = useState(''); // State for points filter
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [allergyFilter, setAllergyFilter] = useState(false);  // Allergy filter state

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

  const handleCategoryClick = (event, categoryId) => {
    event.preventDefault();
    setCurrentCategoryId(categoryId);
    navigate(`/userviewcategories/${categoryId}`);
  };

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


  const getUserAllergies = () => {
    return user?.allergyInfo || [];  // Make sure the key name matches your API response
  };

  useEffect(() => {
    if (!user || !user.allergyInfo) return;  // Ensure user is loaded

    let filtered = [...products];

    const userAllergies = getUserAllergies();
    console.log("User Allergies:", userAllergies);

    // Ensure that `userAllergies` is always an array
    const allergies = Array.isArray(userAllergies) ? userAllergies : [userAllergies];

    if (allergies.length > 0 && allergyFilter) {
      filtered = filtered.filter((product) => {
        console.log("Product:", product);

        // Check if any of the allergies are present in the product's allergy ingredients
        const allergyMatch = allergies.some((allergy) =>
          product.allergyIngredients
            .toLowerCase()
            .includes(allergy.toLowerCase())
        );
        console.log("Allergy match found:", allergyMatch);  // Log whether there's a match

        return !allergyMatch;  // Exclude product if allergy is found
      });
    }

    // Apply the first filter (search by product name)
    if (filterValue) {
      filtered = filtered.filter((product) =>
        product.productName.toLowerCase().includes(filterValue.toLowerCase())
      );
    }
    // Apply the second filter (price order sorting)
    if (priceFilter.includes("lowest")) {
      filtered = [...filtered].sort((a, b) => a.productPrice - b.productPrice); // Lowest to highest
    } else if (priceFilter.includes("highest")) {
      filtered = [...filtered].sort((a, b) => b.productPrice - a.productPrice); // Highest to lowest
    }
    // Apply the third filter (calories order sorting)
    if (caloriesFilter.includes("lowest")) {
      filtered = [...filtered].sort((a, b) => a.calories - b.calories);
    } else if (caloriesFilter.includes("highest")) {
      filtered = [...filtered].sort((a, b) => b.calories - a.calories);
    }
    // Apply the fourth filter (points order sorting)
    if (pointsFilter.includes("lowest")) {
      filtered = [...filtered].sort((a, b) => a.productPoints - b.productPoints);
    } else if (pointsFilter.includes("highest")) {
      filtered = [...filtered].sort((a, b) => b.productPoints - a.productPoints);
    }

    setFilteredProducts(filtered);
  }, [filterValue, priceFilter, caloriesFilter, pointsFilter, products, allergyFilter, user]);


  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    const filterType = name.split("-")[1]; // Extract "price", "calories", or "points"
    const value = name.split("-")[0]; // Extract "lowest" or "highest"

    if (filterType === "price") {
      setPriceFilter((prev) =>
        checked ? [value] : prev.filter((item) => item !== value)
      );
    } else if (filterType === "calories") {
      setCaloriesFilter((prev) =>
        checked ? [value] : prev.filter((item) => item !== value)
      );
    } else if (filterType === "points") {
      setPointsFilter((prev) =>
        checked ? [value] : prev.filter((item) => item !== value)
      );
    }
    // Handle allergy filter
    else if (filterType === "allergy") {
      setAllergyFilter(checked);  // Set allergy filter based on checkbox state
      console.log("Allergy Filter:", checked);  // Log the current allergy filter value
    }
  };


  const handleDropdownChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  return (
    <Grid container spacing={0} sx={{ margin: '64px', padding: 0 }}>
      {/* Left Column - Search and Filters */}
      <Grid item xs={12} sm={4} md={3} sx={{ marginTop: '60px', paddingLeft: '20px' }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexDirection: 'column', // or 'row' based on your need
            width: '100%',
            maxWidth: '300px',
            backgroundColor: 'white',
            padding: '16px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            boxShadow: 2,
            marginLeft: 'auto', // Centers the box horizontally within the Grid item
            marginRight: 'auto', // Centers the box horizontally within the Grid item
          }}
        >
          {/* Search Filter Input */}
          <DetailsTextField
            label="Search Products"
            variant="outlined"
            fullWidth
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            sx={{ marginBottom: '20px' }}
          />

          <FormControl fullWidth sx={{ marginBottom: '20px' }}>
            <InputLabel id="filter-category-label">Select Filter</InputLabel>
            <DetailedSelect
              labelId="filter-category-label"
              value={selectedFilter}
              label="Select Filter"
              onChange={handleDropdownChange}
            >
              <MenuItem value="choose-filters">Filter Options</MenuItem>
            </DetailedSelect>
          </FormControl>

          {/* Conditionally render filter options based on dropdown selection */}
          {selectedFilter === 'choose-filters' && (
            <>
              <Typography variant="body1" color="textSecondary">
                <strong>Price</strong>
              </Typography>
              <FormControl component="fieldset">
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <CustomCheckbox
                        checked={priceFilter.includes("lowest")}
                        onChange={handleCheckboxChange}
                        name="lowest-price"
                      />
                    }
                    label="Low to High"
                  />
                  <FormControlLabel
                    control={
                      <CustomCheckbox
                        checked={priceFilter.includes("highest")}
                        onChange={handleCheckboxChange}
                        name="highest-price"
                      />
                    }
                    label="High to Low"
                  />
                </FormGroup>
              </FormControl>

              <Typography variant="body1" color="textSecondary">
                <strong>Calories</strong>
              </Typography>
              <FormControl component="fieldset">
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <CustomCheckbox
                        checked={caloriesFilter.includes("lowest")}
                        onChange={handleCheckboxChange}
                        name="lowest-calories"
                      />
                    }
                    label="Low to High"
                  />
                  <FormControlLabel
                    control={
                      <CustomCheckbox
                        checked={caloriesFilter.includes("highest")}
                        onChange={handleCheckboxChange}
                        name="highest-calories"
                      />
                    }
                    label="High to Low"
                  />
                </FormGroup>
              </FormControl>

              <Typography variant="body1" color="textSecondary">
                <strong>Points</strong>
              </Typography>
              <FormControl component="fieldset">
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <CustomCheckbox
                        checked={pointsFilter.includes("lowest")}
                        onChange={handleCheckboxChange}
                        name="lowest-points"
                      />
                    }
                    label="Low to High"
                  />
                  <FormControlLabel
                    control={
                      <CustomCheckbox
                        checked={pointsFilter.includes("highest")}
                        onChange={handleCheckboxChange}
                        name="highest-points"
                      />
                    }
                    label="High to Low"
                  />
                </FormGroup>
              </FormControl>
              <FormControl component="fieldset">
                <FormGroup row>
                  <FormControlLabel
                    control={
                      <CustomCheckbox
                        checked={allergyFilter}
                        onChange={(e) => setAllergyFilter(e.target.checked)}  // Toggle the state
                        name="allergy-filter" // "allergy" will be extracted as the filter type
                      />
                    }
                    label="Filter by Allergy"
                  />
                </FormGroup>
              </FormControl>
            </>
          )}

          {/* Remove Filters Button */}
          <Button
            variant="outlined"
            sx={{ marginTop: '10px', width: '100%' }}
            color="Accent"
            onClick={() => {
              // Clear all filter values
              setPriceFilter([]);
              setCaloriesFilter([]);
              setPointsFilter([]);
              setSelectedFilter('');
            }}
          >
            Remove Filters
          </Button>

        </Box>
      </Grid>


      {/* Right Column - Navbar and Product List */}
      <Grid item xs={12} sm={8} md={9} sx={{ paddingRight: '150px' }}>
        {/* Navbar (now moved to right column) */}
        <Container
          sx={{
            border: '1px solid #ccc',
            borderTopLeftRadius: '8px',
            borderTopRightRadius: '8px',
            borderBottomLeftRadius: '0',
            borderBottomRightRadius: '0',
            backgroundColor: 'white',
            padding: '16px',
            marginTop: '60px',
            boxShadow: 2,
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

        {/* Product List */}
        <Container
          sx={{
            border: '1px solid #ccc',
            borderTopLeftRadius: '0',
            borderTopRightRadius: '0',
            borderBottomLeftRadius: '8px',
            borderBottomRightRadius: '8px',
            backgroundColor: 'white',
            padding: '16px',
            boxShadow: 2,
          }}
        >
          {loading ? (
            <CircularProgress />
          ) : currentCategoryId ? (
            <Grid container spacing={2}>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={3} key={product.productId}>
                    <Box
                      sx={{
                        border: '1px solid #ccc',
                        borderRadius: '16px',
                        boxShadow: 2,
                        overflow: 'hidden',
                        height: '100%',
                        width: '100%',
                        opacity: product.isActive ? 1 : 0.5, // Dim inactive products
                      }}
                    >
                      <Box sx={{ padding: '20px' }}>
                        <img
                          src={`${import.meta.env.VITE_FILE_BASE_URL}${product.imageFile}`}
                          alt={product.productName}
                          onClick={() => navigate(`/userproduct/${product.productId}`)}
                          style={{
                            objectFit: 'cover',
                            height: '150px',
                            width: '100%',
                            borderRadius: '16px',
                            filter: product.isActive ? 'none' : 'grayscale(80%)', // Apply grayscale if inactive
                            cursor: product.isActive ? 'pointer' : 'not-allowed',
                          }}
                        />
                      </Box>
                      <Box sx={{ padding: '16px' }}>
                        <Typography variant="h6">{product.productName}</Typography>
                        <Typography variant="body2">Price: ${product.productPrice}</Typography>
                        <Typography variant="body2">{product.productPoints} Sustainable Points</Typography>

                        {/* Show "Out of Stock" label if product is inactive */}
                        {!product.isActive && (
                          <Typography variant="body2" color="error" sx={{ fontWeight: 'bold', mt: 1 }}>
                            Not Available
                          </Typography>
                        )}
                        <Button
                          variant="contained"
                          color={user ? 'Accent' : 'secondary'}
                          onClick={() => addToCart(user.cartId, product.productId, product.productName, 1)}
                          sx={{ cursor: user && product.isActive ? 'pointer' : 'not-allowed', marginTop: '10px' }}
                          disabled={!user || !product.isActive} // Disable if user is not logged in or product is inactive
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
        </Container>
      </Grid>
    </Grid>
  );
};

export default UserMenu;
