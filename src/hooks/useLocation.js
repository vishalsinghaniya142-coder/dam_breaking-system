import { useState, useEffect } from "react";
import { locationService } from "../services/locationService";

export function useLocation() {
  const [location, setLocation] = useState(locationService.DEFAULT_LOCATION);
  const [nearestDam, setNearestDam] = useState(null);
  const [nearestShelter, setNearestShelter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    async function fetchLocation() {
      setLoading(true);
      const result = await locationService.getCurrentPosition();
      if (!mounted) return;

      if (result.coords) {
        setLocation(result.coords);
        const dam = locationService.getNearestDam(result.coords.lat, result.coords.lng);
        const shelter = locationService.getNearestShelter(result.coords.lat, result.coords.lng);
        setNearestDam(dam);
        setNearestShelter(shelter);
      }
      if (result.error) {
        setError(result.error);
      }
      setLoading(false);
    }

    fetchLocation();
    return () => {
      mounted = false;
    };
  }, []);

  const setManualLocation = (lat, lng, name) => {
    const coords = { lat, lng, name, isDefault: false };
    setLocation(coords);
    const dam = locationService.getNearestDam(lat, lng);
    const shelter = locationService.getNearestShelter(lat, lng);
    setNearestDam(dam);
    setNearestShelter(shelter);
  };

  return {
    location,
    nearestDam,
    nearestShelter,
    loading,
    error,
    setManualLocation,
  };
}

export default useLocation;
