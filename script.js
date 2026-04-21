
/******************************
 * 🎨 TEMA (Modo oscuro/Claro)
 ******************************/
function cambiarTema() {
    // Toggle de la clase light-mode
    document.body.classList.toggle('light-mode');
    
    // Guardamos la preferencia del usuario
    const esClaro = document.body.classList.contains('light-mode');
    localStorage.setItem('tema-preferido', esClaro ? 'light' : 'dark');
}

// Esta línea es para que el botón también responda si se llama de la otra forma
const toggleDarkMode = cambiarTema;

// Inicializar tema al cargar la página
function inicializarTema() {
    const temaPref = localStorage.getItem('tema-preferido');
    if (temaPref === 'light') {
        document.body.classList.add('light-mode');
    } else {
        document.body.classList.remove('light-mode');
    }
}

// Llamar al inicializar la página
window.addEventListener('DOMContentLoaded', inicializarTema);




/******************************
 * 🔐 LOGIN (Validación básica)
 ******************************/

// Esta función es la que te faltaba y por eso daba error
function abrirLogin() {
    // Detectar la sección actualmente visible
    const homeVisible = document.getElementById('seccion-home') && document.getElementById('seccion-home').style.display !== 'none';
    const iglesiaVisible = document.getElementById('seccion-iglesia') && document.getElementById('seccion-iglesia').style.display !== 'none';
    const jovenesVisible = document.getElementById('seccion-jovenes') && document.getElementById('seccion-jovenes').style.display !== 'none';

    if (homeVisible) {
        paginaOrigen = 'home';
    } else if (iglesiaVisible) {
        paginaOrigen = 'iglesia'; // Incluye "iglesia de Marcos Paz" y "miembros de alabanza y multimedia"
    } else if (jovenesVisible) {
        paginaOrigen = 'jovenes'; // "reunion de jovenes +18"
    } else {
        paginaOrigen = 'home'; // Fallback
    }

    const modal = document.getElementById('modal-login');
    if (modal) {
        modal.style.display = 'flex';
    } else {
        alert("Error: No se encontró el cuadro de login en el HTML");
    }
}

function cerrarLogin() {
    document.getElementById('modal-login').style.display = 'none';
}



// ========================================================
// 👥 SISTEMA DE USUARIOS (login por módulo)
// ========================================================

const ADMIN = {
    nombre: "Andy", alias: "andy", dni: "36787384",
    email: "", password: "marcospaz", rol: "admin", modulo: "todos"
};

function getColaboradores() {
    try { return JSON.parse(localStorage.getItem('waga_colabs') || '[]'); }
    catch { return []; }
}
function saveColaboradores(lista) {
    localStorage.setItem('waga_colabs', JSON.stringify(lista));
}
function todosLosUsuarios() {
    return [ADMIN, ...getColaboradores()];
}

    /***********************************************************
    🛡️ CONTROL DE ACCESO (SALTO A NUEVA PÁGINA)
    ***********************************************************/
function validarAcceso() {
    const dniInput = document.getElementById('login-dni').value.trim();
    const passInput = document.getElementById('login-pass').value.trim();

    const usuarioEncontrado = todosLosUsuarios().find(u => u.dni === dniInput);


    // Verificar permiso de módulo
        if (usuarioEncontrado.rol !== 'admin' && usuarioEncontrado.modulo !== paginaOrigen) {
            document.getElementById('login-error').style.display = 'block';
            document.getElementById('login-error').innerText = `⚠️ Sin acceso al módulo "${paginaOrigen}"`;
            return;
        }

    if (usuarioEncontrado && passInput === usuarioEncontrado.password) {
        usuarioLogueado = usuarioEncontrado;
        cerrarLogin();
        

        // Ocultar elementos comunes
        document.querySelector('.navbar').style.display = 'none';
        document.querySelector('.main-container').style.display = 'none';
        document.querySelector('.donacion-fija').style.display = 'none';

        // Mostrar panel basado en origen (preparado para separar)
        if (paginaOrigen === 'home') {
            // Por ahora, mostrar panel general; en futuro, panel específico para home
            const panel = document.getElementById('pagina-panel-control');
            panel.style.display = 'block';
        } else if (paginaOrigen === 'iglesia') {
            // Panel para iglesia (incluye Marcos Paz y alabanza/multimedia)
            const panel = document.getElementById('pagina-panel-control'); // Cambia a 'pagina-panel-iglesia' cuando separes
            panel.style.display = 'block';
        } else if (paginaOrigen === 'jovenes') {
            // Panel para jóvenes
            const panel = document.getElementById('pagina-panel-control'); // Cambia a 'pagina-panel-jovenes' cuando separes
            panel.style.display = 'block';
        }

        // Inicialización común (puedes condicionar por origen si es necesario)
        renderizarTablaMultimedia();
        renderizarCalendarioMinisterioVisual();
        configurarInterfazPorRol(usuarioLogueado);

       
    } else {
        document.getElementById('login-error').style.display = 'block';
    }
}



function logout() {
    // Limpiar usuario logueado
    usuarioLogueado = null;

    // Ocultar paneles
    const panelGeneral = document.getElementById('pagina-panel-control');
    if (panelGeneral) panelGeneral.style.display = 'none';

    // Mostrar elementos comunes
    document.querySelector('.navbar').style.display = 'block';
    document.querySelector('.main-container').style.display = 'block';
    document.querySelector('.donacion-fija').style.display = 'block';

    // Regresar a la página de origen
    navegarA(paginaOrigen);

    
}

