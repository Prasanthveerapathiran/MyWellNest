import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton, Menu, MenuItem, CircularProgress, Snackbar, Alert } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { useToken } from '../../../api/Token';

interface Appointment {
  id: number;
  doctorId: number;
  patientId: number;
  patientname: string;
  dateOfVisit: string;
  status: string;
  descriptions: string | null;
  shareWithPatient: string;
  clinicId: number;
  branchId: number;
}

const DoctorAppointment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { accessToken } = useToken();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/appointments/doctor/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.status === 200) {
          setAppointments(response.data);
          setSnackbarMessage('Appointments fetched successfully.');
          setSnackbarSeverity('success');
        } else {
          setError('Error fetching appointments.');
          setSnackbarMessage('Error fetching appointments.');
          setSnackbarSeverity('error');
        }
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError('No appointments received yet.');
        setSnackbarMessage('Error fetching appointments.');
        setSnackbarSeverity('error');
      } finally {
        setLoading(false);
        setSnackbarOpen(true);
      }
    };

    fetchAppointments();
  }, [id, accessToken]);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, appointmentId: number) => {
    setAnchorEl(event.currentTarget);
    setSelectedAppointmentId(appointmentId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedAppointmentId(null);
  };

  const handleViewClick = () => {
    if (selectedAppointmentId !== null) {
      navigate(`/updateappointment/${selectedAppointmentId}`);
    }
    handleMenuClose();
  };

  const handleDeleteClick = async () => {
    if (selectedAppointmentId !== null) {
      try {
        await axios.delete(`http://localhost:8080/api/v1/appointments/${selectedAppointmentId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setAppointments((prevAppointments) => prevAppointments.filter((appointment) => appointment.id !== selectedAppointmentId));
        setSnackbarMessage('Appointment deleted successfully.');
        setSnackbarSeverity('success');
      } catch (error) {
        console.error('Error deleting appointment:', error);
        setSnackbarMessage('Error deleting appointment.');
        setSnackbarSeverity('error');
      } finally {
        setSnackbarOpen(true);
      }
    }
    handleMenuClose();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <div>
      <Typography variant="h5">Appointments</Typography>
      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Typography color="error" mt={2}>
          {error}
        </Typography>
      ) : (
        <TableContainer component={Paper}  style={{ marginTop: '10px', maxHeight: '420px' }}>
         <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>ID</TableCell>
                <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Patient Name</TableCell>
                <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Date of Visit</TableCell>
                <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Status</TableCell>
                <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Descriptions</TableCell>
                {/* <TableCell>Share With Patient</TableCell> */}
                {/* <TableCell>Clinic ID</TableCell>
                <TableCell>Branch ID</TableCell> */}
                <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell >{appointment.id}</TableCell>
                  <TableCell>{appointment.patientname}</TableCell>
                  <TableCell>{new Date(appointment.dateOfVisit).toLocaleString()}</TableCell>
                  <TableCell>{appointment.status}</TableCell>
                  <TableCell>{appointment.descriptions}</TableCell>
                  {/* <TableCell>{appointment.shareWithPatient}</TableCell>
                  <TableCell>{appointment.clinicId}</TableCell>
                  <TableCell>{appointment.branchId}</TableCell> */}
                  <TableCell>
                    <IconButton onClick={(event) => handleMenuClick(event, appointment.id)}>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl) && selectedAppointmentId === appointment.id}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={handleViewClick}>View</MenuItem>
                      <MenuItem onClick={handleDeleteClick}>Delete</MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
      {/* <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar> */}
    </div>
  );
};

export default DoctorAppointment;
