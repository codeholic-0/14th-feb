// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Form submission handling
    const form = document.querySelector('form');
    form.addEventListener('submit', handleSubmit);

    // Navigation menu toggle with accessibility
    const menuBtn = document.querySelector('.menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    menuBtn?.addEventListener('click', () => {
        const isExpanded = navMenu.classList.contains('active');
        navMenu.classList.toggle('active');
        menuBtn.setAttribute('aria-expanded', !isExpanded);
        menuBtn.setAttribute('aria-label', isExpanded ? 'Open menu' : 'Close menu');
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuBtn.contains(e.target)) {
            navMenu.classList.remove('active');
            menuBtn?.setAttribute('aria-expanded', 'false');
        }
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            if (window.innerWidth > 768) {
                navMenu.classList.remove('active');
                menuBtn?.setAttribute('aria-expanded', 'false');
            }
        }, 250);
    });
});

// Handle form submission with better validation and feedback
function handleSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const submitButton = e.target.querySelector('button[type="submit"]');
    
    // Enhanced form validation
    const errors = [];
    if (!data.name?.trim()) errors.push('Name is required');
    if (!data.email?.trim()) errors.push('Email is required');
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.push('Please enter a valid email address');
    }
    
    if (errors.length > 0) {
        alert(errors.join('\n'));
        return;
    }
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.innerHTML = 'Submitting...';
    
    // Send form data
    fetch('/api/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(async response => {
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return response.json();
    })
    .then(data => {
        alert('Form submitted successfully!');
        e.target.reset();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    })
    .finally(() => {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Submit';
    });
}

// Smooth scroll for anchor links with improved behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const headerOffset = 60;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            // Update URL without jumping
            history.pushState(null, '', targetId);
        }
    });
});

// Add animation on scroll with performance optimization
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            observer.unobserve(entry.target); // Stop observing after animation
        }
    });
}, { 
    threshold: 0.1,
    rootMargin: '50px'
});

// Lazy load animations
function initializeAnimations() {
    document.querySelectorAll('.animate-on-scroll').forEach((element) => {
        observer.observe(element);
    });
}

// Initialize animations with debounce
let animationTimer;
window.addEventListener('load', () => {
    clearTimeout(animationTimer);
    animationTimer = setTimeout(initializeAnimations, 100);
});
