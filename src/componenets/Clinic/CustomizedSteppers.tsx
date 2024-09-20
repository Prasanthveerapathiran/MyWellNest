import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import VideoLabelIcon from '@mui/icons-material/VideoLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import { Button, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import Clinic from './Clinic';
import Branch from './Branch';
import { useNavigate } from 'react-router-dom';



const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 22,
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      backgroundImage: 'linear-gradient( 95deg,rgb(242,113,33) 0%,rgb(233,64,87) 50%,rgb(138,35,135) 100%)',
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: 3,
    border: 0,
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
    borderRadius: 1,
  },
}));


const ColorlibStepIconRoot = styled('div')<{ ownerState: { completed?: boolean; active?: boolean } }>(({ theme, ownerState }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
  zIndex: 1,
  color: '#fff',
  width: 50,
  height: 50,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    backgroundImage: 'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed && {
    backgroundImage: 'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
  }),
}));

function ColorlibStepIcon(props: StepIconProps) {
  const { active, completed, className } = props;

  const icons: { [index: string]: React.ReactElement } = {
    1: <LocalHospitalIcon />,
    2: <GroupAddIcon />,
    3: <VideoLabelIcon />,
  };

  return (
    <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
      {icons[String(props.icon)]}
    </ColorlibStepIconRoot>
  );
}

const steps = ['Clinic', 'Branch', 'Create'];

export default function CustomizedSteppers() {
  const [activeStep, setActiveStep] = useState(0);
  const [clinicData, setClinicData] = useState({ name: '', address: '' });
  const [branches, setBranches] = useState<{ name: string; address: string }[]>([]);
  const [isSlidingOut, setIsSlidingOut] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleCreate = async () => {
    const data = {
      name: clinicData.name,
      address: clinicData.address,
      branches: branches,
    };

    try {
      await axios.post('http://localhost:8080/api/v1/clinic/register/clinic', data);
      alert('Clinic and branches created successfully!');
      navigate(`/showOneClinic`, { state: { clinicName: clinicData.name } });
    } catch (error) {
      console.error('Error creating clinic and branches:', error);
      alert('Failed to create clinic and branches.');
    }
  };


  return (
    <Stack sx={{ width: '100%', marginTop: 4 }} spacing={4}>
      <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={ColorlibStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === 0 && <Clinic onNext={handleNext} setClinicData={setClinicData} clinicData={clinicData} />}
        {activeStep === 1 && (
          <Branch
            onNext={handleNext}
            onBack={handleBack}
            addBranches={(newBranches) => setBranches(newBranches)}
            initialBranches={branches}
          />
        )}
        {activeStep === 2 && (
  <div
    style={{
      textAlign: 'center',
      position: 'relative',
      padding: '30px',
      background: '#f7f9fc',
      borderRadius: '15px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      maxWidth: '600px',
      margin: '0 auto',
    }}
  >
    <h1 style={{ fontSize: '2.5rem', color: '#333', marginBottom: '20px' }}>Review and Create</h1>
    <div
      style={{
        background: '#fff',
        borderRadius: '10px',
        padding: '20px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        marginBottom: '20px',
      }}
    >
      <p style={{ fontSize: '1.2rem', color: '#555' }}>
        <strong>Clinic Name:</strong> {clinicData.name}
      </p>
      <p style={{ fontSize: '1.2rem', color: '#555' }}>
        <strong>Clinic Address:</strong> {clinicData.address}
      </p>
    </div>
    <h2 style={{ fontSize: '2rem', color: '#333', marginBottom: '15px' }}>Branches:</h2>
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '15px',
        marginBottom: '20px',
      }}
    >
      {branches.map((branch, index) => (
        <div
          key={index}
          style={{
            background: '#fff',
            borderRadius: '10px',
            padding: '20px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          }}
        >
          <p style={{ fontSize: '1.2rem', color: '#555' }}>
            <strong>Branch Name:</strong> {branch.name}
          </p>
          <p style={{ fontSize: '1.2rem', color: '#555' }}>
            <strong>Branch Address:</strong> {branch.address}
          </p>
        </div>
      ))}
    </div>
    <Button
      variant="contained"
      style={{
        backgroundColor: '#4CAF50',
        color: 'white',
        marginTop: '20px',
        fontSize: '1.2rem',
        padding: '10px 20px',
        borderRadius: '25px',
        transition: 'background-color 0.3s ease',
      }}
      onClick={handleCreate}
      onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#45a049')}
      onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#4CAF50')}
    >
      Create
    </Button>
    <IconButton
  style={{
    position: 'fixed',  // Ensure it's fixed relative to the viewport
    top: '250px',        // Adjusted vertical position to be a bit lower
    left: '30px',       // Align to the left edge of the viewport
    backgroundColor: '#1976d2',
    color: 'white',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
    transition: 'background-color 0.3s ease, transform 0.3s ease',
    zIndex: 2000,       // Ensure it's on top of other elements
  }}
  onClick={handleBack}
  onMouseOver={(e) => {
    e.currentTarget.style.backgroundColor = '#1565c0';
    e.currentTarget.style.transform = 'translateY(-5px)'; // Move up on hover
  }}
  onMouseOut={(e) => {
    e.currentTarget.style.backgroundColor = '#1976d2';
    e.currentTarget.style.transform = 'translateY(1)'; // Reset position
  }}
>
  <ArrowBackIcon style={{ fontSize: '2rem' }} />
</IconButton>


  </div>
)}

      </div>
    </Stack>
  );
}
