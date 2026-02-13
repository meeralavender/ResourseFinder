// Applications Form JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    const form = document.getElementById('applicationsForm');
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
            applicationType: document.getElementById('applicationType').value,
            age: parseInt(document.getElementById('age').value),
            qualification: document.getElementById('qualification').value,
            field: document.getElementById('field').value,
            state: document.getElementById('state').value,
            category: document.getElementById('category').value,
            gender: document.getElementById('gender').value
        };
        
        console.log('Form Data:', formData);
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Finding Applications...';
        
        // Fetch and filter applications
        fetchAndDisplayApplications(formData);
    }
    
    // Fetch applications from JSON and display results
    function fetchAndDisplayApplications(formData) {
        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                // Filter applications based on form data
                const matchedApplications = filterApplications(data.applications, formData);
                
                // Reset button state
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                submitBtn.innerHTML = `
                    <svg class="search-icon-submit" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" stroke-width="2"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35"/>
                    </svg>
                    Find Applications
                `;
                
                // Display results
                displayApplicationResults(matchedApplications);
            })
            .catch(error => {
                console.error('Error fetching applications:', error);
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                alert('Error fetching applications. Please try again.');
            });
    }
    
    // Filter applications based on user eligibility
    function filterApplications(applications, formData) {
        return applications.filter(app => {
            const eligibility = app.eligibility;
            
            // Check application type
            if (formData.applicationType && app.type !== formData.applicationType) {
                return false;
            }
            
            // Check age
            if (formData.age < eligibility.minAge || formData.age > eligibility.maxAge) {
                return false;
            }
            
            // Check qualification - must match at least one eligibility requirement
            if (eligibility.qualifications && !eligibility.qualifications.includes(formData.qualification)) {
                return false;
            }
            
            // Check field of study
            if (eligibility.fields && !eligibility.fields.includes(formData.field) && !eligibility.fields.includes('all')) {
                return false;
            }
            
            // Check state
            if (eligibility.states && !eligibility.states.includes('all') && !eligibility.states.includes(formData.state)) {
                return false;
            }
            
            // Check category - allow 'any' or matching category
            if (eligibility.categories && !eligibility.categories.includes(formData.category) && !eligibility.categories.includes('any')) {
                return false;
            }
            
            return true;
        });
    }
    
    // Display application results
    function displayApplicationResults(applications) {
        const resultsSection = document.getElementById('results');
        const applicationsContainer = document.getElementById('applicationsContainer');
        const resultsCount = document.getElementById('resultsCount');
        
        // Clear previous results
        applicationsContainer.innerHTML = '';
        
        if (applications.length === 0) {
            resultsSection.style.display = 'block';
            resultsCount.textContent = 'No applications found matching your criteria.';
            applicationsContainer.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #6b7280;">
                    <p style="font-size: 4rem; margin-bottom: 1rem;">😔</p>
                    <p>Try adjusting your criteria and search again.</p>
                </div>
            `;
            return;
        }
        
        resultsSection.style.display = 'block';
        resultsCount.textContent = `Found ${applications.length} application${applications.length !== 1 ? 's' : ''} for you`;
        
        // Display each application
        applications.forEach((app, index) => {
            const appCard = document.createElement('div');
            appCard.className = 'application-card';
            appCard.style.cssText = `
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
            
            const typeLabel = app.type === 'college' ? 'College' : app.type === 'internship' ? 'Internship' : 'Fellowship';
            const typeBgColor = app.type === 'college' ? '#cffafe' : app.type === 'internship' ? '#e0e7ff' : '#fce7f3';
            const typeColor = app.type === 'college' ? '#0e7490' : app.type === 'internship' ? '#3730a3' : '#831843';
            
            appCard.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div>
                        <h3 style="font-size: 1.25rem; font-weight: 700; color: #1f2937; margin-bottom: 0.5rem;">
                            ${app.name}
                        </h3>
                        <p style="color: #6b7280; font-weight: 500;">
                            ${app.institution} • ${app.location === 'any' ? 'Multiple Locations' : app.location}
                        </p>
                    </div>
                    <span style="background: ${typeBgColor}; color: ${typeColor}; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem;">
                        ${typeLabel}
                    </span>
                </div>
                
                <p style="color: #374151; margin-bottom: 1rem; line-height: 1.6;">
                    ${app.description}
                </p>
                
                <div style="background: #f0f9ff; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                    <p style="color: #0369a1; font-size: 0.875rem; margin-bottom: 0.5rem;">
                        <strong>Field of Study:</strong> ${app.field.replace(/-/g, ' ').charAt(0).toUpperCase() + app.field.replace(/-/g, ' ').slice(1)}
                    </p>
                    <p style="color: #0369a1; font-size: 0.875rem;">
                        <strong>Application Deadline:</strong> ${app.applicationDeadline}
                    </p>
                </div>
                
                <a href="${app.applyLink}" target="_blank" style="
                    display: inline-block;
                    background: #06b6d4;
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.5rem;
                    text-decoration: none;
                    font-weight: 600;
                    transition: background 0.2s;
                "
                onmouseover="this.style.background='#0891b2'"
                onmouseout="this.style.background='#06b6d4'"
                >
                    Apply Now →
                </a>
            `;
            
            applicationsContainer.appendChild(appCard);
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
        localStorage.setItem('applicationsFormDraft', JSON.stringify(data));
    }
    
    setInterval(autoSave, 30000);
    
    // Load saved data
    function loadSavedData() {
        const savedData = localStorage.getItem('applicationsFormDraft');
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
        localStorage.removeItem('applicationsFormDraft');
    });
    
    console.log('Applications form initialized');
});