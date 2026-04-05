// LÓGICA DEL SORTEO DE VIERNES
function iniciarSorteo() {
    const display = document.getElementById('display-sorteo');
    let giros = 0;
    
    const intervalo = setInterval(() => {
        let numAzar = Math.floor(1000 + Math.random() * 9000);
        display.innerText = numAzar;
        giros++;
        
        if (giros > 30) {
            clearInterval(intervalo);
            const ganadorFinal = Math.floor(1000 + Math.random() * 9000);
            display.innerText = ganadorFinal;
            display.classList.add('ganador-anim');
            registrarGanador(ganadorFinal);
        }
    }, 50);
}

function registrarGanador(num) {
    const lista = document.getElementById('historial-sorteo');
    const nuevo = document.createElement('li');
    nuevo.innerText = `Bono Ganador: #${num} - ${new Date().toLocaleTimeString()}`;
    lista.prepend(nuevo);
    
    // Aquí podrías mandarlo a Supabase para que se vea en la TV del local
}

