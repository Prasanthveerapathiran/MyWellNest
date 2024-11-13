import React, { useEffect, useState } from 'react';
import {
  Container, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Button, Modal, Box, TextField, Select, MenuItem, InputLabel, FormControl,
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import dayjs from 'dayjs';
import { useToken } from '../../api/Token';

interface Patient {
  id: number;
  name: string;
  patientToken: string;
  phoneNumber: number;
  appointmentDate: string;
  doctorId: number;
}

interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
}

const RootContainer = styled(Container)({
  maxWidth: '100%',
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f4f6f8',
});

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  borderRadius: '12px',
  boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.15)',
  transition: 'transform 0.3s, box-shadow 0.3s',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: '0px 12px 40px rgba(0, 0, 0, 0.2)',
  },
}));

const ModalBox = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: '#fff',
  borderRadius: 8,
  boxShadow: 24,
  padding: 4,
});

const Frontdesk: React.FC = () => {
  const [todayAppointments, setTodayAppointments] = useState<Patient[]>([]);
  const [futureAppointments, setFutureAppointments] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newAppointmentDate, setNewAppointmentDate] = useState('');
  const [selectedDoctorId, setSelectedDoctorId] = useState<number | null>(null);
  const navigate = useNavigate();
  const { accessToken } = useToken();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleRowClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setModalOpen(true);
    setNewAppointmentDate(patient.appointmentDate);
    setSelectedDoctorId(patient.doctorId);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedPatient(null);
  };

  const handleAppointmentUpdate = async () => {
    if (!selectedPatient || !selectedDoctorId) return;

    try {
      await axios.put(
        `http://localhost:8080/api/v1/patients/${selectedPatient.id}`,
        {
          appointmentDate: newAppointmentDate,
          doctorId: selectedDoctorId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      handleModalClose();
      fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const fetchAppointments = async () => {
    if (!accessToken) return;

    try {
      const response = await axios.get('http://localhost:8080/api/v1/patients', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const today = dayjs().startOf('day');

      const todayAppointmentsList = response.data.filter((patient: Patient) =>
        dayjs(patient.appointmentDate).isSame(today, 'day')
      );

      const futureAppointmentsList = response.data.filter((patient: Patient) =>
        dayjs(patient.appointmentDate).isAfter(today, 'day')
      );

      setTodayAppointments(todayAppointmentsList);
      setFutureAppointments(futureAppointmentsList);

      const doctorsResponse = await axios.get('http://localhost:8080/api/v1/users/role/DOCTOR', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setDoctors(doctorsResponse.data.map((doc: any) => ({
        id: doc.id,
        firstName: doc.firstName,
        lastName: doc.lastName,
      })));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [accessToken]);

  const getDoctorNameById = (doctorId: number) => {
    const doctor = doctors.find((doc) => doc.id === doctorId);
    return doctor ? `${doctor.firstName} ${doctor.lastName}` : 'Unknown';
  };

  return (
    <RootContainer>
      <Typography variant="h4" gutterBottom color="primary">
        Welcome to the Front Desk
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              Book an Appointment
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleNavigation('/dashboard/appointments')}
              sx={{ marginTop: 2 }}
            >
              Go to Appointments
            </Button>
          </StyledPaper>
        </Grid>

        <Grid item xs={12} md={4}>
          <StyledPaper>
            <Typography variant="h6" gutterBottom>
              New Patient? Add Here
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleNavigation('/patient-form')}
              sx={{ marginTop: 2 }}
            >
              Go to Patients
            </Button>
          </StyledPaper>
        </Grid>
      </Grid>

      <Grid container spacing={4} justifyContent="center" sx={{ marginTop: 4 }}>
        <Grid item xs={12} md={5}>
          <StyledPaper>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Today's Appointments
            </Typography>
            <TableContainer component={Paper} sx={{ marginTop: 2, boxShadow: 'none' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Doctor</TableCell>
                    <TableCell>Phone</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {todayAppointments.map((appointment) => (
                    <TableRow key={appointment.id} onClick={() => handleRowClick(appointment)} hover>
                      <TableCell>{appointment.name}</TableCell>
                      <TableCell>{getDoctorNameById(appointment.doctorId)}</TableCell>
                      <TableCell>{appointment.phoneNumber}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </StyledPaper>
        </Grid>

        <Grid item xs={12} md={5}>
          <StyledPaper>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              Future Appointments
            </Typography>
            <TableContainer component={Paper} sx={{ marginTop: 2, boxShadow: 'none' }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Doctor</TableCell>
                    <TableCell>Phone</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {futureAppointments.map((appointment) => (
                    <TableRow key={appointment.id} onClick={() => handleRowClick(appointment)} hover>
                      <TableCell>{appointment.name}</TableCell>
                      <TableCell>{getDoctorNameById(appointment.doctorId)}</TableCell>
                      <TableCell>{appointment.phoneNumber}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </StyledPaper>
        </Grid>
      </Grid>

      <Modal open={modalOpen} onClose={handleModalClose}>
        <ModalBox>
          <Typography variant="h6" gutterBottom>Update Appointment</Typography>
          <TextField
            label="Appointment Date"
            type="datetime-local"
            fullWidth
            value={newAppointmentDate}
            onChange={(e) => setNewAppointmentDate(e.target.value)}
            sx={{ marginBottom: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <FormControl fullWidth sx={{ marginBottom: 2 }}>
            <InputLabel>Doctor</InputLabel>
            <Select
              value={selectedDoctorId || ''}
              onChange={(e) => setSelectedDoctorId(Number(e.target.value))}
            >
              {doctors.map((doctor) => (
                <MenuItem key={doctor.id} value={doctor.id}>
                  {doctor.firstName} {doctor.lastName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="contained" color="primary" onClick={handleAppointmentUpdate}>
            Update
          </Button>
        </ModalBox>
      </Modal>
    </RootContainer>
  );
};

export default Frontdesk;
