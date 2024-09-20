import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';
import axios from 'axios';
import { useToken } from '../api/Token';
import { motion } from 'framer-motion';

interface Doctor {
  id: number;
  firstName: string;
  email: string;
  specialization: string | null;
  address: {
    phoneNumber: string;
    status: boolean;
  } | null;
}

const OurDoctors: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const { accessToken } = useToken();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/users/role/DOCTOR', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setDoctors(response.data);
      } catch (error) {
        console.error('Error fetching doctor details:', error);
      }
    };

    fetchDoctors();
  }, [accessToken]);

  const toggleStatus = async (doctorId: number) => {
    try {
      await axios.patch(`http://localhost:8080/api/v1/users/${doctorId}/status`, null, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      // Update the local state after the status has been toggled
      setDoctors((prevDoctors) =>
        prevDoctors.map((doctor) =>
          doctor.id === doctorId
            ? { ...doctor, address: doctor.address ? { ...doctor.address, status: !doctor.address.status } : null }
            : doctor
        )
      );
    } catch (error) {
      console.error('Error toggling doctor status:', error);
    }
  };

  return (
    <>
      <Typography variant="h4" style={{ textAlign: 'center', marginTop: '20px' }}>
        Our Doctors
      </Typography>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 2 }}
        transition={{ duration: 1.5 }}
      >
        <TableContainer component={Paper} style={{ marginTop: '30px', maxHeight: '450px' }}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>First Name</TableCell>
                <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Email</TableCell>
                <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Specialization</TableCell>
                <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Phone Number</TableCell>
                <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {doctors.map((doctor) => (
                <TableRow key={doctor.id}>
                  <TableCell>{doctor.firstName}</TableCell>
                  <TableCell>{doctor.email}</TableCell>
                  <TableCell>{doctor.specialization || 'N/A'}</TableCell>
                  <TableCell>{doctor.address?.phoneNumber || 'N/A'}</TableCell>
                  <TableCell>
                    {doctor.address ? (
                      <>
                        {doctor.address.status ? 'Active' : 'Inactive'}
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => toggleStatus(doctor.id)}
                          style={{ marginLeft: '20px' }}
                        >
                          Toggle
                        </Button>
                      </>
                    ) : (
                      'N/A'
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </motion.div>
    </>
  );
};

export default OurDoctors;
