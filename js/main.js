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
    
    // Handle delivery/pickup selection
    const deliveryTypeRadios = document.querySelectorAll('input[name="deliveryType"]');
    const deliveryAddressField = document.getElementById('deliveryAddressField');
    const deliveryAddressInput = document.getElementById('deliveryAddress');
    const pickupLocationInfo = document.getElementById('pickupLocationInfo');
    
    // Ensure fields are hidden by default
    if (deliveryAddressField) {
        deliveryAddressField.style.display = 'none';
        deliveryAddressField.classList.add('hidden');
    }
    if (pickupLocationInfo) {
        pickupLocationInfo.style.display = 'none';
        pickupLocationInfo.classList.add('hidden');
    }
    if (deliveryAddressInput) {
        deliveryAddressInput.removeAttribute('required');
    }
    
    if (deliveryTypeRadios.length > 0) {
        deliveryTypeRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.value === 'delivery') {
                    // Show delivery address field, hide pickup info
                    if (deliveryAddressField) {
                        deliveryAddressField.style.display = 'block';
                        deliveryAddressField.classList.remove('hidden');
                    }
                    if (deliveryAddressInput) {
                        deliveryAddressInput.setAttribute('required', 'required');
                    }
                    if (pickupLocationInfo) {
                        pickupLocationInfo.style.display = 'none';
                        pickupLocationInfo.classList.add('hidden');
                    }
                } else if (this.value === 'pickup') {
                    // Hide delivery address field, show pickup info
                    if (deliveryAddressField) {
                        deliveryAddressField.style.display = 'none';
                        deliveryAddressField.classList.add('hidden');
                    }
                    if (deliveryAddressInput) {
                        deliveryAddressInput.removeAttribute('required');
                        deliveryAddressInput.value = ''; // Clear the field
                    }
                    if (pickupLocationInfo) {
                        pickupLocationInfo.style.display = 'block';
                        pickupLocationInfo.classList.remove('hidden');
                    }
                }
            });
        });
    }
    
    // Handle Injera type selection
    const nechEnjeraCheck = document.getElementById('nechEnjeraCheck');
    const keyEnjeraCheck = document.getElementById('keyEnjeraCheck');
    const nechEnjeraOptions = document.getElementById('nechEnjeraOptions');
    const keyEnjeraOptions = document.getElementById('keyEnjeraOptions');
    
    if (nechEnjeraCheck && nechEnjeraOptions) {
        nechEnjeraCheck.addEventListener('change', function() {
            if (this.checked) {
                nechEnjeraOptions.classList.remove('hidden');
                nechEnjeraOptions.style.display = 'block';
            } else {
                nechEnjeraOptions.classList.add('hidden');
                nechEnjeraOptions.style.display = 'none';
                // Clear text input
                const nechQuantityInput = document.getElementById('nechQuantity');
                if (nechQuantityInput) {
                    nechQuantityInput.value = '';
                }
            }
        });
    }
    
    if (keyEnjeraCheck && keyEnjeraOptions) {
        keyEnjeraCheck.addEventListener('change', function() {
            if (this.checked) {
                keyEnjeraOptions.classList.remove('hidden');
                keyEnjeraOptions.style.display = 'block';
            } else {
                keyEnjeraOptions.classList.add('hidden');
                keyEnjeraOptions.style.display = 'none';
                // Clear text input
                const keyQuantityInput = document.getElementById('keyQuantity');
                if (keyQuantityInput) {
                    keyQuantityInput.value = '';
                }
            }
        });
    }
    
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
            
            // Validate that at least one injera type is selected
            const nechEnjeraChecked = document.getElementById('nechEnjeraCheck')?.checked || false;
            const keyEnjeraChecked = document.getElementById('keyEnjeraCheck')?.checked || false;
            
            if (!nechEnjeraChecked && !keyEnjeraChecked) {
                alert('Please select at least one injera type (ነጭ እንጀራ or ቀይ እንጀራ)');
                isSubmitting = false;
                if (submitButton) {
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                }
                return;
            }
            
            // Validate quantities are selected for checked injera types
            if (nechEnjeraChecked) {
                const nechQuantityInput = document.getElementById('nechQuantity');
                const nechQuantity = nechQuantityInput?.value.trim();
                if (!nechQuantity) {
                    alert('Please enter a quantity for ነጭ እንጀራ (Nech Enjera)');
                    isSubmitting = false;
                    if (submitButton) {
                        submitButton.textContent = originalButtonText;
                        submitButton.disabled = false;
                    }
                    if (nechQuantityInput) {
                        nechQuantityInput.focus();
                    }
                    return;
                }
            }
            
            if (keyEnjeraChecked) {
                const keyQuantityInput = document.getElementById('keyQuantity');
                const keyQuantity = keyQuantityInput?.value.trim();
                if (!keyQuantity) {
                    alert('Please enter a quantity for ቀይ እንጀራ (Key Enjera)');
                    isSubmitting = false;
                    if (submitButton) {
                        submitButton.textContent = originalButtonText;
                        submitButton.disabled = false;
                    }
                    if (keyQuantityInput) {
                        keyQuantityInput.focus();
                    }
                    return;
                }
            }
            
            // Validate delivery address if delivery is selected
            const deliveryType = document.querySelector('input[name="deliveryType"]:checked')?.value || '';
            const deliveryAddress = document.getElementById('deliveryAddress')?.value.trim() || '';
            
            if (deliveryType === 'delivery' && !deliveryAddress) {
                alert('Please enter your delivery address');
                isSubmitting = false;
                if (submitButton) {
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                }
                // Show the delivery address field
                const deliveryAddressField = document.getElementById('deliveryAddressField');
                if (deliveryAddressField) {
                    deliveryAddressField.style.display = 'block';
                    deliveryAddressField.classList.remove('hidden');
                    document.getElementById('deliveryAddress')?.focus();
                }
                return;
            }
            
            // Get form data
            
            // Build order details from injera selections
            let orderItems = [];
            
            if (nechEnjeraChecked) {
                const nechQuantityInput = document.getElementById('nechQuantity');
                const nechQuantity = nechQuantityInput?.value.trim() || '';
                orderItems.push(`ነጭ እንጀራ (Nech Enjera): ${nechQuantity} pieces`);
            }
            
            if (keyEnjeraChecked) {
                const keyQuantityInput = document.getElementById('keyQuantity');
                const keyQuantity = keyQuantityInput?.value.trim() || '';
                orderItems.push(`ቀይ እንጀራ (Key Enjera): ${keyQuantity} pieces`);
            }
            
            const additionalNotes = document.getElementById('orderDetails')?.value.trim() || '';
            const orderDetailsText = orderItems.join('\n') + (additionalNotes ? '\n\nAdditional Notes:\n' + additionalNotes : '');
            
            const formData = {
                name: document.getElementById('name').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                deliveryType: deliveryType,
                deliveryAddress: deliveryAddress,
                orderDetails: orderDetailsText,
                deliveryTime: document.getElementById('deliveryTime').value.trim() || 'Not specified'
            };
            
            console.log('Form data:', formData);
            
            // Format delivery/pickup info for messages
            let deliveryInfo = '';
            if (formData.deliveryType === 'delivery') {
                deliveryInfo = `🚚 *Delivery Type:* Delivery\n📍 *Delivery Address:* ${formData.deliveryAddress || 'Not provided'}\n`;
            } else if (formData.deliveryType === 'pickup') {
                deliveryInfo = `🚶 *Delivery Type:* Pickup\n📍 *Pickup Location:* Kitasenju Station\n`;
            }
            
            // Format WhatsApp message
            const whatsappMessage = `🍽️ *New Order from Fikir Catering Website*

👤 *Name:* ${formData.name}
📞 *Phone:* ${formData.phone}
${deliveryInfo}📋 *Order Details:*
${formData.orderDetails}

⏰ *Delivery/Pickup Time:* ${formData.deliveryTime}

---
This order was submitted from the website.`;
            
            // Format email message
            const emailMessage = `New Order from Fikir Catering Website

Name: ${formData.name}
Phone: ${formData.phone}
Delivery Type: ${formData.deliveryType === 'delivery' ? 'Delivery' : 'Pickup'}
${formData.deliveryType === 'delivery' ? `Delivery Address: ${formData.deliveryAddress || 'Not provided'}` : 'Pickup Location: Kitasenju Station'}
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
                delivery_type: formData.deliveryType === 'delivery' ? 'Delivery' : 'Pickup',
                delivery_address: formData.deliveryType === 'delivery' ? (formData.deliveryAddress || 'Not provided') : 'Kitasenju Station',
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
                    deliveryType: formData.deliveryType,
                    deliveryAddress: formData.deliveryAddress,
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

