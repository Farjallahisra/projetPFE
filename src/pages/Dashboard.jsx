import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { Navigation } from 'lucide-react';
import L from 'leaflet';
import API from '../api/axios';
import 'leaflet/dist/leaflet.css';

// Configuration des icônes Leaflet pour éviter les bugs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl:       require('leaflet/dist/images/marker-icon.png'),
  shadowUrl:     require('leaflet/dist/images/marker-shadow.png'),
});

const busIcon = L.divIcon({
  className: '',
  html: `<div class="bg-indigo-600 p-2 rounded-full border-4 border-white shadow-lg text-white flex items-center justify-center" style="width:40px; height:40px;">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2h10"></path><circle cx="7" cy="17" r="2"></circle><circle cx="17" cy="17" r="2"></circle></svg>
         </div>`,
  iconSize: [40, 40], iconAnchor: [20, 20],
});

const departureIcon = L.divIcon({
  className: '',
  html: `<div class="bg-emerald-600 p-2 rounded-full border-4 border-white shadow-lg text-white flex items-center justify-center" style="width:36px; height:36px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
         </div>`,
  iconSize: [36, 36], iconAnchor: [18, 18],
});

const schoolIcon = L.divIcon({
  className: '',
  html: `<div class="bg-amber-500 p-2 rounded-full border-4 border-white shadow-lg text-white flex items-center justify-center" style="width:36px; height:36px;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m2 10 10-6 10 6"></path><path d="M4 10v10h16V10"></path><path d="M10 14h4"></path></svg>
         </div>`,
  iconSize: [36, 36], iconAnchor: [18, 18],
});

export default function TrackingPage() {
  const [busPos, setBusPos] = useState([36.8065, 10.1815]); // Coordonnées Tunis par défaut
  const [routePath, setRoutePath] = useState([]);
  const [stops, setStops] = useState([]);
  const [departurePoint, setDeparturePoint] = useState(null);
  const [schoolPoint, setSchoolPoint] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [stopsRes, tripsRes] = await Promise.all([
          API.get('/api/stops'),
          API.get('/api/trips')
        ]);
        
        setStops(stopsRes.data?.stops || []);
        
        // On simule/récupère le trajet (Polyline)
        const normalizedStops = (stopsRes.data?.stops || []).map((s) => ({
          ...s,
          lat: parseFloat(s.stop_lat ?? s.latitude),
          lng: parseFloat(s.stop_lon ?? s.longitude),
        })).filter((s) => !Number.isNaN(s.lat) && !Number.isNaN(s.lng));

        const path = normalizedStops.map((s) => [s.lat, s.lng]);
        setRoutePath(path);

        if (path.length > 0) {
          setBusPos(path[0]); // Bus au premier arrêt pour le test
          setDeparturePoint(path[0]);
        }

        const detectedSchool = normalizedStops.find((s) =>
          /ecole|école|school|lycee|lycée/i.test(String(s.stop_name || s.nom || ''))
        );
        if (detectedSchool) {
          setSchoolPoint([detectedSchool.lat, detectedSchool.lng]);
        } else if (path.length > 1) {
          setSchoolPoint(path[path.length - 1]);
        }
      } catch (err) {
        console.error("Erreur chargement map", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="h-screen flex flex-col bg-[#F8FAFC]">
      {/* Header compact et Pro */}
      <div className="bg-white border-b border-slate-100 p-4 flex justify-between items-center shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-50 p-2 rounded-xl text-indigo-600">
            <Navigation size={20} />
          </div>
          <div>
            <h1 className="font-bold text-slate-800">Suivi en direct - Administration</h1>
            <p className="text-xs text-slate-400">Bus #001 • Trajet scolaire</p>
          </div>
        </div>
        <div className="flex gap-4">
            <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-slate-500 uppercase">Prochain Arrêt</p>
                <p className="text-sm font-semibold text-indigo-600">{schoolPoint ? 'École (point détecté)' : 'École (non détectée)'}</p>
            </div>
        </div>
      </div>

      <div className="flex-1 relative">
        <MapContainer center={busPos} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          
          {/* LE TRAJET : Polyline bleue épaisse et propre */}
          <Polyline 
            positions={routePath} 
            color="#4F46E5" 
            weight={6} 
            opacity={0.6} 
            lineCap="round"
          />

          {/* MARQUEURS : Arrêts */}
          {stops.map((stop, idx) => (
            <Marker key={idx} position={[stop.stop_lat, stop.stop_lon]}>
              <Popup>
                <div className="p-1">
                    <p className="font-bold text-indigo-600">{stop.stop_name}</p>
                    <p className="text-xs text-slate-500">Heure de passage : 07:45</p>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* LE BUS : Icône animée */}
          <Marker position={busPos} icon={busIcon}>
            <Popup>Position actuelle du Bus</Popup>
          </Marker>

          {departurePoint && (
            <Marker position={departurePoint} icon={departureIcon}>
              <Popup>Point de depart du bus</Popup>
            </Marker>
          )}

          {schoolPoint && (
            <Marker position={schoolPoint} icon={schoolIcon}>
              <Popup>Depart/arrivee de l'ecole</Popup>
            </Marker>
          )}
        </MapContainer>

      </div>
    </div>
  );
}