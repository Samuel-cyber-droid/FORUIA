import React, { useState, useEffect } from 'react';
import { db, auth, storage } from './firebase'; // NUEVO: Importamos storage
import {
  collection, addDoc, query, orderBy, onSnapshot, serverTimestamp,
  doc, updateDoc, increment, arrayUnion, getDoc
} from 'firebase/firestore';
import { arrayRemove } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // NUEVO: Herramientas de Storage

// Filtro básico de moderación
const esContenidoInapropiado = (texto) => {
  const listaNegra = ['groseria1', 'groseria2', 'tonto', '🖕', '🔞']; // Agrega aquí tus palabras no permitidas
  const textoLimpio = texto.toLowerCase();
  return listaNegra.some(palabra => textoLimpio.includes(palabra));
};

export default function Comunidad() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [titulo, setTitulo] = useState('');
  const [contenido, setContenido] = useState('');
  const [tagSeleccionado, setTagSeleccionado] = useState('Programación');
  
  // Estados para Recursos del Docente
  const [rolUsuario, setRolUsuario] = useState('Estudiante');
  const [enlace, setEnlace] = useState('');
  const [archivoPDF, setArchivoPDF] = useState(null);
  const [subiendo, setSubiendo] = useState(false);

  const [postExpandido, setPostExpandido] = useState(null); 
  const [nuevaRespuesta, setNuevaRespuesta] = useState('');
  const [comentarios, setComentarios] = useState({});

  const tagsDisponibles = ['Programación', 'Matemáticas', 'IA', 'Redes', 'Bases de Datos'];

  useEffect(() => {
    // Buscar el rol del usuario actual
    const fetchRole = async () => {
      if (auth.currentUser) {
        const userRef = doc(db, "usuarios", auth.currentUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists() && snap.data().rol) {
          setRolUsuario(snap.data().rol);
        }
      }
    };
    fetchRole();

    // Traer publicaciones
    const q = query(collection(db, "foro"), orderBy("fecha", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPublicaciones(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

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

    // Validación de Moderación
    if (esContenidoInapropiado(titulo) || esContenidoInapropiado(contenido)) {
      alert("Tu publicación contiene lenguaje no permitido. Por favor, mantén el respeto en la comunidad.");
      return;
    }

    setSubiendo(true);

    try {
      let pdfUrl = null;

      // Si es docente y seleccionó un archivo, lo subimos a Storage
      if (archivoPDF && rolUsuario === 'Docente') {
        const archivoRef = ref(storage, `pdfs/${Date.now()}_${archivoPDF.name}`);
        await uploadBytes(archivoRef, archivoPDF);
        pdfUrl = await getDownloadURL(archivoRef);
      }

      await addDoc(collection(db, "foro"), {
        titulo, contenido,
        autor: auth.currentUser.displayName,
        foto: auth.currentUser.photoURL,
        fecha: serverTimestamp(),
        likes: 0,
        likedBy: [], 
        comentariosCount: 0,
        tags: { [tagSeleccionado]: 1 },
        enlaceExterno: rolUsuario === 'Docente' ? enlace : null,
        archivoUrl: pdfUrl 
      });
      
      setTitulo(''); setContenido(''); setEnlace(''); setArchivoPDF(null);
    } catch (e) { 
      console.error(e); 
      alert("Error al publicar.");
    } finally {
      setSubiendo(false);
    }
  };

  const enviarRespuesta = async (postId) => {
    if (!nuevaRespuesta.trim() || !auth.currentUser) return;

    if (esContenidoInapropiado(nuevaRespuesta)) {
      alert("Tu comentario contiene lenguaje no permitido.");
      return;
    }

    try {
      await addDoc(collection(db, `foro/${postId}/comentarios`), {
        texto: nuevaRespuesta,
        autor: auth.currentUser.displayName,
        foto: auth.currentUser.photoURL,
        fecha: serverTimestamp()
      });
      await updateDoc(doc(db, "foro", postId), {
        comentariosCount: increment(1)
      });
      setNuevaRespuesta('');
    } catch (e) { console.error(e); }
  };

  const darLike = async (post) => {
    if (!auth.currentUser) return;
    const uid = auth.currentUser.uid;
    const postRef = doc(db, "foro", post.id);

    const usuariosQueDieronLike = post.likedBy || [];
    const yaDioLike = usuariosQueDieronLike.includes(uid);

    try {
      if (yaDioLike) {
        await updateDoc(postRef, {
          likes: increment(-1),
          likedBy: arrayRemove(uid)
        });
      } else {
        await updateDoc(postRef, {
          likes: increment(1),
          likedBy: arrayUnion(uid)
        });
        const userRef = doc(db, "usuarios", uid);
        await updateDoc(userRef, {
          historialInteracciones: arrayUnion({ tags: post.tags, like: 1 })
        });
      }
    } catch (e) { console.error(e); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="bg-[#121214] p-6 rounded-2xl border border-slate-800/60 shadow-xl">
        <h2 className="text-xl font-bold text-slate-100 mb-4">¿Tienes alguna duda o material que compartir?</h2>
        <form onSubmit={publicarDuda} className="space-y-4">
          <input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Título" className="w-full bg-[#18181b] border border-slate-800 rounded-xl py-3 px-4 text-white focus:border-purple-500 outline-none" />
          <select value={tagSeleccionado} onChange={e => setTagSeleccionado(e.target.value)} className="w-full bg-[#18181b] border border-slate-800 rounded-xl py-3 px-4 text-white outline-none">
            {tagsDisponibles.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <textarea value={contenido} onChange={e => setContenido(e.target.value)} placeholder="Descripción..." className="w-full bg-[#18181b] border border-slate-800 rounded-xl py-3 px-4 text-white outline-none h-24" />
          
          {/* Opciones exclusivas para Docentes */}
          {rolUsuario === 'Docente' && (
            <div className="space-y-3 p-4 bg-blue-500/5 border border-blue-500/20 rounded-xl">
              <p className="text-xs font-bold text-blue-400 uppercase tracking-widest">Panel de Docente</p>
              <input 
                type="url" 
                placeholder="Enlace a recurso externo (Drive, YouTube, etc.)"
                value={enlace}
                onChange={(e) => setEnlace(e.target.value)}
                className="w-full bg-[#18181b] border border-slate-800 rounded-lg py-2 px-3 text-sm text-white outline-none focus:border-blue-500"
              />
              <div className="flex items-center gap-2">
                <label className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-xs p-2 rounded-lg cursor-pointer text-center transition-colors">
                  {archivoPDF ? `📄 ${archivoPDF.name}` : "📁 Subir PDF de clase"}
                  <input 
                    type="file" 
                    accept="application/pdf" 
                    className="hidden" 
                    onChange={(e) => setArchivoPDF(e.target.files[0])}
                  />
                </label>
              </div>
            </div>
          )}

          <button type="submit" disabled={subiendo} className="w-full bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 py-3 rounded-xl font-bold transition-all">
            {subiendo ? 'Subiendo...' : 'Publicar'}
          </button>
        </form>
      </div>

      {publicaciones.map(post => (
        <div key={post.id} className="bg-[#121214] border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <img src={post.foto} className="w-10 h-10 rounded-full" alt="" />
              <span className="font-bold text-slate-200">{post.autor}</span>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{post.titulo}</h3>
            <p className="text-slate-400 mb-4">{post.contenido}</p>

            {/* Visualización de la etiqueta */}
            {post.tags && (
              <div className="mb-4 flex gap-2">
                {Object.keys(post.tags).map(tag => (
                  <span key={tag} className="text-xs border border-purple-500/30 text-purple-400 bg-purple-500/5 px-2 py-1 rounded-md">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Mostrar recursos si existen (Subidos por un docente) */}
            {(post.enlaceExterno || post.archivoUrl) && (
              <div className="mb-4 flex flex-col gap-2 p-3 bg-blue-500/5 border border-blue-500/20 rounded-xl">
                <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Recursos Oficiales</p>
                
                {post.enlaceExterno && (
                  <a href={post.enlaceExterno} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-slate-300 hover:text-blue-400 transition-colors">
                    <span>🔗</span> Link al Material Externo
                  </a>
                )}
                
                {post.archivoUrl && (
                  <a href={post.archivoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-slate-300 hover:text-blue-400 transition-colors">
                    <span>📄</span> Descargar Documento PDF
                  </a>
                )}
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={() => darLike(post)}
                className={`flex items-center gap-2 text-sm transition-colors ${post.likedBy?.includes(auth.currentUser?.uid)
                  ? 'text-purple-500 font-bold'
                  : 'text-slate-500 hover:text-purple-400'
                  }`}
              >
                <span>{post.likedBy?.includes(auth.currentUser?.uid) ? '👍' : '👍🏻'}</span> {post.likes || 0}
              </button>
              <button onClick={() => cargarComentarios(post.id)} className="flex items-center gap-2 text-slate-500 hover:text-blue-400 transition-colors">
                <span>💬</span> {post.comentariosCount || 0} Comentarios
              </button>
            </div>
          </div>

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