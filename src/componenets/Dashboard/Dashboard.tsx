import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import './style.css';
import Head from './head';
import MedicalRecordsChart from './MedicalRecordsChart'; 
import RecentPatient from './recentPatient';
import RecentTransaction from './RecentTransaction';

const Dashboard: React.FC = () => {
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      window.history.pushState(null, document.title, window.location.href);
    };

    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Function to handle button click
  const handleButtonClick = () => {
    navigate('/new-page'); // Replace '/new-page' with the path you want to navigate to
  };

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="xl">
        <Box
          sx={{
            bgcolor: '#cfe8fc',
            height: { xs: '40vh', sm: '35vh', md: '35vh' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
            <Head />
        </Box>
       
      </Container>
      <Container maxWidth="xl" sx={{ mt: 7 }}>
        <Grid container spacing={2} sx={{ height: { xs: 'auto', sm: '35vh', md: '45vh' }, marginLeft: { xs: 'auto', sm: '5vh', md: '2vh' } }}>
          <Grid item xs={12} md={6}>
            <Box sx={{ bgcolor: '#e0f7fa', height: '100%' }}>
               <MedicalRecordsChart />
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', width: '100%' }}>
              <div className="card">
                <div className="circle" style={{ '--clr': '#f40103' } as React.CSSProperties}>
                  <img src="./src/assets/well.png" alt="Coca Cola Logo" className="logo" />
                </div>
                <div className="content">
                  <h2>WellNest</h2>
                  <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Vel possimus cumque magnam consequatur illum blanditiis nihil.</p>
                  {/* Add the button here */}
                  <button onClick={handleButtonClick} style={{ marginTop: '16px', padding: '8px 16px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    Go to About Page
                  </button>
                </div>
                <img src="./src/assets/ro.png" alt="Coca Cola Product" className="product_img" />
              </div>
            </Box>
          </Grid>
        </Grid>
      </Container>
      <Container maxWidth="xl" sx={{ mt: 26 }}>
        <Grid container spacing={2} sx={{ height: { xs: 'auto', sm: '25vh', md: '35vh' } }}>
          <Grid item xs={12} md={8}>
            <Box sx={{ height: '100%' }}>
            <RecentTransaction />
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ maxHeight: '400px', overflowY: 'auto', boxShadow: 3, p: 2, marginTop: '50px' }}>
              <Typography variant="h5" gutterBottom>
                Recent Patients
              </Typography>
              <RecentPatient />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};

export default Dashboard;
