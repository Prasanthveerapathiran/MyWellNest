import React from 'react';
import centereImage from '../../assets/about.png';
import leftimage from '../../assets/aaa.jpg';
import bottom from '../../assets/eye.png';
import foot from '../../assets/foot.jpg';
import { Container, Typography, Box, Button, AppBar, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './whatsappButton.css';
import { useInView } from 'react-intersection-observer';
import './animations.css';
import { motion, useAnimation } from 'framer-motion';
const NewPage: React.FC = () => {
  const navigate = useNavigate();
  const controls = useAnimation();
  const { ref: aboutRef, inView: aboutInView } = useInView({ triggerOnce: true });
  const { ref: storyRef, inView: storyInView } = useInView({ triggerOnce: true });
  const { ref: footerRef, inView: footerInView } = useInView({ triggerOnce: true });
  React.useEffect(() => {
    if (aboutInView) {
      aboutControls.start({ opacity: 1, y: 0 });
    }
    if (storyInView) {
      storyControls.start({ opacity: 1, y: 0 });
    }
    if (footerInView) {
      footerControls.start({ opacity: 1, y: 0 });
    }
  }, [aboutInView, storyInView, footerInView]);
  const aboutControls = useAnimation();
  const storyControls = useAnimation();
  const footerControls = useAnimation();
  const imageVariants = {
    hidden: { x: '100%', opacity: 0 },
    visible: { x: 0, opacity: 1 },
  };
  
  const textVariants = {
    hidden: { x: '-100%', opacity: 0 },
    visible: { x: 0, opacity: 1 },
  };

  const handleBackButtonClick = () => {
    navigate(-1); // Navigate back to the previous page
  };
  const handleContactUsClick = () => {
    navigate('/contact'); // Navigate to the contact page
  };
  React.useEffect(() => {
    controls.start({ y: 0, opacity: 1 });
  }, [controls]);

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
        <motion.div
          ref={aboutRef}
          initial={{ opacity: 0, y: 50 }}
          animate={aboutControls}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" gutterBottom>
            About Us
          </Typography>
          <Typography variant="body1" paragraph>
            Welcome to WellNest, where we believe in the power of holistic health and well-being.
            Our mission is to provide comprehensive care that nurtures both body and mind.
            At WellNest, we are dedicated to offering the best services to ensure a healthier you.
          </Typography>
          <Typography variant="body1" paragraph>
            Our team of professionals is here to support your journey to wellness with personalized
            care and attention. Whether it's through medical consultations, wellness programs, or
            mental health support, we are committed to helping you thrive.
          </Typography>
        </motion.div>
      </Container>
      <motion.div
      initial={{ y: '100%', opacity: 0 }}
      animate={controls}
      transition={{ duration: 1 }}
    >
      <Box
        sx={{
          width: '100%',
          height: '500px', // Adjust the height as needed
          backgroundImage: `url(${centereImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          margin: 2,
          mt: 4,
        }}
      />
    </motion.div>


    <motion.div
      initial={{ y: '20%', opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <Box
        sx={{
          width: '100%',
          backgroundColor: '#fff', // White background
          color: '#000',
          textAlign: 'center',
          py: 4,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Who We Are?
        </Typography>
        <Typography variant="body1" gutterBottom>
          1. We are committed to providing the best healthcare services.
        </Typography>
        <Typography variant="body1" gutterBottom>
          2. Our team consists of experienced professionals dedicated to your well-being.
        </Typography>
        <Typography variant="body1" gutterBottom>
          3. At WellNest, we believe in compassionate and personalized care.
        </Typography>
      </Box>
    </motion.div>
    <Box
  sx={{
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    mt: 4, // Margin-top to space from the previous content
  }}
>
  {/* Image Holder */}
  <motion.div
    variants={imageVariants}
    initial="hidden"
    animate="visible"
    transition={{ duration: 1 }}
    style={{
      flex: 1,
      height: 280,
      margin: 3,
      backgroundImage: `url(${leftimage})`, // Replace with your image URL
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      borderRadius: '8px', // Optional: add border-radius for rounded corners
    }}
  />

  {/* Text Content */}
  <motion.div
    variants={textVariants}
    initial="hidden"
    animate="visible"
    transition={{ duration: 1 }}
    style={{
      flex: 1,
      backgroundColor: '#fff', // White background
      color: '#000',
      textAlign: 'center',
      padding: '16px', // Adjust padding as needed
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}
  >
    <Typography variant="h3" gutterBottom marginLeft={7} className="fade-in-top">
      Discover Our Story
    </Typography>

    <Typography variant="body1" sx={{ maxWidth: '800px', mx: 'auto', marginLeft: 5 }} className="fade-in-top">
      At WellNest, we are driven by our passion for healthcare and a commitment to enhancing patient well-being. Our journey began with a vision to provide accessible, high-quality medical care, and we continue to innovate and expand our services to meet the evolving needs of our community. Our dedicated team of professionals works tirelessly to ensure that every patient receives personalized attention and the best possible care. We invite you to learn more about our mission and values, and how we strive to make a positive impact in the world of healthcare.
    </Typography>
  </motion.div>
</Box>
  {/* Image Holder */}
 
<Box
  sx={{
    width: '100%',
    backgroundColor: '#0E87CC',
    py: 4,
    px: 2,
    display: 'flex',
    justifyContent: 'space-between', // Distribute space between children
    alignItems: 'center',
    mt: 4,
  }}
>
  <Typography variant="h4" gutterBottom marginLeft={5} color={'white'}>
  Next Generation Wellnet for a Healthier Tomorrow!
  </Typography>
  <Button
  variant="contained"
  
  sx={{ 
    backgroundColor: 'white', // Button background color
    color: 'black', // Text color inside the button
    marginRight:7,
    '&:hover': {
      backgroundColor: '#f0f0f0', // Slightly different color on hover
      
    },
  }}
  endIcon={<span>&rarr;</span>} // Right arrow icon
  onClick={handleContactUsClick}
>
  Contact Us
</Button>

</Box>
<Box
  sx={{
    position: 'fixed',
    bottom: 100, // Adjust this to position the button above the WhatsApp button
    right: 20,
    zIndex: 1000, // Ensure it stays on top
  }}
>
  <Box
    component="a"
    href="msteams://teams.microsoft.com/l/chat/0/0?users=prasanth.veerabathiran@tectot.com" // Replace with your Teams link
    target="_blank"
    sx={{
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 60,
      height: 60,
      backgroundColor: '#0078d4', // Microsoft Teams blue color
      borderRadius: '50%',
      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
      textDecoration: 'none',
      color: 'white',
    }}
    className="btn-phone-pulse-border"
  >
    <i className="fas fa-phone-alt" style={{ fontSize: 30 }} /> {/* Phone Icon */}
  </Box>
</Box>

<Box
        sx={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          zIndex: 1000, // Ensure it stays on top
        }}
      >
        
        <Box
          component="a"
          href="https://wa.me/8608449199" // Replace with your WhatsApp link
          target="_blank"
          sx={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 60,
            height: 60,
            backgroundColor: '#25d366', // WhatsApp green color
            borderRadius: '50%',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            '&:hover .btn-whatsapp-pulse-border::before': {
              animation: 'none', // Stop the animation on hover
            },
            textDecoration: 'none',
            color: 'white',
          }}
          className="btn-whatsapp-pulse-border"
        >
          <i className="fab fa-whatsapp" style={{ fontSize: 30 }} /> {/* WhatsApp Icon */}
        </Box>
      </Box>
      <Box
  sx={{
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    py: 4,
    backgroundColor: 'white',
    color: 'black',
    padding: '20px',
    boxSizing: 'border-box',
    marginTop: '10px',
    height: '300px', // Set the height to a fixed value
    overflow: 'hidden', // Hide any content that overflows
   // backgroundImage: `url(${foot})`, // Replace with your background image URL
    backgroundSize: 'cover', // Cover the entire area of the box
    backgroundPosition: 'center', // Center the background image
  }}
>
  {/* Image and WellNest Text Column */}
  <Box
    sx={{
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      py: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.8)', // Light background to enhance readability
    }}
  >
    <img
      src={bottom} // Replace with your logo URL
      alt="WellNest Logo"
      style={{ width: '200px', height: '150px' }} // Adjust size as needed
    />
    <Typography variant="h4" gutterBottom>
      WellNest
    </Typography>
    <Box
      component="form"
      sx={{
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <input
        type="email"
        placeholder="Enter your email"
        style={{
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #ccc',
          marginRight: '8px',
        }}
      />
      <Button
        variant="contained"
        sx={{
          backgroundColor: '#03a9f4', // Button background color
          color: 'white', // Text color inside the button
          '&:hover': {
            backgroundColor: '#0288d1', // Slightly darker color on hover
          },
        }}
        type="submit"
      >
        Subscribe
      </Button>
    </Box>
  </Box>

  {/* Contact Address Column */}
  <Box
    sx={{
      flex: 1,
      minWidth: '200px',
      mx: 2,
      marginTop: 10,
      marginLeft: 10,
    }}
  >
    <Typography variant="h6" gutterBottom>
      Contact Address
    </Typography>
    <Typography variant="body1">
      123 WellNest St,<br />
      Health City, HC 12345<br />
      Country
    </Typography>
  </Box>

  {/* Services Column */}
  <Box
    sx={{
      flex: 1,
      minWidth: '200px',
      mx: 2,
      marginTop: 10,
    }}
  >
    <Typography variant="h6" gutterBottom>
      Services
    </Typography>
    <Typography variant="body1">
      1. General Check-ups<br />
      2. Pediatric Care<br />
      3. Dermatology<br />
      4. Cardiology<br />
      5. Orthopedics
    </Typography>
  </Box>

  {/* Help Column */}
  <Box
    sx={{
      flex: 1,
      minWidth: '200px',
      mx: 2,
      marginTop: 10,
    }}
  >
    <Typography variant="h6" gutterBottom>
      Help
    </Typography>
    <Typography variant="body1">
      Phone: +123 456 7890<br />
      Email: help@wellnest.com
    </Typography>
  </Box>
</Box>


  


      {/* Footer */}
      <Box sx={{ backgroundColor: '#f4f4f4', p: 2, mt: 4 }}>
        <Typography variant="body2" align="center">
          © 2024 WellNest. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default NewPage;
