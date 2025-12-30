// --- 1. PARTICLE BACKGROUND ---
const canvas = document.getElementById('particle-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    let particlesArray = [];

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x; this.y = y;
            this.directionX = directionX; this.directionY = directionY;
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

    function initParticles() {
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

    function connectParticles() {
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

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        particlesArray.forEach(p => p.update());
        connectParticles();
    }

    window.addEventListener('resize', () => {
        canvas.width = innerWidth; canvas.height = innerHeight;
        initParticles();
    });
    initParticles();
    animateParticles();
}

// --- 2. INTERACTIVE BOOK LOGIC ---
const book = document.querySelector('.book');
if (book) {
    const pages = document.querySelectorAll('.page');
    const totalPages = pages.length;
    const maxRotation = -170; // Degrees

    function updateBook(clientX) {
        const rect = book.getBoundingClientRect();
        // Trigger area is wider than the book to allow easy opening
        const spineX = rect.left;
        const width = rect.width;
        
        const startX = spineX + (width * 1.5); // Start triggering right of book
        const endX = spineX - (width * 0.5);   // End triggering left of book
        
        let progress = (startX - clientX) / (startX - endX);
        if (progress < 0) progress = 0;
        if (progress > 1) progress = 1;
        
        pages.forEach((page, index) => {
            const pageFactor = index / (totalPages - 1);
            const currentRotation = progress * maxRotation * pageFactor;
            page.style.transform = `rotateY(${currentRotation}deg)`;
            page.style.translate = `0 0 ${index}px`; // Prevent Z-fighting
        });
    }

    window.addEventListener('mousemove', (e) => {
        requestAnimationFrame(() => updateBook(e.clientX));
    });
    
    // Initial State (Closed)
    updateBook(window.innerWidth * 2); 
}

// --- 3. ACCORDION LOGIC (COURSES) ---
const accHeaders = document.querySelectorAll('.accordion-header');
accHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const content = header.nextElementSibling;
        const icon = header.querySelector('span');
        
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
            content.classList.remove('active');
            icon.textContent = '+';
        } else {
            // Optional: Close others
            document.querySelectorAll('.accordion-content').forEach(c => {
                c.style.maxHeight = null; 
                c.classList.remove('active');
            });
            document.querySelectorAll('.accordion-header span').forEach(s => s.textContent = '+');

            content.style.maxHeight = content.scrollHeight + "px";
            content.classList.add('active');
            icon.textContent = '-';
        }
    });
});
