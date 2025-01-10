// Enhanced route optimizer with additional features
import { io } from 'socket.io-client';

// Vehicle types with detailed specifications
export const vehicleTypes = {
  electric: { 
    emissions: 0,
    description: "Electric Vehicle",
    range: 400,
    chargingTime: 45,
    costPerKm: 0.05
  },
  hybrid: { 
    emissions: 100,
    description: "Hybrid Vehicle",
    range: 800,
    fuelEfficiency: 4.5,
    costPerKm: 0.08
  },
  gasoline: { 
    emissions: 200,
    description: "Gasoline Vehicle",
    range: 600,
    fuelEfficiency: 7.5,
    costPerKm: 0.12
  },
  diesel: { 
    emissions: 250,
    description: "Diesel Vehicle",
    range: 900,
    fuelEfficiency: 6.0,
    costPerKm: 0.10
  }
};

// Enhanced traffic conditions with more detailed factors
const trafficConditions = {
  low: { factor: 1.0, description: "Light traffic", fuelImpact: 1.0 },
  medium: { factor: 1.3, description: "Moderate traffic", fuelImpact: 1.2 },
  high: { factor: 1.8, description: "Heavy traffic", fuelImpact: 1.5 },
  severe: { factor: 2.5, description: "Severe congestion", fuelImpact: 2.0 }
};

// Expanded weather impact factors
const weatherImpact = {
  clear: { factor: 1.0, description: "Clear weather", visibility: "good" },
  cloudy: { factor: 1.1, description: "Cloudy", visibility: "moderate" },
  rain: { factor: 1.2, description: "Rainy conditions", visibility: "reduced" },
  snow: { factor: 1.5, description: "Snowy conditions", visibility: "poor" },
  storm: { factor: 2.0, description: "Severe weather", visibility: "very poor" }
};

// Socket connection for real-time updates
const socket = io('wss://mock-traffic-api.example.com', {
  autoConnect: false
});

function calculateMainRoute(start, end, vehicleType, currentTime) {
  const distance = calculateDistance(start, end);
  const traffic = getCurrentTraffic(currentTime);
  const weather = getCurrentWeather(currentTime);
  
  const duration = distance * traffic.factor * weather.factor;
  const emissions = calculateEmissions(distance, vehicleType);
  
  return {
    distance,
    duration,
    emissions,
    traffic: traffic.description,
    weather: weather.description,
    waypoints: generateWaypoints(start, end)
  };
}

function generateAlternativeRoutes(start, end, vehicleType, currentTime) {
  const alternatives = [];
  const variations = [0.9, 1.1, 1.2]; // Distance variations for alternatives

  variations.forEach(variation => {
    const altDistance = calculateDistance(start, end) * variation;
    const traffic = getCurrentTraffic(currentTime);
    const weather = getCurrentWeather(currentTime);
    
    alternatives.push({
      distance: altDistance,
      duration: altDistance * traffic.factor * weather.factor,
      emissions: calculateEmissions(altDistance, vehicleType),
      traffic: traffic.description,
      weather: weather.description,
      waypoints: generateWaypoints(start, end, variation)
    });
  });

  return alternatives;
}

function calculateEnvironmentalImpact(route, vehicleType) {
  const vehicle = vehicleTypes[vehicleType];
  return {
    totalEmissions: route.emissions,
    carbonOffset: calculateCarbonOffset(route.emissions),
    environmentalScore: calculateEnvironmentalScore(route.emissions, vehicle),
    recommendations: generateEcoRecommendations(route, vehicle)
  };
}

function calculateCostAnalysis(route, vehicleType) {
  const vehicle = vehicleTypes[vehicleType];
  const fuelCost = route.distance * vehicle.costPerKm;
  const maintenanceCost = route.distance * 0.02; // Simplified maintenance cost

  return {
    fuelCost,
    maintenanceCost,
    totalCost: fuelCost + maintenanceCost,
    costPerKm: (fuelCost + maintenanceCost) / route.distance
  };
}

function calculateTimeWindows(route) {
  const baseTime = new Date();
  const arrivalTime = new Date(baseTime.getTime() + route.duration * 60000);
  
  return {
    estimatedDeparture: baseTime,
    estimatedArrival: arrivalTime,
    optimalDepartureWindows: calculateOptimalDepartureWindows(route)
  };
}

function predictTrafficPattern(waypoints, currentTime) {
  return waypoints.map((waypoint, index) => {
    const timeOffset = index * 15; // 15 minutes between waypoints
    const predictedTime = new Date(currentTime.getTime() + timeOffset * 60000);
    return {
      location: waypoint,
      time: predictedTime,
      traffic: getCurrentTraffic(predictedTime).description,
      congestionLevel: calculateCongestionLevel(predictedTime)
    };
  });
}

