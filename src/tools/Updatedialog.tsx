// import React, { useState } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Button,
//   TextField,
// } from '@mui/material';
// i // Adjust the path as per your file structure

// interface UpdateDialogProps {
//   open: boolean;
//   handleClose: () => void;
//   patientData: Patient | null;
//   handleSaveEdit: (id: number) => void;
//   handleEditChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
// }

// const UpdateDialog: React.FC<UpdateDialogProps> = ({
//   open,
//   handleClose,
//   patientData,
//   handleSaveEdit,
//   handleEditChange,
// }) => {
//   return (
//     <Dialog open={open} onClose={handleClose}>
//       <DialogTitle>Edit Patient</DialogTitle>
//       <DialogContent>
//         <TextField
//           autoFocus
//           margin="dense"
//           id="name"
//           name="name"
//           label="Name"
//           type="text"
//           fullWidth
//           value={patientData?.name || ''}
//           onChange={handleEditChange}
//         />
//         <TextField
//           margin="dense"
//           id="phone"
//           name="phone"
//           label="Phone"
//           type="text"
//           fullWidth
//           value={patientData?.phone || ''}
//           onChange={handleEditChange}
//         />
//         <TextField
//           margin="dense"
//           id="gender"
//           name="gender"
//           label="Gender"
//           type="text"
//           fullWidth
//           value={patientData?.gender || ''}
//           onChange={handleEditChange}
//         />
//         <TextField
//           margin="dense"
//           id="email"
//           name="email"
//           label="Email"
//           type="email"
//           fullWidth
//           value={patientData?.email || ''}
//           onChange={handleEditChange}
//         />
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={handleClose}>Cancel</Button>
//         <Button onClick={() => handleSaveEdit(patientData?.id || 0)}>Save</Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default UpdateDialog;
