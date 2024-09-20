// src/components/DashboardLayout.tsx

import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import Appbar from '../../tools/Appbar';
import Drawer from '../../tools/Drawer';

const DashboardLayout: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <Appbar toggleDrawer={toggleDrawer} />
      <Drawer drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: 'transform 0.3s ease',
          transform: drawerOpen ? 'translateX(240px)' : 'translateX(0)',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
