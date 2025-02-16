import React from "react";
import {
  Modal,
  Box,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Grid,
  Avatar,
} from "@mui/material";
import { styled } from "@mui/system";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

const RoleModificationModal = ({
  open,
  handleClose,
  user,
  selectedRole,
  handleRoleChange,
  handleSubmit,
}) => {
  const ProfileImage = styled(Avatar)(({ theme }) => ({
    width: theme.spacing(12),
    height: theme.spacing(12),
    marginBottom: theme.spacing(2),
  }));
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 450, // Increased width for more spacious design
          bgcolor: "background.paper",
          borderRadius: 3, // Rounded corners for a softer look
          boxShadow: 24,
          p: 4,
          outline: "none",
          transition: "transform 0.3s ease-out", // Smooth transition
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <ProfileImage
            alt={user.username}
            src={
              user.imageFile
                ? `${import.meta.env.VITE_FILE_BASE_URL}${user.imageFile}`
                : "/path/to/default-image.jpg" // Provide a fallback image if no profile image is set
            }
            sx={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              marginBottom: 2,
              marginRight: 2,
              border: "4px solid #fff",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          />
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: 600, color: "#333" }}
          >
            {user.username}
          </Typography>

          <Typography variant="body1" sx={{ mb: 2, color: "#555" }}>
            Joined on{" "}
            {new Date(user.createdAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {" "}
            {/* Use Flexbox */}
            <VerifiedUserIcon sx={{ color: "#C6487E", mr: 1 }} />{" "}
            {/* Add margin-right */}
            <Typography variant="body1" sx={{ color: "#555" }}>
              {" "}
              {/* Remove mb */}
              <strong>{user.roleName}</strong>
            </Typography>
          </Box>
        </Box>
        <hr
          style={{
            borderTop: "1px solid lightgrey",
            marginTop: "2em",
            marginBottom: "2em",
          }}
        ></hr>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 500, mb: 1, color: "#444" }}
          >
            Role Options
          </Typography>

          <RadioGroup
            value={selectedRole}
            onChange={handleRoleChange}
            row // Add the row prop here
            sx={{
              mb: 2,
              "& .MuiRadio-root": {
                // Target all Radio components within the RadioGroup
                color: "inherit", // Default color (usually gray)
              },
              "& .MuiRadio-root.Mui-checked": {
                // Target checked Radio components
                color: "#C6487E !important", // Your desired checked color
              },
            }}
          >
            <FormControlLabel value="User" control={<Radio />} label="User" />
            <FormControlLabel value="Staff" control={<Radio />} label="Staff" />
            <FormControlLabel value="Admin" control={<Radio />} label="Admin" />
          </RadioGroup>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Button
                onClick={handleSubmit}
                variant="contained"
                color="primary"
                fullWidth
                sx={{
                  backgroundColor: "#C6487E",
                  padding: "10px",
                  fontSize: "1rem",
                  color: "#fff",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  "&:hover": { backgroundColor: "#C6487E" },
                }}
              >
                Update User Role
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
};

export default RoleModificationModal;
