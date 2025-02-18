import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Grid2 as Grid, FormControl, InputLabel, Select, MenuItem, FormHelperText, Checkbox, ListItemText } from '@mui/material';
import { Container, Card, CardMedia } from '@mui/material';
import http from '../../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
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

const StyledInputLabel = styled(InputLabel)(({ theme }) => ({
    color: "black", // Default color
    "&.Mui-focused": {
        color: "#C6487E", // Keep visible when focused or shrinked
    }
}));

const StyledSelect = styled(Select)(({ theme }) => ({
    "&.MuiOutlinedInput-root": {

        "&:hover fieldset": {
            borderColor: "black", // Border on hover
        },
        "&.Mui-focused fieldset": {
            borderColor: "#C6487E", // Border when focused
        },
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
    "None",
];

const EditProduct = () => {
    RoleGuard('Admin');
    const { productId } = useParams(); // Get product ID from URL
    const [imageFile, setImageFile] = useState(null);
    const [, setLoading] = useState(true);
    const navigate = useNavigate();

    const [product, setProduct] = useState({
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
        allergyIngredients: "",
    });

    useEffect(() => {
        // Fetch the product details for editing
        http
            .get(`/Product/${productId}`)
            .then((res) => {
                const fetchedProduct = res.data;
                console.log('Fetched Product:', fetchedProduct)
                const allergyIngredients = fetchedProduct.allergyIngredients
                    ? fetchedProduct.allergyIngredients.split(',').map((ingredient) => ingredient.trim())
                    : [];

                // Log the allergyIngredients for auditing purposes
                console.log('Audit Log - Allergy Ingredients:', allergyIngredients);

                setProduct({
                    ...fetchedProduct,
                    allergyIngredients: allergyIngredients,
                });
                setImageFile(fetchedProduct.imageFile);
            })
            .catch((err) => {
                const message = err.response?.data?.message || 'Error fetching product details';
                toast.error(message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [productId]);


    const formik = useFormik({
        initialValues: product,
        enableReinitialize: true,
        validationSchema: yup.object({
            productName: yup.string().trim()
                .min(3, 'Product Name must be at least 3 characters')
                .max(100, 'Product Name must be at most 100 characters')
                .required('Product Name is required'),
            productDescription: yup.string().trim()
                .min(3, 'Product Description must be at least 3 characters')
                .max(500, 'Product Description must be at most 500 characters')
                .required('Product Description is required'),
            ingredients: yup.string().trim()
                .required('Ingredients is required')
                .min(3, 'Ingredients must be at least 3 characters')
                .max(500, 'Ingredients must be at most 500 characters'),
            productPoints: yup.number().required('ProductPoints is required'),
            calories: yup.number().required('Calories is required'),
            fats: yup.number().required('Fats are required'),
            carbs: yup.number().required('Carbs are required'),
            protein: yup.number().required('Protein is required'),
            productPrice: yup.number().required('Product price is required'),
            discountPercentage: yup.number().required('Discount percentage is required'),
            stocks: yup.number().required('Stocks is required'),
            allergyIngredients: yup
                .array()
                .of(yup.string().trim()) // Ensure each item in the array is a string
                .transform((value) => value || []) // If value is undefined or null, default it to an empty array
        }),
        onSubmit: (data) => {
            if (imageFile) {
                data.imageFile = imageFile;
            }

            if (Array.isArray(data.allergyIngredients)) {
                data.allergyIngredients = data.allergyIngredients.join(', ');
            }
            // Ensure allergyIngredients is properly sent
            console.log('Submitting Data:', data);  // Check the data structure

            http.put(`/Product/${productId}`, data)
                .then(() => {
                    toast.success('Product updated successfully');
                    navigate(`/admin/product/${productId}`);
                })
                .catch((err) => {
                    console.log('Error Response:', err.response); // Log the full error response for debugging
                    const message = err.response?.data?.message || 'Error updating product';
                    toast.error(message);
                });
        }
    });

    const deleteProduct = () => {
        http.delete(`/Product/${productId}`)
            .then((res) => {
                console.log(res.data);
                navigate("/admin/store");
            });
    }

    const onFileChange = (e) => {
        let file = e.target.files[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                toast.error('Maximum file size is 1MB');
                return;
            }

            let formData = new FormData();
            formData.append('file', file);
            http.post('/file/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
                .then((res) => {
                    setImageFile(res.data.filename);
                })
                .catch(function (error) {
                    console.log(error.response);
                });
        }
    };

    return (
        <Container sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '94px' }}>

            <Box
                sx={{
                    position: 'relative',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                    padding: '20px',
                    backgroundColor: 'white',
                    width: '100%',
                    maxWidth: '1400px',
                    boxShadow: 2,
                }}
            >
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
                    {/* Cancel Button on the left */}
                    <Button sx={{ marginLeft: '20px' }} style={{ background: '#C6487E', color: '#FFFFFF' }} onClick={() => navigate('/admin/store')} startIcon={<ArrowBackIcon />}>
                        Go Back
                    </Button>

                    {/* Buttons on the right (Save and Delete) */}
                    <Box sx={{ display: 'flex', gap: '10px', marginRight: '20px' }}>
                        <Button sx={{ background: '#C6487E', color: '#FFFFFF' }} onClick={formik.handleSubmit}>
                            Save Changes
                        </Button>
                        <Button sx={{ background: '#E63946', color: '#FFFFFF' }} onClick={deleteProduct}>
                            Delete Product
                        </Button>
                    </Box>
                </Box>


                {/* Form Fields Container */}
                <Box
                    component="form"
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '20px',
                        marginTop: '60px',
                    }}
                >
                    {/* Left Side - Form Fields */}
                    <Box sx={{ flex: 6 }}>
                        <Box component="form" onSubmit={formik.handleSubmit}>
                            {/* First Border - Product Name, Description, Ingredients */}
                            <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px', marginBottom: '16px' }}>
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
                            <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '31px 10px' }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={6} sx={{ width: '304px' }}>
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
                                    <Grid item xs={6} sx={{ width: '304px' }}>
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
                                    <Grid item xs={6} sx={{ width: '304px' }}>
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
                                    <Grid item xs={6} sx={{ width: '304px' }}>
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
                                    <Grid item xs={12} sx={{ width: '100%' }}>
                                        <FormControl fullWidth error={formik.touched.allergyIngredients && Boolean(formik.errors.allergyIngredients)}>
                                            <StyledInputLabel id="allergy-ingredients-label">Allergy Ingredients</StyledInputLabel >
                                            <StyledSelect
                                                labelId="allergy-ingredients-label"
                                                id="allergyIngredients"
                                                name="allergyIngredients"
                                                multiple
                                                value={formik.values.allergyIngredients || []}  // Ensure it's an array
                                                onChange={(e) => formik.setFieldValue('allergyIngredients', e.target.value)}  // Handle multi-selection
                                                onBlur={formik.handleBlur}
                                                label="Allergy Ingredients"
                                                renderValue={(selected) => Array.isArray(selected) ? selected.join(', ') : ''}
                                            >

                                                {allergyOptions.map((option, index) => (
                                                    <MenuItem
                                                        key={index}
                                                        value={option}
                                                        style={{
                                                            backgroundColor: formik.values.allergyIngredients.includes(option) ? "#e0f2f1" : "inherit" // Highlight selected items
                                                        }}
                                                    >
                                                        <Checkbox checked={formik.values.allergyIngredients.indexOf(option) > -1} />
                                                        <ListItemText primary={option} />
                                                    </MenuItem>
                                                ))}

                                            </StyledSelect>
                                            {formik.touched.allergyIngredients && formik.errors.allergyIngredients && (
                                                <FormHelperText>{formik.errors.allergyIngredients}</FormHelperText>
                                            )}
                                        </FormControl>
                                    </Grid>


                                </Grid>
                            </Box>
                        </Box>
                    </Box>

                    {/* Right Side - Image Preview & Upload */}
                    <Box sx={{ flex: 4.5 }}>
                        {/* Image Preview Box */}
                        <Box sx={{
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            padding: '10px',
                            marginBottom: '20px',
                            width: '95%',
                            height: '400px',
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

                            {/* Upload Button */}
                            <Box sx={{
                                width: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                marginTop: '10px'
                            }}>
                                <Button variant="contained" component="label">
                                    Upload Image
                                    <input type="file" hidden onChange={onFileChange} />
                                </Button>
                                {imageFile && <Typography sx={{ marginTop: '10px' }}>Uploaded: {imageFile}</Typography>}
                            </Box>
                        </Box>

                        {/* Second Border - Calories, Fats, Carbs, Protein */}
                        <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px' }}>
                            <Grid container spacing={2}>
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
};

export default EditProduct;