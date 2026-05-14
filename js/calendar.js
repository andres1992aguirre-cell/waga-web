/* ================================================
   calendar.js — Calendario reutilizable
   Se puede usar en cualquier página pasándole
   el ID del contenedor y los eventos como fechas
   ================================================ */

// Variable global para saber qué mes estamos viendo
let calMesActual = new Date().getMonth();
let calAnioActual = new Date().getFullYear();
let calEventosActivos = [];
let calContenedorId = '';
let calTituloId = '';

if (typeof window.MESES === 'undefined') {
  window.MESES = ['Enero','Febrero','Marzo','Abril','Mayo','Junio',
                  'Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
}

const MESES = window.MESES;

if (typeof window.DIAS_CAL === 'undefined') {
  window.DIAS_CAL = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
}
const DIAS = window.DIAS_CAL;

/**
 * Inicia el calendario en un contenedor HTML
 * @param {string} contenedorId - ID del div donde se dibuja
 * @param {string} tituloId     - ID del elemento donde se escribe el mes/año
 * @param {Array}  eventos      - Array de strings con fechas 'YYYY-MM-DD'
 */
function iniciarCalendario(contenedorId, tituloId, eventos) {
  calContenedorId = contenedorId;
  calTituloId     = tituloId;
  calEventosActivos = eventos || [];
  renderCalendario();
}

function mesAnterior() {
  calMesActual--;
  if (calMesActual < 0) { calMesActual = 11; calAnioActual--; }
  renderCalendario();
}

function mesSiguiente() {
  calMesActual++;
  if (calMesActual > 11) { calMesActual = 0; calAnioActual++; }
  renderCalendario();
}

function renderCalendario() {
  const contenedor = document.getElementById(calContenedorId);
  const titulo     = document.getElementById(calTituloId);
  if (!contenedor) return;

  // Actualizamos el título con el mes y año
  if (titulo) titulo.textContent = `${MESES[calMesActual]} ${calAnioActual}`;

  const hoy       = new Date();
  const primerDia = new Date(calAnioActual, calMesActual, 1).getDay(); // 0=Dom
  const diasEnMes = new Date(calAnioActual, calMesActual + 1, 0).getDate();

  // Convertimos los eventos a un Set para búsqueda rápida
  const setEventos = new Set(calEventosActivos);

  let html = '';

  // Encabezados de días
  DIAS.forEach(d => {
    html += `<div class="cal-dia-nombre">${d}</div>`;
  });

  // Espacios vacíos antes del día 1
  for (let i = 0; i < primerDia; i++) {
    html += `<div class="cal-dia vacio"></div>`;
  }

  // Los días del mes
  for (let d = 1; d <= diasEnMes; d++) {
    // Formateamos la fecha para comparar con los eventos
    const fechaStr = `${calAnioActual}-${String(calMesActual + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    
    const esHoy = (d === hoy.getDate() &&
                   calMesActual === hoy.getMonth() &&
                   calAnioActual === hoy.getFullYear());
    
    const tieneEvento = setEventos.has(fechaStr);

    let clases = 'cal-dia';
    if (esHoy)       clases += ' hoy';
    if (tieneEvento) clases += ' tiene-evento';

    html += `<div class="${clases}" onclick="diaSeleccionado('${fechaStr}', ${d})">${d}</div>`;
  }

  contenedor.innerHTML = html;
}

// Se llama cuando el usuario hace clic en un día
// Cada página puede redefinir esta función para hacer algo diferente
function diaSeleccionado(fecha, numeroDia) {
  const setEventos = new Set(calEventosActivos);
  if (setEventos.has(fecha)) {
    // Si tiene evento, mostramos info (cada página puede personalizar esto)
    if (typeof mostrarEventosDia === 'function') {
      mostrarEventosDia(fecha);
    }
  }
}

