// Page 1 js

// Global state
let currentUser = null;
let authModalShown = false;

// Show auth modal after 5 seconds if not logged in
setTimeout(() => {
  if (!currentUser && !authModalShown) {
    openAuthModal();
    authModalShown = true;
  }
}, 5000);

// Utility functions
function showNotification(message, type = 'success') {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = `notification ${type} show`;
  
  setTimeout(() => {
    notification.classList.remove('show');
  }, 4000);
}

// Auth modal functions
function openAuthModal() {
  document.getElementById('authModal').classList.add('show');
  document.body.style.overflow = 'hidden';
}

function closeAuthModal() {
  document.getElementById('authModal').classList.remove('show');
  document.body.style.overflow = 'auto';
}

function switchTab(tabName) {
  // We need to get the click event. A simple way is to pass `event` from the HTML
  // Or, more modernly, we'd add event listeners, but let's fix the existing code.
  // This will fail as-is. Let's fix the HTML calls first.
  
  // Go to page1.html and change:
  // onclick="switchTab('login')" -> onclick="switchTab(event, 'login')"
  // onclick="switchTab('signup')" -> onclick="switchTab(event, 'signup')"
  
  // Then, in the JS, accept the event:
  // function switchTab(tabName) -> function switchTab(event, tabName)
  // And use event.target

  // FOR SIMPLICITY, let's just make your *current* code work without HTML changes.
  // We'll find the active tab differently.
  
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Find the button that was clicked. This is tricky without the event.
  // A better way to fix this, without changing the HTML, is this:
  // We'll select the button based on its text content (which is a bit fragile, but works)
  
  const tabs = document.querySelectorAll('.auth-tab');
  if (tabName === 'login') {
    tabs[0].classList.add('active');
  } else {
    tabs[1].classList.add('active');
  }

  document.querySelectorAll('.auth-form').forEach(form => {
    form.classList.remove('active');
  });
  document.getElementById(tabName + 'Form').classList.add('active');
}

function socialLogin(provider) {
  showNotification(`${provider} login simulation - creating demo account...`, 'success');
  
  setTimeout(() => {
    currentUser = {
      firstName: 'Demo',
      lastName: 'User',
      email: `demo.user@${provider.toLowerCase()}.com`,
      loginMethod: provider
    };
    
    localStorage.setItem('ngoPortalUser', JSON.stringify(currentUser));
    updateUserInterface();
    closeAuthModal();
    showNotification(`Welcome ${currentUser.firstName}! You're now logged in.`, 'success');
  }, 1500);
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

// Form event listeners
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  
  if (!email || !password) {
    showNotification('Please fill in all required fields.', 'error');
    return;
  }

  showNotification('Logging in...', 'success');
  
  setTimeout(() => {
    currentUser = {
      firstName: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
      lastName: 'User',
      email: email,
      loginMethod: 'email'
    };
    
    localStorage.setItem('ngoPortalUser', JSON.stringify(currentUser));
    updateUserInterface();
    closeAuthModal();
    showNotification(`Welcome back, ${currentUser.firstName}!`, 'success');
  }, 2000);
});

document.getElementById('signupForm').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const firstName = document.getElementById('signupFirstName').value;
  const lastName = document.getElementById('signupLastName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;
  
  if (!firstName || !lastName || !email || !password) {
    showNotification('Please fill in all required fields.', 'error');
    return;
  }

  if (password.length < 6) {
    showNotification('Password must be at least 6 characters long.', 'error');
    return;
  }

  showNotification('Creating your account...', 'success');
  
  setTimeout(() => {
    currentUser = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      loginMethod: 'email'
    };
    
    localStorage.setItem('ngoPortalUser', JSON.stringify(currentUser));
    updateUserInterface();
    closeAuthModal();
    showNotification(`🎉 Welcome to DaanSetu, ${firstName}! Your account has been created.`, 'success');
  }, 2500);
});

// Close modal when clicking outside
document.getElementById('authModal').addEventListener('click', function(e) {
  if (e.target === this) {
    closeAuthModal();
  }
});

// Check for existing user on page load
document.addEventListener('DOMContentLoaded', function() {
  const savedUser = localStorage.getItem('ngoPortalUser');
  if (savedUser) {
    try {
      currentUser = JSON.parse(savedUser);
      updateUserInterface();
      showNotification(`Welcome back, ${currentUser.firstName}!`, 'success');
    } catch (e) {
      localStorage.removeItem('ngoPortalUser');
    }
  } else {
    updateUserInterface();
  }

  // Check for pending NGO selection from page 2
  const selectedNGO = localStorage.getItem('selectedNGO');
  if (selectedNGO && !currentUser) {
      openAuthModal();
      authModalShown = true;
  }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && document.getElementById('authModal').classList.contains('show')) {
    closeAuthModal();
  }
});

// NOTE: Your original `switchTab` function relies on a global `event` object, which is not
// reliable. I've modified it to work without the event object.
// A better fix is to change the HTML onclick to:
// onclick="switchTab(event, 'login')"
// and the function definition to:
// function switchTab(event, tabName) {
//   ...
//   event.target.classList.add('active');
//   ...
// }
// But the code above will work with your *current* HTML.