// Global variables
let currentSection = 1;
let score = 0;
let gameActive = true;
let candlesLit = true;
let hearts = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initAnimations();
    initGame();
    createFloatingElements();
    startSparkles();
});

// Section Navigation
function nextSection() {
    const current = document.getElementById(`section${currentSection}`);
    const next = document.getElementById(`section${currentSection + 1}`);
    
    current.classList.remove('active');
    current.classList.add('prev');
    
    setTimeout(() => {
        next.classList.add('active');
        currentSection++;
        
        // Initialize section-specific content
        if (currentSection === 2) initTypingAnimation();
        if (currentSection === 4) resetGame();
        if (currentSection === 6) initFinalSection();
    }, 500);
}

// SECTION 2: Typing Animation
function initTypingAnimation() {
    const texts = document.querySelectorAll('.typing-text');
    
    texts.forEach((text, index) => {
        setTimeout(() => {
            text.classList.add('visible');
            typeText(text, index * 1000);
        }, index * 800);
    });
}

function typeText(element, delay) {
    const fullText = element.getAttribute('data-text');
    element.textContent = '';
    
    let i = 0;
    const timer = setInterval(() => {
        element.textContent += fullText[i];
        i++;
        if (i > fullText.length) {
            clearInterval(timer);
            element.style.opacity = '1';
        }
    }, 80);
}

// SECTION 3: Lightbox
function openLightbox(index) {
    const images = [
        'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=1200&fit=crop&crop=entropy',
        'https://images.unsplash.com/photo-1576483487922-fd91f7068437?w=800&h=1200&fit=crop&crop=entropy',
        'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&h=1200&fit=crop&crop=entropy'
    ];
    
    document.getElementById('lightbox-img').src = images[index];
    document.getElementById('lightbox').classList.add('active');
}

function closeLightbox() {
    document.getElementById('lightbox').classList.remove('active');
}

// SECTION 4: Catch the Hearts Game
function initGame() {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = 500;
    canvas.height = 400;
    
    // Game loop
    function gameLoop() {
        if (gameActive && score < 20) {
            updateHearts();
            draw(ctx);
            requestAnimationFrame(gameLoop);
        }
    }
    
    canvas.addEventListener('click', handleClick);
    gameLoop();
}

function createHeart(x, y) {
    return {
        x: x,
        y: y,
        size: Math.random() * 30 + 20,
        speed: Math.random() * 3 + 1,
        rotation: 0,
        rotSpeed: Math.random() * 0.1 + 0.05,
        color: ['#ff69b4', '#ff1493', '#ffb6c1', '#ffc0cb'][Math.floor(Math.random() * 4)]
    };
}

function updateHearts() {
    if (Math.random() < 0.02) {
        hearts.push(createHeart(Math.random() * 450 + 25, -50));
    }
    
    for (let i = hearts.length - 1; i >= 0; i--) {
        const heart = hearts[i];
        heart.y += heart.speed;
        heart.rotation += heart.rotSpeed;
        
        if (heart.y > 450) {
            hearts.splice(i, 1);
        }
    }
}

function draw(ctx) {
    ctx.clearRect(0, 0, 500, 400);
    
    hearts.forEach(heart => {
        ctx.save();
        ctx.translate(heart.x, heart.y);
        ctx.rotate(heart.rotation);
        ctx.fillStyle = heart.color;
        ctx.shadowColor = heart.color;
        ctx.shadowBlur = 10;
        
        // Draw heart shape
        ctx.beginPath();
        ctx.moveTo(0, -heart.size/2);
        ctx.bezierCurveTo(-heart.size/2, -heart.size/2, -heart.size/2, 0, 0, heart.size/2);
        ctx.bezierCurveTo(heart.size/2, 0, heart.size/2, -heart.size/2, 0, -heart.size/2);
        ctx.fill();
        
        ctx.restore();
    });
}

function handleClick(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    for (let i = hearts.length - 1; i >= 0; i--) {
        const heart = hearts[i];
        const dx = x - heart.x;
        const dy = y - heart.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < heart.size / 2) {
            hearts.splice(i, 1);
            score++;
            document.getElementById('score').textContent = score;
            
            // Heart burst effect
            createHeartBurst(heart.x, heart.y);
            
            if (score >= 20) {
                gameComplete();
            }
            break;
        }
    }
}

function createHeartBurst(x, y) {
    for (let i = 0; i < 6; i++) {
        setTimeout(() => {
            const burstHeart = createHeart(x, y);
            burstHeart.speed = -(Math.random() * 4 + 2);
            burstHeart.x += (Math.random() - 0.5) * 100;
            hearts.push(burstHeart);
        }, i * 50);
    }
}

function gameComplete() {
    gameActive = false;
    document.getElementById('gameComplete').classList.remove('hidden');
    document.getElementById('gameBtn').classList.remove('hidden');
}

