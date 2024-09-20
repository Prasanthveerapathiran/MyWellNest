import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';

const WellNestDetail: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ padding: 3 }}>
        <Typography variant="h4" gutterBottom>
          WellNest Details
        </Typography>
        <Typography variant="body1">
          Here you can provide more detailed information about WellNest.
        </Typography>
        {/* Add more content and styling as needed */}
      </Box>
    </Container>
  );
};

export default WellNestDetail;
