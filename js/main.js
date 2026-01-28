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

// Batch Order System
function getCurrentBatch() {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const hour = now.getHours();
    const minute = now.getMinutes();
    const currentTime = hour * 60 + minute; // Time in minutes
    const endOfDay = 23 * 60 + 59; // 23:59 in minutes
    
    // Batch 1: Friday (5) → Sunday (0) 23:59
    if (day === 5 || day === 6 || (day === 0 && currentTime <= endOfDay)) {
        return {
            batch: 1,
            orderWindow: 'Friday → Sunday 23:59',
            pickupDay: 'Wednesday',
            deliveryDay: 'Thursday',
            pickupDate: getNextWednesday(now),
            deliveryDate: getNextThursday(now)
        };
    }
    
    // Batch 2: Monday (1) → Tuesday (2) 23:59
    if (day === 1 || (day === 2 && currentTime <= endOfDay)) {
        return {
            batch: 2,
            orderWindow: 'Monday → Tuesday 23:59',
            pickupDay: 'Friday',
            deliveryDay: 'Saturday',
            pickupDate: getNextFriday(now),
            deliveryDate: getNextSaturday(now)
        };
    }
    
    // Batch 3: Wednesday (3) → Thursday (4) 23:59
    if (day === 3 || (day === 4 && currentTime <= endOfDay)) {
        return {
            batch: 3,
            orderWindow: 'Wednesday → Thursday 23:59',
            pickupDay: 'Sunday',
            deliveryDay: 'Monday',
            pickupDate: getNextSunday(now),
            deliveryDate: getNextMonday(now)
        };
    }
    
    // Default to Batch 1 if outside all windows
    return {
        batch: 1,
        orderWindow: 'Friday → Sunday 23:59',
        pickupDay: 'Wednesday evening',
        deliveryDay: 'Thursday',
        pickupDate: getNextWednesday(now),
        deliveryDate: getNextThursday(now)
    };
}

function getNextWednesday(date) {
    const result = new Date(date);
    const daysUntilWednesday = (3 - date.getDay() + 7) % 7 || 7;
    result.setDate(date.getDate() + daysUntilWednesday);
    return result;
}

function getNextThursday(date) {
    const result = new Date(date);
    const daysUntilThursday = (4 - date.getDay() + 7) % 7 || 7;
    result.setDate(date.getDate() + daysUntilThursday);
    return result;
}

function getNextFriday(date) {
    const result = new Date(date);
    const daysUntilFriday = (5 - date.getDay() + 7) % 7 || 7;
    result.setDate(date.getDate() + daysUntilFriday);
    return result;
}

function getNextSaturday(date) {
    const result = new Date(date);
    const daysUntilSaturday = (6 - date.getDay() + 7) % 7 || 7;
    result.setDate(date.getDate() + daysUntilSaturday);
    return result;
}

function getNextSunday(date) {
    const result = new Date(date);
    const daysUntilSunday = (0 - date.getDay() + 7) % 7 || 7;
    result.setDate(date.getDate() + daysUntilSunday);
    return result;
}

function getNextMonday(date) {
    const result = new Date(date);
    const daysUntilMonday = (1 - date.getDay() + 7) % 7 || 7;
    result.setDate(date.getDate() + daysUntilMonday);
    return result;
}

function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function getAmharicDayName(dayName) {
    const dayMap = {
        'Sunday': 'እሁድ',
        'Monday': 'ሰኞ',
        'Tuesday': 'ማክሰኞ',
        'Wednesday': 'ረቡዕ',
        'Thursday': 'ሐሙስ',
        'Friday': 'አርብ',
        'Saturday': 'ቅዳሜ'
    };
    return dayMap[dayName] || dayName;
}

function getAmharicBatchMessage(batchInfo) {
    const pickupDay = batchInfo.pickupDate.toLocaleDateString('en-US', { weekday: 'long' });
    const deliveryDay = batchInfo.deliveryDate.toLocaleDateString('en-US', { weekday: 'long' });
    const pickupAmharic = getAmharicDayName(pickupDay);
    const deliveryAmharic = getAmharicDayName(deliveryDay);
    
    return `የዛሬ ትዕዛዝ pickup ከሆነ ለ ${pickupAmharic} delivery ከሆነ ለ ${deliveryAmharic} ይደርሳል።`;
}

function getAmharicDeliveryMessage(batchInfo) {
    const pickupDay = batchInfo.pickupDate.toLocaleDateString('en-US', { weekday: 'long' });
    const deliveryDay = batchInfo.deliveryDate.toLocaleDateString('en-US', { weekday: 'long' });
    const pickupAmharic = getAmharicDayName(pickupDay);
    const deliveryAmharic = getAmharicDayName(deliveryDay);
    
    return `የዛሬ ትዕዛዝ pickup ከሆነ ለ ${pickupAmharic} delivery ከሆነ ለ ${deliveryAmharic} ይደርሳል።`;
}

