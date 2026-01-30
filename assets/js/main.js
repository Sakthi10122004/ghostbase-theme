// Mobile Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileNavPanel = document.getElementById('mobileNavPanel');
    const body = document.body;
    
    function toggleMenu() {
        const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
        
        // Toggle classes
        mobileNavPanel.classList.toggle('is-open');
        body.classList.toggle('menu-open');
        
        // Update aria-expanded attribute
        mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
        
        // Prevent body scroll when menu is open
        if (!isExpanded) {
            document.documentElement.style.overflow = 'hidden';
            body.style.overflow = 'hidden';
        } else {
            document.documentElement.style.overflow = '';
            body.style.overflow = '';
        }
    }
    
    function closeMenu() {
        mobileNavPanel.classList.remove('is-open');
        body.classList.remove('menu-open');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        document.documentElement.style.overflow = '';
        body.style.overflow = '';
    }
    
    // Event Listeners
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMenu);
    }
    
    // Close menu when clicking on navigation links
    if (mobileNavPanel) {
        const navLinks = mobileNavPanel.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }
    
    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && body.classList.contains('menu-open')) {
            closeMenu();
        }
    });
    
    // Close menu on window resize to desktop
    function handleResize() {
        if (window.innerWidth > 1023 && body.classList.contains('menu-open')) {
            closeMenu();
        }
    }
    
    window.addEventListener('resize', handleResize);
});

// ================================
// GHOST MEMBERS FORM ENHANCEMENT
// ================================
document.addEventListener('DOMContentLoaded', function() {
    const membersForms = document.querySelectorAll('[data-members-form]');
    
    membersForms.forEach(function(form) {
        const submitButton = form.querySelector('button[type="submit"]');
        const successEl = form.querySelector('[data-members-success]');
        const errorEl = form.querySelector('[data-members-error]');
        
        // Handle form submission - add loading state
        form.addEventListener('submit', function() {
            form.classList.remove('success', 'error');
            form.classList.add('loading');
            
            if (submitButton) {
                submitButton.disabled = true;
            }
        });
        
        // Use MutationObserver to detect Ghost's state changes
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'attributes' || mutation.type === 'childList') {
                    // Check for success state
                    if (successEl && (successEl.style.display !== 'none' || successEl.textContent.trim())) {
                        form.classList.remove('loading', 'error');
                        form.classList.add('success');
                    }
                    
                    // Check for error state
                    if (errorEl && errorEl.textContent.trim()) {
                        form.classList.remove('loading', 'success');
                        form.classList.add('error');
                        if (submitButton) {
                            submitButton.disabled = false;
                        }
                    }
                }
            });
        });
        
        // Observe changes in success/error elements
        if (successEl) {
            observer.observe(successEl, { 
                attributes: true, 
                childList: true, 
                characterData: true,
                subtree: true 
            });
        }
        
        if (errorEl) {
            observer.observe(errorEl, { 
                attributes: true, 
                childList: true, 
                characterData: true,
                subtree: true 
            });
        }
        
        // Fallback: Remove loading state after timeout if no response
        form.addEventListener('submit', function() {
            setTimeout(function() {
                if (form.classList.contains('loading') && 
                    !form.classList.contains('success') && 
                    !form.classList.contains('error')) {
                    // Still loading after 10s - likely an error
                    form.classList.remove('loading');
                    form.classList.add('error');
                    if (errorEl) {
                        errorEl.textContent = 'Request timed out. Please try again.';
                    }
                    if (submitButton) {
                        submitButton.disabled = false;
                    }
                }
            }, 10000);
        });
    });
});