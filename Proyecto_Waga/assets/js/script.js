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

    🛡️ CONTROL DE ACCESO (SALTO A NUEVA PÁGINA)
    ***********************************************************/
    function validarAcceso() {
    const dniInput = document.getElementById('login-dni').value.trim();
    const passInput = document.getElementById('login-pass').value.trim();

    // CASO ANDY / MULTIMEDIA
    if (dniInput === "36787384" && passInput === "marcospaz") {
    cerrarLogin();

     // Ocultamos el resto de la web
     document.querySelector('.navbar').style.display = 'none';
     document.querySelector('.main-container').style.display = 'none';
     document.querySelector('.donacion-fija').style.display = 'none';

     // Mostramos el panel de control
     const panel = document.getElementById('pagina-panel-control');
     panel.style.display = 'block';

     // ========================================================
     // 🚀 INICIALIZACIÓN DE COMPONENTES DEL PANEL
     // ========================================================

     // 1. Ejecutamos el renderizado de la tabla de control anual
     renderizarTablaMultimedia(); 

     // 2. Ejecutamos el renderizado del calendario privado de Alabanza
     renderizarCalendarioMinisterio(); 

     // ========================================================

     alert("¡Bienvenido al Control Anual, Andy!");

    } else {
    // Aquí podrías poner otros accesos para usuarios comunes
    document.getElementById('login-error').style.display = 'block';
    }
    }

// *********************************************************
// * 🧠 LÓGICA DE MIEMBROS Y CÁLCULOS ANUALES
// *********************************************************

// 1. PRIMERO DEFINIMOS LOS DATOS (Siempre arriba de todo en el archivo)
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
];

// 2. DESPUÉS LAS FUNCIONES
function renderizarTabla() {
    const tabla = document.getElementById('lista-asistencia-anual');
    
    // Si la tabla no existe en el HTML actual (porque estamos en Home o Iglesia),
    // frenamos la función acá para que no de error.
    if (!tabla) return; 

    let totalSocial = 0;
    let totalFondo = 0;

    tabla.innerHTML = ""; 

    miembrosData.forEach(p => {
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