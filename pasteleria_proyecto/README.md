# Pastelería 1000 Sabores

Proyecto front-end (HTML, CSS, JavaScript + Bootstrap 5.3) para **DSY1104**.

## Estructura
- `index.html` (Home)
- `productos.html`, `producto.html` (Catálogo + detalle)
- `registro.html`, `login.html`
- `blogs.html`, `blog1.html`, `blog2.html`
- `nosotros.html`, `contacto.html`, `checkout.html`
- `admin.html` (CRUD Productos/Usuarios con localStorage)
- `css/main.css`
- `js/data.js`, `js/main.js`, `js/auth.js`, `js/validate.js`, `js/admin.js`
- `assets/` (imágenes — placeholders)

## Requisitos
- Navegador moderno (Chrome/Edge/Firefox/Safari).
- Conexión a internet para CDNs de Bootstrap y Google Fonts.

## Cómo usar
1. Abre `index.html` en tu navegador.
2. Navega por el sitio desde la barra superior.
3. Agrega productos al carrito (persistencia en `localStorage`).
4. Usa **FELICES50** en el carrito para aplicar promo de por vida.
5. Ve a **checkout** para ver el resumen de compra y total con descuentos.
6. Administra **Productos/Usuarios** desde `admin.html`.

## GitHub — Comandos sugeridos
> Crea primero un repositorio vacío en GitHub (público), por ejemplo: `pasteleria-mil-sabores`.

```bash
# 0) Ubicarse en la carpeta del proyecto
cd pasteleria-mil-sabores

# 1) Inicializar
git init
git branch -M main

# 2) Ignorar archivos temporales
echo ".DS_Store
Thumbs.db
node_modules/
dist/
*.log
" > .gitignore

# 3) Primer commit
git add .
git commit -m "feat: estructura base (home, productos, carrito, estilos)"

# 4) Vincular a GitHub (reemplaza TU_USUARIO y REPO)
git remote add origin https://github.com/TU_USUARIO/pasteleria-mil-sabores.git
git push -u origin main

# 5) Commits siguientes (ejemplos)
git add .
git commit -m "feat(auth): registro/login con validaciones y reglas de negocio"
git commit -m "feat(blog-nosotros): páginas de blogs y nosotros"
git commit -m "feat(contacto): formulario con dominios permitidos + validaciones"
git commit -m "feat(checkout): mini checkout con desglose de descuentos"
git commit -m "feat(admin): panel CRUD productos/usuarios con localStorage"
git commit -m "chore: pulido de estilos y validaciones en tiempo real"
git push
```

## Rúbrica — cobertura rápida
- Estructura y navegación ✅
- Diseño y paleta ✅
- Catálogo, carrito, checkout ✅
- Reglas de negocio ✅
- Validaciones JS (tiempo real) ✅
- Admin CRUD ✅
- Blogs (2) y Nosotros ✅
- Entregables: GitHub y ERS (plantilla incluida) ✅

---

_Actualizado: 2025-09-03_
