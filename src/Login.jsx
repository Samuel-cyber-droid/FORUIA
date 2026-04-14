import React, { useState } from 'react';
// 1. Importamos las herramientas de Firebase que creamos en tu archivo firebase.js
import { auth, googleProvider } from './firebase'; 
import { signInWithPopup } from 'firebase/auth';

export default function Login({ onLogin }) {
  const [error, setError] = useState(null);

  // 2. Creamos la función que abrirá la ventana de Google
  const iniciarSesionConGoogle = async () => {
    try {
      // Firebase abre la ventana emergente de Google
      const resultado = await signInWithPopup(auth, googleProvider);
      const usuario = resultado.user;
      
      console.log("¡Usuario conectado exitosamente!", usuario.displayName);
      
      // Si todo sale bien, le decimos a App.jsx que nos mande al Dashboard
      onLogin(); 
      
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setError("Hubo un problema al conectar con Google. Revisa tu conexión o credenciales.");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#09090b] text-white">
      {/* Mitad Izquierda - Formulario */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-12 sm:px-24">
        <div className="max-w-md w-full mx-auto space-y-8">
          
          <div className="text-center lg:text-left">
            <div className="flex items-center justify-center lg:justify-start gap-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-xl flex items-center justify-center font-bold text-xl">F</div>
              <h1 className="text-2xl font-bold tracking-wide">fouryou.ai</h1>
            </div>
            <h2 className="text-3xl font-bold mb-2 text-slate-100">Bienvenido de vuelta</h2>
            <p className="text-slate-400">Conecta con lo que vibra contigo y descubre nuevo conocimiento.</p>
          </div>

          {/* Mostrar mensaje de error si algo falla */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4 mt-8">
            {/* 3. Conectamos el botón a nuestra nueva función */}
            <button 
              onClick={iniciarSesionConGoogle}
              className="w-full flex items-center justify-center gap-3 bg-[#18181b] border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-white px-4 py-3 rounded-xl transition-all font-medium"
            >
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Continuar con Google
            </button>
            
            <button className="w-full flex items-center justify-center gap-3 bg-[#18181b] border border-slate-800 hover:bg-slate-800 hover:border-slate-700 text-white px-4 py-3 rounded-xl transition-all font-medium">
              <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub" className="w-5 h-5 invert" />
              Continuar con GitHub
            </button>
          </div>

        </div>
      </div>

      {/* Mitad Derecha - Imagen (Solo visible en pantallas grandes) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/40 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop" 
          alt="Estudiantes colaborando" 
          className="object-cover w-full h-full opacity-60"
        />
        <div className="absolute bottom-12 left-12 z-20 max-w-lg">
          <div className="bg-black/40 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
            <p className="text-lg text-slate-200 font-medium mb-4">"La mejor forma de aprender programación es compartiendo dudas y código con la comunidad correcta."</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-sm font-bold border-2 border-[#09090b]">SM</div>
              <div>
                <p className="text-sm font-bold text-white">Samuel M.</p>
                <p className="text-xs text-slate-400">Ingeniería en Sistemas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}