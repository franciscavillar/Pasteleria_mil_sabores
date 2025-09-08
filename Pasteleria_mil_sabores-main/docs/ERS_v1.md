# Especificación de Requisitos del Software (ERS) — v1
**Proyecto:** Pastelería 1000 Sabores  
**Asignatura:** DSY1104  
**Autor/a:** (Completar)  
**Fecha:** (Completar)

## 1. Introducción
### 1.1 Propósito
Describir los requisitos funcionales y no funcionales del sitio web Pastelería 1000 Sabores para orientar su desarrollo y evaluación.

### 1.2 Alcance
Sitio web público con catálogo, carrito y mini checkout; formularios de registro/login/contacto; sección de blogs (2 entradas) y página “Nosotros”; panel administrador (CRUD) con persistencia en `localStorage`.

### 1.3 Definiciones y abreviaturas
- **CRUD:** Create, Read, Update, Delete
- **ERS:** Especificación de Requisitos del Software

## 2. Usuarios y roles
- **Cliente**: navega, agrega productos al carrito, realiza checkout.
- **Vendedor** (opcional): gestiona productos (stock, precio).
- **Administrador**: CRUD de productos y usuarios.
> *Nota:* En esta versión, la separación por rol es conceptual (sin control de acceso estricto).

## 3. Requisitos funcionales
### RF-01 — Catálogo y detalle de productos
- Listado con filtros por categoría y búsqueda.
- Vista de detalle por producto.
- Fuente de datos: `js/data.js`.

### RF-02 — Carrito y descuentos
- Añadir/quitar productos, persistencia en `localStorage`.
- Reglas de negocio:
  - **R1:** ≥50 años → 50% descuento.
  - **R2:** Código **FELICES50** → 10% de por vida.
  - **R3:** Correo **DUOC** en **cumpleaños** → 1 torta gratis.
- Desglose de descuentos en carrito y checkout.

### RF-03 — Registro y Login
- Registro con validaciones (email doble, dominios permitidos, password doble).
- Login básico (mock) con `localStorage`.

### RF-04 — Contacto
- Formulario con validaciones y dominios permitidos.
- Feedback en tiempo real.

### RF-05 — Blogs (2 entradas) y Nosotros
- Listado y 2 páginas de detalle.
- Página “Nosotros” con misión, visión e hitos.

### RF-06 — Admin (CRUD)
- Productos: código, nombre, categoría, precio, stock, descripción.
- Usuarios: nombre, apellido, email, fecha nacimiento, promo de por vida.
- Búsqueda y modales de edición; validaciones mínimas y control de duplicados.

## 4. Requisitos no funcionales
- **RNF-01 — Usabilidad:** Navegación clara, feedback de validaciones en tiempo real.
- **RNF-02 — Rendimiento:** Sitio estático; sin dependencias pesadas; catálogos pequeños.
- **RNF-03 — Compatibilidad:** Bootstrap 5.3 (CDN), Google Fonts.
- **RNF-04 — Seguridad:** Sin back-end; datos no sensibles; limitarse a prototipo académico.

## 5. Reglas de negocio (detalle)
- **≥50 años → 50%**: cálculo por fecha de nacimiento en `js/auth.js`.
- **FELICES50 10%**: persistente en `localStorage` (llave `ms_promo_lifetime`).
- **DUOC cumpleaños**: si email `@duoc.cl`/`@duocuc.cl` y fecha cumple coincide con hoy, descuenta 1 torta de menor precio del carrito.

## 6. Arquitectura y componentes
- **HTML estático**: páginas por vista.
- **CSS**: `css/main.css` (paleta Forma C y refinamientos).
- **JS**:
  - `data.js` (datos de productos)
  - `main.js` (render catálogo + carrito)
  - `auth.js` (usuario y descuentos)
  - `validate.js` (validaciones en tiempo real)
  - `admin.js` (CRUD admin)

## 7. Plan de pruebas (resumen)
- **TP-01**: Agregar productos, verificar contador y persistencia.
- **TP-02**: Aplicar **FELICES50** y confirmar descuento persistente.
- **TP-03**: Simular usuario ≥50 años, validar 50% en carrito/checkout.
- **TP-04**: Simular usuario DUOC con cumpleaños hoy + torta en carrito; verificar torta gratis.
- **TP-05**: Registro con correos válidos/ inválidos; passwords débiles/fuertes; coincidencia.
- **TP-06**: Contacto y Checkout con dominios permitidos (inline).
- **TP-07**: Admin: crear/editar/borrar productos/usuarios; duplicados.
- **TP-08**: Navegación por todas las vistas (links correctos).

## 8. Entregables
- Código fuente + **GitHub** público.
- **ERS v1** (este documento).
- Capturas de validaciones, carrito y admin (opcional).

## 9. Pendientes y mejoras
- Control de acceso por roles.
- Backend real (API + DB) y autenticación.
- Carga de imágenes por producto.
- Reportes/Exportación en Admin.

---
**Aprobación**  
Responsable: _____________  Fecha: _____________
