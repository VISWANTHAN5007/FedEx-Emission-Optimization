import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export default function RouteDetails({ route }) {
  if (!route) return null;

  const emissionsData = [
    {
      name: 'Current Route',
      emissions: route.emissions
    }
  ];

  return (
    <Card sx={{ mt: 4 }}>
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Route Summary
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="body1">
                Distance: {route.distance.toFixed(2)} km
              </Typography>
              <Typography variant="body1">
                Duration: {(route.duration / 60).toFixed(2)} hours
              </Typography>
              <Typography variant="body1">
                Traffic Conditions: {route.traffic}
              </Typography>
              <Typography variant="body1">
                Weather: {route.weather}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Emissions Impact
            </Typography>
            <Box sx={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={emissionsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'CO2 Emissions (g)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Bar dataKey="emissions" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}