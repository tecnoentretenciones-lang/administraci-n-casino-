// CONEXIÓN MAESTRA TECNOENTRETODO V3
const supabaseUrl = 'https://yuatovvzkhnakadwuixn.supabase.co';
const supabaseKey = 'sb_publishable_ueOVnJKbnGLPm6V3tTCEKQ_H_C63V7W';

const _supabase = supabase.createClient(supabaseUrl, supabaseKey);

// REGLAS DE NEGOCIO (Multiplicadores)
const MULTIPLICADORES = {
    "9x1": 10,     // Faraón, etc.
    "5x1": 10,     // Caminator, etc.
    "Ruleta": 100, // Contadores mecánicos
    "Zoe": 1       // Vouchers
};

// MONTOS DE BONOS POR CATEGORÍA
const MONTOS_BONOS = {
    "NORMAL": 2000,
    "VIP": 3000,
    "SUPERESTRELLA": 4000
};

// 1. CARGAR LAS 17 MÁQUINAS DEL BAZAR
async function cargarPanelBazar() {
    const { data: maquinas, error } = await _supabase
        .from('maquinas')
        .select('*')
        .order('id_fisico', { ascending: true });

    if (error) {
        console.error("Error cargando máquinas:", error);
        return;
    }

    const grid = document.getElementById('grid-bazar');
    grid.innerHTML = ''; // Limpiar panel

    maquinas.forEach(m => {
        grid.innerHTML += `
            <div class="card-m" onclick="seleccionarMaquina(${m.id_fisico}, '${m.tipo_juego}')">
                <div class="num-m">${m.id_fisico}</div>
                <small>${m.nombre_juego}</small>
            </div>
        `;
    });
}

// 2. REGISTRAR GASTO (Bebidas, Aseo, Pasilleros)
async function registrarGasto() {
    const monto = document.getElementById('gasto-val').value;
    const desc = document.getElementById('gasto-nom').value;
    const cat = document.getElementById('gasto-cat').value;

    if(!monto || !desc) return alert("Llena todos los campos");

    const { error } = await _supabase
        .from('movimientos')
        .insert([{ 
            tipo: 'GASTO', 
            monto: parseInt(monto), 
            descripcion: `${cat}: ${desc}` 
        }]);

    if (!error) {
        alert("✅ Gasto registrado correctamente");
        location.reload();
    }
}

// 3. VALIDAR BONO QR (Reset diario automático)
async function validarBono() {
    const qrId = document.getElementById('qr-input').value;
    const pin = document.getElementById('pin-input').value;
    const hoy = new Date().toISOString().split('T')[0];

    const { data: cliente, error } = await _supabase
        .from('clientes_vip')
        .select('*')
        .eq('qr_id', qrId)
        .single();

    if (!cliente) return alert("❌ Cliente no encontrado");
    if (cliente.ultimo_bono === hoy) return alert("⚠️ Ya cobró su bono de hoy");
    
    if (cliente.pin === pin) {
        const montoBono = MONTOS_BONOS[cliente.nivel] || 2000;
        
        // Registrar el bono en la contabilidad
        await _supabase.from('movimientos').insert([{ 
            tipo: 'BONO', 
            monto: montoBono, 
            descripcion: `Bono ${cliente.nivel} a Cliente ${qrId}` 
        }]);

        // Actualizar fecha para que no cobre de nuevo hoy
        await _supabase.from('clientes_vip')
            .update({ ultimo_bono: hoy })
            .eq('qr_id', qrId);

        alert(`✅ AUTORIZADO: Entregar $${montoBono} (Nivel ${cliente.nivel})`);
    } else {
        alert("❌ PIN Incorrecto");
    }
}

window.onload = cargarPanelBazar;
