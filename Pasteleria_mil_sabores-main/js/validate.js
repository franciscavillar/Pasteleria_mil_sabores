/* js/validate.js*/
/* Validaciones en tiempo real sin librerías externas*/
(function(){
  'use strict';

  const allowedDomains = ['duoc.cl','profesor.duoc.cl','gmail.com'];

  function byId(id){ return document.getElementById(id); }
  function addLive(el, msg, ok){
    if(!el) return;
    let span = el.parentElement.querySelector('.input-live');
    if(!span){
      span = document.createElement('small');
      span.className = 'input-live';
      el.parentElement.appendChild(span);
    }
    span.textContent = msg || '';
    span.classList.remove('success','error');
    if(msg){
      span.classList.add(ok ? 'success' : 'error');
    }
  }
  function emailDomainOk(email){
    const m = (email||'').split('@')[1];
    return !!m && allowedDomains.includes(m.toLowerCase());
  }
  function match(a,b){ return (a||'') === (b||''); }

  function strength(pw){
    let s = 0;
    if((pw||'').length >= 6) s++;
    if(/[A-Z]/.test(pw)) s++;
    if(/[a-z]/.test(pw)) s++;
    if(/[0-9]/.test(pw)) s++;
    if(/[^A-Za-z0-9]/.test(pw)) s++;
    return s; // 0-5
  }
  function strengthMsg(s){
    return ['Muy débil','Débil','Aceptable','Buena','Fuerte','Muy fuerte'][s];
  }

  // Registro
  (function wireRegistro(){
    const email = byId('email'), email2 = byId('email2'), pass = byId('pass'), pass2 = byId('pass2'), nac = byId('fechaNacimiento');
    if(!email) return;

    email.addEventListener('input', () => {
      const ok = email.validity.valid && emailDomainOk(email.value);
      addLive(email, ok ? 'Dominio permitido' : 'Usa @duoc.cl, @profesor.duoc.cl o @gmail.com', ok);
      email.classList.toggle('is-valid', ok);
      email.classList.toggle('is-invalid', !ok);
    });
    email2.addEventListener('input', () => {
      const ok = email2.validity.valid && match(email.value.trim(), email2.value.trim());
      addLive(email2, ok ? 'Los correos coinciden' : 'Los correos no coinciden', ok);
      email2.classList.toggle('is-valid', ok);
      email2.classList.toggle('is-invalid', !ok);
    });
    pass.addEventListener('input', () => {
      const s = strength(pass.value);
      const ok = s >= 2;
      addLive(pass, 'Seguridad: ' + strengthMsg(s), ok);
      pass.classList.toggle('is-valid', ok);
      pass.classList.toggle('is-invalid', !ok);
    });
    pass2.addEventListener('input', () => {
      const ok = pass2.validity.valid && match(pass.value, pass2.value);
      addLive(pass2, ok ? 'Las contraseñas coinciden' : 'No coinciden', ok);
      pass2.classList.toggle('is-valid', ok);
      pass2.classList.toggle('is-invalid', !ok);
    });
    if(nac){
      // evitar fechas futuras
      const today = new Date().toISOString().slice(0,10);
      nac.setAttribute('max', today);
    }
  })();

  /* Contacto*/
  (function wireContacto(){
    const cemail = byId('cemail');
    if(!cemail) return;
    cemail.addEventListener('input', () => {
      const ok = cemail.validity.valid && emailDomainOk(cemail.value);
      addLive(cemail, ok ? 'Dominio permitido' : 'Dominio no permitido', ok);
      cemail.classList.toggle('is-valid', ok);
      cemail.classList.toggle('is-invalid', !ok);
    });
  })();

  /* Login */
  (function wireLogin(){
    const lemail = byId('lemail');
    if(!lemail) return;
    lemail.addEventListener('input', () => {
      const ok = lemail.validity.valid;
      addLive(lemail, ok ? 'Formato correcto' : 'Email inválido', ok);
      lemail.classList.toggle('is-valid', ok);
      lemail.classList.toggle('is-invalid', !ok);
    });
  })();

  /*Checkout*/
  (function wireCheckout(){
    const ckEmail = byId('ckEmail'), ckAddr = byId('ckAddr');
    if(ckEmail){
      ckEmail.addEventListener('input', () => {
        const ok = ckEmail.validity.valid && emailDomainOk(ckEmail.value);
        addLive(ckEmail, ok ? 'Dominio permitido' : 'Usa @duoc.cl, @profesor.duoc.cl o @gmail.com', ok);
        ckEmail.classList.toggle('is-valid', ok);
        ckEmail.classList.toggle('is-invalid', !ok);
      });
    }
    if(ckAddr){
      ckAddr.addEventListener('input', () => {
        const ok = ckAddr.value.trim().length >= 5;
        addLive(ckAddr, ok ? 'Dirección válida' : 'Muy corta', ok);
        ckAddr.classList.toggle('is-valid', ok);
        ckAddr.classList.toggle('is-invalid', !ok);
      });
    }
  })();

  /* Pequeña "máscara": convertir promo a mayúsculas y recortar espacios*/
  document.addEventListener('input', (e) => {
    if(e.target && e.target.id === 'promoInput'){
      e.target.value = (e.target.value || '').toUpperCase().replace(/\s+/g,'');
    }
  });
})();
