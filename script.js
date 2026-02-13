// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Get all category cards
    const categoryCards = document.querySelectorAll('.category-card');
    
    // Get buttons
    const signupBtn = document.querySelector('.btn-signup');
    const loginBtn = document.querySelector('.btn-login');
    const showAllBtn = document.querySelector('.btn-show-all');
    
    // Add click event listeners to category cards
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            handleCategoryClick(category);
        });
    });
    
    // Handle category card clicks
    function handleCategoryClick(category) {
        console.log(`Category clicked: ${category}`);
        
        // Add animation effect
        const clickedCard = document.querySelector(`[data-category="${category}"]`);
        clickedCard.style.transform = 'scale(0.98)';
        
        setTimeout(() => {
            clickedCard.style.transform = '';
            
            // Navigate to appropriate page based on category
            if (category === 'scholarships') {
                window.location.href = 'scholarship.html';
            } else if (category === 'government') {
                window.location.href = 'government.html';
            } else if (category === 'exams') {
                window.location.href = 'exams.html';
            } else if (category === 'jobs') {
                window.location.href = 'jobs.html';
            } else if (category === 'applications') {
                window.location.href = 'applications.html';
            } else {
                alert(`${category} page coming soon!`);
            }
        }, 200);
    }
    
    // Handle Sign Up button click
    signupBtn.addEventListener('click', function() {
        console.log('Sign Up clicked');
        alert('Sign Up functionality would be implemented here');
        // window.location.href = '/signup.html';
    });
    
    // Handle Login button click
    loginBtn.addEventListener('click', function() {
        console.log('Login clicked');
        alert('Login functionality would be implemented here');
        // window.location.href = '/login.html';
    });
    
    // Handle Show All button click
    showAllBtn.addEventListener('click', function() {
        console.log('Show All Opportunities clicked');
        alert('Showing all opportunities...');
        // window.location.href = '/all-opportunities.html';
    });
    
    // Add hover effect sounds (optional - commented out by default)
    /*
    categoryCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            // Play hover sound
            // const hoverSound = new Audio('hover.mp3');
            // hoverSound.play();
        });
    });
    */
    
    // Add keyboard navigation support
    document.addEventListener('keydown', function(e) {
        // Press 1-5 to select categories
        if (e.key >= '1' && e.key <= '5') {
            const index = parseInt(e.key) - 1;
            const card = categoryCards[index];
            if (card) {
                card.click();
            }
        }
        
        // Press 'A' to show all opportunities
        if (e.key.toLowerCase() === 'a') {
            showAllBtn.click();
        }
    });
    
    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Track analytics (placeholder function)
    function trackEvent(eventName, eventData) {
        console.log('Analytics Event:', eventName, eventData);
        // Implement your analytics tracking here
        // Example: gtag('event', eventName, eventData);
    }
    
    // Track category card clicks
    categoryCards.forEach(card => {
        card.addEventListener('click', function() {
            trackEvent('category_click', {
                category: this.getAttribute('data-category')
            });
        });
    });



    
    // Add loading animation (optional)
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        console.log('Page fully loaded');
    });
    
    // Add intersection observer for scroll animations (optional)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all category cards for scroll animations
    categoryCards.forEach(card => {
        // Initially set cards for animation
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        
        observer.observe(card);
    });
  
    // Fetch and display data from data.json
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            console.log(data); // check in console
            displayData(data);
        })
        .catch(error => console.error('Error fetching data:', error));

    function displayData(data) {
        const container = document.getElementById("results");
        
        // If no container exists, create one (optional)
        if (!container) {
            console.warn('Results container not found');
            return;
        }

        // Handle nested category structure from data.json
        Object.keys(data).forEach(category => {
            const items = data[category];
            if (Array.isArray(items)) {
                items.forEach(item => {
                    const div = document.createElement("div");
                    div.className = "data-item";
                    div.innerHTML = `
                        <h3>${item.name || 'N/A'}</h3>
                        <p><strong>Category:</strong> ${category}</p>
                        <p><strong>State:</strong> ${item.eligibility?.states?.[0] || 'N/A'}</p>
                        <p><strong>Provider:</strong> ${item.provider || 'N/A'}</p>
                    `;
                    container.appendChild(div);
                });
            }
        });
    }
    
    console.log('Opportunity Finder initialized successfully');
});