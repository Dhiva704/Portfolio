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

themeToggle.addEventListener('click', () => {
    html.classList.toggle('dark');
    localStorage.theme = html.classList.contains('dark') ? 'dark' : 'light';
});

// 3. Accordion "Read More" Logic
document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const card = this.closest('.experience-card');
        const span = this.querySelector('span');
        const icon = this.querySelector('i');
        const content = card.querySelector('.hidden-content');
        
        // Check current state
        if (content.classList.contains('grid-rows-[0fr]')) {
            // OPEN
            content.classList.remove('grid-rows-[0fr]');
            content.classList.add('grid-rows-[1fr]');
            icon.classList.add('rotate-180'); // Rotate arrow
            
            // Fade in content slightly after height transition starts
            setTimeout(() => {
                content.querySelector('ul').classList.remove('opacity-0');
            }, 50);

            span.textContent = 'Show Less';
        } else {
            // CLOSE
            content.querySelector('ul').classList.add('opacity-0');
            content.classList.remove('grid-rows-[1fr]');
            content.classList.add('grid-rows-[0fr]');
            icon.classList.remove('rotate-180');
            
            span.textContent = 'Read More';
        }
        
        // Recalculate scroll line because page height changed
        setTimeout(() => updateScrollProgress(), 500);
    });
});

// 4. Scroll Progress Line Logic
const trackContainer = document.getElementById('experience-track');
const staticLine = document.getElementById('static-line');
const progressBar = document.getElementById('line-progress');
const dots = document.querySelectorAll('.timeline-dot');

function updateScrollProgress() {
    if (!trackContainer || !staticLine || !progressBar || dots.length < 2) return;

    const firstDot = dots[0];
    const lastDot = dots[dots.length - 1];
    
    // Calculate vertical positions
    const firstDotTop = firstDot.offsetTop + (firstDot.offsetHeight / 2);
    const lastDotTop = lastDot.offsetTop + (lastDot.offsetHeight / 2);
    const totalDistance = lastDotTop - firstDotTop;

    // Position static gray line
    staticLine.style.top = `${firstDotTop}px`;
    staticLine.style.height = `${totalDistance}px`;
    
    // Position animated gradient line start
    progressBar.style.top = `${firstDotTop}px`;

    // Calculate how far we have scrolled relative to the timeline
    const firstDotRect = firstDot.getBoundingClientRect();
    const triggerPoint = window.innerHeight / 1.8; // Active point is just below center screen
    const distFromTop = triggerPoint - firstDotRect.top - (firstDotRect.height / 2);

    // Clamp the height (don't go below 0 or past the end)
    let fillHeight = Math.max(0, distFromTop);
    fillHeight = Math.min(fillHeight, totalDistance);

    progressBar.style.height = `${fillHeight}px`;
    
    // Optional: Highlight dots as they are passed
    dots.forEach((dot) => {
         const dotTop = dot.getBoundingClientRect().top;
         if (dotTop < triggerPoint) {
             dot.classList.add('scale-125', 'ring-2', 'ring-white/50');
         } else {
             dot.classList.remove('scale-125', 'ring-2', 'ring-white/50');
         }
    });
}

// Event Listeners for Scroll Logic
document.addEventListener('DOMContentLoaded', updateScrollProgress);
window.addEventListener('scroll', () => requestAnimationFrame(updateScrollProgress));
window.addEventListener('resize', updateScrollProgress);
