import React from 'react';
// 1. Importamos la conexión de autenticación que creamos
import { auth } from './firebase';

export default function Perfil() {
  // 2. Extraemos los datos del usuario que acaba de iniciar sesión
  const usuario = auth.currentUser;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header del Perfil */}
      <div className="flex flex-col md:flex-row gap-8 items-start relative mb-12">
        
        {/* Avatar Dinámico */}
        <div className="relative">
          <div className="w-40 h-40 bg-slate-800 rounded-3xl flex items-center justify-center shadow-lg overflow-hidden border-4 border-[#09090b]">
            {/* Si el usuario tiene foto de Google, la mostramos. Si no, mostramos un ícono */}
            <img 
              src={usuario?.photoURL || "https://api.dicebear.com/7.x/shapes/svg?seed=fouryou"} 
              alt="Avatar" 
              className="w-full h-full object-cover" 
            />
          </div>
          <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full border-2 border-[#09090b]">
            ESTUDIANTE
          </span>
        </div>

        {/* Info y Bio Dinámica */}
        <div className="flex-1 pt-2">
          <div className="flex justify-between items-start">
            <div>
              {/* Mostramos el nombre y correo real de Google */}
              <h1 className="text-3xl font-bold text-white flex flex-col md:flex-row md:items-center gap-2">
                {usuario?.displayName || "Usuario Académico"}
                <span className="text-sm font-normal text-purple-400">
                  {usuario?.email || "correo@ejemplo.com"}
                </span>
              </h1>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <button className="bg-transparent border border-slate-600 text-white hover:bg-slate-800 px-6 py-2 rounded-xl text-sm font-medium transition-colors">
                Editar Biografía
              </button>
            </div>
          </div>

          <p className="mt-4 text-slate-300 text-sm leading-relaxed max-w-2xl">
            Estudiante de Ingeniería en Sistemas. Apasionado por el desarrollo Full-Stack y la Inteligencia Artificial. Buscando siempre aprender y compartir conocimiento con la comunidad.
          </p>
        </div>
      </div>

      {/* Grid de Estadísticas (Aún simuladas para la vista) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#121214] p-6 rounded-2xl border border-slate-800/60 relative overflow-hidden group hover:border-purple-500/50 transition-colors">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-xl">
              📝
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium mb-1">Dudas publicadas</p>
          <h2 className="text-4xl font-bold text-white">1</h2> {/* Aquí luego conectaremos cuántas dudas has subido */}
        </div>

        <div className="bg-[#121214] p-6 rounded-2xl border border-slate-800/60 relative overflow-hidden group hover:border-purple-500/50 transition-colors">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center text-xl">
              🧠
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium mb-1">Afinidad con IA</p>
          <h2 className="text-4xl font-bold text-white">85%</h2>
        </div>
      </div>
    </div>
  );
}