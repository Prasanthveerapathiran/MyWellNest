import React from 'react';
import classes from './doctorPre.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Typography,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Button
} from '@mui/material';
import { useToken } from '../../api/Token';
import { motion } from 'framer-motion'; // Import Framer Motion
interface Medication {
  id: number;
  medicationName: string;
  dosage: string;
  medicationPrice: number;
  quantity: number;
  instructions: string | null;
  clinicId: number | null;
  branchId: number;
}

interface MedicalRecord {
  doctorId: number;
  patientId: number;
  doctorFirstName: string;
  patientName: string;
  complains: string;
  diagnosis: string;
  visitDate: string;
  vitalSigns: string;
  amount: number;
  treatment: string;
  clinicId: number;
  branchId: number;
  medications: Medication[];
}
// ... (interfaces and other code)

const DoctorPrescription: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const { accessToken } = useToken();
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<MedicalRecord[]>(`http://localhost:8080/api/v1/medical-records/patient/${patientId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log(response.data);
        setMedicalRecords(response.data);
      } catch (err) {
        setError('Error loading patient data.');
      } finally {
        setLoading(false);
        setSnackbarOpen(true);
      }
    };

    fetchData();
  }, [patientId, accessToken]);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  }

  if (error) {
    return (
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    );
  }

  if (!medicalRecords.length) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>No patient data available.</Box>;
  }

  const record = medicalRecords[0];

  return (
    <div className={classes.back}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
     <Button
  variant="text"
  color="primary"
  onClick={() => navigate(-1)}
  sx={{ top: 16, left: 16, color: 'white' }}
  startIcon={<ArrowBackIcon style={{ color: 'white' }} />}
>
  Back
</Button>

        <Typography className={classes.dn} variant='h5'>
          <strong className={classes.head}>Dr:</strong>
          <span className={classes.space}>{record.doctorFirstName}</span>
        </Typography>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
      >
          
        <Box className={classes.body}>
          <div className={classes.spaceh}>
          <Typography 
  variant="h5" 
  className={classes.pn} 
  sx={{
    fontFamily: 'Poppins, sans-serif',
    color: '#2c3e50',
    fontWeight: 'bold',
    marginBottom: '8px'
  }}
>
  <strong className={classes.s1}>Patient Name:</strong>
  <span className={classes.space1}>{record.patientName}</span>
</Typography>

<Typography 
  variant="h6" 
  gutterBottom 
  sx={{
    fontFamily: 'Roboto, sans-serif',
    color: '#34495e',
    fontWeight: '500',
    marginBottom: '8px'
  }}
>
  <strong className={classes.s1}>Complains:</strong>
  <span className={classes.space1}>{record.complains}</span>
</Typography>

<Typography 
  variant="h6" 
  gutterBottom 
  sx={{
    fontFamily: 'Roboto, sans-serif',
    color: '#34495e',
    fontWeight: '500',
    marginBottom: '8px'
  }}
>
  <strong className={classes.s1}>Diagnosis:</strong>
  <span className={classes.space1}>{record.diagnosis}</span>
</Typography>

<Typography 
  variant="h6" 
  gutterBottom 
  sx={{
    fontFamily: 'Roboto, sans-serif',
    color: '#34495e',
    fontWeight: '500',
    marginBottom: '8px'
  }}
>
  <strong className={classes.s1}>Visit Date:</strong>
  <span className={classes.space1}>{new Date(record.visitDate).toLocaleDateString()}</span>
</Typography>

<Typography 
  variant="h6" 
  gutterBottom 
  sx={{
    fontFamily: 'Roboto, sans-serif',
    color: '#34495e',
    fontWeight: '500',
    marginBottom: '8px'
  }}
>
  <strong className={classes.s1}>Vital Signs:</strong>
  <span className={classes.space1}>{record.vitalSigns}</span>
</Typography>

<Typography 
  variant="h6" 
  gutterBottom 
  sx={{
    fontFamily: 'Roboto, sans-serif',
    color: '#e74c3c',
    fontWeight: 'bold',
    marginBottom: '8px'
  }}
>
  <strong className={classes.s1}>Amount:</strong>
  <span className={classes.space1}>${record.amount}</span>
</Typography>

          </div>

          <div className={classes.side}>
            <Typography variant="h5" gutterBottom color="primary" align="center" sx={{ fontWeight: 'bold' }}>
              Medications
            </Typography>
            <Paper sx={{ padding: 2, backgroundColor: '#e0f7fa', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Medication Name</strong></TableCell>
                    <TableCell><strong>Dosage</strong></TableCell>
                    <TableCell><strong>Price</strong></TableCell>
                    <TableCell><strong>Quantity</strong></TableCell>
                    <TableCell><strong>Instructions</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {record.medications && record.medications.length > 0 ? (
                    record.medications.map((med) => (
                      <TableRow key={med.id}>
                        <TableCell>{med.medicationName}</TableCell>
                        <TableCell>{med.dosage}</TableCell>
                        <TableCell>${med.medicationPrice}</TableCell>
                        <TableCell>{med.quantity}</TableCell>
                        <TableCell>{med.instructions || 'N/A'}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        No medications available.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </Paper>
          </div>
        </Box>
      </motion.div>
    </div>
  );
};

export default DoctorPrescription;

