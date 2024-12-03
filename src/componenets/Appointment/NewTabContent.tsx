import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  Button,
  Stack,
  Grid,
  IconButton,
  Box,
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import axios from 'axios';
import { useToken } from '../../api/Token';

const NewTabContent: React.FC = () => {
  const location = useLocation();
  const [patients, setPatients] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useToken();
  const [completedConsultations, setCompletedConsultations] = useState<string[]>([]);
  const navigate = useNavigate();
  const userRole = localStorage.getItem('roleName');
  const AnimatedPaper = motion(Paper);

  // Helper function to filter appointments based on time
  const filterAppointments = (appointments: any[]) => {
    const today = new Date();
    const thisYear = today.getFullYear();
    const lastMonth = new Date(today);
    lastMonth.setMonth(today.getMonth() - 1);

    const todayAppointments = appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.startTime);
      return (
        appointmentDate.getDate() === today.getDate() &&
        appointmentDate.getMonth() === today.getMonth() &&
        appointmentDate.getFullYear() === today.getFullYear()
      );
    });

    const lastMonthAppointments = appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.startTime);
      return (
        appointmentDate.getMonth() === lastMonth.getMonth() &&
        appointmentDate.getFullYear() === lastMonth.getFullYear()
      );
    });

    const thisYearAppointments = appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.startTime);
      return appointmentDate.getFullYear() === thisYear;
    });

    return {
      todayAppointments,
      lastMonthAppointments,
      thisYearAppointments,
    };
  };

  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8080/api/v1/appointments', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = response.data;
      setAppointments(data);
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to fetch appointment data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchPatients = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:8080/api/v1/patients', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = response.data;
      setPatients(data);
    } catch (err) {
      console.error('Error fetching patients:', err);
      setError('Failed to fetch patient data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConsultationClick = (patient: any) => {
    // Save the selected patient's data and appointment ID to local storage
    localStorage.setItem('patientId', patient.id);
    localStorage.setItem('doctorId', patient.doctorId);
    localStorage.setItem('medicalHistory', patient.medicalHistory);
    localStorage.setItem('appointmentId', patient.appointmentId); // Added this line
  
    // Mark the consultation as completed for the given patient ID
    setCompletedConsultations((prev) => [...prev, patient.id]);
  
    // Navigate to the /dashboard/record page
    navigate('/dashboard/record');
  };
  

  useEffect(() => {
    fetchAppointments();
    fetchPatients();
  }, [accessToken]);

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" height="100%">
        <CircularProgress />
        <Typography variant="body1" marginTop={2}>
          Loading data...
        </Typography>
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack alignItems="center" justifyContent="center" height="100%">
        <Typography color="error" variant="h6" textAlign="center">
          {error}
        </Typography>
        <Button variant="contained" onClick={fetchAppointments} sx={{ marginTop: 2 }}>
          Retry
        </Button>
      </Stack>
    );
  }

  const { todayAppointments, lastMonthAppointments, thisYearAppointments } = filterAppointments(appointments);

  return (
    <div>
        <motion.div
        initial={{ x: '100vw' }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 120 }}
      >
        <Typography variant="h4" gutterBottom align="center">
          New Appointments
        </Typography>
      </motion.div>
      <Grid container spacing={2} marginBottom={3}>
        {/* Today's Appointments */}
        <Grid item xs={12} sm={6} md={4}>
          <AnimatedPaper
            elevation={5}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            sx={{
              p: 3,
              height: '100%',
              background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
              color: '#fff',
              borderRadius: '15px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Today's Appointments
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>
                {todayAppointments.length}
              </Typography>
            </Box>
            <IconButton
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                backgroundColor: '#fff',
                color: '#1e3c72',
                '&:hover': {
                  backgroundColor: '#ddd',
                },
                borderRadius: '50%',
                padding: 1.5,
              }}
            >
              <InfoIcon />
            </IconButton>
          </AnimatedPaper>
        </Grid>

        {/* Last Month's Appointments */}
        <Grid item xs={12} sm={6} md={4}>
          <AnimatedPaper
            elevation={5}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            sx={{
              p: 3,
              height: '100%',
              background: 'linear-gradient(135deg, #8360c3 0%, #2ebf91 100%)',
              color: '#fff',
              borderRadius: '15px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                Last Month's Appointments
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>
                {lastMonthAppointments.length}
              </Typography>
            </Box>
            <IconButton
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                backgroundColor: '#fff',
                color: '#8360c3',
                '&:hover': {
                  backgroundColor: '#ddd',
                },
                borderRadius: '50%',
                padding: 1.5,
              }}
            >
              <InfoIcon />
            </IconButton>
          </AnimatedPaper>
        </Grid>

        {/* This Year's Appointments */}
        <Grid item xs={12} sm={6} md={4}>
          <AnimatedPaper
            elevation={5}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            sx={{
              p: 3,
              height: '100%',
              background: 'linear-gradient(135deg, #f12711 0%, #f5af19 100%)',
              color: '#fff',
              borderRadius: '15px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              position: 'relative',
            }}
          >
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                This Year's Appointments
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>
                {thisYearAppointments.length}
              </Typography>
            </Box>
            <IconButton
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                backgroundColor: '#fff',
                color: '#f12711',
                '&:hover': {
                  backgroundColor: '#ddd',
                },
                borderRadius: '50%',
                padding: 1.5,
              }}
            >
              <InfoIcon />
            </IconButton>
          </AnimatedPaper>
        </Grid>
      </Grid>

      {/* Patient Table */}
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Name</TableCell>
              <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Age</TableCell>
              <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Token</TableCell>
              <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Medical History</TableCell>
              <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Doctor ID</TableCell>
              <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Blood Group</TableCell>
              <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Appointment Date</TableCell>
              <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Phone Number</TableCell>
              {userRole === 'DOCTOR' && <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Consultation</TableCell>}
              {userRole === 'ADMIN' && <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>case sheet</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell>{patient.id}</TableCell>
                <TableCell>{patient.name}</TableCell>
                <TableCell>{patient.age}</TableCell>
                <TableCell>{patient.patientToken}</TableCell>
                <TableCell>{patient.medicalHistory}</TableCell>
                <TableCell>{patient.doctorId}</TableCell>
                <TableCell>{patient.bloodGroup}</TableCell>
                <TableCell>{new Date(patient.appointmentDate).toLocaleString()}</TableCell>
                <TableCell>{patient.phoneNumber}</TableCell>
                {userRole === 'DOCTOR' && (
                  <TableCell>
                    {completedConsultations.includes(patient.id) ? (
                      <Button variant="contained" disabled>
                        Completed
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleConsultationClick(patient)}
                      >
                        Start Consultation
                      </Button>
                    )}
                  </TableCell>
                )}
                
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default NewTabContent;
