document.addEventListener('DOMContentLoaded', function () {

  // -----------------------------
  // Password show/hide toggle
  // -----------------------------
  document.querySelectorAll('.pw-row').forEach(function (row) {
    var input = row.querySelector('input[type="password"]'); // get password input
    if (!input) return;

    // check if toggle button already exists
    var btn = row.querySelector('.toggle-pw');
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'toggle-pw';
      btn.setAttribute('aria-label', 'Show password');
      btn.textContent = 'Show';
      row.appendChild(btn);
    }

    // toggle password visibility on click
    btn.addEventListener('click', function () {
      if (input.type === 'password') {
        input.type = 'text';
        btn.textContent = 'Hide';
        btn.setAttribute('aria-label', 'Hide password');
      } else {
        input.type = 'password';
        btn.textContent = 'Show';
        btn.setAttribute('aria-label', 'Show password');
      }
    });
  });

  // -----------------------------
  // Display form messages
  // -----------------------------
  function showMessage(text, ok) {
    var msg = document.getElementById('form-message'); // get message element
    if (!msg) return;
    msg.textContent = text;
    msg.className = 'message ' + (ok ? 'ok' : 'err'); // apply class based on success/fail
  }

  // -----------------------------
  // Main form handling
  // -----------------------------
  var form = document.querySelector('form.form');
  if (!form) return;

  // Detect if this is the Register page (has input[name="name"])
  var isRegister = !!form.querySelector('input[name="name"]');

  if (isRegister) {
    // -----------------------------
    // Registration form submission
    // -----------------------------
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var name = (form.querySelector('input[name="name"]') || {}).value || '';
      var email = ((form.querySelector('input[name="email"]') || {}).value || '').trim().toLowerCase();
      var password = (form.querySelector('input[name="password"]') || {}).value || '';

      // check if all fields are filled
      if (!name.trim() || !email || !password) {
        showMessage('Please fill out all fields', false);
        return;
      }

      var accounts = JSON.parse(localStorage.getItem('accounts') || '{}');

      // check if email already exists
      if (accounts[email]) {
        showMessage('An account with that email already exists', false);
        return;
      }

      // save account to localStorage
      accounts[email] = { name: name.trim(), password: password };
      localStorage.setItem('accounts', JSON.stringify(accounts));

      console.log('Registered user:', { name: name.trim(), email: email, password: password });
      showMessage('Registration saved. Redirecting to login...', true);

      setTimeout(function () {
        window.location.href = 'login.html';
      }, 800);
    });

  } else {
    // -----------------------------
    // Login form submission
    // -----------------------------
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var email = ((form.querySelector('input[name="email"]') || {}).value || '').trim().toLowerCase();
      var password = (form.querySelector('input[name="password"]') || {}).value || '';
      var accounts = JSON.parse(localStorage.getItem('accounts') || '{}');

      // check credentials
      if (accounts[email] && accounts[email].password === password) {
        localStorage.setItem('currentUser', email); // mark user as logged in
        showMessage('Login successful. Redirecting...', true);
        setTimeout(function () { window.location.href = 'success.html'; }, 400);
      } else {
        showMessage('Login failed: wrong email or password', false);
      }
    });
  }
});