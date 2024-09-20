import React from 'react';
import { Container, Typography, TextField, Button, Box, AppBar, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const ContactPage: React.FC = () => {
  const navigate = useNavigate();

  const handleBackButtonClick = () => {
    navigate(-1); // Navigate back to the previous page
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Add form submission logic here
    alert('Message sent successfully!');
  };

  return (
    <Box>
      {/* Header */}
      <AppBar position="static" sx={{ backgroundColor: '#03a9f4' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            WellNest
          </Typography>
          <Button color="inherit" onClick={handleBackButtonClick}>
            Back
          </Button>
        </Toolbar>
      </AppBar>

      {/* Content */}
      <Container sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="body1" paragraph>
          We would love to hear from you! Please fill out the form below and we will get back to you as soon as possible.
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
            justifyContent: 'space-between',
          }}
        >
          {/* Contact Information */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              border: '1px solid #ddd', // Add border to all four sides
              borderRadius: '4px', // Optional: rounded corners
              p: 2, // Optional: padding inside the border
            }}
          >
            <Typography variant="h6">Contact Information</Typography>
            <Typography variant="body1">
              <strong>Phone:</strong><br />
              +123 456 7890<br />
              +098 765 4321
            </Typography>
            <Typography variant="body1">
              <strong>Email:</strong><br />
              contact@wellnest.com
            </Typography>
            <Typography variant="body1">
              <strong>Address:</strong><br />
              123 WellNest St,<br />
              Health City, HC 12345<br />
              Country
            </Typography>
          </Box>

          {/* Contact Form */}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              label="Name"
              variant="outlined"
              fullWidth
              required
            />
            <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              required
            />
            <TextField
              label="Message"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              required
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Send Message
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Footer */}
      <Box sx={{ backgroundColor: '#f4f4f4', p: 2, mt: 4 }}>
        <Typography variant="body2" align="center">
          © 2024 WellNest. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default ContactPage;