// *********************************************************
// * 🧠 LÓGICA DE MIEMBROS Y CÁLCULOS ANUALES
// *********************************************************

// 1. PRIMERO DEFINIMOS LOS DATOS (Siempre arriba de todo en el archivo)
// Iniciamos con los 11 miembros actuales. 
// Todos con DNI 11111111 menos el tuyo.
//TODO que lo cargue de un archivo JSON
const miembros = [
    { id: 1, nombre: "Andy", dni: "36787384", rol: "admin", asistencia: 100, lectura: "Sí", social: 3000, fondo: 7000 },
    { id: 2, nombre: "Benjamín", dni: "11111111", rol: "colaborador", asistencia: 0, lectura: "No", social: 2000, fondo: 5000 },
    { id: 3, nombre: "Pipo", dni: "11111112", rol: "miembro", asistencia: 0, lectura: "No", social: 1500, fondo: 1500 },
    { id: 4, nombre: "Eze", dni: "11111113", rol: "miembro", asistencia: 0, lectura: "No", social: 0, fondo: 0 },
    { id: 5, nombre: "Joa", dni: "11111114", rol: "miembro", asistencia: 0, lectura: "No", social: 1500, fondo: 1500 },
    { id: 6, nombre: "Ingrid", dni: "11111115", rol: "miembro", asistencia: 0, lectura: "No", social: 1000, fondo: 5000 },
    { id: 7, nombre: "Lucas", dni: "11111116", rol: "miembro", asistencia: 0, lectura: "No", social: 2000, fondo: 5000 },
    { id: 8, nombre: "Wally", dni: "11111117", rol: "miembro", asistencia: 0, lectura: "No", social: 4000, fondo: 5000 },
    { id: 9, nombre: "Rocio", dni: "11111118", rol: "miembro", asistencia: 0, lectura: "No", social: 4000, fondo: 2000 },
    { id: 10, nombre: "Andy", dni: "11111119", rol: "miembro", asistencia: 0, lectura: "No",social: 2000, fondo: 12000 },
    { id: 11, nombre: "Franco", dni: "11111121", rol: "miembro", asistencia: 0, lectura: "No", social: 2200, fondo: 5000 }
];

// const miembrosData = [
//     { nombre: "Benja", asistencia: "A", lectura: 0, social: 3000, fondo: 7000 },
//     { nombre: "Pipo", asistencia: "T", lectura: 4, social: 2000, fondo: 5000 },
//     { nombre: "Eze", asistencia: "A", lectura: 6, social: 1500, fondo: 1500 },
//     { nombre: "Esteban", asistencia: "A", lectura: 0, social: 0, fondo: 0 },
//     { nombre: "Joa", asistencia: "A", lectura: 6, social: 1500, fondo: 1500 },
//     { nombre: "Ingrid", asistencia: "A", lectura: 6, social: 1000, fondo: 5000 },
//     { nombre: "Lucas", asistencia: "A", lectura: 6, social: 2000, fondo: 5000 },
//     { nombre: "Wally", asistencia: "T", lectura: 5, social: 4000, fondo: 5000 },
//     { nombre: "Rocio", asistencia: "A", lectura: 6, social: 4000, fondo: 2000 },
//     { nombre: "Andy", asistencia: "T", lectura: 4, social: 2000, fondo: 12000 },
//     { nombre: "Franco", asistencia: "T", lectura: 0, social: 2200, fondo: 5000 }
// ];

// 2. DESPUÉS LAS FUNCIONES
function renderizarTabla() {
    const tabla = document.getElementById('lista-asistencia-anual');
    
    // Si la tabla no existe en el HTML actual (porque estamos en Home o Iglesia),
    // frenamos la función acá para que no de error.
    if (!tabla) return; 

    let totalSocial = 0;
    let totalFondo = 0;

    tabla.innerHTML = ""; 

    miembros.forEach(p => {
        totalSocial += p.social;
        totalFondo += p.fondo;
        let porc = (p.asistencia === 'P') ? 100 : (p.asistencia === 'T') ? 80 : 0;

        tabla.innerHTML += `
            <tr>
                <td><strong>${p.nombre}</strong></td>
                <td>${porc}%</td>
                <td>${p.lectura}</td>
                <td>$ ${p.social}</td>
                <td>$ ${p.fondo}</td>
            </tr>
        `;
    });

    const txtSocial = document.getElementById('txt-total-social');
    const txtFondo = document.getElementById('txt-total-fondo');
    if (txtSocial) txtSocial.innerText = `$ ${totalSocial}`;
    if (txtFondo) txtFondo.innerText = `$ ${totalFondo}`;
}

// ========================================================
// 🗺️ BASE DE DATOS: IGLESIAS RECOMENDADAS (+18)
// ========================================================
const iglesiasJovenes = [
    {
        id: 101,
        nombre: "Iglesia de Marcos Paz",
        zona: "Oeste",
        reunion: "2do y 4to Sábado del mes",
        horario: "20:00 hs",
        direccion: "Calle Ejemplo 123, Marcos Paz",
        mapa: "https://goo.gl/maps/ejemplo",
        redes: "@jovenes.marcospaz",
        color: "#fbbf24" // Dorado
    },
    {
        id: 102,
        nombre: "Iglesia de Morón",
        zona: "Oeste",
        reunion: "Todos los Sábados",
        horario: "19:30 hs",
        direccion: "Av. Rivadavia 18000, Morón",
        mapa: "https://goo.gl/maps/ejemplo2",
        redes: "@jovenes.moron",
        color: "#22c55e" // Verde
    }
    // Nota: Aquí podremos seguir agregando más iglesias de Zona Sur, Norte, etc.
];

