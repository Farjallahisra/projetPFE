import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  MapPin, BarChart2, Bell, Users, GraduationCap,
  Truck, Bus, LogOut, ChevronLeft, Moon, Sun, User
} from 'lucide-react';

const navGroups = [
  {
    label: 'SUPERVISION',
    items: [
      { path: '/dashboard',    label: 'Localisation',   icon: MapPin,        badge: 'LIVE',   badgeColor: 'bg-green-500' },
      { path: '/statistics',   label: 'Statistiques',   icon: BarChart2 },
      { path: '/alerts',       label: 'Alertes',         icon: Bell,          badge: 'URGENT', badgeColor: 'bg-red-500' },
    ],
  },
  {
    label: 'GESTION',
    items: [
      { path: '/parents',    label: 'Parents',      icon: Users },
      { path: '/students',   label: 'Élèves',       icon: GraduationCap },
      { path: '/drivers',    label: 'Conducteurs',  icon: Truck },
      { path: '/vehicles',   label: 'Bus',          icon: Bus },
    ],
  },
];

export default function Layout() {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);
  const location = useLocation();

  const now = new Date();
  const dateStr = now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  const timeStr = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const [time, setTime] = useState(timeStr);
  useEffect(() => {
    const iv = setInterval(() => {
      setTime(new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  return (
    <div className={`flex h-screen overflow-hidden ${dark ? 'bg-gray-900' : 'bg-gray-50'}`}>

      {/* ══ SIDEBAR ══════════════════════════════════════════════════ */}
      <aside className={`
        ${collapsed ? 'w-16' : 'w-52'} flex-shrink-0
        bg-white border-r border-gray-200 flex flex-col
        transition-all duration-300 shadow-sm
      `}>

        {/* Logo + collapse btn */}
        <div className="flex items-center justify-between px-3 py-4 border-b border-gray-100">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center
                justify-center text-white font-black text-sm flex-shrink-0">
                BSI
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800 leading-tight">
                  BusScolaireIntelligent
                </p>
                <p className="text-[10px] text-gray-400">
                  Gestion de transport scolaire
                </p>
              </div>
            </div>
          )}
          {collapsed && (
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center
              justify-center text-white font-black text-sm mx-auto">
              BSI
            </div>
          )}
          {!collapsed && (
            <button onClick={() => setCollapsed(true)}
              className="p-1 rounded-md hover:bg-gray-100 text-gray-400 transition">
              <ChevronLeft size={14} />
            </button>
          )}
        </div>

        {/* Date/heure */}
        {!collapsed && (
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-[10px] text-gray-400">{dateStr}</p>
            <p className="text-sm font-semibold text-gray-700">{time}</p>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3 px-2">
          {navGroups.map(group => (
            <div key={group.label} className="mb-4">
              {!collapsed && (
                <p className="text-[9px] font-bold text-gray-400 tracking-widest
                  uppercase px-2 mb-1.5">
                  {group.label}
                </p>
              )}
              {group.items.map(({ path, label, icon: Icon, badge, badgeColor }) => (
                <NavLink key={path} to={path}
                  className={({ isActive }) => `
                    flex items-center gap-2.5 px-2.5 py-2 rounded-lg mb-0.5
                    text-xs font-medium transition-all
                    ${isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'}
                  `}
                >
                  <Icon size={15} className="flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1">{label}</span>
                      {badge && (
                        <span className={`${badgeColor} text-white text-[9px]
                          font-bold px-1.5 py-0.5 rounded`}>
                          {badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        {/* Bottom: user + actions */}
        <div className="border-t border-gray-100 p-3">
          {/* Dark mode */}
          <button onClick={() => setDark(!dark)}
            className="flex items-center gap-2 px-2.5 py-2 rounded-lg
              text-xs text-gray-500 hover:bg-gray-100 transition w-full mb-1">
            {dark ? <Sun size={14} /> : <Moon size={14} />}
            {!collapsed && <span>{dark ? 'Mode clair' : 'Mode sombre'}</span>}
          </button>

          {/* User info */}
          {!collapsed && (
            <div className="flex items-center gap-2 px-2 py-1.5 mb-1">
              <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center
                justify-center text-blue-700 text-xs font-bold flex-shrink-0">
                <User size={13} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-800 truncate">
                  {user?.username || 'Administrateur'}
                </p>
                <p className="text-[10px] text-gray-400 truncate">
                  {user?.email || 'admin@gmail.com'}
                </p>
              </div>
            </div>
          )}

          {/* Logout */}
          <button onClick={logout}
            className="flex items-center gap-2 px-2.5 py-2 rounded-lg
              text-xs text-red-500 hover:bg-red-50 transition w-full">
            <LogOut size={14} />
            {!collapsed && <span>→ Déconnexion</span>}
          </button>

          {/* Expand btn when collapsed */}
          {collapsed && (
            <button onClick={() => setCollapsed(false)}
              className="flex items-center justify-center w-full p-2 rounded-lg
                hover:bg-gray-100 text-gray-400 transition mt-1">
              <ChevronLeft size={14} className="rotate-180" />
            </button>
          )}
        </div>
      </aside>

      {/* ══ CONTENU ══════════════════════════════════════════════════ */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}