// Φορτώνει τις αποθηκευμένες καταχωρήσεις από το localStorage και τις εμφανίζει
function loadVault() {
  const vault = document.getElementById('vault');
  vault.innerHTML = '';

  const entries = JSON.parse(localStorage.getItem('passwordVault') || '[]');

  if (entries.length === 0) {
    vault.innerHTML = '<li>No saved passwords yet.</li>';
    return;
  }

  entries.forEach((entry, index) => {
    const li = document.createElement('li');

    const span = document.createElement('span');
    span.textContent = `${entry.site} | ${entry.username} | `;

    const passSpan = document.createElement('span');
    passSpan.textContent = '●●●●●●●●';
    passSpan.style.userSelect = 'none';
    passSpan.style.letterSpacing = '0.2em';

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = '👁️';
    toggleBtn.title = 'Show/Hide password';
    toggleBtn.setAttribute('aria-label', 'Show or hide password');
    toggleBtn.addEventListener('click', () => {
      if (passSpan.textContent === '●●●●●●●●') {
        passSpan.textContent = entry.password;
      } else {
        passSpan.textContent = '●●●●●●●●';
      }
    });

    const copyBtn = document.createElement('button');
    copyBtn.textContent = '📋';
    copyBtn.title = 'Copy password to clipboard';
    copyBtn.setAttribute('aria-label', 'Copy password');
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(entry.password)
        .then(() => alert('Password copied to clipboard!'))
        .catch(() => alert('Failed to copy password.'));
    });

    const delBtn = document.createElement('button');
    delBtn.textContent = '🗑️';
    delBtn.title = 'Delete this password entry';
    delBtn.setAttribute('aria-label', 'Delete password entry');
    delBtn.addEventListener('click', () => {
      if (confirm(`Delete password for ${entry.site}?`)) {
        entries.splice(index, 1);
        localStorage.setItem('passwordVault', JSON.stringify(entries));
        loadVault();
      }
    });

    li.appendChild(span);
    li.appendChild(passSpan);
    li.appendChild(toggleBtn);
    li.appendChild(copyBtn);
    li.appendChild(delBtn);

    vault.appendChild(li);
  });
}

function saveEntry(event) {
  if (event) event.preventDefault();

  const siteInput = document.getElementById('site');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');

  const site = siteInput.value.trim();
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (!site || !username || !password) {
    alert('Please fill in all fields!');
    return;
  }

  let entries = JSON.parse(localStorage.getItem('passwordVault') || '[]');

  const exists = entries.find(e => e.site.toLowerCase() === site.toLowerCase() && e.username === username);
  if (exists) {
    if (!confirm('This site and username already exist. Overwrite password?')) return;
    entries = entries.filter(e => !(e.site.toLowerCase() === site.toLowerCase() && e.username === username));
  }

  entries.push({ site, username, password });

  localStorage.setItem('passwordVault', JSON.stringify(entries));

  siteInput.value = '';
  usernameInput.value = '';
  passwordInput.value = '';

  loadVault();
}

function generatePassword(length = 12) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{};:,<.>/?';
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  document.getElementById('password').value = password;
}

function toggleMode() {
  document.body.classList.toggle('dark');
  const modeBtn = document.getElementById('modeBtn');
  if (document.body.classList.contains('dark')) {
    modeBtn.textContent = '☀️ Toggle Light Mode';
  } else {
    modeBtn.textContent = '🌙 Toggle Dark Mode';
  }
}

window.addEventListener('DOMContentLoaded', () => {
  loadVault();

  const modeBtn = document.getElementById('modeBtn');
  if (document.body.classList.contains('dark')) {
    modeBtn.textContent = '☀️ Toggle Light Mode';
  } else {
    modeBtn.textContent = '🌙 Toggle Dark Mode';
  }

  const togglePassword = document.getElementById('togglePassword');
  const password = document.getElementById('password');
  const generateBtn = document.getElementById('generateBtn');
  const saveBtn = document.getElementById('saveBtn');
  const form = document.getElementById('passwordForm');

  if (togglePassword && password) {
    togglePassword.addEventListener('click', () => {
      const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
      password.setAttribute('type', type);
      togglePassword.textContent = type === 'password' ? '👁️' : '🙈';
    });
  }

  if (generateBtn) {
    generateBtn.addEventListener('click', () => generatePassword());
  }

  if (form) {
    form.addEventListener('submit', saveEntry);
  }
  
  if (modeBtn) {
    modeBtn.addEventListener('click', toggleMode);
  }
});
