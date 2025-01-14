import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Box, Typography, Grid2 as Grid, Card, CardContent, Input, IconButton, Button } from '@mui/material';
import { AccountCircle, AccessTime, Search, Clear, Edit } from '@mui/icons-material';
import http from '../http';
import UserContext from '../contexts/UserContext';

function Products() {
    const [productList, setProductList] = useState([]);
    const [search, setSearch] = useState('');
    const { user } = useContext(UserContext);

    //TODO: Get CartId automatically once integrated (rough idea)
    /*
    useEffect(() => {
        const fetchCartId = async () => {
            try {
                const response = await http.get('/user/cart');
                const cartId = response.data.cartId;
                // Autofill the cartId field
                formik.setFieldValue('cartId', cartId);
            } catch (error) {
                console.error("Error fetching cart ID:", error);
            }
        };

        fetchCartId();
    }, []);
    */

    // handle add to cart button
    const addToCart = (cartId, productId, quantity) => {
        const cartData = {
            // auto fill id next time
            cartId: cartId,
            productId: productId,
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

    // Another way to add to cart
    /*
    const formik = useFormik({
        initialValues: {
            cartId: ,
            productId:,
            quantity: 1,
        },
        validationSchema: yup.object({
            cartId: yup.string().trim()
                .required('Cart ID is required'),
            productId: yup.string().trim()
                .required('Product ID is required'),
            quantity: yup.number()
                .integer('Quantity must be an integer')
                .positive('Quantity must be greater than 0')
                .required('Quantity is required'),
        }),
        onSubmit: (data) => {
            data.cartId = data.cartId.trim();
            data.productId = data.productId.trim();
            data.quantity = data.quantity.trim();
            http.post("/ordercart", data)
                .then((res) => {
                    console.log(res.data);
                    navigate("/Products");
                })
                .catch((error) => {
                    console.error("Error adding item to cart:", error);
                });
        }
    });
    */

    // product page ops

    const onSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const getProduct = () => {
        http.get('/product').then((res) => {
            setProductList(res.data);
        })
        .catch((error) => {
            console.error("Error fetching products:", error);
        });
    };

    const searchProducts = () => {
        http.get(`/product?search=${search}`).then((res) => {
            setProductList(res.data);
        });
    };

    useEffect(() => {
        getProduct();
    }, []);

    const onSearchKeyDown = (e) => {
        if (e.key === "Enter") {
            searchProducts();
        }
    };

    const onClickSearch = () => {
        searchProducts();
    }

    const onClickClear = () => {
        setSearch('');
        getProduct();
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ my: 2 }}>
                Products
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Input value={search} placeholder="Search"
                    onChange={onSearchChange}
                    onKeyDown={onSearchKeyDown} />
                <IconButton color="primary"
                    onClick={onClickSearch}>
                    <Search />
                </IconButton>
                <IconButton color="primary"
                    onClick={onClickClear}>
                    <Clear />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
                {
                    user && (
                        <Link to="/">
                            <Button variant='contained'>
                                Add
                            </Button>
                        </Link>
                    )
                }
            </Box>

            <Grid container spacing={2}>
                {
                    productList.map((product, i) => {
                        console.log(product.productId);
                        console.log(product.productPrice);
                        console.log(product.productName);
                        return (
                            <Grid size={{xs:12, md:6, lg:4}} key={product.productId || i}>
                                <Card>
                                    <CardContent>
                                        <Box sx={{ display: 'flex', mb: 1 }}>
                                            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                                {product.productName}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                                            color="text.secondary">
                                            <Typography>
                                                ${product.productPrice?.toFixed(2)}
                                            </Typography>
                                        </Box>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            onClick={() => addToCart(1, product.productId, 1)}
                                        >Add To Cart
                                        </Button>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })
                }
            </Grid>
        </Box>
    );
}

export default Products;