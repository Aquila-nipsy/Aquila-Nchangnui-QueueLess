// Queue Management System - Staff Dashboard
const QUEUE_STORAGE_KEY = 'queueless_queue';

// Get queue from localStorage
function getQueue() {
    const queue = localStorage.getItem(QUEUE_STORAGE_KEY);
    return queue ? JSON.parse(queue) : [];
}

// Save queue to localStorage
function saveQueue(queue) {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
}

// Format queue number with leading zeros
function formatQueueNumber(num) {
    return '#' + num.toString().padStart(3, '0');
}

// Update queue display
function updateQueueDisplay() {
    const queue = getQueue();
    
    // Update statistics
    const waitingCount = queue.filter(c => c.status === 'waiting').length;
    const servingCustomer = queue.find(c => c.status === 'serving');
    const nextCustomer = queue.find(c => c.status === 'waiting');
    
    const peopleWaitingSpan = document.querySelector('.status .card:nth-child(1) span');
    const currentCustomerSpan = document.querySelector('.status .card:nth-child(2) span');
    const nextInLineSpan = document.querySelector('.status .card:nth-child(3) span');
    
    if (peopleWaitingSpan) peopleWaitingSpan.textContent = waitingCount;
    if (currentCustomerSpan) {
        currentCustomerSpan.textContent = servingCustomer ? formatQueueNumber(servingCustomer.id) : '---';
    }
    if (nextInLineSpan) {
        nextInLineSpan.textContent = nextCustomer ? formatQueueNumber(nextCustomer.id) : '---';
    }
    
    // Update queue list
    const numberLists = document.querySelectorAll('.list .number ul');
    if (numberLists.length >= 3) {
        // Clear existing lists
        numberLists[0].innerHTML = '';
        numberLists[1].innerHTML = '';
        numberLists[2].innerHTML = '';
        
        // Populate lists
        queue.forEach(customer => {
            const li1 = document.createElement('li');
            li1.textContent = formatQueueNumber(customer.id);
            numberLists[0].appendChild(li1);
            
            const li2 = document.createElement('li');
            li2.textContent = customer.name;
            numberLists[1].appendChild(li2);
            
            const li3 = document.createElement('li');
            li3.textContent = customer.status.charAt(0).toUpperCase() + customer.status.slice(1);
            numberLists[2].appendChild(li3);
        });
    }
}

// Call next customer
function callNextCustomer() {
    const queue = getQueue();
    
    // Find current serving customer and mark as served
    const servingIndex = queue.findIndex(c => c.status === 'serving');
    if (servingIndex !== -1) {
        queue[servingIndex].status = 'served';
    }
    
    // Find next waiting customer and mark as serving
    const waitingIndex = queue.findIndex(c => c.status === 'waiting');
    if (waitingIndex !== -1) {
        queue[waitingIndex].status = 'serving';
    }
    
    saveQueue(queue);
    updateQueueDisplay();
}

// Complete current service
function completeService() {
    const queue = getQueue();
    
    // Find current serving customer and mark as served
    const servingIndex = queue.findIndex(c => c.status === 'serving');
    if (servingIndex !== -1) {
        queue[servingIndex].status = 'served';
        saveQueue(queue);
        updateQueueDisplay();
    } else {
        alert('No customer is currently being served.');
    }
}

// Initialize staff dashboard
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
    updateQueueDisplay();
    
    const nextCustomerBtn = document.getElementById('nextCustomerBtn');
    const completeServiceBtn = document.getElementById('completeServiceBtn');
    
    if (nextCustomerBtn) {
        nextCustomerBtn.addEventListener('click', callNextCustomer);
    }
    
    if (completeServiceBtn) {
        completeServiceBtn.addEventListener('click', completeService);
    }
    
    // Auto-refresh every 5 seconds
    setInterval(updateQueueDisplay, 5000);
});
