# Fingro - Marketplace de Créditos

Fingro es una plataforma que conecta a usuarios que buscan créditos con múltiples instituciones financieras, permitiéndoles comparar ofertas personalizadas según su perfil financiero.

## Estructura del Proyecto

El proyecto está dividido en dos partes principales:

- **Frontend**: Aplicación Next.js con React y TailwindCSS
- **Backend**: API REST con Node.js y Express, conectada a Supabase

## Características Principales

- Formulario multipaso para recolección de datos del usuario
- Sistema de scoring para evaluar perfiles crediticios
- Panel para bancos con gestión de leads y ofertas
- Almacenamiento seguro de documentos
- Autenticación y autorización con JWT

## Requisitos Previos

- Node.js (v14 o superior)
- npm o yarn
- Cuenta en Supabase (para base de datos y almacenamiento)

## Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/fingro.git
cd fingro
```

### 2. Configurar variables de entorno

**Frontend**:
```bash
cd frontend
cp .env.example .env.local
# Editar .env.local con tus credenciales de Supabase
```

**Backend**:
```bash
cd backend
cp .env.example .env
# Editar .env con tus credenciales de Supabase y otras configuraciones
```

### 3. Instalar dependencias

**Frontend**:
```bash
cd frontend
npm install
```

**Backend**:
```bash
cd backend
npm install
```

### 4. Configurar Supabase

1. Crear un nuevo proyecto en Supabase
2. Crear las siguientes tablas:
   - `leads`: Almacena los datos de los solicitantes
   - `bancos`: Información de los bancos
   - `ofertas`: Ofertas generadas por los bancos
   - `documentos`: Metadatos de documentos subidos
   - `scoring_rules`: Reglas para el cálculo de score
   - `desembolsos`: Registro de desembolsos realizados

3. Configurar Storage para documentos con políticas de seguridad adecuadas

## Ejecución

### Frontend

```bash
cd frontend
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

### Backend

```bash
cd backend
npm run dev
```

El servidor API estará disponible en `http://localhost:3001`

## Flujo de Usuario

1. El usuario accede a la landing page
2. Completa el formulario multipaso
3. El sistema calcula su score crediticio
4. Los bancos reciben la solicitud y generan ofertas
5. El usuario visualiza y compara las ofertas
6. Selecciona la mejor opción
7. El banco procede con el desembolso

## Documentación Técnica

Para más detalles sobre la implementación, consulta los documentos en la carpeta `documentación/`.

## Licencia

Este proyecto está bajo la Licencia MIT.
