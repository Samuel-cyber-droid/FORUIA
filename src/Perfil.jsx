import React from 'react';

export default function Perfil() {
    return (
        <div className="max-w-3xl mx-auto mt-8">
            <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-xl">
                <div className="p-8 flex flex-col md:flex-row items-center md:items-start justify-between border-b border-slate-700 gap-6">
                    <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left space-y-4 md:space-y-0 md:space-x-6">
                        <div className="w-28 h-28 bg-slate-700 rounded-2xl flex items-center justify-center text-5xl border-4 border-slate-800 shadow-inner">
                            🧑‍💻
                        </div>
                        <div className="pt-2">
                            <h2 className="text-3xl font-bold text-white">Estudiante ISC</h2>
                            <p className="text-blue-400 font-medium mb-3">@estudiante_isc</p>
                            <p className="text-slate-400 max-w-md text-sm leading-relaxed">
                                Entusiasta de la tecnología, enfocado en el desarrollo frontend y explorando las posibilidades de la inteligencia colectiva y la Web 3.0.
                            </p>
                        </div>
                    </div>
                    <button className="bg-slate-700 hover:bg-slate-600 text-white py-2 px-6 rounded-lg font-medium transition-colors whitespace-nowrap border border-slate-600">
                        Editar Perfil
                    </button>
                </div>

                <div className="grid grid-cols-2 bg-slate-800/50">
                    <div className="p-6 text-center border-r border-slate-700">
                        <p className="text-slate-400 text-sm mb-2 font-medium uppercase tracking-wider">Aportes en el Foro</p>
                        <p className="text-4xl font-bold text-blue-500">42</p>
                    </div>
                    <div className="p-6 text-center">
                        <p className="text-slate-400 text-sm mb-2 font-medium uppercase tracking-wider">Likes Recibidos</p>
                        <p className="text-4xl font-bold text-green-500">128</p>
                    </div>
                </div>
            </div>
        </div>
    );
}