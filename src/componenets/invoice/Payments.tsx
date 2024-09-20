import React, { useEffect, useState } from 'react';
import {
  Typography,
  Grid,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useToken } from '../../api/Token';
import jsPDF from 'jspdf';
import './Payments.css';
import 'jspdf-autotable';

import 'jspdf-autotable';

interface Medication {
  id: number;
  medicationName: string;
  dosage: string;
  medicationPrice: number;
  quantity: number;
  instructions: string;
}

interface MedicalRecord {
  id: number;
  doctorId: number;
  patientId: number;
  doctorFirstName: string;
  patientName: string;
  complains: string;
  paymentStatus: string;
  clinicName: string;
  branchName: string;
  diagnosis: string;
  visitDate: string;
  vitalSigns: string;
  amount: number;
  treatment: string;
  clinicId: number;
  branchId: number;
  medications: Medication[];
}

const Payments: React.FC = () => {
  const { patientId } = useParams<{ patientId: string }>();
  const [record, setRecord] = useState<MedicalRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const { accessToken } = useToken();

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/v1/medical-records/patient/unpaid/${patientId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setRecord(response.data);
        console.log('Fetched unpaid medical record:', response.data);
      } catch (error) {
        console.error('Error fetching unpaid medical record:', error);
        if (axios.isAxiosError(error) && error.response) {
          if (error.response.status === 404) {
            setErrorMessage("No unpaid medical records found for this patient.");
          } else {
            setErrorMessage("An error occurred while fetching the medical record.");
          }
        } else {
          setErrorMessage("Network error or server is not reachable.");
        }
      }
    };

    if (patientId && accessToken) {
      fetchRecord();
    }
  }, [patientId, accessToken]);

  const handlePayment = () => {
    setOpenDialog(true);
  };

  const confirmPayment = async () => {
    setOpenDialog(false);

    if (!record) return;

    try {
      // Making the PATCH request to update the payment status
      const response = await axios.patch(
        `http://localhost:8080/api/v1/medical-records/${record.id}/payment-status`,
        { paymentStatus: 'paid' },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        setPaymentSuccess(true);
        setSuccessMessage("Payment was successful!");

        // Generate the PDF
        generatePDF();
      } else {
        setErrorMessage("Failed to update payment status.");
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      setErrorMessage("An error occurred while updating the payment status.");
    }
  };


  
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 10; // Margin from the edges
    const lineHeight = 10; // Line height for the content
    let yPosition = margin + 50; // Initial y position
  
    // Add logo
    const logo = '../../src/assets/eye.png';
    doc.addImage(logo, 'PNG', 25, 30, 50, 25);
  
    // Title
    doc.setFontSize(20);
    doc.setTextColor('#3f51b5'); // Blue color
    doc.text("Well Nest Invoice Report", margin + 10, yPosition);
    yPosition += lineHeight * 2;
  
    // Date
    doc.setFontSize(12);
    doc.setTextColor('#000000'); // Black color
    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - 60 - margin, margin + 20);
  
    // From and To Sections
    doc.setFontSize(14);
    doc.setTextColor('#4caf50'); // Green color
    doc.text("From:", margin + 10, yPosition);
    doc.text("To:", margin + 100, yPosition);
  
    yPosition += lineHeight;
  
    doc.setFontSize(12);
    doc.setTextColor('#000000'); // Black color
    doc.text(`Clinic: ${record?.clinicName}`, margin + 10, yPosition);
    doc.text(`Branch: ${record?.branchName}`, margin + 10, yPosition + lineHeight);
    doc.text(`Patient: ${record?.patientName}`, margin + 100, yPosition);
    doc.text(`Diagnosis: ${record?.diagnosis}`, margin + 100, yPosition + lineHeight);
    // doc.text(`Treatment: ${record?.treatment}`, margin + 100, yPosition + lineHeight * 2);
    doc.text(`Visit Date: ${new Date(record?.visitDate!).toLocaleDateString()}`, margin + 100, yPosition + lineHeight * 3);
  
    yPosition += lineHeight * 4;
  
    // Payment Details
    doc.setFontSize(14);
    doc.setTextColor('#4caf50'); // Green color
    doc.text("Payment Details:", margin + 10, yPosition);
  
    yPosition += lineHeight;
  
    doc.setFontSize(12);
    doc.setTextColor('#000000'); // Black color
    doc.text(`Amount: ${record?.amount?.toFixed(2) || '0.00'}`, margin + 10, yPosition);
    doc.text(`Discount: 50 RS`, margin + 10, yPosition + lineHeight);
    doc.text(`Tax: 4.90`, margin + 10, yPosition + lineHeight * 2);
    doc.text(`Grand Total: ${(record?.amount! - 50 + 4.90).toFixed(2)}`, margin + 10, yPosition + lineHeight * 3);
  
    yPosition += lineHeight * 4;
  
    // Medication Details
    doc.setFontSize(14);
    doc.setTextColor('#4caf50'); // Green color
    doc.text("Medication Details:", margin + 10, yPosition);
  
    yPosition += lineHeight;
  
    doc.setFontSize(12);
    doc.setTextColor('#000000'); // Black color
    record?.medications.forEach((medication, index) => {
      if (yPosition + lineHeight * 5 > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
  
      doc.text(`Item: ${medication.medicationName}`, margin + 10, yPosition);
      doc.text(`Price: ${medication.medicationPrice}`, margin + 10, yPosition + lineHeight);
      doc.text(`Quantity: ${medication.quantity}`, margin + 10, yPosition + lineHeight * 2);
      doc.text(`Amount: ${(medication.medicationPrice * medication.quantity).toFixed(2)}`, margin + 10, yPosition + lineHeight * 3);
      doc.text(`Instructions: ${medication.instructions}`, margin + 10, yPosition + lineHeight * 4);
  
      yPosition += lineHeight * 5;
    });
  
    // Footer
    if (yPosition + lineHeight * 3 > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }
  
    doc.setFontSize(10);
    doc.setTextColor('#000000'); // Black color
    doc.text("Thank you for your payment!", margin + 10, yPosition);
    doc.text("If you have any questions, please contact us.", margin + 10, yPosition + lineHeight);
  
    // Draw border around the entire page
    doc.setDrawColor(0, 0, 0); // Black color for the border
    doc.setLineWidth(1);
    doc.rect(margin, margin, pageWidth - 2 * margin, pageHeight - 2 * margin);
  
    // Save the PDF
    doc.save('payment_receipt.pdf');
  };
  
  
  
  

  if (errorMessage) {
    return <Typography variant="body1" color="error">{errorMessage}</Typography>;
  }

  if (!record) {
    return <Typography variant="body1">Loading...</Typography>;
  }

  return (
    <Paper className="paper-container">
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <img
            src="../../src/assets/eye.png"
            alt="Logo"
            style={{
              width: '200px',
              height: '200px',
              filter: 'drop-shadow(10px 0px 10px #6265BF)',
            }}
          />
        </Grid>
        <Grid item xs={6} style={{ textAlign: 'right' }}>
          <Typography variant="body1" margin={12}>
            Date: {new Date().toLocaleDateString()}
          </Typography>
        </Grid>
      </Grid>
      <Typography variant="h4" gutterBottom>
        {paymentSuccess ? 'Payment Successfully Completed' : 'Unpaid Payments'}
      </Typography>
      <div style={{ marginBottom: '30px' }}>
        <Grid container spacing={2} style={{ marginTop: '20px' }}>
          <Grid item xs={6}>
            <Paper className="paper-section">
              <Typography variant="h6">From:</Typography>
              <Typography variant="body1">Clinic: {record.clinicName}</Typography>
              <Typography variant="body1">Branch: {record.branchName}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper className="paper-section">
              <Typography variant="h6">To:</Typography>
              <Typography variant="body1">Patient: {record.patientName}</Typography>
              <Typography variant="body1">Diagnosis: {record.diagnosis}</Typography>
              <Typography variant="body1">Treatment: {record.treatment}</Typography>
              <Typography variant="body1">Visit Date: {new Date(record.visitDate).toLocaleDateString()}</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <TableContainer component={Paper} className="table-container">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item</TableCell>
                    <TableCell>Item Price</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Instructions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {record.medications?.map((medication) => (
                    <TableRow key={medication.id}>
                      <TableCell>{medication.medicationName}</TableCell>
                      <TableCell>{medication.medicationPrice}</TableCell>
                      <TableCell>{medication.quantity}</TableCell>
                      <TableCell>{medication.medicationPrice * medication.quantity}</TableCell>
                      <TableCell>{medication.instructions}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12}>
            <Paper className="payment-summary">
              <Typography variant="body1">Paid by: IND</Typography>
              <Typography variant="body1">Currency: INR</Typography>
              <Typography variant="body1">Subtotal: {record.amount}</Typography>
              <Typography variant="body1">Discount: 50 RS</Typography>
              <Typography variant="body1">Tax: 4.90</Typography>
              <Typography variant="h6">Grand Total: {record.amount - 50 + 4.90}</Typography>
              {!paymentSuccess && (
                <Button variant="contained" color="primary" onClick={handlePayment} style={{ marginTop: '20px' }}>
                  Pay
                </Button>
              )}
            </Paper>
          </Grid>
        </Grid>
      </div>
      {successMessage && (
        <Snackbar
          open={true}
          autoHideDuration={6000}
          onClose={() => setSuccessMessage(null)}
          message={successMessage}
        />
      )}

      {/* Payment Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      >
        <DialogTitle>Confirm Payment</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to proceed with the payment?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="primary">
            No
          </Button>
          <Button onClick={confirmPayment} color="primary" autoFocus>
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Payments;
