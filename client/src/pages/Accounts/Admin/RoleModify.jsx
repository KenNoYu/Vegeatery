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
  Grid,
  Pagination
} from "@mui/material";
import { styled } from "@mui/system";
import PersonIcon from "@mui/icons-material/Person";
import http from "../../../http";
import RoleGuard from "../../../utils/RoleGuard";
import AdminSidebar from "./AdminSidebar";
import UserRegistrationsGraph from "./UserRegistrationsGraph";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import { useNavigate } from "react-router-dom";
import RoleModificationModal from "./RoleModificationModal";

export default function RoleModify() {
  RoleGuard("Admin");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [modalSelectedRole, setModalSelectedRole] = useState("");

  const roleMapping = {
    User: 1,
    Staff: 2,
    Admin: 3,
  }
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);

      const response = await http
        .get("/Account", {
          withCredentials: true,
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

  const handleRoleChange = (event) => {
    const newRole = event.target.value;
    setModalSelectedRole(newRole);
    console.log(newRole);
  }

  const handleSubmit = (user, newRole) => {
    var userId = user.id;
    var roleId = roleMapping[newRole];
      console.log("User Id", user.id);
    console.log("New Role", roleId);
    http.put('/Auth/roleModify',
      { userId, roleId },
      { withCredentials: true }
    )
      .then(response => {
        // Update UI after role modification
        setUsers(users.map(user =>
          user.id === userId ? { ...user, role: newRole } : user
        ));
        handleCloseModal();  // Close modal after success
        alert("User role updated successfully!");
        window.location.reload();
      })
      .catch(error => {
        console.error(error);
        alert("Error updating role");
      });
  };

  const handleCardClick = (user) => {
    setSelectedUser(user);
    console.log(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleSortByChange = (event) => {
    setSortBy(event.target.value);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10; // 2 columns * 5 rows = 10 users per page
  const filteredUsers = users
    .filter((user) => {
      const matchesSearchTerm =
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.roleName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesRole =
        selectedRole && selectedRole !== "All Roles"
          ? user.roleName === selectedRole
          : true;

      return matchesSearchTerm && matchesRole;
    })
    .sort((a, b) => {
      if (sortBy === "username") {
        return a.username.localeCompare(b.username);
      } else if (sortBy === "createdAt") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      return 0;
    });

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  const UserProfileCard = ({ user }) => {
    const navigate = useNavigate();

    // Function to handle navigation to the user's profile page
    const getRoleStyles = (roleName) => {
      switch (roleName.toLowerCase()) {
        case "user":
          return {
            backgroundColor: "#E0F2FE", // Light blue background
            color: "#007AFF", // Blue text color
          };
        case "admin":
          return {
            backgroundColor: "#FFE4E6", // Light red background
            color: "#DC2626", // Red text color
          };
        case "staff":
          return {
            backgroundColor: "#F0FDF4", // Light green background
            color: "#16A34A", // Green text color
          };
        default:
          return {
            backgroundColor: "#E0F2FE", // Default light blue background
            color: "#007AFF", // Default blue text color
          };
      }
    };

    const ProfileImage = styled(Avatar)(({ theme }) => ({
      width: theme.spacing(12),
      height: theme.spacing(12),
      marginBottom: theme.spacing(2),
    }));
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
          <ProfileImage
            alt={user.username}
            src={
              user.imageFile
                ? `${import.meta.env.VITE_FILE_BASE_URL}${user.imageFile}`
                : '/path/to/default-image.jpg'  // Provide a fallback image if no profile image is set
            }
            sx={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              marginBottom: 2,
              marginRight: 2,
              border: "4px solid #fff",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          />
          {/* User Info */}
          <CardContent
            sx={{ padding: "0", paddingLeft: "16px", marginTop: "1em" }}
          >
            {/* <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              {user.tierName}
            </Typography> */}
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
              color:
                user.roleName.toLowerCase() === "user"
                  ? "#007AFF" // Blue text color for 'User'
                  : user.roleName.toLowerCase() === "admin"
                    ? "#DC2626" // Red text color for 'Admin'
                    : "#16A34A", // Green text color for 'Staff'
              backgroundColor: "#E0F2FE", // Light blue background for 'User'
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          />

          {/* Modify Role Button */}
          <Button
            variant="outlined"
            onClick={() => handleCardClick(user)}
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
            Modify Role
          </Button>
        </Box>
      </Card>
    );
  };

  return (
    <Box sx={{ display: "flex", height: "100%", marginTop: "2em" }}>
      <AdminSidebar />
      <Box
        sx={{
          marginLeft: "240px",
          flexGrow: 1,
          backgroundColor: "#FFFFFF",
          padding: "3em",
          borderTopRightRadius: "1em",
          height: "100%",
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom fontWeight="bold" sx={{ marginTop: "0.5em" }}>
            Accounts Role Modification
          </Typography>

          <Box display="flex" alignItems="center" mb={2}>
            <TextField
              label="Search"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{
                mr: 2,
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused": {
                    fieldset: {
                      borderColor: "#C6487E !important", // Keep your border color
                    },
                  },
                },
                "& .MuiInputLabel-root": {
                  // Target the label specifically
                  color: "black", // Default label color
                  "&.Mui-focused": {
                    // Label styles when focused
                    color: "black !important", // Black on focus
                  },
                },
              }}
            />
            <FormControl
              sx={{
                minWidth: 120,
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused": {
                    fieldset: {
                      borderColor: "#C6487E !important", // Keep your border color
                    },
                  },
                },
                "& .MuiInputLabel-root": {
                  // Target the label specifically
                  color: "black", // Default label color
                  "&.Mui-focused": {
                    // Label styles when focused
                    color: "black !important", // Black on focus
                  },
                },
              }}
            >
              {/* <InputLabel id="role-label">Role</InputLabel> */}
              <Select
                labelId="role-label"
                id="role-select"
                value={selectedRole || "All Roles"}
                onChange={(e) => setSelectedRole(e.target.value)} // Set selected role
              >
                <MenuItem value="All Roles">All Roles</MenuItem>
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
              <Typography variant="h5">Platform Users</Typography>
              {filteredUsers.length > 0 ? (
                <>
                  <Grid container spacing={2}>
                    {currentUsers.map((user) => (
                      <Grid
                        item
                        sm={12} // 2 columns on small screens
                        md={6}
                        lg={6}  // 4 columns on large screens
                        key={user.id}
                      >
                        <Box
                          sx={{
                            width: "100%", // Ensure the card takes up the full width of the grid item
                            maxWidth: "100%", // Prevent overflow
                            height: "100%", // Ensure consistent height
                            display: "flex",
                            justifyContent: "center", // Center the card horizontally
                          }}
                        >
                          <UserProfileCard user={user} />
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                  <Box display="flex" justifyContent="center" mt={3}>
                    <Pagination
                      count={totalPages}
                      page={currentPage}
                      onChange={handlePageChange}
                      color="primary"
                    />
                  </Box>
                </>
              ) : (
                <Box textAlign="center" mt={5}>
                  <PersonOffOutlinedIcon style={{ fontSize: 60, color: "grey" }} />
                  <Typography variant="h6" mt={2} color="textSecondary">
                    Account does not exist
                  </Typography>
                </Box>
              )}
            </Box>
          ) : error ? (
            <p>Error fetching users: {error.message}</p>
          ) : (
            <p>Loading users...</p>
          )}
        </Box>
      </Box>
      {selectedUser && (
        <RoleModificationModal
          open={isModalOpen}
          handleClose={handleCloseModal}
          user={selectedUser}
          role={modalSelectedRole}
          handleRoleChange={handleRoleChange}
          handleSubmit={() => handleSubmit(selectedUser, modalSelectedRole)}
        />
      )}
    </Box>
  );
}
