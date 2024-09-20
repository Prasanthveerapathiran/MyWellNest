import React, { useEffect, useState } from 'react';
import {
  Typography,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Menu,
  MenuItem
} from '@mui/material';
import axios from 'axios';
import { useToken } from '../../api/Token';
import { useParams, useNavigate } from 'react-router-dom';
import MoreVertIcon from '@mui/icons-material/MoreVert';

interface Patient {
  id: string; // This is the record ID
  patientId: string; // This is the patient ID
  patientName: string;
  visitDate: string;
  treatment: string;
  vitalSigns: string;
}

const OurPatients: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { accessToken } = useToken();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/medical-records/doctor/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.status === 200) {
          const patientsData = response.data.map((patient: any) => ({
            id: patient.id.toString(),
            patientId: patient.patientId.toString(),
            patientName: patient.patientName,
            visitDate: patient.visitDate,
            treatment: patient.treatment,
            vitalSigns: patient.vitalSigns,
          }));
          setPatients(patientsData);
          setSnackbarMessage('Patients fetched successfully.');
          setSnackbarSeverity('success');
        } else {
          setError('Error fetching patients.');
          setSnackbarMessage('Error fetching patients.');
          setSnackbarSeverity('error');
        }
      } catch (error) {
        console.error('Error fetching patients:', error);
        setError('No patients yet.');
        setSnackbarMessage('Error fetching patients.');
        setSnackbarSeverity('error');
      } finally {
        setLoading(false);
        setSnackbarOpen(true);
      }
    };

    if (id) {
      fetchPatients();
    }
  }, [id, accessToken]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, patientId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedPatientId(patientId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPatientId(null);
  };

  const handleViewClick = () => {
    handleMenuClose();
    if (selectedPatientId !== null) {
      navigate(`/doctor-prescription/${selectedPatientId}`);
    }
  };

  return (
    <Box>
      <Typography variant="h5">Our Patients</Typography>
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
                <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Patient ID</TableCell>
                <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Patient Name</TableCell>
                <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Visit Date</TableCell>
                <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Treatment</TableCell>
                <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Vital Signs</TableCell>
                <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.patientId}</TableCell>
                  <TableCell>{patient.patientName}</TableCell>
                  <TableCell>{new Date(patient.visitDate).toLocaleDateString()}</TableCell>
                  <TableCell>{patient.treatment}</TableCell>
                  <TableCell>{patient.vitalSigns}</TableCell>
                  <TableCell>
                    <IconButton onClick={(event) => handleMenuClick(event, patient.patientId)}>
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem onClick={handleViewClick}>View</MenuItem>
                      {/* Add other menu items here */}
                    </Menu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
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
  );
};

export default OurPatients;
