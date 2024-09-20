import React, { useEffect, useState, useRef } from 'react';
import axios, { AxiosError } from 'axios';
import { Avatar, Button, Container, Grid, TextField, Typography, Box, Paper, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useToken } from '../api/Token';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const Profile: React.FC = () => {
  const [user, setUser] = useState<any>(null); // Replace `any` with your user type
  const [editableUser, setEditableUser] = useState<any>(null); // Replace `any` with your user type
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [openPasswordDialog, setOpenPasswordDialog] = useState(false);
  const [openErrorDialog, setOpenErrorDialog] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmationPassword: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const { accessToken } = useToken(); // Use the useToken hook to get the access token
  const myAccountRef = useRef<HTMLDivElement>(null); // Reference to the "My account" section
  const navigate = useNavigate(); // Hook to programmatically navigate

  useEffect(() => {
    const fetchUserData = async () => {
      if (!accessToken) return; // Wait for the access token

      const email = localStorage.getItem('username'); // Retrieve email from localStorage

      if (!email) {
        console.error('No email found in localStorage');
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8080/api/v1/users/${email}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUser(response.data);
        setEditableUser(response.data);
      } catch (error) {
        console.error('Error fetching user data', error);
      }
    };

    fetchUserData();
  }, [accessToken]); // Dependency on accessToken

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditableUser({
      ...editableUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    const email = localStorage.getItem('username'); // Retrieve email from localStorage

    if (!email) {
      console.error('No email found in localStorage');
      return;
    }

    try {
      await axios.put(`http://localhost:8080/api/v1/users/update/${email}`, editableUser, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });
      setUser(editableUser);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating user data', error);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
    myAccountRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpenPasswordDialog = () => setOpenPasswordDialog(true);
  const handleClosePasswordDialog = () => setOpenPasswordDialog(false);

  const handlePasswordChange = async () => {
    try {
      const response = await axios.patch('http://localhost:8080/api/v1/users/changePassword', passwordData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      if (response.status === 200) {
        handleClosePasswordDialog();
        localStorage.removeItem('username');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('role');
        localStorage.removeItem('access_token');
        localStorage.removeItem('id');
        localStorage.removeItem('lastNotificationCount');
        
        navigate('/'); // Redirect to the dashboard
      }
    } catch (error) {
      // Type assertion to handle the error correctly
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'An error occurred while changing the password.';
        setErrorMessage(message);
      } else {
        setErrorMessage('An error occurred while changing the password.');
      }
      
      setOpenErrorDialog(true); // Open the error dialog
    }
  };
  const handleWhatsAppConnect = () => {
    const phoneNumber = user.phoneNumber;
    const whatsappURL = `whatsapp://send?phone=${phoneNumber}`;

    if (navigator.userAgent.match(/Android|iPhone|iPad|iPod|Windows Phone|webOS/i)) {
      window.location.href = whatsappURL;
    } else {
      window.open(whatsappURL, '_blank');
    }
  };

  const handleCloseErrorDialog = () => setOpenErrorDialog(false);

  if (!user) return <div>Loading...</div>;

  return (
    <>
      <Box
        sx={{
          minHeight: '600px',
          backgroundImage: 'url(https://raw.githubusercontent.com/creativetimofficial/argon-dashboard/gh-pages/assets-old/img/theme/profile-cover.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          display: 'flex',
          alignItems: 'center',
          pt: 5,
          pb: 8,
        }}
      >
        <Button
  variant="text"
  color="primary"
  onClick={() => navigate(-1)}
  sx={{
    position: 'fixed', // Fix the button position
    top: 16, // Distance from the top
    left: 16, // Distance from the left
    zIndex: 1000, // Ensures it stays on top of other content
  }}
  startIcon={<ArrowBackIcon />}
>
  Back
</Button>

        <Container>
          <Grid container spacing={3} alignItems="center">
    
            <Grid item lg={7} md={10}>
              <Typography variant="h1" color="white">
                Hello {user.firstName}
              </Typography>
              <Typography variant="body1" color="white" gutterBottom>
                This is your profile page. You can see the progress you've made with your work and manage your projects or assigned tasks.
              </Typography>
              {!isEditing && (
                <Button variant="contained" color="info" onClick={handleEditClick}>
                  Edit profile
                </Button>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Container sx={{ mt: -10 }}>
        <Grid container spacing={4}>
          <Grid item xl={4} xs={12}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Avatar
                src="https://demos.creative-tim.com/argon-dashboard/assets-old/img/theme/team-4.jpg" // Replace with dynamic image URL if available
                sx={{ width: 128, height: 128, mx: 'auto', mb: 2 }}
              />
              <Typography variant="h3">
                {user.firstName} {user.lastName}<span> {user.age}</span>
              </Typography>
              <Typography variant="body2" color="textSecondary">
                <i>{user.address.city}</i>
              </Typography>
              <Typography variant="body1" sx={{ mt: 2 }}>
                {user.role} - {user.specialization}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                University of Computer Science
              </Typography>
              <Box sx={{ mt: 3, mb: 2 }}>
              <Button
                  variant="outlined"
                  color="info"
                  sx={{ mr: 1 }}
                  onClick={handleWhatsAppConnect}
                >
                  Connect
                </Button>
{/* 
                <Button variant="outlined">Message</Button> */}
              </Box>
              <Box>
                <Typography variant="body1">
                  {user.address.aboutMe}
                </Typography>
                <Button variant="text" color="primary" sx={{ mt: 1 }} onClick={handleOpenPasswordDialog}>
                  Change Password
                </Button>
              </Box>
            </Paper>
          </Grid>
          <Grid item xl={8} xs={12}>
            <Paper sx={{ p: 3 }} ref={myAccountRef}>
              <Typography variant="h3" gutterBottom>
                My account
              </Typography>
              <Box component="form">
                <Typography variant="h6" color="textSecondary" gutterBottom>
                  User information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="First name"
                      variant="outlined"
                      name="firstName"
                      value={editableUser.firstName}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Last name"
                      variant="outlined"
                      name="lastName"
                      value={editableUser.lastName}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Specialization"
                      variant="outlined"
                      name="specialization"
                      value={editableUser.specialization}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Email address"
                      variant="outlined"
                      name="email"
                      value={editableUser.email}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </Grid>
                </Grid>
                <Typography variant="h6" color="textSecondary" gutterBottom sx={{ mt: 4 }}>
                  Contact information
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      variant="outlined"
                      name="address"
                      value={editableUser.address.address}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="City"
                      variant="outlined"
                      name="city"
                      value={editableUser.address.city}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Phone number"
                      variant="outlined"
                      name="phoneNumber"
                      value={editableUser.address.phoneNumber}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <TextField
                      fullWidth
                      label="Postal code"
                      variant="outlined"
                      name="postalCode"
                      value={editableUser.address.postalCode}
                      onChange={handleChange}
                      disabled={!isEditing}
                    />
                  </Grid>
                </Grid>
                <Typography variant="h6" color="textSecondary" gutterBottom sx={{ mt: 4 }}>
                  About me
                </Typography>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  variant="outlined"
                  name="aboutMe"
                  value={editableUser.address.aboutMe}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
                {isEditing && (
                  <Box sx={{ mt: 3 }}>
                    <Button variant="contained" color="primary" onClick={handleSave}>
                      Save
                    </Button>
                    <Button variant="outlined" color="secondary" sx={{ ml: 2 }} onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Change Password Dialog */}
      <Dialog open={openPasswordDialog} onClose={handleClosePasswordDialog}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Current Password"
            type="password"
            fullWidth
            value={passwordData.currentPassword}
            onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
          />
          <TextField
            margin="dense"
            label="New Password"
            type="password"
            fullWidth
            value={passwordData.newPassword}
            onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Confirm New Password"
            type="password"
            fullWidth
            value={passwordData.confirmationPassword}
            onChange={(e) => setPasswordData({ ...passwordData, confirmationPassword: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePasswordDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handlePasswordChange} color="primary">
            Change Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Error Dialog */}
      <Dialog open={openErrorDialog} onClose={handleCloseErrorDialog}>
        <DialogTitle>Error</DialogTitle>
        <DialogContent>
          <Typography variant="body1">{errorMessage}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseErrorDialog} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Profile;
