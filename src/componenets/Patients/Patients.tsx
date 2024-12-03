import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
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
import SearchIcon from '@mui/icons-material/Search';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import TimelineIcon from '@mui/icons-material/Timeline';
interface LongMenuProps {
  handleViewDetails: (e: React.MouseEvent<HTMLElement>) => void; // Update to accept an event
  handleEdit: (e: React.MouseEvent<HTMLElement>) => void; // Update to accept an event
  handleDelete: (e: React.MouseEvent<HTMLElement>) => void; // Update to accept an event
}


interface Patient {
  id: number;
  name: string;
  age: number;
  medicalHistory: string;
  bloodGroup: string;
  phoneNumber: number;
  createdDate: string;
  clinicId: number;
  branchId: number;
  patientToken: string;
  imageUrl: string;
  appointmentDate: string; 
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
  
const AnimatedPaper = motion(Paper);
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
  const handleSearch = () => {
    const filteredPatients = patients.filter(patient => 
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phoneNumber.toString().includes(searchTerm) || // Ensure phone number is a string
      patient.bloodGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.patientToken.toLowerCase().includes(searchTerm.toLowerCase())
     
    );
    setPatients(filteredPatients);
    // Update your state with filteredPatients or perform other actions
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
        patient.phoneNumber.toString().includes(searchTerm) 
       
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
     <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
  <Typography variant="h4" gutterBottom>
    Patients
  </Typography>
  
  {/* <Fab
    color="primary"
    aria-label="add"
    onClick={handleFabClick}
    sx={{ 
      position: 'relative', // Relative so it stays in line with the content
      zIndex: 1000 // Keeps it above other content if needed
    }}
    component={motion.div}
  >
    <AddIcon />
  </Fab> */}
</Box>

      <Grid container spacing={3} sx={{ mt: 2 }}>
  <Grid item xs={12} sm={6} md={4}>
    <AnimatedPaper
      elevation={5}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      sx={{
        p: 3,
        height: '100%',
        background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
        color: '#fff',
        borderRadius: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Total Patients
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>
          {patients.length}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
          Total patients today
        </Typography>
      </Box>
      <Avatar sx={{ bgcolor: '#fff', color: '#1e3c72', width: 56, height: 56 }}>
        <PeopleIcon fontSize="large" />
      </Avatar>
    </AnimatedPaper>
  </Grid>

  <Grid item xs={12} sm={6} md={4}>
    <AnimatedPaper
      elevation={5}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      sx={{
        p: 3,
        height: '100%',
        background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
        color: '#fff',
        borderRadius: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Monthly Patients
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>
          {monthlyPatients}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
          Total patients this month
        </Typography>
      </Box>
      <Avatar sx={{ bgcolor: '#fff', color: '#11998e', width: 56, height: 56 }}>
        <EventIcon fontSize="large" />
      </Avatar>
    </AnimatedPaper>
  </Grid>

  <Grid item xs={12} sm={6} md={4}>
    <AnimatedPaper
      elevation={5}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      sx={{
        p: 3,
        height: '100%',
        background: 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)',
        color: '#fff',
        borderRadius: '15px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Yearly Patients
        </Typography>
        <Typography variant="h3" sx={{ fontWeight: 'bold', mt: 1 }}>
          {yearlyPatients}
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
          Total patients this year
        </Typography>
      </Box>
      <Avatar sx={{ bgcolor: '#fff', color: '#f7971e', width: 56, height: 56 }}>
        <TimelineIcon fontSize="large" />
      </Avatar>
    </AnimatedPaper>
  </Grid>
</Grid>

    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 4 }}>
      <Grid container spacing={3} alignItems="center">
      <Grid item>
          <TextField
            label="Search by Name, Phone, Blood Group"
            value={searchTerm}
            onChange={handleSearchChange}
            
            variant="outlined"
            size="small"
            InputProps={{
              endAdornment: (
                <IconButton onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
              ),
            }}
            sx={{
              width: 400, // Adjusted width for longer search input
              backgroundColor: '#fff',
              borderRadius: 1,
              boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
            }}
          />
        </Grid>

        <Grid item>
          <TextField
            label="Patient Token"
            value={patientTokenSearchTerm}
            onChange={handlePatientTokenSearchChange}
            variant="outlined"
            size="small"
            sx={{
              width: 200,
              backgroundColor: '#fff',
              borderRadius: 1,
              boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
            }}
          />
        </Grid>

        <Grid item>
          <TextField
            label="Sort By"
            value={sortBy}
            onChange={handleSortByChange}
            select
            variant="outlined"
            size="small"
            sx={{
              width: 150,
              backgroundColor: '#fff',
              borderRadius: 1,
              boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
            }}
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
            variant="outlined"
            size="small"
            sx={{
              width: 180,
              backgroundColor: '#fff',
              borderRadius: 1,
              boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
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
            variant="outlined"
            size="small"
            sx={{
              width: 180,
              backgroundColor: '#fff',
              borderRadius: 1,
              boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
            }}
          />
        </Grid>

        <Grid item>
          <Button
            variant="contained"
            color="primary"
            startIcon={<FilterListIcon />}
            onClick={handleFilterClick}
            sx={{
              backgroundColor: '#1976d2',
              borderRadius: 2,
              padding: '6px 16px',
              boxShadow: '0px 3px 6px rgba(0, 0, 0, 0.1)',
              transition: 'background-color 0.3s ease',
              '&:hover': {
                backgroundColor: '#1565c0',
              },
            }}
          >
            Filter
          </Button>
        </Grid>
      </Grid>
    </Box>
    <motion.div
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1.5 }}
>
  <TableContainer
    component={Paper}
    sx={{
      mt: 4,
      maxHeight: '400px',
      borderRadius: 3,
      boxShadow: '0px 6px 15px rgba(0, 0, 0, 0.2)',
      overflow: 'hidden',
    }}
  >
    <Table stickyHeader>
      <TableHead>
        <TableRow>
          {[
            'ID',
            'Name',
            'Age',
            'Medical History',
            'Blood Group',
            'Phone Number',
            'New Appointment',
            'Patient Token',
          ].map((header) => (
            <TableCell
              key={header}
              sx={{
                backgroundColor: '#004d40', // Solid dark teal color for visibility
                color: '#ffffff', // White text for high contrast
                fontWeight: 'bold',
                textAlign: 'center',
                textTransform: 'uppercase',
                fontSize: '14px',
                letterSpacing: '0.05em',
                padding: '12px',
                '&:first-of-type': { borderTopLeftRadius: '15px' },
                '&:last-of-type': { borderTopRightRadius: '15px' },
              }}
              
            >
              {header}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {filteredPatients.map((patient) => (
          <TableRow
            key={patient.id}
            sx={{
              '&:nth-of-type(odd)': { backgroundColor: '#f5f5f5' },
              '&:nth-of-type(even)': { backgroundColor: '#e8f5e9' },
              '&:hover': {
                backgroundColor: '#d0f0e1',
                transform: 'scale(1.01)',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease-in-out',
              },
            }}
            component={Link} // Converts TableRow into a clickable link
            to={`/patient-details/${patient.id}`}
            style={{ textDecoration: 'none' }} // Prevents underline in links
          >
            <TableCell align="center" sx={{ fontWeight: 'medium', fontSize: '13px' }}>
              {patient.id}
            </TableCell>
            <TableCell>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 'bold',
                    color: '#00796b',
                    '&:hover': { textDecoration: 'underline' },
                  }}
                >
                  {patient.name}
                </Typography>
              </Box>
            </TableCell>
            <TableCell align="center" sx={{ fontSize: '13px' }}>
              {patient.age}
            </TableCell>
            <TableCell align="center" sx={{ fontSize: '13px' }}>{patient.medicalHistory}</TableCell>
            <TableCell align="center" sx={{ fontSize: '13px' }}>
              {patient.bloodGroup}
            </TableCell>
            <TableCell align="center" sx={{ fontSize: '13px' }}>
              {patient.phoneNumber}
            </TableCell>
            <TableCell align="center" sx={{ fontSize: '13px'  }}>
              {format(new Date(patient.appointmentDate), 'yyyy-MM-dd')}
            </TableCell>
            <TableCell align="center" sx={{ fontSize: '13px' }}>
              {patient.patientToken}
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
  

    </Box>
  );
};

export default Patients;