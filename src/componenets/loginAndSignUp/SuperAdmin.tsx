import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CardContent, Typography, Grid, Button, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';
import ClinicIcon from '@mui/icons-material/LocalHospital';
import StaffIcon from '@mui/icons-material/People';

import superImage from '../../assets/super.png'; // Adjust based on your folder structure

// Styled component for the main container
const Container = styled(Grid)(({ theme }) => ({
  minHeight: '100vh',
  position: 'relative',
  padding: theme.spacing(4),
  textAlign: 'center',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `url(${superImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: 'blur(8px)', // Apply blur to the background image
    zIndex: -1,
  },
}));

// Styled component for the bubble design with motion
const MotionBubbleCard = styled(motion.div)(({ theme }) => ({
  width: '200px',
  height: '200px',
  borderRadius: '50%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  margin: 'auto',
  marginBottom: theme.spacing(2), // Smaller margin between BubbleCards
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)', // Box shadow for depth
  background: 'linear-gradient(135deg, #FFC107 0%, #FF5722 100%)', // Gradient background
  cursor: 'pointer', // Change cursor to pointer on hover
}));

const LogoutButton = styled(Button)(({ theme }) => ({
  position: 'absolute',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  backgroundColor: '#296BE4', // Blue color
  color: '#fff',
  '&:hover': {
    backgroundColor: '#2554c7',
  },
}));

const SuperAdmin: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleClinicClick = () => {
    navigate('/stepper');
  };

  const handleRoleClick = () => {
    navigate('/roleCreation');
  };

  const handleWelcomeClick = () => {
    navigate('/allUsers');
  };

  const handleLogoutClick = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleConfirmLogout = () => {
    navigate('/');
    localStorage.removeItem('username');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('roleName');
    localStorage.removeItem('access_token');
    localStorage.removeItem('id');
  };

  // useEffect(() => {
  //   // Disable browser back and forward buttons
  //   const handlePopState = (event: PopStateEvent) => {
  //     event.preventDefault();
  //     navigate(0); // Reload the page to prevent navigation
  //   };

  //   window.history.pushState(null, document.title, window.location.href);
  //   window.addEventListener('popstate', handlePopState);

  //   return () => {
  //     window.removeEventListener('popstate', handlePopState);
  //   };
  // }, [navigate]);

  return (
    <Container container justifyContent="center" alignItems="center">
      <Grid item xs={12}>
        <Typography variant="h2" gutterBottom style={{ color: '#0E19E6', fontSize: '2rem', fontWeight: 600, textAlign: 'left' }}>
          Wellnest,
        </Typography>

        <Typography variant="body1" paragraph style={{ color: '#020205', fontWeight: 600 }}>
          Our medical records project is designed to meticulously manage patient histories, ensuring comprehensive and secure storage of health data over time. By centralizing patient information, including medical diagnoses, treatments, medications, and surgical procedures, our system facilitates efficient healthcare delivery and continuity of care.
        </Typography>
        <Typography variant="body1" paragraph style={{ color: '#020205', fontWeight: 600 }}>
          Our system integrates advanced analytics capabilities to derive insights from patient data, supporting clinical decision-making and research efforts.
        </Typography>
        <Typography variant="body1" paragraph style={{ color: '#020205', fontWeight: 600 }}>
          healthcare systems, enhancing care coordination across facilities and specialties.
        </Typography>
      </Grid>
      <Grid item container xs={7} justifyContent="space-around" alignItems="center" style={{ marginTop: '20px' }}>
        <Grid item>
          <MotionBubbleCard
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95, rotate: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <CardContent>
              <Box marginBottom={2}>
                <ClinicIcon style={{ fontSize: 50, color: '#296BE4' }} /> {/* Blue color for ClinicIcon */}
              </Box>
              <Typography variant="h5" margin={2}>Clinic</Typography>
              <Button onClick={handleClinicClick} variant="contained" color="primary">
                Create
              </Button>
            </CardContent>
          </MotionBubbleCard>
        </Grid>
        <Grid item>
          <MotionBubbleCard
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95, rotate: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <CardContent>
              <Box marginBottom={2}>
                <StaffIcon style={{ fontSize: 50, color: '#296BE4' }} /> {/* Blue color for StaffIcon */}
              </Box>
              <Typography variant="h5" margin={2}>User</Typography>
              <Button onClick={handleWelcomeClick} variant="contained" color="primary">
                Create
              </Button>
            </CardContent>
          </MotionBubbleCard>
        </Grid>
        <Grid item>
          <MotionBubbleCard
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95, rotate: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <CardContent>
              <Box marginBottom={2}>
                <ClinicIcon style={{ fontSize: 50, color: '#296BE4' }} /> {/* Blue color for ClinicIcon */}
              </Box>
              <Typography variant="h5" margin={2}>Role</Typography>
              <Button onClick={handleRoleClick} variant="contained" color="primary">
                 Create
              </Button>
            </CardContent>
          </MotionBubbleCard>
        </Grid>
      </Grid>

      <LogoutButton variant="contained" onClick={handleLogoutClick}>
        Log Out
      </LogoutButton>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure you want to log out?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This will log you out and return to the login page.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
          <Button onClick={handleConfirmLogout} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SuperAdmin;
