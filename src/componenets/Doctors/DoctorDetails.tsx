import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useToken } from '../../api/Token';
import {
  Paper, Button, Typography, Box, Avatar, Grid, Card, CardContent, CardActions, CircularProgress,
} from '@mui/material';
import { motion } from 'framer-motion';
import PersonalInformation from './PersonalInformation';
import OurPatients from './OurPatients';
import DoctorAppointment from './DoctorAppointment/DoctorAppointment';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface Medication {
  id: number;
  medicationName: string;
  dosage: string;
  medicationPrice: number;
  quantity: number;
  instructions: string;
  clinicId: number;
  branchId: number;
}

interface MedicalRecord {
  id: number;
  doctorId: number;
  patientId: number;
  doctorName: string;
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

interface Patient {
  id: number;
  name: string;
  age: number;
}

interface Doctor {
  firstName: string;
  lastName: string;
  specialization: string;
}

const DoctorDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { accessToken } = useToken();
  const [activeTab, setActiveTab] = useState<'personalInfo' | 'patients' | 'appointments'>('patients'); // Set the initial activeTab to 'patients'
  const navigate = useNavigate();
  useEffect(() => {
    const fetchDoctorDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/users/user/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setDoctor(response.data);
      } catch (error) {
        console.error('Error fetching doctor details:', error);
        setError('Error loading doctor details.');
      }
    };

    const fetchMedicalRecords = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/medical-records/doctor/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setMedicalRecords(response.data);
        const patientsData = response.data.map((record: MedicalRecord) => ({
          id: record.patientId,
          name: record.patientName,
          age: 0,
        }));
        setPatients(patientsData);
      } catch (error) {
        console.error('Error fetching medical records:', error);
        setError('This doctor does not treat any patients.');
      }
    };

    if (id && accessToken) {
      fetchDoctorDetails();
      fetchMedicalRecords();
    }
  }, [id, accessToken]);

  const handleButtonClick = (tab: 'personalInfo' | 'patients' | 'appointments') => {
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'personalInfo':
        return <PersonalInformation />;
      case 'patients':
        return <OurPatients />;
      case 'appointments':
        return <DoctorAppointment />;
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        backgroundImage: 'url(/assets/doctorIcon.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        py: 5,
        px: 3,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Grid container spacing={4} justifyContent="center">
        {/* Left Panel */}
        <Grid item xs={12} md={4}>
          <motion.div
            initial={{ x: -200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
        <Button
  variant="text"
  color="primary"
  onClick={() => navigate(-1)}
  sx={{ top: 10, left: 10,marginTop:5,padding:5 }}
  startIcon={<ArrowBackIcon />}
>
  Back
</Button>
            <Card
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                p: 3,
                boxShadow: 4,
                backgroundColor: '#f0f4f8',
                borderRadius: 2,
              }}
            >
              <Avatar
                src="https://static.vecteezy.com/system/resources/previews/024/585/344/non_2x/3d-happy-cartoon-doctor-cartoon-doctor-on-transparent-background-generative-ai-png.png"
                sx={{
                  width: 160,
                  height: 150,
                  my: 2,
                  backgroundColor: 'white',
                  border: '2px solid #ddd',
                }}
              />
              {doctor ? (
                <>
                  <Typography variant="h6" align="center" sx={{ fontWeight: 'bold', mt: 2 }}>
                    Dr. {doctor.firstName} {doctor.lastName}
                  </Typography>
                  <Typography variant="body1" align="center" sx={{ color: 'text.secondary', mb: 2 }}>
                    Specialization: {doctor.specialization}
                  </Typography>
                </>
              ) : (
                <CircularProgress />
              )}
              <CardActions sx={{ flexDirection: 'column', width: '100%' }}>
                {/* <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleButtonClick('personalInfo')}
                  fullWidth
                  sx={{ mt: 2, py: 1, fontSize: 16 }}
                >
                  Personal Information
                </Button> */}
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleButtonClick('patients')}
                  fullWidth
                  sx={{ mt: 2, py: 1, fontSize: 16 }}
                >
                  Our Patients
                </Button>
                {/* <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleButtonClick('appointments')}
                  fullWidth
                  sx={{ mt: 2, py: 1, fontSize: 16 }}
                >
                  Appointments
                </Button> */}
              </CardActions>
            </Card>
          </motion.div>
        </Grid>

        {/* Right Panel */}
        <Grid item xs={12} md={7}>
          <motion.div
            initial={{ x: 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              sx={{
                padding: 3,
                minHeight: '90vh',
                borderRadius: 2,
                boxShadow: 4,
                width: 720,
                backgroundColor: '#F0F4F8',
              }}
            >
              {renderContent()}
            </Paper>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DoctorDetails;
