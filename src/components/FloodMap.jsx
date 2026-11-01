import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { DAMS_DATA } from "../data/damData";
import { MOCK_SHELTERS } from "../data/mockSimulationData";
import { mapsService } from "../services/mapsService";
import { Layers, MapPin, ShieldAlert, Home, Navigation, Eye } from "lucide-react";

export function FloodMap({
  selectedDam = null,
  center = [22.5, 81.0],
  zoom = 5,
  showDams = true,
  showShelters = true,
  showInundation = true,
  showRivers = true,
  userLocation = null,
  height = "550px",
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);
  const [activeTile, setActiveTile] = useState("darkCommand");
  const [activeLayers, setActiveLayers] = useState({
    dams: showDams,
    shelters: showShelters,
    inundation: showInundation,
    rivers: showRivers,
  });

  // Custom marker icons
  const createDamIcon = (riskLevel) => {
    const isCritical = riskLevel === "CRITICAL";
    const isHigh = riskLevel === "HIGH";
    const color = isCritical ? "#ef4444" : isHigh ? "#f97316" : "#06b6d4";

    return L.divIcon({
      className: "custom-dam-marker",
      html: `
        <div style="
          width: 28px;
          height: 28px;
          background: ${color};
          border: 2px solid #ffffff;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 ${isCritical ? "16px #ef4444" : "10px rgba(0,0,0,0.5)"};
          ${isCritical ? "animation: pulse 1.5s infinite;" : ""}
        ">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
      `,
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    });
  };

  const createShelterIcon = () => {
    return L.divIcon({
      className: "custom-shelter-marker",
      html: `
        <div style="
          width: 24px;
          height: 24px;
          background: #10b981;
          border: 2px solid #ffffff;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.6);
        ">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          </svg>
        </div>
      `,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  const createUserIcon = () => {
    return L.divIcon({
      className: "custom-user-marker",
      html: `
        <div style="
          width: 22px;
          height: 22px;
          background: #3b82f6;
          border: 3px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 0 12px #3b82f6;
        "></div>
      `,
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    const tileConfig = mapsService.TILE_LAYERS[activeTile];

    const map = L.map(mapContainerRef.current, {
      center: selectedDam ? [selectedDam.lat, selectedDam.lng] : center,
      zoom: selectedDam ? 9 : zoom,
      zoomControl: true,
      attributionControl: false,
    });

    L.tileLayer(tileConfig.url, {
      maxZoom: 18,
      subdomains: "abcd",
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [activeTile]);

  // Update Layers & Overlays
  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = layerGroupRef.current;
    if (!map || !group) return;

    group.clearLayers();

    // 1. Inundation Zones (Delft3D / SPH breach prediction)
    if (activeLayers.inundation) {
      const redZone = L.polygon(mapsService.INUNDATION_ZONES.hirakudSurgeZone, {
        color: "#ef4444",
        weight: 2,
        fillColor: "#ef4444",
        fillOpacity: 0.45,
      }).bindPopup(`
        <div style="font-family: system-ui; font-size: 12px; color: #0f172a;">
          <strong style="color: #ef4444;">DELFT3D SIMULATION: HIGH-VELOCITY BREACH SURGE</strong><br/>
          Depth: 3.5m - 5.2m &bull; Velocity: 3.8 m/s<br/>
          <strong>Immediate Evacuation Mandatory</strong>
        </div>
      `);
      group.addLayer(redZone);

      const bufferZone = L.polygon(mapsService.INUNDATION_ZONES.moderateBufferZone, {
        color: "#f59e0b",
        weight: 1.5,
        fillColor: "#f59e0b",
        fillOpacity: 0.25,
        dashArray: "4 4",
      }).bindPopup(`
        <div style="font-family: system-ui; font-size: 12px; color: #0f172a;">
          <strong style="color: #f59e0b;">Moderate Flood Inundation Buffer Zone</strong><br/>
          Projected water surge within 4 - 6 hours.
        </div>
      `);
      group.addLayer(bufferZone);
    }

    // 2. River Networks
    if (activeLayers.rivers) {
      mapsService.RIVER_NETWORKS.forEach((river) => {
        const line = L.polyline(river.coordinates, {
          color: river.color,
          weight: 4,
          opacity: 0.8,
        }).bindPopup(`<strong>${river.name}</strong><br/>Active flood discharge monitoring channel`);
        group.addLayer(line);
      });
    }

    // 3. Dams Markers
    if (activeLayers.dams) {
      DAMS_DATA.forEach((dam) => {
        const marker = L.marker([dam.lat, dam.lng], {
          icon: createDamIcon(dam.riskLevel),
        }).bindPopup(`
          <div style="font-family: system-ui; font-size: 12px; color: #0f172a; min-width: 180px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
              <strong style="font-size: 13px;">${dam.name}</strong>
              <span style="font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; background: ${
                dam.riskLevel === "CRITICAL" ? "#fee2e2; color: #ef4444" : "#ecfeff; color: #0891b2"
              }">${dam.riskLevel}</span>
            </div>
            <div>River: <b>${dam.river}</b></div>
            <div>Water Level: <b>${dam.currentWaterLevel}m</b> / ${dam.dangerLevel}m</div>
            <div>Storage: <b>${dam.storagePercentage}%</b></div>
            <div>Discharge: <b>${dam.outflow} cumecs</b> (${dam.gatesOpen}/${dam.totalGates} gates)</div>
            <div style="margin-top: 6px;">
              <a href="/#/dam/${dam.id}" style="color: #0284c7; font-weight: bold; text-decoration: underline;">Full Telemetry &rarr;</a>
            </div>
          </div>
        `);
        group.addLayer(marker);
      });
    }

    // 4. Shelters Markers
    if (activeLayers.shelters) {
      MOCK_SHELTERS.forEach((shelter) => {
        const marker = L.marker([shelter.lat, shelter.lng], {
          icon: createShelterIcon(),
        }).bindPopup(`
          <div style="font-family: system-ui; font-size: 12px; color: #0f172a;">
            <strong style="color: #10b981;">${shelter.name}</strong><br/>
            Capacity: <b>${shelter.currentOccupancy} / ${shelter.capacity}</b> (${shelter.status})<br/>
            Elevation: <b>+${shelter.elevationMeters}m (Flood Resilient)</b><br/>
            Contact: <b>${shelter.contact}</b>
          </div>
        `);
        group.addLayer(marker);
      });
    }

    // 5. User Live Location
    if (userLocation && userLocation.lat && userLocation.lng) {
      const userMarker = L.marker([userLocation.lat, userLocation.lng], {
        icon: createUserIcon(),
      }).bindPopup(`
        <div style="font-family: system-ui; font-size: 12px; color: #0f172a;">
          <strong>Your Current Location</strong><br/>
          Lat: ${userLocation.lat.toFixed(4)}, Lng: ${userLocation.lng.toFixed(4)}
        </div>
      `);
      group.addLayer(userMarker);
    }
  }, [activeLayers, userLocation]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      {/* Map Surface */}
      <div ref={mapContainerRef} style={{ width: "100%", height }} className="z-10" />

      {/* Map Controls Floating Toolbar */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2 bg-slate-900/90 backdrop-blur-md p-1.5 rounded-xl border border-slate-700 shadow-lg text-xs">
        {/* Basemap Switcher */}
        <div className="flex items-center gap-1 border-r border-slate-700 pr-2">
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <button
            onClick={() => setActiveTile("darkCommand")}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
              activeTile === "darkCommand" ? "bg-cyan-600 text-white" : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            Dark Command
          </button>
          <button
            onClick={() => setActiveTile("satellite")}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
              activeTile === "satellite" ? "bg-cyan-600 text-white" : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            Satellite
          </button>
          <button
            onClick={() => setActiveTile("terrain")}
            className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
              activeTile === "terrain" ? "bg-cyan-600 text-white" : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            Terrain
          </button>
        </div>

        {/* Feature Layer Toggles */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setActiveLayers((p) => ({ ...p, dams: !p.dams }))}
            className={`px-2 py-1 rounded text-[11px] flex items-center gap-1 font-medium transition-colors ${
              activeLayers.dams ? "bg-cyan-950 text-cyan-300 border border-cyan-700" : "text-slate-400 opacity-60"
            }`}
          >
            <ShieldAlert className="w-3 h-3 text-cyan-400" />
            <span>Dams</span>
          </button>

          <button
            onClick={() => setActiveLayers((p) => ({ ...p, inundation: !p.inundation }))}
            className={`px-2 py-1 rounded text-[11px] flex items-center gap-1 font-medium transition-colors ${
              activeLayers.inundation ? "bg-red-950 text-red-300 border border-red-700" : "text-slate-400 opacity-60"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>Breach Zones</span>
          </button>

          <button
            onClick={() => setActiveLayers((p) => ({ ...p, shelters: !p.shelters }))}
            className={`px-2 py-1 rounded text-[11px] flex items-center gap-1 font-medium transition-colors ${
              activeLayers.shelters ? "bg-emerald-950 text-emerald-300 border border-emerald-700" : "text-slate-400 opacity-60"
            }`}
          >
            <Home className="w-3 h-3 text-emerald-400" />
            <span>Shelters</span>
          </button>
        </div>
      </div>

      {/* Legend Box Bottom-Right */}
      <div className="absolute bottom-4 right-4 z-20 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-700 text-xs shadow-xl hidden sm:block max-w-[200px]">
        <span className="font-mono text-[10px] uppercase text-slate-400 block mb-1.5 font-bold">
          GIS Risk Legend
        </span>
        <div className="space-y-1.5 text-[11px] text-slate-300 font-medium">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 shrink-0" />
            <span>Critical / Breach Risk</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-orange-500 shrink-0" />
            <span>High Water Alert</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-cyan-400 shrink-0" />
            <span>Normal Monitoring</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded bg-emerald-500 shrink-0" />
            <span>Designated Shelter</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FloodMap;
