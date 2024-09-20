import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from '@mui/material';
import { styled } from '@mui/system';
import { useToken } from '../../api/Token';
import patientEye from '../../assets/patientEye.jpeg';

// Styled components
const AnimatedBox = styled(Box)`
  animation: slideIn 0.5s ease-out;
  @keyframes slideIn {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }
`;

const StyledCard = styled(Card)`
  background-color: #ffffff;
  border-radius: 20px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
  }
`;

const TopStyledCard = styled(StyledCard)`
  height: auto;
  padding: 2rem;
`;

const BottomStyledCard = styled(StyledCard)`
  height: auto;
  padding: 2rem;
`;

const StyledTableCell = styled(TableCell)`
  font-weight: bold;
  color: #1976d2;
  border-bottom: 2px solid #e2e8f0;
`;

const PatientNameTypography = styled(Typography)`
  color: #1a202c;
  font-weight: bold;
  font-size: 2rem;
`;

const PatientInfoTypography = styled(Typography)`
  color: #4a5568;
  font-size: 1.25rem;
`;

const ActionButton = styled(Button)`
  background-color: #1e88e5;
  color: white;
  font-weight: bold;
  text-transform: none;
  border-radius: 12px;

  &:hover {
    background-color: #1565c0;
  }
`;

interface Patient {
  id: number;
  name: string;
  age: number;
  medicalHistory: string;
  bloodGroup: string;
  phoneNumber: string;
  createdDate: string;
  clinicId: number;
  branchId: number;
  patientToken: string;
}

interface MedicalRecord {
  id: number;
  doctorFirstName: string;
  visitDate: string;
  treatment: string;
  vitalSigns: string;
  clinicName: string;
  branchName: string;
  diagnosis: string;
  amount: number;
  patientId: number;
  doctorId: number;
  clinicId: number;
  branchId: number;
  medications: Medication[];
}

interface Medication {
  id: number;
  medicationName: string;
  dosage: string;
  medicationPrice: number;
  quantity: number;
  instructions: string | null;
  clinicId: number;
  branchId: number;
}

const PatientDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { accessToken } = useToken();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query
  const [patientImage, setPatientImage] = useState<string | null>(null); // New state for patient image

  useEffect(() => {
    if (accessToken && id) {
      axios
        .get(`http://localhost:8080/api/v1/patients/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          setPatient(response.data);
        })
        .catch((error) => {
          console.error('Error fetching patient details:', error);
        });

      axios
        .get(`http://localhost:8080/api/v1/medical-records/patient/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          setMedicalRecords(response.data);
        })
        .catch((error) => {
          console.error('Error fetching medical records:', error);
        });

      axios
        .get(`http://localhost:8080/api/v1/patients/${id}/image`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          responseType: 'blob', // Set response type to blob to handle image data
        })
        .then((response) => {
          const imageUrl = URL.createObjectURL(response.data);
          setPatientImage(imageUrl);
        })
        .catch((error) => {
          console.error('Error fetching patient image:', error);
        });
    }
  }, [accessToken, id]);

  const handleFetchMedicalRecordDetails = async (recordId: number) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/medical-records/${recordId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setSelectedRecord(response.data);
    } catch (error) {
      console.error('Error fetching medical record details:', error);
    }
  };

  const handleCreateAppointment = (record: MedicalRecord) => {
    navigate('/dashboard/create-appointment', {
      state: {
        patientId: record.patientId,
        doctorId: record.doctorId,
        clinicId: record.clinicId,
        branchId: record.branchId,
        patientName: patient?.name, // Use the patient's name here
        doctorName: record.doctorFirstName,
        treatment: record.treatment,
      },
    });
  };

  if (!patient) {
    return <Typography>Loading...</Typography>;
  }

  // Filter medical records based on search query
  const filteredMedicalRecords = medicalRecords.filter((record) =>
    record.doctorFirstName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sort filtered medical records by visitDate in descending order
  const sortedMedicalRecords = [...filteredMedicalRecords].sort(
    (a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime()
  );

  return (
    <AnimatedBox sx={{ padding: 1, backgroundColor: '#f0f4f8', minHeight: '100vh' }}>
      <Grid container justifyContent="space-between" alignItems="center">
      <Button
  variant="text"
  color="primary"
  onClick={() => navigate(-1)}

  startIcon={<ArrowBackIcon />}
>
  Back
</Button>
        <Typography variant="h4" gutterBottom align="left" marginLeft={5} marginTop={2} sx={{ color: '#1a202c', fontWeight: 'bold' }}>
          Patient Information Overview
        </Typography>
  
        <TextField
          label="Search Doctor..."
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ marginRight: 5, marginTop: 9 }}
        />
      </Grid>

      <Grid container spacing={4} sx={{ marginTop: 4 }}>
        <Grid item xs={12} md={6}>
          <TopStyledCard>
            <CardContent>
              <Grid container alignItems="center" spacing={3}>
                <Grid item>
                  <Avatar src={patientImage || patientEye} sx={{ width: 120, height: 120, marginRight: 3 }} />
                </Grid>
                <Grid item>
                  <PatientNameTypography>{patient.name}</PatientNameTypography>
                  <PatientInfoTypography>Age: {patient.age}</PatientInfoTypography>
                  <PatientInfoTypography>Patient Token: {patient.patientToken}</PatientInfoTypography>
                  <PatientInfoTypography>Blood Group: {patient.bloodGroup}</PatientInfoTypography>
                  <PatientInfoTypography>Phone Number: {patient.phoneNumber}</PatientInfoTypography>
                </Grid>
              </Grid>
            </CardContent>
          </TopStyledCard>
        </Grid>


        <Grid item xs={12} md={6}>
            <TableContainer component={Paper} style={{ maxHeight: '300px', borderRadius: '15px' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Doctor Name</StyledTableCell>
                    <StyledTableCell>Visit Date</StyledTableCell>
                    <StyledTableCell>Appointment</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedMedicalRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <ActionButton
                          variant="contained"
                          onClick={() => handleFetchMedicalRecordDetails(record.id)}
                        >
                          {record.doctorFirstName}
                        </ActionButton>
                      </TableCell>
                      <TableCell>
                        {new Date(record.visitDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <ActionButton
                          variant="contained"
                          onClick={() => handleCreateAppointment(record)}
                        >
                          New Appointment
                        </ActionButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>

      <Grid container spacing={2} sx={{ marginTop: 1 }}>
        {/* Bottom Grid - Medication Details */}
        <Grid item xs={12} sm={5}>
          <BottomStyledCard>
            <CardContent>
              <Typography variant="h6">Medications</Typography>
              {selectedRecord ? (
                <TableContainer component={Paper} style={{ maxHeight: '300px', borderRadius: '20px' }}>
                  <Table stickyHeader>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Medication Name</StyledTableCell>
                        <StyledTableCell>Dosage</StyledTableCell>
                        <StyledTableCell>Instructions</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedRecord.medications.map((medication) => (
                        <TableRow key={medication.id}>
                          <TableCell>{medication.medicationName}</TableCell>
                          <TableCell>{medication.dosage}</TableCell>
                          <TableCell>{medication.instructions}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography>No record selected</Typography>
              )}
            </CardContent>
          </BottomStyledCard>
        </Grid>

        {/* Bottom Grid - Diagnosis and Treatments */}
        <Grid item xs={12} sm={3}>
  <BottomStyledCard>
    <CardContent>
      <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold' ,textAlign:'center'}}> Clinic Name:</Typography>
      <Typography sx={{ marginBottom: 2, color: 'black',textAlign:'center'}}>{selectedRecord?.clinicName || 'N/A'}</Typography>
      <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold',textAlign:'center'}}>Branch Name:</Typography>
      <Typography sx={{ marginBottom: 2, color: '#black',textAlign:'center'}}>{selectedRecord?.branchName || 'N/A'}</Typography>
      <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold' ,textAlign:'center'}}>Amount :</Typography>
      <Typography sx={{ color: 'black',textAlign:'center' }}>{selectedRecord?.amount || 'N/A'}</Typography>
    </CardContent>
  </BottomStyledCard>
</Grid>
<Grid item xs={12} sm={4}>
  <BottomStyledCard>
    <CardContent>
      <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold' ,textAlign:'center'}}>Vital Signs:</Typography>
      <Typography sx={{ marginBottom: 2, color: 'black',textAlign:'center'}}>{selectedRecord?.vitalSigns || 'N/A'}</Typography>
      <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold',textAlign:'center'}}>Treatment:</Typography>
      <Typography sx={{ marginBottom: 2, color: '#black',textAlign:'center'}}>{selectedRecord?.treatment || 'N/A'}</Typography>
      <Typography variant="h6" sx={{ color: '#1976d2', fontWeight: 'bold' ,textAlign:'center'}}>Diagnosis:</Typography>
      <Typography sx={{ color: 'black',textAlign:'center' }}>{selectedRecord?.diagnosis || 'N/A'}</Typography>
    </CardContent>
  </BottomStyledCard>
</Grid>
      </Grid>
    </AnimatedBox>
  );
};

export default PatientDetails;
