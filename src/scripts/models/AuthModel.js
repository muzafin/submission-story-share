import CONFIG from '../config.js';

class AuthModel {
  static async login({ email, password }) {
    const response = await fetch(`${CONFIG.BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const responseJson = await response.json();
    if (!response.ok) {
      throw new Error(responseJson.message || 'Login failed');
    }
    return responseJson;
  }

  static async register({ name, email, password }) {
    const response = await fetch(`${CONFIG.BASE_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });

    const responseJson = await response.json();
    if (!response.ok) {
      throw new Error(responseJson.message || 'Register failed');
    }
    return responseJson;
  }
}

export default AuthModel;
