// src/components/Map/LiveMap.jsx
import { useEffect, useRef } from 'react';
import L from 'leaflet';
import useMapStore from '../../store/useMapStore';
import useSOSStore from '../../store/useSOSStore';

/**
 * LiveMap Component
 * Renders a Leaflet map with live SOS markers, responder markers, and user location.
 * Updates in real-time via Zustand subscriptions.
 */
const LiveMap = ({ onMarkerClick }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef({});

  const { userLocation, sosList, responders } = useMapStore();
  const { active, type } = useSOSStore();

  // Crisis type to emoji
  const CRISIS_ICONS = {
    'Medical Emergency': '🏥',
    'Fire': '🔥',
    'Gas Leak': '⚠️',
    'Accident': '🚗',
    'Other': '📢',
  };

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    mapInstance.current = L.map(mapRef.current, {
      center: [userLocation.lat, userLocation.lng],
      zoom: 14,
      zoomControl: false,
    });

    // Dark tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors, © CARTO',
      maxZoom: 19,
    }).addTo(mapInstance.current);

    // Zoom control top-right
    L.control.zoom({ position: 'topright' }).addTo(mapInstance.current);

    // User marker
    const userIcon = L.divIcon({
      html: `<div style="
        width:28px;height:28px;border-radius:50%;
        background:#3B82F6;border:3px solid white;
        display:flex;align-items:center;justify-content:center;
        font-size:12px;box-shadow:0 2px 10px rgba(59,130,246,0.5)
      ">👤</div>`,
      iconSize: [28, 28], iconAnchor: [14, 14], className: '',
    });

    markersRef.current['user'] = L.marker(
      [userLocation.lat, userLocation.lng],
      { icon: userIcon }
    ).addTo(mapInstance.current).bindPopup('<b>You</b><br/>Your current location');

    return () => {
      mapInstance.current?.remove();
      mapInstance.current = null;
    };
  }, []);

  // Update SOS markers
  useEffect(() => {
    if (!mapInstance.current) return;

    // Remove old SOS markers
    Object.keys(markersRef.current)
      .filter(k => k.startsWith('sos_'))
      .forEach(k => {
        markersRef.current[k]?.remove();
        delete markersRef.current[k];
      });

    // Add current SOS markers
    sosList.forEach(sos => {
      const icon = L.divIcon({
        html: `<div style="
          width:44px;height:44px;border-radius:50%;
          background:#FF2D20;border:3px solid white;
          display:flex;align-items:center;justify-content:center;
          font-size:20px;box-shadow:0 0 20px rgba(255,45,32,0.6);
          animation:sosPulse 2s infinite
        ">${CRISIS_ICONS[sos.type] || '🆘'}</div>`,
        iconSize: [44, 44], iconAnchor: [22, 22], className: '',
      });

      const marker = L.marker([sos.lat, sos.lng], { icon })
        .addTo(mapInstance.current)
        .bindPopup(`<b>${sos.type}</b><br/>🔴 Active Emergency`);

      if (onMarkerClick) {
        marker.on('click', () => onMarkerClick(sos));
      }

      markersRef.current['sos_' + sos.id] = marker;
    });
  }, [sosList]);

  // Update responder markers
  useEffect(() => {
    if (!mapInstance.current) return;

    responders.forEach(resp => {
      const key = 'resp_' + resp.id;
      const icon = L.divIcon({
        html: `<div style="
          width:34px;height:34px;border-radius:50%;
          background:${resp.skills?.includes('Doctor') || resp.skills?.includes('Nurse') ? '#8B5CF6' : '#10B981'};
          border:2px solid white;display:flex;align-items:center;
          justify-content:center;font-size:14px;
          box-shadow:0 2px 8px rgba(0,0,0,0.4)
        ">🚑</div>`,
        iconSize: [34, 34], iconAnchor: [17, 17], className: '',
      });

      if (markersRef.current[key]) {
        // Update existing
        markersRef.current[key].setLatLng([resp.lat, resp.lng]);
      } else {
        // Create new
        markersRef.current[key] = L.marker([resp.lat, resp.lng], { icon })
          .addTo(mapInstance.current)
          .bindPopup(`<b>${resp.name}</b><br/>Skills: ${resp.skills?.join(', ')}<br/>ETA: ${resp.eta}min`);
      }
    });
  }, [responders]);

  // Update user location
  useEffect(() => {
    if (!mapInstance.current || !markersRef.current['user']) return;
    markersRef.current['user'].setLatLng([userLocation.lat, userLocation.lng]);
  }, [userLocation]);

  return (
    <div
      ref={mapRef}
      id="leaflet-map"
      style={{ height: '100%', width: '100%', background: '#0D1117' }}
    />
  );
};

export default LiveMap;
