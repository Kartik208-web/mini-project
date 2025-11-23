
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

      function generateId() {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).slice(2, 5).toUpperCase();
        return `DON-${timestamp}-${random}`;
      }

      function formatDate(date = new Date()) {
        return date.toLocaleDateString('en-GB', { 
          day: '2-digit', 
          month: 'short', 
          year: 'numeric' 
        });
      }

      function updateUserInterface() {
        const loginBtn = document.getElementById('loginBtn');
        const userStatus = document.getElementById('userStatus');
        const userName = document.getElementById('userName');
        const userAvatar = document.getElementById('userAvatar');
        const loginRequired = document.getElementById('loginRequired');
        const donationForm = document.getElementById('donationForm');
        const donorNameField = document.getElementById('donorName');
        const donorEmailField = document.getElementById('donorEmail');

        if (currentUser) {
          loginBtn.style.display = 'none';
          userStatus.classList.add('show');
          userName.textContent = currentUser.firstName;
          userAvatar.textContent = currentUser.firstName.charAt(0).toUpperCase();
          
          loginRequired.classList.remove('show');
          donationForm.style.opacity = '1';
          donationForm.style.pointerEvents = 'auto';
          
          donorNameField.value = `${currentUser.firstName} ${currentUser.lastName}`;
          donorEmailField.value = currentUser.email;
          donorNameField.removeAttribute('readonly');
          donorEmailField.removeAttribute('readonly');
          
          // Pre-select NGO if one was selected
          const selectedNGO = localStorage.getItem('selectedNGO');
          if (selectedNGO) {
            document.getElementById('ngo').value = selectedNGO;
            localStorage.removeItem('selectedNGO');
          }
        } else {
          loginBtn.style.display = 'inline-flex';
          userStatus.classList.remove('show');
          
          loginRequired.classList.add('show');
          donationForm.style.opacity = '0.5';
          donationForm.style.pointerEvents = 'none';
          
          donorNameField.value = '';
          donorEmailField.value = '';
          donorNameField.setAttribute('readonly', 'true');
          donorEmailField.setAttribute('readonly', 'true');
        }
      }

      function logout() {
        currentUser = null;
        localStorage.removeItem('ngoPortalUser');
        updateUserInterface();
        showNotification('You have been logged out successfully.', 'success');
        
        document.getElementById('donationForm').reset();
        document.getElementById('certificateSection').style.display = 'none';
        document.getElementById('donate').style.display = 'block';
      }

      // Donation form handler
      document.getElementById('donationForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!currentUser) {
          showNotification('Please login first to make a donation.', 'warning');
          setTimeout(() => {
            window.location.href = '../mini project pg 1/pg1.html';
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
    