import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Fab, Typography, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';
import NavigationIcon from '@mui/icons-material/Navigation';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

interface Clinic {
  id: number;
  name: string;
  address: string;
  branches: Branch[];
}

interface Branch {
  branchId: number;
  clinicId: number;
  name: string;
  address: string;
}

const ClinicTable: React.FC = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClinics = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/clinic');
        setClinics(response.data);
      } catch (error) {
        console.error('Error fetching clinics:', error);
      }
    };

    fetchClinics();
  }, []);

  const handleNavigateToLogin = () => {
    navigate('/');
    localStorage.removeItem('username');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('role');
    localStorage.removeItem('access_token');
    localStorage.removeItem('id');
  };

  const handleDeleteClick = (clinic: Clinic) => {
    setSelectedClinic(clinic);
  };

  const handleCloseDialog = () => {
    setSelectedClinic(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedClinic) {
      try {
        await axios.delete(`http://localhost:8080/api/v1/clinic/delete/${selectedClinic.id}`);
        setClinics(clinics.filter((clinic) => clinic.id !== selectedClinic.id));
      } catch (error) {
        console.error('Error deleting clinic:', error);
      } finally {
        handleCloseDialog();
      }
    }
  };

  const handleNavigateToStepper = () => {
    navigate('/stepper');
  };

  return (
    <>
      <Typography
        variant="h4"
        style={{
          marginTop: '10px',
          position: 'fixed',
          top: '1px',
          zIndex: 999,
          background: 'linear-gradient(90deg, rgba(33,150,243,1) 0%, rgba(3,169,244,1) 35%, rgba(0,188,212,1) 100%)',
          color: '#FFFFFF',
          padding: '15px 30px',
          borderRadius: '8px',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
          fontFamily: "'Roboto', sans-serif",
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '1px',
          textAlign: 'center',
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        Our Clinic & Branches
      </Typography>
      <Fab
        variant="extended"
        onClick={handleNavigateToLogin}
        style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 999 }}
      >
        <NavigationIcon sx={{ mr: 1 }} />
        Log Out
      </Fab>
      {/* Back Arrow Button */}
      <IconButton
        onClick={handleNavigateToStepper}
        style={{ position: 'fixed', top: '20px', left: '20px', zIndex: 999 }}
      >
        <ArrowBackIcon />
      </IconButton>
      <TableContainer component={Paper} style={{ marginTop: '100px', maxHeight: '450px' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Clinic ID</TableCell>
              <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Clinic Name</TableCell>
              <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Clinic Address</TableCell>
              <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Branch ID</TableCell>
              <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Branch Name</TableCell>
              <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Branch Address</TableCell>
              <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clinics.map((clinic) =>
              clinic.branches.map((branch) => (
                <TableRow key={branch.branchId}>
                  <TableCell>{clinic.id}</TableCell>
                  <TableCell>{clinic.name}</TableCell>
                  <TableCell>{clinic.address}</TableCell>
                  <TableCell>{branch.branchId}</TableCell>
                  <TableCell>{branch.name}</TableCell>
                  <TableCell>{branch.address}</TableCell>
                  <TableCell>
                    <IconButton color="secondary" onClick={() => handleDeleteClick(clinic)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={!!selectedClinic}
        onClose={handleCloseDialog}
      >
        <DialogTitle>Delete Clinic</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the clinic "{selectedClinic?.name}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="secondary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ClinicTable;
