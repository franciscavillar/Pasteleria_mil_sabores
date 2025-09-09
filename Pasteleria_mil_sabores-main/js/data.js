/* js/data.js*/
/*Fuente única de datos para productos*/
/*Aqui se pueden editar más imagenes por si quieren agregar otros.*/
const productos = [
  { codigo: 'TC001', categoria: 'Tortas Cuadradas', nombre: 'Torta Cuadrada de Chocolate', precio: 45000, descripcion: 'Bizcocho húmedo de cacao belga con ganache 70%.', stock: 8, imagen: 'img/pastelChocolate.png' },
  { codigo: 'TC002', categoria: 'Tortas Cuadradas', nombre: 'Torta Cuadrada Tres Leches', precio: 43000, descripcion: 'Clásica tres leches con manjar y crema.', stock: 10, imagen: 'img/pastelTresLeches.png' },
  { codigo: 'TT001', categoria: 'Tortas Circulares', nombre: 'Torta Circular de Vainilla', precio: 40000, descripcion: 'Esponjosa vainilla con relleno de frambuesas.', stock: 12, imagen: 'img/tortaVainilla.png' },
  { codigo: 'PI001', categoria: 'Postres Individuales', nombre: 'Mousse de Chocolate', precio: 5000, descripcion: 'Suave mousse de chocolate con crocante de almendras.', stock: 40, imagen: 'img/mousseChocolate.png' },
  { codigo: 'PSA001', categoria: 'Productos Sin Azúcar', nombre: 'Torta Sin Azúcar de Naranja', precio: 48000, descripcion: 'Endulzada con estevia, glaseado cítrico natural.', stock: 6, imagen: 'img/tortaNaranja.png' },
  { codigo: 'PG001', categoria: 'Productos Sin Gluten', nombre: 'Brownie Sin Gluten', precio: 4000, descripcion: 'Harinas alternativas y cacao intenso.', stock: 30, imagen: 'img/brownieChocolate.png' },
  { codigo: 'PV001', categoria: 'Productos Veganos', nombre: 'Torta Vegana de Chocolate', precio: 50000, descripcion: 'Sin ingredientes de origen animal, sabor intenso a cacao.', stock: 5, imagen: 'img/tortaVegana.png' }
];

function getProductoByCodigo(cod){
  return productos.find(p => p.codigo === cod);
}

function getCategorias(){
  return [...new Set(productos.map(p => p.categoria))];
}
