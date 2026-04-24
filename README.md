# 🚀 Fouryou.ai - Plataforma Académica Inteligente

## 📖 Descripción del Proyecto
**Fouryou.ai** es un ecosistema educativo inteligente diseñado para transformar la manera en que los estudiantes de Ingeniería en Sistemas y áreas tecnológicas interactúan con el conocimiento. A través de un motor de Inteligencia Artificial integrado directamente en el navegador, la plataforma analiza los intereses, materias en curso y aportaciones del usuario para crear un feed de contenido académico 100% personalizado.

El objetivo principal es construir una comunidad colaborativa donde resolver dudas, compartir recursos y conectar con otros estudiantes sea intuitivo, rápido y respaldado por machine learning.

## ✨ Características Principales
* **🧠 Motor de Recomendación IA:** Utiliza una red neuronal (Brain.js) que aprende en tiempo real del historial de interacciones (Likes, Guardados y Materias seleccionadas) para predecir el porcentaje de "Match" y filtrar el contenido más afín al usuario.
* **💬 Foro Comunitario Dinámico:** Sistema de preguntas y respuestas en tiempo real con soporte para categorización por etiquetas (#Tags), conteo de interacciones y sub-hilos de comentarios.
* **📊 Kardex Interactivo:** Interfaz que permite a los alumnos seleccionar su carga académica actual para calibrar automáticamente las sugerencias de la IA.
* **🔐 Autenticación y Seguridad:** Inicio de sesión seguro gestionado con Google Auth y protección de rutas.
* **👤 Perfil Personalizado:** Panel de control con biografía editable y estadísticas en tiempo real (dudas publicadas, materias activas, interacciones).

## 🛠️ Stack Tecnológico
* **Frontend:** React 19, Vite, Tailwind CSS v4.
* **Inteligencia Artificial:** Brain.js (Redes Neuronales FeedForward del lado del cliente).
* **Backend & Base de Datos:** Firebase (Firestore NoSQL, Authentication).
* **Control de Versiones:** Git & GitHub.

## ⚙️ Instalación y Uso Local (Para el equipo de desarrollo)
Para clonar y correr este proyecto en tu entorno local, asegúrate de tener Node.js instalado y sigue estos pasos:

1. **Clona el repositorio:**
   ```bash
   git clone [https://github.com/tu-usuario/fouryouai.git](https://github.com/tu-usuario/fouryouai.git)
   cd fouryouai

2. **Instala las dependencias necesarias:**
    ```bash
    npm install

3. **Configura las Variables de Entorno:**
    Crea un archivo llamado `.env` en la raiz del proyecto. Solicita las credenciales de Firebase al administrador del repositorio y agregalas con el siguiente formato:
    ```bash
    VITE_FIREBASE_API_KEY="tu_api_key_aqui"
    VITE_FIREBASE_AUTH_DOMAIN="tu_dominio"
    VITE_FIREBASE_PROJECT_ID="tu_id"
    VITE_FIREBASE_STORAGE_BUCKET="tu_bucket"
    VITE_FIREBASE_MESSAGING_SENDER_ID="tu_sender_id"
    VITE_FIREBASE_APP_ID="tu_app_id"

4. **Inicia el servidor de desarrollo:**
    ```bash
    npm run dev