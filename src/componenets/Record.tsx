import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SignatureCanvas from 'react-signature-canvas';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf'; // Import jsPDF
import { Viewer, Worker } from '@react-pdf-viewer/core'; // Import Viewer for PDF preview
import '@react-pdf-viewer/core/lib/styles/index.css'; // PDF Viewer styles
import {  FormControlLabel, Checkbox, FormGroup } from '@mui/material';

import {
  Container,
  Paper,
  TextField,
  Grid,
  Button,
  Typography,
  Alert,
  AlertTitle,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
  Box,
  Dialog,
  DialogContent,
  DialogActions
} from '@mui/material';
import { styled } from '@mui/system';
import { useToken } from '../api/Token';
import { useNavigate } from 'react-router-dom';

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  maxWidth: 1200, // Increase width to accommodate two columns
  width: '100%',
  marginTop: 50,
}));
const SignatureContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '40px 0',
  borderTop: '1px solid #ccc',
  marginTop: '20px',
  backgroundColor: '#F5EEE2',
});
const HintText = styled(Typography)({
  textDecoration: 'underline',
  marginBottom: '20px',
});
const ImageHolder = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '10px 0',
});

const instructions = ['Take twice daily before eating', 'Take twice daily after eating'];

const paymentStatuses = ['paid', 'unpaid'];

interface MedicationStack {
  id: number;
  serialNO: string;
  medicationName: string;
  dosage: number;
  medicationPrice: number;
  quantity: number;
  instructions: string;
  active: boolean;
}

