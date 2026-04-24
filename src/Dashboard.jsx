import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { collection, query, getDocs, doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { ia } from './RecomendadorIA';

export default function Dashboard() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [guardados, setGuardados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [vistaActual, setVistaActual] = useState('para-ti'); // 'para-ti' o 'guardados'

  useEffect(() => {
    const inicializarDashboard = async () => {
      if (!auth.currentUser) return;

      try {
        // 1. Obtener datos del usuario (Materias e Historial de Likes)
        const userRef = doc(db, "usuarios", auth.currentUser.uid);
        const userSnap = await getDoc(userRef);
        const userData = userSnap.data() || {};
        
        const materiasIds = userData.materias || [];
        const historial = userData.historialInteracciones || [];
        const misGuardados = userData.guardados || [];
        setGuardados(misGuardados);

        // 2. Preparar datos para entrenar la IA
        // Combinamos las materias seleccionadas (peso 1) con los likes previos
        let datosEntrenamiento = [...historial];
        
        // Si eligió materias en el Kardex, le decimos a la IA que eso le gusta mucho
        if (materiasIds.length > 0) {
          materiasIds.forEach(m => {
            // Buscamos etiquetas relacionadas a esa materia (simplificado)
            datosEntrenamiento.push({ tags: { [m]: 1 }, like: 1 });
          });
        }

        // 3. Entrenar Motor IA
        if (datosEntrenamiento.length > 0) {
          ia.entrenar(datosEntrenamiento);
        }

        // 4. Traer publicaciones del Foro (Nuestra fuente de contenido)
        const q = query(collection(db, "foro"));
        const querySnapshot = await getDocs(q);
        const posts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        // 5. Procesar con IA y ordenar
        const postsIA = posts.map(post => {
          const afinidad = ia.predecir(post.tags || {});
          return { ...post, afinidad };
        });

        // Ordenar: mayor afinidad primero
        postsIA.sort((a, b) => b.afinidad - a.afinidad);
        setPublicaciones(postsIA);

      } catch (error) {
        console.error("Error en Dashboard:", error);
      } finally {
        setCargando(false);
      }
    };

    inicializarDashboard();
  }, []);

  // Función para Guardar/Quitar de favoritos
  const toggleGuardar = async (postId) => {
    if (!auth.currentUser) return;
    const userRef = doc(db, "usuarios", auth.currentUser.uid);
    const esGuardado = guardados.includes(postId);

    try {
      if (esGuardado) {
        await updateDoc(userRef, { guardados: arrayRemove(postId) });
        setGuardados(prev => prev.filter(id => id !== postId));
      } else {
        await updateDoc(userRef, { guardados: arrayUnion(postId) });
        setGuardados(prev => [...prev, postId]);
      }
    } catch (error) {
      console.error("Error al guardar:", error);
    }
  };

  if (cargando) return <div className="text-center py-20 text-slate-500">Cargando recomendaciones inteligentes...</div>;

  // Filtrar para la vista de "Guardados"
  const postsAMostrar = vistaActual === 'para-ti' 
    ? publicaciones 
    : publicaciones.filter(p => guardados.includes(p.id));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        
        {/* Pestañas */}
        <div className="flex gap-4 mb-6 bg-[#18181b] p-1.5 rounded-full w-fit border border-slate-800">
          <button 
            onClick={() => setVistaActual('para-ti')}
            className={`${vistaActual === 'para-ti' ? 'bg-purple-600 text-white' : 'text-slate-400'} px-8 py-2 rounded-full text-sm font-medium transition-all`}
          >
            ✨ Para Ti
          </button>
          <button 
            onClick={() => setVistaActual('guardados')}
            className={`${vistaActual === 'guardados' ? 'bg-purple-600 text-white' : 'text-slate-400'} px-8 py-2 rounded-full text-sm font-medium transition-all`}
          >
            🔖 Guardados ({guardados.length})
          </button>
        </div>
        
        {postsAMostrar.length === 0 && (
            <div className="text-center py-10 border border-dashed border-slate-800 rounded-2xl text-slate-500">
                No hay nada por aquí todavía.
            </div>
        )}

        {postsAMostrar.map(post => (
          <div key={post.id} className="bg-[#121214] p-6 rounded-2xl border border-slate-800/60 shadow-xl relative group">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <img src={post.foto} className="w-10 h-10 rounded-full border border-slate-700" alt="autor" />
                <div>
                  <h4 className="font-semibold text-sm text-slate-200">{post.autor}</h4>
                  <p className="text-xs text-slate-500">Recomendado para ti</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${post.afinidad > 0.6 ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-slate-500/10 text-slate-400 border-slate-500/20'}`}>
                  {Math.round(post.afinidad * 100)}% Match
                </span>
                {/* BOTÓN GUARDAR CONFIGURADO */}
                <button 
                  onClick={() => toggleGuardar(post.id)}
                  className={`text-xl transition-transform active:scale-125 ${guardados.includes(post.id) ? 'text-purple-500' : 'text-slate-600 hover:text-slate-400'}`}
                >
                  {guardados.includes(post.id) ? '🔖' : '📑'}
                </button>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-2">{post.titulo}</h3>
            <p className="text-slate-400 text-sm mb-4 leading-relaxed">{post.contenido}</p>

            <div className="flex gap-2">
              {post.tags && Object.keys(post.tags).map(tag => (
                <span key={tag} className="text-[10px] border border-purple-500/30 text-purple-400 bg-purple-500/5 px-2 py-0.5 rounded-md">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Sidebar de Tendencias */}
      <div className="hidden lg:block space-y-6">
        <div className="bg-[#121214] p-6 rounded-2xl border border-slate-800/60">
          <h3 className="font-bold text-lg mb-4 text-slate-200">Temas para ti</h3>
          <p className="text-xs text-slate-500 mb-6">Basado en tu actividad reciente</p>
          <div className="space-y-4">
             {['IA', 'Python', 'React'].map((tema, i) => (
                 <div key={tema} className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">#{tema}</span>
                    <span className="text-xs text-slate-600">{100 - (i*10)}% relevancia</span>
                 </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}