import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Alert,
  AlertTitle,
  Link
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import { useToken } from '../../api/Token';
// import loginVideo from '../../assets/loginVideo.mp4';
import loveImage from '../../assets/so.jpg';
import './style.css';
import { motion } from 'framer-motion';


type AlertType = 'success' | 'error';
const LoginButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(90deg, #03a9f4, #f441a5, #ffeb3b, #03a9f4)',
  backgroundSize: '400%',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  padding: '8px 16px',
  fontSize: '14px',
  cursor: 'pointer',
  transition: 'background 0.3s',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  width: '150px',
  display: 'block', // Ensures the button is a block element
  margin: '0 auto', // Centers the button horizontally
  marginTop: '16px', // Adjust top margin as needed
  '&:hover': {
    animation: 'animate 8s linear infinite',
  },
  '@keyframes animate': {
    '0%': {
      backgroundPosition: '0%',
    },
    '100%': {
      backgroundPosition: '400%',
    },
  },
}));

const StyledLink = styled(Link)(({ theme }) => ({
  marginTop: theme.spacing(2),
  display: 'block',
  textAlign: 'center',
  fontSize: '16px',
  color: theme.palette.primary.main,
  cursor: 'pointer',
  textDecoration: 'underline',
}));

const RootContainer = styled(Container)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100vh',
  width: '100vw', // Ensure full width
  padding: theme.spacing(2),
  position: 'relative',
  overflow: 'hidden',
  zIndex: 1,
  backgroundImage: `url(${loveImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}));

const BackgroundVideo = styled('video')({
  position: 'fixed',
  right: 0,
  bottom: 0,
  minWidth: '100%',
  minHeight: '100%',
  zIndex: -1,
  opacity: 0.3,
  objectFit: 'cover',
});

const LoginFormContainer = styled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  width: '400px',
  backgroundColor: 'rgba(255, 255, 255, 0.3)',
  borderRadius: '10px',
  backdropFilter: 'blur(10px)',
  border: '1px solid white',
  marginRight: '600px', // Adjust this value to move the container left
  [theme.breakpoints.down('sm')]: {
    width: '90%',
    marginLeft: 'px', // Reset margin for small screens
  },
  [theme.breakpoints.down('lg')]: {
    marginRight: '0', // Adjust the margins for large screens
  },
  [theme.breakpoints.down('md')]: {
    width: '90%', // For medium screens, 90% of the width
  },
  [theme.breakpoints.down('sm')]: {
    width: '95%', // For small screens, 95% of the width
  },
}));



const AlertContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: theme.spacing(2),
  left: '50%',
  transform: 'translateX(-50%)',
  width: '45%',
  zIndex: 1500,
}));

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [alertState, setAlertState] = useState<{ type: AlertType | null; message: string }>({ type: null, message: '' });
  const navigate = useNavigate();
  const { setAccessToken, setRefreshToken } = useToken();

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

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/v1/auth/authenticate', { email, password });

      if (response.status === 200) {
        const { access_token, refresh_token } = response.data;

        // Fetch user details
        const userResponse = await axios.get(`http://localhost:8080/api/v1/users/${email}`, {
          headers: { Authorization: `Bearer ${access_token}` },
        });

        const user = userResponse.data;

        // Check user status
        if (user.address && user.address.status) {
          // Allow login if status is true
          setAccessToken(access_token);
          setRefreshToken(refresh_token);
          localStorage.setItem('username', email);
          localStorage.setItem('role', user.role);
          localStorage.setItem('id', user.id);

          setAlertState({ type: 'success', message: 'Login successful! Redirecting to dashboard...' });

          setTimeout(() => {
            if (user.role === 'SUPER_ADMIN') {
               navigate('/showOneClinic');
              //navigate('/portal');
            } else if (user.role === 'Manager') {
              navigate('/dashboard');
            } else if (user.role === 'DOCTOR' || user.role === 'ADMIN') {
              navigate('/dashboard/patients');
            } else {
              // Default navigation for any other roles
              navigate('/dashboard');
            }
          }, 2000);
          
        } else {
          // Deny login if status is false
          setAlertState({ type: 'error', message: 'Access denied. You need approval to log in.' });
        }
      }
    } catch (error) {
      setAlertState({ type: 'error', message: 'Login failed. Please check your credentials and try again.' });
      console.error('There was an error logging in!', error);
    }
  };
  const handleNavigateToNewPage = () => {
    navigate('/new-page');
  
  };

  return (
    <RootContainer maxWidth="lg">
      {alertState.type && (
        <AlertContainer>
          <Alert severity={alertState.type} onClose={() => setAlertState({ type: null, message: '' })}>
            <AlertTitle>{alertState.type === 'success' ? 'Success' : 'Error'}</AlertTitle>
            {alertState.message}
          </Alert>
        </AlertContainer>
      )}
      <BackgroundVideo autoPlay muted loop>
        {/* <source src={loginVideo} type="video/mp4" /> */}
      </BackgroundVideo>
      <LoginFormContainer>
        <motion.div
          initial={{ x: '-100vw' }}
          animate={{ x: 0 }}
          transition={{ type: 'spring', stiffness: 50 }}
        >
      <Typography
      variant="h4"
      gutterBottom
      sx={{
        fontWeight: 'bold',
        fontStyle: 'italic',
        background: 'linear-gradient(270deg, #ff1a1a, #1aff1a, #1a1aff, #ffff1a)',
        backgroundSize: '420% 40%',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        animation: 'gradientMove 8s ease infinite',
      }}
    >
      WellNest
    </Typography>



        </motion.div>
        <motion.div
          initial={{ x: '100vw' }}
          animate={{ x: 0 }}
          transition={{ type: 'spring', stiffness: 50 }}
        >
      <Typography
  variant="h6"
  gutterBottom
  sx={{
    fontFamily: 'Arial, sans-serif',
    fontStyle: 'revert-layer',
    fontWeight: 'bold',
  }}
>
  Login
</Typography>

        </motion.div>

        <form onSubmit={handleLogin}>
        <TextField
    label="Email"
    variant="outlined"
    fullWidth
    margin="normal"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
    sx={{
      // '& .MuiOutlinedInput-root': {
      //   '& fieldset': {
      //     borderColor: '#03a9f4',
      //   },
      //   '&:hover fieldset': {
      //     borderColor: '#f441a5',
      //   },
      //   '&.Mui-focused fieldset': {
      //     borderColor: '#ffeb3b',
      //   },
      // },
      '& .MuiInputLabel-root': {
        color: '#03a9f4',
        transform: 'translate(10px, -6px) scale(0.9)', // Overlapping effect
      },
      '& .MuiInputLabel-root.Mui-focused': {
        color: '#ff007f',
        transform: 'translate(10px, -6px) scale(0.9)', // Overlapping effect
      },
      '& .MuiInputLabel-shrink': {
        transform: 'translate(10px, -6px) scale(0.75)', // Shrink label on focus
      },
    }}
  />
  <TextField
    label="Password"
    variant="outlined"
    type="password"
    fullWidth
    margin="normal"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    required
    sx={{
      // '& .MuiOutlinedInput-root': {
      //   '& fieldset': {
      //     borderColor: '#03a9f4',
      //   },
      //   '&:hover fieldset': {
      //     borderColor: '#f441a5',
      //   },
      //   '&.Mui-focused fieldset': {
      //     borderColor: '#ffeb3b',
      //   },
      // },
      '& .MuiInputLabel-root': {
        color: '#03a9f4',
        transform: 'translate(10px, -6px) scale(0.9)', // Overlapping effect
      },
      '& .MuiInputLabel-root.Mui-focused': {
        color: '#ff007f',
        transform: 'translate(10px, -6px) scale(0.9)', // Overlapping effect
      },
      '& .MuiInputLabel-shrink': {
        transform: 'translate(10px, -6px) scale(0.75)', // Shrink label on focus
      },
    }}
  />
          <LoginButton type="submit" variant="contained" >
            Login
          </LoginButton>
          <StyledLink onClick={handleNavigateToNewPage}>
          Do you know about us? Click here
        </StyledLink>
        </form>
      </LoginFormContainer>
    </RootContainer>
  );
};

export default LoginForm;