/******************************
 * 🚀 NAVEGACIÓN (SPA)
 ******************************/
function navegarA(destino) {
    // 1. Identificamos todas las secciones (incluida la nueva de Jóvenes)
    const home = document.getElementById('seccion-home');
    const iglesia = document.getElementById('seccion-iglesia');
    const jovenes = document.getElementById('seccion-jovenes'); // Agregado
    const btnVolver = document.getElementById('btn-volver'); // Agregado para el botón volver

    // 2. Escondemos todas las secciones primero
    if (home) home.style.display = 'none';
    if (iglesia) iglesia.style.display = 'none';
    if (jovenes) jovenes.style.display = 'none';

    // 3. Mostramos solo la sección a la que queremos ir
    if (destino === 'home') {
        if (home) home.style.display = 'block';
        if (btnVolver) btnVolver.style.display = 'none'; // Ocultar volver en el home
    } 
    else if (destino === 'iglesia') {
        if (iglesia) {
            iglesia.style.display = 'block';
            if (btnVolver) btnVolver.style.display = 'block'; // Mostrar volver
            // 3. Activamos los calendarios automáticamente al entrar
            iniciarCalendarios(); 
        }
    } 
    else if (destino === 'jovenes') { // NUEVA SECCIÓN
        if (jovenes) {
            jovenes.style.display = 'flex'; // Usamos flex para centrar el contenido
            if (btnVolver) btnVolver.style.display = 'block'; // Mostrar volver
            
            // Si la bienvenida de jóvenes tiene botones de zona, 
            // nos aseguramos de que se vean al entrar
            const contenedorZonas = document.querySelector('.contenedor-zonas');
            const pantallaCal = document.getElementById('pantalla-calendario-jovenes');
            if (contenedorZonas) contenedorZonas.style.display = 'block';
            if (pantallaCal) pantallaCal.style.display = 'none';
        }
    }
    
    console.log("Navegando a: " + destino);
}

/******************************
 * 📅 CONFIGURACIÓN DEL CALENDARIO
 ******************************/
const calendarioConfig = {
    año: 2026,
    mes: 3, // Abril (0 = Enero)
    diasEnMes: 30,
    inicioSemana: 3, // 0=Domingo → 3=Miércoles
    hoy: 18,
    eventos: {
        18: {
            texto: "🟢 Club Bíblico (14:00hs)",
            color: "#8ce605"
        },
        19: {
            texto: "🔴 10:00hs Cena / 🔵 11:30hs General",
            color: "#ff4444"
        }
    }
};


/******************************
 * 🧱 GENERADOR BASE DE CALENDARIO
 ******************************/
function generarBaseCalendario(contenedorId) {
    const contenedor = document.getElementById(contenedorId);
    if (!contenedor) return "";

    const diasSemana = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
    let html = "";

    // Encabezado
    diasSemana.forEach(d => {
        html += `<b style="color: var(--accent);">${d}</b>`;
    });

    // Espacios vacíos iniciales
    for (let i = 0; i < calendarioConfig.inicioSemana; i++) {
        html += `<div></div>`;
    }

    return html;
}


/******************************
 * 📆 CALENDARIO SIMPLE (vista básica)
 ******************************/
function generarCalendarioSimple() {
    const contenedor = document.getElementById('calendario-real');
    if (!contenedor) return;

    let html = generarBaseCalendario('calendario-real');

    for (let dia = 1; dia <= calendarioConfig.diasEnMes; dia++) {
        let clase = "";

        if (dia === calendarioConfig.hoy) {
            clase = "hoy-especial";
        }

        if (calendarioConfig.eventos[dia]) {
            clase = "evento-cena";
        }

        html += `<div class="${clase}">${dia}</div>`;
    }

    contenedor.innerHTML = html;
}


/******************************
 * 📊 CALENDARIO INTERACTIVO
 ******************************/
function renderizarCalendario() {
    const grid = document.getElementById('calendario-mensual-grid');
    const info = document.getElementById('info-evento');
    if (!grid) return;

    let html = generarBaseCalendario('calendario-mensual-grid');

    for (let dia = 1; dia <= calendarioConfig.diasEnMes; dia++) {
        let estilo = "padding:5px; cursor:pointer; border-radius:5px;";
        let marcador = "";

        // HOY
        if (dia === calendarioConfig.hoy) {
            estilo += "background: rgba(140,230,5,0.2); border:1px solid #8ce605;";
            
            if (calendarioConfig.eventos[dia]) {
                info.innerHTML = `<b>Hoy ${dia}/4:</b> ${calendarioConfig.eventos[dia].texto}`;
            }
        }

        // EVENTOS
        if (calendarioConfig.eventos[dia]) {
            const color = calendarioConfig.eventos[dia].color;
            estilo += `border:1px solid ${color};`;

            marcador = `<div style="color:${color}; font-size:12px;">●</div>`;

            // Mostrar info del día siguiente si es hoy
            if (dia === calendarioConfig.hoy + 1) {
                info.innerHTML += `<br><b>Mañana ${dia}/4:</b> ${calendarioConfig.eventos[dia].texto}`;
            }
        }

        html += `<div style="${estilo}">${dia}${marcador}</div>`;
    }

    grid.innerHTML = html;
}


