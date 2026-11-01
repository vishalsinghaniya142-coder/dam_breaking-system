// src/services/mapsService.js

const MAP_CONFIG = {
  OSM_TILES: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

  SATELLITE_TILES:
    "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",

  TERRAIN_TILES:
    "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",

  INDIA_CENTER: [22.5937, 78.9629],

  ROUTING_API: "https://router.project-osrm.org/route/v1/driving",

  GEOCODING_API: "https://nominatim.openstreetmap.org",
};

const TILE_LAYERS = {
  darkCommand: {
    url: MAP_CONFIG.OSM_TILES,
  },

  satellite: {
    url: MAP_CONFIG.SATELLITE_TILES,
  },

  terrain: {
    url: MAP_CONFIG.TERRAIN_TILES,
  },
};

const INUNDATION_ZONES = {
  hirakudSurgeZone: [
    [21.58, 83.72],
    [21.62, 83.82],
    [21.58, 83.98],
    [21.48, 84.05],
    [21.4, 83.95],
    [21.42, 83.78],
    [21.5, 83.7],
  ],

  moderateBufferZone: [
    [21.7, 83.6],
    [21.78, 83.82],
    [21.7, 84.08],
    [21.45, 84.15],
    [21.3, 83.95],
    [21.35, 83.65],
    [21.52, 83.55],
  ],
};

const RIVER_NETWORKS = [
  {
    name: "Mahanadi River",
    color: "#38bdf8",
    coordinates: [
      [21.72, 83.55],
      [21.65, 83.7],
      [21.58, 83.82],
      [21.53, 83.87],
      [21.45, 83.98],
      [21.32, 84.12],
    ],
  },
  {
    name: "Ib River",
    color: "#60a5fa",
    coordinates: [
      [21.65, 83.45],
      [21.58, 83.6],
      [21.52, 83.76],
      [21.48, 83.88],
    ],
  },
  {
    name: "Rihand River",
    color: "#38bdf8",
    coordinates: [
      [24.38, 82.62],
      [24.3, 82.7],
      [24.2, 82.78],
      [24.08, 82.88],
      [23.95, 82.98],
    ],
  },
];

const mapsService = {
  TILE_LAYERS,
  INUNDATION_ZONES,
  RIVER_NETWORKS,

  getMapConfig() {
    return MAP_CONFIG;
  },

  getDamCoordinates(damName) {
    const dams = {
      "Hirakud Dam": [21.525, 83.8725],
      "Rihand Dam": [24.2, 82.78],
      "Tehri Dam": [30.378, 78.48],
      "Sardar Sarovar Dam": [21.8318, 73.7487],
      "Bhakra Dam": [31.4118, 76.44],
      "Koyna Dam": [17.4, 73.75],
      "Mettur Dam": [11.8, 77.8],
    };

    return dams[damName] || MAP_CONFIG.INDIA_CENTER;
  },

  async getRoute(start, end) {
    try {
      const url =
        `${MAP_CONFIG.ROUTING_API}/` +
        `${start[1]},${start[0]};${end[1]},${end[0]}` +
        `?overview=full&geometries=geojson`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Routing API unavailable");
      }

      const data = await response.json();

      return data.routes?.[0] || null;
    } catch (error) {
      console.warn("Routing unavailable:", error);
      return null;
    }
  },

  async searchLocation(query) {
    try {
      const response = await fetch(
        `${MAP_CONFIG.GEOCODING_API}/search?format=json&q=${encodeURIComponent(
          query
        )}&countrycodes=in`
      );

      if (!response.ok) {
        throw new Error("Geocoding failed");
      }

      return await response.json();
    } catch (error) {
      console.warn("Geocoding unavailable:", error);
      return [];
    }
  },

  getFloodZoneStyle(riskLevel) {
    const styles = {
      LOW: {
        color: "#22c55e",
        fillColor: "#22c55e",
        fillOpacity: 0.25,
      },
      MODERATE: {
        color: "#f59e0b",
        fillColor: "#f59e0b",
        fillOpacity: 0.3,
      },
      HIGH: {
        color: "#f97316",
        fillColor: "#f97316",
        fillOpacity: 0.35,
      },
      CRITICAL: {
        color: "#ef4444",
        fillColor: "#ef4444",
        fillOpacity: 0.45,
      },
    };

    return styles[riskLevel] || styles.LOW;
  },
};

export { mapsService };
export default mapsService;