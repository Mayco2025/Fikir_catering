// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
            // Close mobile menu if open
            const mobileMenu = document.getElementById('mobileMenu');
            if (mobileMenu) {
                mobileMenu.classList.add('hidden');
            }
        }
    });
});

// Mobile menu toggle
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', function() {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu) {
            mobileMenu.classList.toggle('hidden');
        }
    });
}

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe menu items
document.querySelectorAll('.menu-item').forEach(item => {
    observer.observe(item);
});

// Lazy loading fade-in effect for images
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    
    // Set initial opacity for lazy images
    lazyImages.forEach(img => {
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';
    });
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // Wait for image to load, then fade in
                    if (img.complete) {
                        img.style.opacity = '1';
                        img.classList.add('loaded');
                    } else {
                        img.addEventListener('load', function() {
                            img.style.opacity = '1';
                            img.classList.add('loaded');
                        }, { once: true });
                    }
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback: fade in all images immediately
        lazyImages.forEach(img => {
            if (img.complete) {
                img.style.opacity = '1';
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', function() {
                    img.style.opacity = '1';
                    img.classList.add('loaded');
                }, { once: true });
            }
        });
    }
});

// Form submission handler - Using EmailJS + WhatsApp
document.addEventListener('DOMContentLoaded', function() {
    // Initialize EmailJS with your public key
    if (typeof emailjs !== 'undefined') {
        emailjs.init('w4GVYNqjiwTeGNs1z');
    }
    
    const orderForm = document.getElementById('orderForm');
    const thankYouMessage = document.getElementById('thankYouMessage');
    
    // Flag to prevent double submission
    let isSubmitting = false;
    
    if (orderForm && thankYouMessage) {
        orderForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Prevent double submission
            if (isSubmitting) {
                console.log('Form is already being submitted, ignoring duplicate submission');
                return;
            }
            
            console.log('Form submit event triggered');
            isSubmitting = true;
            
            // Show "Submitting..." state
            const submitButton = orderForm.querySelector('button[type="submit"]');
            const originalButtonText = submitButton ? submitButton.textContent : 'Submit Order';
            if (submitButton) {
                submitButton.textContent = 'Submitting...';
                submitButton.disabled = true;
            }
            
            // Validate form before submission
            if (!orderForm.checkValidity()) {
                console.log('Form validation failed');
                orderForm.reportValidity();
                isSubmitting = false; // Reset flag on validation failure
                if (submitButton) {
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                }
                return;
            }
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                orderDetails: document.getElementById('orderDetails').value.trim(),
                deliveryTime: document.getElementById('deliveryTime').value.trim() || 'Not specified'
            };
            
            console.log('Form data:', formData);
            
            // Format WhatsApp message
            const whatsappMessage = `🍽️ *New Order from Fikir Catering Website*

👤 *Name:* ${formData.name}
📞 *Phone:* ${formData.phone}
📋 *Order Details:*
${formData.orderDetails}

⏰ *Delivery/Pickup Time:* ${formData.deliveryTime}

---
This order was submitted from the website.`;
            
            // Format email message
            const emailMessage = `New Order from Fikir Catering Website

Name: ${formData.name}
Phone: ${formData.phone}
Order Details: ${formData.orderDetails}
Delivery/Pickup Time: ${formData.deliveryTime}

---
This order was submitted from the Fikir Catering website.`;
            
            // EmailJS configuration
            const EMAILJS_SERVICE_ID = 'service_k7nn285';
            const EMAILJS_TEMPLATE_ID = 'template_f20ebuf';
            
            // Prepare EmailJS template parameters
            // Match your EmailJS template variable names exactly: {{name}}, {{phone}}, {{order}}, {{preferred_time}}
            const emailParams = {
                name: formData.name,
                phone: formData.phone,
                order: formData.orderDetails,
                preferred_time: formData.deliveryTime,
                email: formData.phone // For reply-to field (using phone as contact)
            };
            
            // Backend endpoint URL - Update this with your deployed backend URL
            // For local testing: http://localhost:3000/api/submit-order
            // For production: https://your-backend-url.com/api/submit-order
            const BACKEND_URL = 'http://localhost:3000/api/submit-order'; // Update this with your backend URL
            
            // Send email using EmailJS
            if (typeof emailjs !== 'undefined' && EMAILJS_SERVICE_ID !== 'YOUR_SERVICE_ID') {
                emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, emailParams)
                    .then(function(response) {
                        console.log('Email sent successfully!', response.status, response.text);
                    }, function(error) {
                        console.error('EmailJS error:', error);
                    });
            }
            
            // Send order to backend for WhatsApp notifications
            fetch(BACKEND_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: formData.name,
                    phone: formData.phone,
                    orderDetails: formData.orderDetails,
                    deliveryTime: formData.deliveryTime
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Order submitted and WhatsApp notifications sent:', data);
                } else {
                    console.error('Backend error:', data.error);
                }
                // Always show thank you message regardless of backend response
                handleFormSuccess();
            })
            .catch(error => {
                console.error('Error sending to backend:', error);
                // Still show thank you message even if backend fails
                handleFormSuccess();
            });
            
            function handleFormSuccess() {
                // Show thank you message
                orderForm.classList.add('hidden');
                thankYouMessage.classList.remove('hidden');
                
                // Scroll to thank you message
                setTimeout(() => {
                    thankYouMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
                
                // Reset form
                orderForm.reset();
                
                // Reset button state and submission flag
                isSubmitting = false;
                if (submitButton) {
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                }
            }
        });
    }
});

