import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility'; // Import the Visibility icon
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useToken } from '../../api/Token';

interface Doctor {
  id: number;
  firstName: string;
  email: string;
  specialization: string | null;
}

const Doctors: React.FC = () => {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const { accessToken } = useToken();

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const username = localStorage.getItem('username');
        if (username) {
          const response = await axios.get(`http://localhost:8080/api/v1/users/${username}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setDoctor(response.data);
        }
      } catch (error) {
        console.error('Error fetching doctor details:', error);
      }
    };

    fetchDoctor();
  }, [accessToken]);

  return (
    <>
      <Typography variant="h4">Doctor</Typography>
      <TableContainer component={Paper} style={{ marginTop: '30px', maxHeight: '450px' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>First Name</TableCell>
              <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Email</TableCell>
              <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Specialization</TableCell>
              <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {doctor && (
              <TableRow key={doctor.id}>
                <TableCell>{doctor.id}</TableCell>
                <TableCell>{doctor.firstName}</TableCell>
                <TableCell>{doctor.email}</TableCell>
                <TableCell>{doctor.specialization || 'N/A'}</TableCell>
                <TableCell>
                  <IconButton component={Link} to={`/doctor-details/${doctor.id}`}>
                    <VisibilityIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Doctors;
