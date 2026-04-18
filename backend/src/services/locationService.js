export function getLocationSchemes(lat, lon) {
  // Map coordinates to Indian states
  const state = detectStateFromCoordinates(lat, lon);
  return state;
}

function detectStateFromCoordinates(lat, lon) {
  // Approximate bounding boxes for Indian states
  const stateCoords = [
    { state: 'Andhra Pradesh', latMin: 12.5, latMax: 19.5, lonMin: 76.5, lonMax: 84.5 },
    { state: 'Bihar', latMin: 24.0, latMax: 27.5, lonMin: 83.0, lonMax: 88.5 },
    { state: 'Gujarat', latMin: 20.0, latMax: 24.5, lonMin: 68.0, lonMax: 74.5 },
    { state: 'Karnataka', latMin: 11.5, latMax: 18.5, lonMin: 74.0, lonMax: 78.5 },
    { state: 'Kerala', latMin: 8.0, latMax: 12.8, lonMin: 74.5, lonMax: 77.5 },
    { state: 'Madhya Pradesh', latMin: 21.0, latMax: 26.8, lonMin: 74.0, lonMax: 82.8 },
    { state: 'Maharashtra', latMin: 15.5, latMax: 22.0, lonMin: 72.5, lonMax: 80.8 },
    { state: 'Odisha', latMin: 17.8, latMax: 22.5, lonMin: 81.0, lonMax: 87.5 },
    { state: 'Rajasthan', latMin: 23.0, latMax: 30.2, lonMin: 69.0, lonMax: 78.2 },
    { state: 'Tamil Nadu', latMin: 8.0, latMax: 13.5, lonMin: 76.0, lonMax: 80.5 },
    { state: 'Telangana', latMin: 15.8, latMax: 19.9, lonMin: 77.0, lonMax: 81.5 },
    { state: 'Uttar Pradesh', latMin: 23.8, latMax: 30.4, lonMin: 77.0, lonMax: 84.6 },
    { state: 'West Bengal', latMin: 21.5, latMax: 27.2, lonMin: 86.0, lonMax: 89.8 },
    { state: 'Punjab', latMin: 29.5, latMax: 32.5, lonMin: 73.8, lonMax: 77.0 },
    { state: 'Haryana', latMin: 27.5, latMax: 31.0, lonMin: 74.5, lonMax: 77.5 },
    { state: 'Jharkhand', latMin: 21.9, latMax: 25.3, lonMin: 83.3, lonMax: 87.9 },
    { state: 'Chhattisgarh', latMin: 17.8, latMax: 24.1, lonMin: 80.2, lonMax: 84.4 },
    { state: 'Assam', latMin: 24.0, latMax: 28.0, lonMin: 89.5, lonMax: 96.0 },
    { state: 'Delhi', latMin: 28.4, latMax: 28.9, lonMin: 76.8, lonMax: 77.4 },
    { state: 'Goa', latMin: 14.9, latMax: 15.8, lonMin: 73.6, lonMax: 74.3 },
    { state: 'Uttarakhand', latMin: 28.7, latMax: 31.5, lonMin: 77.5, lonMax: 81.0 },
    { state: 'Himachal Pradesh', latMin: 30.3, latMax: 33.2, lonMin: 75.5, lonMax: 79.0 },
    { state: 'Jammu & Kashmir', latMin: 32.0, latMax: 37.0, lonMin: 73.5, lonMax: 80.0 }
  ];

  for (const sc of stateCoords) {
    if (lat >= sc.latMin && lat <= sc.latMax && lon >= sc.lonMin && lon <= sc.lonMax) {
      return sc.state;
    }
  }

  return null; // Unknown state
}

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
  'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Puducherry',
  'Chandigarh', 'Andaman & Nicobar', 'Dadra & Nagar Haveli', 'Lakshadweep'
];
