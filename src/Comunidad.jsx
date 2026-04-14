import React, { useState, useEffect } from 'react';
// 1. Importamos las herramientas de tu base de datos y usuario actual
import { db, auth } from './firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

export default function Comunidad() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');

  // 2. Este "Efecto" lee la base de datos en tiempo real apenas abres el foro
  useEffect(() => {
    // Apuntamos a la colección "foro" ordenando de lo más nuevo a lo más viejo
    const q = query(collection(db, "foro"), orderBy("fecha", "desc"));
    
    // onSnapshot es mágico: actualiza la pantalla al instante si alguien más publica algo
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPublicaciones(posts);
    });

    return () => unsubscribe();
  }, []);

  // 3. Función para enviar los datos de tu formulario a Firebase
  const publicarDuda = async (e) => {
    e.preventDefault();
    if (!titulo.trim() || !contenido.trim()) return;

    try {
      await addDoc(collection(db, "foro"), {
        titulo: titulo,
        contenido: contenido,
        // Usamos los datos reales del usuario que inició sesión
        autor: auth.currentUser ? auth.currentUser.displayName : "Usuario Anónimo",
        foto: auth.currentUser ? auth.currentUser.photoURL : "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
        fecha: serverTimestamp(),
        likes: 0
      });
      // Limpiamos los inputs después de publicar
      setTitulo('');
      setContenido('');
    } catch (error) {
      console.error("Error al publicar:", error);
      alert("Error al guardar. Asegúrate de haber habilitado Firestore en modo de prueba.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Caja para crear una nueva publicación */}
      <div className="bg-[#121214] p-6 rounded-2xl border border-slate-800/60 shadow-xl">
        <h2 className="text-xl font-bold text-slate-100 mb-4">¿Tienes alguna duda académica?</h2>
        <form onSubmit={publicarDuda} className="space-y-4">
          <input 
            type="text" 
            placeholder="Título de tu duda (ej. Error en React con Vite)"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="w-full bg-[#18181b] border border-slate-800 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:border-purple-500 transition-colors"
          />
          <textarea 
            placeholder="Describe tu problema con más detalle..."
            value={contenido}
            onChange={(e) => setContenido(e.target.value)}
            rows="3"
            className="w-full bg-[#18181b] border border-slate-800 rounded-xl py-3 px-4 text-slate-200 focus:outline-none focus:border-purple-500 transition-colors resize-none"
          ></textarea>
          <div className="flex justify-end">
            <button 
              type="submit"
              className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-xl transition-colors font-medium shadow-lg"
            >
              Publicar Duda
            </button>
          </div>
        </form>
      </div>

      {/* Lista de publicaciones de la comunidad */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-200 mb-2">Últimas publicaciones</h3>
        
        {publicaciones.length === 0 ? (
          <p className="text-slate-500 text-center py-8">Aún no hay publicaciones. ¡Sé el primero en preguntar algo!</p>
        ) : (
          publicaciones.map(post => (
            <div key={post.id} className="bg-[#121214] p-5 rounded-xl border border-slate-800/60 transition-colors hover:border-purple-500/30">
              <div className="flex gap-4">
                <img src={post.foto} alt={post.autor} className="w-10 h-10 rounded-full bg-slate-800" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-slate-200">{post.autor}</h4>
                    <span className="text-xs text-slate-500">
                      {/* Formateamos la fecha si existe */}
                      {post.fecha?.toDate().toLocaleDateString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{post.titulo}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{post.contenido}</p>
                  
                  <div className="flex gap-4">
                    <button className="flex items-center gap-2 text-slate-500 hover:text-purple-400 text-sm transition-colors">
                      <span>👍</span> {post.likes || 0}
                    </button>
                    <button className="flex items-center gap-2 text-slate-500 hover:text-blue-400 text-sm transition-colors">
                      <span>💬</span> Responder
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}