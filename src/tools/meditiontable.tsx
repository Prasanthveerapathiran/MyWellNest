import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import MedicationStackForm from './MedicationStackForm';
interface MedicationStock {
    serialNO: string;
    medicationName: string;
    dosage: string;
    medicationPrice: number;
    quantity: number;
    active: boolean;
    clinicId: number;
    branchId: number;
  }

const MeditionTable: React.FC = () => {

  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const [medicationStocks, setMedicationStocks] = useState<MedicationStock[]>([]);

  useEffect(() => {
    const fetchMedicationStocks = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/medication-stocks/getall', {
          headers: {
            Authorization: `Bearer YOUR_ACCESS_TOKEN`,
          },
        });
        setMedicationStocks(response.data);
      } catch (error) {
        console.error('Failed to fetch medication stocks', error);
      }
    };

    fetchMedicationStocks();
  }, []);

  const handleCreateClick = () => {
    setShowForm(true);
  };

  const handleBackClick = () => {
    setShowForm(false);
  };

  return (
    <div>
      {showForm ? (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          transition={{ type: 'spring', stiffness: 50, damping: 10 }}
        >
          <Button variant="contained" color="secondary" onClick={handleBackClick}>
            ← Back to Table
          </Button>
          <MedicationStackForm />
        </motion.div>
      ) : (
        <motion.div
          initial={{ x: 0 }}
          animate={{ x: '-100%' }}
          transition={{ type: 'spring', stiffness: 50, damping: 10 }}
        >
          <Button variant="contained" color="primary" style={{ float: 'right' }} onClick={handleCreateClick}>
            Create
          </Button>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Serial No</TableCell>
                  <TableCell>Medication Name</TableCell>
                  <TableCell>Dosage</TableCell>
                  <TableCell>Medication Price</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Active</TableCell>
                  <TableCell>Clinic ID</TableCell>
                  <TableCell>Branch ID</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {medicationStocks.map((stock) => (
                  <TableRow key={stock.serialNO}>
                    <TableCell>{stock.serialNO}</TableCell>
                    <TableCell>{stock.medicationName}</TableCell>
                    <TableCell>{stock.dosage}</TableCell>
                    <TableCell>{stock.medicationPrice}</TableCell>
                    <TableCell>{stock.quantity}</TableCell>
                    <TableCell>{stock.active ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{stock.clinicId}</TableCell>
                    <TableCell>{stock.branchId}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </motion.div>
      )}
    </div>
  );
};

export default MeditionTable;
