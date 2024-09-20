import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Grid,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import axios from 'axios';
import { useToken } from '../../api/Token';
import FilterListIcon from '@mui/icons-material/FilterList';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { motion } from 'framer-motion';

interface MedicalRecord {
  id: number;
  doctorId: number;
  patientId: number;
  doctorFirstName: string;
  paymentStatus: string;
  patientName: string;
  complains: string;
  diagnosis: string;
  visitDate: string;
  vitalSigns: string;
  amount: number;
  treatment: string;
  clinicId: number;
  branchId: number;
  medications: {
    id: number;
    medicationName: string;
    dosage: string;
    medicationPrice: number;
    quantity: number;
    instructions: string;
    clinicId: number;
    branchId: number;
  }[];
}

const Invoices: React.FC = () => {
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [todayPayment, setTodayPayment] = useState(0);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [yearlyPayment, setYearlyPayment] = useState(0);
  const { accessToken } = useToken();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMedicalRecords = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/medical-records', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setMedicalRecords(response.data);

        // Calculate payments
        const today = new Date();
        const todayPayments = response.data.reduce((acc: number, record: MedicalRecord) => {
          const visitDate = new Date(record.visitDate);
          if (visitDate.toDateString() === today.toDateString()) {
            return acc + record.amount;
          }
          return acc;
        }, 0);

        const monthlyPayments = response.data.reduce((acc: number, record: MedicalRecord) => {
          const visitDate = new Date(record.visitDate);
          if (visitDate.getMonth() === today.getMonth() && visitDate.getFullYear() === today.getFullYear()) {
            return acc + record.amount;
          }
          return acc;
        }, 0);

        const yearlyPayments = response.data.reduce((acc: number, record: MedicalRecord) => {
          const visitDate = new Date(record.visitDate);
          if (visitDate.getFullYear() === today.getFullYear()) {
            return acc + record.amount;
          }
          return acc;
        }, 0);

        setTodayPayment(todayPayments);
        setMonthlyPayment(monthlyPayments);
        setYearlyPayment(yearlyPayments);

      } catch (err) {
        console.error('Failed to fetch medical records', err);
      }
    };

    fetchMedicalRecords();
  }, [accessToken]);

  const handlePaymentClick = (patientId: number) => {
    navigate(`/payments/${patientId}/unpaid`);
  };

  const handleViewClick = (patientId: number) => {
    navigate(`/payments/${patientId}/paid`);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredData = medicalRecords.filter((invoice) => {
    if (filterStatus === 'all' && searchTerm === '') return true;
    return (
      invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterStatus === 'all' || invoice.paymentStatus === filterStatus)
    );
  });

  const handleFilterClick = () => {
    // Implement filtering logic here if needed
  };

  return (
    <div>
      <Box sx={{ padding: 1 }}>
        <Typography variant="h4" gutterBottom>
          Invoices
        </Typography>
        <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
  <motion.div
    initial={{ x: '-100vw' }}
    animate={{ x: 0 }}
    transition={{ type: 'spring', stiffness: 120 }}
  >
    <Paper
      elevation={4}
      sx={{
        p: 4,
        height: '100%',
        borderRadius: '12px',
        backgroundColor: '#f3f6f9',
        textAlign: 'center',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c387e' }}>
          Today's Payment
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50', mt: 2 }}>
          ${todayPayment}
        </Typography>
      </Box>
    </Paper>
  </motion.div>
</Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Paper elevation={4} sx={{ p: 4, height: '100%', borderRadius: '12px', backgroundColor: '#f3f6f9', textAlign: 'center', boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c387e' }}>Monthly Payment</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff9800', mt: 2 }}>${monthlyPayment}</Typography>
          </Box>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
  <motion.div
    initial={{ x: '100vw' }}
    animate={{ x: 0 }}
    transition={{ type: 'spring', stiffness: 120 }}
  >
    <Paper
      elevation={4}
      sx={{
        p: 4,
        height: '100%',
        borderRadius: '12px',
        backgroundColor: '#f3f6f9',
        textAlign: 'center',
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c387e' }}>
          Yearly Payment
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50', mt: 2 }}>
          ${yearlyPayment}
        </Typography>
      </Box>
    </Paper>
  </motion.div>
</Grid>
    </Grid>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 3 }}>
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <TextField
                  label="Search Patient"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </Grid>
              <Grid item>
                <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                  <InputLabel id="payment-status-filter-label">Payment Status</InputLabel>
                  <Select
                    labelId="payment-status-filter-label"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    label="Payment Status"
                  >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="paid">Paid</MenuItem>
                    <MenuItem value="unpaid">Unpaid</MenuItem>
                  </Select>
                </FormControl>
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
      </Box>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 2 }}
        transition={{ duration: 1.5 }}
      >
        <TableContainer component={Paper}>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Patient Name</TableCell>
                <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Diagnosis</TableCell>
                <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Visit Date</TableCell>
                <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Payment Status</TableCell>
                <TableCell style={{ backgroundColor: '#e0f7fa', fontWeight: 'bold' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>{record.patientName}</TableCell>
                  <TableCell>{record.diagnosis}</TableCell>
                  <TableCell>{new Date(record.visitDate).toLocaleDateString()}</TableCell>
                  <TableCell>{record.paymentStatus}</TableCell>
                  <TableCell>
                    {record.paymentStatus === 'unpaid' ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handlePaymentClick(record.patientId)}
                      >
                        Pay
                      </Button>
                    ) : (
                      <CheckCircleIcon color="success" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </motion.div>
    </div>
  );
};

export default Invoices;
