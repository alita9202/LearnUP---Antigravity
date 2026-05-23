# Especificaciones SDD - Sprint 2: Gestión de Cursos/Talleres

Este documento contiene las Historias de Usuario, Criterios de Aceptación y los Escenarios formales (Given / When / Then) requeridos por el marco de trabajo Spec-Driven Development (SDD) para el Sprint 2.

---

## HU-01: Registro de Cursos (Colaborador)
**Como** colaborador  
**Quiero** registrar mis cursos o talleres, subiendo una imagen y definiendo su contenido  
**Para** ofrecer mis servicios en la plataforma a posibles estudiantes.

### Criterios de Aceptación
1. El formulario debe contener: título, descripción, precio, categoría, modalidad, ubicación, cupos, fecha e imagen.
2. Todo curso nuevo debe ingresar al sistema con estado `PENDIENTE`.
3. Debe utilizar componentes UI premium dark, asegurando que el modal no se desborde y permita scroll interno.

### Escenario 1: Creación Exitosa
- **Dado** que un usuario con rol `COLABORADOR` está autenticado en su panel de control.
- **Cuando** abre el modal "Crear Curso", completa todos los campos requeridos, adjunta una imagen válida y hace clic en "Guardar".
- **Entonces** el sistema sube la imagen y almacena el curso en la base de datos.
- **Y** el curso adquiere automáticamente el estado `PENDIENTE`.
- **Y** se notifica visualmente al colaborador que el curso está bajo revisión.

---

## HU-02: Edición y Eliminación (Colaborador)
**Como** colaborador  
**Quiero** poder editar los datos de mis cursos o eliminarlos por completo  
**Para** mantener actualizada la información que ofrezco a los clientes.

### Criterios de Aceptación
1. El colaborador solo puede editar cursos que le pertenezcan.
2. Si se editan "datos críticos" (título, descripción, precio, imagen o categoría), el estado del curso vuelve a `PENDIENTE` automáticamente.
3. Para eliminar un curso, debe desplegarse un cuadro de diálogo o modal de confirmación obligatoria.

### Escenario 2: Edición Crítica revierte la Aprobación
- **Dado** que un `COLABORADOR` tiene un curso con estado `APROBADO`.
- **Cuando** edita el curso cambiando su *precio* o *título* y guarda los cambios.
- **Entonces** los datos del curso se actualizan en la base de datos.
- **Y** el sistema revierte el estado_validacion a `PENDIENTE`.
- **Y** el curso deja de ser visible para los clientes hasta nueva validación del administrador.

### Escenario 3: Eliminación con Confirmación
- **Dado** que el `COLABORADOR` está en su lista de cursos.
- **Cuando** hace clic en el botón "Eliminar" de un curso.
- **Entonces** el sistema muestra un modal oscuro premium preguntando "¿Estás seguro de eliminar este curso?".
- **Cuando** el usuario confirma la acción.
- **Entonces** el curso se elimina de la base de datos y de la vista del usuario.

---

## HU-03: Validación por Administrador
**Como** administrador  
**Quiero** poder revisar los cursos pendientes y decidir si los apruebo o los rechazo  
**Para** garantizar la calidad del contenido que se publica en la plataforma.

### Criterios de Aceptación
1. El panel de administración debe tener una vista dedicada para "Cursos Pendientes".
2. La vista debe mostrar el curso como una tarjeta o detalle enriquecido (imagen, colaborador, categoría, descripción, precio, modalidad).
3. Botones explícitos de Aprobar y Rechazar.
4. Si se rechaza, el sistema obliga a ingresar un "motivo de rechazo".

### Escenario 4: Aprobación de Curso
- **Dado** que un `ADMINISTRADOR` está en el panel de validación de cursos.
- **Y** existe al menos un curso en estado `PENDIENTE`.
- **Cuando** el administrador revisa los detalles de un curso y presiona "Aprobar".
- **Entonces** el estado del curso cambia a `APROBADO` en la base de datos.
- **Y** el curso aparece inmediatamente en la página Landing para los clientes.

### Escenario 5: Rechazo de Curso con Motivo
- **Dado** que un `ADMINISTRADOR` está en el panel de validación revisando un curso `PENDIENTE`.
- **Cuando** presiona "Rechazar".
- **Entonces** se abre un modal solicitando el motivo.
- **Cuando** ingresa "La imagen no tiene buena resolución" y confirma.
- **Entonces** el estado del curso cambia a `RECHAZADO`.
- **Y** se guarda el motivo en la base de datos.
- **Y** el colaborador visualizará este motivo en su panel.
