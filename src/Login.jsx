import React from 'react';

export default function Login({ onLogin }) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900">
            <div className="p-8 bg-slate-800 rounded-lg shadow-xl w-96 text-center border border-slate-700">
                <h1 className="text-4xl font-bold text-blue-500 mb-2">FouryouAI</h1>
                <p className="text-slate-400 mb-8 italic">"Conecta con lo que vibra contigo"</p>

                <button
                    onClick={onLogin}
                    className="w-full py-3 px-4 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-200 transition-colors mb-4 flex items-center justify-center shadow-md"
                >
                    Iniciar sesión con Google
                </button>
                <button
                    onClick={onLogin}
                    className="w-full py-3 px-4 bg-slate-700 text-white font-bold rounded-lg hover:bg-slate-600 transition-colors flex items-center justify-center shadow-md"
                >
                    Iniciar sesión con GitHub
                </button>
            </div>
        </div>
    );
}