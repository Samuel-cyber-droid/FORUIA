import React, { useState, useEffect } from 'react';
import { db, auth } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
// Importamos el dataset que creamos en los pasos anteriores
import { kardexDataset } from './dataset';

export default function Materias() {
  const [materiasSeleccionadas, setMateriasSeleccionadas] = useState([]);
  const [guardando, setGuardando] = useState(false);

  // 1. Al cargar la pantalla, buscamos si el usuario ya tenía materias guardadas
  useEffect(() => {
    const cargarMateriasDelUsuario = async () => {
      if (auth.currentUser) {
        const docRef = doc(db, "usuarios", auth.currentUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists() && docSnap.data().materias) {
          setMateriasSeleccionadas(docSnap.data().materias);
        }
      }
    };
    cargarMateriasDelUsuario();
  }, []);

  // 2. Función para seleccionar o deseleccionar una materia
  const toggleMateria = (idMateria) => {
    setMateriasSeleccionadas(prev => 
      prev.includes(idMateria) 
        ? prev.filter(id => id !== idMateria) // Si ya está, la quita
        : [...prev, idMateria]                // Si no está, la agrega
    );
  };

  // 3. Función para guardar la selección en la base de datos de Firebase
  const guardarSeleccion = async () => {
    if (!auth.currentUser) return;
    setGuardando(true);
    
    try {
      // Usamos setDoc con { merge: true } para no borrar otros datos del usuario
      await setDoc(doc(db, "usuarios", auth.currentUser.uid), {
        materias: materiasSeleccionadas
      }, { merge: true });
      
      alert("¡Tus materias se han guardado exitosamente!");
    } catch (error) {
      console.error("Error al guardar materias:", error);
      alert("Hubo un error al guardar tu selección.");
    }
    
    setGuardando(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Tu Kardex</h1>
          <p className="text-slate-400 text-sm">Selecciona las materias que estás cursando para que nuestra IA personalice tu contenido.</p>
        </div>
        <button 
          onClick={guardarSeleccion}
          disabled={guardando}
          className="bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white px-6 py-2 rounded-xl transition-colors font-medium shadow-lg flex items-center gap-2"
        >
          {guardando ? 'Guardando...' : '💾 Guardar Selección'}
        </button>
      </div>

      <div className="space-y-8">
        {kardexDataset.map((semestre, index) => (
          <div key={index} className="bg-[#121214] p-6 rounded-2xl border border-slate-800/60 shadow-xl">
            <h2 className="text-xl font-bold text-slate-200 mb-6 pb-2 border-b border-slate-800">
              {semestre.semestre}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {semestre.materias.map(materia => {
                const estaSeleccionada = materiasSeleccionadas.includes(materia.id);
                
                return (
                  <div 
                    key={materia.id}
                    onClick={() => toggleMateria(materia.id)}
                    className={`p-4 rounded-xl cursor-pointer border transition-all duration-200 ${
                      estaSeleccionada 
                        ? 'bg-purple-600/10 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.15)]' 
                        : 'bg-[#18181b] border-slate-800 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className={`font-semibold ${estaSeleccionada ? 'text-purple-400' : 'text-slate-200'}`}>
                        {materia.nombre}
                      </h3>
                      <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                        estaSeleccionada ? 'bg-purple-500 border-purple-500 text-white' : 'border-slate-600'
                      }`}>
                        {estaSeleccionada && "✓"}
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-3">
                      {materia.tags.map(tag => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}