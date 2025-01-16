import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Button,
    Avatar,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@mui/material';
import http from '../http';
import RoleGuard from '../utils/RoleGuard'

export default function Accounts() {
    RoleGuard('Admin');
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [openSnackbar, setOpenSnackbar] = useState(false);

    useEffect(() => {
        const fetchUsers = async () => {
            setIsLoading(true);
            setError(null);

            const response = await http.get('/Account', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`, // Assuming JWT token storage in localStorage
                },
            }).then(res => { console.log(res); return res }).then(res => setUsers(res.data
                .filter((user) => {
                    const searchText = searchTerm.toLowerCase();
                    return (
                        user.username.toLowerCase().includes(searchText) ||
                        user.email.toLowerCase().includes(searchText)
                    );
                })
                .sort((a, b) => {
                    if (sortBy === 'username') {
                        return a.username.localeCompare(b.username);
                    } else if (sortBy === 'email') {
                        return a.email.localeCompare(b.email);
                    } else if (sortBy === 'role') {
                        return a.role.localeCompare(b.role);
                    }
                    return 0;
                })
            ))
            .catch(err => { console.log(err); setUsers([]) })
            .finally(() => setIsLoading(false))
        };

        fetchUsers();
    }, []);

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSortByChange = (event) => {
        setSortBy(event.target.value);
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Accounts
            </Typography>

            <Box display="flex" alignItems="center" mb={2}>
                <TextField
                    label="Search"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    sx={{ mr: 2 }}
                />
                <FormControl sx={{ minWidth: 120 }}>
                    <InputLabel id="sort-by-label">Sort By</InputLabel>
                    <Select
                        labelId="sort-by-label"
                        id="sort-by-select"
                        value={sortBy}
                        onChange={handleSortByChange}
                    >
                        <MenuItem value="">None</MenuItem>
                        <MenuItem value="username">Username</MenuItem>
                        <MenuItem value="email">Email</MenuItem>
                        <MenuItem value="role">Role</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            {!!users.length ? (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Username</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Joined On</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.username}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.roleName}</TableCell>
                                <TableCell>{new Date(user.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</TableCell>
                                <TableCell>
                                    <Button variant="contained" color="primary">
                                        View Profile
                                    </Button>
                                    {/* Add buttons for other actions like editing or deleting */}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : error ? (
                <p>Error fetching users: {error.message}</p>
            ) : (
                <p>Loading users...</p>
            )}

        </Box>
    )
}
