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

// Check saved preference
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
        const content = card.querySelector('.hidden-content');
        
        if (content.classList.contains('grid-rows-[0fr]')) {
            content.classList.remove('grid-rows-[0fr]');
            content.classList.add('grid-rows-[1fr]');
            
            setTimeout(() => {
                content.querySelector('ul').classList.remove('opacity-0');
            }, 50);

            span.textContent = 'Show Less';
        } else {
            content.querySelector('ul').classList.add('opacity-0');
            content.classList.remove('grid-rows-[1fr]');
            content.classList.add('grid-rows-[0fr]');
            
            span.textContent = 'Read More';
        }
        
        // Update line after animation allows height change
        setTimeout(() => {
            updateScrollProgress();
        }, 500);
    });
});

// 4. Scroll Line Logic (Fixed for Relative Nesting)
const trackContainer = document.getElementById('experience-track');
const staticLine = document.getElementById('static-line');
const progressBar = document.getElementById('line-progress');
const dots = document.querySelectorAll('.timeline-dot');

function updateScrollProgress() {
    if (!trackContainer || !staticLine || !progressBar || dots.length < 2) return;

    // Use getBoundingClientRect for absolute precision relative to viewport
    const trackRect = trackContainer.getBoundingClientRect();
    const firstDotRect = dots[0].getBoundingClientRect();
    const lastDotRect = dots[dots.length - 1].getBoundingClientRect();
    
    // Calculate positions relative to the track container
    const startTop = (firstDotRect.top - trackRect.top) + (firstDotRect.height / 2);
    const endTop = (lastDotRect.top - trackRect.top) + (lastDotRect.height / 2);
    const totalDistance = endTop - startTop;

    // Set Static Line Position
    staticLine.style.top = `${startTop}px`;
    staticLine.style.height = `${totalDistance}px`;
    
    // Set Progress Bar Start Position
    progressBar.style.top = `${startTop}px`;

    // Calculate Fill Progress based on viewport position
    const triggerPoint = window.innerHeight / 2;
    // How far the first dot is from the trigger point
    const distFromTrigger = triggerPoint - firstDotRect.top - (firstDotRect.height / 2);

    let fillHeight = Math.max(0, distFromTrigger);
    fillHeight = Math.min(fillHeight, totalDistance);

    progressBar.style.height = `${fillHeight}px`;
}

// Event Listeners for scroll logic
document.addEventListener('DOMContentLoaded', updateScrollProgress);
window.addEventListener('scroll', updateScrollProgress);
window.addEventListener('resize', updateScrollProgress);
