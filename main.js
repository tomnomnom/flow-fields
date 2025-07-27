const stage = document.getElementById('stage');
const ctx = stage.getContext('2d');

const w = stage.width;
const h = stage.height;

const rows = 150;
const cols = 400;
const cellW = w/cols;
const cellH = h/rows;

const radToVec = rad => [Math.cos(rad), Math.sin(rad)];
const addVec = ([x1, y1], [x2, y2]) => [x1+x2, y1+y2];
const scaleVec = ([x, y], sc) => [x*sc, y*sc];
const randAngle = () => Math.random() * 2 * Math.PI;

const particleCount = 4000;
const particleRadius = 1;
const randParticle = () => [Math.random()*w, Math.random()*h];
const particles = Array.from({length: particleCount}, randParticle);

const maxLifetime = 60*5;
const randLifetime = () => Math.floor(Math.random() * maxLifetime);
const lifetimes = Array.from({length: particleCount}, randLifetime);

const calculateVector = ([x, y], t, l) => {
    const comps = [
        Math.sin((x-y)*0.02)*(t/6000),
        Math.sin((x+y)*0.01)*(t/6000),
    ];
    const avg = comps.reduce((x, y) => x + y, 0) / comps.length;

    return radToVec(avg * Math.PI);
};

ctx.fillStyle = 'hsl(0 0 0)';
ctx.rect(0, 0, w, h);
ctx.fill();

const draw = (t) => {
    ctx.fillStyle = 'hsl(0 0 0 / 2%)';
    ctx.rect(0, 0, w, h);
    ctx.fill();

    for (let i = 0; i < particleCount; i++){
        const [x, y] = particles[i];

        if (lifetimes[i]-- <= 0){
            particles[i] = randParticle();
            lifetimes[i] = randLifetime();
        }

        const fv = calculateVector([x, y], t, lifetimes[i]);
        particles[i] = addVec(particles[i], fv);

        const hue = Math.floor(lifetimes[i]/maxLifetime*250)
        ctx.fillStyle = 'hsl('+hue+' 100 255 / 5%)';
        ctx.fillStyle = 'hsl(0 0 255 / 5%)';

        ctx.beginPath();
        ctx.arc(x, y, particleRadius, 0, Math.PI*2);
        ctx.fill();
    }

    window.requestAnimationFrame(draw);
};
window.requestAnimationFrame(draw);
