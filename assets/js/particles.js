const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const radius = 2.5;
const minDistance = 40;
const maxDistance = 60;
const minDistance2 = minDistance * minDistance;
const maxDistance2 = maxDistance * maxDistance;
const tau = 2 * Math.PI;
const n = 1500;
const particles = Array.from({ length: n }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * 750,
    vx: 0,
    vy: 0
}));

let width = 0,
    height = 0;

function onResize() {
    width = document.body.clientWidth;
    height = 750;
    canvas.width = width;
    canvas.height = height;
}

onResize();

window.addEventListener('resize', onResize);

function updateParticles() {
    for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -maxDistance) p.x += width + maxDistance * 2;
        else if (p.x > width + maxDistance) p.x -= width + maxDistance * 2;

        if (p.y < -maxDistance) p.y += height + maxDistance * 2;
        else if (p.y > height + maxDistance) p.y -= height + maxDistance * 2;

        p.vx += 0.2 * (Math.random() - 0.5) - 0.01 * p.vx;
        p.vy += 0.2 * (Math.random() - 0.5) - 0.01 * p.vy;
    }
}

function drawParticles() {
    context.clearRect(0, 0, width, height);
    context.fillStyle = "hsl(207, 90%, 72%)";
    context.strokeStyle = "hsl(207, 90%, 72%)";

    for (let p of particles) {
        context.beginPath();
        context.arc(p.x, p.y, radius, 0, tau);
        context.fill();
    }
}

function drawLines() {
    for (let i = 0; i < n; ++i) {
        for (let j = i + 1; j < n; ++j) {
            const pi = particles[i];
            const pj = particles[j];
            const dx = pi.x - pj.x;
            const dy = pi.y - pj.y;
            const d2 = dx * dx + dy * dy;

            if (d2 < maxDistance2) {
                context.globalAlpha = d2 > minDistance2 ? (maxDistance2 - d2) / (maxDistance2 - minDistance2) : 1;
                context.beginPath();
                context.moveTo(pi.x, pi.y);
                context.lineTo(pj.x, pj.y);
                context.stroke();
            }
        }
    }
    context.globalAlpha = 1;
}

function step() {
    updateParticles();
    drawParticles();
    drawLines();
    requestAnimationFrame(step);
}

requestAnimationFrame(step);
