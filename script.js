// Initialize Lucide Icons
lucide.createIcons();

// Initialize AOS
AOS.init({ duration: 800, once: true, offset: 50 });

// Dark Mode
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

// --- STRICT BULLET-TO-BULLET SCROLL LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    const trackContainer = document.getElementById('experience-track');
    const staticLine = document.getElementById('static-line');
    const progressBar = document.getElementById('line-progress');
    const dots = document.querySelectorAll('.timeline-dot');

    function updateScrollProgress() {
        if (!trackContainer || !staticLine || !progressBar || dots.length < 2) return;

        // 1. Get positions relative to the container
        const containerRect = trackContainer.getBoundingClientRect();
        const firstDotRect = dots[0].getBoundingClientRect();
        const lastDotRect = dots[dots.length - 1].getBoundingClientRect();

        // 2. Calculate Start and End points (Centers of the dots)
        // offsetTop gives distance from top of container to top of dot
        // We add dotHeight/2 to get to the center
        const dotHeight = firstDotRect.height;
        const startY = dots[0].offsetTop + (dotHeight / 2);
        const endY = dots[dots.length - 1].offsetTop + (dotHeight / 2);
        const totalDistance = endY - startY;

        // 3. Set the Static Gray Line to fit exactly between first and last dot
        staticLine.style.top = `${startY}px`;
        staticLine.style.height = `${totalDistance}px`;
        
        // 4. Set the Blue Line Start Position
        progressBar.style.top = `${startY}px`;

        // 5. Calculate Scroll Progress
        // Trigger point is center of screen
        const triggerPoint = window.innerHeight / 2;
        const distFromTop = triggerPoint - firstDotRect.top - (dotHeight / 2);

        // 6. Limit the blue line
        let fillHeight = Math.max(0, distFromTop); // Can't be negative
        fillHeight = Math.min(fillHeight, totalDistance); // Can't go past last dot

        // 7. Apply height
        progressBar.style.height = `${fillHeight}px`;
    }

    // Run on scroll and resize
    window.addEventListener('scroll', updateScrollProgress);
    window.addEventListener('resize', updateScrollProgress);
    // Run initially to set positions
    updateScrollProgress();
});
