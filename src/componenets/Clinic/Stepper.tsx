// import React, { useState } from 'react';
// import { styled } from '@mui/material/styles';
// import Stack from '@mui/material/Stack';
// import Stepper from '@mui/material/Stepper';
// import Step from '@mui/material/Step';
// import StepLabel from '@mui/material/StepLabel';
// import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
// import GroupAddIcon from '@mui/icons-material/GroupAdd';
// import VideoLabelIcon from '@mui/icons-material/VideoLabel';
// import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
// import { StepIconProps } from '@mui/material/StepIcon';
// import { Button } from '@mui/material';
// import axios from 'axios';
// import Clinic from './Clinic';
// import Branch from './Branch';
// import { useNavigate } from 'react-router-dom'; // Import useNavigate
// import ShowOneClinic from './ShowOneClinic'; // Import ShowOneClinic

// const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
//   [`&.${stepConnectorClasses.alternativeLabel}`]: {
//     top: 22,
//   },
//   [`&.${stepConnectorClasses.active}`]: {
//     [`& .${stepConnectorClasses.line}`]: {
//       backgroundImage:
//         'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
//     },
//   },
//   [`&.${stepConnectorClasses.completed}`]: {
//     [`& .${stepConnectorClasses.line}`]: {
//       backgroundImage:
//         'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
//     },
//   },
//   [`& .${stepConnectorClasses.line}`]: {
//     height: 3,
//     border: 0,
//     backgroundColor:
//       theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
//     borderRadius: 1,
//   },
// }));

// const ColorlibStepIconRoot = styled('div')<{
//   ownerState: { completed?: boolean; active?: boolean };
// }>(({ theme, ownerState }) => ({
//   backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
//   zIndex: 1,
//   color: '#fff',
//   width: 50,
//   height: 50,
//   display: 'flex',
//   borderRadius: '50%',
//   justifyContent: 'center',
//   alignItems: 'center',
//   ...(ownerState.active && {
//     backgroundImage:
//       'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
//     boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
//   }),
//   ...(ownerState.completed && {
//     backgroundImage:
//       'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
//   }),
// }));

// function ColorlibStepIcon(props: StepIconProps) {
//   const { active, completed, className } = props;

//   const icons: { [index: string]: React.ReactElement } = {
//     1: <LocalHospitalIcon />,
//     2: <GroupAddIcon />,
//     3: <VideoLabelIcon />,
//   };

//   return (
//     <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
//       {icons[String(props.icon)]}
//     </ColorlibStepIconRoot>
//   );
// }

// const steps = ['Clinic', 'Branch', 'Create'];

// export default function CustomizedSteppers() {
//   const [activeStep, setActiveStep] = useState(0);
//   const [clinicData, setClinicData] = useState({ name: '', address: '' });
//   const [branches, setBranches] = useState<{ name: string; address: string }[]>([]);
//   const navigate = useNavigate(); // Initialize useNavigate

//   const handleNext = () => {
//     setActiveStep((prevActiveStep) => prevActiveStep + 1);
//   };

//   const handleCreate = async () => {
//     const data = {
//       name: clinicData.name,
//       address: clinicData.address,
//       branches: branches,
//     };

//     try {
//       await axios.post('http://localhost:8080/api/v1/clinic/register/clinic', data);
//       alert('Clinic and branches created successfully!');
//       navigate(`/showOneClinic`, { state: { clinicName: clinicData.name } }); // Navigate to ShowOneClinic with state
//     } catch (error) {
//       console.error('Error creating clinic and branches:', error);
//       alert('Failed to create clinic and branches.');
//     }
//   };

//   return (
//     <Stack sx={{ width: '100%', marginTop: 4 }} spacing={4}>
//       <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
//         {steps.map((label) => (
//           <Step key={label}>
//             <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
//           </Step>
//         ))}
//       </Stepper>
//       <div>
//         {activeStep === 0 && <Clinic onNext={handleNext} setClinicData={setClinicData} />}
//         {activeStep === 1 && <Branch onNext={handleNext} addBranches={setBranches} />}
//         {activeStep === 2 && (
//           <div>
//             <h1>Review and Create</h1>
//             <p>Clinic Name: {clinicData.name}</p>
//             <p>Clinic Address: {clinicData.address}</p>
//             <h2>Branches:</h2>
//             {branches.map((branch, index) => (
//               <div key={index}>
//                 <p>Branch Name: {branch.name}</p>
//                 <p>Branch Address: {branch.address}</p>
//               </div>
//             ))}
//             <Button variant="contained" onClick={handleCreate}>
//               Create
//             </Button>
//           </div>
//         )}
//       </div>
//     </Stack>
//   );
// }
