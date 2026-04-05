// CONFIGURACIÓN SUPABASE - TECNOENTRETE
const supabaseUrl = 'https://yuatovvzkhnakadwuixn.supabase.co';
const supabaseKey = 'sb_publishable_ueOVnJKbnGLPm6V3tTCEKQ_H_C63V7W';
const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// 🔑 TUS CREDENCIALES DE ACCESO (Cámbialas aquí si quieres)
const USER_ADMIN = "FELIPE";
const PASS_ADMIN = "1234"; // Esta es tu clave actual

// --- FUNCIÓN DE INGRESO ---
function validarIngreso() {
    const user = document.getElementById('user-admin').value.toUpperCase();
    const pass = document.getElementById('pass-admin').value;

    if (user === USER_ADMIN && pass === PASS_ADMIN) {
        document.getElementById('login-screen').classList.add('hidden');
        document.getElementById('main-panel').classList.remove('hidden');
        cargarDatosIniciales();
    } else {
        alert("❌ ACCESO DENEGADO: Usuario o Clave incorrectos");
    }
}

// --- NAVEGACIÓN ENTRE SECCIONES ---
function mostrarSeccion(id) {
    // Ocultar todas las secciones
    document.querySelectorAll('.content-sec').forEach(sec => sec.classList.add('hidden'));
    // Mostrar la elegida
    document.getElementById(`sec-${id}`).classList.remove('hidden');
}

// --- FUNCIONES DE CONTABILIDAD ---
async function subirContabilidad() {
    const maquina = document.getElementById('select-maquina-foto').value;
    const entrada = document.getElementById('valor-entrada').value;
    const salida = document.getElementById('valor-salida').value;
    const foto = document.getElementById('foto-maquina').files[0];

    if (!entrada || !salida) return alert("Ingresa las lecturas de los contadores");

    // Guardar en Supabase
    const { error } = await _supabase.from('contabilidad').insert([{
        maquina_id: maquina,
        lectura_entrada: parseInt(entrada),
        lectura_salida: parseInt(salida),
        fecha: new Date().toISOString()
    }]);

    if (!error) {
        alert("✅ Contabilidad de Máquina " + maquina + " guardada.");
        location.reload();
    } else {
        alert("Error al guardar: " + error.message);
    }
}

// --- REGISTRO DE BALES/GASTOS ---
async function registrarVale() {
    const monto = document.getElementById('val-vale').value;
    const desc = document.getElementById('nom-vale').value;

    if(!monto || !desc) return alert("Completa los datos del vale");

    await _supabase.from('movimientos').insert([{ 
        tipo: 'GASTO', 
        monto: -parseInt(monto), 
        descripcion: `VALE: ${desc}` 
    }]);

    alert("✅ Vale registrado correctamente");
    mostrarSeccion('contabilidad'); // Volver al inicio
}

// --- CERRAR SESIÓN ---
function cerrarSesion() {
    location.reload();
}

async function cargarDatosIniciales() {
    // Aquí puedes meter la lógica para cargar las 17 máquinas en el select
    console.log("Sistema TECNOENTRETE listo.");
}
