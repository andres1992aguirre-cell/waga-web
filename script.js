/******************************
 * 🎨 TEMA (Modo oscuro)
 ******************************/
function cambiarTema() {
    document.body.classList.toggle('dark-mode');
}


/******************************
 * 🔐 LOGIN (Validación básica)
 ******************************/

// Esta función es la que te faltaba y por eso daba error
function abrirLogin() {
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

/***********************************************************
 * 🛡️ CONTROL DE ACCESO (SALTO A NUEVA PÁGINA)
 ***********************************************************/
function validarAcceso() {
    const dniInput = document.getElementById('login-dni').value.trim();
    const passInput = document.getElementById('login-pass').value.trim();
    
    if (dniInput === "36787384" && passInput === "marcospaz") {
        
        // 1. Cerramos el login
        document.getElementById('modal-login').style.display = 'none';

        // 2. OCULTAMOS TODA LA PÁGINA ANTERIOR
        // (Buscamos los contenedores principales de tu web y los apagamos)
        document.querySelector('nav').style.display = 'none'; 
        const seccionHome = document.getElementById('seccion-home');
        const seccionIglesia = document.getElementById('seccion-iglesia');
        if(seccionHome) seccionHome.style.display = 'none';
        if(seccionIglesia) seccionIglesia.style.display = 'none';

        // 3. MOSTRAMOS LA "PÁGINA APARTE"
        const panelNuevo = document.getElementById('pagina-panel-control');
        panelNuevo.style.display = 'block';

        // 4. DIBUJAMOS EL PANEL LIMPIO (Título, Totales, Tabla y Calendario Nuevo)
        panelNuevo.innerHTML = `
            <div style="max-width: 1000px; margin: 0 auto; color: white; font-family: sans-serif;">
                <header style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #334155; padding-bottom: 10px;">
                    <h2>Panel de Control: Alabanza y Multimedia</h2>
                    <button class="btn-nav" onclick="location.reload()" style="background: #ef4444;">Cerrar Sesión</button>
                </header>

                <div class="totales-grid" style="display: flex; gap: 20px; margin-top: 30px; flex-wrap: wrap;">
                    <div class="card-total" style="background: #1e293b; padding: 20px; border-radius: 12px; flex: 1; border-bottom: 4px solid #22c55e;">
                        <h3>Total Social Anual</h3>
                        <span id="txt-total-social" style="font-size: 2rem; font-weight: bold;">$ 0</span>
                    </div>
                    <div class="card-total" style="background: #1e293b; padding: 20px; border-radius: 12px; flex: 1; border-bottom: 4px solid #38bdf8;">
                        <h3>Total Fondo Anual</h3>
                        <span id="txt-total-fondo" style="font-size: 2rem; font-weight: bold;">$ 0</span>
                    </div>
                </div>

                <div class="tabla-container" style="background: #1e293b; margin-top: 30px; border-radius: 12px; padding: 20px; overflow-x: auto;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr style="text-align: left; border-bottom: 2px solid #38bdf8;">
                                <th style="padding: 10px;">Miembro</th>
                                <th>Asistencia %</th>
                                <th>Lectura</th>
                                <th>Social</th>
                                <th>Fondo</th>
                            </tr>
                        </thead>
                        <tbody id="lista-asistencia-anual"></tbody>
                    </table>
                </div>

                <div id="calendario-ministerio-nuevo" style="margin-top: 40px; background: #fff; color: #000; padding: 20px; border-radius: 12px;">
                    <h3 style="text-align: center;">Calendario de Actividades y Cumpleaños</h3>
                    <div id="grid-calendario-nuevo" style="display: grid; grid-template-columns: repeat(7, 1fr); gap: 5px; text-align: center;">
                        </div>
                </div>
            </div>
        `;

        renderizarTabla(); // Esto carga a los 15 miembros (ahora los agregamos todos)
        alert("¡Bienvenido al Panel de Gestión, Andy!");
        
    } else {
        alert("DNI o clave incorrecta");
    }
}

// *********************************************************
// * 🧠 LÓGICA DE MIEMBROS Y CÁLCULOS ANUALES
// *********************************************************

const miembrosData = [
    { nombre: "Benja", asistencia: "A", lectura: 0, social: 3000, fondo: 7000 },
    { nombre: "Pipo", asistencia: "T", lectura: 4, social: 2000, fondo: 5000 },
    { nombre: "Eze", asistencia: "A", lectura: 6, social: 1500, fondo: 1500 },
    { nombre: "Esteban", asistencia: "A", lectura: 0, social: 0, fondo: 0 },
    { nombre: "Joa", asistencia: "A", lectura: 6, social: 1500, fondo: 1500 },
    { nombre: "Ingrid", asistencia: "A", lectura: 6, social: 1000, fondo: 5000 },
    { nombre: "Lucas", asistencia: "A", lectura: 6, social: 2000, fondo: 5000 },
    { nombre: "Wally", asistencia: "T", lectura: 5, social: 4000, fondo: 5000 },
    { nombre: "Rocio", asistencia: "A", lectura: 6, social: 4000, fondo: 2000 },
    { nombre: "Andy", asistencia: "T", lectura: 4, social: 2000, fondo: 12000 },
    { nombre: "Franco", asistencia: "T", lectura: 0, social: 2200, fondo: 5000 }
    // Agregá aquí los que faltan siguiendo este mismo formato
];

function renderizarTabla() {
    const tabla = document.getElementById('lista-asistencia-anual');
    let totalSocial = 0;
    let totalFondo = 0;

    tabla.innerHTML = ""; // Limpiamos

    miembrosData.forEach(p => {
        totalSocial += p.social;
        totalFondo += p.fondo;

        // Cálculo rápido de % (luego lo haremos con base de datos real)
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

    // Actualizamos los cuadritos de arriba
    document.getElementById('txt-total-social').innerText = `$ ${totalSocial}`;
    document.getElementById('txt-total-fondo').innerText = `$ ${totalFondo}`;
}

/******************************
 * 🚀 NAVEGACIÓN (SPA)
 ******************************/
function navegarA(destino) {
    // 1. Escondemos todas las secciones primero
    const home = document.getElementById('seccion-home');
    const iglesia = document.getElementById('seccion-iglesia');

    if (home) home.style.display = 'none';
    if (iglesia) iglesia.style.display = 'none';

    // 2. Mostramos solo la sección a la que queremos ir
    if (destino === 'home') {
        if (home) home.style.display = 'block';
    } else if (destino === 'iglesia') {
        if (iglesia) {
            iglesia.style.display = 'block';
            // 3. Activamos los calendarios automáticamente al entrar
            iniciarCalendarios(); 
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