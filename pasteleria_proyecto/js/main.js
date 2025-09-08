// Datos de ejemplo (extraídos y adaptados de la Forma C)
const productos = [
  { codigo: 'TC001', categoria: 'Tortas Cuadradas', nombre: 'Torta Cuadrada de Chocolate', precio: 45000 },
  { codigo: 'TT001', categoria: 'Tortas Circulares', nombre: 'Torta Circular de Vainilla', precio: 40000 },
  { codigo: 'PI001', categoria: 'Postres Individuales', nombre: 'Mousse de Chocolate', precio: 5000 },
  { codigo: 'PSA001', categoria: 'Productos Sin Azúcar', nombre: 'Torta Sin Azúcar de Naranja', precio: 48000 },
  { codigo: 'PG001', categoria: 'Productos Sin Gluten', nombre: 'Brownie Sin Gluten', precio: 4000 },
  { codigo: 'PV001', categoria: 'Productos Veganos', nombre: 'Torta Vegana de Chocolate', precio: 50000 }
];

// Utilidades de carrito con localStorage
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
  document.getElementById('cartCount').textContent = count;

  // Listado en offcanvas
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
          <span class="text-muted">Imagen</span>
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
  if(add){ addToCart(add.getAttribute('data-add')); }

  const remove = e.target.closest('[data-remove]');
  if(remove){ removeFromCart(remove.getAttribute('data-remove')); }
});

document.addEventListener('DOMContentLoaded', () => {
  renderProducts();
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

// ======= Descuentos y promo =======
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
