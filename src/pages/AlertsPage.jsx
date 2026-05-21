import React, { useState, useEffect } from 'react';
import { Thermometer, Droplets, Gauge } from 'lucide-react';
import API from '../api/axios';

export default function AlertsPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const r = await API.get('/api/messages');
        setMessages(r.data?.messages || r.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const borderFor = (m) =>
    m.color ||
    (m.type === 'error' ? 'border-red-500' : m.type === 'warning' ? 'border-orange-500' : 'border-blue-500');

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      <h1 className="text-xl font-bold text-gray-800">Alertes</h1>

      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-100 bg-red-50/80">
          <p className="text-sm font-bold text-red-800">Alertes récentes</p>
          <p className="text-xs text-red-600/80">Événements issus de la base (messages / logs)</p>
        </div>
        {loading ? (
          <p className="p-8 text-center text-gray-400 text-sm">Chargement...</p>
        ) : messages.length === 0 ? (
          <p className="p-8 text-center text-gray-400 text-sm italic">Aucune alerte.</p>
        ) : (
          <ul className="divide-y divide-gray-50">
            {messages.map((m) => (
              <li
                key={m._id}
                className={`px-5 py-4 flex justify-between gap-4 border-l-4 ${borderFor(m)}`}
              >
                <span className="text-sm text-gray-800">
                  {m.content || m.text || m.msg}
                </span>
                <span className="text-xs text-gray-400 whitespace-nowrap font-mono">
                  {m.createdAt ? new Date(m.createdAt).toLocaleString('fr-FR') : ''}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-sm font-bold text-gray-800 mb-2">Messages des parents</h2>
        <p className="text-sm text-gray-400 italic">Aucun message des parents.</p>
      </section>

      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-sm font-bold text-gray-800 mb-4">Données du capteur (démo)</h2>
        <p className="text-xs text-gray-500 mb-4">
          Branchez ici un flux temps réel (MQTT / WebSocket) depuis votre backend.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-xl border border-gray-100 p-4 flex items-center gap-3">
            <Thermometer className="text-orange-500" size={22} />
            <div>
              <p className="text-2xl font-bold text-gray-800">25°C</p>
              <p className="text-xs text-gray-400">Température</p>
            </div>
          </div>
          <div className="rounded-xl border border-gray-100 p-4 flex items-center gap-3">
            <Droplets className="text-blue-500" size={22} />
            <div>
              <p className="text-2xl font-bold text-gray-800">60%</p>
              <p className="text-xs text-gray-400">Humidité</p>
            </div>
          </div>
          <div className="rounded-xl border border-gray-100 p-4 flex items-center gap-3">
            <Gauge className="text-emerald-600" size={22} />
            <div>
              <p className="text-2xl font-bold text-gray-800">1013 hPa</p>
              <p className="text-xs text-gray-400">Pression</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
