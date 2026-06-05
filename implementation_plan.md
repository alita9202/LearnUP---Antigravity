# Plan de Implementación SDD - Sprint 3: Búsqueda, Solicitud y Confirmación

Este plan detalla la implementación del **Sprint 3** para LearnUp, enfocado en el flujo entre Clientes/Demandantes y Colaboradores/Ofertantes, más mejoras en la UI y manejo de imágenes.

> [!IMPORTANT]
> Aprobación requerida antes de comenzar la codificación. Por favor, revisa el plan, las especificaciones en `specs_sprint3.md` y el script SQL antes de dar luz verde.

## User Review Required
- **Imágenes en Render:** Render utiliza un disco efímero (ephemeral storage) en sus planes gratuitos/económicos, lo que significa que los archivos subidos localmente a `/uploads` se pierden tras cada reinicio o redespliegue del servidor.
- **Sugerencia:** Se propone integrar **Cloudinary** (u otro servicio como AWS S3) para almacenar imágenes de forma permanente. Alternativamente, requerir a los colaboradores usar URLs de imágenes ya subidas a internet. **Por favor, confirma si integramos Cloudinary u optamos por URLs externas.**
- Revisa los Criterios de Aceptación en `specs_sprint3.md`.

## 1. Modelo de Datos Actualizado
Se introducirá la tabla `solicitudes_curso` (ver `update_schema_sprint3.sql`) para registrar las peticiones de los clientes:
- `curso_id` (FK a cursos)
- `cliente_id` (FK a usuarios, nullable para permitir invitados)
- Datos del solicitante: `nombre`, `email`, `telefono`, `ciudad`, `mensaje`
- `estado` (ENUM: 'PENDIENTE', 'ACEPTADA', 'RECHAZADA')
- `motivo_rechazo` (TEXT)
- `fecha_solicitud` (TIMESTAMP)

## 2. Flujos del Sprint 3

### Búsqueda de Productos o Servicios
- **Frontend:** Añadir una barra de búsqueda y filtros en la `Landing.jsx` o en una nueva página `Explorar.jsx`.
- **Filtros soportados:** Búsqueda por texto (título/descripción), categoría, modalidad, precio (rango), ordenamiento (más recientes).
- **Backend:** Endpoint `GET /api/courses/search` con query params soportando filtros dinámicos. Sólo se buscarán cursos con `estado_validacion = 'APROBADO'`.

### Solicitar Producto o Servicio
- **Frontend:** Al hacer clic en un curso, redirigir a una vista de detalles (`CourseDetail.jsx`) que incluirá un formulario para "Solicitar Cupo/Servicio".
- **Comportamiento:** Si el usuario está logueado, autocompletar sus datos.
- **Backend:** Endpoint `POST /api/requests` para crear la solicitud en `solicitudes_curso`.

### Confirmación de Solicitud (Colaborador)
- **Frontend:** En `ColaboradorPanel.jsx`, crear una nueva pestaña/sección "Mis Solicitudes Recibidas".
- **Funcionalidades:** Ver datos del solicitante, mensaje y botones de Acción (Aceptar / Rechazar). Al rechazar, debe abrirse un modal para ingresar el motivo.
- **Backend:** Endpoints `GET /api/requests/collaborator` y `PUT /api/requests/:id/status` para manejar el cambio de estado.

## 3. Mejoras Visuales Adicionales
- **Navbar:** Quitar el botón "Instalar App" de `Landing.jsx` y `Navbar`.
- **Estética:** Mantener diseño *premium dark*, usando glassmorphism y transiciones suaves.
- **Imágenes:** Si la imagen falla (error 404 o rota), usar el evento `onError` en `<img>` para cargar un *placeholder* elegante (ej. un gradiente con el logo de LearnUp).

## 4. Producción (Render + Aiven)
- Se mantendrá el uso de `VITE_API_URL`.
- No se incluirá código apuntando a `localhost`.
- La solución al problema de almacenamiento de archivos se adaptará según tu respuesta (Cloudinary o URL externa).

## Proposed Changes (Archivos a Modificar)

### Backend
#### [NEW] [backend/routes/requestRoutes.js]
- Rutas para manejar las solicitudes de los clientes.
#### [NEW] [backend/controllers/requestController.js]
- Lógica de inserción y actualización de solicitudes.
#### [MODIFY] [backend/controllers/courseController.js]
- Modificar u optimizar la obtención de cursos para soportar búsqueda y filtrado dinámico.

### Frontend
#### [MODIFY] [frontend/src/components/Navbar.jsx]
- Eliminar botón "Instalar App".
#### [MODIFY] [frontend/src/pages/Landing.jsx]
- Agregar sección de Búsqueda y Filtros.
#### [NEW] [frontend/src/pages/CourseDetail.jsx]
- Vista detallada del curso y formulario de solicitud.
#### [MODIFY] [frontend/src/pages/ColaboradorPanel.jsx]
- Nueva sección de gestión de solicitudes recibidas.
#### [NEW] [frontend/src/components/ImageWithFallback.jsx] (Opcional)
- Componente para manejar imágenes rotas y mostrar un placeholder elegante.

## Verification Plan
1. **Búsqueda:** Probar filtros por categoría, texto y precio. Verificar que sólo muestra aprobados.
2. **Solicitud Anónima/Invitado:** Entrar sin login, buscar curso, enviar solicitud y verificar en DB.
3. **Solicitud Logueado:** Login como Cliente, enviar solicitud y verificar que `cliente_id` se guarda.
4. **Gestión Colaborador:** Login como Colaborador del curso. Ver solicitud en el panel. Rechazarla con motivo y verificar en DB. Aceptar otra y verificar estado.
5. **UI/UX:** Comprobar modo dark, ausencia de botón Instalar App y placeholders para imágenes caídas.
