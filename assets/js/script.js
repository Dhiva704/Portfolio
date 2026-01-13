// Scroll Reveal Animation
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.classList.add('hidden'); // Add hidden class initially via JS
    observer.observe(section);
});

// Add this CSS via JS for the animation to work without cluttering style.css
const style = document.createElement('style');
style.innerHTML = `
    .hidden { opacity: 0; transform: translateY(30px); transition: all 1s cubic-bezier(0.645, 0.045, 0.355, 1); }
    .visible { opacity: 1; transform: translateY(0); }
`;
document.head.appendChild(style);
