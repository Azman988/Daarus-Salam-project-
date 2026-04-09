import {selectId, selectorAll, selector} from './utils/dom.js';

// Side nav toggle
window.onclick = (e) => {
    if (e.target.classList.contains('navbar-toggler') || e.target.classList.contains('fa-list-ul')) {
        selectId('sideNav').classList.add('show');
    } else if (e.target.classList.contains('nav-link') || e.target.classList.contains('close-btn') || e.target.classList.contains('fa-times') || !e.target.closest('#sideNav')) {
        selectId('sideNav').classList.remove('show');
    }
}

// Header heights claculation
const updateHeaderHeight = () => {
    // Full header height
    const header = selectId('header');
    if (header) {
        const height = header.offsetHeight;
        document.documentElement.style.setProperty('--header-height', height + 'px');
    }
    // Top nav height
    const topNav = selectId('top-nav');
    if (topNav) {
        const height = topNav.offsetHeight;
        document.documentElement.style.setProperty('--topNav-height', height + 'px');
    }
};
// Run on window resize (important for responsive headers)
window.addEventListener('load', updateHeaderHeight);
window.addEventListener('resize', updateHeaderHeight);

// Active link highlighting using Intersection Observer
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-link");

const observerOptions = {
  root: null,
  threshold: 0.6, // Trigger when 60% of the section is visible
};
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      // Remove 'active' from all links
      navLinks.forEach((link) => link.classList.remove("active"));
      
      // Find the link that matches the current section ID and add 'active'
      const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (activeLink) activeLink.classList.add("active");
    }
  });
}, observerOptions);
sections.forEach((section) => observer.observe(section));
