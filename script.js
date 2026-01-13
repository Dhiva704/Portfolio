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

// Check Local Storage or System Preference on load
if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    html.classList.add('dark');
} else {
    html.classList.remove('dark');
}

// Toggle Click Handler
themeToggle.addEventListener('click', () => {
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        localStorage.theme = 'light';
    } else {
        html.classList.add('dark');
        localStorage.theme = 'dark';
    }
});

// SCROLL PROGRESS LINE LOGIC
window.addEventListener('scroll', () => {
    const experienceSection = document.getElementById('experience');
    const progressBar = document.getElementById('line-progress');
    
    if (experienceSection && progressBar) {
        const sectionTop = experienceSection.offsetTop;
        const sectionHeight = experienceSection.offsetHeight;
        const scrollPosition = window.scrollY + window.innerHeight / 2; // Trigger point is center of screen
        
        // Calculate percentage
        let progress = ((scrollPosition - sectionTop) / sectionHeight) * 100;
        
        // Limit between 0% and 100%
        progress = Math.max(0, Math.min(progress, 100));
        
        // Update height
        progressBar.style.height = `${progress}%`;
    }
});
