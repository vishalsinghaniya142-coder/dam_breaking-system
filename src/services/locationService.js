import { calculateDistance } from "../utils/helpers";
import { DAMS_DATA } from "../data/damData";

export const locationService = {
  // Default coordinates near Sambalpur/Hirakud Dam disaster zone
  DEFAULT_LOCATION: {
    lat: 21.4669,
    lng: 83.9812,
    name: "Sambalpur City Center, Odisha",
    isDefault: true,
  },

  getCurrentPosition() {
    return new Promise((resolve) => {
      if (typeof window === "undefined" || !("geolocation" in navigator)) {
        resolve({ coords: this.DEFAULT_LOCATION, error: "Geolocation unsupported" });
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            coords: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
              accuracy: position.coords.accuracy,
              name: "Current GPS Location",
              isDefault: false,
            },
            error: null,
          });
        },
        (error) => {
          console.warn("Geolocation permission error or unavailable:", error.message);
          resolve({ coords: this.DEFAULT_LOCATION, error: error.message });
        },
        { timeout: 8000, enableHighAccuracy: true }
      );
    });
  },

  getNearestDam(userLat, userLng) {
    if (!userLat || !userLng) return DAMS_DATA[1]; // default Hirakud
    let nearest = DAMS_DATA[0];
    let minDistance = Infinity;

    DAMS_DATA.forEach((dam) => {
      const dist = calculateDistance(userLat, userLng, dam.lat, dam.lng);
      if (dist !== null && dist < minDistance) {
        minDistance = dist;
        nearest = { ...dam, distanceKm: dist };
      }
    });

    return nearest;
  },
};
