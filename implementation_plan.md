# Plan de Implementación SDD - Sprint 2: Gestión de Cursos/Talleres

Este plan detalla la implementación del **Sprint 2: Gestión de Productos/Servicios** para LearnUp, aplicando la metodología **Spec-Driven Development (SDD)**.

> [!IMPORTANT]
> Aprobación requerida antes de comenzar la codificación. Por favor, revisa el plan, las especificaciones en `specs_sprint2.md` y el script SQL antes de dar luz verde a la ejecución.

## User Review Required
- Revisa el archivo `specs_sprint2.md` para confirmar que los Criterios de Aceptación (Given/When/Then) cumplen exactamente con tu visión de negocio.
- UX/UI: Se implementará una mejora general en los modales para solucionar problemas de corte vertical, asegurando centrado y scroll interno.

## 1. Modelo de Datos
La tabla `cursos` ha sido diseñada para soportar el flujo del Sprint 2.
Los campos requeridos son:
- `id` (PK)
- `titulo` (VARCHAR)
- `descripcion` (TEXT)
- `precio` (DECIMAL)
- `categoria` (VARCHAR)
- `modalidad` (VARCHAR)
- `ubicacion` (VARCHAR, opcional)
- `cupos` (INT)
- `fecha` (DATETIME)
- `imagen_url` (VARCHAR)
- `estado_validacion` (ENUM: 'PENDIENTE', 'APROBADO', 'RECHAZADO')
- `motivo_rechazo` (TEXT)
- `colaborador_id` (FK a usuarios)
- `timestamps` (`created_at`, `updated_at`)

*Nota: Tienes a disposición el archivo `update_schema_sprint2.sql` con la definición exacta.*

## 2. Flujos del Sprint 2
### HU-01: Creación de Curso por Colaborador
- Formulario modal moderno, *premium dark*.
- Subida de imagen obligatoria u opcional (se utilizará Multer en backend).
- Estado forzado a `PENDIENTE` en backend al insertar.

### HU-02: Edición y Eliminación
- Modal de edición.
- Backend intercepta: Si se modifican `titulo`, `descripcion`, `precio`, `imagen_url` o `categoria`, el sistema forzará `estado_validacion = 'PENDIENTE'` e invalidará aprobaciones previas.
- Modal de confirmación al intentar eliminar.

### HU-03: Panel de Validación (Administrador)
- Sección exclusiva para administradores.
- Vista en tarjetas o tabla detallada mostrando: imagen, colaborador, categoría, descripción, precio, modalidad.
- Acciones:
  - **Aprobar:** Cambia a `APROBADO`.
  - **Rechazar:** Abre un modal (corregido visualmente) para introducir el motivo de rechazo y cambia a `RECHAZADO`.

## 3. Producción (Aiven + Render)
- Todos los servicios de red (`fetch` o `axios`) consumirán `import.meta.env.VITE_API_URL` exclusivamente.
- Multer (Backend) guardará las imágenes en el directorio `/uploads` temporal o de forma persistente según el entorno, y la ruta almacenada será relativa para que la consuma el frontend correctamente.

## 4. UX/UI y Correcciones
Se aplicará un fix global o local a los contenedores modales en el Frontend:
- `max-h-[90vh]` para evitar que sobrepasen el viewport vertical.
- `overflow-y-auto` en el body del modal.
- `flex items-center justify-center` en el overlay para un centrado perfecto.
- Mantenimiento estricto de clases de Tailwind premium (glassmorphism, colores oscuros consistentes).

## Proposed Changes (Archivos a Modificar en la Ejecución)

### Backend
#### [MODIFY] [backend/routes/courseRoutes.js]
- Añadir middleware `upload.single('imagen')`.
- Endpoints POST y PUT para manejar lógica de estado `PENDIENTE`.
#### [MODIFY] [backend/routes/adminRoutes.js]
- Endpoint GET `/pending-courses` con `JOIN` a usuarios para traer datos del Colaborador.
- Endpoint PUT `/course/:id/validate` (acepta estado y motivo).
#### [NEW] [backend/controllers/courseController.js]
- Aislar la lógica de base de datos aquí si es posible para mantener SDD limpio.

### Frontend
#### [MODIFY] [frontend/src/pages/ColaboradorPanel.jsx]
- Implementar Modales corregidos para Crear y Editar curso con soporte para `<input type="file" />`.
#### [MODIFY] [frontend/src/pages/AdminPanel.jsx]
- Implementar la UI de Validación de Cursos con renderizado rico de detalles e imagen. Modal para motivo de rechazo.
#### [MODIFY] [frontend/src/pages/Landing.jsx]
- Consumir el endpoint público que filtra solo los cursos `APROBADO`.

## Verification Plan
1. Crear curso como colaborador con foto (Verificar en DB que está PENDIENTE).
2. Intentar ver el curso en la Landing sin login (No debe verse).
3. Aprobar curso como Admin (Verificar Landing).
4. Editar curso como colaborador (Verificar que se esconde de la Landing y vuelve al Admin).
5. Rechazar como Admin con motivo (Verificar que el colaborador lo ve).
6. Verificación responsive y vertical de modales.
