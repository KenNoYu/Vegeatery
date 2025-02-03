import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Select, MenuItem, InputLabel, FormControl } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import http from '../../http';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RoleGuard from '../../utils/RoleGuard';

function AddProduct() {
    RoleGuard('Admin');
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);
    const [categories, setCategories] = useState([]);

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
            productPrice: 0,
            discountPercentage: 0,
            categoryId: "" // This will hold the selected category ID
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
            calories: yup.number().min(0, 'Cannot be negative').required('Calories are required'),
            fats: yup.number().min(0, 'Cannot be negative').required('Fats are required'),
            carbs: yup.number().min(0, 'Cannot be negative').required('Carbs are required'),
            protein: yup.number().min(0, 'Cannot be negative').required('Protein is required'),
            productPrice: yup.number().min(0, 'Cannot be negative').required('Price is required'),
            discountPercentage: yup.number().min(0, 'Cannot be negative'),
            categoryId: yup.string().required('Category is required') // Validation for category
        }),
        onSubmit: (data) => {
            if (imageFile) {
                data.imageFile = imageFile;
            }

            http.post('/Product/add-product', data) // Send the product data including categoryId to the backend
                .then(() => {
                    toast.success('Product added successfully!');
                    navigate('/viewcategories'); // Redirect after successful addition
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
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Add Product
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit}>
                <TextField
                    fullWidth margin="dense" label="Product Name"
                    name="productName" value={formik.values.productName}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                    error={formik.touched.productName && Boolean(formik.errors.productName)}
                    helperText={formik.touched.productName && formik.errors.productName}
                />
                <TextField
                    fullWidth margin="dense" label="Description" multiline rows={2}
                    name="productDescription" value={formik.values.productDescription}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                    error={formik.touched.productDescription && Boolean(formik.errors.productDescription)}
                    helperText={formik.touched.productDescription && formik.errors.productDescription}
                />
                <TextField
                    fullWidth margin="dense" label="Ingredients" multiline rows={2}
                    name="ingredients" value={formik.values.ingredients}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                    error={formik.touched.ingredients && Boolean(formik.errors.ingredients)}
                    helperText={formik.touched.ingredients && formik.errors.ingredients}
                />
                <TextField
                    fullWidth margin="dense" 
                    type="number"
                    label="ProductPoints"
                    name="productPoints"
                    value={formik.values.productPoints}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.productPoints && Boolean(formik.errors.productPoints)}
                    helperText={formik.touched.productPoints && formik.errors.productPoints}
                />
                <TextField
                    fullWidth margin="dense" type="number" label="Calories"
                    name="calories" value={formik.values.calories}
                    onChange={formik.handleChange} onBlur={formik.handleBlur}
                    error={formik.touched.calories && Boolean(formik.errors.calories)}
                    helperText={formik.touched.calories && formik.errors.calories}
                />
                <TextField
                    fullWidth margin="dense"
                    type="number"
                    label="Fats (g)"
                    name="fats"
                    value={formik.values.fats}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.fats && Boolean(formik.errors.fats)}
                    helperText={formik.touched.fats && formik.errors.fats}
                />
                <TextField
                    fullWidth margin="dense"
                    type="number"
                    label="Carbs (g)"
                    name="carbs"
                    value={formik.values.carbs}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.carbs && Boolean(formik.errors.carbs)}
                    helperText={formik.touched.carbs && formik.errors.carbs}
                />
                <TextField
                    fullWidth margin="dense"
                    type="number"
                    label="Protein (g)"
                    name="protein"
                    value={formik.values.protein}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.protein && Boolean(formik.errors.protein)}
                    helperText={formik.touched.protein && formik.errors.protein}
                />
                <TextField
                    fullWidth margin="dense" 
                    type="number"
                    label="Price"
                    name="productPrice"
                    value={formik.values.productPrice}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.productPrice && Boolean(formik.errors.productPrice)}
                    helperText={formik.touched.productPrice && formik.errors.productPrice}
                />
                <TextField
                    fullWidth margin="dense"
                    type="number"
                    label="Discount"
                    name="discountPercentage"
                    value={formik.values.discountPercentage}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.discountPercentage && Boolean(formik.errors.discountPercentage)}
                    helperText={formik.touched.discountPercentage && formik.errors.discountPercentage}
                />
                <FormControl fullWidth margin="dense">
                    <InputLabel>Category</InputLabel>
                    <Select
                        name="categoryId" value={formik.values.categoryId}
                        onChange={formik.handleChange} onBlur={formik.handleBlur}
                        error={formik.touched.categoryId && Boolean(formik.errors.categoryId)}
                    >
                        {categories.map((cat) => (
                            <MenuItem key={cat.categoryId} value={cat.categoryId}>
                                {cat.categoryName}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant="contained" component="label">
                    Upload Image
                    <input type="file" hidden onChange={handleFileUpload} />
                </Button>
                {imageFile && <Typography>Uploaded: {imageFile}</Typography>}
                <Button variant="contained" type="submit" sx={{ mt: 2 }}>
                    Add Product
                </Button>
            </Box>
            <ToastContainer />
        </Box>
    );
}

export default AddProduct;