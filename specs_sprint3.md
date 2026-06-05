# Especificaciones SDD - Sprint 3: Búsqueda, Solicitud y Confirmación

Este documento define el comportamiento esperado del sistema para el Sprint 3 mediante Historias de Usuario (HU) y Criterios de Aceptación en formato *Given / When / Then*.

---

## HU-01: Búsqueda y Filtrado de Cursos/Servicios
**Como** Cliente o Demandante (logueado o invitado)
**Quiero** poder buscar y filtrar cursos/servicios en la plataforma
**Para** encontrar la oferta que mejor se adapte a mis necesidades de forma rápida.

### Criterio de Aceptación 1.1: Búsqueda por texto libre
- **Given** que estoy en la página principal o de exploración
- **When** introduzco "React" en la barra de búsqueda y presiono "Buscar"
- **Then** el sistema me muestra una lista de cursos donde "React" aparece en el título o descripción y cuyo `estado_validacion` es `APROBADO`.

### Criterio de Aceptación 1.2: Filtrado combinado
- **Given** que existen varios cursos de distintas categorías y modalidades
- **When** selecciono la categoría "Tecnología", modalidad "Online", y precio máximo "100"
- **Then** el sistema actualiza la vista mostrando únicamente los cursos que cumplen exactamente con todos esos filtros.

### Criterio de Aceptación 1.3: Cursos sin resultados
- **Given** que estoy utilizando los filtros de búsqueda
- **When** busco un término o aplico filtros para los que no existe ningún curso aprobado
- **Then** la interfaz me muestra un mensaje amigable indicando que "No se encontraron cursos que coincidan con tu búsqueda" y me invita a probar otros filtros.

---

## HU-02: Solicitar Cupo o Servicio
**Como** Cliente o Demandante
**Quiero** seleccionar un curso y enviar una solicitud al colaborador
**Para** reservar mi cupo o iniciar el proceso de adquisición del servicio.

### Criterio de Aceptación 2.1: Solicitud como usuario invitado
- **Given** que no he iniciado sesión y estoy en los detalles de un curso
- **When** lleno el formulario de solicitud (nombre, email, teléfono, ciudad, mensaje) y lo envío
- **Then** la solicitud se guarda en el sistema con `estado` PENDIENTE, asociada al `curso_id`, y veo un mensaje de éxito.

### Criterio de Aceptación 2.2: Solicitud como usuario logueado
- **Given** que he iniciado sesión como Cliente
- **When** accedo al formulario de solicitud de un curso
- **Then** el sistema autocompleta mis datos (nombre, email, teléfono, ciudad) y al enviar, la solicitud se guarda asociada a mi `cliente_id`.

### Criterio de Aceptación 2.3: Validación del formulario
- **Given** que estoy llenando una solicitud
- **When** dejo campos obligatorios vacíos (ej. email) o ingreso un formato incorrecto y presiono Enviar
- **Then** el sistema evita el envío y me muestra un mensaje de error claro en la interfaz indicando qué campos debo corregir.

---

## HU-03: Confirmación de Solicitudes (Colaborador)
**Como** Colaborador u Ofertante
**Quiero** ver las solicitudes recibidas para mis cursos y poder aceptarlas o rechazarlas
**Para** gestionar el cupo y comunicarme adecuadamente con los demandantes.

### Criterio de Aceptación 3.1: Visualización de solicitudes recibidas
- **Given** que he iniciado sesión como Colaborador
- **When** navego a la pestaña "Mis Solicitudes" en mi panel de control
- **Then** veo una lista de todas las solicitudes pendientes enviadas a mis cursos, mostrando los datos del solicitante (nombre, email, teléfono, ciudad, mensaje) y el curso al que aplican.

### Criterio de Aceptación 3.2: Aceptar solicitud
- **Given** que estoy viendo una solicitud pendiente en mi panel
- **When** presiono el botón "Aceptar"
- **Then** el estado de la solicitud cambia a `ACEPTADA` y se refleja inmediatamente en la interfaz.

### Criterio de Aceptación 3.3: Rechazar solicitud con motivo
- **Given** que estoy viendo una solicitud pendiente en mi panel
- **When** presiono el botón "Rechazar"
- **Then** se abre un modal exigiéndome que ingrese un motivo de rechazo.
- **When** ingreso el motivo y confirmo
- **Then** el estado cambia a `RECHAZADA`, el motivo se guarda en la base de datos y se actualiza la vista.

---

## HU-04: Mejoras Visuales y Fallback de Imágenes
**Como** Usuario de la plataforma
**Quiero** una interfaz limpia y que las imágenes rotas no arruinen la experiencia visual
**Para** percibir la plataforma como un producto premium y profesional.

### Criterio de Aceptación 4.1: Placeholder para imágenes rotas
- **Given** que la URL de la imagen de un curso es inválida o ha expirado (ej. por borrado en Render)
- **When** la tarjeta del curso intenta cargar la imagen y falla
- **Then** el sistema captura el error y renderiza de inmediato una imagen *placeholder* con un diseño oscuro premium y el logo o nombre de LearnUp.

### Criterio de Aceptación 4.2: Remoción de "Instalar App"
- **Given** que navego por la Landing Page o Navbar
- **When** observo la cabecera
- **Then** no debe existir ningún botón que diga "Instalar App".
