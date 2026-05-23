# Walkthrough: Sprint 2 - Gestión de Cursos/Talleres

*(Este documento será actualizado una vez se ejecuten los cambios)*

## Objetivo Logrado
Implementación completa del flujo de vida de un Curso/Taller dictado por un Colaborador y validado por un Administrador, cumpliendo con los estándares de Spec-Driven Development (SDD).

## Cambios Realizados
1. **Base de Datos:**
   - [ ] Actualizada la tabla `cursos` en Aiven MySQL.
2. **Backend:**
   - [ ] API protegida para CRUD del Colaborador.
   - [ ] Detección de edición crítica que fuerza estado `PENDIENTE`.
   - [ ] Subida de imágenes usando `Multer`.
   - [ ] API de validación exclusiva para Administradores.
3. **Frontend (UX/UI):**
   - [ ] Corrección de Modales: scroll interno (`overflow-y-auto`), height restringido (`max-h-[90vh]`) y centrado con Flexbox en todas las vistas de Colaborador y Administrador.
   - [ ] Panel Colaborador: Creación y Edición con imágenes.
   - [ ] Panel Administrador: Sección de "Cursos Pendientes" con detalle visual y modal para motivo de rechazo.
   - [ ] Integración usando variables de entorno para Render (`import.meta.env.VITE_API_URL`).

## Validación SDD
- [ ] **HU-01:** Curso creado con éxito en estado `PENDIENTE`.
- [ ] **HU-02:** Edición de precio de un curso `APROBADO` regresó automáticamente a `PENDIENTE`.
- [ ] **HU-02:** Eliminación requirió confirmación exitosamente.
- [ ] **HU-03:** Administrador aprobó un curso y apareció en Landing.
- [ ] **HU-03:** Administrador rechazó con motivo y el colaborador visualizó el error.

---
*Fin del resumen.*
