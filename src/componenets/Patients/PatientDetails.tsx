import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
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
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [editPatientDetails, setEditPatientDetails] = useState<Patient | null>(null);

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
            // Store branchId and clinicId in local storage
        localStorage.setItem('branchId', response.data.branchId.toString());
        localStorage.setItem('clinicId', response.data.clinicId.toString());
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
  const handleOpenUpdateDialog = () => {
    if (patient) {
      setEditPatientDetails({ ...patient });
    }
    setOpenUpdateDialog(true);
  };
  



  const handleCloseUpdateDialog = () => {
    setOpenUpdateDialog(false);
  };

  const handleUpdatePatient = async () => {
    try {
      if (editPatientDetails && accessToken) {
        await axios.put(`http://localhost:8080/api/v1/patients/${id}`, editPatientDetails, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setPatient(editPatientDetails); // Update patient details
        handleCloseUpdateDialog();
      }
    } catch (error) {
      console.error('Error updating patient details:', error);
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
    
        <Button
          variant="contained"
          color="primary"
          onClick={handleOpenUpdateDialog}
          startIcon={<EditIcon />}
          sx={{ marginRight: 5, marginTop: 2 }}
        >
          Edit
        </Button>
        {/* <TextField
          label="Search Doctor..."
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ marginRight: 5, marginTop: 9 }}
        /> */}
      </Grid>
        {/* Dialog for editing patient details */}
        <Dialog open={openUpdateDialog} onClose={handleCloseUpdateDialog}>
        <DialogTitle>Edit Patient Details</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            value={editPatientDetails?.name || ''}
            onChange={(e) => setEditPatientDetails({ ...editPatientDetails!, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Age"
            fullWidth
            value={editPatientDetails?.age || ''}
            onChange={(e) => setEditPatientDetails({ ...editPatientDetails!, age: parseInt(e.target.value) })}
          />
          <TextField
            margin="dense"
            label="Phone Number"
            fullWidth
            value={editPatientDetails?.phoneNumber || ''}
            onChange={(e) => setEditPatientDetails({ ...editPatientDetails!, phoneNumber: e.target.value })}
          />
          {/* Add more fields as necessary */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleUpdatePatient} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

     <Grid container spacing={4} sx={{ marginTop: 4 }}>
  {/* Left Card - Patient Information */}
  <Grid item xs={12} md={6}>
    <TopStyledCard sx={{ boxShadow: 3, borderRadius: 3 }}>
      <CardContent>
        <Grid container alignItems="center" spacing={3}>
          <Grid item>
            <Avatar
              src={patientImage || patientEye}
              sx={{
                width: 120,
                height: 120,
                marginRight: 3,
                border: '2px solid #3f51b5', // Add border for a subtle visual pop
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)' // Light shadow for depth
              }}
            />
          </Grid>
          <Grid item>
            <PatientNameTypography
              sx={{
                fontWeight: 'bold',
                fontSize: '1.5rem',
                color: '#333',
                marginBottom: 1
              }}
            >
              {patient.name}
            </PatientNameTypography>
            <PatientInfoTypography
              sx={{ fontSize: '1rem', color: '#757575', marginBottom: 0.5 }}
            >
              Age: {patient.age}
            </PatientInfoTypography>
            <PatientInfoTypography
              sx={{ fontSize: '1rem', color: '#757575', marginBottom: 0.5 }}
            >
              Patient Token: {patient.patientToken}
            </PatientInfoTypography>
            <PatientInfoTypography
              sx={{ fontSize: '1rem', color: '#757575', marginBottom: 0.5 }}
            >
              Blood Group: {patient.bloodGroup}
            </PatientInfoTypography>
            <PatientInfoTypography
              sx={{ fontSize: '1rem', color: '#757575', marginBottom: 0.5 }}
            >
              Phone Number: {patient.phoneNumber}
            </PatientInfoTypography>
          </Grid>
        </Grid>
      </CardContent>
    </TopStyledCard>
  </Grid>

  {/* Right Table - Medical Records */}
  <Grid item xs={12} md={6}>
    <TableContainer
      component={Paper}
      sx={{
        maxHeight: '300px',
        borderRadius: 2,
        boxShadow: 3, // Add shadow for depth
        backgroundColor: '#fafafa' // Light background color for contrast
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <StyledTableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
              Doctor Name
            </StyledTableCell>
            <StyledTableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
              Visit Date
            </StyledTableCell>
            <StyledTableCell sx={{ fontWeight: 'bold', fontSize: '1rem' }}>
              Appointment
            </StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedMedicalRecords.map((record) => (
            <TableRow
              key={record.id}
              sx={{
                '&:hover': {
                  backgroundColor: '#f5f5f5' // Highlight row on hover
                }
              }}
            >
              <TableCell>
                <ActionButton
                  variant="contained"
                  sx={{
                    backgroundColor: '#3f51b5',
                    color: '#fff',
                    boxShadow: 2,
                    ':hover': {
                      backgroundColor: '#2c387e' // Darken button on hover
                    }
                  }}
                  onClick={() => handleFetchMedicalRecordDetails(record.id)}
                >
                  {record.doctorFirstName}
                </ActionButton>
              </TableCell>
              <TableCell>{new Date(record.visitDate).toLocaleDateString()}</TableCell>
              <TableCell>
                <ActionButton
                  variant="contained"
                  sx={{
                    backgroundColor: '#4caf50',
                    color: '#fff',
                    boxShadow: 2,
                    ':hover': {
                      backgroundColor: '#388e3c' // Darken button on hover
                    }
                  }}
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

<Grid container spacing={3} sx={{ marginTop: 3 }}>
  <Grid item xs={12}>
    <BottomStyledCard
      sx={{
        background: 'linear-gradient(135deg, #f0f7ff, #e0f2ff)',
        borderRadius: '20px',
        boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.12)',
        padding: 3,
        transition: 'transform 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0px 12px 24px rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      <CardContent>
        <Typography
          variant="h5"
          sx={{
            fontWeight: 'bold',
            color: '#1976d2',
            textAlign: 'center',
            marginBottom: 3,
          }}
        >
          Patient Details
        </Typography>

        <Grid container spacing={3}>
          {/* Medications */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', marginBottom: 2 }}>
              Medications
            </Typography>
            {selectedRecord ? (
              <TableContainer
                component={Paper}
                sx={{
                  maxHeight: '300px',
                  borderRadius: '20px',
                  boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.1)',
                  transition: 'background-color 0.3s',
                  '&:hover': {
                    backgroundColor: '#f5faff',
                  },
                }}
              >
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell sx={{ fontWeight: 'bold', color: '#1976d2', backgroundColor: '#e0f2ff' }}>
                        Medication Name
                      </StyledTableCell>
                      <StyledTableCell sx={{ fontWeight: 'bold', color: '#1976d2', backgroundColor: '#e0f2ff' }}>
                        Dosage
                      </StyledTableCell>
                      <StyledTableCell sx={{ fontWeight: 'bold', color: '#1976d2', backgroundColor: '#e0f2ff' }}>
                        Instructions
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedRecord.medications.map((medication) => (
                      <TableRow
                        key={medication.id}
                        sx={{
                          '&:hover': {
                            backgroundColor: '#f0f7ff',
                            transition: 'background-color 0.3s ease',
                          },
                        }}
                      >
                        <TableCell>{medication.medicationName}</TableCell>
                        <TableCell>{medication.dosage}</TableCell>
                        <TableCell>{medication.instructions}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography sx={{ color: '#333' }}>No medications available</Typography>
            )}
          </Grid>

          {/* Clinic and Branch Details */}
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2', marginBottom: 2 ,marginLeft:35}}>
              Clinic Information
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start',marginLeft:35 }}>
              <Typography sx={{ marginBottom: 1, color: '#000' }}>
                <strong>Clinic Name:</strong> {selectedRecord?.clinicName || 'N/A'}
              </Typography>
              <Typography sx={{ marginBottom: 1, color: '#000' }}>
                <strong>Branch Name:</strong> {selectedRecord?.branchName || 'N/A'}
              </Typography>
              <Typography sx={{ marginBottom: 1, color: '#000' }}>
                <strong>Amount:</strong> {selectedRecord?.amount || 'N/A'}
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={3} sx={{ marginTop: 3 }}>
          {/* Vital Signs and Diagnosis */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#d81b60', marginBottom: 2 }}>
              Vital Signs and Diagnosis
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4}>
                <Box
                  sx={{
                    padding: 2,
                    borderRadius: '10px',
                    background: '#f9f9f9',
                    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                    },
                  }}
                >
                  <Typography sx={{ color: '#000', marginBottom: 1 }}>
                    <strong>Vital Signs:</strong> {selectedRecord?.vitalSigns || 'N/A'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box
                  sx={{
                    padding: 2,
                    borderRadius: '10px',
                    background: '#f9f9f9',
                    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                    },
                  }}
                >
                  <Typography sx={{ color: '#000', marginBottom: 1 }}>
                    <strong>Treatment:</strong> {selectedRecord?.treatment || 'N/A'}
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Box
                  sx={{
                    padding: 2,
                    borderRadius: '10px',
                    background: '#f9f9f9',
                    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'scale(1.02)',
                    },
                  }}
                >
                  <Typography sx={{ color: '#000' }}>
                    <strong>Diagnosis:</strong> {selectedRecord?.diagnosis || 'N/A'}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </BottomStyledCard>
  </Grid>
</Grid>



    </AnimatedBox>
  );
};

export default PatientDetails;
