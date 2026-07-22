// ---------- Hamburger menu toggle ----------

const hamburgerBtn = document.getElementById('hamburgerBtn');
const navLinks = document.getElementById('navLinks');

hamburgerBtn.addEventListener('click', function () {
  const isOpen = navLinks.classList.toggle('active');
  hamburgerBtn.setAttribute('aria-expanded', isOpen);
});

// Close the mobile menu after tapping a link, so it doesn't stay open
navLinks.querySelectorAll('a').forEach(function (link) {
  link.addEventListener('click', function () {
    navLinks.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
  });
});

// ---------- Form elements ----------

const form = document.getElementById('applicationForm');

const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const domainInput = document.getElementById('domain');
const universityInput = document.getElementById('university');
const statementInput = document.getElementById('statement');

const nameError = document.getElementById('nameError');
const emailError = document.getElementById('emailError');
const phoneError = document.getElementById('phoneError');
const domainError = document.getElementById('domainError');
const universityError = document.getElementById('universityError');
const statementError = document.getElementById('statementError');

const thankYou = document.getElementById('thankYouMessage');
const submissionsList = document.getElementById('submissionsList');

// ---------- Helpers ----------

function showError(input, errorEl, message) {
  errorEl.textContent = message;
  errorEl.classList.add('show');
  input.classList.add('invalid');
}

function clearError(input, errorEl) {
  errorEl.textContent = '';
  errorEl.classList.remove('show');
  input.classList.remove('invalid');
}

// ---------- Per-field validation functions ----------

function validateName() {
  if (nameInput.value.trim() === '') {
    showError(nameInput, nameError, 'Name is required.');
    return false;
  }
  clearError(nameInput, nameError);
  return true;
}

function validateEmail() {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const value = emailInput.value.trim();
  if (value === '') {
    showError(emailInput, emailError, 'Email is required.');
    return false;
  }
  if (!emailPattern.test(value)) {
    showError(emailInput, emailError, 'Enter a valid email address.');
    return false;
  }
  clearError(emailInput, emailError);
  return true;
}

function validatePhone() {
  const phonePattern = /^\+?[0-9]{10,13}$/;
  const value = phoneInput.value.trim();
  if (value === '') {
    showError(phoneInput, phoneError, 'Phone number is required.');
    return false;
  }
  if (!phonePattern.test(value)) {
    showError(phoneInput, phoneError, 'Enter 10–13 digits, optionally starting with +.');
    return false;
  }
  clearError(phoneInput, phoneError);
  return true;
}

function validateDomain() {
  if (domainInput.value === '') {
    showError(domainInput, domainError, 'Please select a domain.');
    return false;
  }
  clearError(domainInput, domainError);
  return true;
}

function validateUniversity() {
  if (universityInput.value.trim() === '') {
    showError(universityInput, universityError, 'University is required.');
    return false;
  }
  clearError(universityInput, universityError);
  return true;
}

function validateStatement() {
  const value = statementInput.value.trim();
  if (value === '') {
    showError(statementInput, statementError, 'Short statement is required.');
    return false;
  }
  if (value.length < 10) {
    showError(statementInput, statementError, 'Please write at least 10 characters.');
    return false;
  }
  clearError(statementInput, statementError);
  return true;
}

// Instant feedback as the user leaves each field
nameInput.addEventListener('blur', validateName);
emailInput.addEventListener('blur', validateEmail);
phoneInput.addEventListener('blur', validatePhone);
domainInput.addEventListener('blur', validateDomain);
universityInput.addEventListener('blur', validateUniversity);
statementInput.addEventListener('blur', validateStatement);

// ---------- Submissions: localStorage + rendering ----------

function renderSubmissions() {
  const submissions = JSON.parse(localStorage.getItem('submissions')) || [];
  submissionsList.innerHTML = '';

  if (submissions.length === 0) {
    const li = document.createElement('li');
    li.className = 'log-empty';
    li.textContent = 'No submissions yet — fill the form above to get started.';
    submissionsList.appendChild(li);
    return;
  }

  submissions.forEach(function (sub) {
    const li = document.createElement('li');
    li.textContent = sub.name + ' — ' + sub.domain + ' (' + sub.university + ')';
    submissionsList.appendChild(li);
  });
}

// ---------- Form submit ----------

form.addEventListener('submit', function (e) {
  e.preventDefault();

  const isNameValid = validateName();
  const isEmailValid = validateEmail();
  const isPhoneValid = validatePhone();
  const isDomainValid = validateDomain();
  const isUniversityValid = validateUniversity();
  const isStatementValid = validateStatement();

  const isFormValid = isNameValid && isEmailValid && isPhoneValid &&
    isDomainValid && isUniversityValid && isStatementValid;

  if (!isFormValid) {
    thankYou.classList.add('hidden');
    return;
  }

  const submission = {
    name: nameInput.value.trim(),
    email: emailInput.value.trim(),
    phone: phoneInput.value.trim(),
    domain: domainInput.value,
    university: universityInput.value.trim(),
    statement: statementInput.value.trim(),
  };

  const submissions = JSON.parse(localStorage.getItem('submissions')) || [];
  submissions.push(submission);
  localStorage.setItem('submissions', JSON.stringify(submissions));

  thankYou.textContent = 'Thank you, ' + submission.name + '! Your application for ' +
    submission.domain + ' has been received.';
  thankYou.classList.remove('hidden');

  form.reset();
  renderSubmissions();
});

// Render whatever was previously submitted as soon as the page loads
renderSubmissions();
