# Arquitectura de Fingro

Este documento describe la arquitectura técnica del sistema Fingro, un marketplace de créditos que conecta usuarios con instituciones financieras.

## Visión General

Fingro está construido como una aplicación web moderna con una arquitectura cliente-servidor:

- **Frontend**: Aplicación SPA (Single Page Application) construida con Next.js
- **Backend**: API REST implementada con Node.js/Express
- **Base de Datos**: PostgreSQL gestionada a través de Supabase
- **Almacenamiento**: Supabase Storage para documentos sensibles
- **Autenticación**: JWT + Supabase Auth

## Diagrama de Arquitectura

```
┌─────────────┐      ┌─────────────┐      ┌─────────────────────┐
│             │      │             │      │                     │
│  Frontend   │◄────►│   Backend   │◄────►│  Supabase           │
│  (Next.js)  │      │  (Node.js)  │      │  (DB + Auth + Storage)
│             │      │             │      │                     │
└─────────────┘      └─────────────┘      └─────────────────────┘
       ▲                    ▲                      ▲
       │                    │                      │
       │                    │                      │
       ▼                    ▼                      ▼
┌─────────────┐      ┌─────────────┐      ┌─────────────────────┐
│             │      │             │      │                     │
│  Usuario    │      │   Bancos    │      │  Administradores    │
│             │      │             │      │                     │
└─────────────┘      └─────────────┘      └─────────────────────┘
```

## Componentes Principales

### Frontend

- **Páginas**:
  - Landing Page (`/`): Presentación del servicio
  - Formulario (`/formulario`): Recolección de datos del usuario
  - Ofertas (`/ofertas`): Visualización de ofertas personalizadas

- **Componentes**:
  - `Formulario/`: Componentes para el formulario multipaso
  - `LandingPage/`: Componentes de la página principal
  - `VistaOfertas/`: Componentes para visualización de ofertas

- **Librerías Clave**:
  - React Hook Form: Gestión de formularios
  - Zod: Validación de datos
  - TailwindCSS: Estilos
  - Supabase Client: Comunicación con Supabase

### Backend

- **API Endpoints**:
  - `/api/leads`: Gestión de solicitudes de crédito
  - `/api/bancos`: Gestión de bancos y ofertas
  - `/api/scoring`: Cálculo de score crediticio
  - `/api/documentos`: Gestión de documentos

- **Servicios**:
  - Scoring: Algoritmo de evaluación crediticia
  - Notificaciones: Envío de emails a usuarios y bancos
  - Autenticación: Verificación de identidad

- **Librerías Clave**:
  - Express: Framework web
  - Supabase JS: Cliente para Supabase
  - JWT: Tokens de autenticación
  - Multer: Procesamiento de archivos

### Base de Datos

#### Tablas Principales

- **leads**: Almacena las solicitudes de crédito
  ```
  id: uuid (PK)
  nombre: text
  apellido: text
  dpi: text
  fecha_nacimiento: date
  correo: text
  telefono: text
  departamento: text
  municipio: text
  direccion: text
  tipo_vivienda: text
  nivel_educativo: text
  institucion: text
  pais_estudios: text
  ano_graduacion: integer
  estado_laboral: text
  empresa: text
  cargo: text
  antiguedad: integer
  tipo_ingreso: text
  ingreso_mensual: numeric
  otros_ingresos: numeric
  posee_vehiculo: boolean
  kilometraje: integer
  ahorros: numeric
  cuentas_inversion: numeric
  nuevos_prestamos_3meses: boolean
  otras_deudas: boolean
  monto_deuda: numeric
  entidad: text
  monto_solicitado: numeric
  proposito: text
  score: integer
  status: text
  created_at: timestamp
  updated_at: timestamp
  ```

- **bancos**: Información de las instituciones financieras
  ```
  id: uuid (PK)
  nombre: text
  email: text
  telefono: text
  logo_url: text
  user_id: uuid (FK -> auth.users)
  created_at: timestamp
  ```

- **ofertas**: Ofertas generadas por los bancos
  ```
  id: uuid (PK)
  lead_id: uuid (FK -> leads.id)
  banco_id: uuid (FK -> bancos.id)
  monto_ofertado: numeric
  plazo: integer
  tasa: numeric
  cuota_aproximada: numeric
  validez: text
  status: text
  created_at: timestamp
  updated_at: timestamp
  ```

- **documentos**: Metadatos de documentos subidos
  ```
  id: uuid (PK)
  lead_id: uuid (FK -> leads.id)
  tipo: text
  nombre_original: text
  path: text
  tamano: integer
  mime_type: text
  created_at: timestamp
  ```

## Flujo de Datos

1. **Solicitud de Crédito**:
   - Usuario completa formulario en frontend
   - Datos enviados a `/api/leads` en backend
   - Backend calcula score y almacena en Supabase
   - Documentos subidos a Supabase Storage

2. **Distribución a Bancos**:
   - Backend notifica a bancos sobre nueva solicitud
   - Bancos acceden a panel o API para ver leads
   - Bancos filtran leads según sus criterios

3. **Generación de Ofertas**:
   - Bancos crean ofertas vía panel o API
   - Ofertas almacenadas en Supabase
   - Usuario notificado sobre nuevas ofertas

4. **Selección de Oferta**:
   - Usuario visualiza y compara ofertas
   - Selecciona la mejor opción
   - Backend actualiza estado de la oferta
   - Banco notificado sobre selección

5. **Desembolso**:
   - Banco procesa la solicitud
   - Registra desembolso vía API
   - Sistema actualiza estados y registra comisión

## Seguridad

- **Autenticación**: JWT + Supabase Auth
- **Autorización**: RLS (Row Level Security) en Supabase
- **Documentos**: URLs firmadas con tiempo limitado
- **API**: Validación de datos con Zod
- **Frontend**: Sanitización de inputs

## Escalabilidad

La arquitectura está diseñada para escalar horizontalmente:

- Frontend desplegable en Vercel/Netlify (serverless)
- Backend como servicio containerizado (Docker)
- Supabase maneja la escalabilidad de base de datos y almacenamiento

## Consideraciones Futuras

- Implementación de webhooks para integraciones con sistemas bancarios
- Análisis de datos y machine learning para mejorar el scoring
- App móvil con React Native
- Expansión a más productos financieros
