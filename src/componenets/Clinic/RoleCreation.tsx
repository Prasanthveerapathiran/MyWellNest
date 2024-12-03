import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  MenuItem,
  Select,
  Typography,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";


// Permissions categorized by section
const permissionCategories = {
  Patient: ["VIEW_PATIENT", "UPDATE_PATIENT", "CREATE_PATIENT", "DELETE_PATIENT"],
  Doctor: ["VIEW_DOCTOR", "UPDATE_DOCTOR", "CREATE_DOCTOR", "DELETE_DOCTOR"],
  Manager: ["VIEW_MANAGER", "UPDATE_MANAGER", "CREATE_MANAGER", "DELETE_MANAGER"],
  "Front Desk": ["VIEW_FRONT_DESK", "UPDATE_FRONT_DESK", "CREATE_FRONT_DESK", "DELETE_FRONT_DESK"],
  Admin: ["VIEW_ADMIN", "UPDATE_ADMIN", "CREATE_ADMIN", "DELETE_ADMIN"],
};

const RoleCreationAndUpdate = () => {
  const navigate = useNavigate();
  const [roleName, setRoleName] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [existingRoles, setExistingRoles] = useState<any[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [rolePermissions, setRolePermissions] = useState<string[]>([]);

  // Fetch existing roles from backend
  useEffect(() => {
    fetch("http://localhost:8080/api/v1/admin-role")
      .then((response) => response.json())
      .then((data) => setExistingRoles(data))
      .catch((error) => console.error("Error fetching roles:", error));
  }, []);

  const handleBackClick = () => {
    navigate(-1);
  };

  // Handle permission selection for creating or updating roles
  const handlePermissionChange = (permissionName: string) => {
    setSelectedPermissions((prevSelected) =>
      prevSelected.includes(permissionName)
        ? prevSelected.filter((name) => name !== permissionName)
        : [...prevSelected, permissionName]
    );
  };

  // Handle role selection for updating
  const handleRoleSelect = (roleName: string) => {
    setSelectedRole(roleName);

    // Fetch permissions for the selected role
    const selectedRoleData = existingRoles.find((role) => role.roleName === roleName);
    if (selectedRoleData) {
      setRolePermissions(selectedRoleData.permissions.map((p: any) => p.permissionName));
      setSelectedPermissions(selectedRoleData.permissions.map((p: any) => p.permissionName));
    }
  };

  // Create a new role
  const handleCreateRole = (event: React.FormEvent) => {
    event.preventDefault();
    const roleData = { roleName, permissions: selectedPermissions };

    fetch("http://localhost:8080/api/v1/admin-role/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(roleData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Role created:", data);
        setRoleName("");
        setSelectedPermissions([]);
        setExistingRoles((prev) => [...prev, data]);
      })
      .catch((error) => console.error("Error creating role:", error));
  };

  // Update permissions for an existing role
  const handleUpdatePermissions = () => {
    const updatedRoleData = { roleName: selectedRole, permissions: selectedPermissions };

    fetch(`http://localhost:8080/api/v1/admin-role/update/${selectedRole}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedRoleData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Role updated:", data);
        setExistingRoles((prev) =>
          prev.map((role) => (role.roleName === selectedRole ? data : role))
        );
        setSelectedRole("");
        setRolePermissions([]);
        setSelectedPermissions([]);
      })
      .catch((error) => console.error("Error updating role:", error));
  };

  return (
    <Box padding={4}>
        <IconButton onClick={handleBackClick}>
          <ArrowBackIcon />
        </IconButton>
      <Typography variant="h4" gutterBottom>
        Role Management
      </Typography>
      
      {/* Create Role Section */}
      <form onSubmit={handleCreateRole}>
        <Typography variant="h5" gutterBottom>
          Create New Role
        </Typography>

        {/* Role Name Input */}
        <Box marginBottom={3}>
          <input
            type="text"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            placeholder="Enter role name"
            required
            style={{
              width: "100%",
              padding: "10px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          />
        </Box>

        {/* Permissions Grid */}
        <Grid container spacing={3}>
          {Object.entries(permissionCategories).map(([category, permissions]) => (
            <Grid item xs={12} sm={6} md={4} key={category}>
              <Box
                border={1}
                borderColor="grey.300"
                borderRadius={2}
                padding={2}
                bgcolor="grey.100"
              >
                <Typography variant="h6" gutterBottom>
                  {category} Permissions
                </Typography>
                {permissions.map((permission) => (
                  <FormControlLabel
                    key={permission}
                    control={
                      <Checkbox
                        checked={selectedPermissions.includes(permission)}
                        onChange={() => handlePermissionChange(permission)}
                      />
                    }
                    label={permission}
                  />
                ))}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box marginTop={3}>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Create Role
          </Button>
        </Box>
      </form>

      {/* Update Role Section */}
      <Box marginTop={4}>
        <Typography variant="h5">Update Existing Role</Typography>

        {/* Role Selection Dropdown */}
        <Select
          value={selectedRole}
          onChange={(e) => handleRoleSelect(e.target.value)}
          fullWidth
          displayEmpty
          variant="outlined"
          style={{ marginTop: "16px" }}
        >
          <MenuItem value="" disabled>
            Select Role
          </MenuItem>
          {existingRoles.map((role) => (
            <MenuItem key={role.id} value={role.roleName}>
              {role.roleName}
            </MenuItem>
          ))}
        </Select>

        {/* Permissions for Selected Role */}
        {selectedRole && (
          <>
            <Typography variant="h6" marginTop={3}>
              Update Permissions for {selectedRole}
            </Typography>
            <Grid container spacing={3}>
              {Object.entries(permissionCategories).map(([category, permissions]) => (
                <Grid item xs={12} sm={6} md={4} key={category}>
                  <Box
                    border={1}
                    borderColor="grey.300"
                    borderRadius={2}
                    padding={2}
                    bgcolor="grey.100"
                  >
                    <Typography variant="h6" gutterBottom>
                      {category} Permissions
                    </Typography>
                    {permissions.map((permission) => (
                      <FormControlLabel
                        key={permission}
                        control={
                          <Checkbox
                            checked={selectedPermissions.includes(permission)}
                            onChange={() => handlePermissionChange(permission)}
                          />
                        }
                        label={permission}
                      />
                    ))}
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Box marginTop={3}>
              <Button
                onClick={handleUpdatePermissions}
                variant="contained"
                color="secondary"
                fullWidth
              >
                Update Permissions
              </Button>
            </Box>
          </>
        )}
      </Box>
    </Box>
  );
};

export default RoleCreationAndUpdate;