function updateBatchInfo() {
    const batchInfo = getCurrentBatch();
    const currentBatchInfo = document.getElementById('currentBatchInfo');
    const dateOptions = document.getElementById('dateOptions');
    const deliveryTimeInput = document.getElementById('deliveryTime');
    
    if (currentBatchInfo) {
        const isActive = isBatchActive(batchInfo.batch);
        const bgClass = isActive ? 'bg-green-900' : 'bg-gray-900';
        const borderClass = isActive ? 'border-green-400' : 'border-yellow-400';
        const textClass = isActive ? 'text-green-400' : 'text-yellow-400';
        const statusBadge = isActive 
            ? '<span class="bg-green-600 text-white text-xs px-2 py-1 rounded">ACTIVE</span>' 
            : '<span class="bg-gray-600 text-white text-xs px-2 py-1 rounded">CLOSED</span>';
        
        const amharicMessage = getAmharicBatchMessage(batchInfo);
        currentBatchInfo.innerHTML = `
            <div class="${bgClass} bg-opacity-50 rounded-lg p-4 border ${borderClass} border-opacity-50">
                <div class="flex items-center gap-2 mb-2">
                    <span class="${textClass} font-bold text-lg">Batch ${batchInfo.batch} (የትዕዛዝ ወቅት ${batchInfo.batch})</span>
                    ${statusBadge}
                </div>
                <p class="text-white mb-1"><span class="font-semibold">Order Window:</span> ${batchInfo.orderWindow}</p>
                <p class="text-yellow-400 mb-1"><span class="font-semibold">Pickup:</span> ${batchInfo.pickupDay} (${formatDate(batchInfo.pickupDate)})</p>
                <p class="text-yellow-400 mb-2"><span class="font-semibold">Delivery:</span> ${batchInfo.deliveryDay} (${formatDate(batchInfo.deliveryDate)})</p>
                ${isActive ? `<p class="text-white text-sm mt-2 italic" style="font-family: 'Playfair Display', serif;">${amharicMessage}</p>` : ''}
            </div>
        `;
    }
    
    if (dateOptions && deliveryTimeInput) {
        const submitButton = document.querySelector('#orderForm button[type="submit"]');
        const isActive = isBatchActive(batchInfo.batch);
        
        if (isActive) {
            const amharicMessage = getAmharicBatchMessage(batchInfo);
            dateOptions.innerHTML = `
                <p class="text-white mb-2">Available for this batch:</p>
                <p class="text-yellow-400 mb-1">✓ Pickup: ${batchInfo.pickupDay} (${formatDate(batchInfo.pickupDate)})</p>
                <p class="text-yellow-400 mb-3">✓ Delivery: ${batchInfo.deliveryDay} (${formatDate(batchInfo.deliveryDate)})</p>
                <div class="bg-yellow-900 bg-opacity-40 border-2 border-yellow-500 rounded-lg p-3 mt-3">
                    <p class="text-yellow-300 font-bold text-base" style="font-family: 'Playfair Display', serif;">${amharicMessage}</p>
                </div>
            `;
            deliveryTimeInput.value = amharicMessage;
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.classList.remove('opacity-50', 'cursor-not-allowed');
                if (submitButton.textContent === 'Batch Closed - Call for Urgent Orders') {
                    submitButton.textContent = 'Submit Order';
                }
            }
        } else {
            dateOptions.innerHTML = `
                <p class="text-red-400 mb-2">⚠️ This batch is currently closed.</p>
                <p class="text-gray-400 text-sm">Please wait for the next order window or call us for urgent orders.</p>
            `;
            deliveryTimeInput.value = 'Batch closed - Please call for availability';
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.classList.add('opacity-50', 'cursor-not-allowed');
                submitButton.textContent = 'Batch Closed - Call for Urgent Orders';
            }
        }
    }
}

function isBatchActive(batchNumber) {
    const now = new Date();
    const day = now.getDay();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const currentTime = hour * 60 + minute;
    const endOfDay = 23 * 60 + 59;
    
    switch(batchNumber) {
        case 1:
            return day === 5 || day === 6 || (day === 0 && currentTime <= endOfDay);
        case 2:
            return day === 1 || (day === 2 && currentTime <= endOfDay);
        case 3:
            return day === 3 || (day === 4 && currentTime <= endOfDay);
        default:
            return false;
    }
}

