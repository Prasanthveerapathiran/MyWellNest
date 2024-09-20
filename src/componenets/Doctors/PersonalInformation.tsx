import React, { useEffect, useState } from 'react';
import { Typography, TextField, Button, Box, Grid, Snackbar, Alert, Paper, CircularProgress } from '@mui/material';
import axios from 'axios';
import { useToken } from '../../api/Token';
import { useParams } from 'react-router-dom';

interface Doctor {
  firstName: string;
  lastName: string;
  specialization: string;
  email: string;
  phoneNumber: string;
  role: string;
}

const PersonalInformation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { accessToken } = useToken();
  const [doctor, setDoctor] = useState<Doctor>({
    firstName: '',
    lastName: '',
    specialization: '',
    email: '',
    phoneNumber: '',
    role: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/users/user/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setDoctor({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          specialization: response.data.specialization,
          email: response.data.email,
          phoneNumber: response.data.phoneNumber,
          role: response.data.role,
        });
      } catch (error) {
        console.error('Error fetching doctor details:', error);
        setError('Error fetching doctor details.');
      }
    };

    if (id) {
      fetchDoctorDetails();
    }
  }, [id, accessToken, refreshKey]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDoctor({ ...doctor, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.put(`http://localhost:8080/api/v1/users/user/${id}`, doctor, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setSnackbarMessage('Doctor information updated successfully.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      setRefreshKey((prevKey) => prevKey + 1); // Increment refresh key to trigger re-render
    } catch (error) {
      console.error('Error updating doctor information:', error);
      setError('Error updating doctor information.');
      setSnackbarMessage('Error updating doctor information.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 600,
          height: 450, // Adjust height as needed
          minHeight: '300px', // Set a minimum height for consistency
          backgroundColor: '',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{
            color: '#1976d2', // Attractive color for the heading
            fontWeight: 'bold',
            mb: 3,
          }}
        >
          Personal Information
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="First Name"
                name="firstName"
                value={doctor.firstName}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Last Name"
                name="lastName"
                value={doctor.lastName}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Specialization"
                name="specialization"
                value={doctor.specialization}
                onChange={handleInputChange}
                fullWidth
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Role"
                name="role"
                value={doctor.role}
                fullWidth
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={loading}
                  sx={{ width: '50%' }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Update'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
        {error && (
          <Typography color="error" mt={2} align="center">
            {error}
          </Typography>
        )}
      </Paper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default PersonalInformation;
