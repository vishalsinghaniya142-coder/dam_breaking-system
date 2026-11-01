import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { useLocation } from "../hooks/useLocation";
import { MapPin, Navigation, ShieldCheck, Home } from "lucide-react";

export function LiveLocationMap({ height = "400px" }) {
  const { location, nearestDam, nearestShelter, loading } = useLocation();
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current || !location) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    const map = L.map(mapContainerRef.current, {
      center: [location.lat, location.lng],
      zoom: 13,
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      subdomains: "abcd",
    }).addTo(map);

    // User marker (blue pulsing beacon)
    const userIcon = L.divIcon({
      className: "user-loc-icon",
      html: `
        <div style="
          width: 22px;
          height: 22px;
          background: #38bdf8;
          border: 3px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 0 16px #38bdf8;
          animation: pulse 1.5s infinite;
        "></div>
      `,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });

    L.marker([location.lat, location.lng], { icon: userIcon })
      .addTo(map)
      .bindPopup(`<strong>Your Location</strong><br/>${location.name || "Live GPS"}`)
      .openPopup();

    // Shelter marker (emerald)
    if (nearestShelter) {
      const shelterIcon = L.divIcon({
        className: "shelter-icon",
        html: `
          <div style="
            width: 26px;
            height: 26px;
            background: #10b981;
            border: 2px solid #ffffff;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 12px #10b981;
          ">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            </svg>
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });

      L.marker([nearestShelter.lat, nearestShelter.lng], { icon: shelterIcon })
        .addTo(map)
        .bindPopup(`
          <strong>Nearest Shelter: ${nearestShelter.name}</strong><br/>
          Elevation: +${nearestShelter.elevationMeters}m (High Ground)<br/>
          Capacity: ${nearestShelter.currentOccupancy}/${nearestShelter.capacity}
        `);

      // Draw safe evacuation corridor polyline (avoiding low ground river bed)
      const midLat = (location.lat + nearestShelter.lat) / 2 + 0.005;
      const midLng = (location.lng + nearestShelter.lng) / 2 - 0.004;

      const safePath = [
        [location.lat, location.lng],
        [midLat, midLng],
        [nearestShelter.lat, nearestShelter.lng],
      ];

      L.polyline(safePath, {
        color: "#10b981",
        weight: 5,
        opacity: 0.9,
        dashArray: "6 6",
      }).addTo(map);

      // Fit bounds
      const bounds = L.latLngBounds([
        [location.lat, location.lng],
        [nearestShelter.lat, nearestShelter.lng],
      ]);
      map.fitBounds(bounds, { padding: [40, 40] });
    }

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [location, nearestShelter]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-md">
      <div ref={mapContainerRef} style={{ width: "100%", height }} />

      {/* Floating Status Card */}
      <div className="absolute top-3 left-3 z-10 bg-slate-900/90 backdrop-blur-md p-3 rounded-lg border border-slate-700 text-xs shadow-lg max-w-[280px]">
        <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-1">
          <Navigation className="w-3.5 h-3.5" />
          <span>Designated Safe Evacuation Route</span>
        </div>
        <p className="text-slate-300 text-[11px] leading-tight">
          Recommended high-ground corridor to{" "}
          <span className="font-semibold text-emerald-400">
            {nearestShelter?.name || "Nearest Relief Center"}
          </span>
          {nearestShelter?.distanceKm && ` (${nearestShelter.distanceKm} km away)`}.
        </p>
      </div>
    </div>
  );
}

export default LiveLocationMap;
