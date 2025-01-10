import React, { useState } from 'react';
import { Container, Box, CssBaseline, useMediaQuery } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import Map from './components/Map';
import RouteForm from './components/RouteForm';
import RouteDetails from './components/RouteDetails';
import Dashboard from './components/Dashboard';
import ThemeToggle from './components/ThemeToggle';
import { calculateRoute } from './utils/routeOptimizer';

export default function App() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = useState(prefersDarkMode);
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#1976d2',
      },
      secondary: {
        main: '#dc004e',
      },
    },
  });

  const handleCalculateRoute = async (start, end, vehicleType) => {
    setLoading(true);
    try {
      const result = calculateRoute(start, end, vehicleType, new Date());
      setRoute(result);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth={false} disableGutters>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          height: '100vh'
        }}>
          <Box 
            component={motion.div}
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            sx={{ 
              width: { xs: '100%', md: '400px' },
              backgroundColor: theme.palette.background.paper,
              borderRight: `1px solid ${theme.palette.divider}`,
              overflow: 'auto'
            }}
          >
            <Box sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <ThemeToggle darkMode={darkMode} setDarkMode={setDarkMode} />
              </Box>
              <RouteForm onCalculate={handleCalculateRoute} loading={loading} />
              {route && <RouteDetails route={route} />}
            </Box>
          </Box>
          
          <Box sx={{ flexGrow: 1, height: '100%' }}>
            <Map route={route} darkMode={darkMode} />
          </Box>
        </Box>
        
        {route && (
          <Box
            component={motion.div}
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring' }}
          >
            <Dashboard route={route} />
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
}