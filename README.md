# viewTag Frontend — Buscador Semántico de Videos (Vue.js)

Interfaz web moderna y responsiva desarrollada con **Vue 3 (Composition API)**, **Vite**, **TypeScript** y **Tailwind CSS** para interactuar con la API de **viewTag**.

---

## 🚀 Características

- **Búsqueda Semántica en Tiempo Real**: Escribe texto en lenguaje natural y encuentra los fotogramas exactos del video.
- **Previsualización Multimedia**: Visualiza miniaturas de los fotogramas directamente en la interfaz mediante llamadas dinámicas al backend.
- **Filtros Avanzados de Score**: Rango personalizable (por defecto desde `-1.5%`) para ajustar la precisión de los resultados.
- **Creación y Exportación Masiva de Datasets**:
  - Etiquetado individual por fotograma.
  - Opciones personalizadas de cantidad de fotogramas a consultar.
  - **Guardado masivo**: Exporta cientos o miles de imágenes filtradas a datasets estructurados con un solo clic.
- **Diseño Mobile-First**: Totalmente adaptable a dispositivos móviles, tablets y escritorios.

---

## 🛠️ Requisitos

- Node.js >= 18.x
- El backend de **datasetCreator** corriendo en `http://localhost:8000` (o configurado mediante proxy en `vite.config.ts`).

---

## 📦 Instalación y Ejecución

```bash
# Entrar a la carpeta del frontend
cd frontendViewTag

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo (Vite)
npm run dev
```

La aplicación web estará disponible en **`http://localhost:5173`**.

---

## 📂 Estructura del Proyecto

```text
src/
├── assets/          # Estilos globales (Tailwind CSS)
├── components/      # Componentes reutilizables
├── router/          # Configuración de rutas (Vue Router)
├── services/        # Cliente API (Axios y servicios encapsulados)
├── types/           # Interfaces y tipos de TypeScript
└── views/           # Vistas principales (HomeView, ProcessView)
```
