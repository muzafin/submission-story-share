import AuthModel from '../models/AuthModel.js';
import RegisterView from '../views/RegisterView.js';

class RegisterPresenter {
  constructor() {
    this.view = new RegisterView();
  }

  async render() {
    return this.view.render();
  }

  async afterRender() {
    this.view.bindRegisterEvent(this.handleRegister.bind(this));
  }

  async handleRegister({ name, email, password }) {
    try {
      this.view.hideError();
      this.view.showLoading();
      
      const response = await AuthModel.register({ name, email, password });
      
      if (response.error) {
        throw new Error(response.message);
      }
      
      // Redirect to login after successful register
      this.view.navigate('#/login');
      
    } catch (error) {
      this.view.showError(error.message);
    } finally {
      this.view.hideLoading();
    }
  }
}

export default new RegisterPresenter();
