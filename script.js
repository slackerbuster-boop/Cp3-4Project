document.addEventListener('DOMContentLoaded', function () {
  // password show/hide toggles
  document.querySelectorAll('.pw-row').forEach(function (row) {
    var input = row.querySelector('input[type="password"]');
    if (!input) return;

    var btn = row.querySelector('.toggle-pw');
    if (!btn) {
      btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'toggle-pw';
      btn.setAttribute('aria-label', 'Show password');
      btn.textContent = 'Show';
      row.appendChild(btn);
    }

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

  // simple registration/login using localStorage
  function showMessage(text, ok) {
    var msg = document.getElementById('form-message');
    if (!msg) return;
    msg.textContent = text;
    msg.className = 'message ' + (ok ? 'ok' : 'err');
  }

  var form = document.querySelector('form.form');
  if (!form) return;

  // Register page has input[name="name"]
  var isRegister = !!form.querySelector('input[name="name"]');

  if (isRegister) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (form.querySelector('input[name="name"]') || {}).value || '';
      var email = ((form.querySelector('input[name="email"]') || {}).value || '').trim().toLowerCase();
      var password = (form.querySelector('input[name="password"]') || {}).value || '';
      if (!name.trim() || !email || !password) {
        showMessage('Please fill out all fields', false);
        return;
      }

      var accounts = JSON.parse(localStorage.getItem('accounts') || '{}');
      if (accounts[email]) {
        showMessage('An account with that email already exists', false);
        return;
      }

      accounts[email] = { name: name.trim(), password: password };
      localStorage.setItem('accounts', JSON.stringify(accounts));
      console.log('Registered user:', { name: name.trim(), email: email, password: password });
      showMessage('Registration saved. Redirecting to login...', true);
      setTimeout(function () { window.location.href = 'login.html'; }, 800);
    });
  } else {
    // Login page
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = ((form.querySelector('input[name="email"]') || {}).value || '').trim().toLowerCase();
      var password = (form.querySelector('input[name="password"]') || {}).value || '';
      var accounts = JSON.parse(localStorage.getItem('accounts') || '{}');

      if (accounts[email] && accounts[email].password === password) {
        // mark this user as current
        localStorage.setItem('currentUser', email);
        showMessage('Login successful. Redirecting...', true);
        setTimeout(function () { window.location.href = 'success.html'; }, 400);
      } else {
        showMessage('Login failed: wrong email or password', false);
      }
    });
  }
});