// Helper functions
function calculateDistance(start, end) {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(end[0] - start[0]);
  const dLon = toRad(end[1] - start[1]);
  const lat1 = toRad(start[0]);
  const lat2 = toRad(end[0]);

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function toRad(degrees) {
  return degrees * Math.PI / 180;
}

function getCurrentTraffic(time) {
  const hour = time.getHours();
  if (hour >= 7 && hour <= 9) return trafficConditions.high;
  if (hour >= 16 && hour <= 18) return trafficConditions.high;
  if (hour >= 10 && hour <= 15) return trafficConditions.medium;
  return trafficConditions.low;
}

function getCurrentWeather(time) {
  const random = Math.random();
  if (random < 0.6) return weatherImpact.clear;
  if (random < 0.8) return weatherImpact.cloudy;
  if (random < 0.9) return weatherImpact.rain;
  if (random < 0.95) return weatherImpact.snow;
  return weatherImpact.storm;
}

function calculateEmissions(distance, vehicleType) {
  return distance * vehicleTypes[vehicleType].emissions;
}

function generateWaypoints(start, end, variation = 1) {
  const points = [];
  const steps = 10;
  const midLat = (start[0] + end[0]) / 2 + (Math.random() - 0.5) * 0.01 * variation;
  const midLng = (start[1] + end[1]) / 2 + (Math.random() - 0.5) * 0.01 * variation;
  
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lat = start[0] * (1-t) * (1-t) + midLat * 2 * (1-t) * t + end[0] * t * t;
    const lng = start[1] * (1-t) * (1-t) + midLng * 2 * (1-t) * t + end[1] * t * t;
    points.push([lat, lng]);
  }
  
  return points;
}

function calculateCarbonOffset(emissions) {
  return emissions * 0.5; // Simplified carbon offset calculation
}

function calculateEnvironmentalScore(emissions, vehicle) {
  const baseScore = 100;
  const emissionsFactor = emissions / 1000;
  return Math.max(0, Math.min(100, baseScore - emissionsFactor * 10));
}

function generateEcoRecommendations(route, vehicle) {
  const recommendations = [];
  
  if (route.emissions > 200) {
    recommendations.push("Consider using an electric vehicle for this route");
  }
  
  if (route.traffic === trafficConditions.high.description) {
    recommendations.push("Try traveling during off-peak hours to reduce emissions");
  }
  
  return recommendations;
}

function calculateOptimalDepartureWindows(route) {
  const windows = [];
  const baseTime = new Date();
  
  for (let hour = 0; hour < 24; hour++) {
    const time = new Date(baseTime);
    time.setHours(hour);
    const traffic = getCurrentTraffic(time);
    
    if (traffic.factor <= trafficConditions.medium.factor) {
      windows.push({
        startTime: new Date(time),
        endTime: new Date(time.getTime() + 60 * 60000),
        trafficLevel: traffic.description
      });
    }
  }
  
  return windows;
}

function calculateCongestionLevel(time) {
  const traffic = getCurrentTraffic(time);
  return {
    level: traffic.description,
    factor: traffic.factor,
    impact: traffic.fuelImpact
  };
}

// Enhanced route calculation with multiple factors
export function calculateRoute(start, end, vehicleType, currentTime, options = {}) {
  const {
    includeAlternatives = true,
    considerTimeWindows = true,
    optimizeForEmissions = true
  } = options;

  // Calculate base route
  const mainRoute = calculateMainRoute(start, end, vehicleType, currentTime);
  
  // Generate alternatives if requested
  const alternatives = includeAlternatives ? 
    generateAlternativeRoutes(start, end, vehicleType, currentTime) : [];

  // Calculate environmental impact
  const environmentalImpact = calculateEnvironmentalImpact(mainRoute, vehicleType);

  // Calculate cost analysis
  const costAnalysis = calculateCostAnalysis(mainRoute, vehicleType);

  return {
    ...mainRoute,
    alternatives,
    environmentalImpact,
    costAnalysis,
    timeWindows: considerTimeWindows ? calculateTimeWindows(mainRoute) : null,
    weatherImpact: getWeatherImpact(mainRoute.waypoints, currentTime),
    trafficPrediction: predictTrafficPattern(mainRoute.waypoints, currentTime)
  };
}

function getWeatherImpact(waypoints, currentTime) {
  const weatherConditions = [];
  const baseWeather = getCurrentWeather(currentTime);
  
  waypoints.forEach((waypoint, index) => {
    const random = Math.random();
    let condition = baseWeather;
    
    if (random > 0.8) {
      condition = getCurrentWeather(currentTime);
    }
    
    weatherConditions.push({
      location: waypoint,
      condition: condition.description,
      visibility: condition.visibility,
      impact: condition.factor,
      warning: condition.factor > 1.3 ? "Adverse weather conditions" : null
    });
  });
  
  return {
    conditions: weatherConditions,
    overallImpact: calculateAverageImpact(weatherConditions),
    warnings: generateWeatherWarnings(weatherConditions)
  };
}

function calculateAverageImpact(conditions) {
  const sum = conditions.reduce((acc, curr) => acc + curr.impact, 0);
  return sum / conditions.length;
}

function generateWeatherWarnings(conditions) {
  return conditions
    .filter(c => c.warning)
    .map(c => ({
      location: c.location,
      message: c.warning,
      severity: c.impact > 1.5 ? "high" : "medium"
    }));
}