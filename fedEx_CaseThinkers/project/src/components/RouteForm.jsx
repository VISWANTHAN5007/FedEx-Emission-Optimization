import React, { useState } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Typography,
  Alert,
  Chip,
  Paper
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { vehicleTypes } from '../utils/routeOptimizer';
import { motion } from 'framer-motion';

// Simplified address input component without external dependencies
function AddressInput({ value, onChange, label }) {
  return (
    <TextField
      fullWidth
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      variant="outlined"
    />
  );
}

export default function RouteForm({ onCalculate, loading }) {
  const [formData, setFormData] = useState({
    startAddress: '',
    endAddress: '',
    vehicleType: 'hybrid',
    timeWindow: {
      start: '09:00',
      end: '17:00'
    },
    optimizationPreference: 'balanced'
  });

  const [waypoints, setWaypoints] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [newWaypoint, setNewWaypoint] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert addresses to coordinates (mock implementation)
    const start = [40.7128, -74.0060]; // New York coordinates
    const end = [40.7589, -73.9851]; // Times Square coordinates
    
    onCalculate(start, end, formData.vehicleType, {
      timeWindow: formData.timeWindow,
      waypoints,
      optimizationPreference: formData.optimizationPreference
    });
  };

  const handleAddWaypoint = () => {
    if (newWaypoint.trim()) {
      setWaypoints([...waypoints, { id: Date.now().toString(), address: newWaypoint }]);
      setNewWaypoint('');
    }
  };

  const handleMoveWaypoint = (fromIndex, toIndex) => {
    const updatedWaypoints = [...waypoints];
    const [movedItem] = updatedWaypoints.splice(fromIndex, 1);
    updatedWaypoints.splice(toIndex, 0, movedItem);
    setWaypoints(updatedWaypoints);
  };

  const addAlert = (message, severity = 'info') => {
    const id = Date.now();
    setAlerts(prev => [...prev, { id, message, severity }]);
    setTimeout(() => {
      setAlerts(prev => prev.filter(alert => alert.id !== id));
    }, 5000);
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Route Planning
        </Typography>

        {alerts.map(alert => (
          <Alert 
            key={alert.id} 
            severity={alert.severity}
            sx={{ mb: 2 }}
          >
            {alert.message}
          </Alert>
        ))}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <AddressInput
                label="Start Address"
                value={formData.startAddress}
                onChange={(value) => setFormData(prev => ({ ...prev, startAddress: value }))}
              />
            </Grid>

            <Grid item xs={12}>
              <AddressInput
                label="End Address"
                value={formData.endAddress}
                onChange={(value) => setFormData(prev => ({ ...prev, endAddress: value }))}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Waypoints
              </Typography>
              <Box sx={{ mb: 2 }}>
                {waypoints.map((waypoint, index) => (
                  <Chip
                    key={waypoint.id}
                    label={waypoint.address}
                    onDelete={() => {
                      setWaypoints(waypoints.filter(w => w.id !== waypoint.id));
                    }}
                    sx={{ width: '100%', mb: 1 }}
                  />
                ))}
              </Box>

              <Box sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Add Waypoint"
                  value={newWaypoint}
                  onChange={(e) => setNewWaypoint(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddWaypoint();
                    }
                  }}
                />
                <LoadingButton
                  variant="outlined"
                  onClick={handleAddWaypoint}
                  disabled={!newWaypoint.trim()}
                >
                  Add
                </LoadingButton>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Vehicle Type</InputLabel>
                <Select
                  value={formData.vehicleType}
                  onChange={(e) => setFormData(prev => ({ ...prev, vehicleType: e.target.value }))}
                  label="Vehicle Type"
                >
                  {Object.entries(vehicleTypes).map(([key, value]) => (
                    <MenuItem key={key} value={key}>
                      {value.description}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Optimization Preference</InputLabel>
                <Select
                  value={formData.optimizationPreference}
                  onChange={(e) => setFormData(prev => ({ ...prev, optimizationPreference: e.target.value }))}
                  label="Optimization Preference"
                >
                  <MenuItem value="balanced">Balanced</MenuItem>
                  <MenuItem value="eco">Eco-Friendly</MenuItem>
                  <MenuItem value="fast">Fastest Route</MenuItem>
                  <MenuItem value="cost">Cost Effective</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                type="time"
                label="Delivery Start Time"
                value={formData.timeWindow.start}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  timeWindow: { ...prev.timeWindow, start: e.target.value }
                }))}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                type="time"
                label="Delivery End Time"
                value={formData.timeWindow.end}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  timeWindow: { ...prev.timeWindow, end: e.target.value }
                }))}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <LoadingButton
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                loading={loading}
              >
                Calculate Optimal Route
              </LoadingButton>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
}