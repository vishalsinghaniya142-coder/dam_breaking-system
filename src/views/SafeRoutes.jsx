import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { AlertTriangle, LocateFixed, MapPin, Navigation, Route, Search, Volume2 } from "lucide-react";
import { useLocation } from "../hooks/useLocation";
import { mapsService } from "../services/mapsService";
import { speakAlert } from "../utils/emergencyUtils";
import { MOCK_SHELTERS } from "../data/mockSimulationData";
import { calculateDistance } from "../utils/helpers";

export function SafeRoutes() {
  const { location, setManualLocation } = useLocation();
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const routeLayerRef = useRef(null);
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState([]);
  const [route, setRoute] = useState(null);
  const [destination, setDestination] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isRouting, setIsRouting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [location.lat, location.lng],
      zoom: 12,
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      subdomains: "abcd",
    }).addTo(map);

    routeLayerRef.current = L.featureGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      routeLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    const routeLayer = routeLayerRef.current;
    if (!map || !routeLayer || !location) return;

    routeLayer.clearLayers();
    const origin = L.latLng(location.lat, location.lng);
    L.circleMarker(origin, {
      radius: 8,
      color: "#ffffff",
      weight: 2,
      fillColor: "#00cfff",
      fillOpacity: 1,
    })
      .bindPopup("Route starting point")
      .addTo(routeLayer);

    MOCK_SHELTERS.forEach((shelter) => {
      L.marker([shelter.lat, shelter.lng], {
        icon: L.divIcon({
          className: "safe-route-shelter-marker",
          html: '<div style="width:28px;height:28px;border-radius:50%;display:grid;place-items:center;background:#22c55e;color:#052e16;border:2px solid #fff;box-shadow:0 0 12px #22c55e;font-weight:800;font-size:14px">S</div>',
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        }),
      })
        .bindPopup(`<strong>${shelter.name}</strong><br/>${shelter.status.replace("_", " ")} · ${shelter.elevationMeters}m elevation`)
        .addTo(routeLayer);
    });

    if (route && destination) {
      const path = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
      L.polyline(path, { color: "#00cfff", weight: 5, opacity: 0.9 }).addTo(routeLayer);
      L.marker([destination.lat, destination.lon])
        .bindPopup(destination.display_name)
        .addTo(routeLayer);
      map.fitBounds(L.latLngBounds(path), { padding: [36, 36] });
    } else {
      map.setView(origin, 12);
    }
  }, [location, route, destination]);

  const handleSearch = async (event) => {
    event.preventDefault();
    const searchTerm = query.trim();
    if (!searchTerm) {
      setError("Enter a destination to search.");
      return;
    }

    setError("");
    setPlaces([]);
    setRoute(null);
    setDestination(null);
    setIsSearching(true);
    try {
      const results = await mapsService.searchLocation(searchTerm);
      setPlaces(results);
      if (results.length === 0) setError("No matching places found. Try a nearby town or landmark.");
    } catch (searchError) {
      console.error("Destination search failed:", searchError);
      setError("Could not search destinations. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectDestination = async (place) => {
    const target = {
      ...place,
      lat: Number(place.lat),
      lon: Number(place.lon ?? place.lng),
      display_name: place.display_name || place.name,
    };
    if (!Number.isFinite(target.lat) || !Number.isFinite(target.lon)) {
      setError("This destination has invalid map coordinates. Choose another result.");
      return;
    }

    setError("");
    setDestination(target);
    setRoute(null);
    setPlaces([]);
    setIsRouting(true);
    try {
      const result = await mapsService.getRoute(
        [location.lat, location.lng],
        [target.lat, target.lon]
      );
      if (!result) {
        setDestination(null);
        setError("No road route is available for this destination. Please choose another place.");
        return;
      }
      setRoute(result);
    } catch (routeError) {
      console.error("Route calculation failed:", routeError);
      setDestination(null);
      setError("Could not calculate a route. Please try again.");
    } finally {
      setIsRouting(false);
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Location access is not available in this browser.");
      return;
    }

    setError("");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setManualLocation(coords.latitude, coords.longitude, "Current GPS Location"),
      (locationError) => {
        console.warn("Could not refresh current location:", locationError.message);
        setError("Could not get your current location. Check browser location permissions.");
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  };

  const formatDistance = (meters) =>
    meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${Math.round(meters)} m`;

  const formatDuration = (seconds) => {
    const minutes = Math.round(seconds / 60);
    return minutes >= 60
      ? `${Math.floor(minutes / 60)} hr ${minutes % 60} min`
      : `${minutes} min`;
  };

  const handleReadRoute = () => {
    if (!route || !destination) return;
    speakAlert(
      `The road route from ${location.name || "your selected starting point"} to ${destination.display_name} is approximately ${formatDistance(route.distance)} and ${formatDuration(route.duration)}. This route has not been checked for flood hazards. Follow official emergency instructions.`
    );
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 border-b border-slate-800 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Route className="h-5 w-5 text-cyan-400" />
            <h1 className="text-xl font-black text-white">Safe Routes &amp; Shelters</h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Find nearby relief shelters or plan a road route to a destination.
          </p>
        </div>
        <button
          type="button"
          onClick={handleUseCurrentLocation}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 transition-colors hover:bg-slate-700"
        >
          <LocateFixed className="h-4 w-4 text-cyan-400" />
          Use current location
        </button>
      </header>

      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="overflow-hidden rounded-xl border border-slate-800 bg-slate-950">
          <div ref={mapContainerRef} className="h-[360px] w-full sm:h-[480px]" />
        </div>

        <div className="space-y-4">
          <form onSubmit={handleSearch} className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <label htmlFor="route-destination" className="block text-xs font-bold uppercase tracking-wider text-slate-200">
              Choose a destination
            </label>
            <div className="flex gap-2">
              <input
                id="route-destination"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search a town or landmark"
                className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-500"
              />
              <button
                type="submit"
                disabled={isSearching}
                aria-label="Search destinations"
                className="rounded-lg bg-red-600 px-3 text-white transition-colors hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
            {isSearching && <p className="text-xs text-slate-400">Searching destinations...</p>}
            {places.length > 0 && (
              <div className="space-y-2" aria-label="Destination search results">
                {places.slice(0, 5).map((place, index) => (
                  <button
                    key={`${place.lat}-${place.lon}-${index}`}
                    type="button"
                    disabled={isRouting}
                    onClick={() => handleSelectDestination(place)}
                    className="flex w-full items-start gap-2 rounded-lg border border-slate-800 bg-slate-950 p-2.5 text-left text-xs text-slate-300 transition-colors hover:border-cyan-700 hover:bg-slate-900 disabled:opacity-60"
                  >
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400" />
                    <span>{place.display_name}</span>
                  </button>
                ))}
              </div>
            )}
            {error && <p role="alert" className="text-xs text-red-300">{error}</p>}
          </form>

          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">Relief shelters</h2>
              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                {MOCK_SHELTERS.length} demo locations
              </span>
            </div>
            <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
              {[...MOCK_SHELTERS]
                .map((shelter) => ({
                  ...shelter,
                  distanceKm: calculateDistance(location.lat, location.lng, shelter.lat, shelter.lng),
                }))
                .sort((a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity))
                .map((shelter, index) => {
                  const occupancy = Math.round((shelter.currentOccupancy / shelter.capacity) * 100);
                  return (
                    <div key={shelter.id} className="rounded-lg border border-slate-800 bg-slate-950 p-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs font-semibold leading-snug text-slate-100">{shelter.name}</p>
                          <p className="mt-1 text-[10px] text-slate-400">
                            {shelter.distanceKm === null ? "Distance unavailable" : `${shelter.distanceKm} km away`}
                            {" · "}Elevation {shelter.elevationMeters} m
                          </p>
                        </div>
                        {index === 0 && (
                          <span className="shrink-0 rounded bg-cyan-500/10 px-1.5 py-0.5 text-[9px] font-bold text-cyan-300">
                            NEAREST
                          </span>
                        )}
                      </div>
                      <div className="mt-2 flex items-center justify-between gap-2">
                        <span className={`text-[10px] font-semibold ${shelter.status === "OPEN" ? "text-emerald-400" : "text-amber-400"}`}>
                          {shelter.status.replace("_", " ")} · {shelter.currentOccupancy.toLocaleString("en-IN")}/{shelter.capacity.toLocaleString("en-IN")} ({occupancy}%)
                        </span>
                        <button
                          type="button"
                          disabled={isRouting}
                          onClick={() => handleSelectDestination(shelter)}
                          className="shrink-0 rounded-md bg-emerald-600 px-2 py-1 text-[10px] font-bold text-white transition-colors hover:bg-emerald-500 disabled:opacity-60"
                        >
                          Route here
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
            <p className="mt-3 border-t border-slate-800 pt-3 text-[10px] leading-relaxed text-amber-300">
              Locations and occupancy are demo data from the earlier page. Verify shelter availability and travel guidance with local authorities before moving.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4">
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-200">
              <Navigation className="h-4 w-4 text-cyan-400" />
              Route details
            </div>
            <p className="text-xs text-slate-400">Starting point</p>
            <p className="mb-3 text-sm text-slate-100">{location.name || "Selected location"}</p>
            {isRouting && <p className="text-xs text-slate-400">Calculating road route...</p>}
            {route && destination ? (
              <>
                <p className="text-xs text-slate-400">Destination</p>
                <p className="mb-3 line-clamp-2 text-sm text-slate-100">{destination.display_name}</p>
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-slate-950 p-3">
                    <p className="text-[10px] uppercase text-slate-500">Distance</p>
                    <p className="mt-1 text-sm font-bold text-cyan-300">{formatDistance(route.distance)}</p>
                  </div>
                  <div className="rounded-lg bg-slate-950 p-3">
                    <p className="text-[10px] uppercase text-slate-500">Estimated time</p>
                    <p className="mt-1 text-sm font-bold text-cyan-300">{formatDuration(route.duration)}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleReadRoute}
                  className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                >
                  <Volume2 className="h-4 w-4 text-cyan-400" />
                  Read route summary aloud
                </button>
              </>
            ) : !isRouting && (
              <p className="text-xs text-slate-500">Search for a destination to calculate a road route.</p>
            )}
          </div>

          <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-xs leading-relaxed text-amber-100">
            <div className="mb-1 flex items-center gap-2 font-bold">
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              Flood safety notice
            </div>
            Road routes are estimates and are not verified as flood-safe. In an emergency, follow official local alerts and instructions; do not enter flooded roads.
          </div>

          {location.isDefault && (
            <p className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 text-[11px] leading-relaxed text-slate-400">
              Location permission was unavailable. The route starts from the app&apos;s default map location, not verified GPS. Use “current location” to refresh it.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

export default SafeRoutes;
