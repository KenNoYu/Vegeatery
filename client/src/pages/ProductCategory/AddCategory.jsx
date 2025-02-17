import React, { useState } from 'react';
import { Box, Typography, TextField, Button } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import http from '../../http';
import RoleGuard from '../../utils/RoleGuard';
import { useTheme } from '@mui/material/styles';
import { styled } from "@mui/system";

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


function AddCategory() {
    RoleGuard('Admin');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

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

            // Trim input fields
            data.categoryName = data.categoryName.trim();

            http.post('/Category/add-category', data)
                .then((res) => {
                    toast.success('Category added successfully!');
                    navigate('/admin/store');
                })
                .catch((err) => {
                    console.error(err.response);
                    const message =
                        err.response?.data?.message ||
                        'An error occurred while adding the category';
                    toast.error(message);
                })
                .finally(() => {
                    setLoading(false);
                });
        },
    });

    return (
        <Box sx={{
            border: '1px solid #ccc',
            borderRadius: '8px',
            padding: '26px',
            backgroundColor: 'white',
            maxWidth: '600px',
            margin: 'auto',
            boxShadow: 2,
            marginTop: '84px',
        }}>
            <Typography variant="h5" >
                Add Category
            </Typography>
            <Box component="form" onSubmit={formik.handleSubmit} noValidate>
                <DetailsTextField
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
                    sx = {{ marginTop: '10px'}}
                />

                <Box sx={{ mt: 2 }}>
                    <Button
                        style={{ marginTop: '16px', background: '#C6487E', color: '#FFFFFF' }}
                        variant="contained"
                        type="submit"
                        disabled={loading}
                        sx={{ mr: 2 }}
                    >
                        {loading ? 'Submitting...' : 'Add Category'}
                    </Button>
                    <Button
                        style={{ marginTop: '16px', background: '#C6487E', color: '#FFFFFF' }}
                        variant="contained"
                        onClick={() => navigate('/admin/store')}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
            <ToastContainer />
        </Box>
    );
}

export default AddCategory;