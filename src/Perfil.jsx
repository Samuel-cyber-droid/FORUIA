import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';

export default function Perfil() {
  const usuario = auth.currentUser;
  
  // Estados para la biografía y la edición
  const [editando, setEditando] = useState(false);
  // Un texto por defecto ad hoc a tu carrera si el usuario es nuevo
  const [bio, setBio] = useState('Estudiante de Ingeniería en Sistemas Computacionales. Apasionado por la Ciencia de Datos y el desarrollo de software.');
  const [nuevaBio, setNuevaBio] = useState('');

  // Estados para las estadísticas reales
  const [stats, setStats] = useState({
    dudas: 0,
    materias: 0,
    likesDados: 0
  });

  useEffect(() => {
    const cargarDatosPerfil = async () => {
      if (!usuario) return;

      try {
        // 1. Obtener datos del usuario (Bio, Materias y Likes)
        const userRef = doc(db, "usuarios", usuario.uid);
        const userSnap = await getDoc(userRef);
        
        let conteoMaterias = 0;
        let conteoLikes = 0;

        if (userSnap.exists()) {
          const data = userSnap.data();
          if (data.biografia) setBio(data.biografia);
          conteoMaterias = data.materias ? data.materias.length : 0;
          conteoLikes = data.historialInteracciones ? data.historialInteracciones.length : 0;
        }

        // 2. Buscar cuántas publicaciones ha hecho este usuario en el Foro
        const q = query(collection(db, "foro"), where("autor", "==", usuario.displayName));
        const querySnapshot = await getDocs(q);
        const conteoDudas = querySnapshot.size;

        // Actualizar la pantalla con los números reales
        setStats({
          dudas: conteoDudas,
          materias: conteoMaterias,
          likesDados: conteoLikes
        });

      } catch (error) {
        console.error("Error al cargar perfil:", error);
      }
    };

    cargarDatosPerfil();
  }, [usuario]);

  // Función para guardar la nueva biografía en Firestore
  const guardarBio = async () => {
    if (!usuario || !nuevaBio.trim()) return;
    
    try {
      const userRef = doc(db, "usuarios", usuario.uid);
      await updateDoc(userRef, { biografia: nuevaBio });
      setBio(nuevaBio);
      setEditando(false);
    } catch (error) {
      console.error("Error al guardar biografía:", error);
    }
  };

  const iniciarEdicion = () => {
    setNuevaBio(bio);
    setEditando(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      
      {/* Header del Perfil */}
      <div className="flex flex-col md:flex-row gap-8 items-start relative mb-12">
        <div className="relative">
          <div className="w-40 h-40 bg-slate-800 rounded-3xl flex items-center justify-center shadow-lg overflow-hidden border-4 border-[#09090b]">
            <img 
              src={usuario?.photoURL || "https://api.dicebear.com/7.x/shapes/svg?seed=fouryou"} 
              alt="Avatar" 
              className="w-full h-full object-cover" 
            />
          </div>
          <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full border-2 border-[#09090b] shadow-lg">
            ESTUDIANTE
          </span>
        </div>

        <div className="flex-1 pt-2 w-full">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white flex flex-col md:flex-row md:items-center gap-2">
                {usuario?.displayName || "Usuario Académico"}
                <span className="text-sm font-normal text-purple-400">
                  {usuario?.email || "correo@ejemplo.com"}
                </span>
              </h1>
            </div>
            {!editando && (
              <button 
                onClick={iniciarEdicion}
                className="bg-transparent border border-slate-600 text-white hover:bg-slate-800 px-6 py-2 rounded-xl text-sm font-medium transition-colors"
              >
                Editar Biografía
              </button>
            )}
          </div>

          {/* Sistema de edición de Biografía */}
          <div className="mt-6 max-w-2xl">
            {editando ? (
              <div className="space-y-3">
                <textarea 
                  value={nuevaBio}
                  onChange={(e) => setNuevaBio(e.target.value)}
                  className="w-full bg-[#18181b] border border-purple-500 rounded-xl p-3 text-sm text-slate-200 outline-none resize-none h-24 shadow-[0_0_15px_rgba(168,85,247,0.1)]"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button onClick={guardarBio} className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-colors">Guardar</button>
                  <button onClick={() => setEditando(false)} className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-1.5 rounded-lg text-sm font-bold transition-colors">Cancelar</button>
                </div>
              </div>
            ) : (
              <p className="text-slate-300 text-sm leading-relaxed border-l-2 border-slate-800 pl-4">
                {bio}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Grid de Estadísticas Reales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#121214] p-6 rounded-2xl border border-slate-800/60 relative overflow-hidden group hover:border-purple-500/50 transition-colors shadow-xl">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-xl">📝</div>
          </div>
          <p className="text-slate-500 text-sm font-medium mb-1">Dudas publicadas</p>
          <h2 className="text-4xl font-bold text-white">{stats.dudas}</h2>
        </div>

        <div className="bg-[#121214] p-6 rounded-2xl border border-slate-800/60 relative overflow-hidden group hover:border-purple-500/50 transition-colors shadow-xl">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-xl">📚</div>
          </div>
          <p className="text-slate-500 text-sm font-medium mb-1">Materias cursando</p>
          <h2 className="text-4xl font-bold text-white">{stats.materias}</h2>
        </div>

        <div className="bg-[#121214] p-6 rounded-2xl border border-slate-800/60 relative overflow-hidden group hover:border-purple-500/50 transition-colors shadow-xl">
          <div className="flex justify-between items-start mb-6">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-400 flex items-center justify-center text-xl">👍</div>
          </div>
          <p className="text-slate-500 text-sm font-medium mb-1">Interacciones (Likes)</p>
          <h2 className="text-4xl font-bold text-white">{stats.likesDados}</h2>
        </div>
      </div>
    </div>
  );
}