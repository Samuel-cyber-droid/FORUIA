import React from 'react';

export default function Dashboard() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* Feed Principal */}
            <div className="md:col-span-2 space-y-6">
                <h2 className="text-2xl font-bold mb-4 text-white">Para ti</h2>

                {/* Tarjeta de Contenido Recomendado */}
                <div className="bg-slate-800 p-5 rounded-lg shadow-md border border-slate-700 hover:border-slate-500 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm bg-slate-900 text-blue-400 px-3 py-1 rounded-full font-medium">#MachineLearning</span>
                        <span className="text-xs text-slate-400">Hace 2 horas</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Introducción a Redes Neuronales en JS</h3>
                    <p className="text-slate-300 text-sm mb-4 leading-relaxed">
                        Un recurso excelente compartido por el Prof. Mendoza para entender cómo aplicar tensores en el navegador. Ideal para el proyecto de fin de semestre.
                    </p>
                    <div className="flex items-center space-x-6 border-t border-slate-700 pt-3">
                        <button className="text-slate-400 hover:text-blue-500 flex items-center transition-colors">
                            👍 <span className="ml-2 font-medium">124</span>
                        </button>
                        <button className="text-slate-400 hover:text-green-500 flex items-center transition-colors">
                            💬 <span className="ml-2 font-medium">Discutir en Foro</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Barra Lateral: Tendencias */}
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 h-fit sticky top-6">
                <h3 className="font-bold text-lg mb-5 text-blue-400 flex items-center">
                    📈 Temas Trending
                </h3>
                <ul className="space-y-4">
                    <li className="flex justify-between items-center text-sm border-b border-slate-700 pb-2">
                        <span className="text-white font-medium hover:text-blue-300 cursor-pointer">#EstructuraDeDatos</span>
                        <span className="text-slate-400 text-xs bg-slate-900 px-2 py-1 rounded">34 aportes</span>
                    </li>
                    <li className="flex justify-between items-center text-sm border-b border-slate-700 pb-2">
                        <span className="text-white font-medium hover:text-blue-300 cursor-pointer">#ReactJS</span>
                        <span className="text-slate-400 text-xs bg-slate-900 px-2 py-1 rounded">28 aportes</span>
                    </li>
                    <li className="flex justify-between items-center text-sm border-b border-slate-700 pb-2">
                        <span className="text-white font-medium hover:text-blue-300 cursor-pointer">#CalculoVectorial</span>
                        <span className="text-slate-400 text-xs bg-slate-900 px-2 py-1 rounded">15 aportes</span>
                    </li>
                </ul>
            </div>
        </div>
    );
}