// Queue Management System - User Dashboard
const QUEUE_STORAGE_KEY = 'queueless_queue';
const CURRENT_USER_KEY = 'queueless_current_user';

// Get queue from localStorage
function getQueue() {
    const queue = localStorage.getItem(QUEUE_STORAGE_KEY);
    return queue ? JSON.parse(queue) : [];
}

// Get current user from localStorage
function getCurrentUser() {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
}

// Format queue number with leading zeros
function formatQueueNumber(num) {
    return '#' + num.toString().padStart(2, '0');
}

// Calculate position in queue
function getPosition(queue, userId) {
    const waitingCustomers = queue.filter(c => c.status === 'waiting' || c.status === 'serving');
    const userIndex = waitingCustomers.findIndex(c => c.id === userId);
    
    if (userIndex === -1) return -1;
    return userIndex + 1;
}

// Calculate people ahead
function getPeopleAhead(queue, userId) {
    const position = getPosition(queue, userId);
    if (position <= 1) return 0;
    return position - 1;
}

// Estimate waiting time (assumes 5 minutes per person)
function estimateWaitTime(peopleAhead) {
    const minutesPerPerson = 5;
    const totalMinutes = peopleAhead * minutesPerPerson;
    
    if (totalMinutes === 0) return 'Your turn!';
    if (totalMinutes < 60) return `~${totalMinutes} minutes`;
    
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return `~${hours}h ${mins}m`;
}

// Update user dashboard
function updateUserDashboard() {
    const queue = getQueue();
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        alert('No active queue found. Please join a queue first.');
        window.location.href = '../pages/join.html';
        return;
    }
    
    // Refresh user data from queue
    const updatedUser = queue.find(c => c.id === currentUser.id);
    if (!updatedUser) {
        alert('Your queue entry was not found. Please join again.');
        localStorage.removeItem(CURRENT_USER_KEY);
        window.location.href = '../pages/join.html';
        return;
    }
    
    // Update queue number
    const queueNumberElement = document.querySelector('.main-status h1');
    if (queueNumberElement) {
        queueNumberElement.textContent = formatQueueNumber(updatedUser.id);
    }
    
    // Update service type
    const serviceElement = document.querySelector('.main-status p:last-of-type');
    if (serviceElement) {
        serviceElement.textContent = updatedUser.service;
    }
    
    // Update status
    const statusElement = document.querySelector('.main-status .waiting');
    if (statusElement) {
        statusElement.textContent = updatedUser.status.charAt(0).toUpperCase() + updatedUser.status.slice(1);
    }
    
    // Calculate and update position
    const position = getPosition(queue, updatedUser.id);
    const positionElement = document.querySelector('.position:first-of-type p span');
    if (positionElement) {
        if (position === -1) {
            positionElement.textContent = 'Completed';
        } else {
            const suffix = position === 1 ? 'st' : position === 2 ? 'nd' : position === 3 ? 'rd' : 'th';
            positionElement.textContent = `${position}${suffix}`;
        }
    }
    
    // Calculate and update people ahead
    const peopleAhead = getPeopleAhead(queue, updatedUser.id);
    const peopleAheadElement = document.querySelector('.position:last-of-type p span');
    if (peopleAheadElement) {
        peopleAheadElement.textContent = peopleAhead;
    }
    
    // Update estimated wait time
    const estimatedTimeElement = document.getElementById('estimatedTime');
    if (estimatedTimeElement) {
        estimatedTimeElement.textContent = estimateWaitTime(peopleAhead);
    }
    
    // Update progress bar
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        const totalInQueue = queue.filter(c => c.status === 'waiting' || c.status === 'serving').length;
        const progress = totalInQueue > 0 ? ((totalInQueue - position + 1) / totalInQueue) * 100 : 100;
        progressBar.style.width = `${progress}%`;
        progressBar.style.backgroundColor = progress === 100 ? '#4CAF50' : '#04a30cff';
    }
    
    // Update current user in localStorage
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
}

// Initialize user dashboard
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
    updateUserDashboard();
    
    // Auto-refresh every 3 seconds
    setInterval(updateUserDashboard, 3000);
});
