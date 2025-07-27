const stage = document.getElementById('stage');
const ctx = stage.getContext('2d');

const w = stage.width;
const h = stage.height;

const rows = 100;
const cols = 100;
const cellW = w/cols;
const cellH = h/cols;

const radToVec = rad => [Math.cos(rad), Math.sin(rad)];
const addVec = ([x1, y1], [x2, y2]) => [x1+x2, y1+y2];
const scaleVec = ([x, y], sc) => [x*sc, y*sc];
const randAngle = () => Math.random() * 2 * Math.PI;

const clamp = (x, min, max) => Math.max(min, Math.min(max, x));

const fieldToScreen = ([fx, fy]) => [fx*w/cols+cellW/2, fy*h/rows+cellH/2];
const screenToField = ([sx, sy]) => [
    clamp(Math.floor(sx/cellW), 0, cols-1),
    clamp(Math.floor(sy/cellH), 0, rows-1)
];

const particleCount = 300;
const particleRadius = 2;
const randParticle = () => [Math.random()*w, Math.random()*h];
const particles = Array.from({length: particleCount}, randParticle);

const randLifetime = () => Math.floor(Math.random() * 60 * 5);
const lifetimes = Array.from({length: particleCount}, randLifetime);

const field = Array.from({length: rows}, (_, y) => Array.from({length: cols}, (_, x) => {
    const xp = x/cols;
    const yp = y/rows;
    return radToVec(Math.sin(xp*8 + yp*2));
}));

ctx.fillStyle = 'hsl(0 0 0)';
ctx.rect(0, 0, w, h);
ctx.fill();

const draw = () => {
    ctx.fillStyle = 'hsl(0 0 0 / 0.05%)';
    ctx.rect(0, 0, w, h);
    ctx.fill();

    ctx.fillStyle = 'hsl(0 0 255 / 1%)';

    for (let i = 0; i < particleCount; i++){
        const [x, y] = particles[i];

        ctx.beginPath();
        ctx.arc(x, y, particleRadius, 0, Math.PI*2);
        ctx.fill();

        const [fx, fy] = screenToField([x, y]);
        const fv = field[fy][fx];
        particles[i] = addVec(particles[i], fv);

        if (lifetimes[i]-- <= 0){
            particles[i] = randParticle();
            lifetimes[i] = randLifetime();
        }
    }

    window.requestAnimationFrame(draw);
};
window.requestAnimationFrame(draw);
