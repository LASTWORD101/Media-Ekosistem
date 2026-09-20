// --- 1. WEB AUDIO API SYNTHESIZER (GENERATOR SFX OTOMATIS) ---
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSFX(type) {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    if (type === 'tring') {
        // SFX Tring! (Chime Nada Tinggi Gembira)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(1046.50, audioCtx.currentTime + 0.3); // C6
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.3);
    } else if (type === 'buzzer') {
        // SFX Buzzer (Suara Nada Rendah Pelan)
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
    }
}

// --- 2. LOGIKA PERPINDAHAN MODUL ---
function switchModul(modulId) {
    document.querySelectorAll('.modul-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(modulId).classList.add('active');
}

// --- 3. LOGIKA DRAG & DROP (TOUCH & MOUSE SUPPORT UNTUK IFP) ---
const dragItems = document.querySelectorAll('.drag-item');
const dropZones = document.querySelectorAll('.zone');

dragItems.forEach(item => {
    item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', e.target.id);
        e.dataTransfer.setData('role', e.target.dataset.role);
    });
});

dropZones.forEach(zone => {
    zone.addEventListener('dragover', (e) => {
        e.preventDefault();
        zone.style.background = '#d7ccc8';
    });

    zone.addEventListener('dragleave', () => {
        zone.style.background = '';
    });

    zone.addEventListener('drop', (e) => {
        e.preventDefault();
        zone.style.background = '';
        const id = e.dataTransfer.getData('text/plain');
        const itemRole = e.dataTransfer.getData('role');
        const targetRole = zone.dataset.role;

        if (itemRole === targetRole) {
            // Jawaban Benar!
            const draggedElement = document.getElementById(id);
            zone.querySelector('.target-box').appendChild(draggedElement);
            playSFX('tring');
        } else {
            // Jawaban Salah!
            playSFX('buzzer');
        }
    });
});

// --- 4. LOGIKA CANVAS DRAWING (SUPPORT STYLUS PEN HISENSE) ---
const canvas = document.getElementById('hisenseCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;

ctx.lineWidth = 4;
ctx.lineCap = 'round';
ctx.strokeStyle = '#e65100';

function startDrawing(e) {
    isDrawing = true;
    draw(e);
}

function stopDrawing() {
    isDrawing = false;
    ctx.beginPath();
}

function draw(e) {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
}

// Listener Touch & Mouse untuk Stylus IFP
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);

canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchend', stopDrawing);
canvas.addEventListener('touchmove', draw);

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}