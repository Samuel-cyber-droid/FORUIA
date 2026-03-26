import React from 'react';

export default function Materias() {
    const semestres = [
        { id: 1, nombre: 'Primer Semestre', materias: ['Fundamentos de Programación', 'Cálculo Diferencial', 'Matemáticas Discretas'] },
        { id: 2, nombre: 'Segundo Semestre', materias: ['Programación Orientada a Objetos', 'Cálculo Integral', 'Probabilidad'] }
    ];

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-2 text-white">Tu Kardex Dinámico</h2>
            <p className="text-slate-400 mb-6">Selecciona las materias que estás cursando para afinar el algoritmo.</p>

            <div className="w-full bg-slate-700 rounded-full h-2.5 mb-8 overflow-hidden">
                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '45%' }}></div>
            </div>

            <div className="space-y-8">
                {semestres.map((semestre) => (
                    <div key={semestre.id} className="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-sm">
                        <h3 className="text-xl font-semibold mb-4 text-blue-400 border-b border-slate-700 pb-2">{semestre.nombre}</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {semestre.materias.map((materia, index) => (
                                <label key={index} className="flex items-center space-x-3 p-3 bg-slate-900 rounded-lg cursor-pointer hover:bg-slate-700 border border-transparent hover:border-slate-500 transition-all">
                                    <input type="checkbox" className="form-checkbox h-5 w-5 text-blue-600 rounded border-slate-500 bg-slate-800 focus:ring-blue-500 focus:ring-offset-slate-900" />
                                    <span className="text-sm font-medium text-slate-200">{materia}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-8 flex justify-end">
                <button className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:-translate-y-1">
                    Guardar Selección
                </button>
            </div>
        </div>
    );
}