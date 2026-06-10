(() => {
    'use strict';

    const html = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const scrollProgress = document.getElementById('scroll-progress');
    const backToTop = document.getElementById('back-to-top');
    const trackContainer = document.getElementById('experience-track');
    const staticLine = document.getElementById('static-line');
    const progressBar = document.getElementById('line-progress');
    const dots = [...document.querySelectorAll('.timeline-dot')];
    const navLinks = [...document.querySelectorAll('.nav-link')];
    const sections = [...document.querySelectorAll('main section[id], footer[id]')];
    const toast = document.getElementById('toast');

    function safeStorageGet(key) {
        try {
            return window.localStorage.getItem(key);
        } catch (_error) {
            return null;
        }
    }

    function safeStorageSet(key, value) {
        try {
            window.localStorage.setItem(key, value);
        } catch (_error) {
            /* Storage can be unavailable in private mode. */
        }
    }

    function prefersDark() {
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    function setTheme(mode) {
        const isDark = mode === 'dark';
        html.classList.toggle('dark', isDark);
        themeToggle?.setAttribute('aria-pressed', String(isDark));
    }

    function initTheme() {
        const saved = safeStorageGet('theme');
        setTheme(saved || (prefersDark() ? 'dark' : 'light'));

        themeToggle?.addEventListener('click', () => {
            const next = html.classList.contains('dark') ? 'light' : 'dark';
            setTheme(next);
            safeStorageSet('theme', next);
            refreshIcons();
        });
    }

    function refreshIcons() {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    function initLibraries() {
        refreshIcons();
        if (window.AOS && typeof window.AOS.init === 'function') {
            window.AOS.init({
                duration: 850,
                once: true,
                offset: 80,
                easing: 'ease-out-cubic'
            });
        }
    }

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('show');
        window.clearTimeout(showToast.timer);
        showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 1600);
    }

    function copyText(text) {
        if (!text) return;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => showToast('Copied')).catch(() => showToast('Copy unavailable'));
            return;
        }

        const input = document.createElement('textarea');
        input.value = text;
        input.setAttribute('readonly', '');
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.select();
        try {
            document.execCommand('copy');
            showToast('Copied');
        } catch (_error) {
            showToast('Copy unavailable');
        } finally {
            input.remove();
        }
    }

    function initMenu() {
        menuToggle?.addEventListener('click', () => {
            const isOpen = mobileMenu && !mobileMenu.classList.contains('hidden');
            mobileMenu?.classList.toggle('hidden', isOpen);
            menuToggle.setAttribute('aria-expanded', String(!isOpen));
        });

        document.querySelectorAll('.mobile-link').forEach((link) => {
            link.addEventListener('click', () => {
                mobileMenu?.classList.add('hidden');
                menuToggle?.setAttribute('aria-expanded', 'false');
            });
        });
    }

    function initAccordions() {
        document.querySelectorAll('.toggle-btn').forEach((button) => {
            button.addEventListener('click', () => {
                const contentId = button.getAttribute('aria-controls');
                const content = contentId ? document.getElementById(contentId) : null;
                const list = content?.querySelector('ul');
                const label = button.querySelector('span');
                if (!content || !list || !label) return;

                const expanded = button.getAttribute('aria-expanded') === 'true';
                button.setAttribute('aria-expanded', String(!expanded));

                if (expanded) {
                    list.classList.add('opacity-0');
                    content.classList.remove('grid-rows-[1fr]');
                    content.classList.add('grid-rows-[0fr]');
                    label.textContent = 'Read More';
                } else {
                    content.classList.remove('grid-rows-[0fr]');
                    content.classList.add('grid-rows-[1fr]');
                    window.setTimeout(() => list.classList.remove('opacity-0'), 40);
                    label.textContent = 'Show Less';
                }

                window.setTimeout(requestScrollUpdate, 520);
            });
        });
    }

    function updateTimeline() {
        if (!trackContainer || !staticLine || !progressBar || dots.length < 2) return;

        const trackRect = trackContainer.getBoundingClientRect();
        const firstDotRect = dots[0].getBoundingClientRect();
        const lastDotRect = dots[dots.length - 1].getBoundingClientRect();
        const startTop = firstDotRect.top - trackRect.top + firstDotRect.height / 2;
        const endTop = lastDotRect.top - trackRect.top + lastDotRect.height / 2;
        const totalDistance = Math.max(0, endTop - startTop);

        staticLine.style.top = `${startTop}px`;
        staticLine.style.height = `${totalDistance}px`;
        progressBar.style.top = `${startTop}px`;

        const triggerPoint = window.innerHeight * 0.52;
        const distanceFromTrigger = triggerPoint - firstDotRect.top - firstDotRect.height / 2;
        const fillHeight = Math.min(Math.max(0, distanceFromTrigger), totalDistance);
        progressBar.style.height = `${fillHeight}px`;
    }

    function updateScrollUI() {
        const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const progress = Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100));
        if (scrollProgress) {
            scrollProgress.style.width = `${progress}%`;
        }
        backToTop?.classList.toggle('hidden', window.scrollY < 650);
    }

    function updateActiveNav() {
        if (!sections.length) return;

        const current = sections.reduce((active, section) => {
            const rect = section.getBoundingClientRect();
            return rect.top <= 145 ? section : active;
        }, sections[0]);

        navLinks.forEach((link) => {
            link.classList.toggle('is-active', link.getAttribute('href') === `#${current.id}`);
        });
    }

    let animationFrame = 0;
    function requestScrollUpdate() {
        if (animationFrame) return;
        animationFrame = window.requestAnimationFrame(() => {
            animationFrame = 0;
            updateTimeline();
            updateScrollUI();
            updateActiveNav();
        });
    }

    function initScrollSystems() {
        requestScrollUpdate();
        window.addEventListener('scroll', requestScrollUpdate, { passive: true });
        window.addEventListener('resize', requestScrollUpdate);
        window.addEventListener('load', requestScrollUpdate);
        backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

        if ('ResizeObserver' in window && trackContainer) {
            new ResizeObserver(requestScrollUpdate).observe(trackContainer);
        }
    }

    function initCopyButtons() {
        document.querySelectorAll('[data-copy]').forEach((button) => {
            button.addEventListener('click', () => copyText(button.getAttribute('data-copy')));
        });
        document.getElementById('copy-email')?.addEventListener('click', () => copyText('devadhiva704@gmail.com'));
    }

    function initFooterYear() {
        const year = document.getElementById('year');
        if (year) {
            year.textContent = String(new Date().getFullYear());
        }
    }

    function init() {
        initTheme();
        initLibraries();
        initMenu();
        initAccordions();
        initScrollSystems();
        initCopyButtons();
        initFooterYear();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
