'use strict';

// Theme toggle functionality
const darkModeBtn = document.getElementById('dark-mode');
const lightModeBtn = document.getElementById('light-mode');
const systemThemeBtn = document.getElementById('system-theme');
const body = document.body;

// Function to set the theme
function setTheme(theme) {
  if (theme === 'dark') {
    body.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  } else if (theme === 'light') {
    body.setAttribute('data-theme', 'light');
    localStorage.setItem('theme', 'light');
  } else {
    body.removeAttribute('data-theme');
    localStorage.removeItem('theme');
  }
}

// Event listeners for theme buttons
darkModeBtn.addEventListener('click', () => setTheme('dark'));
lightModeBtn.addEventListener('click', () => setTheme('light'));
systemThemeBtn.addEventListener('click', () => setTheme('system'));

// Check system preference
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
const prefersLightScheme = window.matchMedia('(prefers-color-scheme: light)');

// Apply saved theme or system preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  setTheme(savedTheme);
} else if (prefersDarkScheme.matches) {
  setTheme('dark');
} else if (prefersLightScheme.matches) {
  setTheme('light');
}

// Sidebar toggle functionality
const sidebar = document.querySelector('[data-sidebar]');
const sidebarBtn = document.querySelector('[data-sidebar-btn]');

sidebarBtn.addEventListener('click', () => {
  sidebar.classList.toggle('active');
});

// Testimonials modal functionality
const testimonialsItem = document.querySelectorAll('[data-testimonials-item]');
const modalContainer = document.querySelector('[data-modal-container]');
const modalCloseBtn = document.querySelector('[data-modal-close-btn]');
const overlay = document.querySelector('[data-overlay]');

const modalImg = document.querySelector('[data-modal-img]');
const modalTitle = document.querySelector('[data-modal-title]');
const modalText = document.querySelector('[data-modal-text]');

// Modal toggle function
const testimonialsModalFunc = () => {
  modalContainer.classList.toggle('active');
  overlay.classList.toggle('active');
};

// Add click event to all modal items
testimonialsItem.forEach((item) => {
  item.addEventListener('click', () => {
    modalImg.src = item.querySelector('[data-testimonials-avatar]').src;
    modalImg.alt = item.querySelector('[data-testimonials-avatar]').alt;
    modalTitle.innerHTML = item.querySelector('[data-testimonials-title]').innerHTML;
    modalText.innerHTML = item.querySelector('[data-testimonials-text]').innerHTML;
    testimonialsModalFunc();
  });
});

// Add click event to modal close button
modalCloseBtn.addEventListener('click', testimonialsModalFunc);
overlay.addEventListener('click', testimonialsModalFunc);

// Contact form validation
const form = document.querySelector('[data-form]');
const formInputs = document.querySelectorAll('[data-form-input]');
const formBtn = document.querySelector('[data-form-btn]');

// Add input event to all form input fields
formInputs.forEach((input) => {
  input.addEventListener('input', () => {
    if (form.checkValidity()) {
      formBtn.removeAttribute('disabled');
    } else {
      formBtn.setAttribute('disabled', '');
    }
  });
});

// Page navigation functionality
const navigationLinks = document.querySelectorAll('[data-nav-link]');
const pages = document.querySelectorAll('[data-page]');

// Add click event to all nav links
navigationLinks.forEach((link) => {
  link.addEventListener('click', () => {
    // Remove active class from all pages and links
    pages.forEach((page) => page.classList.remove('active'));
    navigationLinks.forEach((navLink) => navLink.classList.remove('active'));

    // Add active class to the clicked link and corresponding page
    const targetPage = link.innerHTML.toLowerCase();
    pages.forEach((page) => {
      if (page.dataset.page === targetPage) {
        page.classList.add('active');
        link.classList.add('active');
        window.scrollTo(0, 0); // Scroll to the top of the page
      }
    });
  });
});

// Filter functionality (if applicable)
const filterBtn = document.querySelectorAll('[data-filter-btn]');
const filterItems = document.querySelectorAll('[data-filter-item]');

// Filter function
const filterFunc = (selectedValue) => {
  filterItems.forEach((item) => {
    if (selectedValue === 'all' || selectedValue === item.dataset.category) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
};

// Add click event to all filter buttons
let lastClickedBtn = filterBtn[0];

filterBtn.forEach((btn) => {
  btn.addEventListener('click', () => {
    const selectedValue = btn.innerText.toLowerCase();
    filterFunc(selectedValue);

    // Update active state of filter buttons
    lastClickedBtn.classList.remove('active');
    btn.classList.add('active');
    lastClickedBtn = btn;
  });
});