const Record: React.FC = () => {
  const [doctor, setDoctor] = useState<any>(null);
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [complains, setComplains] = useState<string>('');
  const [diagnosis, setDiagnosis] = useState<string>('');
  const [visitDate, setVisitDate] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<string>(paymentStatuses[0]);
  const [vitalSignStatus, setVitalSignStatus] = useState<string>('normal');
  const [medications, setMedications] = useState([{ medicationName: '', dosage: 50, medicationPrice: '', quantity: '', instructions: instructions[0] }]);
  const [alert, setAlert] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [patients, setPatients] = useState<any[]>([]);
  const { accessToken } = useToken();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredPatients, setFilteredPatients] = useState<any[]>([]);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [openPdfPreview, setOpenPdfPreview] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.length > 0) {
      const results = patients.filter((patient) => patient.name.toLowerCase().includes(term));
      setFilteredPatients(results);
    } else {
      setFilteredPatients([]);
    }
  };

  const handlePatientSelect = (patient: any) => {
    setSelectedPatient(patient);
    setSearchTerm(patient.name); // Set the input field to the selected patient's name
    setFilteredPatients([]); // Clear suggestions
  };

  useEffect(() => {
    const fetchDoctorAndPatients = async () => {
      const username = localStorage.getItem('username');
      if (username) {
        try {
          const [doctorResponse, patientsResponse] = await Promise.all([
            axios.get(`http://localhost:8080/api/v1/users/${username}`, { headers: { Authorization: `Bearer ${accessToken}` } }),
            axios.get('http://localhost:8080/api/v1/patients', { headers: { Authorization: `Bearer ${accessToken}` } })
          ]);
          setDoctor(doctorResponse.data);
          setPatients(patientsResponse.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    fetchDoctorAndPatients();
  }, [accessToken]);

  const handleMedicationChange = (index: number, field: string, value: any) => {
    const updatedMedications = [...medications];
    updatedMedications[index] = { ...updatedMedications[index], [field]: value };
    setMedications(updatedMedications);
  };

  useEffect(() => {
    // Set the visitDate to the current date when the component mounts
    setVisitDate(new Date().toISOString());
  }, []);

  const addMedication = () => {
    setMedications([...medications, { medicationName: '', dosage: 50, medicationPrice: '', quantity: '', instructions: instructions[0] }]);
  };

  const removeMedication = (index: number) => {
    const updatedMedications = medications.filter((_, i) => i !== index);
    setMedications(updatedMedications);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedPatient) {
      setAlert({ type: 'error', message: 'Please select a patient.' });
      return;
    }

    const formData = {
      doctorId: doctor.id,
      patientId: selectedPatient.id,
      complains,
      diagnosis,
      visitDate,
      vitalSigns: `BP,HR - ${vitalSignStatus}`,
      paymentStatus,
      clinicId: selectedPatient.clinicId,
      branchId: selectedPatient.branchId,
      medications: medications.map((med) => ({
        ...med,
        medicationPrice: parseFloat(med.medicationPrice),
        quantity: parseInt(med.quantity),
      })),
    };

    try {
      const response = await axios.post('http://localhost:8080/api/v1/medical-records', formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 201) {
        setAlert({ type: 'success', message: 'Medical record added successfully!' });

        // Generate PDF with border and headline (WellNest)
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();

        // Add page border
        doc.setLineWidth(1);
        doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

        // Add hospital name "WellNest"
        doc.setFontSize(22);
        doc.text('WellNest Hospital', pageWidth / 2, 30, { align: 'center' });

        // Add prescription details
        doc.setFontSize(12);
        doc.text(`Doctor: ${doctor.firstName} ${doctor.lastName}`, 20, 50);
        doc.text(`Patient: ${selectedPatient.name}`, 20, 60);
        doc.text(`Visit Date: ${new Date(visitDate).toLocaleDateString()}`, 20, 70);
        doc.text(`Complaints: ${complains}`, 20, 80);
        doc.text(`Diagnosis: ${diagnosis}`, 20, 90);
        doc.text(`Vital Signs: ${vitalSignStatus}`, 20, 100);
        doc.text(`Payment Status: ${paymentStatus}`, 20, 110);

        // Medications
        doc.text('Medications:', 20, 120);
        medications.forEach((med, index) => {
          doc.text(
            `${index + 1}. ${med.medicationName} - Dosage: ${med.dosage}mg - Quantity: ${med.quantity}`,
            20,
            130 + index * 10
          );
        });

        // Create PDF blob and open it in preview modal
        const pdfBlob = doc.output('blob');
        const pdfBlobUrl = URL.createObjectURL(pdfBlob);
        setPdfBlobUrl(pdfBlobUrl);
        setOpenPdfPreview(true);
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Failed to add medical record. Please try again.' });
      console.error('There was an error adding the medical record!', error);
    }
  };

  const handleDownloadPdf = () => {
    if (pdfBlobUrl) {
      const link = document.createElement('a');
      link.href = pdfBlobUrl;
      link.download = 'prescription.pdf';
      link.click();
    }
    setOpenPdfPreview(false); // Close the modal after download
  };

  return (
    <Container>
      <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: 'easeOut', type: 'spring', stiffness: 200 }}>
        <Typography variant="h4" style={{ marginTop: '0px', textAlign: 'center', textDecorationStyle: 'solid' }}>
          Medical Consultation Review Form
        </Typography>
      </motion.div>

      <ImageHolder>
        <Box component="img" sx={{ width: 650, height: 380 }} alt="Doctor" src=".//../../src/assets/consult.png" />
      </ImageHolder>

      <FormContainer elevation={3}>
        <Typography variant="h5" gutterBottom>
          Add Medical Record
        </Typography>

        {alert.type && (
          <Alert severity={alert.type} onClose={() => setAlert({ type: null, message: '' })}>
            <AlertTitle>{alert.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
            {alert.message}
          </Alert>
        )}

        {doctor ? (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField label="Doctor" variant="outlined" fullWidth value={`${doctor.firstName} ${doctor.lastName}`} disabled helperText="The doctor who is recording the information." />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField label="Search Patient" variant="outlined" fullWidth value={searchTerm} onChange={handleSearch} helperText="Start typing to search for a patient." />
                    {filteredPatients.length > 0 && (
                      <Box sx={{ border: '1px solid #ccc', borderRadius: '4px', marginTop: '8px' }}>
                        {filteredPatients.map((patient) => (
                          <Box
                            key={patient.id}
                            sx={{
                              padding: '8px',
                              cursor: 'pointer',
                              '&:hover': { backgroundColor: '#f5f5f5' },
                            }}
                            onClick={() => handlePatientSelect(patient)}
                          >
                            {patient.name} ({patient.patientToken})
                          </Box>
                        ))}
                      </Box>
                    )}
                  </Grid>

                  <Grid item xs={12}>
                    <TextField label="Complains" variant="outlined" fullWidth multiline rows={4} value={complains} onChange={(e) => setComplains(e.target.value)} helperText="Enter patient's complaints." />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField label="Diagnosis" variant="outlined" fullWidth multiline rows={3} value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} helperText="Enter doctor's diagnosis." />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      label="Visit Date"
                      type="date"
                      variant="outlined"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      value={new Date().toISOString().slice(0, 10)} // Set current date only
                      helperText="Visit date is automatically set to the current date."
                      disabled // Disable the field to prevent user input
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} md={6}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Vital Signs</InputLabel>
                      <Select value={vitalSignStatus} onChange={(e) => setVitalSignStatus(e.target.value)}>
                        <MenuItem value="low">Low</MenuItem>
                        <MenuItem value="normal">Normal</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                      </Select>
                      <FormHelperText>Select the patient's vital sign status.</FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth variant="outlined">
                      <InputLabel id="payment-status-label">Payment Status</InputLabel>
                      <Select labelId="payment-status-label" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} label="Payment Status">
                        {paymentStatuses.map((status, index) => (
                          <MenuItem key={index} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>Payment status for the treatment.</FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
              Medications
            </Typography>

            {medications.map((medication, index) => (
              <Grid container spacing={2} key={index}>
                <Grid item xs={12} md={3}>
                  <TextField label="Medication Name" variant="outlined" fullWidth value={medication.medicationName} onChange={(e) => handleMedicationChange(index, 'medicationName', e.target.value)} />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    label="Dosage (mg)"
                    type="number"
                    variant="outlined"
                    fullWidth
                    value={medication.dosage}
                    onChange={(e) => handleMedicationChange(index, 'dosage', parseInt(e.target.value))}
                    InputProps={{
                      inputProps: { min: 0, step: 50 },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField label="Number of Medition" variant="outlined" type="number" fullWidth value={medication.medicationPrice} onChange={(e) => handleMedicationChange(index, 'medicationPrice', e.target.value)} />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField label="Quantity" type="number" variant="outlined" fullWidth value={medication.quantity} onChange={(e) => handleMedicationChange(index, 'quantity', e.target.value)} />
                </Grid>
                <Grid item xs={12} md={3}>
                  <FormControl fullWidth variant="outlined">
                    <InputLabel id={`instructions-label-${index}`}>Instructions</InputLabel>
                    <Select
                      labelId={`instructions-label-${index}`}
                      value={medication.instructions}
                      onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                      label="Instructions"
                    >
                      {instructions.map((instruction, i) => (
                        <MenuItem key={i} value={instruction}>
                          {instruction}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} padding={1}>
                  <Button variant="outlined" color="secondary" onClick={() => removeMedication(index)}>
                    Remove Medication
                  </Button>
                </Grid>
              </Grid>
            ))}
             <Typography variant="h6" gutterBottom style={{ marginTop: '20px' }}>
              Instructions
            </Typography>
            <form>
  <FormControl component="fieldset">
    <FormGroup style={{ flexDirection: 'row' }}>
      <FormControlLabel
        control={<Checkbox name="morning" color="primary" />}
        label="Morning"
      />
      <FormControlLabel
        control={<Checkbox name="afternoon" color="primary" />}
        label="Afternoon"
      />
      <FormControlLabel
        control={<Checkbox name="night" color="primary" />}
        label="Night"
      />
    </FormGroup>
  </FormControl>
</form>

            <Box mt={2}>
              <Button variant="contained" color="primary" onClick={addMedication}>
                Add Medication
              </Button>
            </Box>

            <div style={{ display: 'flex', justifyContent: 'center', margin: 10 }}>
              <Button type="submit" variant="contained" color="primary" sx={{ width: '200px' }}>
                Submit
              </Button>
            </div>
          </form>
        ) : (
          <Typography>Loading doctor information...</Typography>
        )}
      </FormContainer>

      {pdfBlobUrl && (
        <Dialog open={openPdfPreview} onClose={handleDownloadPdf} maxWidth="md" fullWidth>
          <DialogContent>
            <Worker workerUrl={`https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js`}>
              <div style={{ height: '500px' }}>
                <Viewer fileUrl={pdfBlobUrl} />
              </div>
            </Worker>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDownloadPdf} color="primary">
              Download PDF
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default Record;
