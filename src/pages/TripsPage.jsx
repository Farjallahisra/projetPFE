import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Clock, MapPin, Users, Eye, X } from 'lucide-react';
import L from 'leaflet';
import API from '../api/axios';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const stopIcon = L.divIcon({
  className: '',
  html: `<div style="background:#2563eb;width:12px;height:12px;border-radius:50%;
    border:2px solid white;box-shadow:0 1px 4px rgba(0,0,0,0.3);"></div>`,
  iconSize: [12, 12], iconAnchor: [6, 6],
});

export default function TripsPage() {
  const [trips,   setTrips]   = useState([]);
  const [stops,   setStops]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [detail,  setDetail]  = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [tRes, sRes] = await Promise.all([
          API.get('/api/trips'),
          API.get('/api/stops'),
        ]);
        setTrips(tRes.data?.trips || tRes.data || []);
        setStops(sRes.data?.stops || sRes.data || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  // Construit les points de la polyline pour un trajet
  const getRoutePoints = (trip) => {
    if (!trip?.stops?.length) return [[36.8065, 10.1815], [36.8120, 10.1870]];
    return trip.stops.map(s => [
      parseFloat(s.latitude  || s.stop_lat || 36.8065),
      parseFloat(s.longitude || s.stop_lon || 10.1815),
    ]).filter(([lat, lng]) => !isNaN(lat) && !isNaN(lng));
  };

  const mapCenter = stops.length > 0
    ? [parseFloat(stops[0].stop_lat || 36.8065), parseFloat(stops[0].stop_lon || 10.1815)]
    : [36.8065, 10.1815];

  return (
    <div className="space-y-5">

      <div>
        <h2 className="text-xl font-bold text-gray-800">Trajets & Horaires</h2>
        <p className="text-sm text-gray-400">{trips.length} trajet(s) enregistré(s)</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

        {/* ── Carte ──────────────────────────────────────────────── */}
        <div className="xl:col-span-3 bg-white rounded-2xl shadow-sm
          border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <MapPin size={16} className="text-blue-600" />
            <h3 className="font-semibold text-gray-700">Carte des arrêts</h3>
            {detail && (
              <span className="ml-auto text-xs bg-blue-50 text-blue-700
                px-2 py-1 rounded-full font-medium">
                Trajet {detail.trip_id || detail._id?.slice(-5)}
              </span>
            )}
          </div>
          <div className="h-[450px]">
            <MapContainer center={mapCenter} zoom={13}
              style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap" />

              {/* Arrêts */}
              {stops.map((s, i) => {
                const lat = parseFloat(s.stop_lat || s.latitude);
                const lng = parseFloat(s.stop_lon || s.longitude);
                if (isNaN(lat) || isNaN(lng)) return null;
                return (
                  <Marker key={s._id || i} position={[lat, lng]} icon={stopIcon}>
                    <Popup>
                      <b>{s.stop_name || s.nom || `Arrêt ${i+1}`}</b>
                    </Popup>
                  </Marker>
                );
              })}

              {/* Polyline du trajet sélectionné */}
              {detail && (
                <Polyline
                  positions={getRoutePoints(detail)}
                  color="#2563eb" weight={3} dashArray="8 5"
                />
              )}
            </MapContainer>
          </div>
        </div>

        {/* ── Liste des trajets ──────────────────────────────────── */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm
          border border-gray-100 flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <Clock size={16} className="text-blue-600" />
            <h3 className="font-semibold text-gray-700">Liste des trajets</h3>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <p className="text-center py-10 text-gray-400 text-sm">
                Chargement...
              </p>
            ) : trips.length === 0 ? (
              <p className="text-center py-10 text-gray-400 text-sm italic">
                Aucun trajet trouvé.
              </p>
            ) : (
              <div className="divide-y divide-gray-50">
                {trips.map((t, i) => (
                  <div key={t._id || i}
                    className={`
                      px-5 py-4 cursor-pointer transition
                      ${detail?._id === t._id
                        ? 'bg-blue-50'
                        : 'hover:bg-gray-50'}
                    `}
                    onClick={() => setDetail(detail?._id === t._id ? null : t)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono bg-gray-100
                            text-gray-600 px-2 py-0.5 rounded">
                            #{t.trip_id || t._id?.slice(-5) || i+1}
                          </span>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            t.service_id === 'actif' || t.statut === 'actif'
                              ? 'bg-green-50 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            {t.statut || 'Planifié'}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-800 mt-1 truncate">
                          {t.trip_headsign || t.nom || `Trajet ${i + 1}`}
                        </p>
                        <div className="flex items-center gap-3 mt-1.5 text-xs
                          text-gray-400">
                          <span className="flex items-center gap-1">
                            <MapPin size={10} />
                            {t.stops?.length || '—'} arrêts
                          </span>
                          <span className="flex items-center gap-1">
                            <Users size={10} />
                            {t.students?.length || '—'} élèves
                          </span>
                        </div>
                      </div>
                      <button
                        className={`p-1.5 rounded-lg transition flex-shrink-0 ${
                          detail?._id === t._id
                            ? 'bg-blue-100 text-blue-600'
                            : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        {detail?._id === t._id
                          ? <X size={14} />
                          : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Arrêts ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h3 className="font-semibold text-gray-700 mb-4">
          Arrêts enregistrés ({stops.length})
        </h3>
        {stops.length === 0 ? (
          <p className="text-sm text-gray-400 italic">Aucun arrêt enregistré.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {stops.slice(0, 9).map((s, i) => (
              <div key={s._id || i}
                className="flex items-center gap-3 p-3 rounded-xl
                  bg-gray-50 hover:bg-blue-50 transition">
                <div className="w-8 h-8 rounded-full bg-blue-100
                  flex items-center justify-center text-blue-700
                  text-xs font-bold flex-shrink-0">
                  {i + 1}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {s.stop_name || s.nom || `Arrêt ${i + 1}`}
                  </p>
                  <p className="text-xs text-gray-400 font-mono">
                    {parseFloat(s.stop_lat||s.latitude||0).toFixed(4)},&nbsp;
                    {parseFloat(s.stop_lon||s.longitude||0).toFixed(4)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}