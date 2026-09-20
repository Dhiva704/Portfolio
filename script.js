(() => {
    'use strict';

    const html = document.documentElement;
    const themeToggle = document.getElementById('theme-toggle');
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const scrollProgress = document.getElementById('scroll-progress');
    const backToTop = document.getElementById('back-to-top');
    const toast = document.getElementById('toast');
    const yearEl = document.getElementById('year');
    const header = document.querySelector('.site-header');

    const counters = [...document.querySelectorAll('[data-counter]')];
    const expandButtons = [...document.querySelectorAll('.expand-button')];
    const copyButtons = [...document.querySelectorAll('.copy-button')];
    const navLinks = [...document.querySelectorAll('.desktop-nav .nav-link')];
    const sections = [...document.querySelectorAll('main section[id], footer[id]')];

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

    function applyTheme(mode) {
        const isDark = mode === 'dark';
        html.setAttribute('data-theme', mode);
        themeToggle?.setAttribute('aria-pressed', String(isDark));
        themeToggle?.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    }

    function initTheme() {
        const saved = safeStorageGet('theme');
        applyTheme(saved || (prefersDark() ? 'dark' : 'light'));

        themeToggle?.addEventListener('click', () => {
            const current = html.getAttribute('data-theme');
            const next = current === 'dark' ? 'light' : 'dark';
            applyTheme(next);
            safeStorageSet('theme', next);
        });
    }

    function showToast(message) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.add('is-visible');
        window.clearTimeout(showToast.timer);
        showToast.timer = window.setTimeout(() => toast.classList.remove('is-visible'), 1600);
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
            const isOpen = !mobileMenu.hidden;
            mobileMenu.hidden = isOpen;
            menuToggle.setAttribute('aria-expanded', String(!isOpen));
        });

        document.querySelectorAll('.mobile-link').forEach((link) => {
            link.addEventListener('click', () => {
                mobileMenu.hidden = true;
                menuToggle?.setAttribute('aria-expanded', 'false');
            });
        });
    }

    function initAccordions() {
        expandButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const contentId = button.getAttribute('aria-controls');
                const content = contentId ? document.getElementById(contentId) : null;
                if (!content) return;

                const expanded = button.getAttribute('aria-expanded') === 'true';
                button.setAttribute('aria-expanded', String(!expanded));
                content.classList.toggle('is-open', !expanded);
                const label = button.querySelector('span');
                if (label) {
                    label.textContent = expanded ? 'Read more' : 'Show less';
                }
            });
        });
    }

    function updateScrollUI() {
        const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const progress = Math.min(100, Math.max(0, (window.scrollY / scrollable) * 100));
        if (scrollProgress) {
            scrollProgress.style.width = `${progress}%`;
        }

        backToTop?.classList.toggle('is-visible', window.scrollY > 650);

        header?.classList.toggle('is-scrolled', window.scrollY > 20);
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
    }

    function initCopyButtons() {
        copyButtons.forEach((button) => {
            button.addEventListener('click', () => copyText(button.getAttribute('data-copy')));
        });
    }

    function initFooterYear() {
        if (yearEl) {
            yearEl.textContent = String(new Date().getFullYear());
        }
    }

    function animateCounter(el) {
        const target = parseFloat(el.dataset.counterTarget || '0');
        const decimals = parseInt(el.dataset.counterDecimals || '0', 10);
        const suffix = el.dataset.counterSuffix || '';
        const duration = 1600;
        const start = performance.now();
        const counterEl = el.querySelector('.counter');

        function frame(now) {
            const elapsed = now - start;
            const t = Math.min(1, elapsed / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            const value = target * eased;
            if (counterEl) {
                counterEl.textContent = value.toFixed(decimals);
            }
            if (t < 1) {
                window.requestAnimationFrame(frame);
            } else {
                if (counterEl) {
                    counterEl.textContent = target.toFixed(decimals);
                }
            }
        }

        window.requestAnimationFrame(frame);
    }

    function initCounters() {
        if (!counters.length) return;
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach((counter) => observer.observe(counter));
    }

    function debounce(fn, wait) {
        let timer = null;
        return function (...args) {
            window.clearTimeout(timer);
            timer = window.setTimeout(() => fn.apply(this, args), wait);
        };
    }

    function initNetworkCanvas() {
        const canvas = document.getElementById('network-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isDark = html.getAttribute('data-theme') === 'dark';

        function resize() {
            const rect = canvas.getBoundingClientRect();
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            canvas.width = Math.floor(rect.width * dpr);
            canvas.height = Math.floor(rect.height * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        const center = { x: 0, y: 0 };
        const nodes = [
            { x: -140, y: -60, label: 'AWS', r: 22 },
            { x: 150, y: -50, label: 'EKS', r: 20 },
            { x: 0, y: 120, label: 'PROM', r: 18 },
            { x: -160, y: 70, label: 'EC2', r: 18 },
            { x: 150, y: 80, label: 'ARGO', r: 18 },
        ];
        const particles = [];
        const palette = {
            light: { cyan: '#0891b2', electric: '#2563eb', indigo: '#4f46e5', grid: 'rgba(15, 23, 42, 0.06)' },
            dark: { cyan: '#22d3ee', electric: '#60a5fa', indigo: '#818cf8', grid: 'rgba(34, 211, 238, 0.08)' },
        };
        const colors = palette[isDark ? 'dark' : 'light'];

        let particlesSpawn = 0;

        function drawFrame(time) {
            const width = canvas.getBoundingClientRect().width;
            const height = canvas.getBoundingClientRect().height;
            center.x = width / 2;
            center.y = height / 2;

            ctx.clearRect(0, 0, width, height);

            // Draw connection lines
            nodes.forEach((node, i) => {
                ctx.beginPath();
                ctx.moveTo(center.x, center.y);
                ctx.lineTo(center.x + node.x, center.y + node.y);
                ctx.strokeStyle = colors.grid;
                ctx.lineWidth = 1;
                ctx.stroke();

                nodes.slice(i + 1).forEach((other) => {
                    ctx.beginPath();
                    ctx.moveTo(center.x + node.x, center.y + node.y);
                    ctx.lineTo(center.x + other.x, center.y + other.y);
                    ctx.strokeStyle = colors.grid;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                });
            });

            // Draw nodes
            nodes.forEach((node) => {
                const x = center.x + node.x;
                const y = center.y + node.y;
                ctx.beginPath();
                ctx.arc(x, y, node.r, 0, Math.PI * 2);
                ctx.fillStyle = colors.cyan;
                ctx.globalAlpha = 0.12;
                ctx.fill();
                ctx.globalAlpha = 1;
                ctx.strokeStyle = colors.cyan;
                ctx.lineWidth = 1.5;
                ctx.stroke();
                ctx.fillStyle = colors.cyan;
                ctx.font = '600 8px "JetBrains Mono", monospace';
                ctx.textAlign = 'center';
                ctx.fillText(node.label, x, y + 2);
            });

            // Central hub
            ctx.beginPath();
            ctx.arc(center.x, center.y, 28, 0, Math.PI * 2);
            ctx.fillStyle = colors.electric;
            ctx.globalAlpha = 0.16;
            ctx.fill();
            ctx.globalAlpha = 1;
            ctx.strokeStyle = colors.electric;
            ctx.lineWidth = 2;
            ctx.stroke();

            // Spawn particles
            if (!reduceMotion) {
                particlesSpawn++;
                if (particlesSpawn % 24 === 0 && particles.length < 24) {
                    const target = nodes[Math.floor(Math.random() * nodes.length)];
                    particles.push({
                        x: center.x,
                        y: center.y,
                        tx: center.x + target.x,
                        ty: center.y + target.y,
                        progress: 0,
                        speed: 0.015 + Math.random() * 0.012,
                    });
                }
            }

            // Animate particles
            for (let i = particles.length - 1; i >= 0; i--) {
                const p = particles[i];
                p.progress += p.speed;
                if (p.progress >= 1) {
                    particles.splice(i, 1);
                    continue;
                }
                const x = p.x + (p.tx - p.x) * p.progress;
                const y = p.y + (p.ty - p.y) * p.progress;

                ctx.beginPath();
                ctx.arc(x, y, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = colors.electric;
                ctx.globalAlpha = 0.9;
                ctx.fill();
                ctx.globalAlpha = 0.25 * (1 - p.progress);
                ctx.beginPath();
                ctx.arc(x, y, 7, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }

            if (!reduceMotion) {
                requestAnimationFrame(drawFrame);
            }
        }

        resize();
        window.addEventListener('resize', debounce(resize, 200));
        requestAnimationFrame(drawFrame);
    }

    function initLibraries() {
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
        if (window.AOS && typeof window.AOS.init === 'function') {
            window.AOS.init({
                duration: 800,
                once: true,
                offset: 70,
                easing: 'ease-out-cubic',
            });
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
        initCounters();
        initNetworkCanvas();

        html.addEventListener('click', (e) => {
            if (!e.target.closest('#navbar')) {
                mobileMenu.hidden = true;
                menuToggle?.setAttribute('aria-expanded', 'false');
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();
