import * as brain from 'brain.js/browser.js';

export class RecomendadorAI {
    constructor() {
        // Inicializamos una red neuronal simple
        this.redNeuronal = new brain.NeuralNetwork({
            hiddenLayers: [4],
            iterations: 2000,
        });
        this.entrenada = false;
    }

    entrenar(historialUsuario) {
        if (!historialUsuario || historialUsuario.length === 0) return;

        // Convertimos el historial a un formato que Brain.js entienda
        // input: los tags del post. output: 1 si dio like, 0 si no.
        const datosEntrenamiento = historialUsuario.map(item => ({
            input: item.tags,
            output: { afinidad: item.like }
        }));

        this.redNeuronal.train(datosEntrenamiento);
        this.entrenada = true;
        console.log("🧠 Motor IA entrenado exitosamente.");
    }

    predecir(tagsContenido) {
        if (!this.entrenada) return 0.5; // Si no hay datos, damos una predicción neutra (50%)

        const resultado = this.redNeuronal.run(tagsContenido);
        return resultado.afinidad; // Devuelve un número entre 0 y 1
    }
}

// Exportamos una instancia lista para usar en cualquier parte del proyecto
export const ia = new RecomendadorAI();