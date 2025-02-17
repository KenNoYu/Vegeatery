import React, { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from "recharts";
import { Tabs, Tab, Box, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import http from "../../../http"; // Ensure this is correctly set up
import StaffSideBar from './StaffSideBar.jsx';

// Component to display the Stock Overview (Chart + Stock Table)
const StockGraph = ({ stockData }) => (
  <Box sx={{ width: "100%", display: 'flex', padding: "20px" }}>
    <Box sx={{ width: '100%', maxWidth: '1150px' }}> {/* Adjust width and max width */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={stockData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ccc" /> {/* Lighter grid lines */}
          <XAxis
            dataKey="name"
            tick={{ fontSize: 16, fill: '#555' }}
            axisLine={{ stroke: '#888' }}
          />
          <YAxis
            tick={{ fontSize: 16, fill: '#555' }}
            axisLine={{ stroke: '#888' }}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#333', color: '#fff', borderRadius: '5px' }}
          />
          <Legend
            verticalAlign="top"
            align="center"
            wrapperStyle={{ paddingBottom: '10px' }}
          />
          <Bar
            dataKey="stock"
            fill="url(#stockGradient)"
            barSize={30}
            radius={[5, 5, 0, 0]}
          />
          <defs>
            <linearGradient id="stockGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C6487E" />
              <stop offset="100%" stopColor="#111111" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </Box>
  </Box>
);

// Component to display the Stock Table
const StockTable = ({ stockData }) => (
  <TableContainer component={Paper}>
    <Table >
      <TableHead sx={{ backgroundColor: '#FFFFFF' }}>
        <TableRow>
          <TableCell sx={{ color: '#C6487E', fontWeight: 'bold', fontSize: 16, borderTop: '1px solid #ccc', borderLeft: '1px solid #ccc', borderBottom: '1px solid #ccc' }}>Product Name</TableCell>
          <TableCell sx={{ color: '#C6487E', fontWeight: 'bold', fontSize: 16, borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc' }}>Stock Quantity</TableCell>
          <TableCell sx={{ color: '#C6487E', fontWeight: 'bold', fontSize: 16, borderTop: '1px solid #ccc', borderRight: '1px solid #ccc', borderBottom: '1px solid #ccc' }}>Status</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {stockData.map((item) => (
          <TableRow key={item.name}>
            <TableCell sx={{ borderLeft: '1px solid #ccc', borderBottom: '1px solid #ccc' }}>{item.name}</TableCell>
            <TableCell sx={{ borderBottom: '1px solid #ccc' }}>{item.stock}</TableCell>
            <TableCell sx={{ borderRight: '1px solid #ccc', borderBottom: '1px solid #ccc' }}>{item.isactive ? "Active" : "Inactive"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);


const StaffStockPage = () => {
  const [categories, setCategories] = useState([]);
  const [currentCategoryId, setCurrentCategoryId] = useState(null);
  const [stockData, setStockData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [selectedTab, setSelectedTab] = useState(0); // To manage selected tab (Stock Table or Product Logs)

  // Fetch Categories
  useEffect(() => {
    http.get("/Category/categories")
      .then((res) => {
        setCategories(res.data);
        if (res.data.length > 0) {
          setCurrentCategoryId(res.data[0].categoryId);
        }
      })
      .catch((err) => console.error("Error fetching categories:", err))
      .finally(() => setLoading(false));
  }, []);

  // Fetch Products and Logs when category changes
  useEffect(() => {
    if (currentCategoryId) {
      setLoadingProducts(true);
      http.get(`/Product/products?categoryId=${currentCategoryId}`)
        .then((res) => {
          const data = res.data.map((product) => ({
            name: product.productName,
            stock: product.stocks,
            isactive: product.isActive,
          }));
          setStockData(data);
        })
        .catch((err) => console.error("Error fetching stock data:", err))
        .finally(() => setLoadingProducts(false));
    }
  }, [currentCategoryId]);

  return (
    <>
      <Box >
        {/* Sidebar */}
        <StaffSideBar />

        <Box sx={{ padding: "20px", maxWidth: "1200px", margin: "auto", border: '1px solid #ccc', borderRadius: '8px', background: '#FFFFFF', marginBottom: '20px', marginTop: '128px' }}>
          <Typography variant="h4" gutterBottom sx={{ padding: "20px", maxWidth: "1200px", margin: "auto", fontWeight: 'bold' }}>
            Staff Stock Management
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: "20px" }}>
            {loading ? (
              <CircularProgress />
            ) : (
              <Tabs
                value={currentCategoryId}
                onChange={(e, id) => setCurrentCategoryId(id)}
                indicatorColor="#FFFFFF"
                textColor="#FFFFFF"
                sx={{
                  justifyContent: 'space-between', // Ensure tabs are spaced evenly
                  width: 'auto', // Ensure tabs take up the full width
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#C6487E", // Set the custom color for the indicator
                  },
                  "& .MuiTab-root": {
                    margin: '0 60px', // Adjust the spacing between tabs (increase/decrease as needed)
              
                  },

                }}
              >
                {categories.map((category) => (
                  <Tab key={category.categoryId} label={category.categoryName} value={category.categoryId} />
                ))}
              </Tabs>
            )}
          </Box>

          {/* Stock Graph */}
          {loadingProducts ? <CircularProgress sx={{ marginTop: "20px" }} /> : <StockGraph stockData={stockData} />}




          {/* Content based on selected Tab */}
          {selectedTab === 0 ? <StockTable stockData={stockData} /> : null}

        </Box>
      </Box>
    </>
  );
};

export default StaffStockPage;
