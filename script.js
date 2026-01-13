// 1. Initialize Libraries
lucide.createIcons();
AOS.init({
    duration: 800,
    once: true,
    offset: 50
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
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        localStorage.theme = 'light';
    } else {
        html.classList.add('dark');
        localStorage.theme = 'dark';
    }
});

// 3. Updated "Read More" Logic for New Cards
document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        const card = this.closest('.experience-card');
        const content = card.querySelector('.hidden-content');
        const icon = this.querySelector('i');
        // Get the text node (ignoring the icon element)
        const textNode = this.childNodes[0]; 

        // Toggle Grid Rows to animate height
        if (content.classList.contains('grid-rows-[0fr]')) {
            // OPEN
            content.classList.remove('grid-rows-[0fr]');
            content.classList.add('grid-rows-[1fr]');
            
            // Fade in content
            setTimeout(() => {
                content.querySelector('ul').classList.remove('opacity-0');
            }, 50);

            // Update Button UI
            textNode.textContent = 'Show Less ';
            icon.setAttribute('data-lucide', 'chevron-up');
            // Remove the hover translate effect when open
            icon.classList.remove('group-hover/btn:translate-x-1');
        } else {
            // CLOSE
            content.querySelector('ul').classList.add('opacity-0');
            content.classList.remove('grid-rows-[1fr]');
            content.classList.add('grid-rows-[0fr]');
            
            // Update Button UI
            textNode.textContent = 'Read more ';
            icon.setAttribute('data-lucide', 'chevron-right');
            // Re-add the hover translate effect
            icon.classList.add('group-hover/btn:translate-x-1');
        }
        
        // Refresh icons to apply the new chevron-up/down
        lucide.createIcons();
    });
});
