import http from "../../../http"; // Ensure this is correctly set up
import React, { useState, useEffect } from 'react';
import { Table, TableContainer, TableHead, TableRow, TableCell, TableBody, Paper, Box } from '@mui/material';
import StaffSidebar from './StaffSideBar.jsx'

const StaffProductLogs = () => {
    const [productLogs, setProductLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Component to display the Product Logs
    const ProductLogs = ({ productLogs }) => (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Product Name</TableCell>
                        <TableCell>Action</TableCell>
                        <TableCell>Old Stocks</TableCell>
                        <TableCell>Updated Stocks</TableCell>
                        <TableCell>Current State</TableCell>
                        <TableCell>Changed At</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {productLogs.length > 0 ? (
                        productLogs.map((log, index) => (
                            <TableRow key={index}>
                                <TableCell>{log.productName}</TableCell>
                                <TableCell>{log.action}</TableCell>
                                <TableCell>{log.previousStock}</TableCell>
                                <TableCell>{log.newStock}</TableCell>
                                <TableCell>{log.newIsActive ? "Active" : "Inactive"}</TableCell>
                                <TableCell>{log.changedAt}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={6} align="center">
                                No product logs available.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );

    // Fetch Product Logs when the component mounts
    useEffect(() => {
        setLoading(true);
        http.get('/Order/productLogs')
            .then((res) => {
                setProductLogs(res.data);
                setLoading(false);
            })
            .catch((err) => {
                setError("Error fetching product logs");
                setLoading(false);
                console.error("Error fetching product logs:", err);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            <Box sx={{ display: 'flex' }}>
                {/* Sidebar */}
                <StaffSidebar />
                <Box sx={{ padding: "20px", width: '100%', maxWidth: "1200px", width: { md: 1100 }, height: '600px', margin: "auto", border: '1px solid #ccc', borderRadius: '8px', background: '#FFFFFF', marginTop: '94px' }}>
                    <ProductLogs productLogs={productLogs} />
                </Box>
            </Box>
        </>
    );
};

export default StaffProductLogs;
