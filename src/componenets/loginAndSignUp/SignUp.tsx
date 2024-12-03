import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { ArrowBack } from '@mui/icons-material';
import {
  Avatar,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Box,
  Paper,
  MenuItem
} from '@mui/material';
import { styled } from '@mui/system';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useToken } from '../../api/Token';

const SignUpFormContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  maxWidth: '900px',
  overflow: 'hidden',
  margin: 'auto',
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
  },
}));

const FormContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(4),
  backgroundColor: '#ffffff',
  maxWidth: '900px',
  margin: 'auto',
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

const SignUp: React.FC = () => {
  const { accessToken } = useToken(); // Use the access token from context
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    roleName: '',
    clinicName: '',
    clinicId: '',
    branchIds: '',
    specialization: '',
    address: {
      address: '',
      city: '',
      phoneNumber: '',
      postalCode: '',
      aboutMe: '',
      status: 'true' // Status defaults to 'ACTIVE' (true)
    }
  });

  const [clinics, setClinics] = useState<any[]>([]);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);
  const [superAdminName, setSuperAdminName] = useState<string>('');
  const [roles, setRoles] = useState<any[]>([]); // State for roles
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/clinic', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setClinics(response.data);
      } catch (error) {
        console.error('There was an error fetching the clinics!', error);
      }
    };

    const fetchSuperAdminData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/super-admins/1');
        setSuperAdminName(response.data.name);
      } catch (error) {
        console.error('There was an error fetching the super admin data!', error);
      }
    };
    const fetchRoles = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/admin-role', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setRoles(response.data); // Store roles in state
      } catch (error) {
        console.error('There was an error fetching the roles!', error);
      }
    };

    fetchClinics();
    fetchSuperAdminData();
    fetchRoles();
  }, [accessToken]);

  

  const validateClinicName = (name: string) => {
    const clinicExists = clinics.some(clinic => clinic.name.toLowerCase() === name.toLowerCase());
    if (clinicExists) {
      setNameError('Clinic name already exists. Please choose a different name.');
    } else {
      setNameError(null);
    }
  };
   
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === 'email') {
      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
      setEmailError(emailValid ? null : 'Invalid email address');
    }

    const [parent, child] = name.split('.');
    const finalValue = value === 'true' || value === 'false' ? value === 'true' : value;

    if (child) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [parent]: {
          ...(prevFormData[parent as keyof typeof prevFormData] as any),
          [child]: finalValue
        }
      }));
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }

    // Automatically populate clinicId and branchIds when clinicName changes
    if (name === 'clinicName') {
      const selectedClinic = clinics.find(clinic => clinic.name === value);
      if (selectedClinic) {
        setFormData(prevData => ({
          ...prevData,
          clinicId: selectedClinic.id.toString(),
          branchIds: selectedClinic.branches.map((branch: any) => branch.branchId).join(', ')
        }));
      } else {
        setFormData(prevData => ({
          ...prevData,
          clinicId: '',
          branchIds: ''
        }));
      }
    }
  };
  //add  twonumber
  


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (emailError || nameError) {
      return;
    }

    const data = {
      ...formData,
      clinicId: parseInt(formData.clinicId, 10),
      branchIds: formData.branchIds.split(',').map((id) => parseInt(id.trim())),
      address: {
        ...formData.address,
        status: formData.address.status === 'true' // Convert status to boolean
      }
    };

    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/register/user', data);
      if (response.status === 200) {
        alert('Registration successful!');
        navigate('/'); // Redirect to login page after successful registration
      }
    } catch (error) {
      alert('Registration failed. Please try again.');
      console.error('There was an error registering the user!', error);
    }
  };

  return (
    <>
      <Box
        sx={{
          minHeight: '400px',
          backgroundImage: 'url(https://wallpapers.com/images/featured/healthcare-oco8w27tkw40cp90.jpg)',
          backgroundColor: 'white',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          display: 'flex',
          alignItems: 'center',
          pt: 5,
          pb: 8,
        }}
      ></Box>
      <SignUpFormContainer sx={{ mt: -10 }}>

        <FormContainer>
        <Button
  component={RouterLink}
  to="/superadmin"
  variant="text"
  color="secondary"
  sx={{ ml: 2 }}
  startIcon={<ArrowBack />} // This adds the back arrow icon
>
  Back
</Button>
          <Typography 
            variant="h6" 
            gutterBottom 
            sx={{ 
              color: '#4A90E2', 
              fontWeight: 'bold', 
              textTransform: 'uppercase',
              letterSpacing: 1.5,
              textAlign: 'center'
            }}
          >
            SUPER-ADMIN Portal
          </Typography>
          <Typography 
            variant="h5" 
            gutterBottom 
            sx={{ 
              color: '#2C3E50', 
              fontWeight: 'bold',
              fontStyle: 'italic',
              margin: 2,
              textAlign: 'center'
            }}
          >
            Welcome back, {superAdminName}! Register here....
          </Typography>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  name="firstName"
                  variant="outlined"
                  fullWidth
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  name="lastName"
                  variant="outlined"
                  fullWidth
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email"
                  name="email"
                  variant="outlined"
                  fullWidth
                  value={formData.email}
                  onChange={handleChange}
                  required
                  error={!!emailError}
                  helperText={emailError}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Password"
                  name="password"
                  variant="outlined"
                  type="password"
                  fullWidth
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
  <TextField
    select
    label="Role"
    name="roleName"
    variant="outlined"
    fullWidth
    value={formData.roleName}
    onChange={handleChange}
    required
  >
    {roles.map((role) => (
      <MenuItem key={role.id} value={role.roleName}>
        {role.roleName}
      </MenuItem>
    ))}
  </TextField>
</Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  label="Clinic Name"
                  name="clinicName"
                  variant="outlined"
                  fullWidth
                  value={formData.clinicName}
                  onChange={handleChange}
                  required
                >
                  {clinics.map((clinic) => (
                    <MenuItem key={clinic.id} value={clinic.name}>
                      {clinic.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Clinic ID"
                  name="clinicId"
                  variant="outlined"
                  fullWidth
                  value={formData.clinicId}
                  onChange={handleChange}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Branch IDs (comma separated)"
                  name="branchIds"
                  variant="outlined"
                  fullWidth
                  value={formData.branchIds}
                  onChange={handleChange}
                />
              </Grid>
             {/* Specialization field based on selected role */}
{formData.roleName && (
  <Grid item xs={12}>
    <TextField
      select
      label="Specialization"
      name="specialization"
      variant="outlined"
      fullWidth
      value={formData.specialization}
      onChange={handleChange}
      required
    >
      {(() => {
        switch (formData.roleName) {
          case 'MANAGER':
            return [
              <MenuItem key="adminDuties" value="Administrative Duties">
                Administrative Duties
              </MenuItem>,
              <MenuItem key="financialManagement" value="Financial Management">
                Financial Management
              </MenuItem>,
            ];
          case 'ADMIN':
            return [
              <MenuItem key="financialManagement" value="Financial Management">
                Financial Management
              </MenuItem>,
              <MenuItem key="patientSpecialist" value="Patient Financial Specialist">
                Patient Financial Specialist
              </MenuItem>,
            ];
          case 'DOCTOR':
            return [
              <MenuItem key="anesthesiologists" value="Anesthesiologists">
                Anesthesiologists
              </MenuItem>,
              <MenuItem key="dermatologists" value="Dermatologists">
                Dermatologists
              </MenuItem>,
              <MenuItem key="radiologists" value="Radiologists">
                Radiologists
              </MenuItem>,
              <MenuItem key="pathologists" value="Pathologists">
                Pathologists
              </MenuItem>,
            ];
          case 'FRONTDESK':
            return [
              <MenuItem key="customerInteraction" value="Customer Interaction">
                Customer Interaction
              </MenuItem>,
              <MenuItem
                key="professionalComposure"
                value="Maintaining Professional Composure"
              >
                Maintaining Professional Composure
              </MenuItem>,
            ];
          default:
            return [];
        }
      })()}
    </TextField>
  </Grid>
)}
              <Grid item xs={6}>
                <TextField
                  label="Address"
                  name="address.address"
                  variant="outlined"
                  fullWidth
                  value={formData.address.address}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="City"
                  name="address.city"
                  variant="outlined"
                  fullWidth
                  value={formData.address.city}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Phone Number"
                  name="address.phoneNumber"
                  variant="outlined"
                  fullWidth
                  value={formData.address.phoneNumber}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Postal Code"
                  name="address.postalCode"
                  variant="outlined"
                  fullWidth
                  value={formData.address.postalCode}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="About Me"
                  name="address.aboutMe"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={3}
                  value={formData.address.aboutMe}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Status"
                  name="address.status"
                  variant="outlined"
                  fullWidth
                  value={formData.address.status}
                  onChange={handleChange}
                >
                  <MenuItem value='true'>Active</MenuItem>
                  <MenuItem value='false'>Inactive</MenuItem>
                </TextField>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button type="submit" variant="contained" color="primary">
                Register
              </Button>
            
            </Box>
          </form>
        </FormContainer>
      </SignUpFormContainer>
    </>
  );
};

export default SignUp;
