import React, { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate, useParams } from 'react-router-dom';
import http from '../../http';
import RoleGuard from '../../utils/RoleGuard';

function EditCategory() {
    RoleGuard('Admin');
    const navigate = useNavigate();
    const { categoryId } = useParams();
    const [loading, setLoading] = useState(false);

    // Fetch category details when the component mounts
    useEffect(() => {
        http.get(`/Category/categories/${categoryId}`)
            .then((res) => {
                formik.setValues({ categoryName: res.data.categoryName });
            })
            .catch((err) => {
                console.error(err);
                toast.error('Failed to fetch category details');
            });
    }, [categoryId]);

    const formik = useFormik({
        initialValues: {
            categoryName: ''
        },
        validationSchema: yup.object({
            categoryName: yup
                .string()
                .trim()
                .min(3, 'Category name must be at least 3 characters')
                .max(50, 'Category name must be at most 50 characters')
                .required('Category name is required')
        }),
        onSubmit: (data) => {
            setLoading(true);
            data.categoryName = data.categoryName.trim();

            http.put(`/Category/${categoryId}`, data)
                .then(() => {
                    toast.success('Category updated successfully!');
                    navigate('/viewcategories');
                })
                .catch((err) => {
                    console.error(err.response);
                    const message =
                        err.response?.data?.message ||
                        'An error occurred while updating the category';
                    toast.error(message);
                })
                .finally(() => {
                    setLoading(false);
                });
        },
    });

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Edit Category
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit} noValidate>
                <TextField
                    fullWidth
                    margin="dense"
                    label="Category Name"
                    name="categoryName"
                    value={formik.values.categoryName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={
                        formik.touched.categoryName &&
                        Boolean(formik.errors.categoryName)
                    }
                    helperText={
                        formik.touched.categoryName && formik.errors.categoryName
                    }
                />

                <Box sx={{ mt: 2 }}>
                    <Button
                        variant="contained"
                        type="submit"
                        disabled={loading}
                        sx={{ mr: 2 }}
                    >
                        {loading ? 'Updating...' : 'Update Category'}
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => navigate('/viewcategories')}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
            <ToastContainer />
        </Box>
    );
}

export default EditCategory;
