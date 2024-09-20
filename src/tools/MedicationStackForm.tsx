import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container, Paper, TextField, Grid, Button, MenuItem, Typography, Alert, AlertTitle,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, CircularProgress, IconButton
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { useToken } from '../api/Token';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const RootContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: theme.spacing(2),
}));

const TableContainerStyled = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: '80%',
  width: '100%',
  position: 'relative',
}));

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 600,
  width: '100%',
  position: 'absolute',
  left: '50%',
  transform: 'translate(-50%, 0%)', // Center the form horizontally
  transition: 'transform 0.5s ease-in-out',
  zIndex: 1,
}));



const VisibleFormContainer = styled(FormContainer)({
  transform: 'translateX(0%)',
});

const CreateButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: 30,
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
  },
}));

const BackButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  left: 30,
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.secondary.dark,
  },
}));

const MedicationStackForm: React.FC = () => {
  const [serialNO, setSerialNO] = useState('');
  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [medicationPrice, setMedicationPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [active, setActive] = useState<boolean | null>(null);
  const [clinicId, setClinicId] = useState(''); // Assume you get this from PatientForm
  const [branchId, setBranchId] = useState(''); // Assume you get this from PatientForm
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);

  const { accessToken } = useToken();
  const navigate = useNavigate();

  interface Medication {
    id: number;
    serialNO: string;
    medicationName: string;
    dosage: string;
    medicationPrice: number;
    quantity: number;
    active: boolean;
    clinicId: number;
    branchId: number;
  }

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/medication-stocks/getall', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setMedications(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching medications:', error);
        setLoading(false);
      }
    };

    fetchMedications();
  }, [accessToken]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (active === null) {
      setAlert({ type: 'error', message: 'Please select the active status.' });
      return;
    }

    const formData = {
      serialNO,
      medicationName,
      dosage,
      medicationPrice: parseFloat(medicationPrice),
      quantity: parseInt(quantity, 10),
      active,
      clinicId: parseInt(clinicId, 10),
      branchId: parseInt(branchId, 10),
    };

    try {
      const response = await axios.post('http://localhost:8080/api/v1/medication-stocks', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 201) {
        setAlert({ type: 'success', message: 'Medication added successfully!' });
        setSerialNO('');
        setMedicationName('');
        setDosage('');
        setMedicationPrice('');
        setQuantity('');
        setActive(null);
        setClinicId('');
        setBranchId('');
        setTimeout(() => {
          setShowForm(false);
        }, 1000);
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to add medication. Please try again.' });
      console.error('There was an error adding the medication!', error);
    }
  };

  return (
    <RootContainer>
      {!showForm ? (
        <>
          <TableContainerStyled>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Serial Number</TableCell>
                  <TableCell>Medication Name</TableCell>
                  <TableCell>Dosage</TableCell>
                  <TableCell>Medication Price</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Active</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {medications.map((medication) => (
                  <TableRow key={medication.id}>
                    <TableCell>{medication.serialNO}</TableCell>
                    <TableCell>{medication.medicationName}</TableCell>
                    <TableCell>{medication.dosage}</TableCell>
                    <TableCell>{medication.medicationPrice}</TableCell>
                    <TableCell>{medication.quantity}</TableCell>
                    <TableCell>{medication.active ? 'Yes' : 'No'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainerStyled>
          <CreateButton onClick={() => setShowForm(true)}>
            <ArrowForwardIcon />
          </CreateButton>
        </>
      ) : (
        <>
          <BackButton onClick={() => setShowForm(false)}>
            <ArrowBackIcon />
          </BackButton>
          <FormContainer elevation={3}>
            <Typography variant="h5" gutterBottom>
              New Medication Stock Entry
            </Typography>
            {alert.type && (
              <Alert severity={alert.type} onClose={() => setAlert({ type: null, message: '' })}>
                <AlertTitle>{alert.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
                {alert.message}
              </Alert>
            )}
            <form onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Serial Number"
                    variant="outlined"
                    fullWidth
                    value={serialNO}
                    onChange={(e) => setSerialNO(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Medication Name"
                    variant="outlined"
                    fullWidth
                    value={medicationName}
                    onChange={(e) => setMedicationName(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Dosage"
                    variant="outlined"
                    fullWidth
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Medication Price"
                    variant="outlined"
                    fullWidth
                    value={medicationPrice}
                    onChange={(e) => setMedicationPrice(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Quantity"
                    variant="outlined"
                    fullWidth
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Active Status"
                    variant="outlined"
                    select
                    fullWidth
                    value={active !== null ? (active ? 'true' : 'false') : ''}
                    onChange={(e) => setActive(e.target.value === 'true')}
                    required
                  >
                    <MenuItem value="true">Yes</MenuItem>
                    <MenuItem value="false">No</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary" fullWidth>
                    Submit
                  </Button>
                </Grid>
              </Grid>
            </form>
          </FormContainer>
        </>
      )}
    </RootContainer>
  );
};

export default MedicationStackForm;
