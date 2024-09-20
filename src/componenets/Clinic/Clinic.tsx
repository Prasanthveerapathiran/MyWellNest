import React, { useState, useEffect } from 'react';
import { Button, TextField, Stack, Grid, Typography, IconButton } from '@mui/material';
import clinicImage from '../../assets/clinic.png';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useToken } from '../../api/Token';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

interface ClinicProps {
  onNext: () => void;
  setClinicData: (data: { name: string; address: string }) => void;
  clinicData: { name: string; address: string };
}

const Clinic: React.FC<ClinicProps> = ({ onNext, setClinicData, clinicData }) => {
  const [name, setName] = useState(clinicData.name);
  const [address, setAddress] = useState(clinicData.address);
  const [error, setError] = useState({ name: false, address: false });
  const [nameError, setNameError] = useState<string | null>(null);

  const { accessToken } = useToken();
  const navigate = useNavigate();

  useEffect(() => {
    const validateClinicName = async (clinicName: string) => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/clinic', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const existingClinics = response.data;
        const clinicExists = existingClinics.some((clinic: any) => clinic.name.toLowerCase() === clinicName.toLowerCase());

        if (clinicExists) {
          setNameError('Clinic name already exists. Please choose a different name.');
        } else {
          setNameError(null);
        }
      } catch (error) {
        console.error('Error validating clinic name:', error);
        setNameError('Error validating clinic name. Please try again.');
      }
    };

    if (name) {
      validateClinicName(name);
    }
  }, [name, accessToken]);

  const handleSubmit = () => {
    if (name && address && !nameError) {
      setClinicData({ name, address });
      onNext();
    } else {
      setError({
        name: !name,
        address: !address,
      });
    }
  };

  const handleBack = () => {
    navigate('/superadmin');
  };

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item xs={12} md={6}>
        <Stack spacing={3} sx={{ padding: 2 }}>
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 100,
              damping: 10,
            }}
          >
            <Typography variant="h4" align="center" gutterBottom>
              Create Clinic
            </Typography>
            <IconButton
              onClick={handleBack}
              sx={{ position: 'absolute', top: 16, left: 16 }}
            >
              <ArrowBackIcon />
            </IconButton>
          </motion.div>
          <TextField
            label="Clinic Name"
            variant="outlined"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={error.name || !!nameError}
            helperText={error.name ? 'Clinic name is required' : nameError || ''}
          />
          <TextField
            label="Clinic Address"
            variant="outlined"
            fullWidth
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            error={error.address}
            helperText={error.address ? 'Clinic address is required' : ''}
          />
          <Button
            variant="contained"
            style={{ backgroundColor: '#4CAF50', color: 'white' }}
            onClick={handleSubmit}
            disabled={!!nameError}
          >
            Next
          </Button>
        </Stack>
      </Grid>
      <Grid item xs={6}>
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{
            height: '400px',
            backgroundImage: `url(${clinicImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            textAlign: 'center',
            padding: '20px',
            margin: '20px',
            opacity: 0.8,
          }}
        />
      </Grid>
    </Grid>
  );
};

export default Clinic;
