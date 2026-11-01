export const MOCK_WEATHER_DATA = {
  current: {
    temp: 27.4,
    condition: "Heavy Monsoon Rain",
    humidity: 92,
    windSpeed: 38, // km/h
    windDirection: "WSW",
    rainfall24h: 124.6, // mm
    pressure: 996, // hPa
    cloudCover: 95, // %
    visibility: 2.8, // km
    uvIndex: 1,
    location: "Mahanadi Catchment (Sambalpur, Odisha)",
    alertStatus: "Red Warning (Heavy to Very Heavy Rain)",
  },
  hourlyForecast: [
    { time: "06:00", temp: 26, rainMm: 12.4, risk: "Moderate" },
    { time: "09:00", temp: 27, rainMm: 24.8, risk: "High" },
    { time: "12:00", temp: 28, rainMm: 38.5, risk: "Critical" },
    { time: "15:00", temp: 27, rainMm: 42.0, risk: "Critical" },
    { time: "18:00", temp: 26, rainMm: 28.2, risk: "High" },
    { time: "21:00", temp: 25, rainMm: 16.0, risk: "Moderate" },
    { time: "00:00", temp: 25, rainMm: 9.5, risk: "Moderate" },
    { time: "03:00", temp: 24, rainMm: 6.2, risk: "Low" },
  ],
  weeklyForecast: [
    { day: "Today", maxTemp: 28, minTemp: 24, rainMm: 124.6, icon: "rain-heavy", condition: "Torrential Downpour" },
    { day: "Tomorrow", maxTemp: 29, minTemp: 25, rainMm: 86.0, icon: "rain-moderate", condition: "Continuous Rain" },
    { day: "Day 3", maxTemp: 30, minTemp: 25, rainMm: 42.0, icon: "rain-light", condition: "Scattered Showers" },
    { day: "Day 4", maxTemp: 31, minTemp: 26, rainMm: 18.0, icon: "cloud-sun", condition: "Partly Cloudy with Thunder" },
    { day: "Day 5", maxTemp: 32, minTemp: 26, rainMm: 8.0, icon: "sun-cloud", condition: "Light Isolated Showers" },
    { day: "Day 6", maxTemp: 33, minTemp: 27, rainMm: 4.0, icon: "sun", condition: "Mostly Sunny" },
    { day: "Day 7", maxTemp: 33, minTemp: 27, rainMm: 2.0, icon: "sun", condition: "Clear Sky" },
  ],
  catchmentStations: [
    { station: "Tehri Upper Catchment (Uttarakhand)", rainfall: 98.4, status: "High Alert" },
    { station: "Hirakud Upper Mahanadi (Chhattisgarh)", rainfall: 142.1, status: "Critical Surge" },
    { station: "Sardar Sarovar Narmada Basin (MP)", rainfall: 54.0, status: "Moderate Inflow" },
    { station: "Bhakra Sutlej Alpine Catchment (HP)", rainfall: 32.5, status: "Normal" },
    { station: "Idukki Periyar Western Ghats (Kerala)", rainfall: 118.9, status: "High Alert" },
  ],
};
