import React, { useEffect, useState,lazy, Suspense } from 'react';
import axios from 'axios';
import { IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit'; 
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import {
  Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Typography, Table,
  TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert,
  Card, CardContent, Box, Tab, Tabs, Grid, List, ListItem, ListItemText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useToken } from '../../api/Token';
import { motion } from 'framer-motion';
const NewTabContent = lazy(() => import('./NewTabContent'));

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
  completed: boolean;
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
  const [completedConsultations, setCompletedConsultations] = useState<string[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [open, setOpen] = useState(false);
  const [dateOfVisit, setDateOfVisit] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const [rescheduleAppointmentDetails, setRescheduleAppointmentDetails] = useState<any>(null); // For holding appointment data

  const userRole = localStorage.getItem('roleName');
  const navigate = useNavigate();
  const AnimatedPaper = motion(Paper);

  const role = localStorage.getItem('roleName');
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
  const handleClickRow = (appointment: Appointment) => {
    if (role === 'ADMIN' && (appointment.status === 'Regular Checkup' || appointment.status === 'Emergency')) {
      setSelectedAppointment(appointment);
      setDateOfVisit(appointment.dateOfVisit);
      setStartTime(appointment.startTime);
      setEndTime(appointment.endTime);
      setOpen(true);
    }
  };
  const handleUpdateAppointment = () => {
    if (selectedAppointment) {
      const updatedAppointment = {
        ...selectedAppointment,
        dateOfVisit,
        startTime,
        endTime
      };
      axios.put(`http://localhost:8080/api/v1/appointments/updateappointment/${selectedAppointment.id}`, updatedAppointment)
        .then(() => {
          // Update local state after successful API update
          setAppointments(prev =>
            prev.map(app => (app.id === selectedAppointment.id ? updatedAppointment : app))
          );
          setOpen(false);
        })
        .catch((error) => console.error(error));
    }
  };

  const handleReschedule = (id:number,patientId: number, doctorId: number) => {
    navigate(`/dashboard/create-appointment`, { state: { id,patientId, doctorId } });
  };
  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value.trim(); // Ensure no leading/trailing spaces
    setSearchTerm(searchValue);
  
    // Filter patients based on token or mobile number
    if (searchValue.length > 0) {
      const filtered = patients.filter(
        (patient) =>
          patient.patientToken.toLowerCase().startsWith(searchValue.toLowerCase()) ||
          patient.phoneNumber.toString().startsWith(searchValue)
      );
      setFilteredTokens(filtered);
    } else {
      setFilteredTokens([]); // Reset the filtered list if search is empty
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

  const filteredAppointments = appointments.filter((appointment) => {
    if (role === 'ADMIN') {
      switch (tabValue) {
        case 0: // Today Tab
          const appointmentDate = new Date(appointment.startTime);
          const today = new Date();
          return (
            appointmentDate.getDate() === today.getDate() &&
            appointmentDate.getMonth() === today.getMonth() &&
            appointmentDate.getFullYear() === today.getFullYear()
          );
       
        case 1: // Follow-Up
          return appointment.status.toLowerCase() === 'follow-up';
        case 2: // Emergency
          return appointment.status.toLowerCase() === 'emergency';
        default: // All Tab
          return true;
      }
    }
    // Other roles can have similar logic based on requirements
   
   else if (role === 'DOCTOR' && doctorId) {
      // Doctor sees only their own appointments
      switch (tabValue) {
        case 0: // Today Tab
          const appointmentDate = new Date(appointment.startTime);
          const today = new Date();
          return (
            appointmentDate.getDate() === today.getDate() &&
            appointmentDate.getMonth() === today.getMonth() &&
            appointmentDate.getFullYear() === today.getFullYear()
          );
       
        case 1: // Follow-Up
          return appointment.status.toLowerCase() === 'follow-up';
        case 2: // Emergency
          return appointment.status.toLowerCase() === 'emergency';
        default: // All Tab
          return true;
      }
    } else if (role === 'FRONT_DESK') {
      // Front Desk sees appointments for their clinic
     // Admin sees all appointments
     switch (tabValue) {
   
        case 0: // Today Tab
          const appointmentDate = new Date(appointment.startTime);
          const today = new Date();
          return (
            appointmentDate.getDate() === today.getDate() &&
            appointmentDate.getMonth() === today.getMonth() &&
            appointmentDate.getFullYear() === today.getFullYear()
          );
       
        case 1: // Follow-Up
          return appointment.status.toLowerCase() === 'follow-up';
        case 2: // Emergency
          return appointment.status.toLowerCase() === 'emergency';
        default: // All Tab
          return true;
      }
    } else if (role === 'MANAGER') {
      // Manager sees all appointments for branches under their management
    // Admin sees all appointments
    switch (tabValue) {
      case 0: // Today Tab
        const appointmentDate = new Date(appointment.startTime);
        const today = new Date();
        return (
          appointmentDate.getDate() === today.getDate() &&
          appointmentDate.getMonth() === today.getMonth() &&
          appointmentDate.getFullYear() === today.getFullYear()
        );
     
      case 1: // Follow-Up
        return appointment.status.toLowerCase() === 'follow-up';
      case 2: // Emergency
        return appointment.status.toLowerCase() === 'emergency';
      default: // All Tab
        return true;
    }
    }
    return false;
  });
  
  

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  const handleConsultationClick = (appointment: Appointment) => {
    // Save the appointment details to local storage
    localStorage.setItem('appointmentId', appointment.id.toString());  // Storing the appointment ID
    localStorage.setItem('patientId', appointment.patientId.toString());  // Storing the patient ID
    localStorage.setItem('doctorId', appointment.doctorId.toString());  // Storing the doctor ID
    localStorage.setItem('medicalHistory', appointment.descriptions || '');  // Store medical history if available
  
    // Mark the consultation as completed for the given appointment ID (if needed)
    setCompletedConsultations((prev) => [...prev, appointment.id.toString()]);  // Ensure the ID is a string
  
    // Navigate to the /dashboard/record page
    navigate('/dashboard/record');
  };
  
  // const handleConsultationClick = (patient: any) => {
  //   // Save the selected patient's data to local storage
  //   localStorage.setItem('patientId', patient.id);
  //   localStorage.setItem('doctorId', patient.doctorId);
  //   localStorage.setItem('medicalHistory', patient.medicalHistory);
    

  //   // Mark the consultation as completed for the given patient ID
  //   setCompletedConsultations((prev) => [...prev, patient.id]);

  //   // Navigate to the /dashboard/record page
  //   navigate('/dashboard/record');
  // };

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
      console.error('Failed to approve appointment');
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
        position: 'relative', // Make the icon positioning easier
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

      {/* Round Icon Button */}
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
          padding: 1.5, // Adjust to control size
        }}
      >
        <InfoIcon />
      </IconButton>
    </AnimatedPaper>
  </Grid>

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
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" marginBottom={2}>
            {(role === 'ADMIN' || role === 'FRONT_DESK') && (
              <Button variant="contained" color="primary" onClick={handleOpenDialog}>
                + New Appointment
              </Button>
            )}</Box>
 

  <Box padding={3}>
  <Tabs value={tabValue} onChange={handleTabChange} textColor="primary">
    <Tab label="Today" />
    <Tab label="Follow-Up" />
    <Tab label="Emergency" />
    <Tab label="All" />
  </Tabs>

  {/* Render content dynamically based on the active tab */}
  <Box marginTop={2}>
    <Box>
      {/* Render content for the remaining tabs */}
      {tabValue === 0 && (
        <Typography>Today's Appointments Content</Typography>
      )}
      {tabValue === 1 && (
        <Typography>Follow-Up Appointments Content</Typography> 
      )}
      {tabValue === 2 && (
        <Typography>Emergency Appointments Content</Typography>
      )}
      {tabValue === 3 && <Typography>All Appointments Content</Typography>}
    </Box>
  </Box>
</Box>



          <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
            <DialogTitle>Patient ID/Mobile Number</DialogTitle>
            <DialogContent>
              <Box display="flex" justifyContent="space-between" marginBottom={2}>
                <TextField
                  label="Search by Token / Mobile No"
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
            <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Patient Name</TableCell>
            <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Date of Visit</TableCell>
            <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Reporting Time</TableCell>
            <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>End Time</TableCell>
            <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Appointment Type</TableCell>
            <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Description</TableCell>
            <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Doctor Id</TableCell>
            <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Reschedule</TableCell>
          
            {userRole === 'DOCTOR' && (
              <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Consultation</TableCell>
            )}
             {userRole === 'ADMIN' && (
              <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>case sheet</TableCell>)}
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredAppointments.map((appointment) => {
            const appointmentDate = new Date(appointment.startTime);
            const startTime = new Date(appointment.startTime);
            const endTime = new Date(appointment.endTime);

            return (
              <TableRow
                key={appointment.id}
                onClick={() => handleClickRow(appointment)}
                style={{
                  cursor:
                    userRole === 'ADMIN' ||
                    (userRole === 'FRONT_DESK' &&
                      (appointment.status === 'Regular Checkup' || appointment.status === 'Emergency'))
                      ? 'pointer'
                      : 'default',
                }}
              >
                <TableCell>{appointment.patientname}</TableCell>
                <TableCell>{appointmentDate.toLocaleDateString()}</TableCell>
                <TableCell>{startTime.toLocaleTimeString()}</TableCell>
                <TableCell>{endTime.toLocaleTimeString()}</TableCell>
                <TableCell>{appointment.status}</TableCell>
                <TableCell>{appointment.descriptions || 'N/A'}</TableCell>
                <TableCell>{appointment.doctorId || 'N/A'}</TableCell>
                <TableCell>
                  <IconButton
                    color="primary"
                    onClick={() => handleReschedule(appointment.id,appointment.patientId, appointment.doctorId)}
                  >
                    <EditIcon />
                  </IconButton>
                </TableCell>
                {userRole === 'DOCTOR' && (
                  <TableCell>
                    {appointment.completed ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CheckCircleIcon color="success" />
                        <span>Complete</span>
                      </div>
                    ) : (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleConsultationClick(appointment)}
                      >
                        Start Consultation
                      </Button>
                    )}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>

          <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Edit Appointment</DialogTitle>
        <DialogContent>
          <TextField
            label="Date of Visit"
            value={dateOfVisit}
            onChange={(e) => setDateOfVisit(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Start Time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="End Time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdateAppointment} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Appointments;
