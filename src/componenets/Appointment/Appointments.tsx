import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert,
  Card, CardContent, Box, Tab, Tabs, Grid, List, ListItem, ListItemText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useToken } from '../../api/Token';
import { motion } from 'framer-motion';

interface Patient {
  id: number;
  name: string;
  age: number;
  patientToken: string;
  medicalHistory: string;
  clinicId: number;
  branchId: number;
  bloodGroup: string;
  phoneNumber: number;
  createdDate: string;
}

interface Appointment {
  id: number;
  doctorId: number;
  patientId: number;
  patientname: string;
  dateOfVisit: string;
  startTime: string;
  endTime: string;
  status: string;
  descriptions: string | null;
  shareWithPatient: string;
  clinicId: number;
  branchId: number;
}

const Appointments: React.FC = () => {
  const { accessToken } = useToken();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredTokens, setFilteredTokens] = useState<Patient[]>([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const navigate = useNavigate();

  const role = localStorage.getItem('role');
  const doctorId = localStorage.getItem('id');

  useEffect(() => {
    // Fetch appointments
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/appointments', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setAppointments(response.data);
      } catch (err) {
        setError('Failed to fetch appointments');
      } finally {
        setLoading(false);
      }
    };

    // Fetch patients for token suggestions
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/patients', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setPatients(response.data);
      } catch (err) {
        console.error('Error fetching patients:', err);
      }
    };

    fetchAppointments();
    fetchPatients();
  }, [accessToken]);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setSearchTerm(searchValue);

    // Filter patient tokens based on the search term
    if (searchValue.length > 0) {
      const filtered = patients.filter((patient) =>
        patient.patientToken.toLowerCase().startsWith(searchValue.toLowerCase())
      );
      setFilteredTokens(filtered);
    } else {
      setFilteredTokens([]);
    }
  };

  const handleTokenSelect = (patient: Patient) => {
    navigate(`/patient-details/${patient.id}`);
    handleCloseDialog();
  };

  const currentDate = new Date();
  const startOfToday = new Date(currentDate);
  startOfToday.setHours(0, 0, 0, 0);

  const startOfLastMonth = new Date(currentDate);
  startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1);
  startOfLastMonth.setHours(0, 0, 0, 0);
  startOfLastMonth.setDate(1);

  const startOfThisYear = new Date(currentDate);
  startOfThisYear.setMonth(0);
  startOfThisYear.setDate(1);
  startOfThisYear.setHours(0, 0, 0, 0);

  const todayAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.startTime);
    appointmentDate.setHours(0, 0, 0, 0);
    return appointmentDate.getTime() === startOfToday.getTime();
  });

  const lastMonthAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.startTime);
    return (
      appointmentDate.getMonth() === startOfLastMonth.getMonth() &&
      appointmentDate.getFullYear() === startOfLastMonth.getFullYear()
    );
  });

  const thisYearAppointments = appointments.filter(appointment => {
    const appointmentDate = new Date(appointment.startTime);
    return appointmentDate.getFullYear() === startOfThisYear.getFullYear();
  });

  const filteredAppointments = appointments.filter(appointment => {
    if (role === 'ADMIN') {
      // Admin sees all appointments
      switch (tabValue) {
        case 1:
          return appointment.status === 'Approved';
        case 2:
          return appointment.status.toLowerCase() === 'emergency';
        default:
          return true; // Show all appointments for All tab
      }
    } else if (role === 'DOCTOR' && doctorId) {
      // Doctor sees only their own appointments
      switch (tabValue) {
        case 1:
          return appointment.status === 'Approved' && appointment.doctorId === Number(doctorId);
        case 2:
          return appointment.status.toLowerCase() === 'emergency' && appointment.doctorId === Number(doctorId);
        default:
          return appointment.doctorId === Number(doctorId); // Show only doctor's appointments for All tab
      }
    }
    return false;
  });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleCreateAppointment = () => {
    const currentClinicId = appointments.length > 0 ? appointments[0].clinicId : 0;
    const currentBranchId = appointments.length > 0 ? appointments[0].branchId : 0;

    navigate('/dashboard/create-appointment', {
      state: { clinicId: currentClinicId, branchId: currentBranchId },
    });
  };

  const handleApprove = async (appointmentId: number) => {
    try {
      await axios.put(
        `http://localhost:8080/api/v1/appointments/status/${appointmentId}`,
        { status: 'Approved' },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
 
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === appointmentId ? { ...appt, status: 'Approved' } : appt
        )
      );
    } catch (error) {
  
    } finally {
      handleCloseDialog();
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box padding={3}>
      <motion.div
        initial={{ x: '100vw' }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 120 }}
      >
        <Typography variant="h4" gutterBottom align="center">
          Appointments
        </Typography>
      </motion.div>

      <Grid container spacing={2} marginBottom={3}>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" align="center">Today's Appointments</Typography>
              <Typography variant="h4" align="center">{todayAppointments.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" align="center">Last Month's Appointments</Typography>
              <Typography variant="h4" align="center">{lastMonthAppointments.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" align="center">This Year's Appointments</Typography>
              <Typography variant="h4" align="center">{thisYearAppointments.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" marginBottom={2}>
            {role === 'ADMIN' && (
              <Button variant="contained" color="primary" onClick={handleOpenDialog}>
                + New Appointment
              </Button>
            )}
    <Tabs value={tabValue} onChange={handleTabChange} textColor="primary">
  <Tab 
    label="All" 
    sx={{
      '&:hover': {
        backgroundColor: '#f0f0f0', // Light background color on hover
      }
    }}
  />
  <Tab 
    label="Approved" 
    sx={{
      '&:hover': {
        backgroundColor: '#f0f0f0', // Light background color on hover
      }
    }}
  />
  <Tab 
    label="Emergency" 
    sx={{
      '&:hover': {
        backgroundColor: '#f0f0f0', // Light background color on hover
      }
    }}
  />
</Tabs>

          </Box>

          <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
            <DialogTitle>Search Tokens</DialogTitle>
            <DialogContent>
              <Box display="flex" justifyContent="space-between" marginBottom={2}>
                <TextField
                  label="Search by Token"
                  variant="outlined"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  fullWidth
                />
              </Box>
              {filteredTokens.length > 0 && (
                <List>
                  {filteredTokens.map((patient) => (
                    <ListItem button key={patient.id} onClick={() => handleTokenSelect(patient)}>
                      <ListItemText primary={`${patient.name} (${patient.patientToken})`} />
                    </ListItem>
                  ))}
                </List>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>

          <TableContainer component={Paper} style={{ marginTop: '10px', maxHeight: '450px' }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>
                    Patient Name
                  </TableCell>
                  <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>
                    Date of Visit
                  </TableCell>
                  <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>
                    Reporting Time
                  </TableCell>
                  <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>
                    End Time
                  </TableCell>
                  <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>
                    Status
                  </TableCell>
                  <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>
                    Description
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredAppointments.map((appointment) => {
                  const appointmentDate = new Date(appointment.startTime);
                  const startTime = new Date(appointment.startTime);
                  const endTime = new Date(appointment.endTime);

                  return (
                    <TableRow key={appointment.id}>
                      <TableCell>{appointment.patientname}</TableCell>
                      <TableCell>{appointmentDate.toLocaleDateString()}</TableCell>
                      <TableCell>{startTime.toLocaleTimeString()}</TableCell>
                      <TableCell>{endTime.toLocaleTimeString()}</TableCell>
                      <TableCell>
  {role === 'DOCTOR' && appointment.status !== 'Approved' ? (
    appointment.status === 'regular check up' || appointment.status.toLowerCase() === 'emergency' ? (
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleApprove(appointment.id)}
      >
        {appointment.status}
      </Button>
    ) : (
      appointment.status
    )
  ) : (
    appointment.status
  )}
</TableCell>


                      <TableCell>{appointment.descriptions || 'N/A'}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Appointments;
