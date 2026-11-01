import { useState, useEffect } from "react";
import { weatherService } from "../services/weatherService";
import { MOCK_WEATHER_DATA } from "../data/mockWeather";

export function useWeather(damName = "Hirakud Dam") {
  const [weather, setWeather] = useState(null);
  const [hourly, setHourly] = useState([]);
  const [weekly, setWeekly] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);

      try {
        // Fetch weather data from IMD
        const liveWeather =
          await weatherService.getWeatherForCatchment(damName);

        // Fetch hourly forecast
        const hourlyData =
          await weatherService.getHourlyForecast();

        // Fetch weekly forecast
        const weeklyData =
          await weatherService.getWeeklyForecast();

        if (mounted) {
          setWeather(normalizeWeather(liveWeather, damName));
          setHourly(normalizeHourly(hourlyData));
          setWeekly(normalizeWeekly(weeklyData));

          setLoading(false);
        }

      } catch (error) {
        console.error("PRAVAH Weather Loading Error:", error);

        if (mounted) {
          setWeather(MOCK_WEATHER_DATA);
          setHourly(MOCK_WEATHER_DATA.hourlyForecast || []);
          setWeekly(MOCK_WEATHER_DATA.weeklyForecast || []);
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [damName]);

  return {
    weather,
    hourly,
    weekly,
    loading,
  };
}


/* =====================================================
   WEATHER DATA NORMALIZATION
   Keeps PRAVAH UI compatible with IMD API
===================================================== */

function normalizeWeather(data, damName) {

  // If API returns old/mock-compatible structure
  if (data?.current) {
    return {
      ...data,
      targetDam: damName,
      source: data.source || "India Meteorological Department",
      isLive: data.isLive ?? true,
    };
  }

  // Try extracting data from IMD API response
  const apiData = data?.data || data;

  return {
    targetDam: damName,
    source: "India Meteorological Department",
    isLive: true,

    current: {
      temperature:
        apiData?.temperature ??
        apiData?.temp ??
        0,

      condition:
        apiData?.condition ??
        apiData?.weather ??
        "Weather data received from IMD",

      location:
        apiData?.location ??
        damName,

      rainfall24h:
        apiData?.rainfall24h ??
        apiData?.rainfall ??
        0,

      windSpeed:
        apiData?.windSpeed ??
        apiData?.wind ??
        0,

      humidity:
        apiData?.humidity ??
        0,

      pressure:
        apiData?.pressure ??
        0,
    },
  };
}


/* =====================================================
   HOURLY DATA NORMALIZATION
===================================================== */

function normalizeHourly(data) {

  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((item, index) => ({
    time:
      item.time ||
      item.hour ||
      `${index + 1}h`,

    rainfall:
      Number(
        item.rainfall ??
        item.precipitation ??
        item.rain ??
        0
      ),
  }));
}


/* =====================================================
   WEEKLY DATA NORMALIZATION
===================================================== */

function normalizeWeekly(data) {

  if (!Array.isArray(data)) {
    return [];
  }

  return data.map((item, index) => ({
    day:
      item.day ||
      item.date ||
      `Day ${index + 1}`,

    date:
      item.date ||
      "",

    rainfall:
      Number(
        item.rainfall ??
        item.precipitation ??
        item.rain ??
        0
      ),

    tempMax:
      item.tempMax ??
      item.maxTemp ??
      item.temperatureMax ??
      "--",

    tempMin:
      item.tempMin ??
      item.minTemp ??
      item.temperatureMin ??
      "--",

    warning:
      item.warning ||
      "NORMAL",
  }));
}


export default useWeather;