/******************************
 *  RECUPERAR CLAVE
 ******************************/
function recuperarClave() {
    const email = prompt("Por favor, ingresá tu correo electrónico para restablecer la clave:");
    if (email) {
        alert("Se ha enviado un mensaje de restablecimiento a: " + email + "\n\nTu contraseña temporal es: marcospaz");
    }
}


// *********************************************************
// * 🔑 ACTIVADOR DE PANTALLA MINISTERIO
// *********************************************************

function mostrarPanelMinisterio(rol) {
    // 1. Ocultamos el botón de ingreso
    const vistaPrevia = document.getElementById('vista-previa-ministerio');
    if(vistaPrevia) vistaPrevia.style.display = 'none';
    
    // 2. Mostramos la pantalla de control
    const pantalla = document.getElementById('pantalla-ministerio');
    if(pantalla) pantalla.style.display = 'block';
    
    // 3. Si sos Admin o Colaborador, habilitamos botones de carga
    const acciones = document.getElementById('acciones-especiales');
    if (acciones && (rol === 'admin' || rol === 'colaborador')) {
        acciones.style.display = 'block';
    }

    // 4. Dibujamos la tabla con los nombres de tu foto
    renderizarTabla();
}

/******************************
 * 🚀 INICIALIZACIÓN
 ******************************/
// Llamar cuando cargás la sección iglesia
function iniciarCalendarios() {
    generarCalendarioSimple();
    renderizarCalendario();
}

// ESTE ES EL CALENDARIO 2 (SOLO PARA EL PANEL DE ALABANZA)
function renderizarCalendarioMinisterio() {
    const gridPrivado = document.getElementById('grid-calendario-ministerio');
    if (!gridPrivado) return;

    gridPrivado.innerHTML = ""; // Limpia solo el calendario del panel

    const totalDias = 30; // Abril
    const hoy = 18; // 18 de Abril de 2026

    for (let i = 1; i <= totalDias; i++) {
        // Estilo diferente al de la iglesia: más técnico
        let colorFondo = (i === hoy) ? "background: #fbbf24; border: 2px solid #000;" : "background: #f8fafc; border: 1px solid #cbd5e1;";
        
        gridPrivado.innerHTML += `
            <div style="${colorFondo} min-height: 70px; padding: 8px; border-radius: 6px; color: black; display: flex; flex-direction: column; justify-content: flex-start;">
                <span style="font-weight: bold; font-size: 0.9rem;">${i}</span>
                <div id="info-privada-dia-${i}" style="font-size: 0.65rem; color: #475569; margin-top: 4px;">
                    </div>
            </div>
        `;
    }
}



                /************************************************
                        📅 CALENDARIO DE GESTIÓN (GRANDE)
                ************************************************/

// Variable global para controlar la fecha del panel (Abril 2026 por defecto)
let fechaControlAlabanza = new Date(2026, 3, 18); 

function renderizarCalendarioMinisterioVisual() {
    const grid = document.getElementById('grid-alabanza-visual');
    const titulo = document.getElementById('mes-titulo-alabanza');
    const info = document.getElementById('info-alabanza-visual');
    if (!grid) return;

    const mes = fechaControlAlabanza.getMonth(); 
    const año = fechaControlAlabanza.getFullYear(); 
    const nombresMeses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    
    titulo.innerText = `${nombresMeses[mes]} ${año}`;
    grid.innerHTML = ""; 

    const primerDiaMes = new Date(año, mes, 1).getDay();
    const diasEnMes = new Date(año, mes + 1, 0).getDate();

    const eventosBD = {
        "9-1": "🎂 Cumpleaños de Andy (Admin)",
        "18-3": "📌 Reunión General de Alabanza (18hs)",
        "25-3": "🎂 Cumpleaños de Miembro X"
    };

    // 1. ESPACIOS VACÍOS PARA ALINEAR
    for (let i = 0; i < primerDiaMes; i++) {
        grid.innerHTML += `<div style="height: 90px;"></div>`;
    }

    // 2. GENERAR DÍAS CON NÚMEROS VISIBLES
    for (let dia = 1; dia <= diasEnMes; dia++) {
        let esHoy = (dia === 18 && mes === 3 && año === 2026);
        let tieneEvento = eventosBD[`${dia}-${mes}`];

        let colorBorde = "#334155";
        let colorPunto = "transparent";
        let fondo = "rgba(255,255,255,0.05)";

        if (esHoy) {
            colorBorde = "#8ce605";
            colorPunto = "#8ce605";
            fondo = "rgba(140,230,5,0.1)";
        } else if (tieneEvento) {
            colorBorde = "#ef4444";
            colorPunto = "#ef4444";
            fondo = "rgba(239,68,68,0.1)";
        }

        // CREACIÓN DEL CUADRO DEL DÍA
        const diaDiv = document.createElement('div');
        diaDiv.style.cssText = `
            height: 90px;
            padding: 10px;
            cursor: pointer;
            border-radius: 12px;
            background: ${fondo};
            border: 2px solid ${colorBorde};
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            transition: 0.2s;
        `;

        // EL NÚMERO (Forzado a color blanco y tamaño grande)
        diaDiv.innerHTML = `
            <span style="color: white; font-size: 1.5rem; font-weight: bold; font-family: sans-serif;">${dia}</span>
            <div style="color: ${colorPunto}; font-size: 1.2rem; align-self: flex-end;">●</div>
        `;

        diaDiv.onclick = () => {
            const clave = `${dia}-${mes}`;
            if (eventosBD[clave]) {
                info.innerHTML = `<b>Día ${dia}/${mes + 1}:</b> ${eventosBD[clave]}`;
                info.style.borderLeftColor = colorBorde;
            } else {
                info.innerHTML = `<b>Día ${dia}/${mes + 1}:</b> No hay eventos.`;
                info.style.borderLeftColor = "#334155";
            }
        };

        grid.appendChild(diaDiv);
    }
}

