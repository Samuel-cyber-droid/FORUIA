import React, { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import Materias from './Materias';
import Perfil from './Perfil';
import Comunidad from './Comunidad';

export default function App() {
  const [currentView, setCurrentView] = useState('login');

  const navigateTo = (view) => setCurrentView(view);

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      {currentView === 'login' && <Login onLogin={() => navigateTo('dashboard')} />}
      
      {currentView !== 'login' && (
        <div className="flex flex-col h-screen">
          {/* Navbar Superior */}
          <nav className="flex items-center justify-between p-4 bg-slate-800 border-b border-slate-700">
            <h1 className="text-2xl font-bold text-blue-500">FouryouAI</h1>
            <div className="space-x-4 flex items-center">
              <button onClick={() => navigateTo('dashboard')} className="hover:text-blue-400 transition-colors">Dashboard</button>
              <button onClick={() => navigateTo('materias')} className="hover:text-blue-400 transition-colors">Materias</button>
              <button onClick={() => navigateTo('comunidad')} className="hover:text-blue-400 transition-colors">Foro</button>
              <button onClick={() => navigateTo('perfil')} className="hover:text-blue-400 transition-colors">Perfil</button>
              <button onClick={() => navigateTo('login')} className="text-red-400 hover:text-red-300 ml-4 border border-red-900 px-3 py-1 rounded transition-colors">Salir</button>
            </div>
          </nav>

          {/* Área de Contenido Principal */}
          <main className="flex-1 p-6 overflow-y-auto">
            {currentView === 'dashboard' && <Dashboard />}
            {currentView === 'materias' && <Materias />}
            {currentView === 'perfil' && <Perfil />}
            {currentView === 'comunidad' && <Comunidad />}
          </main>
        </div>
      )}
    </div>
  );
}