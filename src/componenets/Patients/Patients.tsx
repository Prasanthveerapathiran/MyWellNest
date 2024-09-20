import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Typography,
  Box,
  Grid,
  Container,
  CssBaseline,
  TextField,
  MenuItem,
  Button,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  IconButton,
  Menu,
  ListItemIcon,
  ListItemText,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import FilterListIcon from '@mui/icons-material/FilterList';
import { format, isAfter, isBefore } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { useToken } from '../../api/Token';
import LongMenu from '../../tools/LongMenu';
import { motion } from 'framer-motion'; // Import motion


interface Patient {
  id: number;
  name: string;
  age: number;
  medicalHistory: string;
  bloodGroup: string;
  phoneNumber: string;
  createdDate: string;
  clinicId: number;
  branchId: number;
  patientToken: string;
  imageUrl: string;
}
const bloodGroups = [
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' },
];

const Patients: React.FC = () => {
  const { accessToken } = useToken();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [patientTokenSearchTerm, setPatientTokenSearchTerm] = useState<string>('');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [clinicId, setClinicId] = useState<number | null>(null);
  const [branchId, setBranchId] = useState<number | null>(null);
  const [monthlyPatients, setMonthlyPatients] = useState<number>(0);
  const [yearlyPatients, setYearlyPatients] = useState<number>(0);
  const [editPatientId, setEditPatientId] = useState<number | null>(null);
  const [editPatientData, setEditPatientData] = useState<Patient | null>(null);
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const navigate = useNavigate();
    console.log(clinicId);
    console.log(branchId);
    
  useEffect(() => {
    if (accessToken) {
      axios
        .get('http://localhost:8080/api/v1/patients', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          setPatients(response.data);
          calculateMonthlyAndYearlyPatients(response.data);
          if (response.data.length > 0) {
            setClinicId(response.data[0].clinicId);
            setBranchId(response.data[0].branchId);
          }
        })
        .catch((error) => {
          console.error('Error fetching patients:', error);
        });
    }
  }, [accessToken]);

  const calculateMonthlyAndYearlyPatients = (patients: Patient[]) => {
    // Calculate monthly patients
    const currentDate = new Date();
    const currentMonthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const monthlyPatientsCount = patients.filter((patient) => {
      const createdDate = new Date(patient.createdDate);
      return isAfter(createdDate, currentMonthStart);
    }).length;
    setMonthlyPatients(monthlyPatientsCount);

    // Calculate yearly patients
    const currentYearStart = new Date(currentDate.getFullYear(), 0, 1);
    const yearlyPatientsCount = patients.filter((patient) => {
      const createdDate = new Date(patient.createdDate);
      return isAfter(createdDate, currentYearStart);
    }).length;
    setYearlyPatients(yearlyPatientsCount);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSortByChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSortBy(event.target.value);
  };

  const handleFromDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFromDate(event.target.value);
  };

  const handleToDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToDate(event.target.value);
  };

  const handlePatientTokenSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPatientTokenSearchTerm(event.target.value);
  };

  const handleFabClick = () => {
    navigate('/patient-form');
  };

  const handleFilterClick = () => {
    console.log('Filter button clicked');
  };

  const handleEdit = (patient: Patient) => {
    setEditPatientId(patient.id);
    setEditPatientData(patient);
    setOpenUpdateDialog(true); // Open the update dialog
  };

  const handleEditChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (editPatientData) {
      setEditPatientData({
        ...editPatientData,
        [event.target.name]: event.target.value,
      });
    }
  };

  const handleSaveEdit = (id: number) => {
    if (editPatientData) {
      axios
        .put(`http://localhost:8080/api/v1/patients/${id}`, editPatientData, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          setPatients((prevPatients) =>
            prevPatients.map((patient) =>
              patient.id === id ? response.data : patient
            )
          );
          setEditPatientId(null);
          setEditPatientData(null);
          setOpenUpdateDialog(false); // Close the update dialog after saving
        })
        .catch((error) => {
          console.error('Error updating patient:', error);
        });
    }
  };

  const handleDelete = (id: number) => {
    axios
      .delete(`http://localhost:8080/api/v1/patients/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then(() => {
        setPatients((prevPatients) =>
          prevPatients.filter((patient) => patient.id !== id)
        );
      })
      .catch((error) => {
        console.error('Error deleting patient:', error);
      });
  };

  const handleViewDetails = (id: number) => {
    navigate(`/patient-details/${id}`);
  };

  const open = Boolean(anchorEl);

  const filteredPatients = patients
  .filter((patient) => {
    if (patientTokenSearchTerm) {
      return typeof patient.patientToken === 'string' && patient.patientToken.includes(patientTokenSearchTerm);
    }
    if (searchTerm) {
      return (
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.bloodGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (typeof patient.phoneNumber === 'string' && patient.phoneNumber.includes(searchTerm))
      );
    }
    return true;
  })
  .filter((patient) => {
    if (fromDate && toDate) {
      const createdDate = new Date(patient.createdDate);
      return isAfter(createdDate, new Date(fromDate)) && isBefore(createdDate, new Date(toDate));
    }
    return true;
  })
  .sort((a, b) => {
    if (sortBy === 'new') {
      return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
    }
    if (sortBy === 'old') {
      return new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime();
    }
    return 0;
  });

 // Define the jump animation
 const jumpAnimation = {
  initial: { y: 0 },
  animate: { 
    y: [0, -20, 0], // Jump effect
    transition: { 
      y: { 
        repeat: Infinity, 
        repeatType: 'reverse', 
        duration: 0.7 
      } 
    } 
  },
  whileHover: { 
    y: 0, // Stop jumping effect on hover
    transition: { duration: 0.1 }
  },
  whileTap: {
    scale: 0.9,
    transition: { duration: 0.1 }
  }
};
  return (
    <Box sx={{ padding: 1 }}>
      <Typography variant="h4" gutterBottom>
        Patients
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
        
            <Typography variant="h6">Total Patients</Typography>
            <Typography variant="h4">{patients.length}</Typography>
            <Typography variant="body2">Total patients today</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6">Monthly Patients</Typography>
            <Typography variant="h4">{monthlyPatients}</Typography>
            <Typography variant="body2">Total patients this month</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6">Yearly Patients</Typography>
            <Typography variant="h4">{yearlyPatients}</Typography>
            <Typography variant="body2">Total patients this year</Typography>
          </Paper>
        </Grid>
      </Grid>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 3 }}>
      <Box sx={{ mt: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <TextField
            label="Search"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Grid>
        <Grid item>
          <TextField
            label="Patient Token"
            value={patientTokenSearchTerm}
            onChange={handlePatientTokenSearchChange}
          />
        </Grid>
        <Grid item>
          <TextField
            label="Sort By"
            value={sortBy}
            onChange={handleSortByChange}
            select
            sx={{ width: 150 }}
          >
            <MenuItem value="new">New</MenuItem>
            <MenuItem value="old">Old</MenuItem>
          </TextField>
        </Grid>
        <Grid item>
          <TextField
            label="From"
            type="date"
            value={fromDate}
            onChange={handleFromDateChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item>
          <TextField
            label="To"
            type="date"
            value={toDate}
            onChange={handleToDateChange}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Grid>
        <Grid item>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<FilterListIcon />}
            onClick={handleFilterClick}
          >
            Filter
          </Button>
        </Grid>
      </Grid>
    </Box>
</Box>
<motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 2 }}
        transition={{ duration: 1.5 }}
      >

       <TableContainer component={Paper}  style={{ marginTop: '30px', maxHeight: '350px' }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell  style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Name</TableCell>
              <TableCell  style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Age</TableCell>
              <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Medical History</TableCell>
              <TableCell  style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Blood Group</TableCell>
              <TableCell  style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Phone Number</TableCell>
              <TableCell  style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Created Date</TableCell>
              <TableCell  style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Patient Token</TableCell>
              <TableCell  style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {filteredPatients.map((patient) => (
    <TableRow key={patient.id}>
      <TableCell>{patient.id}</TableCell>
      <TableCell>
  <Box sx={{ display: 'flex', alignItems: 'center' }}>
    {/* <Avatar
      alt={patient.name}
      src={`data:image/jpeg;base64,${patient.imageUrl}`} // Add MIME type prefix to the base64 string
      sx={{ width: 40, height: 40, ml: 2, marginRight: 2 }}
    /> */}
    <Typography variant="body1">{patient.name}</Typography>
  </Box>
</TableCell>


      <TableCell>{patient.age}</TableCell>
      <TableCell>{patient.medicalHistory}</TableCell>
      <TableCell>{patient.bloodGroup}</TableCell>
      <TableCell>{patient.phoneNumber}</TableCell>
      <TableCell>{format(new Date(patient.createdDate), 'dd-MM-yyyy')}</TableCell>
      <TableCell>{patient.patientToken}</TableCell>
      <TableCell align="center">
        <LongMenu
          handleViewDetails={() => handleViewDetails(patient.id)}
          handleEdit={() => handleEdit(patient)}
          handleDelete={() => handleDelete(patient.id)}
        />
      </TableCell>
    </TableRow>
  ))}
</TableBody>


        </Table>
      </TableContainer>

      </motion.div>
    
      <Dialog open={openUpdateDialog} onClose={() => setOpenUpdateDialog(false)}>
        <DialogTitle>Edit Patient</DialogTitle>
        <DialogContent>
        <TextField
        margin="dense"
        name="name"
        label="Name"
        type="text"
        fullWidth
        value={editPatientData?.name || ''}
        onChange={handleEditChange}
        required  // Make the field mandatory
      />
      <TextField
        margin="dense"
        name="age"
        label="Age"
        type="number"
        fullWidth
        value={editPatientData?.age || ''}
        onChange={handleEditChange}
        required  // Make the field mandatory
      />
      <TextField
        margin="dense"
        name="medicalHistory"
        label="Medical History"
        type="text"
        fullWidth
        value={editPatientData?.medicalHistory || ''}
        onChange={handleEditChange}
        required  // Make the field mandatory
      />
      <TextField
        margin="dense"
        name="bloodGroup"
        select  // Use select for dropdown
        label="Blood Group"
        fullWidth
        value={editPatientData?.bloodGroup || ''}
        onChange={handleEditChange}
        required  // Make the field mandatory
      >
        {bloodGroups.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        margin="dense"
        name="phoneNumber"
        label="Phone Number"
        type="text"
        fullWidth
        value={editPatientData?.phoneNumber || ''}
        onChange={handleEditChange}
        required  // Make the field mandatory
      />
      <TextField
        margin="dense"
        name="patientToken"
        label="Patient Token"
        type="text"
        fullWidth
        value={editPatientData?.patientToken || ''}
        onChange={handleEditChange}
        required  // Make the field mandatory
      />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdateDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleSaveEdit(editPatientId!)} color="primary">
            Save
          </Button>
          
        </DialogActions>
      </Dialog>
      <Fab
  color="primary"
  aria-label="add"
  onClick={handleFabClick}
  sx={{ position: 'fixed', bottom: 16, right: 16 }}
  component={motion.div}
  variants={jumpAnimation}
  initial="initial"
  animate="animate"
  whileHover="whileHover"
  whileTap="whileTap"
>
  <AddIcon />
</Fab>
    </Box>
  );
};

export default Patients;
