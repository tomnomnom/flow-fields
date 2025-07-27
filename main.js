const stage = document.getElementById('stage');
const ctx = stage.getContext('2d');

const w = stage.width;
const h = stage.height;

const rows = 300;
const cols = 400;
const cellW = w/cols;
const cellH = h/rows;

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

const maxLifetime = 60*5;
const randLifetime = () => Math.floor(Math.random() * maxLifetime);
const lifetimes = Array.from({length: particleCount}, randLifetime);

const field = Array.from({length: rows}, (_, y) => Array.from({length: cols}, (__, x) => {

    const xp = x/cols;
    const yp = y/rows;

    const comps = [
        Math.sin((x - y)*0.01),
        Math.sin((xp * yp)*0.00001)*9,
        Math.sin((x+y)*0.01)*9,
    ];
    const avg = comps.reduce((x, y) => x + y, 0) / comps.length;

    return radToVec(avg * Math.PI);
}));

ctx.fillStyle = 'hsl(0 0 0)';
ctx.rect(0, 0, w, h);
ctx.fill();

const draw = () => {
    ctx.fillStyle = 'hsl(0 0 0 / 0.05%)';
    ctx.rect(0, 0, w, h);
    ctx.fill();


    for (let i = 0; i < particleCount; i++){
        const [x, y] = particles[i];

        if (lifetimes[i]-- <= 0){
            particles[i] = randParticle();
            lifetimes[i] = randLifetime();
        }

        const hue = Math.floor(lifetimes[i]/maxLifetime*255)
        ctx.fillStyle = 'hsl('+hue+' 210 200 / 1%)';

        ctx.beginPath();
        ctx.arc(x, y, particleRadius, 0, Math.PI*2);
        ctx.fill();

        const [fx, fy] = screenToField([x, y]);
        const fv = field[fy][fx];
        particles[i] = addVec(particles[i], fv);

    }

    window.requestAnimationFrame(draw);
};
window.requestAnimationFrame(draw);
