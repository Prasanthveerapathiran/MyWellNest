import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Alert, AlertTitle } from '@mui/material';
import { useToken } from '../../api/Token';

interface Transaction {
  patientName: string;
  visitDate: string;
  amount: number;
  paymentStatus: string;
}

const RecentTransaction: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const { accessToken } = useToken();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/medical-records', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setTransactions(response.data);
      } catch (error) {
        setAlert({ type: 'error', message: 'Failed to fetch transactions' });
        console.error('Error fetching transactions:', error);
      }
    };

    fetchTransactions();
  }, [accessToken]);

  return (
    <Box sx={{  height: '100%', padding: 2 }}>
      {alert.type && (
        <Alert severity={alert.type}>
          <AlertTitle>{alert.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
          {alert.message}
        </Alert>
      )}
      <Typography variant="h5" gutterBottom>
        Recent Transactions
      </Typography>
      <TableContainer component={Paper} sx={{ maxHeight: 400 }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow sx={{ bgcolor: '#1976d2' }}>
              <TableCell sx={{ bgcolor: '#55C1FF' }}>Patient Name</TableCell>
              <TableCell sx={{ bgcolor: '#55C1FF' }}>Visit Date</TableCell>
              <TableCell sx={{ bgcolor: '#55C1FF' }}>Amount</TableCell>
              <TableCell sx={{ bgcolor: '#55C1FF' }}>Payment Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
  {transactions.map((transaction) => (
    <TableRow key={transaction.patientName + transaction.visitDate}>
      <TableCell>{transaction.patientName}</TableCell>
      <TableCell>{new Date(transaction.visitDate).toLocaleDateString()}</TableCell>
      <TableCell>{transaction.amount}</TableCell>
      <TableCell
        sx={{
          color: transaction.paymentStatus.toLowerCase() === 'paid' ? 'blue' : 'red',
        }}
      >
        {transaction.paymentStatus}
      </TableCell>
    </TableRow>
  ))}
</TableBody>

        </Table>
      </TableContainer>
    </Box>
  );
};

export default RecentTransaction;
