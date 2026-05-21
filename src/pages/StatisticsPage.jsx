import React, { useState, useEffect } from 'react';
import { Bus, CheckCircle, XCircle, Bell } from 'lucide-react';
import API from '../api/axios';

export default function StatisticsPage() {
  // 1. États pour stocker les données
  const [stats, setStats] = useState({ stops: 0, present: 0, absent: 0 });
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Chargement des données depuis le Backend
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);

        // On appelle les étudiants, les messages et les arrêts en parallèle
        const [sRes, nRes, stRes] = await Promise.all([
          API.get('/api/students'),
          API.get('/api/messages'),
          API.get('/api/stops')
        ]);

        // --- TRAITEMENT DES ÉTUDIANTS (STATS) ---
        const students = sRes.data?.students || sRes.data || [];
        const presentCount = students.filter(s => s.est_present === true || s.present === true).length;
        const absentCount = students.length - presentCount;

        // --- TRAITEMENT DES ARRÊTS ---
        const stopsCount = (stRes.data?.stops || stRes.data || []).length;

        setStats({
          stops: stopsCount,
          present: presentCount,
          absent: absentCount
        });

        // --- TRAITEMENT DES MESSAGES (ALERTES) ---
        // On récupère les données et on les formate pour le design
        const messagesFromDB = nRes.data?.messages || nRes.data || [];
        
        const formatted = messagesFromDB.map(m => ({
          id: m._id || m.id,
          msg: m.content || m.text || m.msg || "Aucun message",
          time: m.createdAt ? new Date(m.createdAt).toLocaleTimeString() : 'Heure inconnue',
          // On définit la couleur selon le type de message (si existe dans ta DB)
          color: m.type === 'error' ? 'border-red-500' : 'border-blue-500'
        }));

        // ON MET À JOUR UNIQUEMENT AVEC LES DONNÉES DU SERVEUR
        setNotifs(formatted);

      } catch (error) {
        console.error("Erreur de connexion au serveur :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Tableau de Bord & Alertes</h1>
        <div className="text-sm text-gray-500">
          {loading ? "Mise à jour..." : "Données synchronisées avec MongoDB"}
        </div>
      </div>

      {/* ── Cartes de Statistiques ─────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Carte Présents */}
        <div className="bg-green-500 p-6 rounded-3xl text-white shadow-lg shadow-green-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium opacity-90">Élèves Présents</p>
              <p className="text-5xl font-bold mt-2">
                {loading ? '...' : stats.present}
              </p>
            </div>
            <CheckCircle size={32} className="opacity-40" />
          </div>
        </div>

        {/* Carte Absents */}
        <div className="bg-red-500 p-6 rounded-3xl text-white shadow-lg shadow-red-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium opacity-90">Élèves Absents</p>
              <p className="text-5xl font-bold mt-2">
                {loading ? '...' : stats.absent}
              </p>
            </div>
            <XCircle size={32} className="opacity-40" />
          </div>
        </div>

        {/* Carte Arrêts */}
        <div className="bg-blue-600 p-6 rounded-3xl text-white shadow-lg shadow-blue-100">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium opacity-90">Total Arrêts</p>
              <p className="text-5xl font-bold mt-2">
                {loading ? '...' : stats.stops}
              </p>
            </div>
            <Bus size={32} className="opacity-40" />
          </div>
        </div>
      </div>

      {/* ── Section Alertes / Notifications ────────────────────────── */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-yellow-400 px-6 py-4 flex items-center gap-3">
          <Bell size={20} className="text-yellow-900" />
          <div>
            <h2 className="font-bold text-yellow-900">Alertes en temps réel</h2>
            <p className="text-xs text-yellow-800">Flux direct depuis la base de données</p>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {notifs.length > 0 ? (
            notifs.map((n) => (
              <div key={n.id} className={`px-6 py-4 border-l-4 ${n.color} hover:bg-gray-50 transition-colors flex justify-between items-center`}>
                <p className="text-gray-700 font-medium">{n.msg}</p>
                <span className="text-xs text-gray-400 font-mono">{n.time}</span>
              </div>
            ))
          ) : (
            <div className="py-20 text-center">
              <Bell size={40} className="mx-auto text-gray-200 mb-3" />
              <p className="text-gray-400 italic">
                {loading ? "Chargement..." : "Aucune alerte trouvée dans la base de données."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}