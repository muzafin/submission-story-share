class LoginView {
  render() {
    return `
      <section class="auth-section">
        <h1>Login</h1>
        <form id="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required autocomplete="email" />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required autocomplete="current-password" />
          </div>
          <div id="login-error" class="error-message" role="alert"></div>
          <button type="submit" class="btn btn-primary" id="login-button">Login</button>
        </form>
        <p>Belum punya akun? <a href="#/register">Register di sini</a></p>
      </section>
    `;
  }

  bindLoginEvent(handler) {
    const form = document.querySelector('#login-form');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = document.querySelector('#email').value;
      const password = document.querySelector('#password').value;
      handler({ email, password });
    });
  }

  showLoading() {
    const btn = document.querySelector('#login-button');
    btn.disabled = true;
    btn.textContent = 'Loading...';
  }

  hideLoading() {
    const btn = document.querySelector('#login-button');
    btn.disabled = false;
    btn.textContent = 'Login';
  }

  showError(message) {
    const errorEl = document.querySelector('#login-error');
    errorEl.textContent = message;
    errorEl.style.display = 'block';
  }

  hideError() {
    const errorEl = document.querySelector('#login-error');
    errorEl.style.display = 'none';
  }

  navigate(url) {
    window.location.hash = url;
  }
}

export default LoginView;
