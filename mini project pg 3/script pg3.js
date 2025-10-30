//page 3 js 

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
  // Conditional: check if these fields exist (they won't on all pages)
  const loginRequired = document.getElementById('loginRequired');
  const donationForm = document.getElementById('donationForm');
  const donorNameField = document.getElementById('donorName');
  const donorEmailField = document.getElementById('donorEmail');

  if (currentUser) {
    if (loginBtn) loginBtn.style.display = 'none';
    if (userStatus) userStatus.classList.add('show');
    if (userName) userName.textContent = currentUser.firstName;
    if (userAvatar) userAvatar.textContent = currentUser.firstName.charAt(0).toUpperCase();

    if (loginRequired) loginRequired.classList.remove('show');
    if (donationForm) {
      donationForm.style.opacity = '1';
      donationForm.style.pointerEvents = 'auto';
    }
    if (donorNameField) {
      donorNameField.value = `${currentUser.firstName} ${currentUser.lastName}`;
      donorNameField.removeAttribute('readonly');
    }
    if (donorEmailField) {
      donorEmailField.value = currentUser.email;
      donorEmailField.removeAttribute('readonly');
    }

    // Pre-select NGO if one was selected
    const selectedNGO = localStorage.getItem('selectedNGO');
    if (selectedNGO && document.getElementById('ngo')) {
      document.getElementById('ngo').value = selectedNGO;
      localStorage.removeItem('selectedNGO');
    }
  } else {
    if (loginBtn) loginBtn.style.display = 'inline-flex';
    if (userStatus) userStatus.classList.remove('show');

    if (loginRequired) loginRequired.classList.add('show');
    if (donationForm) {
      donationForm.style.opacity = '0.5';
      donationForm.style.pointerEvents = 'none';
      donationForm.reset();
    }
    if (donorNameField) {
      donorNameField.value = '';
      donorNameField.setAttribute('readonly', 'true');
    }
    if (donorEmailField) {
      donorEmailField.value = '';
      donorEmailField.setAttribute('readonly', 'true');
    }
  }
}

function logout() {
  currentUser = null;
  localStorage.removeItem('ngoPortalUser');
  updateUserInterface();
  showNotification('You have been logged out successfully.', 'success');
  
  if (document.getElementById('donationForm')) document.getElementById('donationForm').reset();
  if (document.getElementById('certificateSection')) document.getElementById('certificateSection').style.display = 'none';
  if (document.getElementById('donate')) document.getElementById('donate').style.display = 'block';
}

// ---------- Specific to donation/certificate (Page 3) ---------
function generateId() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `DON-${timestamp}-${random}`;
}

function formatDate(date = new Date()) {
  return date.toLocaleDateString('en-GB', { 
    day: '2-digit', month: 'short', year: 'numeric' 
  });
}

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

  // Donation form logic only on Page 3 (where form exists)
  const donationForm = document.getElementById('donationForm');
  if (donationForm) {
    donationForm.addEventListener('submit', function(e) {
      e.preventDefault();
      if (!currentUser) {
        showNotification('Please login first to make a donation.', 'warning');
        setTimeout(() => {
          window.location.href = 'page1.html';
        }, 1500);
        return;
      }

      const name = document.getElementById('donorName').value.trim();
      const ngo = document.getElementById('ngo').value;
      const donationType = document.getElementById('donationType').value;
      const amount = parseInt(document.getElementById('amount').value, 10) || 0;
      const paymentMethod = document.getElementById('paymentMethod').value;

      if (!name || !ngo || !donationType || amount <= 0 || !paymentMethod) {
        showNotification('Please fill in all required fields.', 'error');
        return;
      }
      if (amount < 50) {
        showNotification('Minimum donation amount is ₹50.', 'error');
        return;
      }

      showNotification('Processing your donation...', 'success');
      setTimeout(() => {
        document.getElementById('certName').textContent = name;
        document.getElementById('certNGO').textContent = ngo;
        document.getElementById('certAmount').textContent = amount.toLocaleString('en-IN');
        document.getElementById('certType').textContent = donationType;
        document.getElementById('certDate').textContent = formatDate();
        document.getElementById('certId').textContent = generateId();

        document.getElementById('donate').style.display = 'none';
        document.getElementById('certificateSection').style.display = 'block';
        window.scrollTo({ top: 0, behavior: 'smooth' });

        showNotification(`🎉 Thank you ${currentUser.firstName}! Your donation of ₹${amount.toLocaleString('en-IN')} has been processed successfully.`, 'success');
      }, 3000);
    });
  }
});