// js/auth.js
const USER_KEY = 'ms_user';
const PROMO_KEY = 'ms_promo_lifetime'; // stores 'FELICES50' if redeemed

function saveUser(user){ localStorage.setItem(USER_KEY, JSON.stringify(user)); }
function getUser(){ const raw = localStorage.getItem(USER_KEY); return raw ? JSON.parse(raw) : null; }
function isLogged(){ return !!getUser(); }

// Email domain helpers
function isDuocEmail(email){
  if(!email) return false;
  return /@duoc(\.cl|uc\.cl)$/i.test(email);
}

function calcAge(isoDateStr){
  if(!isoDateStr) return 0;
  const dob = new Date(isoDateStr);
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const m = now.getMonth() - dob.getMonth();
  if(m < 0 || (m === 0 && now.getDate() < dob.getDate())) age--;
  return age;
}

function isBirthdayToday(isoDateStr){
  if(!isoDateStr) return false;
  const dob = new Date(isoDateStr);
  const now = new Date();
  return dob.getDate() === now.getDate() && dob.getMonth() === now.getMonth();
}

// Discount calculation based on Forma C rules
function computeDiscounts(items){
  const user = getUser();
  const result = { base: 0, discounts: [], total: 0 };

  const subtotal = items.reduce((acc, it) => acc + it.precio * it.cantidad, 0);
  result.base = subtotal;

  if(!items.length){
    result.total = 0;
    return result;
  }

  // 1) 50% para mayores de 50 años
  if(user && calcAge(user.fechaNacimiento) >= 50){
    const d = subtotal * 0.5;
    result.discounts.push({ label: "Descuento 50% (mayor de 50 años)", amount: d });
  }

  // 2) Código FELICES50 => 10% de por vida (si alguna vez se registró/promocionó)
  const hasLifetime = localStorage.getItem(PROMO_KEY) === 'FELICES50' || (user && user.promoLifetime === 'FELICES50');
  if(hasLifetime){
    const d = subtotal * 0.10;
    result.discounts.push({ label: "FELICES50 (10% de por vida)", amount: d });
  }

  // 3) DUOC cumpleaños => 1 torta gratis (si hay torta en el carrito, aplica 1 unidad más barata)
  if(user && isDuocEmail(user.email) && isBirthdayToday(user.fechaNacimiento)){
    // buscar tortas por categoría que contenga 'Torta'
    let tortaUnitPrice = null;
    items.forEach(it => {
      // buscar datos del producto para categoría
      const p = (typeof getProductoByCodigo === 'function') ? getProductoByCodigo(it.codigo) : null;
      const isTorta = p ? /torta/i.test(p.categoria) || /torta/i.test(p.nombre) : /torta/i.test(it.nombre);
      if(isTorta && it.cantidad > 0){
        const unit = it.precio;
        if(tortaUnitPrice === null || unit < tortaUnitPrice) tortaUnitPrice = unit;
      }
    });
    if(tortaUnitPrice !== null){
      result.discounts.push({ label: "Beneficio DUOC cumpleaños (1 torta gratis)", amount: tortaUnitPrice });
    }
  }

  const totalDiscount = result.discounts.reduce((acc, d) => acc + d.amount, 0);
  result.total = Math.max(0, subtotal - totalDiscount);
  return result;
}

function applyLifetimePromo(code){
  if((code || '').toUpperCase() === 'FELICES50'){
    localStorage.setItem(PROMO_KEY, 'FELICES50');
    const user = getUser();
    if(user){ user.promoLifetime = 'FELICES50'; saveUser(user); }
    return true;
  }
  return false;
}
