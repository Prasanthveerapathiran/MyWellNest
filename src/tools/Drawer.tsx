import React, { useState } from 'react';
import {
  Drawer as MUIDrawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Typography,
  Collapse,
} from '@mui/material';
import { Link } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ScheduleIcon from '@mui/icons-material/Schedule';
import ReceiptIcon from '@mui/icons-material/Receipt';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import classes from '../drawer.module.css';

interface DrawerProps {
  drawerOpen: boolean;
  toggleDrawer: (open: boolean) => void;
}

type MenuItem = {
  text: string;
  icon: React.ReactNode;
  path?: string | (() => string);
  roles: string[];
  subItems?: MenuItem[]; // Added for nested items
};

const Drawer: React.FC<DrawerProps> = ({ drawerOpen, toggleDrawer }) => {
  const userRole = localStorage.getItem('roleName');
  const doctorId = localStorage.getItem('doctorId');
  const [openSubMenu, setOpenSubMenu] = useState(false);

  const handleToggleSubMenu = () => {
    setOpenSubMenu((prevOpen) => !prevOpen);
  };

  const menuItems: MenuItem[] = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard', roles: ['MANAGER'] },
    { text: 'Patients', icon: <PeopleIcon />, path: '/dashboard/patients', roles: ['ADMIN', 'MANAGER', 'FRONT_DESK'] },
    {
      text: 'Appointments',
      icon: <ScheduleIcon />,
      roles: ['ADMIN', 'MANAGER', 'DOCTOR'],
      subItems: [
        {
          text: 'New Patient',
          icon: <ScheduleIcon />,
          path: '/dashboard/newPatient',
          roles: ['ADMIN', 'MANAGER', 'DOCTOR'],
        },
        {
          text: 'Our Patient',
          icon: <ScheduleIcon />,
          path: '/dashboard/appointments',
          roles: ['ADMIN', 'MANAGER', 'DOCTOR'],
        },
      ],
    },
    {
      text: 'My History',
      icon: <MedicalServicesIcon />,
      path: () => (doctorId ? `/dashboard/doctor-details/${doctorId}` : '/dashboard'),
      roles: ['DOCTOR'],
    },
    { text: 'Invoices', icon: <ReceiptIcon />, path: '/dashboard/invoices', roles: ['ADMIN', 'MANAGER'] },
    { text: 'Our Staff', icon: <LocalHospitalIcon />, path: '/dashboard/ourdoctors', roles: ['ADMIN'] },
    { text: 'Front Desk', icon: <LocalHospitalIcon />, path: '/dashboard/frontdesk', roles: ['FRONT_DESK'] },
  ];

  return (
    <MUIDrawer
      variant="temporary"
      open={drawerOpen}
      onClose={() => toggleDrawer(false)}
      classes={{ paper: classes.drawerPaper }}
      ModalProps={{ keepMounted: true }}
    >
      {/* Drawer Header */}
      <Box
        sx={{
          height: '10%',
          backgroundColor: 'white',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2,
          boxShadow: 1,
        }}
      >
        <div className={classes.side}>
          <img src="/src/assets/eye.png" alt="eye" />
          <div className={classes.text}>
            <Typography variant="h6" color="primary">
              Wellnest
            </Typography>
            <Typography variant="caption" color="primary">
              Medical Records
            </Typography>
          </div>
        </div>
      </Box>

      <Divider />

      {/* Menu List */}
      <List>
        {menuItems
          .filter((item) => item.roles.includes(userRole || ''))
          .map((item) => {
            if (item.subItems) {
              // Handle sub-menu items
              return (
                <React.Fragment key={item.text}>
                  <ListItem button onClick={handleToggleSubMenu}>
                    <ListItemIcon sx={{ color: '#1976d2' }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                    {openSubMenu ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse in={openSubMenu} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.subItems
                        .filter((subItem) => subItem.roles.includes(userRole || ''))
                        .map((subItem) => (
                          <ListItem
                            key={subItem.text}
                            button
                            component={Link}
                            to={typeof subItem.path === 'function' ? subItem.path() : subItem.path!}
                            onClick={() => toggleDrawer(false)}
                            sx={{
                              pl: 4,
                              '&:hover': {
                                backgroundColor: '#f0f0f0',
                              },
                            }}
                          >
                            <ListItemIcon sx={{ color: '#1976d2' }}>{subItem.icon}</ListItemIcon>
                            <ListItemText primary={subItem.text} />
                          </ListItem>
                        ))}
                    </List>
                  </Collapse>
                </React.Fragment>
              );
            }
            return (
              <ListItem
                button
                key={item.text}
                component={Link}
                to={typeof item.path === 'function' ? item.path() : item.path!}
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
            );
          })}
      </List>

      <Divider />

      {/* Footer */}
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
