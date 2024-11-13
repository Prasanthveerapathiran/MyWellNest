import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Fab,
  Typography,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
} from '@mui/material';
import NavigationIcon from '@mui/icons-material/Navigation';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility'; 
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
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
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [addBranchClinicId, setAddBranchClinicId] = useState<number | null>(null);
  const [newBranchName, setNewBranchName] = useState('');
  const [newBranchAddress, setNewBranchAddress] = useState('');
  const [isAddBranchDialogOpen, setIsAddBranchDialogOpen] = useState(false);
  const [isEditBranchDialogOpen, setIsEditBranchDialogOpen] = useState(false);
  const [isDeleteBranchDialogOpen, setIsDeleteBranchDialogOpen] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [expandedClinicIds, setExpandedClinicIds] = useState<number[]>([]); // Track expanded clinic rows
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
    localStorage.clear();
  };

  const handleDeleteClick = (clinic: Clinic) => {
    setSelectedClinic(clinic);
  };

  const handleCloseDialog = () => {
    setSelectedClinic(null);
  };
  
  const handleViewStaffDetails = (clinicId: number) => {
    navigate(`/clinic/${clinicId}/staff`);
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

  const handleDeleteBranchClick = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsDeleteBranchDialogOpen(true);
  };

  const handleCloseBranchDeleteDialog = () => {
    setSelectedBranch(null);
    setIsDeleteBranchDialogOpen(false);
  };

  const handleConfirmDeleteBranch = async () => {
    if (selectedBranch) {
      try {
        await axios.delete(`http://localhost:8080/api/v1/branches/${selectedBranch.branchId}`);
        const updatedClinics = clinics.map((clinic) => ({
          ...clinic,
          branches: clinic.branches.filter((branch) => branch.branchId !== selectedBranch.branchId),
        }));
        setClinics(updatedClinics);
      } catch (error) {
        console.error('Error deleting branch:', error);
      } finally {
        handleCloseBranchDeleteDialog();
      }
    }
  };

  const handleNavigateToStepper = () => {
    navigate('/stepper');
  };

  const handleAddBranchClick = (clinicId: number) => {
    setAddBranchClinicId(clinicId);
    setIsAddBranchDialogOpen(true);
  };

  const handleAddBranchSubmit = async () => {
    if (addBranchClinicId) {
      try {
        const newBranch = {
          clinicId: addBranchClinicId,
          name: newBranchName,
          address: newBranchAddress,
        };

        await axios.post('http://localhost:8080/api/v1/branches', newBranch);
        const response = await axios.get('http://localhost:8080/api/v1/clinic');
        setClinics(response.data);
        handleAddBranchDialogClose();
      } catch (error) {
        console.error('Error adding branch:', error);
      }
    }
  };

  const handleAddBranchDialogClose = () => {
    setIsAddBranchDialogOpen(false);
    setNewBranchName('');
    setNewBranchAddress('');
  };

  const handleEditBranchClick = (branch: Branch) => {
    setEditingBranch(branch);
    setNewBranchName(branch.name);
    setNewBranchAddress(branch.address);
    setIsEditBranchDialogOpen(true);
  };

  const handleEditBranchSubmit = async () => {
    if (editingBranch) {
      try {
        const updatedBranch = {
          branchId: editingBranch.branchId,
          clinicId: editingBranch.clinicId,
          name: newBranchName,
          address: newBranchAddress,
        };

        await axios.put(`http://localhost:8080/api/v1/branches/${editingBranch.branchId}`, updatedBranch);
        const response = await axios.get('http://localhost:8080/api/v1/clinic');
        setClinics(response.data);
        handleEditBranchDialogClose();
      } catch (error) {
        console.error('Error updating branch:', error);
      }
    }
  };

  const handleEditBranchDialogClose = () => {
    setIsEditBranchDialogOpen(false);
    setEditingBranch(null);
    setNewBranchName('');
    setNewBranchAddress('');
  };

  const handleToggleExpand = (clinicId: number) => {
    setExpandedClinicIds((prev) =>
      prev.includes(clinicId) ? prev.filter(id => id !== clinicId) : [...prev, clinicId]
    );
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
              <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clinics.map((clinic) => (
              <React.Fragment key={clinic.id}>
                <TableRow onClick={() => handleToggleExpand(clinic.id)} style={{ cursor: 'pointer' }}>
                  <TableCell>{clinic.id}</TableCell>
                  <TableCell>{clinic.name}</TableCell>
                  <TableCell>{clinic.address}</TableCell>
                
                  <TableCell>
                    <IconButton onClick={() => handleDeleteClick(clinic)}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton onClick={() => handleAddBranchClick(clinic.id)}>
                      <AddIcon />
                    </IconButton>
                    <IconButton onClick={() => handleViewStaffDetails(clinic.id)}>
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton 
  onClick={() => handleToggleExpand(clinic.id)} 
  style={{ marginLeft: '15px' }}  // Add left margin here
>
  {expandedClinicIds.includes(clinic.id) ? <ExpandLessIcon /> : <ExpandMoreIcon />}
</IconButton>

                  </TableCell>
                </TableRow>
                {expandedClinicIds.includes(clinic.id) && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Typography variant="h6" style={{ fontWeight: 'bold', marginTop: '15px' }}>
                        Branches
                      </Typography>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Branch ID</TableCell>
                            <TableCell style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Branch Name</TableCell>
                            <TableCell style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Branch Address</TableCell>
                            <TableCell style={{ backgroundColor: '#f5f5f5', fontWeight: 'bold' }}>Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {clinic.branches.map((branch) => (
                            <TableRow key={branch.branchId}>
                              <TableCell>{branch.branchId}</TableCell>
                              <TableCell>{branch.name}</TableCell>
                              <TableCell>{branch.address}</TableCell>
                              <TableCell>
                                <IconButton onClick={() => handleEditBranchClick(branch)}>
                                  <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDeleteBranchClick(branch)}>
                                  <DeleteIcon />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={Boolean(selectedClinic)} onClose={handleCloseDialog}>
        <DialogTitle>Delete Clinic</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this clinic?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isAddBranchDialogOpen} onClose={handleAddBranchDialogClose}>
        <DialogTitle>Add New Branch</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Branch Name"
            fullWidth
            value={newBranchName}
            onChange={(e) => setNewBranchName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Branch Address"
            fullWidth
            value={newBranchAddress}
            onChange={(e) => setNewBranchAddress(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddBranchDialogClose}>Cancel</Button>
          <Button onClick={handleAddBranchSubmit} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isEditBranchDialogOpen} onClose={handleEditBranchDialogClose}>
        <DialogTitle>Edit Branch</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Branch Name"
            fullWidth
            value={newBranchName}
            onChange={(e) => setNewBranchName(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Branch Address"
            fullWidth
            value={newBranchAddress}
            onChange={(e) => setNewBranchAddress(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditBranchDialogClose}>Cancel</Button>
          <Button onClick={handleEditBranchSubmit} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isDeleteBranchDialogOpen} onClose={handleCloseBranchDeleteDialog}>
        <DialogTitle>Delete Branch</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete this branch?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseBranchDeleteDialog}>Cancel</Button>
          <Button onClick={handleConfirmDeleteBranch} color="primary">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ClinicTable;
