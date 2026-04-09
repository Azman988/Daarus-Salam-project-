import { selectId } from "./utils/dom.js";

// Menu Toggle
function dotMenu() {
    const btn = selectId('dotsMenuBtn');
    const menu = selectId('dotsMenu');
    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('show');
    });

    window.onclick = () => menu.classList.remove('show');
}
// Summary section heights calculation
const updateSSHeight = () => {
    // Full SS height
    const SS = selectId('summary-section');
    if (SS) {
        const height = SS.offsetHeight;
        document.documentElement.style.setProperty('--SS-height', height + 'px');
    }
};
// Run on window resize (important for responsive SSs)
window.addEventListener('resize', updateSSHeight);

// Initialize all functions
window.addEventListener('DOMContentLoaded', () => {
    dotMenu();
    updateSSHeight();
});