function resetGame() {
    score = 0;
    hearts = [];
    gameActive = true;
    document.getElementById('score').textContent = '0';
    document.getElementById('gameComplete').classList.add('hidden');
    document.getElementById('gameBtn').classList.add('hidden');
}

// SECTION 5: Birthday Cake
function blowCandles() {
    if (!candlesLit) return;
    
    candlesLit = false;
    document.querySelectorAll('.flame').forEach(flame => {
        flame.style.opacity = '0';
        flame.style.transform = 'scale(0)';
    });
    
    setTimeout(() => {
        createConfetti();
        document.getElementById('wishMessage').classList.remove('hidden');
        document.getElementById('finalBtn').classList.remove('hidden');
        document.getElementById('blowBtn').classList.add('hidden');
    }, 800);
    
    // Animate cake bounce
    document.querySelector('.cake').style.animation = 'cakeBounce 0.6s ease';
}

function createConfetti() {
    const confettiContainer = document.getElementById('confetti-container');
    confettiContainer.innerHTML = '';
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = ['#ff69b4', '#ffb6c1', '#ff1493', '#ffc0cb', '#fff'][Math.floor(Math.random() * 5)];
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confettiContainer.appendChild(confetti);
    }
}

// SECTION 6: Final Heart Explosion
function heartExplosion() {
    const finalBtn = document.querySelector('.final-btn');
    finalBtn.style.transform = 'scale(0)';
    
    createMassiveHeartExplosion();
    
    setTimeout(() => {
        finalBtn.innerHTML = '<span>Forever Together 💖</span>';
        finalBtn.style.transform = 'scale(1.1)';
        finalBtn.style.background = 'linear-gradient(45deg, #ff1493, #ff69b4)';
    }, 1500);
}

function createMassiveHeartExplosion() {
    const container = document.querySelector('#section6 .content');
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.innerHTML = '💖';
            heart.style.position = 'absolute';
            heart.style.left = '50%';
            heart.style.top = '50%';
            heart.style.fontSize = Math.random() * 40 + 20 + 'px';
            heart.style.pointerEvents = 'none';
            heart.style.zIndex = '100';
            
            const angle = (Math.PI * 2 * i) / 50;
            const velocity = 200 + Math.random() * 200;
            const vx = Math.cos(angle) * velocity;
            const vy = Math.sin(angle) * velocity;
            
            heart.animate([
                { transform: 'translate(-50%, -50%) scale(1)', opacity: 1 },
                { 
                    transform: `translate(calc(-50% + ${vx}px), calc(-50% + ${vy}px)) scale(0)`, 
                    opacity: 0 
                }
            ], {
                duration: 2000 + Math.random() * 1000,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            });
            
            container.appendChild(heart);
            
            setTimeout(() => heart.remove(), 3000);
        }, i * 30);
    }
}

// Additional Effects
function initAnimations() {
    // Continuous floating hearts
    setInterval(() => {
        const heartsContainer = document.querySelector('.floating-hearts');
        const heart = document.createElement('div');
        heart.innerHTML = ['💖', '💕', '💗', '💝'][Math.floor(Math.random() * 4)];
        heart.style.position = 'absolute';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animation = `float ${6 + Math.random() * 4}s linear infinite`;
        heart.style.fontSize = (20 + Math.random() * 20) + 'px';
        heartsContainer.appendChild(heart);
        
        setTimeout(() => heart.remove(), 10000);
    }, 2000);
}

function createFloatingElements() {
    // Initial floating elements
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const heartsContainer = document.querySelector('.floating-hearts');
            const heart = document.createElement('div');
            heart.innerHTML = '💖';
            heart.style.position = 'absolute';
            heart.style.left = Math.random() * 100 + '%';
            heart.style.top = '-50px';
            heart.style.animation = `float ${6 + Math.random() * 4}s linear infinite`;
            heart.style.fontSize = '25px';
            heartsContainer.appendChild(heart);
        }, i * 1000);
    }
}

function startSparkles() {
    setInterval(() => {
        const sparklesContainer = document.querySelector('.sparkles');
        const sparkle = document.createElement('div');
        sparkle.innerHTML = '✨';
        sparkle.style.position = 'absolute';
        sparkle.style.left = Math.random() * 100 + '%';
        sparkle.style.top = Math.random() * 100 + '%';
        sparkle.style.animation = `sparkle ${3 + Math.random() * 2}s infinite`;
        sparkle.style.fontSize = '18px';
        sparklesContainer.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 5000);
    }, 1500);
}

function initFinalSection() {
    // Teddy bear animation
    const teddy = document.querySelector('.teddy-bear');
    teddy.style.animation = 'teddyBounce 2s infinite';
}

// Responsive canvas reference
const canvas = document.getElementById('gameCanvas');

// Add some mobile responsiveness
window.addEventListener('resize', function() {
    if (window.innerWidth < 600) {
        canvas.width = window.innerWidth - 40;
    }
});