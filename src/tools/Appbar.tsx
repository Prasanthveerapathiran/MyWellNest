import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import {
  AppBar,
  Toolbar,
  IconButton,
  InputBase,
  Badge,
  Avatar,
  Box,
  Menu,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { styled, alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useToken } from '../api/Token';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: 'auto',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  [theme.breakpoints.up('md')]: {
    width: '50%',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
  },
}));

const SuggestionsBox = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  zIndex: 1,
  marginTop: theme.spacing(1),
  left: 0,
  right: 0,
}));

interface AppbarProps {
  toggleDrawer: (open: boolean) => void;
}

const Appbar: React.FC<AppbarProps> = ({ toggleDrawer }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [notificationDialogOpen, setNotificationDialogOpen] = useState(false);
  const [emergencyAppointments, setEmergencyAppointments] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const searchBoxRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { accessToken } = useToken();

  useEffect(() => {
    if (searchQuery) {
      const fetchSuggestions = async () => {
        try {
          const response = await axios.get('http://localhost:8080/api/v1/patients', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              query: searchQuery,
            },
          });
          setSearchSuggestions(response.data);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching search suggestions:', error);
        }
      };

      fetchSuggestions();
    } else {
      setShowSuggestions(false);
    }
  }, [searchQuery, accessToken]);

  useEffect(() => {
    const fetchEmergencyAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/appointments/status/emergency', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const newCount = response.data.length;
        const lastViewedCount = parseInt(localStorage.getItem('lastNotificationCount') || '0', 10);

        if (newCount > lastViewedCount) {
          setNotificationCount(newCount - lastViewedCount);
        } else {
          setNotificationCount(0);
        }

        setEmergencyAppointments(response.data);
      } catch (error) {
        console.error('Error fetching emergency appointments:', error);
      }
    };

    fetchEmergencyAppointments();
  }, [accessToken]);

  useEffect(() => {
    if (notificationCount > 0) {
      localStorage.setItem('lastNotificationCount', (notificationCount + parseInt(localStorage.getItem('lastNotificationCount') || '0', 10)).toString());
    }
  }, [notificationCount]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    setAnchorEl(null);
    navigate('/profile');
  };

  const handleLogoutClick = () => {
    setAnchorEl(null);
    setLogoutDialogOpen(true);
  };

  const handleConfirmLogout = () => {
    setLogoutDialogOpen(false);
    localStorage.removeItem('username');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('role');
    localStorage.removeItem('access_token');
    localStorage.removeItem('lastNotificationCount');
    localStorage.removeItem('id');
    navigate('/');
  };

  const handleNotificationClick = () => {
    setNotificationDialogOpen(true);
    setNotificationCount(0); // Reset the notification count when the dialog is opened
  };

  const handleDialogClose = () => {
    setLogoutDialogOpen(false);
    setNotificationDialogOpen(false);
    setShowSuggestions(false);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (searchQuery.trim()) {
      const selectedPatient = searchSuggestions.find(
        (patient) => patient.name.toLowerCase() === searchQuery.toLowerCase()
      );

      if (selectedPatient) {
        navigate(`/patient-details/${selectedPatient.id}`);
      } else {
        alert('No patient found with that name.');
      }

      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (patient: any) => {
    navigate(`/patient-details/${patient.id}`);
    setShowSuggestions(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={() => toggleDrawer(true)}
        >
          <MenuIcon />
        </IconButton>

        <Search ref={searchBoxRef}>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <form onSubmit={handleSearchSubmit}>
            <StyledInputBase
              placeholder="Search Patients…"
              inputProps={{ 'aria-label': 'search' }}
              value={searchQuery}
              onChange={handleSearchChange}
            />
         {showSuggestions && (
  <SuggestionsBox>
    <List>
      {searchSuggestions
        .filter(
          (patient) =>
            patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            patient.patientToken.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .map((patient, index) => (
          <ListItem
            button
            key={index}
            onClick={() => handleSuggestionClick(patient)}
          >
            <ListItemText
              primary={
                <>
                  <span style={{ color: '#1976d2', fontWeight: 'bold' }}>
                    {patient.name}
                  </span>{' '}
                  <span
                    style={{
                      backgroundColor: '#f3f4f6',
                      padding: '2px 5px',
                      borderRadius: '4px',
                      fontSize: '0.9em',
                    }}
                  >
                    (token no: {patient.patientToken})
                  </span>
                </>
              }
            />
          </ListItem>
        ))}
    </List>
  </SuggestionsBox>
)}

          </form>
        </Search>
        <Box sx={{ flexGrow: 1 }} />
        <IconButton color="inherit" onClick={handleNotificationClick}>
          <Badge badgeContent={notificationCount > 0 ? notificationCount : undefined} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <IconButton color="inherit" onClick={handleMenuOpen}>
          <Avatar alt="Profile Picture" sx={{ width: 40, height: 45, marginRight: 3 }} src="../../src/assets/profile.jpg" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
          <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
        </Menu>
      </Toolbar>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutDialogOpen}
        onClose={handleDialogClose}
      >
        <DialogTitle>Confirm Logout</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmLogout} color="primary" autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>

      {/* Emergency Appointments Dialog */}
      <Dialog
        open={notificationDialogOpen}
        onClose={handleDialogClose}
      >
        <DialogTitle>Emergency Appointments</DialogTitle>
        <DialogContent>
          {emergencyAppointments.length > 0 ? (
            emergencyAppointments.map((appointment, index) => (
              <Box key={index} sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  Patient Name: {appointment.patientname}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                  Descriptions: {appointment.descriptions}
                </Typography>
              </Box>
            ))
          ) : (
            <DialogContentText>
              No emergency appointments at the moment.
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </AppBar>
  );
};

export default Appbar;
