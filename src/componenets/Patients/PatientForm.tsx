import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Paper, TextField, Grid, Button, Box, MenuItem, Typography, Alert, AlertTitle,  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,} from '@mui/material';
import { styled } from '@mui/system';
import { useToken } from '../../api/Token';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RefreshIcon from '@mui/icons-material/Refresh'; // Import the reload icon

type AlertType = 'success' | 'error';

const RootContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '180vh',
  width: '100vw',  // Set full width
  padding: theme.spacing(2),
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundImage: 'url(../../src/assets/createPatient.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    opacity: 0.3,
    zIndex: -1,
  },
}));


const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 600,
  width: '100%',
  marginTop: 50,
  borderRadius: 40,
  marginLeft: '40%',
  backgroundColor: '#EDFDFF',
}));

const generatePatientToken = () => {
  const randomNumber = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit random number
  return `AB${randomNumber}`; // Prepend 'AB' to the number
};

const PatientForm: React.FC = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [medicalHistory, setMedicalHistory] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState<string | null>(null);
  const [isFirstVisit, setIsFirstVisit] = useState(true); // State for first visit
  const [doctors, setDoctors] = useState<any[]>([]); // State to store doctors
  const [selectedDoctorId, setSelectedDoctorId] = useState(''); // Store selected doctor ID
  const [image, setImage] = useState<File | null>(null); // State for the image
  const [prescription, setPrescription] = useState<File | null>(null); // State for the prescription
  const [alert, setAlert] = useState<{ type: AlertType | null; message: string }>({ type: null, message: '' });
  const [appointmentDate, setAppointmentDate] = useState(''); // State for the appointment date
  const [patientToken, setPatientToken] = useState(generatePatientToken()); 
  // Assuming clinicId and branchId are coming from somewhere, such as props or context
  const clinicId = '1'; // Replace this with actual value
  const branchId = '1'; // Replace this with actual value

  const { accessToken } = useToken();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/patients', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setPatients(response.data);
      } catch (error) {
        console.error('Failed to fetch patients', error);
      }
    };

    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/users/role/DOCTOR', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setDoctors(response.data); // Store the doctors in state
      } catch (error) {
        console.error('Failed to fetch doctors', error);
      }
    };

    fetchPatients();
    fetchDoctors(); // Fetch the list of doctors
  }, [accessToken]);
  

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setPhoneNumber(value);
      setPhoneNumberError(null);
    } else {
      setPhoneNumberError('Phone number must be 10 digits');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handlePrescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setPrescription(e.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (phoneNumber.length !== 10) {
      setPhoneNumberError('Phone number must be exactly 10 digits');
      return;
    }

    const isPhoneNumberDuplicate = patients.some(patient => patient.phoneNumber === phoneNumber);
    const isPatientTokenDuplicate = patients.some(patient => patient.patientToken === patientToken);

    if (isPhoneNumberDuplicate) {
      setAlert({ type: 'error', message: 'Phone number already exists. Please use a different phone number.' });
      return;
    }

    if (isPatientTokenDuplicate) {
      setAlert({ type: 'error', message: 'Patient token already exists. Please use a different patient token.' });
      return;
    }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('age', age);
    formData.append('patientToken', patientToken);
    formData.append('medicalHistory', medicalHistory);
    formData.append('bloodGroup', bloodGroup);
    formData.append('phoneNumber', phoneNumber);
    formData.append('clinicId', clinicId); // Automatically set Clinic ID
    formData.append('branchId', branchId); // Automatically set Branch ID
    formData.append('first_visit', JSON.stringify(isFirstVisit));  // Add first visit status
    formData.append('doctorId', selectedDoctorId); // Add selected doctor ID
    formData.append('appointmentDate', appointmentDate);
    if (image) {
      formData.append('image', image); // Append image if it exists
    }
    if (prescription) {
      formData.append('prescription', prescription); // Append prescription if it exists
    }

    try {
      const response = await axios.post('http://localhost:8080/api/v1/patients/createPatientWithImage', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 201) {
        setAlert({ type: 'success', message: 'Patient added successfully!' });
        setName('');
        setAge('');
        setPatientToken(generatePatientToken());
        setMedicalHistory('');
        setBloodGroup('');
        setPhoneNumber('');
        setImage(null);
        setAppointmentDate('');
        setPrescription(null);
        setTimeout(() => {
          navigate('/dashboard/patients');
        }, 1000);
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to add patient. Please try again.' });
      console.error('There was an error adding the patient!', error);
    }
  };

  const handleGenerateNewToken = () => {
    setPatientToken(generatePatientToken()); // Generate and set a new token
  };

  return (
    <RootContainer>
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 50, damping: 10 }}
      >
        <FormContainer elevation={3} color='#EDFDFF'>
          <Button
            variant="text"
            color="primary"
            onClick={() => navigate(-1)}
            sx={{ top: 16, left: 16 }}
            startIcon={<ArrowBackIcon />}
          >
            Back
          </Button>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <img
                src="../../src/assets/eye.png"
                alt="Logo"
                style={{ 
                  width: '150px',
                  height: '200px',
                  filter: 'drop-shadow(10px 0px 10px #6265BF)'
                }}
              />
            </Grid>
            <Grid item>
              <Typography variant="h5" marginLeft={7} gutterBottom color={'#AA336A'}>
                New Patient Registration
              </Typography>
              <Typography variant="h6" margin={3} marginLeft={8} color={'#C9A9A6'} gutterBottom>
                Please fill in the form below
              </Typography>
            </Grid>
          </Grid>
          {alert.type && (
            <Alert severity={alert.type} onClose={() => setAlert({ type: null, message: '' })}>
              <AlertTitle>{alert.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
              {alert.message}
            </Alert>
          )}
          <form onSubmit={handleSubmit}>
            
              <Grid item xs={12} sm={6} padding={1}>
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6} padding={1}>
                <TextField
                  label="Age"
                  type="number"
                  variant="outlined"
                  fullWidth
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6} padding={1}>
                <Grid container spacing={1} alignItems="center">
                  <Grid item xs>
                    <TextField
                      label="Patient Token"
                      variant="outlined"
                      fullWidth
                      value={patientToken} // Automatically generated token
                      onChange={(e) => setPatientToken(e.target.value)}
                      required
                      disabled // Make the field read-only since it's auto-generated
                    />
                  </Grid>
                  <Grid item>
                    <Button onClick={handleGenerateNewToken} variant="outlined" size="small">
                      <RefreshIcon />
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={6} padding={1}>
                <TextField
                  label="Blood Group"
                  variant="outlined"
                  select
                  fullWidth
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  required
                >
                  <MenuItem value="A+">A+</MenuItem>
                  <MenuItem value="A-">A-</MenuItem>
                  <MenuItem value="B+">B+</MenuItem>
                  <MenuItem value="B-">B-</MenuItem>
                  <MenuItem value="AB+">AB+</MenuItem>
                  <MenuItem value="AB-">AB-</MenuItem>
                  <MenuItem value="O+">O+</MenuItem>
                  <MenuItem value="O-">O-</MenuItem>
                </TextField>
              </Grid>
              <Grid container spacing={2}>
              {/* Your existing form fields */}
              <Grid item xs={12}>
  <FormControl component="fieldset">
    <FormLabel component="legend">Is this the patient's first visit?</FormLabel>
    <RadioGroup
      row
      value={isFirstVisit ? 'yes' : 'no'}
      onChange={(e) => setIsFirstVisit(e.target.value === 'yes' ? true : false)}
    >
      <FormControlLabel value="yes" control={<Radio />} label="Yes" />
      <FormControlLabel value="no" control={<Radio />} label="No" />
    </RadioGroup>
  </FormControl>
</Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  label="Select Doctor"
                  variant="outlined"
                  select
                  fullWidth
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  required
                >
                  {doctors.map((doctor) => (
                    <MenuItem key={doctor.id} value={doctor.id}>
                      {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <TextField
              label="Appointment Date"
              type="datetime-local"
              variant="outlined"
              fullWidth
              value={appointmentDate}
              onChange={(e) => setAppointmentDate(e.target.value)}
              margin="normal"
              required
            />
              <Grid item xs={12}>
                <TextField
                  label="Medical History"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4}
                  value={medicalHistory}
                  onChange={(e) => setMedicalHistory(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone Number"
                  variant="outlined"
                  fullWidth
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  error={!!phoneNumberError}
                  helperText={phoneNumberError}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handlePrescriptionChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Box display="flex" justifyContent="flex-end">
                  <Button type="submit" variant="contained" color="primary">
                    Submit
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </FormContainer>
      </motion.div>
    </RootContainer>
  );
};

export default PatientForm;
