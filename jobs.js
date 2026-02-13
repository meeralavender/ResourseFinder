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
            age: document.getElementById('age').value,
            qualification: document.getElementById('qualification').value,
            experience: document.getElementById('experience').value,
            skills: document.getElementById('skills').value,
            location: document.getElementById('location').value,
            workType: document.getElementById('workType').value,
            salary: document.getElementById('salary').value
        };
        
        console.log('Form Data:', formData);
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Finding Jobs...';
        
        // Simulate API call
        setTimeout(() => {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
            submitBtn.innerHTML = `
                <svg class="search-icon-submit" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" stroke-width="2"/>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35"/>
                </svg>
                Find Jobs
            `;
            
            showSuccessMessage(formData);
        }, 2000);
    }
    
    // Show success message
    function showSuccessMessage(data) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
            animation: fadeIn 0.3s ease;
        `;
        
        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            padding: 2rem;
            border-radius: 1rem;
            max-width: 500px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: slideUp 0.3s ease;
        `;
        
        modal.innerHTML = `
            <div style="font-size: 4rem; margin-bottom: 1rem;">✅</div>
            <h2 style="font-size: 1.75rem; font-weight: 700; color: #1f2937; margin-bottom: 1rem;">
                Form Submitted Successfully!
            </h2>
            <p style="color: #6b7280; margin-bottom: 1.5rem;">
                We're finding jobs that match your profile...
            </p>
            <div style="background: #f3e8ff; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1.5rem;">
                <p style="color: #6b21a8; font-weight: 600;">
                    Found <span style="color: #a855f7; font-size: 1.5rem;">42</span> jobs for you!
                </p>
            </div>
            <button 
                onclick="this.parentElement.parentElement.remove()" 
                style="
                    background: #a855f7;
                    color: white;
                    padding: 0.75rem 2rem;
                    border: none;
                    border-radius: 0.5rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                "
                onmouseover="this.style.background='#9333ea'"
                onmouseout="this.style.background='#a855f7'"
            >
                View Jobs
            </button>
        `;
        
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideUp {
                from { 
                    opacity: 0;
                    transform: translateY(30px);
                }
                to { 
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(style);
        
        localStorage.setItem('jobsFormData', JSON.stringify(data));
        
        setTimeout(() => {
            overlay.remove();
        }, 3000);
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