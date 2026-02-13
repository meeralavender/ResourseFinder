// Scholarship Form JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    const form = document.getElementById('scholarshipForm');
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
                
                // Show error message
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
        // Remove existing error message if any
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
    
    // Real-time validation on input change
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
        // Collect form data
        const formData = {
            age: parseInt(document.getElementById('age').value),
            gender: document.getElementById('gender').value,
            state: document.getElementById('state').value,
            category: document.getElementById('category').value,
            disability: document.getElementById('disability').value,
            singleChild: document.getElementById('singleChild').value,
            minority: document.getElementById('minority').value,
            qualification: document.getElementById('qualification').value,
            income: parseInt(document.getElementById('income').value.split('-')[0]),
            economicStatus: document.getElementById('economicStatus').value
        };
        
        console.log('Form Data:', formData);
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Finding Scholarships...';
        
        // Fetch and filter scholarships
        fetchAndDisplayScholarships(formData);
    }
    
    // Fetch scholarships from JSON and display results
    function fetchAndDisplayScholarships(formData) {
        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                // Filter scholarships based on form data
                const matchedScholarships = filterScholarships(data.scholarships, formData);
                
                // Reset button state
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                submitBtn.innerHTML = `
                    <svg class="search-icon-submit" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" stroke-width="2"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35"/>
                    </svg>
                    Find Scholarships
                `;
                
                // Display results
                displayScholarshipResults(matchedScholarships);
            })
            .catch(error => {
                console.error('Error fetching scholarships:', error);
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                alert('Error fetching scholarships. Please try again.');
            });
    }
    
    // Filter scholarships based on user eligibility
    function filterScholarships(scholarships, formData) {
        return scholarships.filter(scholarship => {
            const eligibility = scholarship.eligibility;
            
            // Check age
            if (formData.age < eligibility.minAge || formData.age > eligibility.maxAge) {
                return false;
            }
            
            // Check category
            if (!eligibility.categories.includes(formData.category) && !eligibility.categories.includes('general')) {
                return false;
            }
            
            // Check income
            if (formData.income < eligibility.minIncome || formData.income > eligibility.maxIncome) {
                return false;
            }
            
            // Check qualification
            if (!eligibility.qualifications.includes(formData.qualification)) {
                return false;
            }
            
            // Check state
            if (!eligibility.states.includes('all') && !eligibility.states.includes(formData.state)) {
                return false;
            }
            
            // Check economic status
            if (!eligibility.economicStatus.includes(formData.economicStatus)) {
                return false;
            }
            
            // Check disability
            if (eligibility.disability !== 'any' && eligibility.disability !== formData.disability) {
                return false;
            }
            
            // Check single child
            if (eligibility.singleChild !== 'any' && eligibility.singleChild !== formData.singleChild) {
                return false;
            }
            
            // Check minority
            if (eligibility.minority !== 'any' && eligibility.minority !== formData.minority) {
                return false;
            }
            
            return true;
        });
    }
    
    // Display scholarship results
    function displayScholarshipResults(scholarships) {
        const resultsSection = document.getElementById('results');
        const scholarshipsContainer = document.getElementById('scholarshipsContainer');
        const resultsCount = document.getElementById('resultsCount');
        
        // Clear previous results
        scholarshipsContainer.innerHTML = '';
        
        if (scholarships.length === 0) {
            resultsSection.style.display = 'block';
            resultsCount.textContent = 'No scholarships found matching your criteria.';
            scholarshipsContainer.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #6b7280;">
                    <p style="font-size: 4rem; margin-bottom: 1rem;">😔</p>
                    <p>Try adjusting your criteria and search again.</p>
                </div>
            `;
            return;
        }
        
        resultsSection.style.display = 'block';
        resultsCount.textContent = `Found ${scholarships.length} scholarship${scholarships.length !== 1 ? 's' : ''} for you`;
        
        // Display each scholarship
        scholarships.forEach((scholarship, index) => {
            const scholarshipCard = document.createElement('div');
            scholarshipCard.className = 'scholarship-card';
            scholarshipCard.style.cssText = `
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
            
            scholarshipCard.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div>
                        <h3 style="font-size: 1.25rem; font-weight: 700; color: #1f2937; margin-bottom: 0.5rem;">
                            ${scholarship.name}
                        </h3>
                        <p style="color: #6b7280; font-weight: 500;">
                            ${scholarship.provider}
                        </p>
                    </div>
                    <span style="background: #dbeafe; color: #0369a1; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem;">
                        ${scholarship.amount}
                    </span>
                </div>
                
                <p style="color: #374151; margin-bottom: 1rem; line-height: 1.6;">
                    ${scholarship.description}
                </p>
                
                <div style="background: #f9fafb; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                    <p style="color: #6b7280; font-size: 0.875rem; margin-bottom: 0.5rem;">
                        <strong>Deadline:</strong> ${scholarship.deadline}
                    </p>
                    <p style="color: #6b7280; font-size: 0.875rem;">
                        <strong>Eligibility States:</strong> ${scholarship.eligibility.states.includes('all') ? 'All States' : scholarship.eligibility.states.join(', ')}
                    </p>
                </div>
                
                <a href="${scholarship.applicationLink}" target="_blank" style="
                    display: inline-block;
                    background: #3b82f6;
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.5rem;
                    text-decoration: none;
                    font-weight: 600;
                    transition: background 0.2s;
                "
                onmouseover="this.style.background='#2563eb'"
                onmouseout="this.style.background='#3b82f6'"
                >
                    Apply Now →
                </a>
            `;
            
            scholarshipsContainer.appendChild(scholarshipCard);
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
    
    // Age validation
    const ageInput = document.getElementById('age');
    ageInput.addEventListener('input', function() {
        if (this.value < 5 || this.value > 100) {
            this.style.borderColor = '#ef4444';
        } else {
            this.style.borderColor = '#10b981';
        }
    });
    
    // Track form progress
    let filledFields = 0;
    const totalFields = form.querySelectorAll('[required]').length;
    
    inputs.forEach(input => {
        input.addEventListener('change', function() {
            updateProgress();
        });
    });
    
    function updateProgress() {
        filledFields = 0;
        form.querySelectorAll('[required]').forEach(field => {
            if (field.value.trim()) {
                filledFields++;
            }
        });
        
        const progress = (filledFields / totalFields) * 100;
        console.log(`Form Progress: ${progress.toFixed(0)}%`);
        
        // You can show a progress bar if needed
        if (progress === 100) {
            console.log('Form completed! Ready to submit.');
        }
    }
    
    // Auto-save to localStorage (optional)
    function autoSave() {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        localStorage.setItem('scholarshipFormDraft', JSON.stringify(data));
        console.log('Form auto-saved');
    }
    
    // Auto-save every 30 seconds
    setInterval(autoSave, 30000);
    
    // Load saved data on page load
    function loadSavedData() {
        const savedData = localStorage.getItem('scholarshipFormDraft');
        if (savedData) {
            const data = JSON.parse(savedData);
            Object.keys(data).forEach(key => {
                const field = form.querySelector(`[name="${key}"]`);
                if (field && data[key]) {
                    field.value = data[key];
                }
            });
            console.log('Loaded saved form data');
        }
    }
    
    loadSavedData();
    
    // Clear saved draft on successful submission
    form.addEventListener('submit', function() {
        localStorage.removeItem('scholarshipFormDraft');
    });
    
    console.log('Scholarship form initialized');
});