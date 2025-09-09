/* =========================
   main.js - Pastelería 1000 Sabores
   Carrusel multi-item + carrito
   ========================= */

/* ---------------------------------
   Carrusel de productos destacados (index.html)
   3 productos por slide en desktop, 1 en móvil
   --------------------------------- */
function renderDestacadosCarousel() {
  // Toma hasta 9 productos para el carrusel (ajusta si quieres más)
  const destacados = productos.slice(0, 9);

  const grid = document.getElementById('productGrid');
  if (!grid || !destacados.length) return;

  // Si el contenedor venía con clases de grilla, las quitamos para que el carrusel ocupe el ancho centrado
  grid.classList.remove('row', 'row-cols-1', 'row-cols-sm-2', 'row-cols-md-3', 'g-4');

  // Agrupar de a 3 por slide
  const perSlide = 3;
  const slides = [];
  for (let i = 0; i < destacados.length; i += perSlide) {
    slides.push(destacados.slice(i, i + perSlide));
  }

  grid.innerHTML = `
    <div class="row justify-content-center">
      <div class="col-12 col-xxl-10">
        <div id="carouselDestacados" class="carousel slide" data-bs-ride="carousel" data-bs-interval="5000">
          
          <!-- Indicadores -->
          <div class="carousel-indicators">
            ${slides.map((_, i) => `
              <button type="button"
                data-bs-target="#carouselDestacados"
                data-bs-slide-to="${i}"
                ${i === 0 ? 'class="active" aria-current="true"' : ''}
                aria-label="Slide ${i + 1}">
              </button>
            `).join('')}
          </div>

          <div class="carousel-inner">
            ${slides.map((grupo, i) => `
              <div class="carousel-item${i === 0 ? ' active' : ''}">
                <div class="row g-4">
                  ${grupo.map(p => `
                    <div class="col-12 col-md-4">
                      <div class="card h-100 shadow-sm">
                        <div class="ratio ratio-1x1 bg-light d-flex align-items-center justify-content-center">
                          ${p.imagen
                            ? `<img src="${p.imagen}" alt="${p.nombre}" class="img-fluid rounded-top w-100 h-100" style="object-fit:cover;">`
                            : `<span class="text-muted">Sin imagen</span>`}
                        </div>
                        <div class="card-body d-flex flex-column">
                          <h5 class="card-title">${p.nombre}</h5>
                          <p class="card-text flex-grow-1"><small class="text-muted">${p.categoria}</small></p>
                          <div class="d-flex justify-content-between align-items-center">
                            <strong>$${p.precio.toLocaleString('es-CL')}</strong>
                            <a href="producto.html?code=${p.codigo}" class="btn btn-outline-choco">Ver</a>
                          </div>
                        </div>
                      </div>
                    </div>
                  `).join('')}
                </div>
              </div>
            `).join('')}
          </div>

          <!-- Controles -->
          <button class="carousel-control-prev" type="button" data-bs-target="#carouselDestacados" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Anterior</span>
          </button>
          <button class="carousel-control-next" type="button" data-bs-target="#carouselDestacados" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden">Siguiente</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

/* ---------------------------------
   Carrito (localStorage)
   --------------------------------- */
const CART_KEY = 'ms_cart_items';

function getCart(){
  const raw = localStorage.getItem(CART_KEY);
  return raw ? JSON.parse(raw) : [];
}
function saveCart(items){
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}
function addToCart(codigo){
  const items = getCart();
  const found = items.find(i => i.codigo === codigo);
  if(found){ found.cantidad += 1; }
  else {
    const p = productos.find(p => p.codigo === codigo);
    if(!p) return;
    items.push({ codigo: p.codigo, nombre: p.nombre, precio: p.precio, cantidad: 1 });
  }
  saveCart(items);
  renderCart();
}
function removeFromCart(codigo){
  let items = getCart().filter(i => i.codigo !== codigo);
  saveCart(items);
  renderCart();
}
function calcTotal(items){
  return items.reduce((acc, it) => acc + it.precio * it.cantidad, 0);
}

function renderCart(){
  renderTotals();
  const items = getCart();

  // Badge contador
  const count = items.reduce((acc, it) => acc + it.cantidad, 0);
  const countEl = document.getElementById('cartCount');
  if (countEl) countEl.textContent = count;

  // Listado en offcanvas
  const ul = document.getElementById('cartList');
  if (ul) {
    ul.innerHTML = '';
    items.forEach(it => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.innerHTML = `
        <div>
          <div class="fw-semibold">${it.nombre}</div>
          <small class="text-muted">x${it.cantidad}</small>
        </div>
        <div class="d-flex align-items-center gap-2">
          <strong>$${(it.precio * it.cantidad).toLocaleString('es-CL')}</strong>
          <button class="btn btn-sm btn-outline-danger" aria-label="Quitar" data-remove="${it.codigo}">✖</button>
        </div>
      `;
      ul.appendChild(li);
    });
  }

  const totalEl = document.getElementById('cartTotal');
  if (totalEl) totalEl.textContent = '$' + calcTotal(items).toLocaleString('es-CL');
}

/* ---------------------------------
   Render de productos (lista clásica)
   --------------------------------- */
function renderProducts(){
  const grid = document.getElementById('productGrid');
  if(!grid) return;

  grid.classList.add('row','row-cols-1','row-cols-md-2','row-cols-md-3','g-4');
  grid.innerHTML = productos.map(p => `
    <div class="col">
      <div class="card h-100 shadow-sm">
        <div class="ratio ratio-1x1 bg-light d-flex align-items-center justify-content-center">
          ${p.imagen
            ? `<img src="${p.imagen}" alt="${p.nombre}" class="img-fluid rounded w-100 h-100" style="object-fit: cover;">`
            : `<span class='text-muted'>Sin imagen</span>`}
        </div>
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${p.nombre}</h5>
          <p class="card-text flex-grow-1"><small class="text-muted">${p.categoria}</small></p>
          <div class="d-flex justify-content-between align-items-center">
            <strong>$${p.precio.toLocaleString('es-CL')}</strong>
            <button class="btn btn-rose" data-add="${p.codigo}">Añadir</button>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

/* ---------------------------------
   Eventos globales de clic (añadir/quitar)
   --------------------------------- */
document.addEventListener('click', (e) => {
  const add = e.target.closest('[data-add]');
  if(add){
    addToCart(add.getAttribute('data-add'));
    alert('Producto añadido al carrito.');
  }

  const remove = e.target.closest('[data-remove]');
  if(remove){ removeFromCart(remove.getAttribute('data-remove')); }
});

/* ---------------------------------
   Inicio
   --------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const hasGrid = !!document.getElementById('productGrid');

  if (hasGrid) {
    // index: carrusel multi-item centrado
    renderDestacadosCarousel();
  } else {
    // otras páginas con listado
    renderProducts();
  }

  renderCart();

  const checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const code = document.getElementById('promoInput')?.value || '';
      if(code){
        if(typeof applyLifetimePromo === 'function' && applyLifetimePromo(code)){
          alert('Código FELICES50 activado para siempre en tu cuenta.');
          renderTotals();
        } else {
          alert('Código no válido.');
        }
      } else {
        alert('Flujo de pago pendiente (entrega 2).');
      }
    });
  }
});

/* ---------------------------------
   Descuentos y totales (fallback si no existe computeDiscounts)
   --------------------------------- */
function renderTotals(){
  const items = getCart();
  const breakdown = (typeof computeDiscounts === 'function')
    ? computeDiscounts(items)
    : { total: calcTotal(items), discounts: [] };

  const totalEl = document.getElementById('cartTotal');
  const infoEl  = document.getElementById('discountInfo');

  if(totalEl){
    totalEl.textContent = '$' + breakdown.total.toLocaleString('es-CL');
  }
  if(infoEl){
    if(!breakdown.discounts.length){
      infoEl.innerHTML = '<small class="text-muted">Sin descuentos aplicados.</small>';
    }else{
      infoEl.innerHTML = breakdown.discounts.map(d =>
        `<div class="d-flex justify-content-between"><span>${d.label}</span><span class="text-success">- $${d.amount.toLocaleString('es-CL')}</span></div>`
      ).join('');
    }
  }
}