// // Iniciamos con los 11 miembros actuales. 
// // Todos con DNI 11111111 menos el tuyo.
// let miembros = [
//     { id: 1, nombre: "Andy", dni: "36787384", rol: "admin", asistencia: 100, lectura: "Sí", social: 3000, fondo: 7000 },
//     { id: 2, nombre: "Benjamín", dni: "11111111", rol: "colaborador", asistencia: 0, lectura: "No", social: 2000, fondo: 5000 },
//     { id: 3, nombre: "Miembro 3", dni: "11111112", rol: "miembro", asistencia: 0, lectura: "No", social: 1500, fondo: 1500 },
//     { id: 4, nombre: "Miembro 4", dni: "11111113", rol: "miembro", asistencia: 0, lectura: "No", social: 0, fondo: 0 },
//     { id: 5, nombre: "Miembro 5", dni: "11111114", rol: "miembro", asistencia: 0, lectura: "No", social: 1500, fondo: 1500 },
//     { id: 6, nombre: "Miembro 6", dni: "11111115", rol: "miembro", asistencia: 0, lectura: "No", social: 1000, fondo: 5000 },
//     { id: 7, nombre: "Miembro 7", dni: "11111116", rol: "miembro", asistencia: 0, lectura: "No", social: 2000, fondo: 5000 },
//     { id: 8, nombre: "Miembro 8", dni: "11111117", rol: "miembro", asistencia: 0, lectura: "No", social: 4000, fondo: 5000 },
//     { id: 9, nombre: "Miembro 9", dni: "11111118", rol: "miembro", asistencia: 0, lectura: "No", social: 4000, fondo: 2000 },
//     { id: 10, nombre: "Miembro 10", dni: "11111119", rol: "miembro", asistencia: 0, lectura: "No",social: 2000, fondo: 12000 },
//     { id: 11, nombre: "Miembro 11", dni: "11111121", rol: "miembro", asistencia: 0, lectura: "No", social: 2200, fondo: 5000 }
// ];

let usuarioLogueado = null;

let paginaOrigen = 'home'; // Por defecto, si no se detecta

/************************************************
 * 🛡️ CONTROL DE INTERFAZ POR ROL
 ************************************************/
function configurarInterfazPorRol(usuario) {
    const contenedorAcciones = document.getElementById('acciones-admin-colab');
    contenedorAcciones.innerHTML = ""; // Limpiar

    // Si es Admin o Colaborador, mostramos el botón de añadir persona
    if (usuario.rol === "admin" || usuario.rol === "colaborador") {
        contenedorAcciones.innerHTML = `
            <button onclick="abrirModalNuevoMiembro()" style="background: #22c55e; color: white; border: none; padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; margin-bottom: 15px;">
                + Añadir Nuevo Miembro
            </button>
        `;
    }
    
    // El renderizado de la tabla ahora incluirá botones de "Editar" solo para ellos
    renderizarTablaMultimedia(usuario.rol);
}

    /************************************************
            ✏️ SISTEMA DE EDICIÓN DE MIEMBROS
    ************************************************/
            
  let miembroSeleccionadoId = null;

function renderizarTablaMultimedia() {
    const tabla = document.getElementById('lista-asistencia-anual');
    if (!tabla) return;
    
    let totalSocial = 0;
    let totalFondo = 0;
    tabla.innerHTML = "";

    // USAMOS 'miembros' que es la lista que tiene los IDs y DNIs
    miembros.forEach(m => {
        totalSocial += m.social;
        totalFondo += m.fondo;

        const fila = document.createElement('tr');
        fila.style.borderBottom = "1px solid #334155";
        
        let celdaAccion = "";
        if (usuarioLogueado && (usuarioLogueado.rol === "admin" || usuarioLogueado.rol === "colaborador")) {
            celdaAccion = `<td style="padding: 12px; text-align: center;">
                <button onclick="abrirEditor(${m.id})" style="background: none; border: none; font-size: 1.2rem; cursor: pointer;">✏️</button>
            </td>`;
        }

        fila.innerHTML = `
            <td style="padding: 12px; color: #fbbf24; font-weight: bold;">${m.nombre}</td>
            <td style="padding: 12px; text-align: center;">${m.asistencia}%</td>
            <td style="padding: 12px; text-align: center;">${m.lectura}</td>
            <td style="padding: 12px; text-align: center;">$ ${m.social}</td>
            <td style="padding: 12px; text-align: center;">$ ${m.fondo}</td>
            ${celdaAccion}
        `;
        tabla.appendChild(fila);
    });

    // Actualizamos los cuadros de totales que se ven en tu foto
    const txtSocial = document.getElementById('txt-total-social');
    const txtFondo = document.getElementById('txt-total-fondo');
    if (txtSocial) txtSocial.innerText = `$ ${totalSocial}`;
    if (txtFondo) txtFondo.innerText = `$ ${totalFondo}`;
}



                /************************************************
                        🚀 FUNCIONES DE APERTURA DEL MODAL
                ************************************************/


