import React from 'react';
import { LayoutDashboard, Users, Map, Settings, LogOut, Bus } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/dashboard' },
    { icon: <Users size={20} />, label: 'Élèves', path: '/students' },
    { icon: <Bus size={20} />, label: 'Trajets', path: '/trips' },
    { icon: <Settings size={20} />, label: 'Paramètres', path: '/settings' },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-[#1e293b] text-white flex flex-col shadow-xl">
      <div className="p-6 border-b border-gray-700 flex items-center gap-3">
        <div className="bg-blue-500 p-2 rounded-lg">
          <Bus size={24} className="text-white" />
        </div>
        <h1 className="text-xl font-bold tracking-tight">SmartBus IPTS</h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all ${
              location.pathname === item.path 
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
          >
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button 
          onClick={() => navigate('/')}
          className="w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
        >
          <LogOut size={20} />
          <span className="font-medium">Déconnexion</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;