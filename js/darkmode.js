/* ================================================
   MODO OSCURO / CLARO
   Este archivo maneja el botón de cambiar tema
   ================================================ */

// Cuando la página carga, revisamos si el usuario ya había elegido un modo
document.addEventListener('DOMContentLoaded', function() {
  
  // "localStorage" es como una memoria del navegador que no se borra
  const modoGuardado = localStorage.getItem('modoColor');
  
  if (modoGuardado === 'claro') {
    document.body.classList.add('modo-claro');
    actualizarIcono(true);
  }
});

// Esta función se llama cuando el usuario aprieta el botón del sol/luna
function cambiarModo() {
  const esClaro = document.body.classList.toggle('modo-claro');
  
  // Guardamos la elección del usuario para que se recuerde
  localStorage.setItem('modoColor', esClaro ? 'claro' : 'oscuro');
  
  actualizarIcono(esClaro);
}

// Cambia el ícono del botón (sol o luna)
function actualizarIcono(esClaro) {
  const btn = document.getElementById('btn-modo');
  if (btn) {
    btn.textContent = esClaro ? '🌙' : '☀️';
    btn.title = esClaro ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro';
  }
}