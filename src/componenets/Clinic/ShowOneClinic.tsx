import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, Card, CardContent, Grid,Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import axios from 'axios';

import { useToken } from '../../api/Token';
import ClinicTable from './ClinicTable';
import { useLocation, useNavigate } from 'react-router-dom';

interface ShowOneClinicProps {
  open: boolean;
  onClose: () => void;
}

const CustomCard = styled(Card)({
  backgroundColor: '#e3f2fd', // Light blue background color
  marginBottom: '16px',
});

const ShowOneClinic: React.FC<ShowOneClinicProps> = ({ open, onClose }) => {
  const [clinicDetails, setClinicDetails] = useState<any>(null);
  const [showTable, setShowTable] = useState(false);
  const { accessToken } = useToken();
  const location = useLocation();
  const clinicName = location.state?.clinicName;
  const navigate = useNavigate();

  useEffect(() => {
    if (clinicName) {
      const fetchClinicDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/api/v1/clinic/name/${clinicName}`, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setClinicDetails(response.data);
        } catch (error) {
          console.error('Error fetching clinic details:', error);
        }
      };

      fetchClinicDetails();
    }
  }, [clinicName, accessToken]);

  const handleShowTable = () => {
    setShowTable(true);
    onClose();
  };
  const handleNavigate = () => {
    navigate("/superAdmin"); // Navigate to /superAdmin page
  };
  useEffect(() => {
    // Disable browser back and forward buttons
    const handlePopState = (event: PopStateEvent) => {
      event.preventDefault();
      navigate(0); // Reload the page to prevent navigation
    };

    window.history.pushState(null, document.title, window.location.href);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);
  return (
    <>
      {!showTable && (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
          <DialogTitle>Clinic Details</DialogTitle>
          <DialogContent dividers style={{ backgroundColor: '#e3f2fd' }}> {/* Light blue background color */}
            {clinicDetails ? (
              <CustomCard variant="outlined">
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom>
                    {clinicDetails.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Clinic ID: {clinicDetails.id}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Address: {clinicDetails.address}
                  </Typography>
                  <Typography variant="h6" component="div" gutterBottom style={{ marginTop: 16 }}>
                    Branches
                  </Typography>
                  {clinicDetails.branches.map((branch: any, index: number) => (
                    <CustomCard variant="outlined" key={index}>
                      <CardContent>
                        <Typography variant="body1" component="div">
                          Branch Name: {branch.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Branch ID: {branch.branchId}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Clinic ID: {branch.clinicId}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Address: {branch.address}
                        </Typography>
                      </CardContent>
                    </CustomCard>
                  ))}
                </CardContent>
              </CustomCard>
            ) : (
              <Typography>Loading...</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleShowTable} color="primary">
              OK
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <div className={showTable ? "clear" : "blurred"}>
        <ClinicTable />
      </div>
      <Box sx={{ position: 'fixed', bottom: 16, right: 16 }}> {/* Positioned at the bottom-right */}
        <Button variant="contained" color="primary" onClick={handleNavigate} style={{ marginRight: '8px' }}>
          Create & Registration
        </Button>
      </Box>
    </>
  );
};

export default ShowOneClinic;
