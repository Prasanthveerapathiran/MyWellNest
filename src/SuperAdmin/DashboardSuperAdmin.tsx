import React, { useEffect, useState } from 'react';
import { Button, Typography, Container, Grid, Paper, Box, MenuItem, Select, FormControl, InputLabel, SelectChangeEvent } from '@mui/material';
import axios from 'axios';
import { useToken } from '../api/Token';
import WaveChart from './WaveChart';
import BarChart from './BarChart';

const DashboardSuperAdmin: React.FC = () => {
  const { accessToken } = useToken(); // Access token from context
  const [branches, setBranches] = useState<{ branchId: number; name: string }[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<string>('');
  const [totalStaff, setTotalStaff] = useState<number>(0); // To store the total count of staff

  // Fetch clinic data with branches
  useEffect(() => {
    const fetchClinicData = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/clinic/name/dhana Clinic', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setBranches(response.data.branches);
      } catch (error) {
        console.error('Error fetching clinic data:', error);
      }
    };

    if (accessToken) {
      fetchClinicData();
    }
  }, [accessToken]);

  // Fetch total staff count
  useEffect(() => {
    const fetchTotalStaff = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/v1/users', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setTotalStaff(response.data.length); // Store the total number of staff
      } catch (error) {
        console.error('Error fetching total staff:', error);
      }
    };

    if (accessToken) {
      fetchTotalStaff();
    }
  }, [accessToken]);

  const handleBranchSelect = (event: SelectChangeEvent) => {
    setSelectedBranch(event.target.value as string);
  };

  return (
    <Container sx={{ mt: 12 }} maxWidth="lg"> {/* Adjust maxWidth to control width */}
      <Grid container spacing={4}>
        {/* Grid item 1 */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Total Branches
            </Typography>
            <Typography variant="body1">
              {branches.length} {/* Displays the count of branches */}
            </Typography>
          </Paper>
        </Grid>

        {/* Grid item 2 */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Total staff
            </Typography>
            <Typography variant="body1">
              {totalStaff} {/* Displays the count of total staff */}
            </Typography>
          </Paper>
        </Grid>

        {/* Grid item 3 */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
          
            {/* Dropdown to select branch */}
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel id="branch-select-label">Select Branch</InputLabel>
              <Select
                labelId="branch-select-label"
                value={selectedBranch}
                onChange={handleBranchSelect}
              >
                {branches.map((branch) => (
                  <MenuItem key={branch.branchId} value={branch.name}>
                    {branch.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        </Grid>

        {/* Grid item 4 */}
        <Grid item xs={12} sm={6} md={3}>
          <Paper elevation={3} sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h6" gutterBottom>
              Manage Settings
            </Typography>
          </Paper>
        </Grid>
      </Grid>

    

      {/* Second Grid Layout */}
      <Box sx={{ flexGrow: 1, mt: 4 }}>
        <Grid container spacing={2}>
        <Grid item xs={6}>
    <Paper sx={{ p: 2, textAlign: 'center', height: 400 }}>
      <WaveChart selectedBranch={selectedBranch} /> {/* Pass the selected branch */}
    </Paper>
  </Grid>
            <Grid item xs={6}>
            <Paper sx={{ p: 2, textAlign: 'center', height: 300 }}>
            <BarChart /> 
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper sx={{ p: 2, textAlign: 'center', height: 300 }}>
              <Typography>xs=4</Typography>
            </Paper>
          </Grid>
          <Grid item xs={8}>
            <Paper sx={{ p: 2, textAlign: 'center', height: 300 }}>
              <Typography>xs=8</Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default DashboardSuperAdmin;
