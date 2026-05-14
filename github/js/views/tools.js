export function renderTools() {
    const t = k => store.t(k);

    const UNIT_CATEGORIES = {
        length: {
            label: 'Length / Longueur / الطول',
            units: ['nm', 'um', 'mm', 'cm', 'dm', 'm', 'km', 'in', 'ft', 'yd', 'mi', 'li']
        },
        mass: {
            label: 'Mass / Masse / الكتلة',
            units: ['mg', 'g', 'kg', 't', 'lb', 'oz']
        },
        volume: {
            label: 'Volume / الحجم',
            units: ['ml', 'cl', 'dl', 'l', 'cm3', 'm3']
        },
        temperature: {
            label: 'Temperature / الحرارة',
            units: ['degC', 'degF', 'K']
        },
        energy: {
            label: 'Energy / Énergie / الطاقة',
            units: ['J', 'kJ', 'cal', 'kcal', 'Wh', 'kWh', 'eV']
        },
        pressure: {
            label: 'Pressure / Pression / الضغط',
            units: ['Pa', 'kPa', 'hPa', 'bar', 'atm', 'torr']
        },
        speed: {
            label: 'Speed / Vitesse / السرعة',
            units: ['m/s', 'km/h', 'mph', 'kn']
        },
        time: {
            label: 'Time / Temps / الزمن',
            units: ['ms', 's', 'min', 'h', 'day', 'week', 'month', 'year']
        }
    };

    const template = `
        <div style="animation:fadeIn 0.5s ease-out; max-width:1000px; margin:0 auto;">
            <h1 class="section-title">
                <i data-lucide="wrench" size="26" color="var(--primary)"></i>
                ${t('tools.title')}
            </h1>

            <div style="display:grid; grid-template-columns: 1fr 1.2fr; gap:30px; align-items: start;">
                <!-- Calculator -->
                <div class="glass-card" style="padding:30px; height: 100%;">
                    <div style="display:flex; align-items:center; gap:12px; margin-bottom:20px;">
                        <div style="width:40px; height:40px; border-radius:12px; background:rgba(59,130,246,0.1); display:flex; align-items:center; justify-content:center;">
                            <i data-lucide="calculator" size="20" color="var(--primary)"></i>
                        </div>
                        <h2 style="font-size:1.2rem; font-weight:800;">${t('tools.calculator')}</h2>
                    </div>
                    <p style="font-size:0.85rem; color:var(--text-muted); margin-bottom:20px;">${t('tools.calc_placeholder')}</p>
                    
                    <div style="margin-bottom:15px;">
                        <input type="text" id="math-input" placeholder="e.g. sqrt(25) + sin(pi/2)" 
                               style="width:100%; padding:15px; border-radius:12px; border:1.5px solid #e2e8f0; font-family:monospace; font-size:1.1rem; outline:none; box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);"
                               onkeyup="if(event.key==='Enter')window._solveMath()">
                    </div>
                    <button onclick="window._solveMath()" class="btn btn-primary" style="width:100%; padding:14px;">${t('tools.calculate')}</button>
                    
                    <div id="math-result" style="margin-top:20px; padding:20px; background:#f8fafc; border-radius:16px; min-height:80px; display:flex; flex-direction: column; align-items:center; justify-content:center; font-weight:800; color:var(--primary); font-size:1.5rem; border:2px dashed #e2e8f0; transition: all 0.3s;">
                        <span style="font-size: 0.8rem; color: #94a3b8; font-weight: 600; margin-bottom: 5px;">RESULT</span>
                        <div id="math-res-val">---</div>
                    </div>
                </div>

                <!-- Advanced Unit Converter -->
                <div class="glass-card" style="padding:30px; border-top: 4px solid #8b5cf6;">
                    <div style="display:flex; align-items:center; gap:12px; margin-bottom:25px;">
                        <div style="width:40px; height:40px; border-radius:12px; background:rgba(139,92,246,0.1); display:flex; align-items:center; justify-content:center;">
                            <i data-lucide="arrow-left-right" size="20" color="#8b5cf6"></i>
                        </div>
                        <h2 style="font-size:1.2rem; font-weight:800;">${t('tools.converter')}</h2>
                    </div>

                    <!-- Category Selector -->
                    <div style="margin-bottom: 20px;">
                        <label style="display:block; font-size:0.8rem; font-weight:800; color:#64748b; margin-bottom:8px; text-transform:uppercase;">Category</label>
                        <select id="unit-cat" onchange="window._updateUnitOptions()" style="width:100%; padding:12px; border-radius:12px; border:1.5px solid #e2e8f0; background:white; font-weight:700; cursor:pointer;">
                            ${Object.entries(UNIT_CATEGORIES).map(([id, cat]) => `<option value="${id}">${cat.label}</option>`).join('')}
                        </select>
                    </div>
                    
                    <div style="display:grid; grid-template-columns:1fr; gap:20px; margin-bottom:15px;">
                        <div>
                            <label style="display:block; font-size:0.8rem; font-weight:800; color:#64748b; margin-bottom:8px; text-transform:uppercase;">Value & From</label>
                            <div style="display:flex; gap:8px;">
                                <input type="number" id="unit-val" value="1" style="flex:1; padding:12px; border-radius:12px; border:1.5px solid #e2e8f0; font-weight:700;">
                                <select id="unit-from" style="width:100px; padding:12px; border-radius:12px; border:1.5px solid #e2e8f0; background:white; font-weight:700;"></select>
                            </div>
                        </div>

                        <div>
                            <label style="display:block; font-size:0.8rem; font-weight:800; color:#64748b; margin-bottom:8px; text-transform:uppercase;">Convert To</label>
                            <select id="unit-to" style="width:100%; padding:12px; border-radius:12px; border:1.5px solid #e2e8f0; background:white; font-weight:700;"></select>
                        </div>
                    </div>

                    <button onclick="window._convertUnit()" class="btn" style="width:100%; padding:14px; background: #8b5cf6; color:white; margin-top:10px;">${t('tools.convert')}</button>
                    
                    <div id="unit-result-box" style="margin-top:25px; padding:20px; background:#f5f3ff; border-radius:16px; min-height:100px; display:flex; flex-direction:column; align-items:center; justify-content:center; border:2px solid #ddd6fe; transition: all 0.3s;">
                        <span style="font-size: 0.8rem; color: #7c3aed; font-weight: 800; margin-bottom: 8px; letter-spacing: 1px;">CONVERSION</span>
                        <div id="unit-res-val" style="font-weight:900; color:#6d28d9; font-size:1.6rem; text-align:center;">---</div>
                    </div>
                </div>
            </div>
        </div>
    `;

    return {
        template,
        init: () => {
            if (window.lucide) window.lucide.createIcons();

            window._updateUnitOptions = () => {
                const catId = document.getElementById('unit-cat').value;
                const units = UNIT_CATEGORIES[catId].units;
                const fromSelect = document.getElementById('unit-from');
                const toSelect = document.getElementById('unit-to');
                
                const options = units.map(u => `<option value="${u}">${u}</option>`).join('');
                fromSelect.innerHTML = options;
                toSelect.innerHTML = options;
                
                // Set defaults
                if (units.length > 1) {
                    toSelect.selectedIndex = 1;
                }
            };

            window._solveMath = () => {
                const input = document.getElementById('math-input').value;
                const resValEl = document.getElementById('math-res-val');
                const resultEl = document.getElementById('math-result');
                if (!input) return;
                
                try {
                    const res = window.math.evaluate(input);
                    resValEl.textContent = typeof res === 'number' ? res.toLocaleString(undefined, {maximumFractionDigits: 6}) : res.toString();
                    resultEl.style.borderColor = 'var(--primary)';
                    resValEl.style.color = 'var(--primary)';
                } catch (err) {
                    resValEl.textContent = 'Error';
                    resultEl.style.borderColor = '#ef4444';
                    resValEl.style.color = '#ef4444';
                }
            };

            window._convertUnit = () => {
                const val = parseFloat(document.getElementById('unit-val').value);
                const from = document.getElementById('unit-from').value;
                const to = document.getElementById('unit-to').value;
                const resValEl = document.getElementById('unit-res-val');
                
                if (isNaN(val)) return;

                try {
                    const res = window.math.unit(val, from).to(to);
                    // Format output nicely
                    const num = res.toNumber(to);
                    const formatted = num.toLocaleString(undefined, {maximumFractionDigits: 6});
                    resValEl.textContent = `${formatted} ${to}`;
                } catch (err) {
                    console.error(err);
                    resValEl.textContent = 'Invalid Unit';
                }
            };

            // Initial options load
            window._updateUnitOptions();
        }
    };
}