// Form submission handler - Using EmailJS + WhatsApp
document.addEventListener('DOMContentLoaded', function() {
    // Initialize batch information
    updateBatchInfo();
    
    // Update batch info every minute to check if batch changes
    setInterval(updateBatchInfo, 60000);
    
    // Handle pickup/delivery toggle
    const orderTypePickup = document.getElementById('orderTypePickup');
    const orderTypeDelivery = document.getElementById('orderTypeDelivery');
    const pickupAddressSection = document.getElementById('pickupAddressSection');
    const deliveryAddressSection = document.getElementById('deliveryAddressSection');
    
    function toggleAddressSection() {
        if (orderTypePickup && orderTypePickup.checked) {
            // Show pickup section
            if (pickupAddressSection) pickupAddressSection.style.display = 'block';
            if (deliveryAddressSection) deliveryAddressSection.style.display = 'none';
            // Set pickup address
            const pickupInput = document.getElementById('pickupAddress');
            if (pickupInput) {
                pickupInput.value = 'Kitasenju Station';
                pickupInput.required = false;
            }
        } else if (orderTypeDelivery && orderTypeDelivery.checked) {
            // Show delivery section
            if (pickupAddressSection) pickupAddressSection.style.display = 'none';
            if (deliveryAddressSection) deliveryAddressSection.style.display = 'block';
            // Make delivery address required
            const deliveryTextarea = document.getElementById('deliveryAddressTextarea');
            if (deliveryTextarea) {
                deliveryTextarea.required = true;
                deliveryTextarea.value = '';
            }
        }
    }
    
    if (orderTypePickup && orderTypeDelivery) {
        orderTypePickup.addEventListener('change', toggleAddressSection);
        orderTypeDelivery.addEventListener('change', toggleAddressSection);
        // Initialize on page load
        toggleAddressSection();
    }
    
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
            
            // Get current batch information
            const batchInfo = getCurrentBatch();
            
            // Check if batch is active
            if (!isBatchActive(batchInfo.batch)) {
                alert('This batch is currently closed. Please wait for the next order window or call us for urgent orders.');
                isSubmitting = false;
                if (submitButton) {
                    submitButton.textContent = originalButtonText;
                    submitButton.disabled = false;
                }
                return;
            }
            
            // Get order type (pickup or delivery)
            const orderType = document.querySelector('input[name="orderType"]:checked')?.value || 'pickup';
            
            // Get address based on order type
            let deliveryAddress = '';
            if (orderType === 'pickup') {
                const pickupInput = document.getElementById('pickupAddress');
                deliveryAddress = pickupInput ? pickupInput.value.trim() : 'Kitasenju Station';
            } else {
                const deliveryTextarea = document.getElementById('deliveryAddressTextarea');
                deliveryAddress = deliveryTextarea ? deliveryTextarea.value.trim() : '';
                if (!deliveryAddress) {
                    alert('Please enter your delivery address.');
                    isSubmitting = false;
                    if (submitButton) {
                        submitButton.textContent = originalButtonText;
                        submitButton.disabled = false;
                    }
                    return;
                }
            }
            
            // Get form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                phone: document.getElementById('phone').value.trim(),
                orderType: orderType,
                deliveryAddress: deliveryAddress,
                orderDetails: document.getElementById('orderDetails').value.trim(),
                deliveryTime: document.getElementById('deliveryTime').value.trim() || 'Not specified',
                batch: batchInfo.batch,
                batchPickupDate: formatDate(batchInfo.pickupDate),
                batchDeliveryDate: formatDate(batchInfo.deliveryDate)
            };
            
            console.log('Form data:', formData);
            
            // Determine order type labels
            const orderTypeLabel = formData.orderType === 'pickup' ? 'Pickup Location' : 'Delivery Address';
            const orderTypeDisplay = formData.orderType === 'pickup' ? 'Pickup' : 'Delivery';
            const orderTypeIcon = formData.orderType === 'pickup' ? '🏪' : '📍';
            
            // Format WhatsApp message
            const whatsappMessage = `🍽️ *New Order from Fikir Catering Website*

👤 *Name:* ${formData.name}
📞 *Phone:* ${formData.phone}
${orderTypeIcon} *${orderTypeLabel}:* ${formData.deliveryAddress}
📋 *Order Details:*
${formData.orderDetails}

⏰ *Delivery/Pickup Time:* ${formData.deliveryTime}

---
This order was submitted from the website.`;
            
            // Format email message
            const emailMessage = `New Order from Fikir Catering Website

Name: ${formData.name}
Phone: ${formData.phone}
Order Type: ${orderTypeDisplay}
${orderTypeLabel}: ${formData.deliveryAddress}
Order Details: ${formData.orderDetails}
Delivery/Pickup Time: ${formData.deliveryTime}

Batch Information:
Batch: ${formData.batch}
Pickup Available: ${formData.batchPickupDate}
Delivery Available: ${formData.batchDeliveryDate}

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
                    orderType: formData.orderType,
                    deliveryAddress: formData.deliveryAddress,
                    orderDetails: formData.orderDetails,
                    deliveryTime: formData.deliveryTime,
                    batch: formData.batch,
                    batchPickupDate: formData.batchPickupDate,
                    batchDeliveryDate: formData.batchDeliveryDate
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

