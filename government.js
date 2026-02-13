// Government Schemes Form JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    const form = document.getElementById('governmentForm');
    const submitBtn = document.querySelector('.btn-submit');
    
    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });
    
    // Validate form
    function validateForm() {
        const requiredFields = form.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = '#ef4444';
                showFieldError(field);
            } else {
                field.style.borderColor = '#10b981';
                removeFieldError(field);
            }
        });
        
        return isValid;
    }
    
    // Show field error
    function showFieldError(field) {
        removeFieldError(field);
        
        const errorMsg = document.createElement('span');
        errorMsg.className = 'error-message';
        errorMsg.style.color = '#ef4444';
        errorMsg.style.fontSize = '0.875rem';
        errorMsg.style.marginTop = '0.25rem';
        errorMsg.textContent = 'This field is required';
        
        field.parentElement.appendChild(errorMsg);
    }
    
    // Remove field error
    function removeFieldError(field) {
        const existingError = field.parentElement.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }
    
    // Real-time validation
    const inputs = form.querySelectorAll('.form-input, .form-select');
    inputs.forEach(input => {
        input.addEventListener('change', function() {
            if (this.value.trim()) {
                this.style.borderColor = '#10b981';
                removeFieldError(this);
            } else {
                this.style.borderColor = '#ef4444';
            }
        });
        
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                showFieldError(this);
            }
        });
    });
    
    // Submit form
    function submitForm() {
        const formData = {
            age: parseInt(document.getElementById('age').value),
            gender: document.getElementById('gender').value,
            jobStatus: document.getElementById('job').value,
            state: document.getElementById('state').value,
            income: parseInt(document.getElementById('income').value.split('-')[0]) || 0
        };
        
        console.log('Form Data:', formData);
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Finding Schemes...';
        
        // Fetch and filter government schemes
        fetchAndDisplaySchemes(formData);
    }
    
    // Fetch government schemes from JSON and display results
    function fetchAndDisplaySchemes(formData) {
        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                // Filter government schemes based on form data
                const matchedSchemes = filterSchemes(data.government, formData);
                
                // Reset button state
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                submitBtn.innerHTML = `
                    <svg class="search-icon-submit" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" stroke-width="2"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35"/>
                    </svg>
                    Find Government Schemes
                `;
                
                // Display results
                displaySchemeResults(matchedSchemes);
            })
            .catch(error => {
                console.error('Error fetching government schemes:', error);
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                alert('Error fetching government schemes. Please try again.');
            });
    }
    
    // Filter government schemes based on user eligibility
    function filterSchemes(schemes, formData) {
        return schemes.filter(scheme => {
            const eligibility = scheme.eligibility;
            
            // Check age
            if (formData.age < eligibility.minAge || formData.age > eligibility.maxAge) {
                return false;
            }
            
            // Check gender
            if (!eligibility.genders.includes(formData.gender) && !eligibility.genders.includes('all')) {
                return false;
            }
            
            // Check job status
            if (!eligibility.jobStatus.includes(formData.jobStatus) && !eligibility.jobStatus.includes('all')) {
                return false;
            }
            
            // Check income
            if (formData.income < eligibility.minIncome || formData.income > eligibility.maxIncome) {
                return false;
            }
            
            // Check state
            if (!eligibility.states.includes('all') && !eligibility.states.includes(formData.state)) {
                return false;
            }
            
            return true;
        });
    }
    
    // Display government scheme results
    function displaySchemeResults(schemes) {
        const resultsSection = document.getElementById('results');
        const governmentContainer = document.getElementById('governmentContainer');
        const resultsCount = document.getElementById('resultsCount');
        
        // Clear previous results
        governmentContainer.innerHTML = '';
        
        if (schemes.length === 0) {
            resultsSection.style.display = 'block';
            resultsCount.textContent = 'No government schemes found matching your criteria.';
            governmentContainer.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #6b7280;">
                    <p style="font-size: 4rem; margin-bottom: 1rem;">😔</p>
                    <p>Try adjusting your criteria and search again.</p>
                </div>
            `;
            return;
        }
        
        resultsSection.style.display = 'block';
        resultsCount.textContent = `Found ${schemes.length} scheme${schemes.length !== 1 ? 's' : ''} for you`;
        
        // Display each scheme
        schemes.forEach((scheme, index) => {
            const schemeCard = document.createElement('div');
            schemeCard.className = 'scheme-card';
            schemeCard.style.cssText = `
                background: white;
                border: 1px solid #e5e7eb;
                border-radius: 0.75rem;
                padding: 1.5rem;
                margin-bottom: 1rem;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                transition: all 0.3s ease;
                animation: slideInUp 0.4s ease;
                animation-delay: ${index * 0.1}s;
            `;
            
            schemeCard.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div>
                        <h3 style="font-size: 1.25rem; font-weight: 700; color: #1f2937; margin-bottom: 0.5rem;">
                            ${scheme.name}
                        </h3>
                        <p style="color: #6b7280; font-weight: 500;">
                            ${scheme.category} • ${scheme.provider}
                        </p>
                    </div>
                    <span style="background: #dcfce7; color: #166534; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem;">
                        ${scheme.benefitAmount}
                    </span>
                </div>
                
                <p style="color: #374151; margin-bottom: 1rem; line-height: 1.6;">
                    ${scheme.description}
                </p>
                
                <div style="background: #f0fdf4; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                    <p style="color: #15803d; font-size: 0.875rem; margin-bottom: 0.5rem;">
                        <strong>Category:</strong> ${scheme.category}
                    </p>
                    <p style="color: #15803d; font-size: 0.875rem;">
                        <strong>Application Status:</strong> ${scheme.applicationDeadline}
                    </p>
                </div>
                
                <a href="${scheme.applyLink}" target="_blank" style="
                    display: inline-block;
                    background: #10b981;
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.5rem;
                    text-decoration: none;
                    font-weight: 600;
                    transition: background 0.2s;
                "
                onmouseover="this.style.background='#059669'"
                onmouseout="this.style.background='#10b981'"
                >
                    Learn More →
                </a>
            `;
            
            governmentContainer.appendChild(schemeCard);
        });
        
        // Add animations
        if (!document.querySelector('style[data-animations]')) {
            const style = document.createElement('style');
            style.setAttribute('data-animations', 'true');
            style.textContent = `
                @keyframes slideInUp {
                    from { 
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to { 
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        // Scroll to results
        setTimeout(() => {
            document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
    
    // Auto-save
    function autoSave() {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        localStorage.setItem('governmentFormDraft', JSON.stringify(data));
    }
    
    setInterval(autoSave, 30000);
    
    // Load saved data
    function loadSavedData() {
        const savedData = localStorage.getItem('governmentFormDraft');
        if (savedData) {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(key => {
                const field = form.querySelector(`[name="${key}"]`);
                if (field && data[key]) {
                    field.value = data[key];
                }
            });
        }
    }
    
    loadSavedData();
    
    form.addEventListener('submit', function() {
        localStorage.removeItem('governmentFormDraft');
    });
    
    console.log('Government Schemes form initialized');
});