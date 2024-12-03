import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Typography,
  Box,
  IconButton,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useToken } from "../../api/Token";
import { styled } from "@mui/system";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Import Back Icon

// Interfaces for Address and User
interface Address {
  status: boolean;
  address: string;
  city: string;
  phoneNumber: string;
  postalCode: string;
  aboutMe: string;
}

interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  specialization: string;
  address: Address;
  roleName: string;
  enabled: boolean;
}

// Styled components for customization
const StyledTableContainer = styled(TableContainer)<{
  component?: React.ElementType;
}>(({ theme }) => ({
  margin: "20px 0",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
}));

const StyledTableCell = styled(TableCell)({
  fontWeight: 600,
  fontSize: "16px",
  color: "#4A4A4A",
});

const StyledTableRow = styled(TableRow)({
  "&:nth-of-type(even)": {
    backgroundColor: "#f9f9f9",
  },
  "&:hover": {
    backgroundColor: "#f1f1f1",
  },
});

const AllUsers: React.FC = () => {
  const { accessToken } = useToken();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [open, setOpen] = useState(false);

  // Navigate back to the previous page
  const handleBackClick = () => {
    navigate(-1);
  };

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/users", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch individual user details for editing
  const handleEdit = async (id: number) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/users/user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setSelectedUser(data);
        setOpen(true);
      } else {
        console.error("Failed to fetch user details");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  // Close the edit dialog
  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
  };

  // Save updated user details
  const handleSave = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/users/user/${selectedUser.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(selectedUser),
        }
      );
      if (response.ok) {
        fetchUsers(); // Refresh user list
        handleClose(); // Close dialog
      } else {
        console.error("Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  // Navigate to the signup page
  const handleRegisterClick = () => {
    navigate("/signup");
  };

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return <Typography variant="h6">Loading...</Typography>;
  }

  return (
    <>
      {/* Header with Back Button */}
      <Box display="flex" alignItems="center" mb={3} px={2}>
        <IconButton onClick={handleBackClick}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" fontWeight={700} ml={2}>
          All Users in the Clinic
        </Typography>
      </Box>

      {/* Register Button */}
      <Box display="flex" justifyContent="flex-end" mb={2} marginRight={11}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleRegisterClick}
          sx={{ fontWeight: 600 }}
        >
          Register
        </Button>
      </Box>

      {/* User Table */}
      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell>Role</StyledTableCell>
              <StyledTableCell>First Name</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Specialization</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Edit</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <StyledTableRow key={user.id}>
                <TableCell>{user.roleName}</TableCell>
                <TableCell>{user.firstName}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.specialization}</TableCell>
                <TableCell>
                  <Typography
                    color={user.address.status ? "green" : "red"}
                    fontWeight={600}
                  >
                    {user.address.status ? "Active" : "Inactive"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleEdit(user.id)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>

      {/* Edit Dialog */}
      {selectedUser && (
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Edit User</DialogTitle>
          <DialogContent>
            <TextField
              label="First Name"
              fullWidth
              margin="dense"
              value={selectedUser.firstName}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, firstName: e.target.value })
              }
            />
            <TextField
              label="Last Name"
              fullWidth
              margin="dense"
              value={selectedUser.lastName}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, lastName: e.target.value })
              }
            />
            <TextField
              label="Email"
              fullWidth
              margin="dense"
              value={selectedUser.email}
              onChange={(e) =>
                setSelectedUser({ ...selectedUser, email: e.target.value })
              }
            />
            <TextField
              label="Specialization"
              fullWidth
              margin="dense"
              value={selectedUser.specialization}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  specialization: e.target.value,
                })
              }
            />
            {/* Address Fields */}
            <TextField
              label="Address"
              fullWidth
              margin="dense"
              value={selectedUser.address.address}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  address: { ...selectedUser.address, address: e.target.value },
                })
              }
            />
            <TextField
              label="City"
              fullWidth
              margin="dense"
              value={selectedUser.address.city}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  address: { ...selectedUser.address, city: e.target.value },
                })
              }
            />
            <TextField
              label="Phone Number"
              fullWidth
              margin="dense"
              value={selectedUser.address.phoneNumber}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  address: { ...selectedUser.address, phoneNumber: e.target.value },
                })
              }
            />
            <TextField
              label="Postal Code"
              fullWidth
              margin="dense"
              value={selectedUser.address.postalCode}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  address: { ...selectedUser.address, postalCode: e.target.value },
                })
              }
            />
            <TextField
              label="About Me"
              fullWidth
              margin="dense"
              value={selectedUser.address.aboutMe}
              onChange={(e) =>
                setSelectedUser({
                  ...selectedUser,
                  address: { ...selectedUser.address, aboutMe: e.target.value },
                })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
};

export default AllUsers;
