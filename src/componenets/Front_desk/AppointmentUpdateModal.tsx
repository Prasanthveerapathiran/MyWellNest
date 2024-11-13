// import React, { useEffect, useState } from 'react';
// import {
//   Box, Button, Modal, TextField, Typography, Select, MenuItem,
// } from '@mui/material';
// import axios from 'axios';
// import { useToken } from '../../api/Token';
// import dayjs from 'dayjs';

// const AppointmentUpdateModal: React.FC<{ open: boolean, onClose: () => void, patient: Patient | null }> = ({ open, onClose, patient }) => {
//   const { accessToken } = useToken();
//   const [doctors, setDoctors] = useState<Doctor[]>([]);
//   const [newAppointmentDate, setNewAppointmentDate] = useState('');
//   const [selectedDoctorId, setSelectedDoctorId] = useState<number | ''>('');

//   // Fetch doctors when modal opens
//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         const response = await axios.get('http://localhost:8080/api/v1/users/role/DOCTOR', {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         });
//         setDoctors(response.data.map((doc: any) => ({
//           id: doc.id,
//           firstName: doc.firstName,
//           lastName: doc.lastName,
//         })));
//       } catch (error) {
//         console.error('Error fetching doctors:', error);
//       }
//     };

//     if (open) fetchDoctors();
//   }, [open, accessToken]);

//   useEffect(() => {
//     if (patient) {
//       setNewAppointmentDate(patient.appointmentDate);
//       setSelectedDoctorId(patient.doctorId);
//     }
//   }, [patient]);

//   const handleUpdateAppointment = async () => {
//     if (!patient) return;

//     try {
//       await axios.put(
//         `http://localhost:8080/api/v1/patients/${patient.id}`,
//         {
//           appointmentDate: newAppointmentDate,
//           doctorId: selectedDoctorId,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${accessToken}`,
//           },
//         }
//       );

//       onClose();
//     } catch (error) {
//       console.error('Error updating appointment:', error);
//     }
//   };

//   return (
//     <Modal open={open} onClose={onClose}>
//       <Box sx={modalStyle}>
//         <Typography variant="h6" gutterBottom>Update Appointment</Typography>
        
//         <TextField
//           label="Appointment Date"
//           type="datetime-local"
//           fullWidth
//           value={newAppointmentDate}
//           onChange={(e) => setNewAppointmentDate(e.target.value)}
//           sx={{ marginBottom: 2 }}
//         />
        
//         <Select
//           label="Doctor"
//           fullWidth
//           value={selectedDoctorId}
//           onChange={(e) => setSelectedDoctorId(Number(e.target.value))}
//           sx={{ marginBottom: 2 }}
//         >
//           {doctors.map((doctor) => (
//             <MenuItem key={doctor.id} value={doctor.id}>
//               {doctor.firstName} {doctor.lastName}
//             </MenuItem>
//           ))}
//         </Select>
        
//         <Button variant="contained" onClick={handleUpdateAppointment}>
//           Update Appointment
//         </Button>
//       </Box>
//     </Modal>
//   );
// };

// export default AppointmentUpdateModal;
