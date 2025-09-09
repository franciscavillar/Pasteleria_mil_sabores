// Carrusel de productos destacados bootstrap
function renderDestacadosCarousel() {

  // productos (4)
  const destacados = [productos[0], productos[1], productos[2], productos[3]].filter(Boolean);

  const grid = document.getElementById('productGrid');
  if (!grid || destacados.length === 0) return;

  grid.innerHTML = `
    <div class="d-flex justify-content-center">
      <!-- w-100 para ocupar el ancho del container; sin max-width pequeño -->
      <div id="carouselDestacados" class="carousel slide w-100" data-bs-ride="carousel" data-bs-interval="5000">

        <!-- Indicadores (puntitos) -->
        <div class="carousel-indicators">
          ${destacados.map((_, i) => `
            <button type="button"
              data-bs-target="#carouselDestacados"
              data-bs-slide-to="${i}"
              ${i === 0 ? 'class="active" aria-current="true"' : ''}
              aria-label="Slide ${i + 1}">
            </button>
          `).join('')}
        </div>

        <!-- Slides -->
        <div class="carousel-inner">
          ${destacados.map((p, i) => `
            <div class="carousel-item${i === 0 ? ' active' : ''}">
              <div class="card h-100 shadow-sm mx-auto w-100 border-0">
                <!-- Imagen panorámica 21:9 -->
                <div class="ratio ratio-21x9 bg-light d-flex align-items-center justify-content-center">
                  ${p.imagen
                    ? `<img src="${p.imagen}" alt="${p.nombre}" class="img-fluid rounded-3 w-100 h-100" style="object-fit:cover;">`
                    : `<span class="text-muted">Sin imagen</span>`}
                </div>
                <div class="card-body d-flex flex-column px-3 px-md-4">
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
  `;
}