// 1. ESTA ES LA QUE YA TENÉS (Para editar uno existente)
function abrirEditor(id) {
    // Agregamos esta línea para que el título cambie
    document.getElementById('titulo-modal').innerText = "Editar Miembro";
    
    const m = miembros.find(item => item.id === id);
    if (!m) return;

    miembroSeleccionadoId = id;

    document.getElementById('edit-nombre').value = m.nombre;
    document.getElementById('edit-dni').value = m.dni;
    document.getElementById('edit-rol').value = m.rol;
    document.getElementById('edit-asistencia').value = m.asistencia;
    document.getElementById('edit-lectura').value = m.lectura;
    document.getElementById('edit-social').value = m.social;
    document.getElementById('edit-fondo').value = m.fondo;

    document.getElementById('modal-edicion').style.display = 'flex';
}

// 2. ESTA ES LA QUE TE FALTA (Para el botón de añadir nuevo)
function abrirModalNuevoMiembro() {
    // Es vital poner esto en null para que el sistema sepa que es NUEVO
    miembroSeleccionadoId = null; 

    document.getElementById('titulo-modal').innerText = "Añadir Nuevo Miembro";
    
    // Limpiamos los campos para que estén vacíos
    document.getElementById('edit-nombre').value = "";
    document.getElementById('edit-dni').value = "";
    document.getElementById('edit-rol').value = "miembro";
    document.getElementById('edit-asistencia').value = 0;
    document.getElementById('edit-lectura').value = "No";
    document.getElementById('edit-social').value = 0;
    document.getElementById('edit-fondo').value = 0;

    document.getElementById('modal-edicion').style.display = 'flex';
}

function cerrarModal() {
    document.getElementById('modal-edicion').style.display = 'none';
}

function guardarCambios() {
    const index = miembros.findIndex(m => m.id === miembroSeleccionadoId);
    
    if (index !== -1) {
        // Actualizar la base de datos local
        miembros[index].nombre = document.getElementById('edit-nombre').value;
        miembros[index].dni = document.getElementById('edit-dni').value;
        miembros[index].rol = document.getElementById('edit-rol').value;
        miembros[index].asistencia = parseInt(document.getElementById('edit-asistencia').value);
        miembros[index].lectura = document.getElementById('edit-lectura').value;
        miembros[index].social = parseInt(document.getElementById('edit-social').value);
        miembros[index].fondo = parseInt(document.getElementById('edit-fondo').value);

        cerrarModal();
        renderizarTablaMultimedia(); // Refrescar la tabla con los nuevos datos
        alert("Datos actualizados correctamente.");
    }
}          

            /************************************************
                    ➕ LÓGICA PARA AÑADIR NUEVO MIEMBRO
            ************************************************/

 // Función para abrir el modal vacío para un nuevo miembro
function abrirModalNuevoMiembro() {
    miembroSeleccionadoId = null; // Indicamos que es uno NUEVO, no una edición

    // Limpiamos todos los campos del modal
    document.getElementById('titulo-modal').innerText = "Añadir Nuevo Miembro";
    document.getElementById('edit-nombre').value = "";
    document.getElementById('edit-dni').value = "";
    document.getElementById('edit-rol').value = "miembro";
    document.getElementById('edit-asistencia').value = 0;
    document.getElementById('edit-lectura').value = "No";
    document.getElementById('edit-social').value = 0;
    document.getElementById('edit-fondo').value = 0;

    // Mostramos el modal
    document.getElementById('modal-edicion').style.display = 'flex';
}

// Modificamos la función de guardar para que sepa si es NUEVO o EDICIÓN
function guardarCambios() {
    const nombre = document.getElementById('edit-nombre').value.trim();
    const dni = document.getElementById('edit-dni').value.trim();

    if (nombre === "" || dni === "") {
        alert("Por favor, completa al menos el nombre y el DNI.");
        return;
    }

    if (miembroSeleccionadoId === null) {
        // --- LÓGICA PARA AÑADIR NUEVO ---
        const nuevoId = miembros.length > 0 ? Math.max(...miembros.map(m => m.id)) + 1 : 1;
        
        const nuevoMiembro = {
            id: nuevoId,
            nombre: nombre,
            dni: dni,
            rol: document.getElementById('edit-rol').value,
            asistencia: parseInt(document.getElementById('edit-asistencia').value) || 0,
            lectura: document.getElementById('edit-lectura').value,
            social: parseInt(document.getElementById('edit-social').value) || 0,
            fondo: parseInt(document.getElementById('edit-fondo').value) || 0
        };

        miembros.push(nuevoMiembro);
        alert("¡Miembro añadido con éxito!");

    } else {
        // --- LÓGICA PARA EDITAR EXISTENTE (La que ya tenías) ---
        const index = miembros.findIndex(m => m.id === miembroSeleccionadoId);
        if (index !== -1) {
            miembros[index].nombre = nombre;
            miembros[index].dni = dni;
            miembros[index].rol =
             document.getElementById('edit-rol').value;
            miembros[index].asistencia = parseInt(document.getElementById('edit-asistencia').value) || 0;
            miembros[index].lectura = document.getElementById('edit-lectura').value;
            miembros[index].social = parseInt(document.getElementById('edit-social').value) || 0;
            miembros[index].fondo = parseInt(document.getElementById('edit-fondo').value) || 0;
            alert("Datos actualizados.");
        }
    }

    cerrarModal();
    renderizarTablaMultimedia(); // Refresca la tabla para que aparezca el nuevo
}   

