// Queue Management System - Join Page
const QUEUE_STORAGE_KEY = 'queueless_queue';
const CURRENT_USER_KEY = 'queueless_current_user';

// Get queue from localStorage
function getQueue() {
    const queue = localStorage.getItem(QUEUE_STORAGE_KEY);
    return queue ? JSON.parse(queue) : [];
}

// Save queue to localStorage
function saveQueue(queue) {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
}

// Generate next queue number
function getNextQueueNumber() {
    const queue = getQueue();
    if (queue.length === 0) return 1;
    return queue.length + 1;
}

// Format queue number with leading zeros
function formatQueueNumber(num) {
    return '#' + num.toString().padStart(2, '0');
}

// Add customer to queue
function addToQueue(name, service) {
    const queue = getQueue();
    const queueNumber = getNextQueueNumber();
    
    const customer = {
        id: queueNumber,
        name: name,
        service: service,
        status: 'waiting',
        joinTime: new Date().toISOString()
    };
    
    queue.push(customer);
    saveQueue(queue);
    
    // Save current user for user dashboard
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(customer));
    
    return customer;
}

// Handle form submission
document.addEventListener('DOMContentLoaded', function() {
    // Hamburger menu toggle
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking a link
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
    const form = document.querySelector('.form');
    const joinBtn = document.getElementById('joinBtn');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = form.querySelector('input[name="name"]');
            const serviceInput = form.querySelector('select[name="service"]');
            
            const name = nameInput.value.trim();
            const service = serviceInput.value.trim();
            
            if (!name || !service) {
                alert('Please fill in both your name and service type.');
                return;
            }
            
            const customer = addToQueue(name, service);
            
            // Redirect to user dashboard after a short delay
            setTimeout(() => {
                window.location.href = '../pages/user.html';
            }, 1000);
        });
    }
});
