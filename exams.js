// Entrance Exams Form JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    const form = document.getElementById('examsForm');
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
            course: document.getElementById('course').value,
            passingYear: document.getElementById('passingYear').value,
            stream: document.getElementById('stream').value
        };
        
        console.log('Form Data:', formData);
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Finding Exams...';
        
        // Fetch and filter exams
        fetchAndDisplayExams(formData);
    }
    
    // Fetch exams from JSON and display results
    function fetchAndDisplayExams(formData) {
        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                // Filter exams based on form data
                const matchedExams = filterExams(data.exams, formData);
                
                // Reset button state
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                submitBtn.innerHTML = `
                    <svg class="search-icon-submit" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="11" cy="11" r="8" stroke-width="2"/>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35"/>
                    </svg>
                    Find Entrance Exams
                `;
                
                // Display results
                displayExamResults(matchedExams);
            })
            .catch(error => {
                console.error('Error fetching exams:', error);
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
                alert('Error fetching exams. Please try again.');
            });
    }
    
    // Filter exams based on user eligibility
    function filterExams(exams, formData) {
        return exams.filter(exam => {
            const eligibility = exam.eligibility;
            
            // Check age
            if (formData.age < eligibility.minAge || formData.age > eligibility.maxAge) {
                return false;
            }
            
            // Check course
            if (!eligibility.courses.includes(formData.course)) {
                return false;
            }
            
            // Check stream
            if (!eligibility.streams.includes(formData.stream)) {
                return false;
            }
            
            // Check passing year
            if (!eligibility.passingYears.includes(formData.passingYear)) {
                return false;
            }
            
            return true;
        });
    }
    
    // Display exam results
    function displayExamResults(exams) {
        const resultsSection = document.getElementById('results');
        const examsContainer = document.getElementById('examsContainer');
        const resultsCount = document.getElementById('resultsCount');
        
        // Clear previous results
        examsContainer.innerHTML = '';
        
        if (exams.length === 0) {
            resultsSection.style.display = 'block';
            resultsCount.textContent = 'No exams found matching your criteria.';
            examsContainer.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: #6b7280;">
                    <p style="font-size: 4rem; margin-bottom: 1rem;">😔</p>
                    <p>Try adjusting your criteria and search again.</p>
                </div>
            `;
            return;
        }
        
        resultsSection.style.display = 'block';
        resultsCount.textContent = `Found ${exams.length} exam${exams.length !== 1 ? 's' : ''} for you`;
        
        // Display each exam
        exams.forEach((exam, index) => {
            const examCard = document.createElement('div');
            examCard.className = 'exam-card';
            examCard.style.cssText = `
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
            
            examCard.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                    <div>
                        <h3 style="font-size: 1.25rem; font-weight: 700; color: #1f2937; margin-bottom: 0.5rem;">
                            ${exam.name}
                        </h3>
                        <p style="color: #6b7280; font-weight: 500;">
                            ${exam.type} • ${exam.provider}
                        </p>
                    </div>
                </div>
                
                <p style="color: #374151; margin-bottom: 1rem; line-height: 1.6;">
                    ${exam.description}
                </p>
                
                <div style="background: #f0fdf4; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem;">
                    <p style="color: #15803d; font-size: 0.875rem; margin-bottom: 0.5rem;">
                        <strong>Exam Date:</strong> ${exam.examDate}
                    </p>
                    <p style="color: #15803d; font-size: 0.875rem;">
                        <strong>Application Deadline:</strong> ${exam.applicationDeadline}
                    </p>
                </div>
                
                <a href="${exam.registrationLink}" target="_blank" style="
                    display: inline-block;
                    background: #f97316;
                    color: white;
                    padding: 0.75rem 1.5rem;
                    border-radius: 0.5rem;
                    text-decoration: none;
                    font-weight: 600;
                    transition: background 0.2s;
                "
                onmouseover="this.style.background='#ea580c'"
                onmouseout="this.style.background='#f97316'"
                >
                    Register Now →
                </a>
            `;
            
            examsContainer.appendChild(examCard);
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
        localStorage.setItem('examsFormDraft', JSON.stringify(data));
    }
    
    setInterval(autoSave, 30000);
    
    // Load saved data
    function loadSavedData() {
        const savedData = localStorage.getItem('examsFormDraft');
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
        localStorage.removeItem('examsFormDraft');
    });
    
    console.log('Entrance Exams form initialized');
});