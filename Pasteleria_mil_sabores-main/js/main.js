/*Carrusel de productos destacados para index.html*/
function renderDestacadosCarousel() {

  /*4 productos*/
  const destacados = [
    productos[0],
    productos[1],
    productos[2],
    productos[3]
  ];
  const grid = document.getElementById('productGrid');
  if (!grid) return;
  grid.innerHTML = `
    <div class="d-flex justify-content-center">
      <div id="carouselDestacados" class="carousel slide" data-bs-ride="carousel" style="max-width: 420px; width: 100%;">
        <div class="carousel-inner">
          ${destacados.map((p, i) => `
            <div class="carousel-item${i === 0 ? ' active' : ''}">
              <div class="card h-100 shadow-sm mx-auto" style="max-width: 400px;">
                <div class="ratio ratio-1x1 bg-light d-flex align-items-center justify-content-center">
                  ${p.imagen ? `<img src="${p.imagen}" alt="${p.nombre}" class="img-fluid rounded" style="max-height: 100%; max-width: 100%; object-fit: cover;">` : `<span class='text-muted'>Sin imagen</span>`}
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
  `;
}

/*Utilidades de carrito con localStorage*/
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

  /*contador*/
  const count = items.reduce((acc, it) => acc + it.cantidad, 0);
  document.getElementById('cartCount').textContent = count;

  /*listado en offcanvas*/
  const ul = document.getElementById('cartList');
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

  document.getElementById('cartTotal').textContent = '$' + calcTotal(items).toLocaleString('es-CL');
}

function renderProducts(){
  const grid = document.getElementById('productGrid');
  grid.innerHTML = productos.map(p => `
    <div class="col">
      <div class="card h-100 shadow-sm">
        <div class="ratio ratio-1x1 bg-light d-flex align-items-center justify-content-center">
          ${p.imagen ? `<img src="${p.imagen}" alt="${p.nombre}" class="img-fluid rounded" style="max-height: 100%; max-width: 100%; object-fit: cover;">` : `<span class='text-muted'>Sin imagen</span>`}
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

document.addEventListener('click', (e) => {
  const add = e.target.closest('[data-add]');
  if(add){
    addToCart(add.getAttribute('data-add'));
    alert('Producto añadido al carrito.');
  }

  const remove = e.target.closest('[data-remove]');
  if(remove){ removeFromCart(remove.getAttribute('data-remove')); }
});

document.addEventListener('DOMContentLoaded', () => {
  // Si estamos en index.html, mostrar el carrusel de destacados
  if (document.getElementById('productGrid')) {
    renderDestacadosCarousel();
  } else {
    renderProducts();
  }
  renderCart();
  document.getElementById('checkoutBtn').addEventListener('click', () => {
    const code = document.getElementById('promoInput')?.value || '';
    if(code){
      if(applyLifetimePromo(code)){
        alert('Código FELICES50 activado para siempre en tu cuenta.');
        renderCart();
      } else {
        alert('Código no válido.');
      }
    } else {
      alert('Flujo de pago pendiente (entrega 2).');
    }
  });
});

/*descuentos */
function renderTotals(){
  const items = getCart();
  const breakdown = computeDiscounts(items);
  const totalEl = document.getElementById('cartTotal');
  const infoEl = document.getElementById('discountInfo');
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
