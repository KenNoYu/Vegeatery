import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, MenuItem, Container, Grid, Card, CardMedia, FormControl } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../../http';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RoleGuard from '../../utils/RoleGuard';
import { useTheme } from '@mui/material/styles';
import { styled } from "@mui/system";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const DetailsTextField = styled(TextField)(({ theme }) => ({
    "& .MuiInputLabel-root.Mui-focused": {
        color: "#C6487E", // Label color when focused and at the top
    },
    "& .MuiOutlinedInput-root": {
        "&:hover fieldset": {
            borderColor: "black", // Outline on hover
        },
        "&.Mui-focused fieldset": {
            borderColor: "#C6487E", // Outline when focused
        },
    },
    "& .MuiInputLabel-root": {
        color: "black", // Label color
    },
    "& .Mui-focused": {
        color: "black", // Label when focused
    },
}));


const allergyOptions = [
    "Milk",
    "Tree Nuts",
    "Soybean",
    "Garlic",
    "Onion",
    "Wheat",
    "Eggs",
    "Peanuts",
    "None"
];

function AddProduct() {
    RoleGuard('Admin');
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedAllergens, setSelectedAllergens] = useState([]);

    useEffect(() => {
        // Fetch categories from the API
        http.get('/Category/categories')
            .then((res) => {
                setCategories(res.data); // Set the categories in state
            })
            .catch((err) => {
                toast.error('Error fetching categories');
            });
    }, []);

    const formik = useFormik({
        initialValues: {
            productName: "",
            productDescription: "",
            ingredients: "",
            calories: 0,
            fats: 0,
            carbs: 0,
            protein: 0,
            productPoints: 0,
            productPrice: 0,
            discountPercentage: 0,
            stocks: 0,
            categoryId: 0,
            allergyIngredients: ""
        },
        validationSchema: yup.object({
            productName: yup.string().trim().min(3, 'Product Name must be at least 3 characters')
                .max(100, 'Product Name must be at most 100 characters')
                .required('Product Name is required'),
            productDescription: yup.string().trim().min(3, 'Product Description must be at least 3 characters')
                .max(500, 'Product Description must be at most 500 characters')
                .required('Product Description is required'),
            ingredients: yup.string().trim().required('Ingredients is required')
                .min(3, 'Ingredients must be at least 3 characters')
                .max(500, 'Ingredients must be at most 500 characters'),
            productPoints: yup.number().min(1, "ProductPoints must be at least 1.").max(5, "ProductPoints must be at most 5.").required("ProductPoints is required."),
            calories: yup.number().min(1, 'Calories minumum 1 or more').required('Calories are required'),
            fats: yup.number().min(1, 'Fats minumum 1 or more').required('Fats are required'),
            carbs: yup.number().min(1, 'Carbs minumum 1 or more').required('Carbs are required'),
            protein: yup.number().min(1, 'Protein minumum 1 or more').required('Protein is required'),
            productPrice: yup.number().min(1, 'Price minumum 1 or more').required('Price is required'),
            discountPercentage: yup.number().min(0, 'Cannot be negative').nullable(),
            allergyIngredients: yup.string().nullable(),
            stocks: yup.number().min(1, 'Stocks minumum 1 or more').required('Stocks are required'),
            categoryId: yup.string().required('Category is required') // Validation for category
        }),
        onSubmit: (data) => {
            if (imageFile) {
                data.imageFile = imageFile;
            }

            // Convert allergens array to a comma-separated string
            data.allergyIngredients = selectedAllergens.join(",");

            http.post('/Product/add-product', data) // Send the product data including categoryId to the backend
                .then(() => {
                    toast.success('Product added successfully!');
                    navigate('/admin/store'); // Redirect after successful addition
                })
                .catch((err) => {
                    console.error("Error:", err); // Log the error to the console for debugging
                    toast.error('Failed to add product');
                });
        }
    });

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.size <= 1024 * 1024) {
            const formData = new FormData();
            formData.append('file', file);

            http.post('/File/upload', formData)
                .then((res) => {
                    setImageFile(res.data.filename); // Store the uploaded image filename
                    toast.success('Image uploaded successfully!');
                })
                .catch(() => {
                    toast.error('Failed to upload image');
                });
        } else {
            toast.error('File size must not exceed 1MB');
        }
    };

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
                    <Button sx={{ marginLeft: '20px' }} style={{ background: '#C6487E', color: '#FFFFFF' }} onClick={() => navigate('/admin/store')}  startIcon={<ArrowBackIcon />} >
                        Go Back
                    </Button>
                    <Button sx={{ marginRight: '40px' }} style={{ background: '#C6487E', color: '#FFFFFF' }} type="submit" onClick={formik.handleSubmit}>
                        Add Product
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

                    {/* Left Side - Form Fields */}
                    <Box sx={{ flex: 6 }}>
                        {/* Form Wrapper */}
                        <Box component="form" onSubmit={formik.handleSubmit}>
                            {/* First Border - Product Name, Description, Ingredients */}
                            <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px', marginBottom: '16px', height: 'auto' }}>


                                {/* Product Name */}
                                <Grid item xs={12} sx={{ marginBottom: '10px' }}>
                                    <FormControl fullWidth>
                                        <DetailsTextField
                                            label="Product Name"
                                            name="productName"
                                            value={formik.values.productName}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.productName && Boolean(formik.errors.productName)}
                                            helperText={formik.touched.productName && formik.errors.productName}
                                        />

                                    </FormControl>
                                </Grid>

                                {/* Description */}
                                <Grid item xs={12} sx={{ marginBottom: '10px' }}>
                                    <FormControl fullWidth>
                                        <DetailsTextField
                                            label="Description"
                                            multiline
                                            rows={3}
                                            name="productDescription"
                                            value={formik.values.productDescription}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.productDescription && Boolean(formik.errors.productDescription)}
                                            helperText={formik.touched.productDescription && formik.errors.productDescription}
                                        />
                                    </FormControl>
                                </Grid>

                                {/* Ingredients */}
                                <Grid item xs={12} sx={{ marginBottom: '10px' }}>
                                    <FormControl fullWidth>
                                        <DetailsTextField
                                            label="Ingredients"
                                            multiline
                                            rows={3}
                                            name="ingredients"
                                            value={formik.values.ingredients}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.ingredients && Boolean(formik.errors.ingredients)}
                                            helperText={formik.touched.ingredients && formik.errors.ingredients}
                                        />
                                    </FormControl>
                                </Grid>
                            </Box>

                            {/* Second Border - Price, Stock, etc. */}
                            <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px' }}>
                                <Grid container spacing={2}>
                                    {/* Product Points */}
                                    <Grid item xs={6}>
                                        <DetailsTextField
                                            fullWidth
                                            type="number"
                                            label="Product Points"
                                            name="productPoints"
                                            value={formik.values.productPoints}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.productPoints && Boolean(formik.errors.productPoints)}
                                            helperText={formik.touched.productPoints && formik.errors.productPoints}
                                        />
                                    </Grid>

                                    {/* Price */}
                                    <Grid item xs={6}>
                                        <DetailsTextField
                                            fullWidth
                                            type="number"
                                            label="Price"
                                            name="productPrice"
                                            value={formik.values.productPrice}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.productPrice && Boolean(formik.errors.productPrice)}
                                            helperText={formik.touched.productPrice && formik.errors.productPrice}
                                        />
                                    </Grid>

                                    {/* Discount Percentage */}
                                    <Grid item xs={6}>
                                        <DetailsTextField
                                            fullWidth
                                            type="number"
                                            label="Discount (%)"
                                            name="discountPercentage"
                                            value={formik.values.discountPercentage}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.discountPercentage && Boolean(formik.errors.discountPercentage)}
                                            helperText={formik.touched.discountPercentage && formik.errors.discountPercentage}
                                        />
                                    </Grid>

                                    {/* Stocks */}
                                    <Grid item xs={6}>
                                        <DetailsTextField
                                            fullWidth
                                            type="number"
                                            label="Stocks"
                                            name="stocks"
                                            value={formik.values.stocks}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.stocks && Boolean(formik.errors.stocks)}
                                            helperText={formik.touched.stocks && formik.errors.stocks}
                                        />
                                    </Grid>

                                    {/* Category */}
                                    <Grid item xs={6}>
                                        <DetailsTextField
                                            fullWidth
                                            select
                                            label="Category"
                                            name="categoryId"
                                            value={formik.values.categoryId}
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            error={formik.touched.categoryId && Boolean(formik.errors.categoryId)}
                                            helperText={formik.touched.categoryId && formik.errors.categoryId}
                                        >
                                            {categories.map((cat) => (
                                                <MenuItem key={cat.categoryId} value={cat.categoryId}>
                                                    {cat.categoryName}
                                                </MenuItem>
                                            ))}
                                        </DetailsTextField>
                                    </Grid>

                                    <Grid item xs={6}>
                                        <DetailsTextField
                                            select
                                            label="Allergy Ingredients"
                                            value={selectedAllergens}
                                            onChange={(e) => setSelectedAllergens(e.target.value)}
                                            SelectProps={{
                                                multiple: true,
                                                renderValue: (selected) => selected.join(", "), // Display selected allergens as a string
                                            }}
                                            fullWidth         
                                        >
                                            {allergyOptions.map((option) => (
                                                <MenuItem 
                                                    key={option} 
                                                    value={option} 
                                                    style={{
                                                        backgroundColor: selectedAllergens.includes(option) ? "#e0f2f1" : "inherit" // Highlight selected items
                                                    }}
                                                >
                                                    {option}
                                                </MenuItem>
                                            ))}
                                        </DetailsTextField>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Box>

                    {/* Right Side - Image Preview & Upload */}
                    <Box sx={{ flex: 4 }}>
                        {/* Image Preview Box */}
                        <Box sx={{
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            padding: '10px',
                            marginBottom: '20px',
                            width: '95%',
                            height: '381px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            overflow: 'hidden',
                        }}>
                            <Card sx={{ width: '100%', borderRadius: '16px', boxShadow: 'none' }}>
                                {imageFile ? (
                                    <CardMedia
                                        component="img"
                                        height="100%"
                                        image={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}
                                        alt="Uploaded Product Image"
                                        sx={{ objectFit: 'cover', width: '100%', height: '100%', borderRadius: '16px' }}
                                    />
                                ) : (
                                    <Typography variant="h6" color="textSecondary" sx={{ textAlign: 'center' }}>
                                        No Image Uploaded
                                    </Typography>
                                )}
                            </Card>

                            {/* Upload Button Below */}
                            <Box sx={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                marginTop: '10px'
                            }}>
                                <Button variant="contained" component="label" style={{ background: '#C6487E', color: '#FFFFFF' }}>
                                    Upload Image
                                    <input type="file" hidden onChange={handleFileUpload} />
                                </Button>
                                {imageFile && <Typography sx={{ marginTop: '10px' }}>Uploaded: {imageFile}</Typography>}
                            </Box>
                        </Box>

                        <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px' }}>
                            <Grid container spacing={2}>
                                {/* Calories */}
                                <Grid item xs={6}>
                                    <DetailsTextField
                                        fullWidth
                                        type="number"
                                        label="Calories"
                                        name="calories"
                                        value={formik.values.calories}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.calories && Boolean(formik.errors.calories)}
                                        helperText={formik.touched.calories && formik.errors.calories}
                                    />
                                </Grid>

                                {/* Fats */}
                                <Grid item xs={6}>
                                    <DetailsTextField
                                        fullWidth
                                        type="number"
                                        label="Fats (g)"
                                        name="fats"
                                        value={formik.values.fats}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.fats && Boolean(formik.errors.fats)}
                                        helperText={formik.touched.fats && formik.errors.fats}
                                    />
                                </Grid>

                                {/* Carbs */}
                                <Grid item xs={6}>
                                    <DetailsTextField
                                        fullWidth
                                        type="number"
                                        label="Carbs (g)"
                                        name="carbs"
                                        value={formik.values.carbs}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.carbs && Boolean(formik.errors.carbs)}
                                        helperText={formik.touched.carbs && formik.errors.carbs}
                                    />
                                </Grid>

                                {/* Protein */}
                                <Grid item xs={6}>
                                    <DetailsTextField
                                        fullWidth
                                        type="number"
                                        label="Protein (g)"
                                        name="protein"
                                        value={formik.values.protein}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        error={formik.touched.protein && Boolean(formik.errors.protein)}
                                        helperText={formik.touched.protein && formik.errors.protein}
                                    />
                                </Grid>
                            </Grid>

                        </Box>

                    </Box>
                </Box>
            </Box>

        </Container>

    );
}

export default AddProduct;