// 1. Initialize Libraries
lucide.createIcons();
AOS.init({
    duration: 1000,
    once: true,
    offset: 50,
    easing: 'ease-out-cubic'
});

// 2. Dark Mode Logic
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Check local storage or system preference
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.classList.add('dark');
} else {
    html.classList.remove('dark');
}

// Toggle click handler
themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    localStorage.theme = html.classList.contains('dark') ? 'dark' : 'light';
});

// 3. Accordion "View Details" Logic
document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const card = this.closest('.glass-card');
        const span = this.querySelector('span');
        const content = card.querySelector('.hidden-content');
        
        // Toggle animation classes
        if (content.classList.contains('grid-rows-[0fr]')) {
            content.classList.remove('grid-rows-[0fr]');
            content.classList.add('grid-rows-[1fr]');
            
            // Fade in content slightly after height expansion starts
            setTimeout(() => {
                content.querySelector('ul').classList.remove('opacity-0');
            }, 50);

            span.textContent = 'Show Less';
        } else {
            content.querySelector('ul').classList.add('opacity-0');
            content.classList.remove('grid-rows-[1fr]');
            content.classList.add('grid-rows-[0fr]');
            
            span.textContent = 'View Details';
        }
        
        // Recalculate scroll line because the page height changed
        setTimeout(() => {
            updateScrollProgress();
        }, 500);
    });
});

// 4. Scroll Line Logic (Responsive Update)
const trackContainer = document.getElementById('experience-track');
const staticLine = document.getElementById('static-line');
const progressBar = document.getElementById('line-progress');
const dots = document.querySelectorAll('.timeline-dot');

function updateScrollProgress() {
    if (!trackContainer || !staticLine || !progressBar || dots.length < 2) return;

    const firstDotRect = dots[0].getBoundingClientRect();
    const lastDotRect = dots[dots.length - 1].getBoundingClientRect();
    
    // Calculate tops relative to the dot's own position, making it robust against padding/margin changes
    const startTop = dots[0].offsetTop + (dots[0].offsetHeight / 2);
    const endTop = dots[dots.length - 1].offsetTop + (dots[dots.length - 1].offsetHeight / 2);
    const totalDistance = endTop - startTop;

    // Set Static Line Position
    staticLine.style.top = `${startTop}px`;
    staticLine.style.height = `${totalDistance}px`;
    
    // Set Progress Bar Start Position
    progressBar.style.top = `${startTop}px`;

    // Calculate Scroll Progress based on window center
    const triggerPoint = window.innerHeight / 2;
    const distFromTop = triggerPoint - firstDotRect.top - (firstDotRect.height / 2);

    // Clamp values so it doesn't go past the last dot
    let fillHeight = Math.max(0, distFromTop);
    fillHeight = Math.min(fillHeight, totalDistance);

    progressBar.style.height = `${fillHeight}px`;
}

// Run logic on load, scroll, and resize
document.addEventListener('DOMContentLoaded', updateScrollProgress);
window.addEventListener('scroll', updateScrollProgress);
window.addEventListener('resize', updateScrollProgress);
