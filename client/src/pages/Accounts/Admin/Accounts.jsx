import React, { useState, useEffect } from "react";
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
  Card,
  CardContent,
  Chip,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import http from "../../../http";
import RoleGuard from "../../../utils/RoleGuard";
import AdminSidebar from "./AdminSidebar";

export default function Accounts() {
  RoleGuard("Admin");
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);

      const response = await http
        .get("/Account", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Assuming JWT token storage in localStorage
          },
        })
        .then((res) => {
          return res;
        })
        .then((res) =>
          setUsers(
            res.data
              .filter((user) => {
                const searchText = searchTerm.toLowerCase();
                return (
                  user.username.toLowerCase().includes(searchText) ||
                  user.email.toLowerCase().includes(searchText)
                );
              })
              .sort((a, b) => {
                if (sortBy === "username") {
                  return a.username.localeCompare(b.username);
                } else if (sortBy === "email") {
                  return a.email.localeCompare(b.email);
                } else if (sortBy === "role") {
                  return a.role.localeCompare(b.role);
                }
                return 0;
              })
          )
        )
        .catch((err) => {
          console.log(err);
          setUsers([]);
        })
        .finally(() => setIsLoading(false));
    };

    fetchUsers();
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleSortByChange = (event) => {
    setSortBy(event.target.value);
  };

  // Filter users based on search term
  const filteredUsers = users
    // 1. Filtering the users based on search term or specific role
    .filter((user) => {
      const matchesSearchTerm =
        user.username.toLowerCase().includes(searchTerm) || // Search by username
        user.roleName.toLowerCase().includes(searchTerm); // Search by roleName

        const matchesRole = selectedRole ? user.roleName === selectedRole : true;

      return matchesSearchTerm && matchesRole;
    })
    // 2. Sorting by username or createdAt
    .sort((a, b) => {
      if (sortBy === "username") {
        return a.username.localeCompare(b.username); // Sort alphabetically by username
      } else if (sortBy === "createdAt") {
        return new Date(a.createdAt) - new Date(b.createdAt); // Sort by creation date
      }
      return 0; // No sorting applied
    });

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const UserProfileCard = ({ user }) => {
    return (
      <Card
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px",
          borderRadius: "16px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "600px",
          margin: "16px 0",
        }}
      >
        {/* Left section - Avatar and Info */}
        <Box display="flex" alignItems="center">
          {/* Avatar Icon */}
          <Avatar
            sx={{
              width: 64,
              height: 64,
              marginRight: "16px",
              backgroundColor: "#f5f5f5",
            }}
          >
            <PersonIcon sx={{ fontSize: 40, color: "#333" }} />
          </Avatar>

          {/* User Info */}
          <CardContent
            sx={{ padding: "0", paddingLeft: "16px", marginTop: "1em" }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {user.username}
            </Typography>
            <Typography variant="body2" sx={{ color: "#777" }}>
              Joined on{" "}
              {new Date(user.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </Typography>
          </CardContent>
        </Box>

        {/* Right Section - User Role and View Profile Button */}
        <Box display="flex" flexDirection="column" alignItems="flex-end">
          {/* Role Chip */}
          <Chip
            label={user.roleName}
            sx={{
              backgroundColor: "#E0F2FE", // Light blue background for 'User'
              color: "#007AFF", // Blue text color
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          />

          {/* View Profile Button */}
          <Button
            variant="outlined"
            sx={{
              borderColor: "#C6487E",
              color: "#C6487E",
              fontWeight: "bold",
              "&:hover": {
                backgroundColor: "#FDECEC", // Light hover color
              },
              marginTop: "2em",
            }}
          >
            View Profile
          </Button>
        </Box>
      </Card>
    );
  };

  return (
    <Box sx={{ display: "flex", height: "100%", marginTop: "2em" }}>
      {/* Sidebar */}
      <Box sx={{ height: "100%" }}>
        <AdminSidebar />
      </Box>
      <Box
        sx={{
          backgroundColor: "#FFFFFF",
          padding: "3em",
          borderRadius: "16px",
          width: "60%",
        }}
      >
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
              <InputLabel id="role-label">Role</InputLabel>
              <Select
                labelId="role-label"
                id="role-select"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)} // Set selected role
              >
                <MenuItem value="">All Roles</MenuItem>
                <MenuItem value="Admin">Admin</MenuItem>
                <MenuItem value="User">User</MenuItem>
                <MenuItem value="Staff">Staff</MenuItem>
                {/* Add more roles as needed */}
              </Select>
            </FormControl>
          </Box>
          <hr
            style={{
              borderTop: "1px solid lightgrey",
              marginTop: "2em",
              marginBottom: "2em",
            }}
          ></hr>
          {!!users.length ? (
            <Box>
              <Typography variant="h5" fontWeight="bold">
                Platform Users
              </Typography>
              {filteredUsers.map((user) => (
                <UserProfileCard key={user.id} user={user} />
              ))}
            </Box>
          ) : error ? (
            <p>Error fetching users: {error.message}</p>
          ) : (
            <p>Loading users...</p>
          )}
        </Box>
      </Box>
    </Box>
  );
}
