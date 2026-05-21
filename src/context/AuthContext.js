import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

// 1. Créer le contexte
const AuthContext = createContext();

// 2. Provider — enveloppe toute l'application
export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);   // infos utilisateur connecté
  const [token, setToken]     = useState(null);   // le token JWT
  const [role, setRole]       = useState(null);   // 'superadmin' | 'admin' | 'driver'
  const [loading, setLoading] = useState(true);   // chargement initial

  // Au démarrage : recharger depuis localStorage si déjà connecté
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser  = localStorage.getItem('user');
    const savedRole  = localStorage.getItem('role');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setRole(savedRole);
    }
    setLoading(false);
  }, []);

  // ── LOGIN ─────────────────────────────────────────────────────
  const login = async (email, password) => {
    const response = await API.post('/api/session', { email, password });
    const data = response.data;

    // Stocker dans le state
    setUser(data);
    setToken(data.token.data);
    setRole(data.role);

    // Stocker dans localStorage (persiste après rechargement)
    localStorage.setItem('token', data.token.data);
    localStorage.setItem('user', JSON.stringify(data));
    localStorage.setItem('role', data.role);
    localStorage.setItem('userId', data._id);

    return data;
  };

  // ── LOGOUT ────────────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);
    localStorage.clear();
    window.location.href = '/login';
  };

  // ── Helpers de rôles ─────────────────────────────────────────
  const isSuperAdmin   = role === 'superadmin';
  const isAdmin        = role === 'admin' || role === 'superadmin';

  return (
    <AuthContext.Provider value={{ user, token, role, loading, login, logout, isSuperAdmin, isAdmin }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

// 3. Hook personnalisé — utilise dans n'importe quelle page
export const useAuth = () => useContext(AuthContext);