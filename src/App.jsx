import React, { useState } from 'react';
import Login from './Login';
import Dashboard from './Dashboard';
import Materias from './Materias';
import Perfil from './Perfil';
import Comunidad from './Comunidad';

export default function App() {
  const [currentView, setCurrentView] = useState('login'); // Cambiado a dashboard por defecto para pruebas

  const navigateTo = (view) => setCurrentView(view);

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans">
      {currentView === 'login' && <Login onLogin={() => navigateTo('dashboard')} />}
      
      {currentView !== 'login' && (
        <div className="flex flex-col h-screen">
          {/* Navbar Superior al estilo Mockup */}
          <nav className="flex items-center justify-between px-6 py-4 bg-[#09090b] border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-lg flex items-center justify-center font-bold">F</div>
              <h1 className="text-xl font-bold tracking-wide">fouryou.ai</h1>
            </div>
            
            {/* Buscador (Visible en pantallas grandes) */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full">
                <input 
                  type="text" 
                  placeholder="Buscar contenido, temas..." 
                  className="w-full bg-[#18181b] border border-slate-800 rounded-full py-2 px-4 pl-10 text-sm focus:outline-none focus:border-purple-500 transition-colors"
                />
                <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-sm font-medium text-slate-300">
              <button onClick={() => navigateTo('dashboard')} className={`hover:text-white transition-colors ${currentView === 'dashboard' ? 'text-white' : ''}`}>Dashboard</button>
              <button onClick={() => navigateTo('materias')} className={`hover:text-white transition-colors ${currentView === 'materias' ? 'text-white' : ''}`}>Materias</button>
              <button onClick={() => navigateTo('comunidad')} className={`hover:text-white transition-colors ${currentView === 'comunidad' ? 'text-white' : ''}`}>Foro</button>
              <button onClick={() => navigateTo('perfil')} className={`hover:text-white transition-colors ${currentView === 'perfil' ? 'text-white' : ''}`}>Perfil</button>
              
              <button className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2 rounded-full transition-colors flex items-center gap-2">
                <span>+</span> Nueva Duda
              </button>
              
              <div className="w-8 h-8 bg-slate-700 rounded-full border border-slate-600 cursor-pointer overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
              </div>
            </div>
          </nav>

          {/* Área de Contenido Principal */}
          <main className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-7xl mx-auto">
              {currentView === 'dashboard' && <Dashboard />}
              {currentView === 'materias' && <Materias />}
              {currentView === 'perfil' && <Perfil />}
              {currentView === 'comunidad' && <Comunidad />}
            </div>
          </main>
        </div>
      )}
    </div>
  );
}