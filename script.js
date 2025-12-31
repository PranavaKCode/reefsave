// --- 1. PARTICLE NETWORK ---
const canvas = document.getElementById('particle-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let particlesArray = [];

    class Particle {
        constructor(x, y, dirX, dirY, size, color) {
            this.x = x; this.y = y;
            this.directionX = dirX; this.directionY = dirY;
            this.size = size; this.color = color;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = '#64ffda'; ctx.fill();
        }
        update() {
            if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
            if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
            this.x += this.directionX; this.y += this.directionY;
            this.draw();
        }
    }

    function init() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 15000;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = Math.random() * innerWidth;
            let y = Math.random() * innerHeight;
            let dirX = (Math.random() * 0.4) - 0.2;
            let dirY = (Math.random() * 0.4) - 0.2;
            particlesArray.push(new Particle(x, y, dirX, dirY, size, '#64ffda'));
        }
    }

    function connect() {
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) ** 2) + ((particlesArray[a].y - particlesArray[b].y) ** 2);
                if (distance < (canvas.width/7) * (canvas.height/7)) {
                    let opacity = 1 - (distance/20000);
                    ctx.strokeStyle = `rgba(100, 255, 218, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        particlesArray.forEach(p => p.update());
        connect();
    }
    window.addEventListener('resize', () => {
        canvas.width = innerWidth; canvas.height = innerHeight; init();
    });
    init();
    animate();
}

// --- 2. HOME: INFINITE SCROLLER SETUP ---
const track = document.getElementById("image-track");
if (track) {
    const content = track.innerHTML;
    track.innerHTML = content + content; // Duplicate exactly once for loop
}

// --- 3. COURSES: ACCORDION LOGIC ---
const accTriggers = document.querySelectorAll('.accordion-trigger');
accTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
        const content = trigger.nextElementSibling;
        const icon = trigger.querySelector('span');
        
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
            icon.textContent = '+';
        } else {
            document.querySelectorAll('.accordion-content').forEach(c => c.style.maxHeight = null);
            document.querySelectorAll('.accordion-trigger span').forEach(s => s.textContent = '+');
            
            content.style.maxHeight = content.scrollHeight + "px";
            icon.textContent = '-';
        }
    });
});

// --- 4. MOBILE MENU LOGIC ---
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-links");

if(hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });

    document.querySelectorAll(".nav-links a").forEach(n => n.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
    }));
}

// --- 5. HLS VIDEO PLAYER (FOR HERO SECTION) ---
const video = document.getElementById('hero-video');
const videoSrc = 'https://video.squarespace-cdn.com/content/v1/688d71a41f9bb734638622da/133975e1-30c4-4c1d-ba3a-20e48509785f/playlist.m3u8';

if (video) {
    if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(videoSrc);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, function() {
            video.play();
        });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // For Native HLS support (Safari)
        video.src = videoSrc;
        video.addEventListener('loadedmetadata', function() {
            video.play();
        });
    }
}
