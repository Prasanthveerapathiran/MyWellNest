import React from 'react';
import { Drawer as MUIDrawer, List, ListItem, ListItemIcon, ListItemText, Divider, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import EventIcon from '@mui/icons-material/Event';
import ReceiptIcon from '@mui/icons-material/Receipt';
import HealingIcon from '@mui/icons-material/Healing';
import ScheduleIcon from '@mui/icons-material/Schedule'; // Import ScheduleIcon from Material-UI
import classes from '../drawer.module.css';


interface DrawerProps {
  drawerOpen: boolean;
  toggleDrawer: (open: boolean) => void;
}

const drawerWidth = 240;

const Drawer: React.FC<DrawerProps> = ({ drawerOpen, toggleDrawer }) => {
  const userRole = localStorage.getItem('role');

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', roles: ['MANAGER', 'DOCTOR','ADMIN'] },
    { text: 'Patients', icon: <PeopleIcon />, path: '/dashboard/patients', roles: ['ADMIN', 'MANAGER', 'DOCTOR'] },
    { text: 'Appointments', icon: <ScheduleIcon />, path: '/dashboard/appointments', roles: ['ADMIN','MANAGER', 'DOCTOR'] },
    // { text: 'Payments', icon: <ReceiptIcon />, path: '/dashboard/payments', roles: ['ADMIN', 'MANAGER', 'DOCTOR'] },
     { text: 'Doctors', icon: <MedicalServicesIcon />, path: '/dashboard/doctors' , roles: [ 'MANAGER', 'DOCTOR'] },
    // { text: 'Diagnosis', icon: <MedicalServicesIcon />, path: '/dashboard/diagnosis', roles: ['DOCTOR'] },
    // { text: 'Treatments', icon: <HealingIcon />, path: '/dashboard/treatments', roles: ['DOCTOR'] },
    { text: 'Invoices', icon: <ReceiptIcon />, path: '/dashboard/invoices', roles: ['ADMIN', 'MANAGER'] },
    { text: 'ourdoctors', icon: <LocalHospitalIcon />, path: '/dashboard/ourdoctors',roles: ['ADMIN', ] },
    { text: 'consultation', icon: <LocalHospitalIcon />, path: '/dashboard/record', roles: ['DOCTOR'] },
    //  { text: 'medition stack', icon: <LocalHospitalIcon />, path: '/dashboard/medications', roles: ['ADMIN'] },
   


  ];

  return (
    <MUIDrawer
      variant="temporary"
      open={drawerOpen}
      onClose={() => toggleDrawer(false)}
      classes={{ paper: classes.drawerPaper }}
      ModalProps={{ keepMounted: true }}
    >
   <Box
        sx={{
          height: '10%',
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2,
          paddingLeft: 0,
          boxShadow: 1,
        }}
        
      >
        <div className={classes.side}>
          <img src='../../src/assets/eye.png' alt='eye' />
        <div className={classes.text}>
        <Typography variant="h6" color="primary">Wellnest</Typography>
          <Typography variant="caption" color="primary">Medical Records</Typography>
        </div>
        </div>
      </Box>
        <Divider />
        <List>
          {menuItems
            .filter((item) => item.roles.includes(userRole || ''))
            .map((item) => (
              <ListItem
                button
                key={item.text}
                component={Link}
                to={item.path}
                onClick={() => toggleDrawer(false)}
                sx={{
                  '&:hover': {
                    backgroundColor: '#f0f0f0',
                  },
                }}
              >
                <ListItemIcon sx={{ color: '#1976d2' }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
        </List>
        <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          backgroundColor: 'white',
          display: 'flex',
          justifyContent: 'center',
          padding: 2,
          boxShadow: 1,
        }}
      >
        <Typography variant="caption" color="textSecondary">
          Wellnest@gmail.com
        </Typography>
      </Box>
    </MUIDrawer>
  );
};

export default Drawer;