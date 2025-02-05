import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Grid2 as Grid } from '@mui/material';
import { Container, Card, CardMedia } from '@mui/material';
import http from '../../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RoleGuard from '../../utils/RoleGuard';

const EditProduct = () => {
    RoleGuard('Admin');
    const { productId } = useParams(); // Get product ID from URL
    const [imageFile, setImageFile] = useState(null);
    const [product, setProduct] = useState({
        productName: "",
        productDescription: "",
        ingredients: "",
        calories: 0,
        fats: 0,
        carbs: 0,
        protein: 0,
        productPrice: 0,
        discountPercentage: 0,
    });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch the product details for editing
        http
            .get(`/Product/${productId}`)
            .then((res) => {
                setProduct(res.data); // Initialize state with product data
                setImageFile(res.data.imageFile);
            })
            .catch((err) => {
                const message = err.response?.data?.message || 'Error fetching product details';
                toast.error(message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

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
            calories: yup.number().required('Calories is required'),
            fats: yup.number().required('Fats are required'),
            carbs: yup.number().required('Carbs are required'),
            protein: yup.number().required('Protein is required'),
            productPrice: yup.number().required('Product price is required'),
            discountPercentage: yup.number().required('Discount percentage is required'),
        }),
        onSubmit: (data) => {
            if (imageFile) {
                data.imageFile = imageFile;
            }

            http.put(`/Product/${productId}`, data)
                .then(() => {
                    toast.success('Product updated successfully');
                    navigate(`/product/${productId}`);
                })
                .catch((err) => {
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
        <Container sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <Box
                component="form"
                onSubmit={formik.handleSubmit}
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
                {/* Left Side - Form Fields */}
                <Box sx={{ width: '60%', paddingRight: '20px' }}>
                    {/* First Border - Product Name, Description, Ingredients */}
                    <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px', marginBottom: '16px' }}>
                        <Typography variant="h5" gutterBottom sx={{ margin: '10px' }}>
                            Edit Product
                        </Typography>

                        {/* Product Name */}
                        <Grid item xs={12} sx={{ marginBottom: '20px', marginLeft: '10px', marginRight: '10px' }}>
                            <TextField
                                fullWidth
                                label="Product Name"
                                name="productName"
                                value={formik.values.productName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.productName && Boolean(formik.errors.productName)}
                                helperText={formik.touched.productName && formik.errors.productName}
                            />
                        </Grid>

                        {/* Description */}
                        <Grid item xs={12} sx={{ marginBottom: '20px', marginLeft: '10px', marginRight: '10px', height: '90px' }}>
                            <TextField
                                fullWidth
                                label="Description"
                                multiline
                                rows={2}
                                name="productDescription"
                                value={formik.values.productDescription}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.productDescription && Boolean(formik.errors.productDescription)}
                                helperText={formik.touched.productDescription && formik.errors.productDescription}
                            />
                        </Grid>

                        {/* Ingredients */}
                        <Grid item xs={12} sx={{ marginBottom: '20px', marginLeft: '10px', marginRight: '10px', height: '90px' }}>
                            <TextField
                                fullWidth
                                label="Ingredients"
                                multiline
                                rows={2}
                                name="ingredients"
                                value={formik.values.ingredients}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.ingredients && Boolean(formik.errors.ingredients)}
                                helperText={formik.touched.ingredients && formik.errors.ingredients}
                            />
                        </Grid>
                    </Box>

                    {/* Second Border - Price, Stock, etc. */}
                    <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px' }}>
                        <Grid container spacing={2}>
                            {/* Product Points */}
                            <Grid item xs={6}>
                                <TextField
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
                                <TextField
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
                                <TextField
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

                            {/* Submit Button */}
                            <Grid item xs={12}>
                                <Button variant="contained" type="submit" sx={{ mt: 2 }}>
                                    Update Product
                                </Button>
                            </Grid>

                            {/* Delete Button */}
                            <Grid item xs={12}>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={deleteProduct}
                                    sx={{ mt: 2 }}
                                >
                                    Delete Product
                                </Button>
                            </Grid>
                        </Grid>
                        <Button
                            variant="outlined"
                            color="Accent"
                            onClick={() => navigate('/viewcategories/1')}
                            sx={{ cursor: 'pointer', marginTop: '10px', paddingLeft: '10px', paddingRight: '10px' }}
                        >
                            Cancel
                        </Button>
                    </Box>
                </Box>

                {/* Right Side - Image Preview & Upload */}
                <Box sx={{ width: '40%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* Image Preview Box */}
                    <Box sx={{
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        padding: '10px',
                        marginBottom: '20px',
                        width: '90%',
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

                    <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px' }}>
                        <Grid container spacing={2}>
                            {/* Calories */}
                            <Grid item xs={6}>
                                <TextField
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
                                <TextField
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
                        </Grid>
                    </Box>
                </Box>
            </Box>
        </Container>
    );
};

export default EditProduct;