// ========================================================
// 📍 LÓGICA DE ZONAS PARA JÓVENES
// ========================================================
function irAZona(zona) {
    console.log("Cargando iglesias de la Zona: " + zona);
    
    // Por ahora, solo mostraremos un aviso hasta que hagamos el calendario
    alert("Próximamente: Calendario de Iglesias de la " + zona);
    
    // Aquí es donde luego llamaremos a la función que dibuja el calendario
}

// Función para el botón de donaciones que agregamos
function abrirDonaciones() {
    alert("Módulo de donaciones (Mercado Pago / CBU) en desarrollo.");
}


// ========================================================
//  CALENDARIO DE PAGINA IGLESIA DE MARCOS PAZ (INTERACTIVO)
// ========================================================
let fechaVisualizada = new Date(); 

function generarCalendario() {
    const grid = document.getElementById("calendario-mensual-grid");
    const etiquetaMes = document.getElementById("mes-actual");
    const infoEvento = document.getElementById("info-evento");
    
    grid.innerHTML = ""; 

    const mes = fechaVisualizada.getMonth();
    const año = fechaVisualizada.getFullYear();
    const hoy = new Date(); 

    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    etiquetaMes.innerText = `${meses[mes]} ${año}`;

    const primerDiaSemana = new Date(año, mes, 1).getDay();
    const ultimoDiaMes = new Date(año, mes + 1, 0).getDate();

    let contadorDomingos = 0;

    for (let i = 0; i < primerDiaSemana; i++) {
        const vacio = document.createElement("div");
        grid.appendChild(vacio);
    }

    for (let dia = 1; dia <= ultimoDiaMes; dia++) {
        const elementoDia = document.createElement("div");
        const fechaIterada = new Date(año, mes, dia);
        const diaSemana = fechaIterada.getDay(); 
        
        elementoDia.innerText = dia;
        elementoDia.style.padding = "8px 0";
        elementoDia.style.cursor = "pointer";
        elementoDia.style.borderRadius = "8px";
        elementoDia.style.color = "#e2e8f0";
        elementoDia.style.background = "rgba(255,255,255,0.05)";
        elementoDia.style.fontSize = "0.9rem";
        elementoDia.style.transition = "all 0.3s";
        elementoDia.style.position = "relative";

        // --- LÓGICA DE EVENTOS (Múltiples colores) ---
        let eventosDelDia = [];
        let coloresPuntos = [];

        if (diaSemana === 0) { // DOMINGOS
            contadorDomingos++;
            eventosDelDia.push("11:30hs: Reunión General");
            coloresPuntos.push("#38bdf8"); // Azul
            if (contadorDomingos === 1 || contadorDomingos === 3) {
                eventosDelDia.unshift("10:00hs: Cena del Señor");
                coloresPuntos.push("#ff4444"); // Rojo
            }
        } else if (diaSemana === 5) { // VIERNES
            eventosDelDia.push("21:30hs: Reunión de Oración");
            coloresPuntos.push("#fbbf24"); // Amarillo
        } else if (diaSemana === 6) { // SÁBADOS
            eventosDelDia.push("14:00hs: Club Bíblico");
            coloresPuntos.push("#8ce605"); // Verde
            // Evento especial Abril 2026
            if (mes === 3 && año === 2026 && dia === 25) {
                eventosDelDia.push("10:00hs: Reunión Femenina");
                coloresPuntos.push("#fbbf24"); 
            }
        }

        if (coloresPuntos.length > 0) {
            const contenedorPuntos = document.createElement("div");
            contenedorPuntos.style = "display: flex; gap: 2px; justify-content: center; position: absolute; bottom: 3px; width: 100%;";
            
            coloresPuntos.forEach(col => {
                const punto = document.createElement("div");
                punto.style = `width: 5px; height: 5px; background: ${col}; border-radius: 50%;`;
                contenedorPuntos.appendChild(punto);
            });
            elementoDia.appendChild(contenedorPuntos);
        }

        // --- MARCAR DÍA DE HOY ---
        if (dia === hoy.getDate() && mes === hoy.getMonth() && año === hoy.getFullYear()) {
            elementoDia.style.border = "2px solid #8ce605";
            elementoDia.style.fontWeight = "bold";
            elementoDia.style.background = "rgba(140, 230, 5, 0.1)";
        }

        elementoDia.onmouseover = () => elementoDia.style.background = "rgba(140, 230, 5, 0.3)";
        elementoDia.onmouseout = () => {
            if (dia === hoy.getDate() && mes === hoy.getMonth() && año === hoy.getFullYear()) {
                elementoDia.style.background = "rgba(140, 230, 5, 0.1)";
            } else {
                elementoDia.style.background = "rgba(255,255,255,0.05)";
            }
        };
        
        elementoDia.onclick = () => {
            if (eventosDelDia.length > 0) {
                infoEvento.innerHTML = `<strong>Día ${dia} de ${meses[mes]}:</strong><br>` + eventosDelDia.join("<br>");
                infoEvento.style.borderLeftColor = coloresPuntos[0] || "#8ce605";
            } else {
                infoEvento.innerText = `Día ${dia} de ${meses[mes]}: No hay eventos registrados.`;
                infoEvento.style.borderLeftColor = "#8ce605";
            }
        };

        grid.appendChild(elementoDia);
    }

    // --- NUEVO: OCULTAR CUADRO DE PRÓXIMOS EVENTOS SI YA PASÓ LA FECHA ---
    const cuadroAlerta = document.getElementById("cuadro-proximos");
    if (cuadroAlerta) {
        const hoySinHora = new Date();
        hoySinHora.setHours(0, 0, 0, 0); // Solo comparamos días
        const fechaLimite = new Date(2026, 3, 25); // 25 de Abril

        if (hoySinHora > fechaLimite) {
            cuadroAlerta.style.display = "none";
        } else {
            cuadroAlerta.style.display = "block";
        }
    }
} // Fin de generarCalendario

