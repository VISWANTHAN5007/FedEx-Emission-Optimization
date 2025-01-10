import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, useMap, LayerGroup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Box, Paper, Typography } from '@mui/material';
import { motion } from 'framer-motion';

// Fix for default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom draggable marker
const DraggableMarker = ({ position, onDragEnd }) => {
  return (
    <Marker 
      position={position} 
      draggable={true}
      eventHandlers={{
        dragend: (e) => onDragEnd(e.target.getLatLng())
      }}
    />
  );
};

// Traffic overlay component
const TrafficOverlay = ({ trafficData }) => {
  const map = useMap();
  
  useEffect(() => {
    if (!trafficData) return;
    
    trafficData.forEach(segment => {
      const color = segment.congestion === 'high' ? '#ff0000' :
                   segment.congestion === 'medium' ? '#ffff00' : '#00ff00';
      
      new L.Polyline(segment.coordinates, {
        color,
        weight: 4,
        opacity: 0.6
      }).addTo(map);
    });
  }, [trafficData, map]);

  return null;
};

// Weather overlay component
const WeatherOverlay = ({ weatherData }) => {
  const map = useMap();
  
  useEffect(() => {
    if (!weatherData) return;

    weatherData.forEach(point => {
      const icon = L.divIcon({
        html: `<div class="weather-icon">${point.icon}</div>`,
        className: 'weather-marker'
      });
      
      L.marker(point.coordinates, { icon }).addTo(map);
    });
  }, [weatherData, map]);

  return null;
};

export default function Map({ route, darkMode, alternatives = [], onWaypointChange }) {
  const position = [40.7128, -74.0060];
  const [selectedRoute, setSelectedRoute] = useState(null);

  // Mock traffic and weather data
  const mockTrafficData = [
    { coordinates: [[40.7128, -74.0060], [40.7200, -74.0000]], congestion: 'high' },
    { coordinates: [[40.7200, -74.0000], [40.7300, -73.9900]], congestion: 'medium' },
  ];

  const mockWeatherData = [
    { coordinates: [40.7128, -74.0060], icon: '🌤️' },
    { coordinates: [40.7300, -73.9900], icon: '🌧️' },
  ];

  return (
    <Box sx={{ height: '100%', width: '100%', position: 'relative' }}>
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url={darkMode ? 
            'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' :
            'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          }
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        
        <TrafficOverlay trafficData={mockTrafficData} />
        <WeatherOverlay weatherData={mockWeatherData} />

        {route?.waypoints && (
          <LayerGroup>
            <DraggableMarker 
              position={route.waypoints[0]}
              onDragEnd={(pos) => onWaypointChange('start', [pos.lat, pos.lng])}
            />
            <DraggableMarker 
              position={route.waypoints[route.waypoints.length - 1]}
              onDragEnd={(pos) => onWaypointChange('end', [pos.lat, pos.lng])}
            />
            <Polyline
              positions={route.waypoints}
              color={darkMode ? '#82ca9d' : '#1976d2'}
              weight={3}
              opacity={0.7}
            />
          </LayerGroup>
        )}

        {alternatives.map((alt, index) => (
          <Polyline
            key={index}
            positions={alt.waypoints}
            color={selectedRoute === index ? '#4CAF50' : '#9E9E9E'}
            weight={2}
            opacity={0.5}
            eventHandlers={{
              click: () => setSelectedRoute(index)
            }}
          />
        ))}
      </MapContainer>

      {/* Route comparison panel */}
      {alternatives.length > 0 && (
        <Paper
          component={motion.div}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          sx={{
            position: 'absolute',
            top: 20,
            right: 20,
            p: 2,
            maxWidth: 300,
            zIndex: 1000
          }}
        >
          <Typography variant="h6" gutterBottom>
            Alternative Routes
          </Typography>
          {alternatives.map((alt, index) => (
            <Box
              key={index}
              sx={{
                p: 1,
                cursor: 'pointer',
                bgcolor: selectedRoute === index ? 'action.selected' : 'transparent'
              }}
              onClick={() => setSelectedRoute(index)}
            >
              <Typography variant="body2">
                Route {index + 1}: {alt.duration.toFixed(0)} min, {alt.emissions.toFixed(0)}g CO2
              </Typography>
            </Box>
          ))}
        </Paper>
      )}
    </Box>
  );
}