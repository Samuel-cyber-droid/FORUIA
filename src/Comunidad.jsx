import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { 
  collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, 
  doc, updateDoc, increment, arrayUnion, getDoc, setDoc 
} from 'firebase/firestore';

export default function Comunidad() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [tagSeleccionado, setTagSeleccionado] = useState('Programación');
  
  // Estados para comentarios
  const [postExpandido, setPostExpandido] = useState(null); // ID del post que estamos comentando
  const [nuevaRespuesta, setNuevaRespuesta] = useState('');
  const [comentarios, setComentarios] = useState({}); // { postId: [comentarios] }

  const tagsDisponibles = ['Programación', 'Matemáticas', 'IA', 'Redes', 'Bases de Datos'];

  useEffect(() => {
    const q = query(collection(db, "foro"), orderBy("fecha", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPublicaciones(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  // Función para cargar comentarios de un post específico cuando se hace clic
  const cargarComentarios = (postId) => {
    if (postExpandido === postId) {
      setPostExpandido(null);
      return;
    }

    const q = query(collection(db, `foro/${postId}/comentarios`), orderBy("fecha", "asc"));
    onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setComentarios(prev => ({ ...prev, [postId]: docs }));
      setPostExpandido(postId);
    });
  };

  const publicarDuda = async (e) => {
    e.preventDefault();
    if (!titulo.trim() || !contenido.trim() || !auth.currentUser) return;
    try {
      await addDoc(collection(db, "foro"), {
        titulo, contenido,
        autor: auth.currentUser.displayName,
        foto: auth.currentUser.photoURL,
        fecha: serverTimestamp(),
        likes: 0,
        comentariosCount: 0,
        tags: { [tagSeleccionado]: 1 }
      });
      setTitulo(''); setContenido('');
    } catch (e) { console.error(e); }
  };

  const enviarRespuesta = async (postId) => {
    if (!nuevaRespuesta.trim() || !auth.currentUser) return;
    try {
      // 1. Agregar el comentario a la sub-colección
      await addDoc(collection(db, `foro/${postId}/comentarios`), {
        texto: nuevaRespuesta,
        autor: auth.currentUser.displayName,
        foto: auth.currentUser.photoURL,
        fecha: serverTimestamp()
      });
      // 2. Incrementar el contador en el post principal
      await updateDoc(doc(db, "foro", postId), {
        comentariosCount: increment(1)
      });
      setNuevaRespuesta('');
    } catch (e) { console.error(e); }
  };

  const darLike = async (post) => {
    if (!auth.currentUser) return;
    try {
      await updateDoc(doc(db, "foro", post.id), { likes: increment(1) });
      const userRef = doc(db, "usuarios", auth.currentUser.uid);
      await updateDoc(userRef, { 
        historialInteracciones: arrayUnion({ tags: post.tags, like: 1 }) 
      });
    } catch (e) { console.error(e); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Formulario de publicación (Igual que antes) */}
      <div className="bg-[#121214] p-6 rounded-2xl border border-slate-800/60 shadow-xl">
        <h2 className="text-xl font-bold text-slate-100 mb-4">¿Tienes alguna duda?</h2>
        <form onSubmit={publicarDuda} className="space-y-4">
          <input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Título" className="w-full bg-[#18181b] border border-slate-800 rounded-xl py-3 px-4 text-white focus:border-purple-500 outline-none" />
          <select value={tagSeleccionado} onChange={e => setTagSeleccionado(e.target.value)} className="w-full bg-[#18181b] border border-slate-800 rounded-xl py-3 px-4 text-white outline-none">
            {tagsDisponibles.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <textarea value={contenido} onChange={e => setContenido(e.target.value)} placeholder="Descripción..." className="w-full bg-[#18181b] border border-slate-800 rounded-xl py-3 px-4 text-white outline-none h-24" />
          <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 py-3 rounded-xl font-bold transition-all">Publicar</button>
        </form>
      </div>

      {/* Lista de Publicaciones */}
      {publicaciones.map(post => (
        <div key={post.id} className="bg-[#121214] border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <img src={post.foto} className="w-10 h-10 rounded-full" alt="" />
              <span className="font-bold text-slate-200">{post.autor}</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{post.titulo}</h3>
            <p className="text-slate-400 mb-4">{post.contenido}</p>
            
            <div className="flex gap-4">
              <button onClick={() => darLike(post)} className="flex items-center gap-2 text-slate-500 hover:text-purple-400 transition-colors">
                <span>👍</span> {post.likes || 0}
              </button>
              <button onClick={() => cargarComentarios(post.id)} className="flex items-center gap-2 text-slate-500 hover:text-blue-400 transition-colors">
                <span>💬</span> {post.comentariosCount || 0} Comentarios
              </button>
            </div>
          </div>

          {/* Sección de Comentarios Expandible */}
          {postExpandido === post.id && (
            <div className="bg-[#0e0e10] border-t border-slate-800 p-6 space-y-4">
              <div className="space-y-4 mb-6">
                {comentarios[post.id]?.map(com => (
                  <div key={com.id} className="flex gap-3">
                    <img src={com.foto} className="w-8 h-8 rounded-full" alt="" />
                    <div className="bg-[#18181b] p-3 rounded-2xl flex-1">
                      <p className="text-xs font-bold text-purple-400 mb-1">{com.autor}</p>
                      <p className="text-sm text-slate-300">{com.texto}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input 
                  value={nuevaRespuesta} 
                  onChange={e => setNuevaRespuesta(e.target.value)}
                  placeholder="Escribe una respuesta..." 
                  className="flex-1 bg-[#18181b] border border-slate-800 rounded-xl px-4 py-2 text-sm text-white outline-none focus:border-purple-500"
                />
                <button onClick={() => enviarRespuesta(post.id)} className="bg-purple-600 px-4 py-2 rounded-xl text-sm font-bold">Enviar</button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}