function cambiarMes(direccion) {
    fechaVisualizada.setMonth(fechaVisualizada.getMonth() + direccion);
    generarCalendario();
}

document.addEventListener("DOMContentLoaded", generarCalendario);




// ========================================================
//  CALENDARIO DE PAGINA REUNION DE JOVENES +18 (INTERACTIVO)
// ========================================================

let fechaZona = new Date(); // Para controlar el mes en la sección de Jóvenes +18
let zonaActiva = "";

function seleccionarZona(nombreZona) {
    zonaActiva = nombreZona;
    navegarA('zona-detalle');
    document.getElementById('titulo-zona-actual').innerText = "ZONA " + nombreZona.toUpperCase();
    
    generarCalendarioZona();
    cargarListaIglesias(nombreZona);
}

function generarCalendarioZona() {
    const grid = document.getElementById("calendario-zona-grid");
    const etiquetaMes = document.getElementById("mes-actual-zona");
    const infoEvento = document.getElementById("info-evento-zona");
    
    grid.innerHTML = ""; 
    const mes = fechaZona.getMonth();
    const año = fechaZona.getFullYear();
    const hoy = new Date();

    const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    etiquetaMes.innerText = `${meses[mes]} ${año}`;

    const primerDia = new Date(año, mes, 1).getDay();
    const ultimoDia = new Date(año, mes + 1, 0).getDate();

    // Espacios vacíos
    for (let i = 0; i < primerDia; i++) {
        grid.appendChild(document.createElement("div"));
    }

    // Días del mes
    for (let dia = 1; dia <= ultimoDia; dia++) {
        const elementoDia = document.createElement("div");
        elementoDia.innerText = dia;
        elementoDia.className = "dia-calendario"; // Asegúrate de tener estilos para esto o usa los del anterior
        
        // Estilos base (Igual al de Iglesia)
        Object.assign(elementoDia.style, {
            padding: "12px 0", cursor: "pointer", borderRadius: "8px", color: "#e2e8f0",
            background: "rgba(255,255,255,0.05)", fontSize: "1rem", transition: "0.3s", position: "relative"
        });

        // --- BUSCAR EVENTOS DE IGLESIAS EN ESTA ZONA ---
        let eventosDelDia = [];
        let puntosColores = [];

        if (datosZonas[zonaActiva]) {
            datosZonas[zonaActiva].iglesias.forEach(iglesia => {
                iglesia.reuniones.forEach(reunion => {
                    if (reunion.dia === dia) {
                        eventosDelDia.push(`<span style="color:${iglesia.color}">●</span> <strong>${iglesia.nombre}:</strong> ${reunion.tipo} (${reunion.hora}hs)`);
                        puntosColores.push(iglesia.color);
                    }
                });
            });
        }

        // Dibujar puntitos si hay reuniones
        if (puntosColores.length > 0) {
            const contPuntos = document.createElement("div");
            contPuntos.style = "display: flex; gap: 3px; justify-content: center; position: absolute; bottom: 5px; width: 100%;";
            puntosColores.forEach(col => {
                const p = document.createElement("div");
                p.style = `width: 6px; height: 6px; background: ${col}; border-radius: 50%;`;
                contPuntos.appendChild(p);
            });
            elementoDia.appendChild(contPuntos);
        }

        // Click para ver detalle
        elementoDia.onclick = () => {
            if (eventosDelDia.length > 0) {
                infoEvento.innerHTML = `<strong>Reuniones del día ${dia}:</strong><br>` + eventosDelDia.join("<br>");
            } else {
                infoEvento.innerText = "No hay reuniones programadas para este día.";
            }
        };

        grid.appendChild(elementoDia);
    }
}

function cambiarMesZona(dir) {
    fechaZona.setMonth(fechaZona.getMonth() + dir);
    generarCalendarioZona();
}

function cargarListaIglesias(nombreZona) {
    const lista = document.getElementById('lista-iglesias-zona');
    lista.innerHTML = ""; 
    if(datosZonas[nombreZona]) {
        datosZonas[nombreZona].iglesias.forEach(iglesia => {
            lista.innerHTML += `
                <div class="card-acceso" style="border-left: 6px solid ${iglesia.color}; text-align: left; padding: 20px; width: 100%; margin-bottom: 15px;">
                    <h3 style="margin: 0; color: white;">${iglesia.nombre}</h3>
                    <p style="margin: 5px 0; color: #ccc;">📍 ${iglesia.direccion}</p>
                    <small style="color: ${iglesia.color}">Días de reunión: ${iglesia.reuniones.map(r => r.dia).join(", ")}</small>
                </div>
            `;
        });
    }
}