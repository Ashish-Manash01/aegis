/*
   AegisFlow AI | Resilient Supply Chain & Smart Manufacturing Suite
   Production-Ready Application Logic - ET AutoTech Hackathon 2026
*/

document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       1. Core Application State & Navigation
       ========================================================================== */
    const state = {
        activeTab: 'supply-chain',
        mapThreats: {
            taiwan: false,
            suez: false,
            tariff: false
        },
        selectedMaterial: 'neodymium',
        subRatio: 0,
        weldSimulation: {
            activeDefect: null, // null, 'porosity', 'crack', 'misalign'
            laserY: 0,
            sparkParticles: [],
            spcPoints: [60, 65, 55, 70, 52, 61, 58, 64, 53, 60, 59],
            cp: 1.54,
            cpk: 1.48,
            defectRate: 0.02
        },
        selectedSupplier: 'Ningbo Sourcing',
        adasWeather: 'clear'
    };

    // Tab Navigation Switcher
    const navItems = document.querySelectorAll('.nav-item');
    const viewports = document.querySelectorAll('.viewport-tab');
    const pageTitle = document.getElementById('page-title');
    const pageSubtitle = document.getElementById('page-subtitle');

    const tabMeta = {
        'supply-chain': {
            title: 'Supply Chain Resilience Mapping',
            subtitle: 'Proactive risk detection, geopolitical hedging & alternate sourcing simulation'
        },
        'substitution': {
            title: 'Substitut-AI Sourcing & Technology Formulation',
            subtitle: 'Real-time performance trade-off modeling and critical raw material substitution'
        },
        'smart-shopfloor': {
            title: 'VisionDetect-AI Smart Manufacturing',
            subtitle: 'Edge computer vision welder defect inspection, Cp/Cpk analytics & operator guidance'
        },
        'supplier-analytics': {
            title: 'Supplier Risk & Sustainability Analytics',
            subtitle: 'Interactive multi-factor optimization mapping Geopolitical Risk against Sourcing Lead Times'
        },
        'action-extractor': {
            title: 'ActionExtract-AI Shopfloor Parser',
            subtitle: 'AI-driven natural language extraction of shopfloor transcripts into ERP sourcing reorders'
        },
        'adas-simulator': {
            title: 'ADAS-Adopt-AI Indian Context Simulator',
            subtitle: 'Evaluating and adapting Advanced Driver Assistance Systems for Indian road conditions and driving behavior'
        },
        'material-passport': {
            title: 'Passport-AI: Battery Digital Material Passport',
            subtitle: 'Blockchain-based Scope 3 material provenance, recyclability audits & battery second-life grading'
        }
    };

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetTab = item.getAttribute('data-tab');
            
            navItems.forEach(nav => nav.classList.remove('active'));
            viewports.forEach(view => view.classList.remove('active'));
            
            item.classList.add('active');
            const targetViewport = document.getElementById(`tab-${targetTab}`);
            if (targetViewport) targetViewport.classList.add('active');
            
            if (tabMeta[targetTab]) {
                pageTitle.textContent = tabMeta[targetTab].title;
                pageSubtitle.textContent = tabMeta[targetTab].subtitle;
            }

            state.activeTab = targetTab;

            if (targetTab === 'smart-shopfloor') {
                initWeldSimulation();
            }
            if (targetTab === 'adas-simulator') {
                initAdasSimulation();
            }
            if (targetTab === 'material-passport') {
                initMaterialPassportScan();
            }
        });
    });


    /* ==========================================================================
       2. Module 1: AltRoute-AI Supply Chain Map (Dijkstra Router)
       ========================================================================== */
    const triggerTaiwanBtn = document.getElementById('trigger-taiwan');
    const triggerSuezBtn = document.getElementById('trigger-suez');
    const triggerTariffBtn = document.getElementById('trigger-tariff');
    const resetMapBtn = document.getElementById('reset-map');
    const actionMitigateBtn = document.getElementById('action-mitigate');
    const globalRiskBadge = document.getElementById('global-risk-badge');
    
    // Map SVG Elements
    const nodeChina = document.getElementById('node-china');
    const nodeChile = document.getElementById('node-chile');
    const nodeDomestic = document.getElementById('node-domestic');
    const nodeDomesticTxt = document.getElementById('node-domestic-txt');
    const straitTaiwan = document.getElementById('strait-taiwan');
    const straitSuez = document.getElementById('strait-suez');
    const routePrimary = document.getElementById('route-primary');
    const routeAlt1 = document.getElementById('route-alt-1');
    const routeAlt2 = document.getElementById('route-alt-2');
    
    // Alert and info UI elements
    const mapAlert = document.getElementById('map-alert');
    const mapAlertText = document.getElementById('map-alert-text');
    const copilotText = document.getElementById('copilot-suggestion-text');
    
    const infoBoxPrimary = document.getElementById('info-box-primary');
    const infoBoxAlt1 = document.getElementById('info-box-alt-1');
    const infoBoxAlt2 = document.getElementById('info-box-alt-2');

    const primaryStatus = document.getElementById('primary-route-status');
    const primaryLeadTime = document.getElementById('primary-lead-time');
    const primaryRisk = document.getElementById('primary-risk');
    const primaryCost = document.getElementById('primary-cost');
    const primaryDependencyFill = document.getElementById('primary-dependency-fill');

    // Waypoints Graph definition for Dijkstra Routing Solver
    const routingGraph = {
        'CN': { 'TaiwanStrait': 1 },
        'TaiwanStrait': { 'MalaccaStrait': 5, 'SuezCanal': 12 },
        'SuezCanal': { 'IN': 5 },
        'MalaccaStrait': { 'IN': 12 },
        'CapeGoodHope': { 'IN': 24 },
        'CL': { 'IN': 24 },
        'DOM': { 'IN': 4 }
    };

    // Dijkstra route solver in JS
    function runDijkstra(graph, start, end) {
        let distances = {};
        let prev = {};
        let queue = [];
        
        for (let node in graph) {
            distances[node] = Infinity;
            prev[node] = null;
            queue.push(node);
        }
        // Expand hidden nodes that are targets in connections
        distances['IN'] = Infinity;
        prev['IN'] = null;
        queue.push('IN');
        
        distances[start] = 0;
        
        while (queue.length > 0) {
            queue.sort((a, b) => distances[a] - distances[b]);
            let u = queue.shift();
            
            if (u === end) break;
            if (distances[u] === Infinity) break;
            
            const neighbors = graph[u] || {};
            for (let neighbor in neighbors) {
                let alt = distances[u] + neighbors[neighbor];
                if (alt < distances[neighbor]) {
                    distances[neighbor] = alt;
                    prev[neighbor] = u;
                }
            }
        }
        
        let path = [];
        let u = end;
        if (prev[u] || u === start) {
            while (u) {
                path.unshift(u);
                u = prev[u];
            }
        }
        return { distance: distances[end], path: path };
    }

    function updateMapUX() {
        // Build dynamic graph nodes based on active blockades
        const activeGraph = JSON.parse(JSON.stringify(routingGraph));
        
        if (state.mapThreats.taiwan) {
            // Block Taiwan Strait edge
            delete activeGraph['CN']['TaiwanStrait'];
        }
        if (state.mapThreats.suez) {
            // Block Suez edge
            delete activeGraph['TaiwanStrait']['SuezCanal'];
            // Divert around Cape of Good Hope
            activeGraph['TaiwanStrait']['CapeGoodHope'] = 20;
        }

        // Run Dijkstra path calculations
        const dCN = runDijkstra(activeGraph, 'CN', 'IN');
        
        let riskScore = 42;
        let leadTime = dCN.distance === Infinity ? 999 : dCN.distance;
        let cost = 12.4;

        if (state.mapThreats.taiwan || state.mapThreats.suez || state.mapThreats.tariff) {
            actionMitigateBtn.removeAttribute('disabled');
        } else {
            actionMitigateBtn.setAttribute('disabled', 'true');
        }

        // 1. Taiwan Strait Blockade UI updates
        if (state.mapThreats.taiwan) {
            nodeChina.className.baseVal = "node-source offline";
            straitTaiwan.className.baseVal = "strait-marker blocked-gate";
            routePrimary.classList.add('blocked');
            routePrimary.style.stroke = 'var(--color-danger)';
            
            nodeDomestic.classList.remove('hidden');
            nodeDomesticTxt.classList.remove('hidden');
            routeAlt2.classList.remove('hidden');
            infoBoxAlt2.classList.remove('inactive');
            
            mapAlert.classList.remove('hidden');
            mapAlertText.textContent = "Taiwan Strait Blockade active. Stranded 40% Neodymium raw component exports.";
            
            primaryStatus.textContent = "BLOCKED";
            primaryStatus.className = "badge badge-pulse text-danger";
            primaryRisk.textContent = "95%";
            primaryRisk.className = "val text-danger";
            primaryDependencyFill.className = "progress-fill danger-fill";
            primaryDependencyFill.style.width = "95%";
            
            copilotText.innerHTML = `"CRITICAL RISK: Taiwan Strait route blocked. Primary sourcing of Neodymium components from Ningbo CN stranded. <strong>Action Required:</strong> Click 'Execute Sourcing Redirection' to switch battery magnets production blends to 100% Domestic Indian sourcing."`;
            
            globalRiskBadge.className = "stat-badge risk-alert animate-pulse";
            globalRiskBadge.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Sourcing Threat: CRITICAL`;
            
            triggerTaiwanBtn.classList.add('active-btn');
            infoBoxPrimary.classList.add('alert-border');
        } else {
            nodeChina.className.baseVal = "node-source online";
            straitTaiwan.className.baseVal = "strait-marker";
            routePrimary.classList.remove('blocked');
            routePrimary.style.stroke = 'var(--color-warning)';
            
            nodeDomestic.classList.add('hidden');
            nodeDomesticTxt.classList.add('hidden');
            routeAlt2.classList.add('hidden');
            infoBoxAlt2.classList.add('inactive');
            
            infoBoxPrimary.classList.remove('alert-border');
        }

        // 2. Suez Port Strike UI updates
        if (state.mapThreats.suez) {
            straitSuez.className.baseVal = "strait-marker blocked-gate";
            routePrimary.classList.add('blocked');
            routePrimary.style.stroke = 'var(--color-danger)';

            routeAlt1.classList.remove('hidden');
            infoBoxAlt1.classList.remove('inactive');

            mapAlert.classList.remove('hidden');
            mapAlertText.textContent = "Suez Canal Port Strike Strands Sea Routes. Europe-bound shipments delayed +18 days.";

            primaryStatus.textContent = "DELAYED";
            primaryStatus.className = "badge status-yellow";
            primaryRisk.textContent = "80%";
            primaryRisk.className = "val text-warning";
            primaryDependencyFill.className = "progress-fill warning-fill";
            primaryDependencyFill.style.width = "80%";
            primaryLeadTime.textContent = `${leadTime} Days (+18d)`;
            primaryLeadTime.className = "val text-danger";

            copilotText.innerHTML = `"TRANSIT DELAY: Suez port strike has stranded shipments. Sourcing lead times increased to ${leadTime} days. <strong>Action Recommended:</strong> Execute redirection to source battery Lithium carbon chemistry from Atacama Chile via South Atlantic Sea Lanes."`;

            globalRiskBadge.className = "stat-badge risk-alert animate-pulse";
            globalRiskBadge.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Sourcing Threat: ELEVATED`;

            triggerSuezBtn.classList.add('active-btn');
            infoBoxPrimary.classList.add('alert-border');
        } else {
            straitSuez.className.baseVal = "strait-marker";
            if (!state.mapThreats.taiwan) {
                primaryStatus.textContent = "ACTIVE";
                primaryStatus.className = "badge status-active";
                primaryRisk.textContent = "42%";
                primaryRisk.className = "val text-warning";
                primaryDependencyFill.className = "progress-fill warning-fill";
                primaryDependencyFill.style.width = "78%";
                primaryLeadTime.textContent = "18 Days";
                primaryLeadTime.className = "val";
            }
            routeAlt1.classList.add('hidden');
            infoBoxAlt1.classList.add('inactive');
        }

        // 3. Tariff Hike UI updates
        if (state.mapThreats.tariff) {
            triggerTariffBtn.classList.add('active-btn');
            mapAlert.classList.remove('hidden');
            mapAlertText.textContent = "Lithium Trade Tariffs of 45% enforced on CN imports. Production inflation threat HIGH.";

            primaryCost.textContent = "$18.0/kg (+45%)";
            primaryCost.className = "val text-danger";

            copilotText.innerHTML = `"FINANCIAL THREAT: Import tariffs of 45% on Chinese processed cells enforced. NMC battery cost projected to spike by 18%. <strong>Recommendation:</strong> Model active material substitution ratios or source raw Lithium from Atacama, CL."`;
            
            if (!state.mapThreats.taiwan && !state.mapThreats.suez) {
                globalRiskBadge.className = "stat-badge risk-alert animate-pulse";
                globalRiskBadge.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Financial Risk: ELEVATED`;
            }
        } else {
            primaryCost.textContent = "$12.4/kg";
            primaryCost.className = "val";
        }

        if (!state.mapThreats.taiwan && !state.mapThreats.suez && !state.mapThreats.tariff) {
            mapAlert.classList.add('hidden');
            globalRiskBadge.className = "stat-badge risk-alert low-risk";
            globalRiskBadge.innerHTML = `<i class="fa-solid fa-circle-check"></i> Sourcing Status: STABLE`;
            copilotText.innerHTML = `"System is running at baseline parameters. Primary sourcing from Ningbo, CN via Taiwan Strait is stable. Geopolitical Risk Index is within tolerance. Monitor Suez strike alerts."`;
        }
    }

    if (triggerTaiwanBtn) {
        triggerTaiwanBtn.addEventListener('click', () => {
            state.mapThreats.taiwan = !state.mapThreats.taiwan;
            state.mapThreats.suez = false;
            triggerSuezBtn.classList.remove('active-btn');
            updateMapUX();
        });
    }

    if (triggerSuezBtn) {
        triggerSuezBtn.addEventListener('click', () => {
            state.mapThreats.suez = !state.mapThreats.suez;
            state.mapThreats.taiwan = false;
            triggerTaiwanBtn.classList.remove('active-btn');
            updateMapUX();
        });
    }

    if (triggerTariffBtn) {
        triggerTariffBtn.addEventListener('click', () => {
            state.mapThreats.tariff = !state.mapThreats.tariff;
            updateMapUX();
        });
    }

    if (resetMapBtn) {
        resetMapBtn.addEventListener('click', () => {
            state.mapThreats.taiwan = false;
            state.mapThreats.suez = false;
            state.mapThreats.tariff = false;
            
            triggerTaiwanBtn.classList.remove('active-btn');
            triggerSuezBtn.classList.remove('active-btn');
            triggerTariffBtn.classList.remove('active-btn');
            
            updateMapUX();
        });
    }

    if (actionMitigateBtn) {
        actionMitigateBtn.addEventListener('click', () => {
            alert("ALERT: Dijkstra Re-routing Optimization Executed!\nSourcing paths automatically updated in SAP ERP ledger. Active order routing diverted to safe Chile / Domestic networks.");
            state.mapThreats.taiwan = false;
            state.mapThreats.suez = false;
            state.mapThreats.tariff = false;
            
            triggerTaiwanBtn.classList.remove('active-btn');
            triggerSuezBtn.classList.remove('active-btn');
            triggerTariffBtn.classList.remove('active-btn');
            
            const esgBadge = document.getElementById('esg-savings-percent');
            if (esgBadge) esgBadge.textContent = "22.8%";
            
            updateMapUX();
        });
    }


    /* ==========================================================================
       3. Module 2: Material Substitution Engine (Substitut-AI)
       ========================================================================== */
    const materialSelect = document.getElementById('material-select');
    const subSlider = document.getElementById('substitution-slider');
    const subRatioLabel = document.getElementById('sub-ratio-label');
    
    const labelVesselPrimary = document.getElementById('label-vessel-primary');
    const labelVesselAlternate = document.getElementById('label-vessel-alternate');
    const liquidPrimary = document.getElementById('liquid-primary');
    const liquidAlternate = document.getElementById('liquid-alternate');
    const pctVesselPrimary = document.getElementById('pct-vessel-primary');
    const pctVesselAlternate = document.getElementById('pct-vessel-alternate');

    const barValRisk = document.getElementById('bar-val-risk');
    const barFillRisk = document.getElementById('bar-fill-risk');
    const labelBarPerf = document.getElementById('label-bar-perf');
    const barValPerf = document.getElementById('bar-val-perf');
    const barFillPerf = document.getElementById('bar-fill-perf');
    const labelBarWeight = document.getElementById('label-bar-weight');
    const barValWeight = document.getElementById('bar-val-weight');
    const barFillWeight = document.getElementById('bar-fill-weight');
    const barValCost = document.getElementById('bar-val-cost');
    const barFillCost = document.getElementById('bar-fill-cost');
    const barValEsg = document.getElementById('bar-val-esg');
    const barFillEsg = document.getElementById('bar-fill-esg');

    const substitutionVerdict = document.getElementById('substitution-verdict-text');

    const materialDb = {
        neodymium: {
            primary: 'Neodymium',
            alternate: 'Ferrite Magnet',
            perfLabel: 'Magnetic Flux Strength',
            weightLabel: 'Traction Motor Weight Penalty',
            baseline: { risk: 85, perf: 100, weight: 0, cost: 140, esg: 64 },
            substitute: { risk: 5, perf: 65, weight: 45, cost: 22, esg: 12 },
            verdict: (pct) => {
                if (pct === 0) return `"Using 100% Neodymium provides maximum torque density but exposes supply lines to Chinese export restrictions (85% risk). Consider blending Ferrite magnets."`;
                if (pct < 40) return `"AI Blending Verdict: Sourcing ${pct}% Ferrite reduces Geopolitical dependency to ${Math.round(85 - 0.8 * pct)}% and slashes raw material costing to $${Math.round(140 - 1.18 * pct)}/kg, with an acceptable motor weight penalty of +${Math.round(0.45 * pct)}%."`;
                return `"Alert: Exceeding 40% Ferrite substitution triggers major motor redesign limits due to a severe weight penalty (+${Math.round(0.45 * pct)}%) and magnetic flux drop of ${Math.round(0.35 * pct)}%."`;
            }
        },
        lithium: {
            primary: 'Lithium NMC Cell',
            alternate: 'Sodium-ion Cell',
            perfLabel: 'Cell Volumetric Energy Density',
            weightLabel: 'Pack Weight Increase',
            baseline: { risk: 78, perf: 100, weight: 0, cost: 110, esg: 72 },
            substitute: { risk: 10, perf: 58, weight: 35, cost: 35, esg: 22 },
            verdict: (pct) => {
                if (pct === 0) return `"NMC Chemistry offers exceptional vehicle range (500km+) but relies on volatile Lithium and Cobalt minerals (78% supply-chain risk)."`;
                if (pct < 50) return `"Smart Blending: Sourcing ${pct}% Sodium-ion for entry-level models slashes geopolitical risk from 78% to ${Math.round(78 - 0.68 * pct)}% while saving 20% on cell package sourcing."`;
                return `"Deep Substitution: Blending ${pct}% Sodium-ion limits highway range capability (-${Math.round(0.42 * pct)}%) but provides extreme safety, zero thermal runaway risk, and low-cost urban range."`;
            }
        },
        semiconductor: {
            primary: 'Silicon MOSFETs',
            alternate: 'Domestic GaN / SiC',
            perfLabel: 'Thermal Efficiency Capability',
            weightLabel: 'Converter Size Footprint',
            baseline: { risk: 90, perf: 100, weight: 0, cost: 48, esg: 34 },
            substitute: { risk: 8, perf: 120, weight: -25, cost: 72, esg: 20 },
            verdict: (pct) => {
                if (pct === 0) return `"Silicon power chips face critical fab allocation congestion in Taiwan. Sourcing lead times stretch to 45 weeks."`;
                if (pct < 60) return `"Sourcing Re-blend: Introducing ${pct}% Domestic Wide-Bandgap GaN chips bypasses Taiwan dependencies, reducing risk to ${Math.round(90 - 0.82 * pct)}% and increasing power converter efficiency to +${Math.round(0.2 * pct)}%."`;
                return `"Full Sourcing Shift: 100% SiC/GaN implementation eliminates automotive semiconductor risk, shrinks converter footprint by 25%, but increases component unit purchase cost by 50%."`;
            }
        }
    };

    function updateSubstitutionUX() {
        const material = materialSelect.value;
        const pct = parseInt(subSlider.value);
        state.selectedMaterial = material;
        state.subRatio = pct;

        const data = materialDb[material];
        
        labelVesselPrimary.textContent = data.primary;
        labelVesselAlternate.textContent = data.alternate;

        liquidPrimary.style.height = `${100 - pct}%`;
        liquidAlternate.style.height = `${pct}%`;

        pctVesselPrimary.textContent = `${100 - pct}%`;
        pctVesselAlternate.textContent = `${pct}%`;

        subRatioLabel.textContent = `${pct}% Sourcing Re-blend`;

        // Calculate dynamic physics-based material formulas
        const dynamicRisk = data.baseline.risk * (1 - pct/100) + data.substitute.risk * (pct/100);
        const dynamicPerf = data.baseline.perf * (1 - pct/100) + data.substitute.perf * (pct/100);
        const dynamicWeight = data.baseline.weight * (1 - pct/100) + data.substitute.weight * (pct/100);
        const dynamicCost = data.baseline.cost * (1 - pct/100) + data.substitute.cost * (pct/100);
        const dynamicEsg = data.baseline.esg * (1 - pct/100) + data.substitute.esg * (pct/100);

        // Update indicators
        barValRisk.textContent = `${dynamicRisk > 60 ? 'High' : (dynamicRisk > 30 ? 'Moderate' : 'Low')} Risk (${Math.round(dynamicRisk)}/100)`;
        barFillRisk.style.width = `${dynamicRisk}%`;
        barFillRisk.className = `comparison-progress-fill ${dynamicRisk > 60 ? 'bg-danger' : (dynamicRisk > 30 ? 'bg-warning' : 'bg-success')}`;

        labelBarPerf.textContent = data.perfLabel;
        barValPerf.textContent = `${Math.round(dynamicPerf)}%`;
        barFillPerf.style.width = `${Math.min(100, dynamicPerf)}%`;

        labelBarWeight.textContent = data.weightLabel;
        barValWeight.textContent = `${dynamicWeight >= 0 ? '+' : ''}${Math.round(dynamicWeight)}%`;
        barFillWeight.style.width = `${Math.abs(dynamicWeight)}%`;
        barFillWeight.className = `comparison-progress-fill ${Math.abs(dynamicWeight) > 20 ? 'bg-warning' : 'bg-success'}`;

        barValCost.textContent = `$${Math.round(dynamicCost)}/kg`;
        barFillCost.style.width = `${Math.min(100, (dynamicCost/200) * 100)}%`;

        barValEsg.textContent = `${dynamicEsg.toFixed(1)} kg CO2/kg`;
        barFillEsg.style.width = `${Math.min(100, (dynamicEsg/100) * 100)}%`;
        barFillEsg.className = `comparison-progress-fill ${dynamicEsg > 50 ? 'bg-warning' : 'bg-success'}`;

        substitutionVerdict.innerHTML = data.verdict(pct);
    }

    if (materialSelect) materialSelect.addEventListener('change', updateSubstitutionUX);
    if (subSlider) subSlider.addEventListener('input', updateSubstitutionUX);


    /* ==========================================================================
       4. Module 3: VisionDetect-AI Weld Inspector (Real Sobel Filter & Cp/Cpk Engine)
       ========================================================================== */
    const weldCanvas = document.getElementById('weld-canvas');
    const sobelCanvas = document.getElementById('weld-sobel-canvas');
    let weldCtx = null;
    let sobelCtx = null;
    
    if (weldCanvas) weldCtx = weldCanvas.getContext('2d');
    if (sobelCanvas) sobelCtx = sobelCanvas.getContext('2d');

    const triggerDefectBtn = document.getElementById('btn-trigger-defect');
    const valCp = document.getElementById('val-cp');
    const valCpk = document.getElementById('val-cpk');
    const valDefectRate = document.getElementById('val-defect-rate');
    const chartAlertLbl = document.getElementById('chart-alert-lbl');
    const spcLine = document.getElementById('spc-line');
    const spcPointsGroup = document.getElementById('spc-points');
    const operatorGuidePanel = document.getElementById('operator-guide-panel');
    const guideInstructionText = document.getElementById('guide-instruction-text');

    let weldLoopId = null;
    let weldX = 0;
    
    // Sobel image convolution processing
    function computeSobelEdges(src, dst) {
        if (!src || !dst) return;
        const sw = src.canvas.width;
        const sh = src.canvas.height;
        const dw = dst.canvas.width;
        const dh = dst.canvas.height;
        
        dst.drawImage(src.canvas, 0, 0, dw, dh);
        
        const imgData = dst.getImageData(0, 0, dw, dh);
        const data = imgData.data;
        const grayscale = new Uint8ClampedArray(dw * dh);
        
        for (let i = 0; i < data.length; i += 4) {
            grayscale[i / 4] = 0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2];
        }
        
        const output = dst.createImageData(dw, dh);
        const outData = output.data;
        
        const kx = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
        const ky = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
        
        for (let y = 1; y < dh - 1; y++) {
            for (let x = 1; x < dw - 1; x++) {
                let px = 0;
                let py = 0;
                
                for (let j = -1; j <= 1; j++) {
                    for (let i = -1; i <= 1; i++) {
                        const val = grayscale[(y + j) * dw + (x + i)];
                        const kIdx = (j + 1) * 3 + (i + 1);
                        px += val * kx[kIdx];
                        py += val * ky[kIdx];
                    }
                }
                
                const mag = Math.sqrt(px*px + py*py);
                const idx = (y * dw + x) * 4;
                const edge = mag > 60 ? 255 : 0;
                
                outData[idx] = 0;
                outData[idx + 1] = edge; // Teal edge mapping
                outData[idx + 2] = edge;
                outData[idx + 3] = edge > 0 ? 255 : 0;
            }
        }
        dst.putImageData(output, 0, 0);
    }

    function initWeldSimulation() {
        if (!weldCtx) return;
        if (weldLoopId) cancelAnimationFrame(weldLoopId);

        state.weldSimulation.laserY = 0;
        state.weldSimulation.sparkParticles = [];
        weldX = 0;

        function runWelderFrame() {
            if (state.activeTab !== 'smart-shopfloor') return;

            // Draw baseline weld cylinders
            weldCtx.fillStyle = '#0f172a';
            weldCtx.fillRect(0, 0, weldCanvas.width, weldCanvas.height);

            // Metal Plates
            weldCtx.fillStyle = '#334155';
            weldCtx.fillRect(0, 40, weldCanvas.width, 80);
            weldCtx.fillRect(0, 160, weldCanvas.width, 80);

            // Weld joint line
            weldX += 4;
            if (weldX > weldCanvas.width) weldX = 0;

            // Simulate weld seam profile
            weldCtx.strokeStyle = '#475569';
            weldCtx.lineWidth = 12;
            weldCtx.beginPath();
            weldCtx.moveTo(0, 140);
            weldCtx.lineTo(weldCanvas.width, 140);
            weldCtx.stroke();

            // Active Weld Pool seam line
            weldCtx.strokeStyle = '#94a3b8';
            weldCtx.lineWidth = 8;
            weldCtx.beginPath();
            weldCtx.moveTo(0, 140);
            weldCtx.lineTo(weldX, 140);
            weldCtx.stroke();

            // Calculate physical coordinate deviation based on defect trigger
            let devY = 0;
            if (state.weldSimulation.activeDefect === 'porosity') {
                devY = (Math.random() - 0.5) * 16; // rapid noise
            } else if (state.weldSimulation.activeDefect === 'crack') {
                devY = 14 * Math.sin(weldX * 0.08); // large wave
            } else if (state.weldSimulation.activeDefect === 'misalign') {
                devY = 10; // linear offset
            }

            // Draw Weld Joint seam glowing bead
            weldCtx.strokeStyle = '#fca5a5';
            weldCtx.lineWidth = 6;
            weldCtx.beginPath();
            weldCtx.moveTo(weldX - 40, 140 + devY);
            weldCtx.lineTo(weldX, 140 + devY);
            weldCtx.stroke();

            // Laser Torch Tip
            weldCtx.fillStyle = '#e2e8f0';
            weldCtx.fillRect(weldX - 10, 100 + devY, 20, 15);
            weldCtx.fillStyle = 'var(--color-teal)';
            weldCtx.fillRect(weldX - 4, 115 + devY, 8, 10);

            // Laser Beam Line
            weldCtx.strokeStyle = 'var(--color-teal)';
            weldCtx.lineWidth = 3;
            weldCtx.beginPath();
            weldCtx.moveTo(weldX, 125 + devY);
            weldCtx.lineTo(weldX, 140 + devY);
            weldCtx.stroke();

            // Spark particles
            if (Math.random() > 0.3) {
                state.weldSimulation.sparkParticles.push({
                    x: weldX,
                    y: 140 + devY,
                    vx: (Math.random() - 0.7) * 6,
                    vy: (Math.random() - 0.5) * 6 - 2,
                    alpha: 1
                });
            }

            state.weldSimulation.sparkParticles.forEach((p, idx) => {
                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= 0.04;
                if (p.alpha <= 0) {
                    state.weldSimulation.sparkParticles.splice(idx, 1);
                    return;
                }
                weldCtx.fillStyle = `rgba(253, 186, 116, ${p.alpha})`;
                weldCtx.fillRect(p.x, p.y, 3, 3);
            });

            // Feed raw pixel canvas into Sobel edge detection algorithm
            computeSobelEdges(weldCtx, sobelCtx);

            // Calculate rolling statistical Cp/Cpk SPC parameters
            if (weldX % 16 === 0) {
                state.weldSimulation.spcPoints.push(60 + devY * 3);
                if (state.weldSimulation.spcPoints.length > 25) {
                    state.weldSimulation.spcPoints.shift();
                }

                // Compute real standard deviation & Cpk
                const N = state.weldSimulation.spcPoints.length;
                const sum = state.weldSimulation.spcPoints.reduce((a, b) => a + b, 0);
                const mean = sum / N;
                
                let varianceSum = 0;
                state.weldSimulation.spcPoints.forEach(p => {
                    varianceSum += Math.pow(p - mean, 2);
                });
                const variance = varianceSum / (N - 1 || 1);
                const stdDev = Math.sqrt(variance) || 0.1;

                // Process potential limits (USL = 100, LSL = 20, Target Mean = 60)
                const USL = 100;
                const LSL = 20;
                const Cp = (USL - LSL) / (6 * stdDev);
                const Cpk = Math.min((USL - mean) / (3 * stdDev), (mean - LSL) / (3 * stdDev));

                state.weldSimulation.cp = Math.max(0.2, Cp);
                state.weldSimulation.cpk = Math.max(0.1, Cpk);

                valCp.textContent = state.weldSimulation.cp.toFixed(2);
                valCpk.textContent = state.weldSimulation.cpk.toFixed(2);

                if (state.weldSimulation.cpk < 1.1) {
                    valCpk.className = "cpk-val text-danger";
                    valDefectRate.textContent = `${((1.2 - state.weldSimulation.cpk) * 24).toFixed(2)}%`;
                    valDefectRate.className = "cpk-val text-danger";
                    chartAlertLbl.textContent = "OUT OF CONTROL - CALIBRATION ALARM";
                    chartAlertLbl.className = "chart-alert text-danger";
                } else {
                    valCpk.className = "cpk-val text-success";
                    valDefectRate.textContent = "0.02%";
                    valDefectRate.className = "cpk-val text-success";
                    chartAlertLbl.textContent = "Process in Control";
                    chartAlertLbl.className = "chart-alert text-success";
                }

                // Re-draw SPC SVG control chart path
                let pathD = "M 0,60";
                spcPointsGroup.innerHTML = '';
                state.weldSimulation.spcPoints.forEach((p, i) => {
                    const cx = (i / (N - 1)) * 420;
                    // invert Y for SVG mapping (height = 120, baseline = 60)
                    const cy = Math.max(10, Math.min(110, p));
                    if (i === 0) pathD = `M ${cx},${cy}`;
                    else pathD += ` L ${cx},${cy}`;

                    // Draw red glowing dots if points drift out of bounds
                    if (cy < 30 || cy > 90) {
                        const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                        circle.setAttribute("cx", cx);
                        circle.setAttribute("cy", cy);
                        circle.setAttribute("r", "5");
                        circle.setAttribute("fill", "var(--color-danger)");
                        circle.setAttribute("filter", "url(#glow-red)");
                        spcPointsGroup.appendChild(circle);
                    }
                });
                spcLine.setAttribute("d", pathD);
            }

            weldLoopId = requestAnimationFrame(runWelderFrame);
        }

        runWelderFrame();
    }

    if (triggerDefectBtn) {
        triggerDefectBtn.addEventListener('click', () => {
            const defects = ['porosity', 'crack', 'misalign'];
            const randomDefect = defects[Math.floor(Math.random() * defects.length)];
            state.weldSimulation.activeDefect = randomDefect;
            
            triggerDefectBtn.className = "btn btn-outline btn-sm active-btn";
            triggerDefectBtn.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Defect: ${randomDefect.toUpperCase()}`;

            operatorGuidePanel.className = "operator-guide-box mt-4 guide-alert-border animate-pulse";
            operatorGuidePanel.querySelector('.badge').className = "badge badge-pulse text-danger";
            operatorGuidePanel.querySelector('.badge').textContent = "CRITICAL OUT-OF-SPEC";

            if (randomDefect === 'porosity') {
                guideInstructionText.innerHTML = `<strong>Weld Joint Porosity Detected.</strong><br>
                <em>Mitigation Action Required:</em> 1. Halt gas solenoid shutter. 2. Verify shielding Argon flow regulators. 3. pausse line for electrode cleaning.`;
            } else if (randomDefect === 'crack') {
                guideInstructionText.innerHTML = `<strong>Joint Structural Crack Detected.</strong><br>
                <em>Mitigation Action Required:</em> 1. Reject cylinder assembly immediately. 2. Run edge scan calibration of optical actuators. 3. Adjust heat dissipation limits.`;
            } else {
                guideInstructionText.innerHTML = `<strong>Laser Alignment Offset Detected.</strong><br>
                <em>Mitigation Action Required:</em> 1. Execute auto-calibration alignment sweep. 2. Reduce weld head feed speed to 110mm/s. 3. recalibrate laser coordinate center.`;
            }

            // Restore baseline after 5 seconds of active troubleshooting simulation!
            setTimeout(() => {
                state.weldSimulation.activeDefect = null;
                triggerDefectBtn.className = "btn btn-outline btn-sm";
                triggerDefectBtn.innerHTML = `<i class="fa-solid fa-bolt"></i> Inject Weld Defect`;
                operatorGuidePanel.className = "operator-guide-box mt-4";
                operatorGuidePanel.querySelector('.badge').className = "badge badge-success";
                operatorGuidePanel.querySelector('.badge').textContent = "NOMINAL";
                guideInstructionText.textContent = `"Process is highly centered. Cp is 1.54, indicating excellent process potential. No intervention necessary. Standard weld energy output (1400J) maintained."`;
            }, 6000);
        });
    }


    /* ==========================================================================
       5. Module 4: Supplier Analytics (Interactive Registry & Plotting)
       ========================================================================== */
    const supplierDatabase = {
        'Ningbo Sourcing': {
            name: 'Ningbo Sourcing Corp',
            location: 'Ningbo, CN',
            gri: '82%',
            leadTime: '18 Days',
            esg: 'Grade D',
            quality: '1.42',
            bottlenecks: [
                'Substantial export licensing restrictions on Critical Minerals.',
                'Transit route passes entirely through congested Taiwan Strait lanes.',
                'High reliance on coal-powered smelting grid.'
            ]
        },
        'Atacama Lithium': {
            name: 'Atacama Lithium Mining',
            location: 'Atacama Desert, CL',
            gri: '12%',
            leadTime: '24 Days',
            esg: 'Grade B',
            quality: '1.48',
            bottlenecks: [
                'Longer sea lane transit times (+6 days relative to CN).',
                'Ethical water extraction audits pending verification.',
                'Vulnerable to South Atlantic trade lane swell bottlenecks.'
            ]
        },
        'Hindustan Metals': {
            name: 'Hindustan Metals & Alloys',
            location: 'Pune, IN (Domestic)',
            gri: '2%',
            leadTime: '4 Days',
            esg: 'Grade A',
            quality: '1.54',
            bottlenecks: [
                'Unit purchase premium cost is +22% relative to CN imports.',
                'Capacity limits set to maximum 5,000 tons/annum.',
                'Low processing scale for high-grade EV traction components.'
            ]
        },
        'Aussie Mineral Corp': {
            name: 'Aussie Mineral Corp',
            location: 'Perth, AU',
            gri: '8%',
            leadTime: '16 Days',
            esg: 'Grade B',
            quality: '1.45',
            bottlenecks: [
                'Vulnerable to Western Australia cyclone shipping delays.',
                'High port cargo processing fees.'
            ]
        },
        'Rhineland Semiconductors': {
            name: 'Rhineland Semiconductors',
            location: 'Dresden, DE',
            gri: '35%',
            leadTime: '22 Days',
            esg: 'Grade B',
            quality: '1.49',
            bottlenecks: [
                'European regulatory carbon border tax adjustments.',
                'Stretched fab wafer booking queues.'
            ]
        },
        'Taiwan Microchip Corp': {
            name: 'Taiwan Microchip Corp',
            location: 'Hsinchu, TW',
            gri: '90%',
            leadTime: '15 Days',
            esg: 'Grade C',
            quality: '1.56',
            bottlenecks: [
                'Critical fab location in highly volatile geopolitical zone.',
                'Vulnerable to sea blockades and power grid failures.'
            ]
        }
    };

    const scatterCircles = document.querySelectorAll('.scatter-bubble');
    const profileSupName = document.getElementById('profile-supplier-name');
    const profileSupLoc = document.getElementById('profile-supplier-location');
    const profileGri = document.getElementById('profile-gri');
    const profileLead = document.getElementById('profile-lead-time');
    const profileEsg = document.getElementById('profile-esg');
    const profileQuality = document.getElementById('profile-quality');
    const profileBottlenecks = document.getElementById('profile-bottlenecks');

    function selectSupplierProfile(id) {
        const data = supplierDatabase[id];
        if (!data) return;

        state.selectedSupplier = id;
        profileSupName.textContent = data.name;
        profileSupLoc.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${data.location}`;
        profileGri.textContent = data.gri;
        profileLead.textContent = data.leadTime;
        profileEsg.textContent = data.esg;
        profileQuality.textContent = data.quality;

        const griVal = parseInt(data.gri);
        if (griVal > 60) profileGri.className = "stat-val text-danger";
        else if (griVal > 30) profileGri.className = "stat-val text-warning";
        else profileGri.className = "stat-val text-success";

        profileBottlenecks.innerHTML = '';
        data.bottlenecks.forEach(b => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fa-solid fa-triangle-exclamation ${griVal > 50 ? 'text-danger' : 'text-warning'}"></i> ${b}`;
            profileBottlenecks.appendChild(li);
        });

        // Set active circle layout
        document.querySelectorAll('.scatter-bubble').forEach(c => {
            c.style.stroke = 'none';
            c.style.r = c.getAttribute('id') === 'bub-ningbo' ? '16' : 
                         (c.getAttribute('id') === 'bub-atacama' ? '14' : 
                         (c.getAttribute('id') === 'bub-hindustan' ? '11' : '13'));
        });
        
        const circleId = id === 'Ningbo Sourcing' ? 'bub-ningbo' :
                         (id === 'Atacama Lithium' ? 'bub-atacama' :
                         (id === 'Hindustan Metals' ? 'bub-hindustan' :
                         (id === 'Aussie Mineral Corp' ? 'bub-aussie' :
                         (id === 'Rhineland Semiconductors' ? 'bub-rhine' : 'bub-taiwan'))));
        
        const circle = document.getElementById(circleId);
        if (circle) {
            circle.style.stroke = 'var(--color-teal)';
            circle.style.strokeWidth = '2px';
            circle.style.r = String(parseInt(circle.style.r || circle.getAttribute('r')) + 4);
        }
    }

    scatterCircles.forEach(circle => {
        circle.addEventListener('click', () => {
            const supplierKey = circle.getAttribute('data-supplier');
            selectSupplierProfile(supplierKey);
        });
    });

    // Toggle Sourcing Supplier Registration Form
    const btnToggleAddSupplier = document.getElementById('btn-toggle-add-supplier');
    const addSupplierPanel = document.getElementById('add-supplier-panel');
    const btnSaveNewSupplier = document.getElementById('btn-save-new-supplier');

    if (btnToggleAddSupplier) {
        btnToggleAddSupplier.addEventListener('click', () => {
            addSupplierPanel.classList.toggle('hidden');
        });
    }

    if (btnSaveNewSupplier) {
        btnSaveNewSupplier.addEventListener('click', () => {
            const name = document.getElementById('new-sup-name').value;
            const loc = document.getElementById('new-sup-loc').value;
            const esg = document.getElementById('new-sup-esg').value;
            const lead = document.getElementById('new-sup-lead').value;
            const gri = document.getElementById('new-sup-gri').value;

            if (!name || !loc || !lead || !gri) {
                alert("Please fill in all supplier registry parameters.");
                return;
            }

            // Register in database memory
            supplierDatabase[name] = {
                name: name,
                location: loc,
                gri: `${gri}%`,
                leadTime: `${lead} Days`,
                esg: `Grade ${esg}`,
                quality: (1.3 + Math.random() * 0.3).toFixed(2),
                bottlenecks: [
                    "Sourcing established via localized custom supplier registry.",
                    `Lead time parameters configured to ${lead} days.`,
                    `ESG rating audited as Grade ${esg}.`
                ]
            };

            // Plot new SVG element dynamically on the scatter chart!
            const svgChart = document.getElementById('scatter-chart');
            const leadVal = parseInt(lead);
            const griVal = parseInt(gri);

            // Mapping: Lead Time (0-40 days) to SVG X (40-480)
            const cx = 40 + (Math.min(40, leadVal) / 40) * 440;
            // Mapping: GRI (0-100%) to SVG Y (260-20)
            const cy = 260 - (Math.min(100, griVal) / 100) * 240;

            const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            circle.setAttribute("id", `bub-${name.toLowerCase().replace(/\s+/g, '-')}`);
            circle.setAttribute("cx", cx.toFixed(1));
            circle.setAttribute("cy", cy.toFixed(1));
            circle.setAttribute("r", "13");
            circle.setAttribute("class", `scatter-bubble ${griVal > 60 ? 'risk-high' : (griVal > 30 ? 'risk-mid' : 'risk-low')}`);
            circle.setAttribute("data-supplier", name);
            
            circle.addEventListener('click', () => {
                selectSupplierProfile(name);
            });

            svgChart.appendChild(circle);

            // Add label text to SVG
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", cx.toFixed(1));
            text.setAttribute("y", (cy - 16).toFixed(1));
            text.setAttribute("class", "bub-lbl");
            text.setAttribute("text-anchor", "middle");
            text.textContent = name;
            svgChart.appendChild(text);

            alert(`Supplier "${name}" registered and successfully plotted on the analytical map!`);
            
            // Clear inputs and hide panel
            document.getElementById('new-sup-name').value = '';
            document.getElementById('new-sup-loc').value = '';
            document.getElementById('new-sup-lead').value = '';
            document.getElementById('new-sup-gri').value = '';
            addSupplierPanel.classList.add('hidden');

            // Select it
            selectSupplierProfile(name);
        });
    }

    // Filters for scatter plot
    const filterAll = document.getElementById('filter-all-suppliers');
    const filterLowGRI = document.getElementById('filter-low-gri');
    const filterHighESG = document.getElementById('filter-high-esg');

    if (filterAll) {
        filterAll.addEventListener('click', () => {
            filterAll.className = "btn btn-outline btn-xs active-btn";
            filterLowGRI.className = "btn btn-outline btn-xs";
            filterHighESG.className = "btn btn-outline btn-xs";

            document.querySelectorAll('.scatter-bubble').forEach(c => {
                c.style.display = 'block';
            });
        });
    }

    if (filterLowGRI) {
        filterLowGRI.addEventListener('click', () => {
            filterLowGRI.className = "btn btn-outline btn-xs active-btn";
            filterAll.className = "btn btn-outline btn-xs";
            filterHighESG.className = "btn btn-outline btn-xs";

            document.querySelectorAll('.scatter-bubble').forEach(c => {
                const supplierKey = c.getAttribute('data-supplier');
                const sData = supplierDatabase[supplierKey];
                if (sData) {
                    const risk = parseInt(sData.gri);
                    c.style.display = risk < 40 ? 'block' : 'none';
                }
            });
        });
    }

    if (filterHighESG) {
        filterHighESG.addEventListener('click', () => {
            filterHighESG.className = "btn btn-outline btn-xs active-btn";
            filterAll.className = "btn btn-outline btn-xs";
            filterLowGRI.className = "btn btn-outline btn-xs";

            document.querySelectorAll('.scatter-bubble').forEach(c => {
                const supplierKey = c.getAttribute('data-supplier');
                const sData = supplierDatabase[supplierKey];
                if (sData) {
                    const esg = sData.esg;
                    c.style.display = (esg.includes('A') || esg.includes('B')) ? 'block' : 'none';
                }
            });
        });
    }


    /* ==========================================================================
       6. Module 5: ActionExtract-AI Shopfloor Parser (NLP Regex Engine)
       ========================================================================== */
    const transcriptSelector = document.getElementById('transcript-selector');
    const transcriptText = document.getElementById('transcript-text');
    const btnParseTranscript = document.getElementById('btn-parse-transcript');
    
    const resultsEmptyState = document.getElementById('results-empty-state');
    const resultsDataContainer = document.getElementById('results-data-container');
    const extractedTasksContainer = document.getElementById('extracted-tasks-container');
    const erpProposalsContainer = document.getElementById('erp-proposals-container');
    const emailDraftContent = document.getElementById('email-draft-content');
    const btnCopyEmail = document.getElementById('btn-copy-email');

    const transcriptScenarios = {
        'sourcing-disruption': `Logistics Lead Dispatcher: "Warning. Sourcing lines for battery-grade Lithium are severely disrupted. Trade tariff increases of 45% on import shipments from Ningbo CN are taking effect next Monday. Sourcing cost is spiking to $18/kg. Lead time is stretched. Requesting re-routing via Atacama Chile lanes to Pune assembly plant. We must draft the supply proposal immediately."`,
        'shopfloor-defect': `Shopfloor Quality Supervisor: "Welder Line 4 alignment is drifting. Our laser welding system reports that Cpk process accuracy has dropped to 0.98, and Cp potential is down to 1.10. High porosity detected in joint seams. PAUSE the welding actuators line immediately, trigger calibration sweeps of the positioning tips, and reduce base voltage limits."`,
        'sustainability-audit': `Compliance Audit Manager: "We have finalized the Scope 3 carbon compliance review. Ningbo CN smelter has failed ESG standards with a D-grade due to carbon emissions reaching 82 kg CO2/kg. We must transition sourcing to Cap-and-Trade compliant local vendors, specifically Hindustan Metals in India. Sourcing contract limits should be logged in SAP immediately."`
    };

    if (transcriptSelector) {
        transcriptSelector.addEventListener('change', () => {
            const scenario = transcriptSelector.value;
            transcriptText.value = transcriptScenarios[scenario] || '';
        });
        // Set default
        transcriptText.value = transcriptScenarios['sourcing-disruption'];
    }

    if (btnParseTranscript) {
        btnParseTranscript.addEventListener('click', () => {
            const text = transcriptText.value.trim();
            if (!text) {
                alert("Please enter a briefing transcript to parse.");
                return;
            }

            btnParseTranscript.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Parsing NLP Semantics...`;
            btnParseTranscript.setAttribute('disabled', 'true');

            setTimeout(() => {
                btnParseTranscript.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> Extract Actions & Sourcing Adjustments`;
                btnParseTranscript.removeAttribute('disabled');

                resultsEmptyState.classList.add('hidden');
                resultsDataContainer.classList.remove('hidden');

                // Dynamic NLP Extraction logic using Regex
                const lowerText = text.toLowerCase();
                let tasks = [];
                let erpTitle = "General Operational Adjustment";
                let erpDesc = "Process request logged via AegisFlow NLP parser.";
                let emailTo = "operations@aegisflow-partner.com";
                let emailSubject = "Operational Notice: Sourcing Adjustment";
                let emailBody = "";

                if (lowerText.includes('welder') || lowerText.includes('weld') || lowerText.includes('defect') || lowerText.includes('cpk')) {
                    // Welder defect scenario
                    const matchCpk = text.match(/Cpk\s+has\s+dropped\s+to\s+([0-9.]+)/i) || text.match(/Cpk\s+([0-9.]+)/i);
                    const cpkVal = matchCpk ? matchCpk[1] : "0.98";

                    tasks = [
                        `Pause welder actuators line immediately due to alignment drift.`,
                        `Initiate automated calibration sequence (Current Cpk: ${cpkVal}).`,
                        `Reduce weld feed speed and recalibrate laser sensor targets.`
                    ];

                    erpTitle = "Real-Time Welder Actuator Calibration Request";
                    erpDesc = `Log calibration event for Welder Line 4. Adjust voltage offsets to restore process capability Cpk target (> 1.50).`;
                    
                    emailTo = "engineering.leads@aegisflow.ai";
                    emailSubject = "URGENT: Station 4 Weld Quality Drift Calibration Request";
                    emailBody = `Dear Engineering Lead,

We have detected a critical process capability drift at weld joint station 4. 
The process capability index (Cpk) has dropped to ${cpkVal}. 

Please execute the optical laser actuator calibration sweep immediately and verify weld tip alignment.

Best regards,
AegisFlow Operator Co-Pilot`;
                }
                else if (lowerText.includes('lithium') || lowerText.includes('sourcing') || lowerText.includes('transit') || lowerText.includes('tariff')) {
                    // Sourcing disruption scenario
                    const matchTariff = text.match(/(\d+)%/i);
                    const tariffVal = matchTariff ? matchTariff[1] : "45";

                    tasks = [
                        `Initiate alternate path redirection of Lithium chemical supply lines.`,
                        `Activate South Atlantic Ocean Pacific lanes from Atacama Chile (CL).`,
                        `Audit tariff penalty structures (+${tariffVal}% CN surcharge verified).`
                    ];

                    erpTitle = "Sourcing Path Redirection: Lithium Carbonate";
                    erpDesc = `Reroute NMC raw battery shipments from Ningbo, CN to Atacama Desert Mining, CL. Quantities: 15,000 kg.`;

                    emailTo = "sourcing@atacama-lithium.cl";
                    emailSubject = "Sourcing Routing Request: NMC Raw Material Contract";
                    emailBody = `Dear Sourcing Coordinator,

Due to import surcharges (+${tariffVal}%) active on Chinese trade lanes, we are executing our alternate sourcing routing contracts.

Please prepare logistics dispatch nodes from Valparaiso, CL to Mumbai Port, IN.

Best regards,
AegisFlow Sourcing Tower`;
                }
                else {
                    // Generic fallback dynamic regex parser
                    // Pull out potential nouns/surnames and numbers
                    const words = text.split(/\s+/);
                    const numbers = text.match(/\b\d+\b/g) || ["10"];
                    const uppercaseWords = text.match(/\b[A-Z][a-z]+\b/g) || ["Sourcing Partner"];

                    tasks = [
                        `Audit operations logs for keyword events: "${uppercaseWords[0]}".`,
                        `Review sourcing quantity offsets: ${numbers[0]} units.`,
                        `Coordinate team callback and verify supply ledger parameters.`
                    ];

                    erpTitle = `Sourcing Adjustment: ${uppercaseWords[0]}`;
                    erpDesc = `Adjust purchase specifications for item nodes. Logged units: ${numbers[0]}.`;

                    emailTo = "ops.desk@aegisflow.ai";
                    emailSubject = `Alert: Operational Sourcing Notification - ${uppercaseWords[0]}`;
                    emailBody = `Dear Operations Desk,

We have parsed a briefing transcript indicating adjustments are needed:
- Priority Node: ${uppercaseWords[0]}
- Target Quantity: ${numbers[0]} units

Please log this proposal in your ERP ledger and dispatch orders.

Best regards,
AegisFlow AI Parser`;
                }

                // Render dynamically generated extracted results
                extractedTasksContainer.innerHTML = '';
                tasks.forEach(t => {
                    const item = document.createElement('div');
                    item.className = 'weld-calibration-log';
                    item.style.display = 'flex';
                    item.style.gap = '0.5rem';
                    item.style.fontSize = '0.75rem';
                    item.style.color = '#e2e8f0';
                    item.style.background = 'rgba(255,255,255,0.01)';
                    item.style.padding = '0.5rem 0.75rem';
                    item.style.borderRadius = '6px';
                    item.style.border = '1px solid var(--border-muted)';
                    item.innerHTML = `<i class="fa-solid fa-square-check text-success" style="margin-top: 3px;"></i> <span>${t}</span>`;
                    extractedTasksContainer.appendChild(item);
                });

                erpProposalsContainer.innerHTML = `
                    <div class="erp-proposal-flex" style="display: flex; justify-content: space-between; align-items: center; background: rgba(0, 242, 254, 0.02); border: 1px solid rgba(0, 242, 254, 0.15); padding: 1rem; border-radius: 8px;">
                        <div class="erp-info-txt">
                            <h5 style="font-size: 0.8rem; font-weight: 700; color: var(--color-teal);">${erpTitle}</h5>
                            <p style="font-size: 0.7rem; color: #cbd5e1; margin-top: 0.15rem;">${erpDesc}</p>
                        </div>
                        <button class="btn btn-primary btn-sm" onclick="alert('ERP Sourcing proposal successfully authorized and logged into SAP S/4HANA!')"><i class="fa-solid fa-file-invoice"></i> Authorize</button>
                    </div>
                `;

                emailDraftContent.textContent = emailBody;

            }, 1200);
        });
    }

    if (btnCopyEmail) {
        btnCopyEmail.addEventListener('click', () => {
            navigator.clipboard.writeText(emailDraftContent.textContent);
            btnCopyEmail.innerHTML = `<i class="fa-solid fa-check text-success"></i>`;
            setTimeout(() => {
                btnCopyEmail.innerHTML = `<i class="fa-regular fa-copy"></i>`;
            }, 1500);
        });
    }

    // Floating microphone simulated dictation typing
    const btnVoiceBriefing = document.getElementById('btn-voice-briefing');
    if (btnVoiceBriefing) {
        btnVoiceBriefing.addEventListener('click', () => {
            if (btnVoiceBriefing.classList.contains('listening')) return;

            btnVoiceBriefing.classList.add('listening');
            transcriptText.value = '';

            const dictationText = "Operator Line 4 Reporting: We have detected a critical weld alignment drift at station 4. Process capability Cpk is dropping towards 0.98. Defect analysis indicates minor gas porosity. Requesting immediate edge calibration of the welder actuators and a 5% reduction in weld speed. Sourcing lead times for replacement copper electrodes must be audited from local vendors to avoid shopfloor halting.";
            
            let charIdx = 0;
            function typeChar() {
                if (state.activeTab !== 'action-extractor') {
                    btnVoiceBriefing.classList.remove('listening');
                    return;
                }
                if (charIdx < dictationText.length) {
                    transcriptText.value += dictationText.charAt(charIdx);
                    charIdx++;
                    setTimeout(typeChar, 20);
                } else {
                    btnVoiceBriefing.classList.remove('listening');
                    btnParseTranscript.click();
                }
            }
            typeChar();
        });
    }


    /* ==========================================================================
       7. Module 6: ADAS-Adopt-AI Indian Context Road Simulator (Steerable Game)
       ========================================================================== */
    const adasCanvas = document.getElementById('adas-canvas');
    let adasCtx = null;
    if (adasCanvas) adasCtx = adasCanvas.getContext('2d');

    const triggerCattleBtn = document.getElementById('trigger-cattle');
    const triggerPotholeBtn = document.getElementById('trigger-pothole');
    const triggerRickshawBtn = document.getElementById('trigger-rickshaw');
    const resetAdasBtn = document.getElementById('reset-adas');

    const adasHudOverlay = document.getElementById('adas-hud-overlay');
    const adasHudText = document.getElementById('adas-hud-text');

    const adasSpeedVal = document.getElementById('val-adas-speed');
    const adasBrakeVal = document.getElementById('val-adas-brake');
    const adasAlertVal = document.getElementById('val-adas-alert');

    const adasObjectAlert = document.getElementById('adas-object-alert');
    const adasTargetName = document.getElementById('adas-target-name');
    const adasTargetDist = document.getElementById('adas-target-dist');
    const adasSteeringStatus = document.getElementById('adas-steering-status');

    const adasGuidePanel = document.getElementById('adas-guide-panel');
    const adasGuideInstruction = document.getElementById('adas-guide-instruction');

    const adasCardSpeed = document.getElementById('adas-card-speed');
    const adasCardBrake = document.getElementById('adas-card-brake');

    let adasSimId = null;
    const adasState = {
        speed: 60,
        brake: 0,
        alertness: 98,
        activeThreat: null, // null, 'cattle', 'pothole', 'rickshaw'
        threatDist: 100,
        laneOffset: 0,
        steerCorrection: 'Center Alignment',
        steerAngle: 0,
        weather: 'clear',
        keys: {}
    };

    // Keyboard controls listeners for ADAS steering and throttle
    window.addEventListener('keydown', e => {
        if (state.activeTab === 'adas-simulator') {
            adasState.keys[e.key] = true;
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                e.preventDefault(); // prevent window scrolling
            }
        }
    });

    window.addEventListener('keyup', e => {
        if (state.activeTab === 'adas-simulator') {
            adasState.keys[e.key] = false;
        }
    });

    // Touch steer support for mobile canvas clicks
    if (adasCanvas) {
        adasCanvas.addEventListener('mousedown', e => {
            const rect = adasCanvas.getBoundingClientRect();
            const clickX = e.clientX - rect.left;
            if (clickX < rect.width / 2) {
                adasState.keys['ArrowLeft'] = true;
            } else {
                adasState.keys['ArrowRight'] = true;
            }
        });
        adasCanvas.addEventListener('mouseup', () => {
            adasState.keys['ArrowLeft'] = false;
            adasState.keys['ArrowRight'] = false;
        });
        adasCanvas.addEventListener('touchstart', e => {
            const rect = adasCanvas.getBoundingClientRect();
            const touchX = e.touches[0].clientX - rect.left;
            if (touchX < rect.width / 2) {
                adasState.keys['ArrowLeft'] = true;
            } else {
                adasState.keys['ArrowRight'] = true;
            }
        });
        adasCanvas.addEventListener('touchend', () => {
            adasState.keys['ArrowLeft'] = false;
            adasState.keys['ArrowRight'] = false;
        });
    }

    function initAdasSimulation() {
        if (!adasCtx) return;
        if (adasSimId) cancelAnimationFrame(adasSimId);

        adasState.speed = 60;
        adasState.brake = 0;
        adasState.activeThreat = null;
        adasState.threatDist = 100;
        adasState.steerCorrection = 'Center Alignment';
        adasState.steerAngle = 0;
        adasState.weather = 'clear';

        const adasWeatherGroup = document.getElementById('adas-weather-group');
        if (adasWeatherGroup) {
            const weatherBtns = adasWeatherGroup.querySelectorAll('button');
            weatherBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    weatherBtns.forEach(b => b.classList.remove('active-btn'));
                    btn.classList.add('active-btn');
                    
                    const weather = btn.getAttribute('data-weather');
                    adasState.weather = weather;
                    
                    if (weather === 'clear') {
                        adasState.alertness = 98;
                        adasAlertVal.textContent = '98%';
                        adasAlertVal.className = 'cpk-val text-success';
                        adasObjectAlert.textContent = "Clear Path";
                        adasObjectAlert.className = "chart-alert text-success";
                        adasGuidePanel.className = "operator-guide-box mt-4";
                        adasGuidePanel.querySelector('.badge').className = "badge badge-success";
                        adasGuidePanel.querySelector('.badge').textContent = "NOMINAL";
                        adasGuideInstruction.textContent = `"Vehicle tracking is running at baseline parameters. Speed is within normal Indian urban road limits. Steering lanes tracking is active. Keep standard safety buffers."`;
                    } else if (weather === 'rain') {
                        adasState.alertness = 95;
                        adasAlertVal.textContent = '95%';
                        adasAlertVal.className = 'cpk-val text-success';
                        adasObjectAlert.textContent = "Wet Road - Low Grip";
                        adasObjectAlert.className = "chart-alert text-warning";
                        adasGuidePanel.className = "operator-guide-box mt-4 guide-alert-border";
                        adasGuidePanel.querySelector('.badge').className = "badge status-yellow";
                        adasGuidePanel.querySelector('.badge').textContent = "RAIN ASSIST ACTIVE";
                        adasGuideInstruction.innerHTML = `<strong>Active Rain Protocol: Speed threshold restricted to 45km/h.</strong><br>
                        <em>System Safety:</em> 1. Throttle sensitivity adjusted for traction control. 2. Brake calibration primed (+15% pressure ready). 3. Electronic Stability Control enabled.`;
                    } else if (weather === 'fog') {
                        adasState.alertness = 99;
                        adasAlertVal.textContent = '99%';
                        adasAlertVal.className = 'cpk-val text-success';
                        adasObjectAlert.textContent = "Low Visibility - Radar Priority";
                        adasObjectAlert.className = "chart-alert text-warning";
                        adasGuidePanel.className = "operator-guide-box mt-4 guide-alert-border animate-pulse";
                        adasGuidePanel.querySelector('.badge').className = "badge status-yellow";
                        adasGuidePanel.querySelector('.badge').textContent = "RADAR TRACKING ON";
                        adasGuideInstruction.innerHTML = `<strong>Mist/Fog Protocol: Speed restricted to 30km/h.</strong><br>
                        <em>System Safety:</em> 1. Visual camera inputs blended with millimeter-wave radar tracking. 2. Adaptive cruise distance buffer doubled. 3. Active thermal sensor imaging enabled.`;
                    } else if (weather === 'night') {
                        adasState.alertness = 90;
                        adasAlertVal.textContent = '90%';
                        adasAlertVal.className = 'cpk-val text-warning';
                        adasObjectAlert.textContent = "Low Light - IR Camera active";
                        adasObjectAlert.className = "chart-alert text-success";
                        adasGuidePanel.className = "operator-guide-box mt-4 guide-alert-border";
                        adasGuidePanel.querySelector('.badge').className = "badge badge-success";
                        adasGuidePanel.querySelector('.badge').textContent = "NIGHT VISION ACTIVE";
                        adasGuideInstruction.innerHTML = `<strong>Night Driving Protocol: High-beam assist and IR cameras tracking.</strong><br>
                        <em>System Safety:</em> 1. Infrared vision pipeline running at 60 FPS. 2. Low-light lane edge tracing algorithm enabled. 3. Anti-glare windshield filter active.`;
                    }
                });
            });
        }

        function drawWindshieldFeed() {
            if (state.activeTab !== 'adas-simulator') return;

            // Clear screen
            adasCtx.fillStyle = '#0f172a'; // sky dark blue
            adasCtx.fillRect(0, 0, adasCanvas.width, adasCanvas.height);

            // Draw sky stars / mountain silhouettes
            adasCtx.fillStyle = '#020617';
            adasCtx.beginPath();
            adasCtx.moveTo(0, 140);
            adasCtx.lineTo(100, 110);
            adasCtx.lineTo(200, 130);
            adasCtx.lineTo(320, 100);
            adasCtx.lineTo(480, 140);
            adasCtx.lineTo(480, 280);
            adasCtx.lineTo(0, 280);
            adasCtx.fill();

            // Draw road boundaries (perspective)
            adasCtx.fillStyle = '#1e293b'; // asphalt
            adasCtx.beginPath();
            adasCtx.moveTo(240, 140); // horizon center
            adasCtx.lineTo(240, 140);
            adasCtx.lineTo(480, 280); // bottom right
            adasCtx.lineTo(0, 280); // bottom left
            adasCtx.closePath();
            adasCtx.fill();

            // Night mode darkness overlay & light cones (applied on asphalt)
            if (adasState.weather === 'night') {
                adasCtx.fillStyle = 'rgba(3, 7, 18, 0.85)';
                adasCtx.fillRect(0, 0, adasCanvas.width, adasCanvas.height);

                // Headlight Left cone
                const gradLeft = adasCtx.createRadialGradient(160, 280, 10, 160, 280, 180);
                gradLeft.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
                gradLeft.addColorStop(1, 'rgba(254, 240, 138, 0)');
                adasCtx.fillStyle = gradLeft;
                adasCtx.beginPath();
                adasCtx.moveTo(240, 140);
                adasCtx.lineTo(40, 280);
                adasCtx.lineTo(280, 280);
                adasCtx.closePath();
                adasCtx.fill();

                // Headlight Right cone
                const gradRight = adasCtx.createRadialGradient(320, 280, 10, 320, 280, 180);
                gradRight.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
                gradRight.addColorStop(1, 'rgba(254, 240, 138, 0)');
                adasCtx.fillStyle = gradRight;
                adasCtx.beginPath();
                adasCtx.moveTo(240, 140);
                adasCtx.lineTo(200, 280);
                adasCtx.lineTo(440, 280);
                adasCtx.closePath();
                adasCtx.fill();
            }

            // Keyboard Interactive controls steering angle mapping
            if (adasState.keys['ArrowLeft']) {
                adasState.steerAngle -= 1.5;
                adasState.steerCorrection = "Manual Left";
            } else if (adasState.keys['ArrowRight']) {
                adasState.steerAngle += 1.5;
                adasState.steerCorrection = "Manual Right";
            }
            if (adasState.keys['ArrowUp']) {
                const limit = adasState.weather === 'rain' ? 45 : (adasState.weather === 'fog' ? 30 : (adasState.weather === 'night' ? 50 : 80));
                if (adasState.speed < limit) adasState.speed += 1.2;
            } else if (adasState.keys['ArrowDown']) {
                adasState.speed -= 2;
                adasState.brake = 40;
            }

            // Auto-Lane-Keeping Assist (LKA) visual boundary limits checks
            if (Math.abs(adasState.steerAngle) > 30) {
                adasState.steerCorrection = "ADAS LKA Correcting";
                adasState.steerAngle += adasState.steerAngle > 0 ? -1.2 : 1.2;
                
                // Draw flashing red Lane Assist margins
                adasCtx.strokeStyle = 'rgba(239, 68, 68, 0.6)';
                adasCtx.lineWidth = 15;
                adasCtx.beginPath();
                adasCtx.moveTo(10, 10);
                adasCtx.lineTo(10, adasCanvas.height - 10);
                adasCtx.moveTo(adasCanvas.width - 10, 10);
                adasCtx.lineTo(adasCanvas.width - 10, adasCanvas.height - 10);
                adasCtx.stroke();
            }

            // Animation lane offset increment
            adasState.laneOffset += adasState.speed * 0.15;
            if (adasState.laneOffset > 60) adasState.laneOffset = 0;

            // Draw lane lines
            adasCtx.strokeStyle = adasState.weather === 'night' ? 'rgba(255,255,255,0.7)' : '#94a3b8';
            adasCtx.lineWidth = 2;
            adasCtx.beginPath();
            adasCtx.moveTo(240, 140);
            adasCtx.lineTo(180 + adasState.steerAngle * 1.5, 280);
            adasCtx.moveTo(240, 140);
            adasCtx.lineTo(300 + adasState.steerAngle * 1.5, 280);
            adasCtx.stroke();

            // Draw dotted center lines (perspective animate)
            adasCtx.strokeStyle = adasState.weather === 'night' ? 'rgba(254, 240, 138, 0.8)' : '#ffffff';
            adasCtx.lineWidth = 4;
            for (let y = 140; y < 280; y += 20) {
                const animY = y + (adasState.laneOffset * ((y - 140) / 140));
                if (animY > 280) continue;
                
                // perspective width
                const len = 8 * ((animY - 140) / 140);
                const xOffset = adasState.steerAngle * ((animY - 140) / 140);
                const x = 240 + xOffset;

                adasCtx.beginPath();
                adasCtx.moveTo(x, animY);
                adasCtx.lineTo(x, animY + len);
                adasCtx.stroke();
            }

            // Animate threat obstacle
            if (adasState.activeThreat) {
                adasState.threatDist -= adasState.speed * 0.08;
                if (adasState.threatDist < 5) adasState.threatDist = 5;

                // perspective size and position calculation
                const factor = (100 - adasState.threatDist) / 100;
                const threatSize = 10 + factor * 80;
                const threatY = 140 + factor * 120;
                
                let threatX = 240 + adasState.steerAngle * factor;
                if (adasState.activeThreat === 'rickshaw') threatX = (200 + factor * 20) + adasState.steerAngle * factor;
                
                // Draw threat shapes
                adasCtx.shadowBlur = 10;
                
                let confMult = 1.0;
                if (adasState.weather === 'rain') confMult = 0.8;
                else if (adasState.weather === 'fog') confMult = 0.65;
                else if (adasState.weather === 'night') confMult = 0.85;

                if (adasState.activeThreat === 'cattle') {
                    adasCtx.fillStyle = '#78350f';
                    adasCtx.shadowColor = '#78350f';
                    adasCtx.fillRect(threatX - threatSize/2, threatY - threatSize/3, threatSize, threatSize/2);
                    adasCtx.fillStyle = '#b45309';
                    adasCtx.fillRect(threatX - threatSize/2 - threatSize/4, threatY - threatSize/2, threatSize/3, threatSize/3);
                    adasCtx.fillStyle = '#451a03';
                    adasCtx.fillRect(threatX - threatSize/3, threatY + threatSize/6, threatSize/8, threatSize/4);
                    adasCtx.fillRect(threatX + threatSize/4, threatY + threatSize/6, threatSize/8, threatSize/4);

                    adasCtx.strokeStyle = 'var(--color-danger)';
                    adasCtx.lineWidth = 2.5;
                    adasCtx.strokeRect(threatX - threatSize/2 - 10, threatY - threatSize/2 - 5, threatSize + 20, threatSize + 15);
                    
                    adasCtx.fillStyle = 'rgba(239, 68, 68, 0.85)';
                    adasCtx.fillRect(threatX - threatSize/2 - 10, threatY - threatSize/2 - 25, 110, 20);
                    adasCtx.fillStyle = '#ffffff';
                    adasCtx.font = 'bold 8px var(--font-body)';
                    adasCtx.fillText(`STRAY CATTLE [${Math.round(99 * confMult)}%]`, threatX - threatSize/2 - 5, threatY - threatSize/2 - 12);
                } 
                else if (adasState.activeThreat === 'pothole') {
                    adasCtx.fillStyle = '#020617';
                    adasCtx.shadowColor = '#000';
                    adasCtx.beginPath();
                    adasCtx.ellipse(threatX, threatY + 10, threatSize/2, threatSize/4, 0, 0, Math.PI * 2);
                    adasCtx.fill();
                    
                    adasCtx.strokeStyle = '#475569';
                    adasCtx.lineWidth = 1.5;
                    adasCtx.beginPath();
                    adasCtx.ellipse(threatX, threatY + 10, threatSize/2, threatSize/4, 0, 0, Math.PI * 2);
                    adasCtx.stroke();

                    adasCtx.strokeStyle = 'var(--color-warning)';
                    adasCtx.lineWidth = 2;
                    adasCtx.strokeRect(threatX - threatSize/2 - 5, threatY - threatSize/4 + 2, threatSize + 10, threatSize/2 + 8);
                    
                    adasCtx.fillStyle = 'rgba(245, 158, 11, 0.9)';
                    adasCtx.fillRect(threatX - threatSize/2 - 5, threatY - threatSize/4 - 15, 100, 16);
                    adasCtx.fillStyle = '#ffffff';
                    adasCtx.font = 'bold 8px var(--font-body)';
                    adasCtx.fillText(`DEEP POTHOLE [${Math.round(94 * confMult)}%]`, threatX - threatSize/2, threatY - threatSize/4 - 4);
                } 
                else if (adasState.activeThreat === 'rickshaw') {
                    adasCtx.fillStyle = '#eab308';
                    adasCtx.shadowColor = '#eab308';
                    adasCtx.fillRect(threatX - threatSize/2, threatY - threatSize/3, threatSize, threatSize/3);
                    adasCtx.fillStyle = '#1e293b';
                    adasCtx.fillRect(threatX - threatSize/2, threatY, threatSize, threatSize/4);
                    adasCtx.fillStyle = '#38bdf8';
                    adasCtx.fillRect(threatX - threatSize/3, threatY - threatSize/4, threatSize * 0.6, threatSize/8);

                    adasCtx.strokeStyle = 'var(--color-danger)';
                    adasCtx.lineWidth = 2.5;
                    adasCtx.strokeRect(threatX - threatSize/2 - 5, threatY - threatSize/3 - 10, threatSize + 10, threatSize * 0.7);
                    
                    adasCtx.fillStyle = 'rgba(239, 68, 68, 0.85)';
                    adasCtx.fillRect(threatX - threatSize/2 - 5, threatY - threatSize/3 - 28, 120, 18);
                    adasCtx.fillStyle = '#ffffff';
                    adasCtx.font = 'bold 8px var(--font-body)';
                    adasCtx.fillText(`RICKSHAW CUT-IN [${Math.round(96 * confMult)}%]`, threatX - threatSize/2, threatY - threatSize/3 - 16);
                }

                adasCtx.shadowBlur = 0;

                // Active Emergency Braking (AEB) trigger overrides if user fails to brake
                if (adasState.threatDist < 30) {
                    adasState.speed -= 4.5;
                    adasState.brake = 100;
                    adasState.steerCorrection = "ADAS AEB OVERRIDE";
                    
                    adasObjectAlert.textContent = "EMERGENCY BRAKING TRIGGERED";
                    adasObjectAlert.className = "chart-alert text-danger";
                    
                    adasCardSpeed.className = "cpk-card alert-border animate-pulse";
                    adasCardBrake.className = "cpk-card alert-border animate-pulse";
                }
                else {
                    if (adasState.activeThreat === 'cattle') {
                        adasState.speed -= 2.2;
                        adasState.brake = 80;
                        adasState.steerCorrection = 'Avoidance Swerve';
                    } 
                    else if (adasState.activeThreat === 'pothole') {
                        adasState.speed -= 1.8;
                        adasState.brake = 35;
                        adasState.steerCorrection = 'Nudge Left';
                    } 
                    else if (adasState.activeThreat === 'rickshaw') {
                        adasState.speed -= 1.5;
                        adasState.brake = 60;
                        adasState.steerCorrection = 'Avoidance Right';
                    }
                }

                if (adasState.speed < 0) adasState.speed = 0;
            } else {
                let cruiseSpeed = 60;
                if (adasState.weather === 'rain') cruiseSpeed = 45;
                else if (adasState.weather === 'fog') cruiseSpeed = 30;
                else if (adasState.weather === 'night') cruiseSpeed = 50;

                if (adasState.speed < cruiseSpeed) {
                    adasState.speed += 0.8;
                } else if (adasState.speed > cruiseSpeed) {
                    adasState.speed -= 0.8;
                }
                
                if (!adasState.keys['ArrowDown']) adasState.brake = 0;
                if (!adasState.keys['ArrowLeft'] && !adasState.keys['ArrowRight']) {
                    adasState.steerCorrection = 'Center Alignment';
                    if (adasState.steerAngle < 0) adasState.steerAngle += 1;
                    else if (adasState.steerAngle > 0) adasState.steerAngle -= 1;
                }
            }

            // Weather Particles draw layers
            if (adasState.weather === 'rain') {
                adasCtx.strokeStyle = 'rgba(156, 163, 175, 0.4)';
                adasCtx.lineWidth = 1;
                for (let i = 0; i < 40; i++) {
                    const rx = Math.random() * adasCanvas.width;
                    const ry = Math.random() * adasCanvas.height;
                    adasCtx.beginPath();
                    adasCtx.moveTo(rx, ry);
                    adasCtx.lineTo(rx - 4, ry + 12);
                    adasCtx.stroke();
                }
                adasCtx.fillStyle = 'rgba(239, 68, 68, 0.85)';
                adasCtx.fillRect(adasCanvas.width - 130, 20, 110, 16);
                adasCtx.fillStyle = '#ffffff';
                adasCtx.font = 'bold 8px var(--font-body)';
                adasCtx.fillText('WEATHER: HEAVY RAIN', adasCanvas.width - 120, 30);
            } 
            else if (adasState.weather === 'fog') {
                adasCtx.fillStyle = 'rgba(226, 232, 240, 0.35)';
                adasCtx.fillRect(0, 0, adasCanvas.width, adasCanvas.height);
                adasCtx.fillStyle = 'rgba(245, 158, 11, 0.85)';
                adasCtx.fillRect(adasCanvas.width - 130, 20, 110, 16);
                adasCtx.fillStyle = '#ffffff';
                adasCtx.font = 'bold 8px var(--font-body)';
                adasCtx.fillText('WEATHER: HEAVY FOG', adasCanvas.width - 120, 30);
            } 
            else if (adasState.weather === 'night') {
                adasCtx.fillStyle = 'rgba(144, 101, 255, 0.85)';
                adasCtx.fillRect(adasCanvas.width - 130, 20, 110, 16);
                adasCtx.fillStyle = '#ffffff';
                adasCtx.font = 'bold 8px var(--font-body)';
                adasCtx.fillText('WEATHER: NIGHT VISION', adasCanvas.width - 120, 30);
            }

            // Draw Windshield grid boundary frame (HUD look)
            adasCtx.strokeStyle = 'rgba(0, 242, 254, 0.15)';
            adasCtx.lineWidth = 2;
            adasCtx.strokeRect(10, 10, adasCanvas.width - 20, adasCanvas.height - 20);

            // Windshield corner brackets
            adasCtx.strokeStyle = 'var(--color-teal)';
            adasCtx.lineWidth = 3;
            adasCtx.beginPath(); adasCtx.moveTo(25, 15); adasCtx.lineTo(15, 15); adasCtx.lineTo(15, 25); adasCtx.stroke();
            adasCtx.beginPath(); adasCtx.moveTo(adasCanvas.width - 25, 15); adasCtx.lineTo(adasCanvas.width - 15, 15); adasCtx.lineTo(adasCanvas.width - 15, 25); adasCtx.stroke();

            // Update DOM telemetry panels
            adasSpeedVal.textContent = `${Math.round(adasState.speed)} km/h`;
            adasBrakeVal.textContent = `${adasState.brake}%`;
            
            adasTargetName.textContent = adasState.activeThreat ? adasState.activeThreat.toUpperCase() : 'NONE';
            adasTargetDist.textContent = adasState.activeThreat ? `${Math.round(adasState.threatDist)} m` : 'N/A';
            adasSteeringStatus.textContent = adasState.steerCorrection;

            adasSimId = requestAnimationFrame(drawWindshieldFeed);
        }

        drawWindshieldFeed();
    }

    if (triggerCattleBtn) {
        triggerCattleBtn.addEventListener('click', () => {
            adasState.activeThreat = 'cattle';
            adasState.threatDist = 85;
            
            triggerCattleBtn.className = "btn btn-outline btn-sm active-btn";
            triggerPotholeBtn.className = "btn btn-outline btn-sm";
            triggerRickshawBtn.className = "btn btn-outline btn-sm";

            adasHudOverlay.classList.remove('hidden');
            adasHudText.textContent = "Stray Cow detected at 85m. AEB braking activated.";

            adasObjectAlert.textContent = "EMERGENCY BRAKING";
            adasObjectAlert.className = "chart-alert text-danger";

            adasCardSpeed.className = "cpk-card alert-border";
            adasCardBrake.className = "cpk-card alert-border animate-pulse";

            adasGuidePanel.className = "operator-guide-box mt-4 guide-alert-border animate-pulse";
            const badge = adasGuidePanel.querySelector('.badge');
            badge.className = "badge badge-pulse text-danger";
            badge.textContent = "COLLISION ALERT";

            adasGuideInstruction.innerHTML = `<strong>Mitigation Sequence: Automatic Emergency Braking (AEB) initiated.</strong><br>
            <em>Safety Output:</em> 1. Throttle cut. 2. 100% Brake pressure applied. 3. Active DMS sensor tracking steering wheel swerve torque limits.`;
        });
    }

    if (triggerPotholeBtn) {
        triggerPotholeBtn.addEventListener('click', () => {
            adasState.activeThreat = 'pothole';
            adasState.threatDist = 80;

            triggerPotholeBtn.className = "btn btn-outline btn-sm active-btn";
            triggerCattleBtn.className = "btn btn-outline btn-sm";
            triggerRickshawBtn.className = "btn btn-outline btn-sm";

            adasHudOverlay.classList.remove('hidden');
            adasHudText.textContent = "Deep Pothole detected at 80m. Adjusting steering.";

            adasObjectAlert.textContent = "POTHOLE DETECTED";
            adasObjectAlert.className = "chart-alert text-warning";

            adasCardSpeed.className = "cpk-card";
            adasCardBrake.className = "cpk-card alert-border";

            adasGuidePanel.className = "operator-guide-box mt-4 guide-alert-border";
            const badge = adasGuidePanel.querySelector('.badge');
            badge.className = "badge status-yellow";
            badge.textContent = "ADAPTIVE STEERING";

            adasGuideInstruction.innerHTML = `<strong>Mitigation Sequence: Active suspension dampening & Left Lane steering correction.</strong><br>
            <em>Safety Output:</em> 1. Regenerative coasting initiated. 2. Steering torque corrected 15% left to straddle crater. 3. Dampening stiffness increased.`;
        });
    }

    if (triggerRickshawBtn) {
        triggerRickshawBtn.addEventListener('click', () => {
            adasState.activeThreat = 'rickshaw';
            adasState.threatDist = 75;

            triggerRickshawBtn.className = "btn btn-outline btn-sm active-btn";
            triggerCattleBtn.className = "btn btn-outline btn-sm";
            triggerPotholeBtn.className = "btn btn-outline btn-sm";

            adasHudOverlay.classList.remove('hidden');
            adasHudText.textContent = "Rickshaw Lane cut-in at 75m. Right steering deviation.";

            adasObjectAlert.textContent = "LANE CUT-IN DETECTED";
            adasObjectAlert.className = "chart-alert text-danger";

            adasCardSpeed.className = "cpk-card alert-border";
            adasCardBrake.className = "cpk-card alert-border";

            adasGuidePanel.className = "operator-guide-box mt-4 guide-alert-border animate-pulse";
            const badge = adasGuidePanel.querySelector('.badge');
            badge.className = "badge badge-pulse text-danger";
            badge.textContent = "STEERING OVERRIDE";

            adasGuideInstruction.innerHTML = `<strong>Mitigation Sequence: Forward Collision Alert (FCA) & Auto Right lane swerve.</strong><br>
            <em>Safety Output:</em> 1. Steering correction +18 degrees right. 2. 60% Brake applied to slide vehicle behind rickshaw trajectory gap.`;
        });
    }

    if (resetAdasBtn) {
        resetAdasBtn.addEventListener('click', resetAdasToBaseline);
    }

    function resetAdasToBaseline() {
        adasState.activeThreat = null;
        adasState.threatDist = 100;
        adasState.speed = 60;
        adasState.brake = 0;
        adasState.steerCorrection = 'Center Alignment';
        adasState.steerAngle = 0;
        adasState.weather = 'clear';

        const adasWeatherGroup = document.getElementById('adas-weather-group');
        if (adasWeatherGroup) {
            const weatherBtns = adasWeatherGroup.querySelectorAll('button');
            weatherBtns.forEach(btn => btn.classList.remove('active-btn'));
            const clearBtn = document.getElementById('weather-clear');
            if (clearBtn) clearBtn.classList.add('active-btn');
        }

        adasState.alertness = 98;
        if (adasAlertVal) {
            adasAlertVal.textContent = '98%';
            adasAlertVal.className = 'cpk-val text-success';
        }

        triggerCattleBtn.className = "btn btn-outline btn-sm";
        triggerPotholeBtn.className = "btn btn-outline btn-sm";
        triggerRickshawBtn.className = "btn btn-outline btn-sm";

        adasHudOverlay.classList.add('hidden');

        adasObjectAlert.textContent = "Clear Path";
        adasObjectAlert.className = "chart-alert text-success";

        adasCardSpeed.className = "cpk-card";
        adasCardBrake.className = "cpk-card";

        adasGuidePanel.className = "operator-guide-box mt-4";
        const badge = adasGuidePanel.querySelector('.badge');
        if (badge) {
            badge.className = "badge badge-success";
            badge.textContent = "NOMINAL";
        }

        adasGuideInstruction.textContent = `"Vehicle tracking is running at baseline parameters. Speed is within normal Indian urban road limits. Steering lanes tracking is active. Keep standard safety buffers."`;
    }


    /* ==========================================================================
       8. Module 7: Passport-AI Battery Digital Passport Explorer (Multi-UID registry)
       ========================================================================== */
    const btnStartScan = document.getElementById('btn-start-scan');
    const passportLaser = document.getElementById('passport-laser');
    const batteryMesh = document.getElementById('battery-mesh');
    const batteryIconPulse = document.getElementById('battery-icon-pulse');
    const scannerIndicator = document.getElementById('scanner-indicator');
    const passportUidSelector = document.getElementById('passport-uid-selector');
    
    const passportEmptyState = document.getElementById('passport-empty-state');
    const passportResults = document.getElementById('passport-results');

    // Decentralized Battery profiles mock database
    const passportRegistry = {
        'EV-BAT-8092-NMC': {
            uid: '8092',
            chemistry: 'Lithium NMC 811',
            details: `
                <div class="results-section">
                    <h4 class="section-sub-title"><i class="fa-solid fa-atom text-success"></i> Battery Cell Chemistry (NMC 811)</h4>
                    <div class="supplier-stats-grid mt-2" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem;">
                        <div class="stat-item-box" style="padding: 0.5rem; text-align: center; border: 1px solid var(--border-muted); border-radius: 8px;">
                            <span class="stat-lbl" style="font-size: 0.6rem; color: #64748b; text-transform: uppercase;">Nickel</span>
                            <span class="stat-val text-success" style="font-family: var(--font-heading); font-weight: 700; font-size: 0.95rem; display: block; margin-top: 0.25rem;">80%</span>
                        </div>
                        <div class="stat-item-box" style="padding: 0.5rem; text-align: center; border: 1px solid var(--border-muted); border-radius: 8px;">
                            <span class="stat-lbl" style="font-size: 0.6rem; color: #64748b; text-transform: uppercase;">Manganese</span>
                            <span class="stat-val text-success" style="font-family: var(--font-heading); font-weight: 700; font-size: 0.95rem; display: block; margin-top: 0.25rem;">10%</span>
                        </div>
                        <div class="stat-item-box" style="padding: 0.5rem; text-align: center; border: 1px solid var(--border-muted); border-radius: 8px;">
                            <span class="stat-lbl" style="font-size: 0.6rem; color: #64748b; text-transform: uppercase;">Cobalt</span>
                            <span class="stat-val text-success" style="font-family: var(--font-heading); font-weight: 700; font-size: 0.95rem; display: block; margin-top: 0.25rem;">10%</span>
                        </div>
                        <div class="stat-item-box" style="padding: 0.5rem; text-align: center; border: 1px solid var(--border-muted); border-radius: 8px;">
                            <span class="stat-lbl" style="font-size: 0.6rem; color: #64748b; text-transform: uppercase;">Lithium</span>
                            <span class="stat-val text-success" style="font-family: var(--font-heading); font-weight: 700; font-size: 0.95rem; display: block; margin-top: 0.25rem;">100%</span>
                        </div>
                    </div>
                </div>
                <div class="results-section mt-4">
                    <h4 class="section-sub-title"><i class="fa-solid fa-arrows-spin text-success"></i> Circular Lifecycle & SOH Metrics</h4>
                    <div class="supplier-stats-grid mt-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                        <div class="stat-item-box" style="padding: 0.65rem; border: 1px solid var(--border-muted); border-radius: 8px;">
                            <span class="stat-lbl" style="font-size: 0.65rem; color: #64748b; text-transform: uppercase;">Recyclability Index</span>
                            <span class="stat-val text-success" style="font-family: var(--font-heading); font-size: 1.1rem; font-weight: 700; display: block; margin-top: 0.25rem;">94.2%</span>
                        </div>
                        <div class="stat-item-box" style="padding: 0.65rem; border: 1px solid var(--border-muted); border-radius: 8px;">
                            <span class="stat-lbl" style="font-size: 0.65rem; color: #64748b; text-transform: uppercase;">Second-Life SOH Prediction</span>
                            <span class="stat-val text-success" style="font-family: var(--font-heading); font-size: 1.1rem; font-weight: 700; display: block; margin-top: 0.25rem;">Grade A (92% Health)</span>
                        </div>
                    </div>
                </div>
                <div class="results-section mt-4">
                    <h4 class="section-sub-title"><i class="fa-solid fa-link text-success"></i> Scope 3 Blockchain Provenance</h4>
                    <div class="risk-bullets mt-2" style="font-size: 0.7rem; gap: 0.35rem; display: flex; flex-direction: column;">
                        <div style="display: flex; gap: 0.5rem; color: #cbd5e1;"><i class="fa-solid fa-check-double text-success"></i> <span>Extraction: Atacama Desert Lithium Mine (Ethical Sourcing Verified)</span></div>
                        <div style="display: flex; gap: 0.5rem; color: #cbd5e1;"><i class="fa-solid fa-check-double text-success"></i> <span>Smelting: Aussie Mineral Clean Smelter (Green Hydrogen Audit Verified)</span></div>
                        <div style="display: flex; gap: 0.5rem; color: #cbd5e1;"><i class="fa-solid fa-check-double text-success"></i> <span>Assembly: Pune Tab Welding Station 4 (Cpk: 1.54 Verified)</span></div>
                    </div>
                </div>`
        },
        'EV-BAT-4412-LFP': {
            uid: '4412',
            chemistry: 'Lithium Iron Phosphate (LFP)',
            details: `
                <div class="results-section">
                    <h4 class="section-sub-title"><i class="fa-solid fa-atom text-success"></i> Battery Cell Chemistry (LFP)</h4>
                    <div class="supplier-stats-grid mt-2" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem;">
                        <div class="stat-item-box" style="padding: 0.5rem; text-align: center; border: 1px solid var(--border-muted); border-radius: 8px;">
                            <span class="stat-lbl" style="font-size: 0.6rem; color: #64748b; text-transform: uppercase;">Iron</span>
                            <span class="stat-val text-success" style="font-family: var(--font-heading); font-weight: 700; font-size: 0.95rem; display: block; margin-top: 0.25rem;">100%</span>
                        </div>
                        <div class="stat-item-box" style="padding: 0.5rem; text-align: center; border: 1px solid var(--border-muted); border-radius: 8px;">
                            <span class="stat-lbl" style="font-size: 0.6rem; color: #64748b; text-transform: uppercase;">Phosphate</span>
                            <span class="stat-val text-success" style="font-family: var(--font-heading); font-weight: 700; font-size: 0.95rem; display: block; margin-top: 0.25rem;">100%</span>
                        </div>
                        <div class="stat-item-box" style="padding: 0.5rem; text-align: center; border: 1px solid var(--border-muted); border-radius: 8px;">
                            <span class="stat-lbl" style="font-size: 0.6rem; color: #64748b; text-transform: uppercase;">Cobalt</span>
                            <span class="stat-val text-success" style="font-family: var(--font-heading); font-weight: 700; font-size: 0.95rem; display: block; margin-top: 0.25rem;">0% (Cobalt-Free)</span>
                        </div>
                        <div class="stat-item-box" style="padding: 0.5rem; text-align: center; border: 1px solid var(--border-muted); border-radius: 8px;">
                            <span class="stat-lbl" style="font-size: 0.6rem; color: #64748b; text-transform: uppercase;">Lithium</span>
                            <span class="stat-val text-success" style="font-family: var(--font-heading); font-weight: 700; font-size: 0.95rem; display: block; margin-top: 0.25rem;">100%</span>
                        </div>
                    </div>
                </div>
                <div class="results-section mt-4">
                    <h4 class="section-sub-title"><i class="fa-solid fa-arrows-spin text-success"></i> Circular Lifecycle & SOH Metrics</h4>
                    <div class="supplier-stats-grid mt-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                        <div class="stat-item-box" style="padding: 0.65rem; border: 1px solid var(--border-muted); border-radius: 8px;">
                            <span class="stat-lbl" style="font-size: 0.65rem; color: #64748b; text-transform: uppercase;">Recyclability Index</span>
                            <span class="stat-val text-success" style="font-family: var(--font-heading); font-size: 1.1rem; font-weight: 700; display: block; margin-top: 0.25rem;">98.7%</span>
                        </div>
                        <div class="stat-item-box" style="padding: 0.65rem; border: 1px solid var(--border-muted); border-radius: 8px;">
                            <span class="stat-lbl" style="font-size: 0.65rem; color: #64748b; text-transform: uppercase;">Second-Life SOH Prediction</span>
                            <span class="stat-val text-success" style="font-family: var(--font-heading); font-size: 1.1rem; font-weight: 700; display: block; margin-top: 0.25rem;">Grade A+ (97% Health)</span>
                        </div>
                    </div>
                </div>
                <div class="results-section mt-4">
                    <h4 class="section-sub-title"><i class="fa-solid fa-link text-success"></i> Scope 3 Blockchain Provenance</h4>
                    <div class="risk-bullets mt-2" style="font-size: 0.7rem; gap: 0.35rem; display: flex; flex-direction: column;">
                        <div style="display: flex; gap: 0.5rem; color: #cbd5e1;"><i class="fa-solid fa-check-double text-success"></i> <span>Extraction: Western Australian Lithium Mine (Green Mining Audit Verified)</span></div>
                        <div style="display: flex; gap: 0.5rem; color: #cbd5e1;"><i class="fa-solid fa-check-double text-success"></i> <span>Synthesis: Indian Local LFP Cathode Plant (Zero Emissions Smelter)</span></div>
                        <div style="display: flex; gap: 0.5rem; color: #cbd5e1;"><i class="fa-solid fa-check-double text-success"></i> <span>Assembly: Pune Tab Welding Station 2 (Cpk: 1.48 Verified)</span></div>
                    </div>
                </div>`
        },
        'EV-BAT-5590-SOLID': {
            uid: '5590',
            chemistry: 'Solid-State (Silicon Anode)',
            details: `
                <div class="results-section">
                    <h4 class="section-sub-title"><i class="fa-solid fa-atom text-success"></i> Battery Cell Chemistry (Solid-State)</h4>
                    <div class="supplier-stats-grid mt-2" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 0.5rem;">
                        <div class="stat-item-box" style="padding: 0.5rem; text-align: center; border: 1px solid var(--border-muted); border-radius: 8px;">
                            <span class="stat-lbl" style="font-size: 0.6rem; color: #64748b; text-transform: uppercase;">Silicon</span>
                            <span class="stat-val text-success" style="font-family: var(--font-heading); font-weight: 700; font-size: 0.95rem; display: block; margin-top: 0.25rem;">100%</span>
                        </div>
                        <div class="stat-item-box" style="padding: 0.5rem; text-align: center; border: 1px solid var(--border-muted); border-radius: 8px;">
                            <span class="stat-lbl" style="font-size: 0.6rem; color: #64748b; text-transform: uppercase;">Sulfide Solid</span>
                            <span class="stat-val text-success" style="font-family: var(--font-heading); font-weight: 700; font-size: 0.95rem; display: block; margin-top: 0.25rem;">100%</span>
                        </div>
                        <div class="stat-item-box" style="padding: 0.5rem; text-align: center; border: 1px solid var(--border-muted); border-radius: 8px;">
                            <span class="stat-lbl" style="font-size: 0.6rem; color: #64748b; text-transform: uppercase;">Manganese</span>
                            <span class="stat-val text-success" style="font-family: var(--font-heading); font-weight: 700; font-size: 0.95rem; display: block; margin-top: 0.25rem;">10%</span>
                        </div>
                        <div class="stat-item-box" style="padding: 0.5rem; text-align: center; border: 1px solid var(--border-muted); border-radius: 8px;">
                            <span class="stat-lbl" style="font-size: 0.6rem; color: #64748b; text-transform: uppercase;">Lithium</span>
                            <span class="stat-val text-success" style="font-family: var(--font-heading); font-weight: 700; font-size: 0.95rem; display: block; margin-top: 0.25rem;">100%</span>
                        </div>
                    </div>
                </div>
                <div class="results-section mt-4">
                    <h4 class="section-sub-title"><i class="fa-solid fa-arrows-spin text-success"></i> Circular Lifecycle & SOH Metrics</h4>
                    <div class="supplier-stats-grid mt-2" style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                        <div class="stat-item-box" style="padding: 0.65rem; border: 1px solid var(--border-muted); border-radius: 8px;">
                            <span class="stat-lbl" style="font-size: 0.65rem; color: #64748b; text-transform: uppercase;">Recyclability Index</span>
                            <span class="stat-val text-success" style="font-family: var(--font-heading); font-size: 1.1rem; font-weight: 700; display: block; margin-top: 0.25rem;">89.4%</span>
                        </div>
                        <div class="stat-item-box" style="padding: 0.65rem; border: 1px solid var(--border-muted); border-radius: 8px;">
                            <span class="stat-lbl" style="font-size: 0.65rem; color: #64748b; text-transform: uppercase;">Second-Life SOH Prediction</span>
                            <span class="stat-val text-success" style="font-family: var(--font-heading); font-size: 1.1rem; font-weight: 700; display: block; margin-top: 0.25rem;">Grade B (88% Health)</span>
                        </div>
                    </div>
                </div>
                <div class="results-section mt-4">
                    <h4 class="section-sub-title"><i class="fa-solid fa-link text-success"></i> Scope 3 Blockchain Provenance</h4>
                    <div class="risk-bullets mt-2" style="font-size: 0.7rem; gap: 0.35rem; display: flex; flex-direction: column;">
                        <div style="display: flex; gap: 0.5rem; color: #cbd5e1;"><i class="fa-solid fa-check-double text-success"></i> <span>Extraction: California Quartz Quarry (Ethical Silica Sourced)</span></div>
                        <div style="display: flex; gap: 0.5rem; color: #cbd5e1;"><i class="fa-solid fa-check-double text-success"></i> <span>Production: Tokyo Solid Electrolyte Fab (Cleanroom Solar Power)</span></div>
                        <div style="display: flex; gap: 0.5rem; color: #cbd5e1;"><i class="fa-solid fa-check-double text-success"></i> <span>Assembly: Pune Experimental Silicon Tab Line (Cpk: 1.54 Verified)</span></div>
                    </div>
                </div>`
        }
    };

    function initMaterialPassportScan() {
        if (btnStartScan) {
            btnStartScan.className = "btn btn-primary btn-block";
            btnStartScan.innerHTML = `<i class="fa-solid fa-camera"></i> Initialize Holographic ESG Scan`;
            btnStartScan.removeAttribute('disabled');
        }
        if (passportLaser) passportLaser.classList.add('hidden');
        if (batteryMesh) batteryMesh.classList.remove('battery-active-glow');
        if (batteryIconPulse) batteryIconPulse.style.color = "#475569";
        if (scannerIndicator) {
            scannerIndicator.className = "badge badge-pulse";
            scannerIndicator.textContent = "Scanner Ready";
        }
        if (passportEmptyState) passportEmptyState.classList.remove('hidden');
        if (passportResults) passportResults.classList.add('hidden');
    }

    if (btnStartScan) {
        btnStartScan.addEventListener('click', () => {
            const selectedUID = passportUidSelector.value;
            const profile = passportRegistry[selectedUID];
            if (!profile) return;

            btnStartScan.setAttribute('disabled', 'true');
            btnStartScan.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Aligning Laser Reader...`;
            
            scannerIndicator.className = "badge status-yellow";
            scannerIndicator.textContent = "Scanning...";

            batteryMesh.classList.add('battery-active-glow');
            passportLaser.classList.remove('hidden');

            setTimeout(() => {
                passportLaser.classList.add('hidden');
                batteryMesh.classList.remove('battery-active-glow');
                batteryIconPulse.style.color = "var(--color-success)";

                scannerIndicator.className = "badge badge-success";
                scannerIndicator.textContent = `Verified: UID-${profile.uid}`;

                btnStartScan.className = "btn btn-success btn-block";
                btnStartScan.innerHTML = `<i class="fa-solid fa-shield-check"></i> ESG Scan Verified`;

                passportEmptyState.classList.add('hidden');
                passportResults.innerHTML = profile.details;
                passportResults.classList.remove('hidden');
                
                alert(`SUCCESS: battery profile lookup complete.\nMaterial Passport loaded for serial UID-${profile.uid} (${profile.chemistry}).`);
            }, 2000);
        });
    }


    /* ==========================================================================
       9. Presentation Deck Modal Workspace Editor
       ========================================================================== */
    const slideData = {
        1: {
            title: "AegisFlow AI: Resilient Supply Chain & Smart Manufacturing",
            content: "ET AutoTech Hackathon 2026\nTheme: Theme 1 - Electrification, Smart Sourcing & Zero-Defect Manufacturing\nTeam Name: Team AegisFlow\nTeam Members: Lead Architect & AI Developer\n\nSolution Outline:\nAn end-to-end operational intelligence suite integrating AltRoute-AI (geopolitical route optimization & sourcing GNNs) and VisionDetect-AI (edge computer vision welding analytics) for Indian automotive component manufacturing ecosystems."
        },
        2: {
            title: "Theme Chosen - Brief Summary & Proposed Solution/Idea",
            content: "Theme 1: Electrification & Smart Manufacturing / Sourcing Resilience\n\nProposed Solution:\nAegisFlow AI is a dual-core digital control tower for automotive manufacturing:\n1. Geopolitical Risk Hedging (AltRoute-AI): A real-time shipping risk assessment mapping and alternate raw material blend simulator (e.g., Neodymium to Ferrite ratios) with automated SAP/Oracle purchase proposals.\n2. Intelligent Edge Quality Inspect (VisionDetect-AI): 120 FPS welding camera analyzer providing real-time quality alerts, Cp/Cpk SPC dashboard tracking, and automatic robotic calibration routines.\n\nThis is a brand-new integrated control framework designed specifically to elevate local Indian suppliers (MSMEs) to high-yield Global Tier-1 sourcing standards."
        },
        3: {
            title: "IMPACT OF PROPOSED SOLUTION",
            content: "Feasibility, Scalability & Quantitative Impact:\n\n1. Operational Lead Time: 30% reduction in mineral logistics bottlenecks by predicting port blockades (Suez Canal / Taiwan Strait) and near-shoring to domestic suppliers (Hindustan Metals).\n2. Manufacturing Quality: 20% drop in weld defect scrap rate on shop floor by edge process control (Cp/Cpk target > 1.50) and active operator alerts.\n3. ESG Sustainability: 14.2% carbon reduction verified through blockchain scope 3 shipping trackers.\n4. Scalability: Highly modular client-side dashboard with zero heavy cloud dependencies, allowing easy integration for small-scale Indian auto retrofitting plants."
        },
        4: {
            title: "PROPOSED TECH STACK / ARCHITECTURE",
            content: "Front-End UI Dashboard: Vanilla HTML5, CSS Grid Systems, Javascript ES6 (Zero-Dependency Offline Execution).\nAI Inference: YOLOv8 Edge Vision models (object classification for weld defects & road threats) compiled to WebAssembly.\nResilience Engine: Graph Neural Networks (GNN) modeling global shipping ports & transit lanes risk nodes.\nIntegration Layer: Blockchain ledger contracts (Provenance traceability) + REST APIs for ERP system triggers (Oracle/SAP purchase reconciliations)."
        },
        5: {
            title: "Architecture Diagrams, Screenshots / Video Demo of Application",
            content: "Demo Details & Workspace URL:\n\n1. AltRoute-AI Map: Reroutes battery chemistry imports from China to Chile or Domestic mines during Taiwan Strait or Suez port strikes.\n2. Substitut-AI Lab: Computes performance-vs-cost tradeoffs when blending Ferrite into traction motors to avoid raw material dependencies.\n3. VisionDetect-AI: Runs a simulated live welding joint inspect camera detecting porosity, crack, and misalignment defects.\n4. ADAS Windshield Simulator: Tests lane tracking and obstacle detection (Cattle, Potholes) adapting telemetry for Indian contexts.\n5. Passport-AI: Holographic QR battery passport disclosures (Scope 3 carbon, second-life SOH grading)."
        },
        6: {
            title: "Why your solution must be considered?",
            content: "Why Choose AegisFlow AI:\n\n1. Holistic Control Tower: Uniquely bridges supply-chain risk (AltRoute-AI) directly with shop floor execution capability (VisionDetect-AI).\n2. Tailored for Emerging Markets: Addresses specific Indian contexts, e.g., domestic material substitution parameters and ADAS safeguards for stray cattle and chaotic lane cut-ins.\n3. Real-world Integration Ready: Generates live ERP purchase proposals and automates supplier email communications out-of-the-box.\n4. Low-Cost Implementation: Light, edge-executable scripts running client-side with minimal computing overhead."
        },
        7: {
            title: "Any Additional Information",
            content: "Project Repository: https://github.com/aegisflow/aegisflow-hackathon-2026\nVideo Demonstration: Narration and click walkthrough matching index.html dashboard included in file suite guide.\nOfficial Templates Compatibility: Fully pre-filled slides align directly with the ET AutoTech PowerPoint presentation structure."
        },
        8: {
            title: "THANK YOU",
            content: "AegisFlow AI | Securing the Future of Automotive Manufacturing\n\nEmail: contact@aegisflow.ai\nGitHub: github.com/aegisflow/aegisflow-suite\n\nAutoTech Hackathon 2026"
        }
    };

    let currentSlide = 1;
    const slideThumbnails = document.querySelectorAll('.slide-thumbnails-sidebar .thumbnail');
    const editorSlideTitle = document.getElementById('editor-slide-title');
    const editorSlideContent = document.getElementById('editor-slide-content');
    const editorSlideCounter = document.getElementById('editor-slide-counter');
    const btnCopySlide = document.getElementById('btn-copy-slide');
    const btnDownloadSlidesTxt = document.getElementById('btn-download-slides-txt');
    const pitchModal = document.getElementById('pitch-modal');
    const btnExportPitch = document.getElementById('btn-export-pitch');
    const pitchModalClose = document.getElementById('pitch-modal-close');
    const btnCloseModalConfirm = document.getElementById('btn-close-modal-confirm');

    function openPitchModal() {
        if (pitchModal) {
            pitchModal.classList.remove('hidden');
            loadSlide(1);
        }
    }

    function closePitchModal() {
        if (pitchModal) pitchModal.classList.add('hidden');
    }

    function loadSlide(slideNum) {
        currentSlide = slideNum;
        slideThumbnails.forEach(thumb => thumb.classList.remove('active'));
        const activeThumb = document.querySelector(`.thumbnail[data-slide="${slideNum}"]`);
        if (activeThumb) activeThumb.classList.add('active');

        if (editorSlideTitle) editorSlideTitle.value = slideData[slideNum].title;
        if (editorSlideContent) editorSlideContent.value = slideData[slideNum].content;
        if (editorSlideCounter) editorSlideCounter.textContent = `Slide ${slideNum} of 8`;
    }

    if (btnExportPitch) btnExportPitch.addEventListener('click', openPitchModal);
    if (pitchModalClose) pitchModalClose.addEventListener('click', closePitchModal);
    if (btnCloseModalConfirm) btnCloseModalConfirm.addEventListener('click', closePitchModal);

    slideThumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            const slideNum = parseInt(thumb.getAttribute('data-slide'));
            loadSlide(slideNum);
        });
    });

    if (editorSlideTitle) {
        editorSlideTitle.addEventListener('input', () => {
            slideData[currentSlide].title = editorSlideTitle.value;
        });
    }
    if (editorSlideContent) {
        editorSlideContent.addEventListener('input', () => {
            slideData[currentSlide].content = editorSlideContent.value;
        });
    }

    if (btnCopySlide) {
        btnCopySlide.addEventListener('click', () => {
            const textToCopy = `SLIDE ${currentSlide}: ${editorSlideTitle.value}\n\n${editorSlideContent.value}`;
            navigator.clipboard.writeText(textToCopy);
            btnCopySlide.innerHTML = `<i class="fa-solid fa-check text-success"></i> Slide Copied!`;
            setTimeout(() => {
                btnCopySlide.innerHTML = `<i class="fa-regular fa-copy"></i> Copy Slide Text`;
            }, 1500);
        });
    }

    if (btnDownloadSlidesTxt) {
        btnDownloadSlidesTxt.addEventListener('click', () => {
            let fullText = "=========================================================\n";
            fullText += " AEGISFLOW AI - PITCH PRESENTATION SLIDES OUTLINE\n";
            fullText += "=========================================================\n\n";
            
            for (let i = 1; i <= 8; i++) {
                fullText += `=========================================\n`;
                fullText += ` SLIDE ${i}: ${slideData[i].title.toUpperCase()}\n`;
                fullText += `=========================================\n`;
                fullText += `${slideData[i].content}\n\n`;
            }

            const blob = new Blob([fullText], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'aegisflow_pitch_presentation_outline.txt';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });
    }

    // Initialize Default States on load
    updateMapUX();
    updateSubstitutionUX();
});
