
const canvas = document.getElementById("heart");
const ctx = canvas.getContext("2d");

let W, H;
let particles = [];
let stars = [];
let frame = 0;
let progress = 0;

function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    W = window.innerWidth;
    H = window.innerHeight;

    canvas.width = W * dpr;
    canvas.height = H * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    createParticles();
    createStars();
}

function heartPoint(t) {
    const x = 16 * Math.pow(Math.sin(t), 3);

    const y = 13 * Math.cos(t)
        - 5 * Math.cos(2 * t)
        - 2 * Math.cos(3 * t)
        - Math.cos(4 * t);

    return { x, y: -y };
}

function createParticles() {
    particles = [];

    const scale = Math.min(W / 39, H / 35) * 0.85;

    for (let i = 0; i < 1250; i++) {

        const t = Math.random() * Math.PI * 2;
        const radius = Math.sqrt(Math.random());

        const p = heartPoint(t);

        const targetX = W / 2 + p.x * radius * scale;
        const targetY = H / 2 + p.y * radius * scale;

        particles.push({
            x: W / 2 + (Math.random() - 0.5) * W,
            y: H / 2 + (Math.random() - 0.5) * H,

            tx: targetX,
            ty: targetY,

            speed: 0.025 + Math.random() * 0.045,
            delay: Math.random() * 100,

            phase: Math.random() * 10,
            size: Math.random() * 2 + 0.7,

            alpha: Math.random() * 0.8 + 0.2,

            word: Math.random() > 0.55
                ? "I LOVE YOU"
                : "LOVE"
        });
    }
}

function createStars() {
    stars = [];

    for (let i = 0; i < 120; i++) {
        stars.push({
            x: Math.random() * W,
            y: Math.random() * H,
            size: Math.random() * 1.5,
            alpha: Math.random()
        });
    }
}

function drawStars() {
    for (const s of stars) {

        s.alpha += (Math.random() - 0.5) * 0.04;
        s.alpha = Math.max(0.1, Math.min(1, s.alpha));

        ctx.fillStyle = `rgba(60,150,255,${s.alpha})`;

        ctx.fillRect(s.x, s.y, s.size, s.size);
    }
}

function drawParticle(p, beat) {

    const pulseX = W / 2 + (p.tx - W / 2) * beat;
    const pulseY = H / 2 + (p.ty - H / 2) * beat;

    const flicker = 0.5 +
        Math.sin(frame * 0.045 + p.phase) * 0.4;

    const alpha = Math.max(0.15, flicker) * p.alpha;

    ctx.save();

    ctx.globalAlpha = alpha;

    ctx.shadowColor = "#008cff";
    ctx.shadowBlur = 12;

    ctx.fillStyle = "#168dff";

    ctx.font = "bold 7px Arial";

    // Small glowing words forming the heart
    ctx.fillText(p.word, p.x, p.y);

    ctx.restore();

    // Move particles toward their heart positions
    p.x += (pulseX - p.x) * p.speed;
    p.y += (pulseY - p.y) * p.speed;

    // Tiny random movement
    p.x += Math.sin(frame * 0.02 + p.phase) * 0.15;
    p.y += Math.cos(frame * 0.02 + p.phase) * 0.15;
}

function drawHeartOutline(beat) {

    const scale = Math.min(W / 39, H / 35) * 0.85;

    ctx.save();

    ctx.beginPath();

    for (let i = 0; i <= 250; i++) {

        const t = (i / 250) * Math.PI * 2;
        const p = heartPoint(t);

        const x = W / 2 + p.x * scale * beat;
        const y = H / 2 + p.y * scale * beat;

        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }

    ctx.closePath();

    ctx.strokeStyle = "rgba(0,140,255,0.3)";
    ctx.lineWidth = 1.5;
    ctx.shadowColor = "#008cff";
    ctx.shadowBlur = 18;

    ctx.stroke();

    ctx.restore();
}

function animate() {

    frame++;

    ctx.fillStyle = "rgba(0,3,10,0.24)";
    ctx.fillRect(0, 0, W, H);

    drawStars();

    // Heart gradually forms
    progress = Math.min(1, progress + 0.003);

    const beat = 1 + Math.sin(frame * 0.045) * 0.025;

    drawHeartOutline(beat);

    for (const p of particles) {

        if (frame > p.delay) {
            drawParticle(p, beat);
        }
    }

    requestAnimationFrame(animate);
}

window.addEventListener("resize", resize);

resize();
animate();
