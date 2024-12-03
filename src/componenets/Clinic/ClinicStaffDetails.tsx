import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Checkbox, Button } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useToken } from '../../api/Token';
import { motion } from 'framer-motion';
import './ClinicStaffDetails.css'; // Import a custom CSS file if needed

interface Staff {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  roleName: string;
}

const ClinicStaffDetails: React.FC = () => {
  const { clinicId } = useParams<{ clinicId: string }>();
  const [staffDetails, setStaffDetails] = useState<Staff[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const { accessToken } = useToken(); // Use token from your context
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStaffDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/users/user/clinic/${clinicId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setStaffDetails(response.data);
      } catch (error) {
        console.error('Error fetching staff details:', error);
      }
    };

    if (accessToken && clinicId) {
      fetchStaffDetails();
    }
  }, [accessToken, clinicId]);

  const handleCheckboxChange = (staff: Staff) => {
    setSelectedStaff(staff);
  };

  const handleAccessPage = () => {
    if (selectedStaff) {
      if (selectedStaff.roleName === 'Admin') {
        navigate(`/adminPage/${selectedStaff.id}`);
      } else if (selectedStaff.roleName === 'Doctor') {
        navigate(`/doctorPage/${selectedStaff.id}`);
      } else {
        alert("This role doesn't have access to the special page.");
      }
    } else {
      alert('Please select a staff member.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="clinic-staff-container"
    >
      <Typography variant="h4" className="header-title" style={{ marginTop: '20px', textAlign: 'center' }}>
        Clinic Staff Details
      </Typography>

      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <TableContainer component={Paper} className="table-container" style={{ marginTop: '20px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell style={{ fontWeight: 'bold', color: '#1976d2' }}>Select</TableCell>
                <TableCell style={{ fontWeight: 'bold', color: '#1976d2' }}>First Name</TableCell>
                <TableCell style={{ fontWeight: 'bold', color: '#1976d2' }}>Last Name</TableCell>
                <TableCell style={{ fontWeight: 'bold', color: '#1976d2' }}>Email</TableCell>
                <TableCell style={{ fontWeight: 'bold', color: '#1976d2' }}>Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {staffDetails.map((staff) => (
                <TableRow key={staff.id} className="staff-row">
                  <TableCell>
                    <Checkbox
                      checked={selectedStaff?.id === staff.id}
                      onChange={() => handleCheckboxChange(staff)}
                      className="checkbox"
                    />
                  </TableCell>
                  <TableCell>{staff.firstName}</TableCell>
                  <TableCell>{staff.lastName}</TableCell>
                  <TableCell>{staff.email}</TableCell>
                  <TableCell>{staff.roleName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </motion.div>

      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <Button 
          variant="contained" 
          color="primary" 
          style={{ marginTop: '20px', display: 'block', marginLeft: 'auto', marginRight: 'auto' }}
          onClick={handleAccessPage}
        >
          Access Page Based on Role
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default ClinicStaffDetails;
