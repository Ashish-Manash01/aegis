# AegisFlow AI: Intelligent Resilient Supply Chain & Smart Manufacturing Suite
**ET AutoTech Hackathon 2026: Theme 1 Submission**


## Demo Video

Google Drive Demo:
https://drive.google.com/file/d/1MEY4bFqrEqI7E64Cbv2r33kVYPqinsDU/view?usp=sharing

AegisFlow AI is an enterprise-grade AI-powered dashboard and pitch presentation developed specifically to tackle Theme 1: *AI for Resilient Automotive Supply Chains & Smart Manufacturing*. 

This suite provides a stunning, high-fidelity interactive dashboard that runs directly in any web browser and an automated pitch deck generator script that creates a fully styled PowerPoint presentation programmatically.

---

## 📂 Project Structure

All files are created in your default scratch workspace subdirectory:
`C:\Users\ashis\.gemini\antigravity\scratch\aegisflow_suite\`

* **`index.html`**: The structural layout of our Single-Page Application (SPA) dashboard featuring tab-based navigation.
* **`style.css`**: The premium global styling system (sleek dark mode, neon glowing accents, HSL variable colors, responsive grids, and beautiful micro-animations).
* **`app.js`**: The interactive engine powering state changes, world map route pathfinding, real-time welding canvas particle simulator, Cp/Cpk charts, supplier filters, and shopfloor transcripts NLP parser.
* **`aegisflow_pitch_deck.md`**: Complete, slide-by-slide copy and design guidelines for your hackathon pitch presentation, covering all five major judging criteria (Insight, Innovation, Architecture, Feasibility, Impact).
* **`generate_deck.py`**: A fully functional Python script that compiles the official pitch deck PowerPoint file (`aegisflow_pitch.pptx`) with professional dark theme styling.

---

## 🚀 How to Run the Interactive Dashboard

No installation, build steps, or server setup is required. The dashboard is highly optimized and runs completely locally:

1. Locate the project folder in your Windows File Explorer:
   `C:\Users\ashis\.gemini\antigravity\scratch\aegisflow_suite\`
2. **Double-click `index.html`** to open it directly in your web browser (Chrome, Edge, or Firefox).
3. Alternatively, if you wish to run a local dev server, open a terminal in the folder and run:
   ```bash
   npx serve .
   ```
   Or:
   ```bash
   python -m http.server 8000
   ```

---

## 📊 How to Generate the PPTX Slide Presentation

To compile the official pitch deck `.pptx` presentation file, open your command terminal in the project directory and run:

1. Install the Python PowerPoint package:
   ```bash
   pip install python-pptx
   ```
2. Execute the generator script:
   ```bash
   python generate_deck.py
   ```
3. A beautifully formatted, fully populated, widescreen (16:9) presentation named **`aegisflow_pitch.pptx`** will instantly be generated in the same directory!

---

## 🌟 Premium Dashboard Features Built For You

* **AltRoute-AI Supply Chain Risk Map (Tab 1)**:
  * Interactive world map displaying sourcing pathways for raw battery cell components.
  * Real-time buttons to trigger geopolitical stresses (*Taiwan Strait Blockades, Suez Port Strikes, Trade Tariffs*).
  * Watch the map dynamically reroute shipping lanes in real-time, flag bottlenecked nodes, and update AI copilot recommendations with alternate low-risk suppliers.
* **Substitut-AI Lab & Performance Trade-offs (Tab 2)**:
  * An interactive blending slider that simulates substituting critical materials (e.g. Neodymium with Ferrite in motors, or Lithium NMC with Sodium-ion in cells).
  * Watch the physical properties (Volumetric Density, Geopolitical Risk, Sourcing Cost, Lifecycle Carbon) dynamically shift and recalculate physical percentages in real-time.
* **VisionDetect-AI Smart Shopfloor weld inspector (Tab 3)**:
  * A custom HTML5 Canvas rendering a simulated ultrasonic welding weld joint scan.
  * Emits dynamic particle sparks and runs a scanning laser.
  * Click **"Inject Weld Defect"** to watch the AI draw warning bounding boxes around defects (*Porosity, Micro-cracks, Misalignment*) in real-time.
  * Injects anomalous data points into the live SPC chart, causing Cp/Cpk process accuracy indices to drop and showing the dynamic operator troubleshooting copilot.
* **Supplier Analytics (Tab 4)**:
  * A multi-factor scatter plot matching Geopolitical Risk Index (GRI %) against Sourcing Lead Times.
  * Sort and filter bubbles instantly based on Low-Risk or ESG Priority ratings. Click any supplier bubble to load their detailed operational risk profiles.
* **ActionExtract-AI Shopfloor Parser (Tab 5)**:
  * Select a transcript scenario (Sourcing Delays, Weld Joint Defects, ESG Auditing) and watch the NLP engine decode raw conversations into structured tasks, pre-fill ERP inventory reorders, and auto-draft supplier emails ready to copy.
