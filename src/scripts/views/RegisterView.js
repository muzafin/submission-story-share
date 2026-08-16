class RegisterView {
  render() {
    return `
      <section class="auth-section">
        <h1>Register</h1>
        <form id="register-form">
          <div class="form-group">
            <label for="name">Name</label>
            <input type="text" id="name" name="name" required autocomplete="name" />
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input type="email" id="email" name="email" required autocomplete="email" />
          </div>
          <div class="form-group">
            <label for="password">Password (min 8 char)</label>
            <input type="password" id="password" name="password" required minlength="8" autocomplete="new-password" />
          </div>
          <div id="register-error" class="error-message" role="alert"></div>
          <button type="submit" class="btn btn-primary" id="register-button">Register</button>
        </form>
        <p>Sudah punya akun? <a href="#/login">Login di sini</a></p>
      </section>
    `;
  }

  bindRegisterEvent(handler) {
    const form = document.querySelector('#register-form');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const name = document.querySelector('#name').value;
      const email = document.querySelector('#email').value;
      const password = document.querySelector('#password').value;
      handler({ name, email, password });
    });
  }

  showLoading() {
    const btn = document.querySelector('#register-button');
    btn.disabled = true;
    btn.textContent = 'Loading...';
  }

  hideLoading() {
    const btn = document.querySelector('#register-button');
    btn.disabled = false;
    btn.textContent = 'Register';
  }

  showError(message) {
    const errorEl = document.querySelector('#register-error');
    errorEl.textContent = message;
    errorEl.style.display = 'block';
  }

  hideError() {
    const errorEl = document.querySelector('#register-error');
    errorEl.style.display = 'none';
  }

  navigate(url) {
    window.location.hash = url;
  }
}

export default RegisterView;
