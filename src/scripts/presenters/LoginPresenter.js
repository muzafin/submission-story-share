import AuthModel from '../models/AuthModel.js';
import LoginView from '../views/LoginView.js';
import { setToken } from '../utils/auth-token.js';

class LoginPresenter {
  constructor() {
    this.view = new LoginView();
  }

  async render() {
    return this.view.render();
  }

  async afterRender() {
    this.view.bindLoginEvent(this.handleLogin.bind(this));
  }

  async handleLogin({ email, password }) {
    try {
      this.view.hideError();
      this.view.showLoading();
      
      const response = await AuthModel.login({ email, password });
      
      if (response.error) {
        throw new Error(response.message);
      }
      
      setToken(response.loginResult.token);
      
      // Update auth nav and redirect to home
      window.dispatchEvent(new Event('authChange'));
      this.view.navigate('#/');
      
    } catch (error) {
      this.view.showError(error.message);
    } finally {
      this.view.hideLoading();
    }
  }
}

export default new LoginPresenter();
