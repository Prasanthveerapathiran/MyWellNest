import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Typography, Drawer, List, ListItem, ListItemText, Avatar, Box, Container } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Outlet, useNavigate } from 'react-router-dom';

const Portal: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const username = 'John Doe'; // Replace this with dynamic username if needed

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  return (
    <>
      {/* AppBar with Menu Icon and User Info */}
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => toggleDrawer(true)}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            SuperAdmin Portal
          </Typography>

          {/* User Avatar and Username on the right side */}
          <Box display="flex" alignItems="center">
            <Typography variant="body1" style={{ marginRight: '10px' }}>
              {username}
            </Typography>
            <Avatar alt={username} src="/static/images/avatar/1.jpg" />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => toggleDrawer(false)}>
        <List>
          <ListItem button onClick={() => navigate('/portal/dashboardSuperAdmin')}>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button onClick={() => navigate('/portal/users')}>
            <ListItemText primary="Manage Users" />
          </ListItem>
          <ListItem button onClick={() => navigate('/portal/settings')}>
            <ListItemText primary="Settings" />
          </ListItem>
        </List>
      </Drawer>

      {/* Main Content Area */}
      <Container style={{ marginTop: '20px' }}>
        {/* Outlet will render the specific content for the current route */}
        <Outlet />
      </Container>
    </>
  );
};

export default Portal;
