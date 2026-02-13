// Jobs & Recruitment Form JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    const form = document.getElementById('jobsForm');
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
            qualification: document.getElementById('qualification').value,
            experience: document.getElementById('experience').value,
            location: document.getElementById('location').value,
            workType: document.getElementById('workType').value
        };
        
        console.log('Form Data:', formData);
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Finding Jobs...';
        
        // Fetch and filter jobs
        fetchAndDisplayJobs(formData);
    }
    
    // Fetch jobs from JSON and display results
    function fetchAndDisplayJobs(formData) {
        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                // Filter jobs based on form data
                const matchedJobs = filterJobs(data.jobs, formData);
                
                // Reset button state
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                submitBtn.innerHTML = `
                    <svg class="search-icon-submit" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" stroke-width="2"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35"/>
                    </svg>
                    Find Jobs
                `;
                
                // Display results
                displayJobResults(matchedJobs);
            })
            .catch(error => {
                console.error('Error fetching jobs:', error);
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                alert('Error fetching jobs. Please try again.');
            });
    }
    
    // Filter jobs based on user eligibility
    function filterJobs(jobs, formData) {
        return jobs.filter(job => {
            const eligibility = job.eligibility;
            
            // Check age
            if (formData.age < eligibility.minAge || formData.age > eligibility.maxAge) {
                return false;
            }
            
            // Check qualification
            if (!eligibility.qualifications.includes(formData.qualification)) {
                return false;
            }
            
            // Check experience
            const expMap = { 'fresher': 0, '0-1': 0.5, '1-2': 1.5, '2-3': 2.5, '3-5': 4, '5-7': 6, '7-10': 8.5, '10+': 10 };
            const userExp = expMap[formData.experience] || 0;
            if (userExp < eligibility.minExperience || userExp > eligibility.maxExperience) {
                return false;
            }
            
            // Check job type
            if (formData.workType && job.jobType !== formData.workType) {
                return false;
            }
            
            return true;
        });
    }
    
    // Display job results
    function displayJobResults(jobs) {
        const resultsSection = document.getElementById('results');
        const jobsContainer = document.getElementById('jobsContainer');
        const resultsCount = document.getElementById('resultsCount');
        
        // Clear previous results
        jobsContainer.innerHTML = '';
        
        if (jobs.length === 0) {
            resultsSection.style.display = 'block';
            resultsCount.textContent = 'No jobs found matching your criteria.';
            jobsContainer.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #6b7280;">
                    <p style="font-size: 4rem; margin-bottom: 1rem;">😔</p>
                    <p>Try adjusting your criteria and search again.</p>
                </div>
            `;
            return;
        }
        
        resultsSection.style.display = 'block';
        resultsCount.textContent = `Found ${jobs.length} job${jobs.length !== 1 ? 's' : ''} for you`;
        
        // Display each job
        jobs.forEach((job, index) => {
            const jobCard = document.createElement('div');
            jobCard.className = 'job-card';
            jobCard.style.cssText = `
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
            
            jobCard.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div>
                        <h3 style="font-size: 1.25rem; font-weight: 700; color: #1f2937; margin-bottom: 0.5rem;">
                            ${job.name}
                        </h3>
                        <p style="color: #6b7280; font-weight: 500;">
                            ${job.company} • ${job.location}
                        </p>
                    </div>
                    <span style="background: #f3e8ff; color: #6b21a8; padding: 0.5rem 1rem; border-radius: 0.5rem; font-weight: 600; font-size: 0.875rem;">
                        ${job.jobType}
                    </span>
                </div>
                
                <p style="color: #374151; margin-bottom: 1rem; line-height: 1.6;">
                    ${job.description}
                </p>
                
                <div style="background: #f8f4ff; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                    <p style="color: #581c87; font-size: 0.875rem; margin-bottom: 0.5rem;">
                        <strong>Salary:</strong> ${job.salary}
                    </p>
                    <p style="color: #581c87; font-size: 0.875rem;">
                        <strong>Application Deadline:</strong> ${job.applicationDeadline}
                    </p>
                </div>
                
                <a href="${job.applyLink}" target="_blank" style="
                    display: inline-block;
                    background: #a855f7;
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.5rem;
                    text-decoration: none;
                    font-weight: 600;
                    transition: background 0.2s;
                "
                onmouseover="this.style.background='#9333ea'"
                onmouseout="this.style.background='#a855f7'"
                >
                    Apply Now →
                </a>
            `;
            
            jobsContainer.appendChild(jobCard);
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
        localStorage.setItem('jobsFormDraft', JSON.stringify(data));
    }
    
    setInterval(autoSave, 30000);
    
    // Load saved data
    function loadSavedData() {
        const savedData = localStorage.getItem('jobsFormDraft');
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
        localStorage.removeItem('jobsFormDraft');
    });
    
    console.log('Jobs & Recruitment form initialized');
});