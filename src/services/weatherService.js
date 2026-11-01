// src/services/weatherService.js

// Government Weather API Configuration
const IMD_BASE_URL =
  import.meta.env.VITE_IMD_BASE_URL || "https://api.imd.gov.in/api/v1";

const IMD_API_KEY = import.meta.env.VITE_IMD_API_KEY || "";

// Different demo data for each dam
const DAM_WEATHER_DATA = {
  "Hirakud Dam": {
    temperature: 28,
    condition: "Heavy Monsoon Rain",
    location: "Mahanadi Catchment (Sambalpur, Odisha)",
    rainfall24h: 124.6,
    windSpeed: 38,
    humidity: 92,
    pressure: 996,
    hourly: [8, 18, 24, 32, 28, 36, 42, 38, 30, 26, 20, 15],
  },

  "Tehri Dam": {
    temperature: 19,
    condition: "Cloudy with Rain",
    location: "Bhagirathi Catchment (Uttarakhand)",
    rainfall24h: 82.4,
    windSpeed: 24,
    humidity: 85,
    pressure: 1002,
    hourly: [5, 12, 18, 22, 19, 25, 30, 24, 20, 16, 12, 8],
  },

  "Bhakra Dam": {
    temperature: 22,
    condition: "Moderate Rain",
    location: "Sutlej Catchment (Himachal Pradesh)",
    rainfall24h: 56.2,
    windSpeed: 18,
    humidity: 78,
    pressure: 1008,
    hourly: [3, 7, 12, 15, 18, 14, 10, 8, 12, 9, 6, 4],
  },

  "Sardar Sarovar Dam": {
    temperature: 30,
    condition: "Partly Cloudy",
    location: "Narmada Catchment (Gujarat)",
    rainfall24h: 12.8,
    windSpeed: 16,
    humidity: 64,
    pressure: 1012,
    hourly: [1, 2, 3, 5, 4, 6, 8, 5, 4, 3, 2, 1],
  },

  "Nagarjuna Sagar Dam": {
    temperature: 31,
    condition: "Thunderstorms",
    location: "Krishna Catchment (Telangana)",
    rainfall24h: 48.5,
    windSpeed: 29,
    humidity: 81,
    pressure: 1004,
    hourly: [6, 10, 16, 22, 28, 35, 31, 26, 22, 18, 12, 8],
  },
};

function generateHourlyForecast(damName) {
  const dam =
    DAM_WEATHER_DATA[damName] || DAM_WEATHER_DATA["Hirakud Dam"];

  return dam.hourly.map((rainfall, index) => ({
    time: `${String(6 + index).padStart(2, "0")}:00`,
    rainfall,
  }));
}

function generateWeeklyForecast(damName) {
  const dam =
    DAM_WEATHER_DATA[damName] || DAM_WEATHER_DATA["Hirakud Dam"];

  const rainfall = dam.rainfall24h;

  return [
    {
      day: "Today",
      date: "14 Sep",
      rainfall: Math.round(rainfall * 0.35),
      tempMax: dam.temperature + 2,
      tempMin: dam.temperature - 4,
      warning: rainfall >= 100 ? "RED" : rainfall >= 60 ? "ORANGE" : "NORMAL",
    },
    {
      day: "Tue",
      date: "15 Sep",
      rainfall: Math.round(rainfall * 0.28),
      tempMax: dam.temperature + 1,
      tempMin: dam.temperature - 3,
      warning: rainfall >= 90 ? "ORANGE" : "NORMAL",
    },
    {
      day: "Wed",
      date: "16 Sep",
      rainfall: Math.round(rainfall * 0.22),
      tempMax: dam.temperature + 3,
      tempMin: dam.temperature - 2,
      warning: rainfall >= 70 ? "ORANGE" : "NORMAL",
    },
    {
      day: "Thu",
      date: "17 Sep",
      rainfall: Math.round(rainfall * 0.18),
      tempMax: dam.temperature + 2,
      tempMin: dam.temperature - 3,
      warning: "NORMAL",
    },
    {
      day: "Fri",
      date: "18 Sep",
      rainfall: Math.round(rainfall * 0.15),
      tempMax: dam.temperature + 4,
      tempMin: dam.temperature - 2,
      warning: "NORMAL",
    },
    {
      day: "Sat",
      date: "19 Sep",
      rainfall: Math.round(rainfall * 0.12),
      tempMax: dam.temperature + 3,
      tempMin: dam.temperature - 1,
      warning: "NORMAL",
    },
    {
      day: "Sun",
      date: "20 Sep",
      rainfall: Math.round(rainfall * 0.10),
      tempMax: dam.temperature + 2,
      tempMin: dam.temperature - 3,
      warning: "NORMAL",
    },
  ];
}

export const weatherService = {
  async getWeatherForCatchment(damName = "Hirakud Dam") {
    const dam =
      DAM_WEATHER_DATA[damName] || DAM_WEATHER_DATA["Hirakud Dam"];

    return {
      current: {
        temperature: dam.temperature,
        condition: dam.condition,
        location: dam.location,
        rainfall24h: dam.rainfall24h,
        windSpeed: dam.windSpeed,
        humidity: dam.humidity,
        pressure: dam.pressure,
      },
      targetDam: damName,
      source: "PRAVAH Weather Intelligence",
      live: false,
    };
  },

  async getHourlyForecast(damName = "Hirakud Dam") {
    return generateHourlyForecast(damName);
  },

  async getWeeklyForecast(damName = "Hirakud Dam") {
    return generateWeeklyForecast(damName);
  },

  getRainfallSeverity(mm) {
    if (mm >= 120) {
      return {
        label: "Extremely Heavy",
        level: "CRITICAL",
        color: "text-red-400",
      };
    }

    if (mm >= 65) {
      return {
        label: "Very Heavy",
        level: "HIGH",
        color: "text-orange-400",
      };
    }

    if (mm >= 35) {
      return {
        label: "Moderate to Heavy",
        level: "MODERATE",
        color: "text-amber-400",
      };
    }

    return {
      label: "Light to Normal",
      level: "NORMAL",
      color: "text-emerald-400",
    };
  },

  // Government IMD API
  async getCurrentWeather() {
    try {
      const response = await fetch(`${IMD_BASE_URL}/current_wx`, {
        headers: {
          ...(IMD_API_KEY && {
            Authorization: `Bearer ${IMD_API_KEY}`,
          }),
        },
      });

      if (!response.ok) throw new Error("IMD API unavailable");

      return await response.json();
    } catch (error) {
      console.warn("IMD API unavailable. Using demo data.");
      return DAM_WEATHER_DATA["Hirakud Dam"];
    }
  },

  async getWeatherWarnings() {
    try {
      const response = await fetch(`${IMD_BASE_URL}/districtwarning`, {
        headers: {
          ...(IMD_API_KEY && {
            Authorization: `Bearer ${IMD_API_KEY}`,
          }),
        },
      });

      if (!response.ok) throw new Error("Warning API failed");

      return await response.json();
    } catch (error) {
      console.warn("IMD Warning API unavailable.");
      return [];
    }
  },
};