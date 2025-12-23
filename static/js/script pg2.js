//pg 3 js
// Global state
let currentUser = null;

// Utility functions
function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = `notification ${type} show`;
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 4000);
}

function updateUserInterface() {
  const loginBtn = document.getElementById('loginBtn');
  const userStatus = document.getElementById('userStatus');
  const userName = document.getElementById('userName');
  const userAvatar = document.getElementById('userAvatar');

  if (currentUser) {
    loginBtn.style.display = 'none';
    userStatus.classList.add('show');
    userName.textContent = currentUser.firstName;
    userAvatar.textContent = currentUser.firstName.charAt(0).toUpperCase();
  } else {
    loginBtn.style.display = 'inline-flex';
    userStatus.classList.remove('show');
  }
}

function logout() {
  currentUser = null;
  localStorage.removeItem('ngoPortalUser');
  updateUserInterface();
  showNotification('You have been logged out successfully.', 'success');
}

function selectNGO(ngoName) {
  if (!currentUser) {
    localStorage.setItem('selectedNGO', ngoName);
    showNotification('Please login first to make a donation.', 'warning');
    setTimeout(() => {
      window.location.href = 'page1.html';
    }, 1500);
  } else {
    localStorage.setItem('selectedNGO', ngoName);
    window.location.href = 'page3.html';
  }
}

// Check for existing user on page load
document.addEventListener('DOMContentLoaded', function() {
  const savedUser = localStorage.getItem('ngoPortalUser');
  if (savedUser) {
    try {
      currentUser = JSON.parse(savedUser);
      updateUserInterface();
    } catch (e) {
      localStorage.removeItem('ngoPortalUser');
    }
  } else {
    updateUserInterface();
  }
});
document.querySelectorAll("{{ url_for('donation_collect') }}").forEach(btn =>btn.onclick =() => location.href = "../mini project pg 3/donation.html");