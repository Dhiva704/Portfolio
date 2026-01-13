// Initialize Lucide Icons
lucide.createIcons();

// Initialize AOS
AOS.init({ duration: 800, once: true, offset: 50 });

// Dark Mode Logic
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.classList.add('dark');
} else {
    html.classList.remove('dark');
}

themeToggle.addEventListener('click', () => {
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        localStorage.theme = 'light';
    } else {
        html.classList.add('dark');
        localStorage.theme = 'dark';
    }
});

// --- TOGGLE SHOW MORE/LESS LOGIC ---
document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const card = this.closest('.glass-card');
        const span = this.querySelector('span');
        
        // Toggle the expanded class on the card container
        card.classList.toggle('expanded');
        
        // Update Button Text
        if (card.classList.contains('expanded')) {
            span.textContent = 'Show Less';
        } else {
            span.textContent = 'View Details';
        }
        
        // Recalculate Scroll Line (Since height changed)
        setTimeout(updateScrollProgress, 500); // Wait for transition
    });
});


// --- STRICT BULLET-TO-BULLET SCROLL LOGIC (Optimized) ---
const trackContainer = document.getElementById('experience-track');
const staticLine = document.getElementById('static-line');
const progressBar = document.getElementById('line-progress');
const dots = document.querySelectorAll('.timeline-dot');

function updateScrollProgress() {
    if (!trackContainer || !staticLine || !progressBar || dots.length < 2) return;

    const firstDotRect = dots[0].getBoundingClientRect();
    const lastDotRect = dots[dots.length - 1].getBoundingClientRect();
    const containerRect = trackContainer.getBoundingClientRect();

    // Calculate Start (Center of first dot) relative to container
    const startTop = dots[0].offsetTop + (firstDotRect.height / 2);
    
    // Calculate Total Height (Distance between first and last dot centers)
    const totalDistance = (dots[dots.length - 1].offsetTop + (lastDotRect.height / 2)) - startTop;

    // Set Static Line Position
    staticLine.style.top = `${startTop}px`;
    staticLine.style.height = `${totalDistance}px`;
    
    // Set Blue Line Start Position
    progressBar.style.top = `${startTop}px`;

    // Calculate Scroll Progress
    const triggerPoint = window.innerHeight / 2;
    const distFromTop = triggerPoint - firstDotRect.top - (firstDotRect.height / 2);

    let fillHeight = Math.max(0, distFromTop);
    fillHeight = Math.min(fillHeight, totalDistance);

    progressBar.style.height = `${fillHeight}px`;
}

document.addEventListener('DOMContentLoaded', () => {
    updateScrollProgress();
    window.addEventListener('scroll', updateScrollProgress);
    window.addEventListener('resize', updateScrollProgress);
});
