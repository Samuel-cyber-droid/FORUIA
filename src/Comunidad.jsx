import React from 'react';

export default function Comunidad() {
    const hilosForo = [
        {
            id: 1,
            titulo: "¿Alguien tiene ejemplos claros de recursividad en Java?",
            autor: "Jafet M.",
            tiempo: "Hace 2 horas",
            etiqueta: "#Programación",
            respuestas: 5,
            likes: 12
        },
        {
            id: 2,
            titulo: "Duda con el proyecto final de Estructura de Datos (Árboles)",
            autor: "Jaqueline A.",
            tiempo: "Hace 4 horas",
            etiqueta: "#EstructuraDeDatos",
            respuestas: 14,
            likes: 8
        },
        {
            id: 3,
            titulo: "Recomendación de libro para Cálculo Vectorial",
            autor: "Erick R.",
            tiempo: "Ayer",
            etiqueta: "#CalculoVectorial",
            respuestas: 3,
            likes: 25
        }
    ];

    return (
        <div className="max-w-5xl mx-auto">
            {/* Cabecera del Foro */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Comunidad Académica</h2>
                    <p className="text-slate-400">Comparte dudas, responde a tus compañeros y construye conocimiento colaborativo.</p>
                </div>

                <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition-transform transform hover:-translate-y-1 flex items-center justify-center">
                    <span className="mr-2 text-xl font-normal">+</span> Nueva duda
                </button>
            </div>

            {/* Filtros */}
            <div className="flex space-x-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                <button className="bg-slate-700 hover:bg-slate-600 text-white text-sm px-5 py-2 rounded-full font-medium transition-colors">Todas</button>
                <button className="bg-blue-900/40 text-blue-400 border border-blue-700/50 text-sm px-5 py-2 rounded-full font-medium">#Programación</button>
                <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-sm px-5 py-2 rounded-full font-medium transition-colors">#EstructuraDeDatos</button>
                <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-sm px-5 py-2 rounded-full font-medium transition-colors">#CalculoVectorial</button>
            </div>

            {/* Lista de Hilos */}
            <div className="space-y-4">
                {hilosForo.map((hilo) => (
                    <div key={hilo.id} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-blue-500 transition-all cursor-pointer group shadow-sm hover:shadow-md">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                            <div className="flex-1">
                                <span className="inline-block px-3 py-1 bg-slate-900 text-blue-400 text-xs font-bold rounded-md mb-3 tracking-wide">
                                    {hilo.etiqueta}
                                </span>
                                <h3 className="text-lg font-bold text-slate-100 group-hover:text-blue-400 transition-colors mb-2 leading-snug">
                                    {hilo.titulo}
                                </h3>
                                <div className="text-sm text-slate-400 flex items-center space-x-2">
                                    <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center text-xs text-white font-bold">
                                        {hilo.autor.charAt(0)}
                                    </div>
                                    <span>Por <strong className="text-slate-300">{hilo.autor}</strong></span>
                                    <span className="text-slate-600">•</span>
                                    <span>{hilo.tiempo}</span>
                                </div>
                            </div>

                            <div className="flex items-center space-x-6 border-t md:border-t-0 border-slate-700 pt-3 md:pt-0">
                                <div className="flex items-center text-slate-400 bg-slate-900/50 px-3 py-1.5 rounded-lg">
                                    <span className="mr-2 text-lg">💬</span>
                                    <span className="font-bold text-slate-200">{hilo.respuestas}</span>
                                    <span className="ml-1 text-xs uppercase tracking-wider hidden sm:inline">respuestas</span>
                                </div>
                                <div className="flex items-center text-slate-400 bg-slate-900/50 px-3 py-1.5 rounded-lg">
                                    <span className="mr-2 text-lg">👍</span>
                                    <span className="font-bold text-slate-200">{hilo.likes}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}