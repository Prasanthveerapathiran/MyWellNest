// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
// import { useToken } from '../api/Token'; // Import the useToken hook

// interface Medication {
//   id: number;
//   medicationName: string;
//   dosage: string;
//   medicationPrice: number;
//   quantity: number;
//   instructions: string;
//   clinicId: number;
//   branchId: number;
// }

// interface MedicalRecord {
//   id: number;
//   doctorId: number;
//   patientId: number;
//   doctorFirstName: string;
//   patientName: string;
//   complains: string;
//   paymentStatus: string;
//   clinicName: string;
//   branchName: string;
//   diagnosis: string;
//   visitDate: string;
//   patientToken: string;
//   vitalSigns: string;
//   amount: number;
//   treatment: string;
//   clinicId: number;
//   branchId: number;
//   medications: Medication[];
// }

// const SearchPatient: React.FC = () => {
//   const [searchTerm, setSearchTerm] = useState<string>('');
//   const [records, setRecords] = useState<MedicalRecord[]>([]);
//   const [loading, setLoading] = useState<boolean>(false);
//   const { accessToken } = useToken(); // Get the access token from the hook

//   useEffect(() => {
//     if (searchTerm) {
//       fetchRecords(searchTerm);
//     }
//   }, [searchTerm]);

//   const fetchRecords = async (name: string) => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`http://localhost:8080/api/v1/medical-records/search/${name}`, {
//         headers: {
//           'Authorization': `Bearer ${accessToken}` // Include the access token in the request headers
//         }
//       });
//       setRecords(response.data);
//     } catch (error) {
//       console.error('Error fetching medical records:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setSearchTerm(event.target.value);
//   };

//   return (
//     <div>
//       <Typography variant="h4" gutterBottom>
//         Search Medical Records
//       </Typography>
//       <TextField
//         label="Enter Patient Name"
//         value={searchTerm}
//         onChange={handleSearchChange}
//         fullWidth
//         variant="outlined"
//         margin="normal"
//       />
//       <Button
//         variant="contained"
//         color="primary"
//         onClick={() => fetchRecords(searchTerm)}
//         disabled={loading}
//       >
//         {loading ? 'Searching...' : 'Search'}
//       </Button>
//       <TableContainer component={Paper} sx={{ mt: 3 }}>
//         <Table>
//           <TableHead>
//             <TableRow>
//               <TableCell>Patient Name</TableCell>
//               <TableCell>Doctor Name</TableCell>
//               <TableCell>Complaints</TableCell>
//               <TableCell>Diagnosis</TableCell>
//               <TableCell>Visit Date</TableCell>
//               <TableCell>Payment Status</TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {records.length > 0 ? (
//               records.map((record) => (
//                 <TableRow key={record.id}>
//                   <TableCell>{record.patientName}</TableCell>
//                   <TableCell>{record.doctorFirstName}</TableCell>
//                   <TableCell>{record.complains}</TableCell>
//                   <TableCell>{record.diagnosis}</TableCell>
//                   <TableCell>{new Date(record.visitDate).toLocaleDateString()}</TableCell>
//                   <TableCell>{record.paymentStatus}</TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={6}>No records found.</TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </div>
//   );
// };

// export default SearchPatient;
