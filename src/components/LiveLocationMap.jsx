import React, { useEffect, useRef } from "react";
import L from "leaflet";
import { useLocation } from "../hooks/useLocation";
import { MapPin } from "lucide-react";

export function LiveLocationMap({ height = "400px" }) {
  const { location } = useLocation();
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

    // User marker
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

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [location]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-md">
      <div ref={mapContainerRef} style={{ width: "100%", height }} />

      {/* Current Location Card */}
      <div className="absolute top-3 left-3 z-10 bg-slate-900/90 backdrop-blur-md p-3 rounded-lg border border-slate-700 text-xs shadow-lg max-w-[280px]">
        <div className="flex items-center gap-1.5 text-cyan-400 font-bold mb-1">
          <MapPin className="w-3.5 h-3.5" />
          <span>Your Current Location</span>
        </div>
        <p className="text-slate-300 text-[11px] leading-tight">
          Showing the location currently selected for local flood-risk monitoring.
        </p>
      </div>
    </div>
  );
}

export default LiveLocationMap;
