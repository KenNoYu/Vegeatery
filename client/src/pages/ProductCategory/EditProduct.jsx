import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, Grid2 as Grid } from '@mui/material';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import http from '../../http';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { ToastContainer, toast } from 'react-toastify';
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

    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteProduct = () => {
        http.delete(`/Product/${productId}`)
            .then((res) => {
                console.log(res.data);
                navigate("/viewcategories");
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
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Edit Product
            </Typography>
            {
                !loading && (
                    <Box component="form" onSubmit={formik.handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6} lg={8}>
                                <TextField
                                    fullWidth margin="dense" autoComplete="off"
                                    label="Product Name"
                                    name="productName"
                                    value={formik.values.productName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.productName && Boolean(formik.errors.productName)}
                                    helperText={formik.touched.productName && formik.errors.productName}
                                />
                                <TextField
                                    fullWidth margin="dense" autoComplete="off"
                                    multiline minRows={2}
                                    label="Product Description"
                                    name="productDescription"
                                    value={formik.values.productDescription}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.productDescription && Boolean(formik.errors.productDescription)}
                                    helperText={formik.touched.productDescription && formik.errors.productDescription}
                                />
                                <TextField
                                    fullWidth margin="dense" autoComplete="off"
                                    multiline minRows={2}
                                    label="Ingredients"
                                    name="ingredients"
                                    value={formik.values.ingredients}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.ingredients && Boolean(formik.errors.ingredients)}
                                    helperText={formik.touched.ingredients && formik.errors.ingredients}
                                />
                                <TextField
                                    fullWidth margin="dense" autoComplete="off"
                                    multiline minRows={2}
                                    label="Calories"
                                    name="calories"
                                    value={formik.values.calories}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.calories && Boolean(formik.errors.calories)}
                                    helperText={formik.touched.calories && formik.errors.calories}
                                />
                                <TextField
                                    fullWidth margin="dense" autoComplete="off"
                                    multiline minRows={2}
                                    label="Carbs"
                                    name="carbs"
                                    value={formik.values.carbs}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.carbs && Boolean(formik.errors.carbs)}
                                    helperText={formik.touched.carbs && formik.errors.carbs}
                                />
                                <TextField
                                    fullWidth margin="dense" autoComplete="off"
                                    multiline minRows={2}
                                    label="Protein"
                                    name="protein"
                                    value={formik.values.protein}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.protein && Boolean(formik.errors.protein)}
                                    helperText={formik.touched.protein && formik.errors.protein}
                                />
                                <TextField
                                    fullWidth margin="dense" autoComplete="off"
                                    multiline minRows={2}
                                    label="Product Price"
                                    name="productPrice"
                                    value={formik.values.productPrice}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.productPrice && Boolean(formik.errors.productPrice)}
                                    helperText={formik.touched.productPrice && formik.errors.productPrice}
                                />
                                <TextField
                                    fullWidth margin="dense" autoComplete="off"
                                    multiline minRows={2}
                                    label="Discount Percentage"
                                    name="discountPercentage"
                                    value={formik.values.discountPercentage}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    error={formik.touched.discountPercentage && Boolean(formik.errors.discountPercentage)}
                                    helperText={formik.touched.discountPercentage && formik.errors.discountPercentage}
                                />

                            </Grid>
                            <Grid item xs={12} md={6} lg={8}>
                                <Box sx={{ textAlign: 'center', mt: 2 }} >
                                    <Button variant="contained" component="label">
                                        Upload Image
                                        <input hidden accept="image/*" multiple type="file"
                                            onChange={onFileChange} />
                                    </Button>
                                    {
                                        imageFile && (
                                            <Box className="aspect-ratio-container" sx={{ mt: 2 }}>
                                                <img alt="image"
                                                    src={`${import.meta.env.VITE_FILE_BASE_URL}${imageFile}`}>
                                                </img>
                                            </Box>
                                        )
                                    }
                                </Box>
                            </Grid>
                        </Grid>
                        <Box sx={{ mt: 2 }}>
                            <Button variant="contained" type="submit">
                                Update
                            </Button>
                            <Button variant="contained" sx={{ ml: 2 }} color="error"
                                onClick={handleOpen}>
                                Delete
                            </Button>
                        </Box>
                    </Box>
                )
            }

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    Delete Product
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to delete this Product?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" color="inherit"
                        onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="contained" color="error"
                        onClick={deleteProduct}>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <ToastContainer />
        </Box>
    );
};

export default EditProduct;