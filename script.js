document.addEventListener('DOMContentLoaded', () => {
    
    // --- NAVEGACIÓN ---
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navItems.forEach(n => n.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            item.classList.add('active');
            const target = item.getAttribute('data-target');
            document.getElementById(target).classList.add('active');
            
            if (target === 'exportar') {
                generarResumen();
            }
        });
    });

    // --- CÁLCULOS ---
    const inputs = ['tickets_mensuales', 'consultas_por_ticket', 'tokens_entrada', 'tokens_salida', 'tiempo_actual', 'tiempo_esperado', 'coste_hora'];
    
    inputs.forEach(id => {
        document.getElementById(id).addEventListener('input', calcular);
    });

    function calcular() {
        const tickets = parseFloat(document.getElementById('tickets_mensuales').value) || 0;
        const consultas = parseFloat(document.getElementById('consultas_por_ticket').value) || 0;
        const tIn = parseFloat(document.getElementById('tokens_entrada').value) || 0;
        const tOut = parseFloat(document.getElementById('tokens_salida').value) || 0;
        const minActual = parseFloat(document.getElementById('tiempo_actual').value) || 0;
        const minEsperado = parseFloat(document.getElementById('tiempo_esperado').value) || 0;
        const costeH = parseFloat(document.getElementById('coste_hora').value) || 0;

        const totalConsultas = tickets * consultas;
        const totalTokens = totalConsultas * (tIn + tOut);
        const ahorroMinPorTicket = minActual - minEsperado;
        const totalAhorroHoras = (ahorroMinPorTicket * tickets) / 60;
        const ahorroEconomico = totalAhorroHoras * costeH;

        document.getElementById('res_total_consultas').innerText = totalConsultas.toLocaleString();
        document.getElementById('res_total_tokens').innerText = (totalTokens / 1000000).toFixed(2) + 'M';
        document.getElementById('res_ahorro_horas').innerText = totalAhorroHoras.toFixed(0) + 'h';
        document.getElementById('res_ahorro_economico').innerText = ahorroEconomico.toLocaleString(undefined, {style: 'currency', currency: 'EUR'});
    }

    // --- MATRIZ ---
    const criterios = [
        "Coste Inicial", "Coste al Escalar", "Facilidad Implantación", 
        "Protección Datos", "Trazabilidad", "Latencia", 
        "Dependencia Proveedor", "Control Técnico"
    ];
    const tbody = document.getElementById('matriz-body');
    
    criterios.forEach(c => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${c}</td>
            <td><input type="text" class="matriz-input" data-crit="${c}" data-opt="A" placeholder="Valora Opción A"></td>
            <td><input type="text" class="matriz-input" data-crit="${c}" data-opt="B" placeholder="Valora Opción B"></td>
        `;
        tbody.appendChild(tr);
    });

    // --- RAID ---
    const raidContainer = document.getElementById('raid-container');
    function addRaidRow() {
        const div = document.createElement('div');
        div.className = 'grid-inputs card';
        div.style.marginBottom = '1rem';
        div.innerHTML = `
            <div class="input-group">
                <label>Tipo</label>
                <select class="raid-tipo">
                    <option>Riesgo</option>
                    <option>Supuesto</option>
                    <option>Incidencia</option>
                    <option>Dependencia</option>
                </select>
            </div>
            <div class="input-group" style="grid-column: span 2;">
                <label>Descripción</label>
                <input type="text" class="raid-desc">
            </div>
            <div class="input-group">
                <label>Impacto</label>
                <select class="raid-impacto">
                    <option>Alto</option>
                    <option>Medio</option>
                    <option>Bajo</option>
                </select>
            </div>
            <div class="input-group" style="grid-column: span 2;">
                <label>Acción Propuesta</label>
                <input type="text" class="raid-accion">
            </div>
        `;
        raidContainer.appendChild(div);
    }
    document.getElementById('add-raid').addEventListener('click', addRaidRow);
    addRaidRow(); // Una por defecto

    // --- EXPORTACIÓN ---
    function generarResumen() {
        const tickets = document.getElementById('tickets_mensuales').value;
        const ahorroEcon = document.getElementById('res_ahorro_economico').innerText;
        const tokens = document.getElementById('res_total_tokens').innerText;
        const decision = document.getElementById('select-alternativa').value;
        const argumento = document.getElementById('argumento-final').value;

        let matrizText = "";
        document.querySelectorAll('.matriz-input').forEach(i => {
            if(i.value) matrizText += `- ${i.getAttribute('data-crit')} (${i.getAttribute('data-opt')}): ${i.value}\n`;
        });

        let raidText = "";
        document.querySelectorAll('.raid-desc').forEach((el, idx) => {
            const tipo = document.querySelectorAll('.raid-tipo')[idx].value;
            const accion = document.querySelectorAll('.raid-accion')[idx].value;
            if(el.value) raidText += `- [${tipo}] ${el.value} -> Acción: ${accion}\n`;
        });

        const resumen = `--- RESUMEN DIAGNÓSTICO IA ---
1. DATOS OPERATIVOS
- Tickets Mensuales: ${tickets}
- Tokens Totales: ${tokens}
- Ahorro Humano Bruto Estimado: ${ahorroEcon}

2. MATRIZ COMPARATIVA (Puntos clave)
${matrizText || "No completada"}

3. MINI-RAID (Resumen)
${raidText || "No completado"}

4. DECISIÓN FINAL
- Opción elegida: ${decision === 'A' ? 'API Externa' : 'Plataforma Cloud Gestionada'}
- Justificación: ${argumento || "No redactada"}
------------------------------`;
        
        document.getElementById('resumen-final').value = resumen;
    }

    document.getElementById('btn-copy').addEventListener('click', () => {
        const copyText = document.getElementById('resumen-final');
        copyText.select();
        document.execCommand('copy');
        alert('Copiado al portapapeles');
    });

    // Inicio
    calcular();
});
