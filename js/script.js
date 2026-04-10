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

// Templates for different modal content
const templates = {
  cert: (url) => `<h2>Certificate</h2><img src="${url}" style="width:100%">`,
  product: (name, desc) => `<h2>${name}</h2><p>${desc}</p>`,
  reviews: () => `
    <div id="review-module" class="col-12 pt-2 px-3 text-center review-module-container">
      <div class="mb-3 reviews-content">
        <h4>Customer Reviews</h4>
        <div class="reviews-list d-flex flex-column align-items-center gap-2">
          ${renderReviews()}
        </div>
      </div>
      <span class="text-decoration-underline text-success modal-link" onclick="switchContent('reviewForm')">Drop a Review ❯</span>
    </div>`,
  reviewForm: () => `
    <div class="col-12 pt-2 px-3 text-center review-form-container" id="review-form-container">
        <h4>Leave a Review</h4>
        <form id="review-form" class="d-flex flex-column align-items-center gap-2 review-form" onsubmit="handleReviewSubmit(event)">
            <input type="text" id="rev-user" placeholder="Your Name e.g. Usman A." required>
            <div class="star-rating-input">
                <input type="radio" name="rating" id="star5" value="5"><label for="star5">★</label>
                <input type="radio" name="rating" id="star4" value="4"><label for="star4">★</label>
                <input type="radio" name="rating" id="star3" value="3"><label for="star3">★</label>
                <input type="radio" name="rating" id="star2" value="2"><label for="star2">★</label>
                <input type="radio" name="rating" id="star1" value="1"><label for="star1">★</label>
            </div>
            <input type="text" id="rev-address" placeholder="Your Address e.g. Lagos, Nig." class="mb-2" required>

            <textarea id="rev-text" placeholder="Drop review..." rows="4" class="mb-2" required></textarea>
            <button type="submit" class="btn mb-2 fw-bold w-100">Submit Review</button>
        </form>
        <span class="text-decoration-underline text-success modal-link" onclick="switchContent('reviews')">View Reviews ❯</span>
    </div>`
};
// Modal handling
const modalBody = document.getElementById('modal-body');
const overlay = document.getElementById('modal-overlay');
 //-------------------------------------------------
// Main function to open modal
window.openModal = (type, ...args) => {
  modalBody.innerHTML = templates[type](...args);
  overlay.classList.remove('d-none'); console.log('hi');
} //------------------------------------------------
// Close modal fuction
window.closeModal = () => { overlay.classList.add('d-none'); };

//--------- Handle review process -------------
// Switching effect for the Review/Form toggle
window.switchContent = (templateName) => {
  modalBody.classList.add('switching');
  setTimeout(() => {
    modalBody.innerHTML = templates[templateName]();
    modalBody.classList.remove('switching');
  }, 200);
} 
// Render reviews from storage
function renderReviews() {
  const reviews = JSON.parse(localStorage.getItem('reviews')) || [];

  return reviews.map(review => {
    // Generate star ratings for each review
    const stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
    return `
      <div class="w-100 d-flex justify-content-start align-items-center gap-2">
        <strong>${review.user}</strong> <span class="text-warning fs-5">${stars}</span>
      </div>

      <div class="mx-3 review-text">"${review.text}"</div>

      <div class="w-100 fw-bold text-end">${review.address}</div>`
    }).join('')
}
// Logic to handle selecting stars in the form
selectorAll('.star-rating-input .star').forEach(star => {
    star.addEventListener('click', () => {
        const value = this.getAttribute('data-value');
        selectId('selected-rating').value = value;
        
        // Update visual state
        selectorAll('.star-rating-input .star').forEach(s => {
            s.classList.toggle('active', s.getAttribute('data-value') <= value);
        });
    });
});
// Submit review handling 
window.handleReviewSubmit = (event) => {
    event.preventDefault();
    const submitBtn = event.target.querySelector('button[type="submit"]');

    // Disable the button instantly to prevent double-clicks
    submitBtn.disabled = true;
    submitBtn.innerText = "Submit...";

    // Find the radio button that the user actually clicked
    const selectedRadio = selector('input[name="rating"]:checked');
    // If nothing is selected, default to 2 stars
    const ratingValue = selectedRadio ? parseInt(selectedRadio.value) : 2;

    const user = selectId('rev-user').value;
    const address = selectId('rev-address').value;
    const text = selectId('rev-text').value;

    const allReviews = JSON.parse(localStorage.getItem('reviews')) || [];

    allReviews.push({ user: user, text: text, address: address, rating: ratingValue });
    localStorage.setItem('reviews', JSON.stringify(allReviews));

    // Re-enable the button after 2.5 seconds to simulate processing time
    setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerText = "Submit Review";
    }, 2500);
    // Reset form and switch back to reviews view
    event.target.reset();
    switchContent('reviews');
};