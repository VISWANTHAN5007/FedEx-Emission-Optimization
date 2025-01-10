import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Box,
  Button,
  Tab,
  Tabs,
  Paper
} from '@mui/material';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { motion } from 'framer-motion';
import { jsPDF } from 'jspdf';
import { format } from 'date-fns';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function Dashboard({ route }) {
  const [tab, setTab] = React.useState(0);

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text('Route Summary Report', 20, 20);
    doc.text(`Distance: ${route.distance.toFixed(2)} km`, 20, 40);
    doc.text(`Duration: ${(route.duration / 60).toFixed(2)} hours`, 20, 50);
    doc.text(`Emissions: ${route.emissions.toFixed(2)} g CO2`, 20, 60);
    doc.text(`Traffic Conditions: ${route.traffic}`, 20, 70);
    doc.text(`Weather: ${route.weather}`, 20, 80);
    doc.save('route-report.pdf');
  };

  // Mock historical data
  const historicalData = Array.from({ length: 7 }, (_, i) => ({
    date: format(new Date(Date.now() - i * 24 * 60 * 60 * 1000), 'MM/dd'),
    emissions: Math.random() * 1000 + 500,
    distance: Math.random() * 100 + 50,
    efficiency: Math.random() * 20 + 80
  }));

  const emissionsData = [
    { name: 'Current Route', value: route.emissions },
    { name: 'Alternative 1', value: route.emissions * 1.2 },
    { name: 'Alternative 2', value: route.emissions * 0.8 },
    { name: 'Alternative 3', value: route.emissions * 0.9 }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Paper sx={{ m: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)}>
            <Tab label="Overview" />
            <Tab label="Historical" />
            <Tab label="Environmental Impact" />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          {tab === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Route Comparison
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={emissionsData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label
                      >
                        {emissionsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Real-time Metrics
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer>
                    <AreaChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="efficiency" stroke="#82ca9d" fill="#82ca9d" />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>
            </Grid>
          )}

          {tab === 1 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Historical Performance
                </Typography>
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer>
                    <LineChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="emissions" stroke="#8884d8" />
                      <Line yAxisId="right" type="monotone" dataKey="distance" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>
            </Grid>
          )}

          {tab === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Environmental Impact
                </Typography>
                <Box sx={{ height: 400 }}>
                  <ResponsiveContainer>
                    <BarChart data={historicalData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="emissions" fill="#8884d8" />
                      <Bar dataKey="efficiency" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Grid>
            </Grid>
          )}

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="contained" 
              color="primary"
              onClick={handleExportPDF}
            >
              Export Report
            </Button>
          </Box>
        </Box>
      </Paper>
    </motion.div>
  );
}