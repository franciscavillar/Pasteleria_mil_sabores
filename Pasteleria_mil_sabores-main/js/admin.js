// js/admin.js
(function(){
  'use strict';

  const PKEY = 'ms_admin_products';
  const UKEY = 'ms_admin_users';

  function loadJSON(k, fallback){ try{ return JSON.parse(localStorage.getItem(k)) ?? fallback; }catch(_){ return fallback; } }
  function saveJSON(k, v){ localStorage.setItem(k, JSON.stringify(v)); }

  // Inicializar con productos del catálogo si esta vacío
  function initProducts(){
    let list = loadJSON(PKEY, null);
    if(!list || !Array.isArray(list) || !list.length){
      list = (typeof productos !== 'undefined' ? productos : []).map(p => ({
        codigo: p.codigo, nombre: p.nombre, categoria: p.categoria, precio: p.precio, stock: p.stock ?? 0, descripcion: p.descripcion ?? ''
      }));
      saveJSON(PKEY, list);
    }
    return list;
  }
  function initUsers(){
    let list = loadJSON(UKEY, null);
    if(!list || !Array.isArray(list)){
      const u = getUser();
      list = u ? [u] : [];
      saveJSON(UKEY, list);
    }
    return list;
  }

  function getProducts(){ return loadJSON(PKEY, []); }
  function setProducts(arr){ saveJSON(PKEY, arr); }
  function getUsers(){ return loadJSON(UKEY, []); }
  function setUsers(arr){ saveJSON(UKEY, arr); }

  function renderProducts(){
    const tbody = document.getElementById('pTable');
    const term = (document.getElementById('pSearch').value || '').toLowerCase();
    const rows = getProducts()
      .filter(p => p.nombre.toLowerCase().includes(term) || p.codigo.toLowerCase().includes(term))
      .map(p => `<tr>
        <td><code>${p.codigo}</code></td>
        <td>${p.nombre}</td>
        <td>${p.categoria}</td>
        <td class="text-end">$${Number(p.precio).toLocaleString('es-CL')}</td>
        <td class="text-end">${Number(p.stock)}</td>
        <td class="text-end">
          <div class="btn-group">
            <button class="btn btn-sm btn-outline-secondary" data-edit="${p.codigo}">Editar</button>
            <button class="btn btn-sm btn-outline-danger" data-del="${p.codigo}">Borrar</button>
          </div>
        </td>
      </tr>`).join('');
    tbody.innerHTML = rows || '<tr><td colspan="6" class="text-center text-muted">Sin productos</td></tr>';
  }

  function renderUsers(){
    const tbody = document.getElementById('uTable');
    const term = (document.getElementById('uSearch').value || '').toLowerCase();
    const rows = getUsers()
      .filter(u => (`${u.nombre} ${u.apellido}`.toLowerCase().includes(term) || (u.email||'').toLowerCase().includes(term)))
      .map(u => `<tr>
        <td>${u.nombre ?? ''} ${u.apellido ?? ''}</td>
        <td>${u.email ?? ''}</td>
        <td>${u.fechaNacimiento ?? ''}</td>
        <td>${u.promoLifetime ?? ''}</td>
        <td class="text-end">
          <div class="btn-group">
            <button class="btn btn-sm btn-outline-secondary" data-edit-user="${u.email}">Editar</button>
            <button class="btn btn-sm btn-outline-danger" data-del-user="${u.email}">Borrar</button>
          </div>
        </td>
      </tr>`).join('');
    tbody.innerHTML = rows || '<tr><td colspan="5" class="text-center text-muted">Sin usuarios</td></tr>';
  }

  function resetProdForm(){
    document.getElementById('prodForm').reset();
    document.getElementById('pEditing').value = '';
  }
  function resetUserForm(){
    document.getElementById('userForm').reset();
    document.getElementById('uEditing').value = '';
  }

  // Guardar Producto
  function saveProductFromForm(){
    const form = document.getElementById('prodForm');
    if(!form.checkValidity()){ form.classList.add('was-validated'); return; }
    const data = {
      codigo: document.getElementById('pCodigo').value.trim(),
      nombre: document.getElementById('pNombre').value.trim(),
      categoria: document.getElementById('pCategoria').value.trim(),
      precio: Number(document.getElementById('pPrecio').value),
      stock: Number(document.getElementById('pStock').value),
      descripcion: document.getElementById('pDesc').value.trim()
    };
    let list = getProducts();
    const editing = document.getElementById('pEditing').value;
    if(editing){
      list = list.map(p => p.codigo === editing ? data : p);
    } else {
      if(list.find(p => p.codigo.toLowerCase() === data.codigo.toLowerCase())){
        alert('Ya existe un producto con ese código.'); return;
      }
      list.push(data);
    }
    setProducts(list);
    renderProducts();
    bootstrap.Modal.getInstance(document.getElementById('prodModal')).hide();
    resetProdForm();
  }

  // Guardar Usuario
  function saveUserFromForm(){
    const form = document.getElementById('userForm');
    if(!form.checkValidity()){ form.classList.add('was-validated'); return; }

    const email = document.getElementById('uEmail').value.trim();
    if(!/@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test(email)){
      alert('Dominio no permitido.'); return;
    }
    const data = {
      nombre: document.getElementById('uNombre').value.trim(),
      apellido: document.getElementById('uApellido').value.trim(),
      email,
      fechaNacimiento: document.getElementById('uNac').value,
      promoLifetime: document.getElementById('uPromo').value || null
    };
    let users = getUsers();
    const editing = document.getElementById('uEditing').value;
    if(editing){
      users = users.map(u => u.email === editing ? data : u);
    } else {
      if(users.find(u => (u.email||'').toLowerCase() === email.toLowerCase())){
        alert('Ya existe un usuario con ese email.'); return;
      }
      users.push(data);
    }
    setUsers(users);
    renderUsers();
    bootstrap.Modal.getInstance(document.getElementById('userModal')).hide();
    resetUserForm();
  }

  // Edit / Delete
  document.addEventListener('click', (e) => {
    const ed = e.target.closest('[data-edit]');
    const del = e.target.closest('[data-del]');
    const edu = e.target.closest('[data-edit-user]');
    const delu = e.target.closest('[data-del-user]');

    if(ed){
      const code = ed.getAttribute('data-edit');
      const p = getProducts().find(x => x.codigo === code);
      if(p){
        document.getElementById('pCodigo').value = p.codigo;
        document.getElementById('pNombre').value = p.nombre;
        document.getElementById('pCategoria').value = p.categoria;
        document.getElementById('pPrecio').value = p.precio;
        document.getElementById('pStock').value = p.stock;
        document.getElementById('pDesc').value = p.descripcion;
        document.getElementById('pEditing').value = p.codigo;
        new bootstrap.Modal(document.getElementById('prodModal')).show();
      }
    }
    if(del){
      const code = del.getAttribute('data-del');
      if(confirm('¿Borrar producto ' + code + '?')){
        setProducts(getProducts().filter(x => x.codigo !== code));
        renderProducts();
      }
    }
    if(edu){
      const email = edu.getAttribute('data-edit-user');
      const u = getUsers().find(x => (x.email||'') === email);
      if(u){
        document.getElementById('uNombre').value = u.nombre || '';
        document.getElementById('uApellido').value = u.apellido || '';
        document.getElementById('uEmail').value = u.email || '';
        document.getElementById('uNac').value = u.fechaNacimiento || '';
        document.getElementById('uPromo').value = u.promoLifetime || '';
        document.getElementById('uEditing').value = u.email || '';
        new bootstrap.Modal(document.getElementById('userModal')).show();
      }
    }
    if(delu){
      const email = delu.getAttribute('data-del-user');
      if(confirm('¿Borrar usuario ' + email + '?')){
        setUsers(getUsers().filter(x => (x.email||'') !== email));
        renderUsers();
      }
    }
  });

  // Search handlers
  document.addEventListener('input', (e) => {
    if(e.target && e.target.id === 'pSearch') renderProducts();
    if(e.target && e.target.id === 'uSearch') renderUsers();
  });

  // Save button
  document.addEventListener('DOMContentLoaded', () => {
    initProducts();
    initUsers();
    renderProducts();
    renderUsers();

    document.getElementById('saveProdBtn').addEventListener('click', saveProductFromForm);
    document.getElementById('saveUserBtn').addEventListener('click', saveUserFromForm);

    // Evitar fechas de nacimiento futuras en el usuario
    const uNac = document.getElementById('uNac');
    if(uNac){ uNac.setAttribute('max', new Date().toISOString().slice(0,10)); }
  });
})();