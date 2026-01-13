// Initialize Lucide Icons
lucide.createIcons();

// Initialize AOS (Animate on Scroll)
AOS.init({
    duration: 800,
    once: true,
    offset: 50,
});

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

// --- POINT-TO-POINT SCROLL LOGIC ---
document.addEventListener('DOMContentLoaded', () => {
    const track = document.getElementById('experience-track');
    const progressBar = document.getElementById('line-progress');
    // Get all job items to find the last one
    const jobItems = document.querySelectorAll('.job-item');

    function updateScrollProgress() {
        if (!track || !progressBar || jobItems.length === 0) return;

        const trackRect = track.getBoundingClientRect();
        const lastJob = jobItems[jobItems.length - 1];
        const lastJobRect = lastJob.getBoundingClientRect();

        // 1. Where do we want the line to stop? 
        // Exactly at the last dot. The dot is ~8px (0.5rem) from the top of the job item.
        const maxFillHeight = lastJobRect.top - trackRect.top; // Relative distance to last item

        // 2. Where is the user currently? (Center of screen)
        const triggerPoint = window.innerHeight / 2;
        
        // 3. Calculate "Raw" fill (Distance from track top to trigger point)
        // We subtract 8px (approx) because the track starts at top-2
        let currentFill = triggerPoint - trackRect.top - 8;

        // 4. Apply Limits
        // Don't go below 0
        currentFill = Math.max(0, currentFill);
        
        // Don't go past the last dot (The Point-to-Point fix)
        currentFill = Math.min(currentFill, maxFillHeight);

        // Apply height in Pixels, not percentage, for perfect precision
        progressBar.style.height = `${currentFill}px`;
    }

    // Run on scroll and load
    window.addEventListener('scroll', updateScrollProgress);
    window.addEventListener('resize', updateScrollProgress);
    updateScrollProgress();
});
