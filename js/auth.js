/* ================================================
   auth.js — Comunicación con el servidor Python
   
   Antes el login era "falso" (solo comparaba en el navegador).
   Ahora TODAS las páginas usan este archivo para hablar
   con el servidor Flask real.
   ================================================ */


// URL del servidor. Cuando subas a internet, cambiás esto por tu dominio.
if (typeof window.API_URL === 'undefined') {
  window.API_URL = 'https://waga-98d6.onrender.com/api';
}
const API_URL = window.API_URL;


/* ================================================
   FUNCIÓN PRINCIPAL DE LOGIN
   La llaman todas las páginas cuando aprietan "Ingresar"
   ================================================ */
async function loginConServidor(dni, contraseña, callbackExito, callbackError) {
    try {
        const respuesta = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',   // Importante: incluye la cookie de sesión
            body: JSON.stringify({ dni, contraseña })
        });

        const data = await respuesta.json();

        if (data.ok) {
            // Guardamos los datos del usuario en sessionStorage
            // (dura hasta que se cierra el navegador)
            sessionStorage.setItem('usuario', JSON.stringify(data.datos));
            if (callbackExito) callbackExito(data.datos);
        } else {
            if (callbackError) callbackError(data.error);
            else alert(data.error);
        }
    } catch (e) {
        const msg = 'No se pudo conectar con el servidor. ¿Está corriendo Python?';
        if (callbackError) callbackError(msg);
        else alert(msg);
    }
}

/* ================================================
   LOGOUT — Cierra sesión en servidor y navegador
   ================================================ */
async function logoutConServidor() {
    await fetch(`${API_URL}/logout`, {
        method: 'POST',
        credentials: 'include'
    });
    sessionStorage.removeItem('usuario');
    window.location.reload();
}

/* ================================================
   OBTENER USUARIO ACTUAL
   Devuelve el usuario guardado o null si no hay sesión
   ================================================ */
function getUsuarioActual() {
    const u = sessionStorage.getItem('usuario');
    return u ? JSON.parse(u) : null;
}

/* ================================================
   CARGAR CONTENIDO EDITABLE
   Llama al servidor y llena los textos de la página
   ================================================ */
async function cargarContenido(mapeo) {
    /*
     mapeo = { 'clave_servidor': 'id_del_elemento_html' }
     Ej: { 'versiculo_home': 'texto-versiculo', 'proposito_home': 'texto-proposito' }
    */
    try {
        const resp = await fetch(`${API_URL}/contenido`);
        const data = await resp.json();
        if (!data.ok) return;

        Object.entries(mapeo).forEach(([clave, elementoId]) => {
            const el = document.getElementById(elementoId);
            if (el && data.datos[clave]) el.textContent = data.datos[clave];
        });
    } catch (e) {
        console.warn('No se pudo cargar el contenido del servidor:', e);
    }
}

/* ================================================
   GUARDAR CONTENIDO EDITABLE
   ================================================ */
async function guardarContenido(clave, valor) {
    try {
        const resp = await fetch(`${API_URL}/contenido/${clave}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ valor })
        });
        // Flask usa PUT, así que corregimos:
        const resp2 = await fetch(`${API_URL}/contenido/${clave}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ valor })
        });
        const data = await resp2.json();
        return data.ok;
    } catch (e) {
        console.error('Error guardando contenido:', e);
        return false;
    }
}

/* ================================================
   LLAMADA GENÉRICA AL SERVIDOR
   Para no repetir el mismo código de fetch en cada página
   ================================================ */
async function llamarAPI(endpoint, metodo = 'GET', cuerpo = null) {
    const opciones = {
        method: metodo,
        headers: {}
    };
    // Enviamos el DNI del usuario en cada llamada para identificarlo
    const u = getUsuarioActual();
    if (u) opciones.headers['X-Usuario-DNI'] = u.dni;

    if (cuerpo) {
        opciones.headers['Content-Type'] = 'application/json';
        opciones.body = JSON.stringify(cuerpo);
    }
    const resp = await fetch(`${API_URL}${endpoint}`, opciones);
    return await resp.json();
}

/* ================================================
   FIN DE auth.js
   ============================================== */

