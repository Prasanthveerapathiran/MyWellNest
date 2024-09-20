import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Grid, Typography } from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';
import { useToken } from '../../api/Token'; // Import the useToken hook

const RecentPatient: React.FC = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const { accessToken } = useToken(); // Get the accessToken from the useToken hook

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/patients', {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const allPatients = response.data;
        const filteredPatients = allPatients.filter((patient: any) => {
          const createdDate = new Date(patient.createdDate);
          const now = new Date();
          return createdDate.getFullYear() === now.getFullYear() &&
                 createdDate.getMonth() === now.getMonth();
        });

        setPatients(filteredPatients);
      } catch (error) {
        console.error('Error fetching patient data:', error);
      }
    };

    if (accessToken) {
      fetchPatients();
    }
  }, [accessToken]);

  return (
    <Grid container spacing={2} margin={1}>
  
      {patients.map(patient => (
        <Grid item xs={12} key={patient.id}>
          <Box sx={{ bgcolor: '#55C1FF', p: 2, borderRadius: 2,width:280, display: 'flex', alignItems: 'center', mb: 2 ,maxHeight:500}}>
            
            <PersonIcon sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h6">{patient.name}</Typography>
              <Typography variant="body2">Phone: {patient.phoneNumber}</Typography>
              <Typography variant="body2">Date: {new Date(patient.createdDate).toLocaleDateString()}</Typography>
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
};

export default RecentPatient;
