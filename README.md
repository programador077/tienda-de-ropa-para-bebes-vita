# Tienda de Ropa para Bebés Vita

Bienvenido al repositorio de **Tienda de Ropa para Bebés Vita**. Este proyecto es una aplicación web moderna diseñada para la venta de ropa de bebés, integrando funcionalidades de inteligencia artificial para mejorar la experiencia del usuario.

## Tecnologías Utilizadas

- **React**: Biblioteca para construir interfaces de usuario.
- **Vite**: Entorno de desarrollo rápido y ligero.
- **Google Gemini API**: Para funcionalidades de IA (Chatbot, recomendaciones, etc.).
- **Lucide React**: Iconos modernos y ligeros.
- **TypeScript**: Para un código más robusto y seguro.

## Requisitos Previos

Asegúrate de tener instalado lo siguiente en tu sistema:

- [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
- [npm](https://www.npmjs.com/) (normalmente viene con Node.js)

## Configuración e Instalación

Sigue estos pasos para inicializar el proyecto desde cero en tu máquina local:

### 1. Clonar el Repositorio

Si aún no lo has hecho, clona el repositorio a tu máquina local:

```bash
git clone https://github.com/programador077/tienda-de-ropa-para-bebes-vita.git
cd tienda-de-ropa-para-bebes-vita
```

### 2. Instalar Dependencias

Instala las librerías necesarias ejecutando:

```bash
npm install
```

### 3. Configurar Variables de Entorno

El proyecto utiliza la API de Google Gemini. Necesitas configurar tu clave de API.

1. Crea un archivo llamado `.env.local` en la raíz del proyecto.
2. Añade tu clave de API de la siguiente manera:

```env
VITE_GEMINI_API_KEY=tu_clave_api_aqui
```
*(Nota: Asegúrate de que la variable coincida con la que se usa en el código, por ejemplo `VITE_GEMINI_API_KEY` o `GEMINI_API_KEY` según la implementación en `services/geminiService.ts`)*

### 4. Ejecutar el Servidor de Desarrollo

Para iniciar la aplicación en modo de desarrollo:

```bash
npm run dev
```

Abre tu navegador y visita la URL que aparece en la terminal (generalmente `http://localhost:5173`).

## Construcción para Producción

Para generar los archivos optimizados para producción:

```bash
npm run build
```

Para previsualizar la versión de producción localmente:

```bash
npm run preview
```
