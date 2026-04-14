import React, { useState, useEffect } from 'react';
// 1. Importamos la instancia de la IA que creamos previamente
import { ia } from './RecomendadorIA'; 

export default function Dashboard() {
  const [publicaciones, setPublicaciones] = useState([]);

  // Simulamos el historial del usuario (Lo que le ha gustado en el pasado)
  // En la vida real, esto vendría de Firebase
  const historialUsuario = [
    { tags: { IA: 1, MachineLearning: 1 }, like: 1 }, // Le gustó contenido de IA
    { tags: { Python: 1, Datos: 1 }, like: 1 },       // Le gustó contenido de Python
    { tags: { Redes: 1, Cisco: 1 }, like: 0 },        // Ignoró contenido de Redes
    { tags: { Frontend: 1, CSS: 1 }, like: 0 },       // Ignoró contenido de Frontend
  ];

  // Simulamos nuevas publicaciones hechas por profesores
  const publicacionesNuevas = [
    {
      id: 1,
      profesor: "Dr. Ana Martínez",
      titulo: "Arquitectura de Redes 5G",
      descripcion: "Un vistazo a los protocolos de la nueva generación de telecomunicaciones.",
      tags: { Redes: 1, Telecom: 1 },
      etiquetasVisuales: ["#Redes", "#5G"]
    },
    {
      id: 2,
      profesor: "Ing. Carlos Ruiz",
      titulo: "Creando una API con Django y Python",
      descripcion: "Tutorial paso a paso para desplegar un backend robusto.",
      tags: { Python: 1, Backend: 1 },
      etiquetasVisuales: ["#Python", "#Django"]
    },
    {
      id: 3,
      profesor: "Dra. Elena Silva",
      titulo: "Redes Neuronales Convolucionales",
      descripcion: "Cómo las computadoras aprenden a ver y procesar imágenes.",
      tags: { IA: 1, MachineLearning: 1 },
      etiquetasVisuales: ["#IA", "#ComputerVision"]
    }
  ];

  useEffect(() => {
    // 2. Entrenamos la IA con los gustos del usuario al cargar el componente
    ia.entrenar(historialUsuario);

    // 3. Procesamos las publicaciones nuevas usando la IA
    const publicacionesEvaluadas = publicacionesNuevas.map(post => {
      // Le preguntamos a la IA qué tanta afinidad hay
      const probabilidad = ia.predecir(post.tags); 
      return { ...post, afinidad: probabilidad };
    });

    // 4. Ordenamos las publicaciones (Las de mayor afinidad van primero)
    publicacionesEvaluadas.sort((a, b) => b.afinidad - a.afinidad);

    // Actualizamos el estado para que React las pinte en pantalla
    setPublicaciones(publicacionesEvaluadas);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        
        <div className="flex gap-4 mb-6 bg-[#18181b] p-1.5 rounded-full w-fit border border-slate-800">
          <button className="bg-purple-600 text-white px-8 py-2 rounded-full text-sm font-medium shadow-lg">✨ Para Ti</button>
          <button className="text-slate-400 hover:text-white px-8 py-2 rounded-full text-sm font-medium">🔖 Guardados</button>
        </div>
        
        {/* Renderizamos las publicaciones ya ordenadas por la IA */}
        {publicaciones.map(post => (
          <div key={post.id} className="bg-[#121214] p-5 rounded-2xl shadow-xl border border-slate-800/60 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center font-bold">
                  {post.profesor.charAt(0)}
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-200">{post.profesor}</h4>
                </div>
              </div>
              
              {/* Mostramos el porcentaje de "Match" o afinidad */}
              <span className={`px-3 py-1 rounded-full text-xs font-bold border ${post.afinidad > 0.7 ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                {Math.round(post.afinidad * 100)}% Match
              </span>
            </div>

            <h3 className="text-xl font-bold text-slate-100 mb-2">{post.titulo}</h3>
            <p className="text-slate-400 text-sm mb-4">{post.descripcion}</p>

            <div className="flex gap-2">
              {post.etiquetasVisuales.map(tag => (
                <span key={tag} className="border border-purple-500/30 text-purple-400 bg-purple-500/5 px-3 py-1 rounded-full text-xs">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Barra Lateral (Sin cambios) */}
      <div className="space-y-6">
        <div className="bg-[#121214] p-6 rounded-2xl border border-slate-800/60">
          <h3 className="font-bold text-lg mb-6 text-slate-200 flex items-center gap-2">📈 Temas Trending</h3>
          <ul className="space-y-5">
             <li className="flex items-center gap-4 cursor-pointer group">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center text-sm font-bold border border-blue-500/20">01</div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-200 group-hover:text-purple-400">Machine Learning</h4>
                  <p className="text-xs text-slate-500">1,547 publicaciones</p>
                </div>
              </li>
          </ul>
        </div>
      </div>
    </div>
  );
}