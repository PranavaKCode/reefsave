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
    // 1. Duplicate the content to create the seamless loop
    // We clone the existing images and append them to the end
    const content = track.innerHTML;
    track.innerHTML = content + content; // Duplicate exactly once
}

// --- 3. ABOUT: FANNING BOOK LOGIC ---
const book = document.querySelector('.book');
if (book) {
    const pages = document.querySelectorAll('.page');
    const totalPages = pages.length;
    const maxRotation = -170; // Degrees

    function updateBook(clientX) {
        const rect = book.getBoundingClientRect();
        const spineX = rect.left;
        const width = rect.width;
        
        // Trigger logic
        const startX = spineX + (width * 1.5); 
        const endX = spineX - (width * 0.5);   
        
        let progress = (startX - clientX) / (startX - endX);
        if (progress < 0) progress = 0;
        if (progress > 1) progress = 1;
        
        pages.forEach((page, index) => {
            // Factor: index 0 (bottom) moves least, top moves most
            const pageFactor = index / (totalPages - 1);
            const currentRotation = progress * maxRotation * pageFactor;
            
            page.style.transform = `rotateY(${currentRotation}deg)`;
            page.style.translate = `0 0 ${index}px`; 

            // Text Visibility Logic (Un-mirroring)
            if (currentRotation < -90) {
                page.classList.add('open');
            } else {
                page.classList.remove('open');
            }
        });
    }

    window.addEventListener('mousemove', (e) => {
        requestAnimationFrame(() => updateBook(e.clientX));
    });

    // Mobile touch support for book
    window.addEventListener('touchmove', (e) => {
         requestAnimationFrame(() => updateBook(e.touches[0].clientX));
    });
    
    // Initial closed state
    updateBook(window.innerWidth * 2); 
}

// --- 4. COURSES: ACCORDION LOGIC ---
const accTriggers = document.querySelectorAll('.accordion-trigger');
accTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
        const content = trigger.nextElementSibling;
        const icon = trigger.querySelector('span');
        
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
            icon.textContent = '+';
        } else {
            // Close others (optional, keeps UI clean)
            document.querySelectorAll('.accordion-content').forEach(c => c.style.maxHeight = null);
            document.querySelectorAll('.accordion-trigger span').forEach(s => s.textContent = '+');
            
            // Open clicked
            content.style.maxHeight = content.scrollHeight + "px";
            icon.textContent = '-';
        }
    });
});
