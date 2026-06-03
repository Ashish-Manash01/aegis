/*
   AegisFlow AI | Resilient Supply Chain & Smart Manufacturing Suite
   Interactive Application Logic - ET AutoTech Hackathon 2026
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
            
            // Switch tabs active classes
            navItems.forEach(nav => nav.classList.remove('active'));
            viewports.forEach(view => view.classList.remove('active'));
            
            item.classList.add('active');
            const targetViewport = document.getElementById(`tab-${targetTab}`);
            if (targetViewport) targetViewport.classList.add('active');
            
            // Update Headers
            if (tabMeta[targetTab]) {
                pageTitle.textContent = tabMeta[targetTab].title;
                pageSubtitle.textContent = tabMeta[targetTab].subtitle;
            }

            state.activeTab = targetTab;

            // Trigger weld canvas simulation loops if switching to shopfloor
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
       2. Module 1: AltRoute-AI Supply Chain Map
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

    function updateMapUX() {
        let riskScore = 42;
        let riskText = 'MEDIUM';
        
        // Settle route display states
        if (state.mapThreats.taiwan || state.mapThreats.suez || state.mapThreats.tariff) {
            actionMitigateBtn.removeAttribute('disabled');
        } else {
            actionMitigateBtn.setAttribute('disabled', 'true');
        }

        // 1. Taiwan Strait Blockade logic
        if (state.mapThreats.taiwan) {
            nodeChina.className.baseVal = "node-source offline";
            straitTaiwan.className.baseVal = "strait-marker blocked-gate";
            routePrimary.classList.add('blocked');
            routePrimary.style.stroke = 'var(--color-danger)';
            
            // Unhide alternative domestic sourcing
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

        // 2. Suez Port Strike logic
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
            primaryLeadTime.textContent = "36 Days (+18d)";
            primaryLeadTime.className = "val text-danger";

            copilotText.innerHTML = `"TRANSIT DELAY: Suez port strike has stranded shipments. Sourcing lead times increased to 36 days. <strong>Action Recommended:</strong> Execute redirection to source battery Lithium carbon chemistry from Atacama Chile via South Atlantic Sea Lanes."`;

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

        // 3. Tariff Hike logic
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

        // Baseline reset conditions
        if (!state.mapThreats.taiwan && !state.mapThreats.suez && !state.mapThreats.tariff) {
            mapAlert.classList.add('hidden');
            globalRiskBadge.className = "stat-badge risk-alert low-risk";
            globalRiskBadge.innerHTML = `<i class="fa-solid fa-circle-check"></i> Sourcing Status: STABLE`;
            copilotText.innerHTML = `"System is running at baseline parameters. Primary sourcing from Ningbo, CN via Taiwan Strait is stable. Geopolitical Risk Index is within tolerance. Monitor Suez strike alerts."`;
        }
    }

    // Toggle triggers
    triggerTaiwanBtn.addEventListener('click', () => {
        state.mapThreats.taiwan = !state.mapThreats.taiwan;
        state.mapThreats.suez = false; // Mutually exclusive scenarios for simplicity in the map
        triggerSuezBtn.classList.remove('active-btn');
        updateMapUX();
    });

    triggerSuezBtn.addEventListener('click', () => {
        state.mapThreats.suez = !state.mapThreats.suez;
        state.mapThreats.taiwan = false;
        triggerTaiwanBtn.classList.remove('active-btn');
        updateMapUX();
    });

    triggerTariffBtn.addEventListener('click', () => {
        state.mapThreats.tariff = !state.mapThreats.tariff;
        updateMapUX();
    });

    resetMapBtn.addEventListener('click', () => {
        state.mapThreats.taiwan = false;
        state.mapThreats.suez = false;
        state.mapThreats.tariff = false;
        
        triggerTaiwanBtn.classList.remove('active-btn');
        triggerSuezBtn.classList.remove('active-btn');
        triggerTariffBtn.classList.remove('active-btn');
        
        updateMapUX();
    });

    // Execute Sourcing Redirection Action
    actionMitigateBtn.addEventListener('click', () => {
        alert("ALERT: AI Sourcing Action Triggered!\nSourcing paths automatically updated in ERP. Sourcing orders rerouted to alternative low-risk suppliers.\n- Supply line stabilized.\n- Logistics backlog mitigated.");
        state.mapThreats.taiwan = false;
        state.mapThreats.suez = false;
        state.mapThreats.tariff = false;
        
        triggerTaiwanBtn.classList.remove('active-btn');
        triggerSuezBtn.classList.remove('active-btn');
        triggerTariffBtn.classList.remove('active-btn');
        
        // Show carbon savings bonus from near-shoring!
        const esgBadge = document.getElementById('esg-savings-percent');
        esgBadge.textContent = "22.8%";
        
        updateMapUX();
    });


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

    // Radar metrics progress bar fills & labels
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
        
        // Update vessel schema labels and visual heights
        labelVesselPrimary.textContent = data.primary;
        labelVesselAlternate.textContent = data.alternate;
        
        const primaryHeight = 100 - pct;
        liquidPrimary.style.height = `${primaryHeight}%`;
        liquidAlternate.style.height = `${pct}%`;
        
        pctVesselPrimary.textContent = `${primaryHeight}%`;
        pctVesselAlternate.textContent = `${pct}%`;
        
        subRatioLabel.textContent = `${pct}% Sourcing Re-blend`;

        // Calculate blended values
        const primaryFactor = (100 - pct) / 100;
        const altFactor = pct / 100;

        const risk = Math.round(data.baseline.risk * primaryFactor + data.substitute.risk * altFactor);
        const perf = Math.round(data.baseline.perf * primaryFactor + data.substitute.perf * altFactor);
        const weight = Math.round(data.baseline.weight * primaryFactor + data.substitute.weight * altFactor);
        const cost = Math.round(data.baseline.cost * primaryFactor + data.substitute.cost * altFactor);
        const esg = Math.round(data.baseline.esg * primaryFactor + data.substitute.esg * altFactor);

        // Update technical progress bars
        // 1. Risk
        barValRisk.textContent = `${risk}/100`;
        barFillRisk.style.width = `${risk}%`;
        if (risk > 65) {
            barValRisk.className = "bar-val text-danger";
            barFillRisk.className = "comparison-progress-fill bg-danger";
        } else if (risk > 35) {
            barValRisk.className = "bar-val text-warning";
            barFillRisk.className = "comparison-progress-fill bg-warning";
        } else {
            barValRisk.className = "bar-val text-success";
            barFillRisk.className = "comparison-progress-fill bg-success";
        }

        // 2. Performance
        labelBarPerf.textContent = data.perfLabel;
        barValPerf.textContent = `${perf}%`;
        barFillPerf.style.width = `${Math.min(perf, 100)}%`;

        // 3. Weight/Footprint
        labelBarWeight.textContent = data.weightLabel;
        if (weight >= 0) {
            barValWeight.textContent = `+${weight}% Penalty`;
            barValWeight.className = weight > 20 ? "bar-val text-danger" : "bar-val text-warning";
            barFillWeight.style.width = `${Math.min(weight * 2, 100)}%`;
            barFillWeight.className = "comparison-progress-fill bg-warning";
        } else {
            barValWeight.textContent = `${weight}% Reduced!`;
            barValWeight.className = "bar-val text-success";
            barFillWeight.style.width = `${Math.abs(weight * 3)}%`;
            barFillWeight.className = "comparison-progress-fill bg-success";
        }

        // 4. Cost
        barValCost.textContent = `$${cost}/kg`;
        barFillCost.style.width = `${Math.min((cost / 200) * 100, 100)}%`;

        // 5. Sustainability
        barValEsg.textContent = `${esg} kg CO2/kg`;
        barFillEsg.style.width = `${esg}%`;
        if (esg > 50) {
            barValEsg.className = "bar-val text-warning";
            barFillEsg.className = "comparison-progress-fill bg-warning";
        } else {
            barValEsg.className = "bar-val text-success";
            barFillEsg.className = "comparison-progress-fill bg-success";
        }

        // Verdict Text Splicing
        substitutionVerdict.innerHTML = data.verdict(pct);
    }

    materialSelect.addEventListener('change', () => {
        subSlider.value = 0; // reset ratio on material switch
        updateSubstitutionUX();
    });
    
    subSlider.addEventListener('input', updateSubstitutionUX);
    
    // Trigger initial calculation
    updateSubstitutionUX();


    /* ==========================================================================
       4. Module 3: VisionDetect-AI Smart Shopfloor Canvas Simulator
       ========================================================================== */
    const weldCanvas = document.getElementById('weld-canvas');
    const weldCtx = weldCanvas.getContext('2d');
    const btnInjectDefect = document.getElementById('btn-trigger-defect');
    
    const cpText = document.getElementById('val-cp');
    const cpkText = document.getElementById('val-cpk');
    const defectRateText = document.getElementById('val-defect-rate');
    const spcChartAlert = document.getElementById('chart-alert-lbl');
    const guidePanel = document.getElementById('operator-guide-panel');
    const guideText = document.getElementById('guide-instruction-text');

    let simAnimationId = null;

    // Weld Canvas particle constructor
    class Spark {
        constructor(x, y, dx, dy) {
            this.x = x;
            this.y = y;
            this.dx = dx;
            this.dy = dy;
            this.size = Math.random() * 2 + 1;
            this.color = `rgba(255, ${Math.floor(Math.random() * 155) + 100}, 0, ${Math.random() * 0.7 + 0.3})`;
            this.life = 0;
            this.maxLife = Math.random() * 30 + 10;
        }

        draw(ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            this.x += this.dx;
            this.y += this.dy;
            this.dy += 0.1; // gravity
            this.life++;
        }
    }

    function initWeldSimulation() {
        if (simAnimationId) cancelAnimationFrame(simAnimationId);
        
        let frameCount = 0;
        state.weldSimulation.laserY = 0;

        function animate() {
            frameCount++;
            
            // Draw weld joints background
            weldCtx.fillStyle = '#06080e';
            weldCtx.fillRect(0, 0, weldCanvas.width, weldCanvas.height);
            
            // Draw industrial background lines/grid
            weldCtx.strokeStyle = 'rgba(255,255,255,0.02)';
            weldCtx.lineWidth = 1;
            for (let i = 0; i < weldCanvas.width; i += 30) {
                weldCtx.beginPath(); weldCtx.moveTo(i, 0); weldCtx.lineTo(i, weldCanvas.height); weldCtx.stroke();
            }
            for (let j = 0; j < weldCanvas.height; j += 30) {
                weldCtx.beginPath(); weldCtx.moveTo(0, j); weldCtx.lineTo(weldCanvas.width, j); weldCtx.stroke();
            }

            // Draw Weld Joint Tabs (Two overlapping copper/aluminum blocks)
            weldCtx.fillStyle = '#475569'; // Block 1
            weldCtx.fillRect(80, 100, 140, 70);
            weldCtx.strokeStyle = 'rgba(255,255,255,0.2)';
            weldCtx.lineWidth = 1.5;
            weldCtx.strokeRect(80, 100, 140, 70);
            weldCtx.fillStyle = '#4e5b72'; // Weld Tab 2
            weldCtx.fillRect(220, 100, 180, 70);
            weldCtx.strokeRect(220, 100, 180, 70);

            // Draw standard weld seam
            weldCtx.fillStyle = 'rgba(16, 185, 129, 0.4)';
            weldCtx.strokeStyle = 'rgba(16, 185, 129, 0.6)';
            weldCtx.lineWidth = 2;
            
            // Render simulated overlapping weld joint seams
            for (let x = 90; x < 390; x += 18) {
                // If it is a weld seam that was scanned
                if (x < 120 + (frameCount % 400)) {
                    weldCtx.beginPath();
                    weldCtx.arc(x, 135, 10, 0, Math.PI * 2);
                    weldCtx.fill();
                    weldCtx.stroke();
                }
            }

            // Simulated laser welding tip scan
            const laserX = 120 + (frameCount % 300);
            const laserY = 135;
            
            // Draw welder head pointer
            weldCtx.fillStyle = '#64748b';
            weldCtx.fillRect(laserX - 8, 30, 16, 50);
            weldCtx.strokeStyle = '#f8fafc';
            weldCtx.lineWidth = 1.5;
            weldCtx.strokeRect(laserX - 8, 30, 16, 50);

            // Welding laser beam
            weldCtx.beginPath();
            weldCtx.moveTo(laserX, 80);
            weldCtx.lineTo(laserX, laserY);
            weldCtx.strokeStyle = 'rgba(0, 242, 254, 0.8)';
            weldCtx.lineWidth = 3;
            weldCtx.shadowBlur = 15;
            weldCtx.shadowColor = 'var(--color-teal)';
            weldCtx.stroke();
            weldCtx.shadowBlur = 0; // reset shadows

            // Emit welding sparks
            if (frameCount % 2 === 0) {
                for (let k = 0; k < 3; k++) {
                    const sparkDx = (Math.random() - 0.5) * 6;
                    const sparkDy = (Math.random() - 1) * 5;
                    state.weldSimulation.sparkParticles.push(new Spark(laserX, laserY, sparkDx, sparkDy));
                }
            }

            // Update and draw spark particles
            state.weldSimulation.sparkParticles.forEach((spark, index) => {
                spark.update();
                spark.draw(weldCtx);
                if (spark.life > spark.maxLife) {
                    state.weldSimulation.sparkParticles.splice(index, 1);
                }
            });

            // Draw defect overlays if active
            const defect = state.weldSimulation.activeDefect;
            if (defect) {
                weldCtx.lineWidth = 2.5;
                weldCtx.shadowBlur = 10;
                
                if (defect === 'porosity') {
                    // Draw bubbling defect dots
                    weldCtx.fillStyle = '#ef4444';
                    weldCtx.strokeStyle = '#ef4444';
                    weldCtx.shadowColor = '#ef4444';
                    
                    // Draw bubbles
                    weldCtx.beginPath(); weldCtx.arc(260, 135, 6, 0, Math.PI * 2); weldCtx.fill();
                    weldCtx.beginPath(); weldCtx.arc(272, 130, 4, 0, Math.PI * 2); weldCtx.fill();
                    weldCtx.beginPath(); weldCtx.arc(280, 140, 5, 0, Math.PI * 2); weldCtx.fill();

                    // Bounding Box
                    weldCtx.strokeRect(240, 115, 60, 40);
                    
                    // Bounding Box text tag
                    weldCtx.fillStyle = 'rgba(239, 68, 68, 0.85)';
                    weldCtx.fillRect(240, 93, 105, 20);
                    weldCtx.fillStyle = '#ffffff';
                    weldCtx.font = 'bold 9px var(--font-body)';
                    weldCtx.fillText('DEFECT: POROSITY [94%]', 243, 107);
                } 
                else if (defect === 'crack') {
                    // Draw jagged micro-crack
                    weldCtx.strokeStyle = '#f59e0b';
                    weldCtx.shadowColor = '#f59e0b';
                    weldCtx.beginPath();
                    weldCtx.moveTo(215, 125);
                    weldCtx.lineTo(220, 135);
                    weldCtx.lineTo(218, 142);
                    weldCtx.stroke();

                    // Bounding box
                    weldCtx.strokeRect(195, 115, 45, 40);
                    
                    // Bounding Box text tag
                    weldCtx.fillStyle = 'rgba(245, 158, 11, 0.9)';
                    weldCtx.fillRect(195, 93, 115, 20);
                    weldCtx.fillStyle = '#ffffff';
                    weldCtx.font = 'bold 9px var(--font-body)';
                    weldCtx.fillText('DEFECT: MICRO-CRACK [91%]', 198, 107);
                }
                else if (defect === 'misalign') {
                    // Bounding box over misaligned joint edge
                    weldCtx.strokeStyle = '#ef4444';
                    weldCtx.shadowColor = '#ef4444';
                    weldCtx.strokeRect(210, 85, 20, 100);

                    weldCtx.fillStyle = 'rgba(239, 68, 68, 0.85)';
                    weldCtx.fillRect(210, 63, 120, 20);
                    weldCtx.fillStyle = '#ffffff';
                    weldCtx.font = 'bold 9px var(--font-body)';
                    weldCtx.fillText('MISALIGNMENT [96%]', 213, 77);
                }

                weldCtx.shadowBlur = 0; // reset
            } 
            else {
                // If welding baseline, draw active optimal welds tags in scan path
                if (laserX > 180 && laserX < 360) {
                    weldCtx.strokeStyle = 'var(--color-success)';
                    weldCtx.lineWidth = 1.5;
                    weldCtx.strokeRect(laserX - 35, laserY - 20, 60, 40);
                    
                    weldCtx.fillStyle = 'rgba(16, 185, 129, 0.85)';
                    weldCtx.fillRect(laserX - 35, laserY - 38, 60, 16);
                    weldCtx.fillStyle = '#ffffff';
                    weldCtx.font = 'bold 8px var(--font-body)';
                    weldCtx.fillText('WELD NOMINAL', laserX - 32, laserY - 27);
                }
            }

            // Continuous animation loop
            simAnimationId = requestAnimationFrame(animate);
        }

        animate();
    }

    // Handle Defect Injection Trigger
    const defects = ['porosity', 'crack', 'misalign'];
    let defectIndex = 0;

    btnInjectDefect.addEventListener('click', () => {
        // Grab current defect
        const currentDefect = defects[defectIndex];
        state.weldSimulation.activeDefect = currentDefect;
        defectIndex = (defectIndex + 1) % defects.length;

        // Visual alerts
        btnInjectDefect.className = "btn btn-outline btn-sm mr-2 active-btn";
        btnInjectDefect.innerHTML = `<i class="fa-solid fa-triangle-exclamation"></i> Defect Injected!`;

        // Update statistics capability drop
        state.weldSimulation.cp = 1.18;
        state.weldSimulation.cpk = 0.94; // Severe Cpk reduction (out of spec)
        state.weldSimulation.defectRate = 3.62;

        cpText.textContent = state.weldSimulation.cp;
        cpText.className = "cpk-val text-warning";
        
        cpkText.textContent = state.weldSimulation.cpk;
        cpkText.className = "cpk-val text-danger"; // Flash red on low Cpk

        defectRateText.textContent = `${state.weldSimulation.defectRate}%`;
        defectRateText.className = "cpk-val text-danger";

        // Update SPC Chart limits
        spcChartAlert.textContent = "PROCESS DEVIATION DETECTED";
        spcChartAlert.className = "chart-alert text-danger";

        // Change Operator Guidance UI to danger warnings
        guidePanel.className = "operator-guide-box mt-4 guide-alert-border animate-pulse";
        
        const badgeSpan = guidePanel.querySelector('.badge');
        badgeSpan.className = "badge badge-pulse text-danger";
        badgeSpan.textContent = "ACTION REQUIRED";

        // Custom recommendations based on defect injected
        if (currentDefect === 'porosity') {
            guideText.innerHTML = `<strong>Root Cause: High Surface Contamination or Shielding Gas Flux Drop.</strong><br>
            <em>Action:</em> 1. Halt Welding feed temporarily. 2. Purge ultrasonic weld horn shielding nozzle. 3. Verify clean oxide layers of copper contact tabs. 4. Trigger auto-calibration.`;
        } 
        else if (currentDefect === 'crack') {
            guideText.innerHTML = `<strong>Root Cause: Over-aggressive clamping pressure or high thermal cooling stresses.</strong><br>
            <em>Action:</em> 1. Adjust welder clamping pressure settings (Reduce 15%). 2. Verify cooling block flow rates are within specifications. 3. Re-scan joints.`;
        }
        else {
            guideText.innerHTML = `<strong>Root Cause: Mechanical misalignment of the welding anvil grid.</strong><br>
            <em>Action:</em> 1. Calibrate Line 4 anvil guide rails. 2. Verify robot gripper alignment limits in calibration script. 3. Execute self-calibration.`;
        }

        // Add a massive outlier point to the live SPC Chart!
        addSpcOutlier(currentDefect);

        // Auto-heal/reset simulation after 10 seconds!
        setTimeout(() => {
            resetWeldSimulationBaseline();
        }, 10000);
    });

    function addSpcOutlier(defect) {
        const pointsContainer = document.getElementById('spc-points');
        const spcLine = document.getElementById('spc-line');
        
        // Outlier value (beyond limits)
        const outlierY = defect === 'misalign' ? 14 : 112; // extremely high or low
        
        // Redraw SPC lines adding outlier
        let points = [...state.weldSimulation.spcPoints];
        points.push(outlierY);
        if (points.length > 15) points.shift(); // sliding window

        let dAttr = `M 0,${points[0]}`;
        points.forEach((val, i) => {
            const x = (i / (points.length - 1)) * 420;
            dAttr += ` L ${x},${val}`;
        });
        spcLine.setAttribute('d', dAttr);

        // Redraw dots
        pointsContainer.innerHTML = '';
        points.forEach((val, i) => {
            const x = (i / (points.length - 1)) * 420;
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', x);
            circle.setAttribute('cy', val);
            circle.setAttribute('r', 3);
            
            if (val === outlierY) {
                circle.setAttribute('class', 'spc-pt out-of-bounds');
            } else {
                circle.setAttribute('class', 'spc-pt');
            }
            pointsContainer.appendChild(circle);
        });
    }

    function resetWeldSimulationBaseline() {
        state.weldSimulation.activeDefect = null;

        btnInjectDefect.className = "btn btn-outline btn-sm mr-2";
        btnInjectDefect.innerHTML = `<i class="fa-solid fa-bolt"></i> Inject Weld Defect`;

        // Restore capabilities
        state.weldSimulation.cp = 1.54;
        state.weldSimulation.cpk = 1.48;
        state.weldSimulation.defectRate = 0.02;

        cpText.textContent = state.weldSimulation.cp;
        cpText.className = "cpk-val text-success";
        
        cpkText.textContent = state.weldSimulation.cpk;
        cpkText.className = "cpk-val text-success";

        defectRateText.textContent = `${state.weldSimulation.defectRate}%`;
        defectRateText.className = "cpk-val text-success";

        spcChartAlert.textContent = "Process in Control";
        spcChartAlert.className = "chart-alert text-success";

        // Reset guidance
        guidePanel.className = "operator-guide-box mt-4";
        const badgeSpan = guidePanel.querySelector('.badge');
        badgeSpan.className = "badge badge-success";
        badgeSpan.textContent = "NOMINAL";
        
        guideText.textContent = `"Process is highly centered. Cp is 1.54, indicating excellent process potential. No intervention necessary. Standard weld energy output (1400J) maintained."`;

        // Restore baseline points
        const pointsContainer = document.getElementById('spc-points');
        const spcLine = document.getElementById('spc-line');
        const points = [...state.weldSimulation.spcPoints];

        let dAttr = `M 0,${points[0]}`;
        points.forEach((val, i) => {
            const x = (i / (points.length - 1)) * 420;
            dAttr += ` L ${x},${val}`;
        });
        spcLine.setAttribute('d', dAttr);

        pointsContainer.innerHTML = '';
        points.forEach((val, i) => {
            const x = (i / (points.length - 1)) * 420;
            const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
            circle.setAttribute('cx', x);
            circle.setAttribute('cy', val);
            circle.setAttribute('r', 3);
            circle.setAttribute('class', 'spc-pt');
            pointsContainer.appendChild(circle);
        });
    }

    // Render initial SPC chart dots
    resetWeldSimulationBaseline();


    /* ==========================================================================
       5. Module 4: Supplier Risk & ESG Analytics
       ========================================================================== */
    const bubbles = document.querySelectorAll('.scatter-bubble');
    const filterAllBtn = document.getElementById('filter-all-suppliers');
    const filterLowBtn = document.getElementById('filter-low-gri');
    const filterHighEsgBtn = document.getElementById('filter-high-esg');

    // Supplier Profile DOM Elements
    const profileName = document.getElementById('profile-supplier-name');
    const profileLoc = document.getElementById('profile-supplier-location');
    const profileGri = document.getElementById('profile-gri');
    const profileLead = document.getElementById('profile-lead-time');
    const profileEsg = document.getElementById('profile-esg');
    const profileQuality = document.getElementById('profile-quality');
    const profileBottlenecks = document.getElementById('profile-bottlenecks');

    const supplierProfiles = {
        'Ningbo Sourcing': {
            name: 'Ningbo Sourcing Corp',
            location: 'Ningbo, Zhejiang Province, China',
            gri: '82%',
            lead: '18 Days',
            esg: 'Grade D (Elevated Carbon)',
            quality: '1.42 Cpk',
            bottlenecks: [
                'Substantial export licensing restrictions on Critical Minerals.',
                'Transit route passes entirely through congested Taiwan Strait lanes.',
                'High reliance on coal-powered smelting grid.'
            ],
            riskLvl: 'high'
        },
        'Atacama Lithium': {
            name: 'Atacama Lithium Mining Ltd',
            location: 'Atacama Desert, Chile',
            gri: '12%',
            lead: '24 Days',
            esg: 'Grade B (Low Sourcing Footprint)',
            quality: '1.51 Cpk',
            bottlenecks: [
                'Longer sea transit lanes (+6 days logistics buffer required).',
                'Local water extraction volume constraints.'
            ],
            riskLvl: 'low'
        },
        'Hindustan Metals': {
            name: 'Hindustan Special Metals (Domestic)',
            location: 'Chakan Industrial Zone, Pune, India',
            gri: '2%',
            lead: '4 Days (Local)',
            esg: 'Grade B (Low Sourcing Footprint)',
            quality: '1.48 Cpk',
            bottlenecks: [
                'Capacity currently capped at 1,500 tons/annum (expansion scheduled).',
                'Raw material processing relies on imported chemicals.'
            ],
            riskLvl: 'domestic'
        },
        'Aussie Mineral Corp': {
            name: 'Aussie Mineral Sourcing Ltd',
            location: 'Pilbara Sourcing District, Australia',
            gri: '15%',
            lead: '30 Days',
            esg: 'Grade A (Green Hydrogen Smelted)',
            quality: '1.56 Cpk',
            bottlenecks: [
                'Shipping costs premium (+12% above benchmark baseline).',
                'Strict safety standards restrict sudden capacity spikes.'
            ],
            riskLvl: 'low'
        },
        'Rhineland Semiconductors': {
            name: 'Rhineland Semiconductors GmbH',
            location: 'Dresden, Saxony, Germany',
            gri: '35%',
            lead: '22 Days',
            esg: 'Grade A (100% Renewable Powered Fab)',
            quality: '1.62 Cpk',
            bottlenecks: [
                'Energy price spikes in EU impact pricing structures.',
                'Capacity highly backordered by German premium automotive OEMs.'
            ],
            riskLvl: 'mid'
        },
        'Taiwan Microchip Corp': {
            name: 'Taiwan Microchip Corp (TSMC Affiliate)',
            location: 'Hsinchu Science Park, Taiwan',
            gri: '90%',
            lead: '26 Days',
            esg: 'Grade C (High Water Footprint)',
            quality: '1.68 Cpk',
            bottlenecks: [
                'Extremely high geopolitical threat zone (Taiwan Strait).',
                'Severe supply allocation caps on advanced logic microchips.'
            ],
            riskLvl: 'high'
        }
    };

    function loadSupplierProfile(supplierKey) {
        const profile = supplierProfiles[supplierKey];
        if (!profile) return;

        profileName.textContent = profile.name;
        profileLoc.innerHTML = `<i class="fa-solid fa-location-dot"></i> ${profile.location}`;
        
        profileGri.textContent = profile.gri;
        if (parseInt(profile.gri) > 60) {
            profileGri.className = "stat-val text-danger";
        } else if (parseInt(profile.gri) > 20) {
            profileGri.className = "stat-val text-warning";
        } else {
            profileGri.className = "stat-val text-success";
        }

        profileLead.textContent = profile.lead;
        
        profileEsg.textContent = profile.esg;
        if (profile.esg.includes('Grade A') || profile.esg.includes('Grade B')) {
            profileEsg.className = "stat-val text-success";
        } else {
            profileEsg.className = "stat-val text-danger";
        }

        profileQuality.textContent = profile.quality;

        // Ingest Bullet points
        profileBottlenecks.innerHTML = '';
        profile.bottlenecks.forEach(bullet => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fa-solid fa-triangle-exclamation ${profile.riskLvl === 'high' ? 'text-danger' : 'text-warning'}"></i> ${bullet}`;
            profileBottlenecks.appendChild(li);
        });

        // Set active styling on scatter circles
        bubbles.forEach(b => {
            if (b.getAttribute('data-supplier') === supplierKey) {
                b.setAttribute('r', '20'); // enlarge selected
                b.style.stroke = "var(--color-teal)";
                b.style.strokeWidth = "3px";
            } else {
                let size = '12';
                if (b.id === 'bub-taiwan') size = '17';
                else if (b.id === 'bub-ningbo') size = '16';
                else if (b.id === 'bub-rhine') size = '15';
                else if (b.id === 'bub-atacama') size = '14';
                else if (b.id === 'bub-aussie') size = '13';
                else if (b.id === 'bub-hindustan') size = '11';
                b.setAttribute('r', size);
                b.style.stroke = "#ffffff";
                b.style.strokeWidth = "1.5px";
            }
        });

        state.selectedSupplier = supplierKey;
    }

    // Set bubble click listeners
    bubbles.forEach(bubble => {
        bubble.addEventListener('click', () => {
            const supplierKey = bubble.getAttribute('data-supplier');
            loadSupplierProfile(supplierKey);
        });
    });

    // Multi-factor Filter Buttons
    filterAllBtn.addEventListener('click', () => {
        bubbles.forEach(b => b.classList.remove('dimmed'));
        filterAllBtn.classList.add('active-btn');
        filterLowBtn.classList.remove('active-btn');
        filterHighEsgBtn.classList.remove('active-btn');
    });

    filterLowBtn.addEventListener('click', () => {
        bubbles.forEach(b => {
            const supplierKey = b.getAttribute('data-supplier');
            const gri = parseInt(supplierProfiles[supplierKey].gri);
            if (gri > 40) {
                b.classList.add('dimmed');
            } else {
                b.classList.remove('dimmed');
            }
        });
        filterLowBtn.classList.add('active-btn');
        filterAllBtn.classList.remove('active-btn');
        filterHighEsgBtn.classList.remove('active-btn');
    });

    filterHighEsgBtn.addEventListener('click', () => {
        bubbles.forEach(b => {
            const supplierKey = b.getAttribute('data-supplier');
            const esg = supplierProfiles[supplierKey].esg;
            if (!esg.includes('Grade A') && !esg.includes('Grade B')) {
                b.classList.add('dimmed');
            } else {
                b.classList.remove('dimmed');
            }
        });
        filterHighEsgBtn.classList.add('active-btn');
        filterAllBtn.classList.remove('active-btn');
        filterLowBtn.classList.remove('active-btn');
    });

    // Load Ningbo as default profile view
    loadSupplierProfile('Ningbo Sourcing');


    /* ==========================================================================
       6. Module 5: ActionExtract-AI Shopfloor Meeting Parser
       ========================================================================== */
    const transcriptSelector = document.getElementById('transcript-selector');
    const transcriptText = document.getElementById('transcript-text');
    const btnParseTranscript = document.getElementById('btn-parse-transcript');
    const resultsEmptyState = document.getElementById('results-empty-state');
    const resultsDataContainer = document.getElementById('results-data-container');

    const tasksContainer = document.getElementById('extracted-tasks-container');
    const erpContainer = document.getElementById('erp-proposals-container');
    const emailDraftContainer = document.getElementById('email-draft-content');
    const btnCopyEmail = document.getElementById('btn-copy-email');

    const transcriptsDb = {
        'sourcing-disruption': {
            raw: `Shift Lead (Sourcing): "Morning alignment. Sourcing operations reports the ocean carrier carrying battery cell terminals has been diverted from the Suez channel due to cargo port strikes. Our Pune assembly plant has exactly 9 days of Lithium terminal inventory left before welding lines must halt. The pricing on spot market materials is jumping +40%. We need to immediately evaluate redirects from Chile or see if Chakan Hindustan Metals can supply specialized tabs to Pune to avoid line closures."`,
            tasks: [
                { desc: 'Activate alternate route 2: Chile to India logistics buffer redirect.', owner: 'Logistics Manager', p: 'HIGH' },
                { desc: 'Request trial production specification tests from Hindustan Metals Pune.', owner: 'Quality Eng', p: 'URGENT' },
                { desc: 'Update battery terminal ERP master allocation spreadsheet.', owner: 'Sourcing Lead', p: 'MEDIUM' }
            ],
            erp: {
                title: 'ERP Re-Order Sourcing Proposal: SPECIALIZED METALS',
                desc: 'Procurement Request ID: ERP-2026-LI-ALT. Alternate sourcing candidate identified: Hindustan Special Metals (Domestic, Pune). Sourcing volume request: 400kg. Cost target: $15.2/kg (+22%). Lead time: 2 days.'
            },
            email: `Subject: EMERGENCY: Sourcing Divert Sourcing Orders - NMC Lithium Terminals

Dear Sourcing Sourcing Partners,

Due to active cargo strikes stranding our sea shipments in the Suez Channel transit, we are executing our AI-hedged sourcing resilience protocols. 

We require immediate specifications and price quotes for 400kg of specialized battery terminals from our local partner, Hindustan Special Metals (Chakan, Pune). Sourcing Lead Times are targeted under 3 days to safeguard Line 4 continuity.

Please pause the Ningbo order sequence NGB-9023 until port clearances are confirmed.

Best Regards,
AutoResilience Procurement Lead`
        },
        'shopfloor-defect': {
            raw: `Line 4 Welder Supervisor: "Weekly Quality Loop. Welder Edge Station #4 is experiencing a sudden Cp/Cpk drop on NMC battery tab welding. Real-time video scanning caught a defect spike on three cell units where porosity levels exceeded spec limits by 18%, tripping safety tolerance checks. We suspect ultrasonic welder horn oxide buildup or pressure feed calibration is off center. Sourcing has to queue a calibration technician immediately before yield drop hits standard metrics."`,
            tasks: [
                { desc: 'Execute ultrasonic welder self-calibration cycle on Line 4.', owner: 'Line Supervisor', p: 'URGENT' },
                { desc: 'Inspect welding horn clamp grid and clean oxide surface layers.', owner: 'Shop Maintenance', p: 'HIGH' },
                { desc: 'Review process control charts (Cp/Cpk logs) for Weld Joint Station #4.', owner: 'Process Engineer', p: 'MEDIUM' }
            ],
            erp: {
                title: 'ERP Process Action Proposal: CALIBRATION TRIGGERED',
                desc: 'Calibration Task Ticket: TKT-2026-WELD4. Action: Automated dispatch calibration engineer to line welder station 4. Schedule: Emergency (Within 4 hours). Calibration code: EN-1400J.'
            },
            email: `Subject: PROCESS EXCEPTION TICKET: Line Welder Edge Station #4 Calibration

Dear Maintenance Team,

Our VisionDetect-AI smart inspection feed has detected a process deviation on Edge Camera #4. Ultrasonic Welder Line 4 process capability (Cpk) has dropped below specification limits to 0.94 due to repetitive welding porosity.

Please dispatch a technician to calibrate the anvil, verify welder energy outputs (Target: 1400J), and inspect clamping anvil friction.

This is critical to prevent batch rejection.

Best Regards,
AegisFlow Manufacturing Quality Control`
        },
        'sustainability-audit': {
            raw: `Sourcing Audit Board: "Green Initiatives update. Under Circular Economy policies and EU Scope 3 parameters, our suppliers must be audited for carbon emissions compliance. Ningbo Sourcing runs a coal-heavy extraction grid (Grade D, 64kg CO2/kg). We need to source from Aussie Minerals or Atacama Lithium to drop our carbon score by at least 15% and comply with European battery material passport audits. Let's draft the supplier warning letter."`,
            tasks: [
                { desc: 'Generate digital Material Passports for next-gen battery packs.', owner: 'Sustainability Lead', p: 'MEDIUM' },
                { desc: 'Negotiate Scope 3 emissions quotas with Aussie Minerals.', owner: 'Sourcing Director', p: 'HIGH' },
                { desc: 'Audit carbon lifecycle of raw Lithium cell chemistries.', owner: 'ESG Committee', p: 'MEDIUM' }
            ],
            erp: {
                title: 'ERP ESG Procurement Proposal: ESG REALLOCATION',
                desc: 'ESG Material Swap Proposal: Material Sourcing Code: NMC-LITHIUM-ESG. Action: Settle 45% sourcing allocation to Aussie Mineral Sourcing (Pilbara, AU). Projected Carbon Reduction: 18.2% across battery chassis footprint.'
            },
            email: `Subject: EU Scope 3 Emissions & Material Passport Auditing Alert

Dear Sourcing Strategy team,

To maintain compliance with EU circular economy specifications, we are auditing all cell and magnet materials. 

Our current coal-based smelting supply lines from Ningbo Sourcing do not satisfy carbon targets. We are shifting 45% of our Lithium Carbonate allocations to Aussie Mineral Sourcing (Australia) to utilize their clean hydrogen-smelted supplies.

Please prepare supply agreements under contract code ESG-NMC-2026.

Best Regards,
Director of Sustainable Procurement`
        }
    };

    function updateTranscriptText() {
        const scenario = transcriptSelector.value;
        if (transcriptsDb[scenario]) {
            transcriptText.value = transcriptsDb[scenario].raw;
        }
    }

    transcriptSelector.addEventListener('change', updateTranscriptText);
    
    // Set initial transcript text
    updateTranscriptText();

    btnParseTranscript.addEventListener('click', () => {
        const scenario = transcriptSelector.value;
        const data = transcriptsDb[scenario];

        // Animate Loader simulated feel
        btnParseTranscript.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Parsing NLP Signals...`;
        btnParseTranscript.setAttribute('disabled', 'true');

        setTimeout(() => {
            btnParseTranscript.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> Extract Actions & Sourcing Adjustments`;
            btnParseTranscript.removeAttribute('disabled');

            resultsEmptyState.classList.add('hidden');
            resultsDataContainer.classList.remove('hidden');

            // Render tasks
            tasksContainer.innerHTML = '';
            data.tasks.forEach(task => {
                const card = document.createElement('div');
                card.className = 'task-item-card';
                card.innerHTML = `
                    <div class="task-details">
                        <span class="task-desc">${task.desc}</span>
                        <span class="task-meta">Owner: <strong>${task.owner}</strong></span>
                    </div>
                    <span class="badge ${task.p === 'URGENT' ? 'text-danger' : (task.p === 'HIGH' ? 'text-warning' : 'badge-outline')}">${task.p}</span>
                `;
                tasksContainer.appendChild(card);
            });

            // Render ERP Proposal
            erpContainer.innerHTML = `
                <div class="erp-proposal-flex">
                    <div class="erp-info-txt">
                        <h5>${data.erp.title}</h5>
                        <p>${data.erp.desc}</p>
                    </div>
                    <button class="btn btn-primary btn-sm" onclick="alert('ERP Sourcing Request successfully logged into SAP/Oracle!')"><i class="fa-solid fa-file-invoice"></i> Approve</button>
                </div>
            `;

            // Render Email Draft
            emailDraftContainer.textContent = data.email;

        }, 1200);
    });

    // Copy to clipboard
    btnCopyEmail.addEventListener('click', () => {
        navigator.clipboard.writeText(emailDraftContainer.textContent);
        btnCopyEmail.innerHTML = `<i class="fa-solid fa-check text-success"></i>`;
        setTimeout(() => {
            btnCopyEmail.innerHTML = `<i class="fa-regular fa-copy"></i>`;
        }, 1500);
    });

    // Floating microphone simulated dictation typing
    const btnVoiceBriefing = document.getElementById('btn-voice-briefing');
    const transcriptTextarea = document.getElementById('transcript-text');
    const btnParseTranscript = document.getElementById('btn-parse-transcript');

    if (btnVoiceBriefing) {
        btnVoiceBriefing.addEventListener('click', () => {
            if (btnVoiceBriefing.classList.contains('listening')) return;

            btnVoiceBriefing.classList.add('listening');
            transcriptTextarea.value = '';

            const dictationText = "Operator Line 4 Reporting: We have detected a critical weld alignment drift at station 4. Process capability Cpk is dropping towards 0.98. Defect analysis indicates minor gas porosity. Requesting immediate edge calibration of the welder actuators and a 5% reduction in weld speed. Sourcing lead times for replacement copper electrodes must be audited from local vendors to avoid shopfloor halting.";
            
            let charIdx = 0;
            function typeChar() {
                if (state.activeTab !== 'action-extractor') {
                    btnVoiceBriefing.classList.remove('listening');
                    return;
                }
                if (charIdx < dictationText.length) {
                    transcriptTextarea.value += dictationText.charAt(charIdx);
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
       7. Hackathon Pitch Deck Presentation Modal
       ========================================================================== */
    const btnExportPitch = document.getElementById('btn-export-pitch');
    const pitchModal = document.getElementById('pitch-modal');
    const pitchModalClose = document.getElementById('pitch-modal-close');
    const btnCloseModalConfirm = document.getElementById('btn-close-modal-confirm');

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

    function openPitchModal() {
        pitchModal.classList.remove('hidden');
        loadSlide(1);
    }

    function closePitchModal() {
        pitchModal.classList.add('hidden');
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

    btnExportPitch.addEventListener('click', openPitchModal);
    pitchModalClose.addEventListener('click', closePitchModal);
    btnCloseModalConfirm.addEventListener('click', closePitchModal);

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


    /* ==========================================================================
       8. Module 6: ADAS-Adopt-AI Indian Context Road Simulator
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
        weather: 'clear'
    };

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

        // Weather Selection Buttons Click Listeners
        const adasWeatherGroup = document.getElementById('adas-weather-group');
        if (adasWeatherGroup) {
            const weatherBtns = adasWeatherGroup.querySelectorAll('button');
            weatherBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    weatherBtns.forEach(b => b.classList.remove('active-btn'));
                    btn.classList.add('active-btn');
                    
                    const weather = btn.getAttribute('data-weather');
                    adasState.weather = weather;
                    
                    // Modify HUD warning/info panels based on weather
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

            // Animation lane offset increment
            adasState.laneOffset += adasState.speed * 0.15;
            if (adasState.laneOffset > 60) adasState.laneOffset = 0;

            // Draw lane lines
            adasCtx.strokeStyle = adasState.weather === 'night' ? 'rgba(255,255,255,0.7)' : '#94a3b8';
            adasCtx.lineWidth = 2;
            adasCtx.beginPath();
            adasCtx.moveTo(240, 140);
            adasCtx.lineTo(180, 280);
            adasCtx.moveTo(240, 140);
            adasCtx.lineTo(300, 280);
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
                const factor = (100 - adasState.threatDist) / 100; // 0 (horizon) to 1 (near)
                const threatSize = 10 + factor * 80;
                const threatY = 140 + factor * 120;
                
                // horizontal center deviation based on threat type
                let threatX = 240;
                if (adasState.activeThreat === 'rickshaw') threatX = 200 + factor * 20; // cutting in from left
                
                // Draw threat shapes
                adasCtx.shadowBlur = 10;
                
                // Weather visibility multipliers for YOLO confidence
                let confMult = 1.0;
                if (adasState.weather === 'rain') confMult = 0.8;
                else if (adasState.weather === 'fog') confMult = 0.65;
                else if (adasState.weather === 'night') confMult = 0.85;

                if (adasState.activeThreat === 'cattle') {
                    // Stray Cow shape
                    adasCtx.fillStyle = '#78350f'; // Brown
                    adasCtx.shadowColor = '#78350f';
                    // Cow body rect
                    adasCtx.fillRect(threatX - threatSize/2, threatY - threatSize/3, threatSize, threatSize/2);
                    // Head rect
                    adasCtx.fillStyle = '#b45309';
                    adasCtx.fillRect(threatX - threatSize/2 - threatSize/4, threatY - threatSize/2, threatSize/3, threatSize/3);
                    // Legs
                    adasCtx.fillStyle = '#451a03';
                    adasCtx.fillRect(threatX - threatSize/3, threatY + threatSize/6, threatSize/8, threatSize/4);
                    adasCtx.fillRect(threatX + threatSize/4, threatY + threatSize/6, threatSize/8, threatSize/4);

                    // YOLO Bounding Box Overlay
                    adasCtx.strokeStyle = 'var(--color-danger)';
                    adasCtx.lineWidth = 2.5;
                    adasCtx.strokeRect(threatX - threatSize/2 - 10, threatY - threatSize/2 - 5, threatSize + 20, threatSize + 15);
                    
                    // Tag label
                    adasCtx.fillStyle = 'rgba(239, 68, 68, 0.85)';
                    adasCtx.fillRect(threatX - threatSize/2 - 10, threatY - threatSize/2 - 25, 110, 20);
                    adasCtx.fillStyle = '#ffffff';
                    adasCtx.font = 'bold 8px var(--font-body)';
                    adasCtx.fillText(`STRAY CATTLE [${Math.round(99 * confMult)}%]`, threatX - threatSize/2 - 5, threatY - threatSize/2 - 12);
                } 
                else if (adasState.activeThreat === 'pothole') {
                    // Pothole shape (oval pit)
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

                    // Bounding Box
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
                    // Schematic Auto-Rickshaw (Yellow/Black boxy)
                    adasCtx.fillStyle = '#eab308'; // Yellow top
                    adasCtx.shadowColor = '#eab308';
                    adasCtx.fillRect(threatX - threatSize/2, threatY - threatSize/3, threatSize, threatSize/3);
                    adasCtx.fillStyle = '#1e293b'; // Black bottom
                    adasCtx.fillRect(threatX - threatSize/2, threatY, threatSize, threatSize/4);
                    // Windshield
                    adasCtx.fillStyle = '#38bdf8';
                    adasCtx.fillRect(threatX - threatSize/3, threatY - threatSize/4, threatSize * 0.6, threatSize/8);

                    // Bounding Box
                    adasCtx.strokeStyle = 'var(--color-danger)';
                    adasCtx.lineWidth = 2.5;
                    adasCtx.strokeRect(threatX - threatSize/2 - 5, threatY - threatSize/3 - 10, threatSize + 10, threatSize * 0.7);
                    
                    adasCtx.fillStyle = 'rgba(239, 68, 68, 0.85)';
                    adasCtx.fillRect(threatX - threatSize/2 - 5, threatY - threatSize/3 - 28, 120, 18);
                    adasCtx.fillStyle = '#ffffff';
                    adasCtx.font = 'bold 8px var(--font-body)';
                    adasCtx.fillText(`RICKSHAW CUT-IN [${Math.round(96 * confMult)}%]`, threatX - threatSize/2, threatY - threatSize/3 - 16);
                }

                adasCtx.shadowBlur = 0; // reset shadows

                // Telemetry adjustments during threats
                if (adasState.activeThreat === 'cattle') {
                    adasState.speed -= 2.2;
                    adasState.brake = 100;
                    adasState.steerCorrection = 'Avoidance Steering';
                    adasState.steerAngle = -25; // swerve left
                } 
                else if (adasState.activeThreat === 'pothole') {
                    adasState.speed -= 1.8;
                    adasState.brake = 45;
                    adasState.steerCorrection = 'Left Correction';
                    adasState.steerAngle = -15; // lane nudge
                } 
                else if (adasState.activeThreat === 'rickshaw') {
                    adasState.speed -= 1.5;
                    adasState.brake = 60;
                    adasState.steerCorrection = 'Right Correction';
                    adasState.steerAngle = 18; // swerve right
                }

                if (adasState.speed < 0) adasState.speed = 0;
            } else {
                // Return to cruise speed based on current weather environment
                let cruiseSpeed = 60;
                if (adasState.weather === 'rain') cruiseSpeed = 45;
                else if (adasState.weather === 'fog') cruiseSpeed = 30;
                else if (adasState.weather === 'night') cruiseSpeed = 50;

                if (adasState.speed < cruiseSpeed) {
                    adasState.speed += 0.8;
                } else if (adasState.speed > cruiseSpeed) {
                    adasState.speed -= 0.8;
                }
                
                adasState.brake = 0;
                adasState.steerCorrection = 'Center Alignment';
                if (adasState.steerAngle < 0) adasState.steerAngle += 1;
                else if (adasState.steerAngle > 0) adasState.steerAngle -= 1;
            }

            // Draw Weather Particles overlays
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
            // Top Left
            adasCtx.beginPath(); adasCtx.moveTo(25, 15); adasCtx.lineTo(15, 15); adasCtx.lineTo(15, 25); adasCtx.stroke();
            // Top Right
            adasCtx.beginPath(); adasCtx.moveTo(adasCanvas.width - 25, 15); adasCtx.lineTo(adasCanvas.width - 15, 15); adasCtx.lineTo(adasCanvas.width - 15, 25); adasCtx.stroke();

            // Update DOM telemetry panels
            adasSpeedVal.textContent = `${Math.round(adasState.speed)} km/h`;
            adasBrakeVal.textContent = `${adasState.brake}%`;
            
            adasTargetName.textContent = adasState.activeThreat ? adasState.activeThreat.toUpperCase() : 'NONE';
            adasTargetDist.textContent = adasState.activeThreat ? `${Math.round(adasState.threatDist)} m` : 'N/A';
            adasSteeringStatus.textContent = adasState.steerCorrection;

            // Trigger next frame
            adasSimId = requestAnimationFrame(drawWindshieldFeed);
        }

        drawWindshieldFeed();
    }

    // ADAS trigger button callbacks
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

        // Reset active weather button UI state
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
       9. Module 7: Passport-AI Battery Digital Passport Scanner
       ========================================================================== */
    const btnStartScan = document.getElementById('btn-start-scan');
    const passportLaser = document.getElementById('passport-laser');
    const batteryMesh = document.getElementById('battery-mesh');
    const batteryIconPulse = document.getElementById('battery-icon-pulse');
    const scannerIndicator = document.getElementById('scanner-indicator');
    
    const passportEmptyState = document.getElementById('passport-empty-state');
    const passportResults = document.getElementById('passport-results');

    function initMaterialPassportScan() {
        // Reset state
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
            btnStartScan.setAttribute('disabled', 'true');
            btnStartScan.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Aligning Laser Reader...`;
            
            scannerIndicator.className = "badge status-yellow";
            scannerIndicator.textContent = "Scanning...";

            batteryMesh.classList.add('battery-active-glow');
            passportLaser.classList.remove('hidden');

            // 2.5 seconds scanner animation simulation
            setTimeout(() => {
                passportLaser.classList.add('hidden');
                batteryMesh.classList.remove('battery-active-glow');
                batteryIconPulse.style.color = "var(--color-success)";

                scannerIndicator.className = "badge badge-success";
                scannerIndicator.textContent = "Verified: UID-8092";

                btnStartScan.className = "btn btn-success btn-block";
                btnStartScan.innerHTML = `<i class="fa-solid fa-shield-check"></i> ESG Scan Verified`;

                passportEmptyState.classList.add('hidden');
                passportResults.classList.remove('hidden');
                
                alert("SUCCESS: QR Scan complete.\nDigital Material Passport loaded from decentralized Scope 3 blockchain network.");
            }, 2500);
        });
    }

});

