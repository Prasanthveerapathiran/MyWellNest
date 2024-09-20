import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  TextField,
  Button,
  Typography,
  Container,
  CircularProgress,
  Snackbar,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  SelectChangeEvent,
  Box,
  Paper,
  Divider,
} from '@mui/material';
import axios from 'axios';
import SendIcon from '@mui/icons-material/Send';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import FacebookIcon from '@mui/icons-material/Facebook';
import PhoneIcon from '@mui/icons-material/Phone';
import { useToken } from '../../../api/Token';

const UpdateAppointment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { accessToken } = useToken();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState({
    patientname: '',
    endTime: '',
    startTime: '',
    status: '',
    descriptions: '',
    shareWithPatient: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const fetchAppointment = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/appointments/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setAppointment(response.data);
      } catch (error) {
        console.error('Error fetching appointment:', error);
        setError('Error fetching appointment.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [id, accessToken]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setAppointment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setAppointment((prev) => ({
      ...prev,
      status: event.target.value,
    }));
  };

  const handleShareWithPatient = (type: 'whatsapp' | 'facebook' | 'phone') => {
    setAppointment((prev) => ({
      ...prev,
      shareWithPatient: type,
    }));
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await axios.put(`http://localhost:8080/api/v1/appointments/updateappointment/${id}`, appointment, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setSnackbarMessage('Appointment updated successfully.');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      navigate(-1);
    } catch (error) {
      console.error('Error updating appointment:', error);
      setSnackbarMessage('Error updating appointment.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          backgroundColor: '#f7f9fc',
          padding: 4,
          borderRadius: 3,
          boxShadow: 3,
          marginTop: 4,
          animation: 'fadeIn 0.5s',
          '@keyframes fadeIn': {
            '0%': { opacity: 0 },
            '100%': { opacity: 1 },
          },
        }}
      >
        <Typography variant="h4" mb={2} align="center" sx={{ fontWeight: 'bold' }}>
          Update Appointment
        </Typography>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Typography color="error" mt={2} align="center">
            {error}
          </Typography>
        ) : (
          <form onSubmit={handleFormSubmit}>
            <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
              <Typography variant="h6" gutterBottom>
                Appointment Details
              </Typography>
              <Divider />
              <TextField
                label="Patient Name"
                name="patientname"
                value={appointment.patientname}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                variant="outlined"
              />
              <TextField
                label="Start Time"
                name="startTime"
                type="datetime-local"
                value={appointment.startTime}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
              />
              <TextField
                label="End Time"
                name="endTime"
                type="datetime-local"
                value={appointment.endTime}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
              />
              <FormControl fullWidth margin="normal" variant="outlined">
                <InputLabel>Status</InputLabel>
                <Select
                  value={appointment.status}
                  onChange={handleStatusChange}
                  label="Status"
                >
                  <MenuItem value="Approved">Approved</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                </Select>
              </FormControl>
              <TextField
                label="Descriptions"
                name="descriptions"
                value={appointment.descriptions}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
                multiline
                rows={4}
                variant="outlined"
              />
            </Paper>
            <Paper elevation={3} sx={{ padding: 3, marginBottom: 3 }}>
              <Typography variant="h6" gutterBottom>
                Share with Patient
              </Typography>
              <Divider />
              <Grid container spacing={2} justifyContent="center" sx={{ marginTop: 1 }}>
                <Grid item xs={12} sm={4}>
                  <Button
                    variant="outlined"
                    onClick={() => handleShareWithPatient('whatsapp')}
                    fullWidth
                    sx={{
                      backgroundColor: appointment.shareWithPatient === 'whatsapp' ? '#128C7E' : '#ffffff',
                      color: appointment.shareWithPatient === 'whatsapp' ? '#ffffff' : '#000000',
                      '&:hover': {
                        backgroundColor: '#128C7E',
                        color: '#ffffff',
                      },
                    }}
                  >
                    <WhatsAppIcon sx={{ mr: 1 }} /> WhatsApp
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    variant="outlined"
                    onClick={() => handleShareWithPatient('facebook')}
                    fullWidth
                    sx={{
                      backgroundColor: appointment.shareWithPatient === 'facebook' ? '#3B5998' : '#ffffff',
                      color: appointment.shareWithPatient === 'facebook' ? '#ffffff' : '#000000',
                      '&:hover': {
                        backgroundColor: '#3B5998',
                        color: '#ffffff',
                      },
                    }}
                  >
                    <FacebookIcon sx={{ mr: 1 }} /> Facebook
                  </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Button
                    variant="outlined"
                    onClick={() => handleShareWithPatient('phone')}
                    fullWidth
                    sx={{
                      backgroundColor: appointment.shareWithPatient === 'phone' ? '#25D366' : '#ffffff',
                      color: appointment.shareWithPatient === 'phone' ? '#ffffff' : '#000000',
                      '&:hover': {
                        backgroundColor: '#25D366',
                        color: '#ffffff',
                      },
                    }}
                  >
                    <PhoneIcon sx={{ mr: 1 }} /> Phone
                  </Button>
                </Grid>
              </Grid>
            </Paper>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 3 }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                endIcon={<SendIcon />}
                sx={{
                  width: '200px',
                  height: '50px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  backgroundColor: '#1976d2',
                  '&:hover': {
                    backgroundColor: '#115293',
                  },
                }}
              >
                Update
              </Button>
            </Box>
          </form>
        )}
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
    </Container>
  );
};

export default UpdateAppointment;
