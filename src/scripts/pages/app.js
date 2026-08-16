import routes from '../routes/routes.js';
import { getActiveRoute } from '../routes/url-parser.js';
import { isAuthenticated, removeToken } from '../utils/auth-token.js';

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  #currentPresenter = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this.#setupDrawer();
    this.#setupAuthNav();
    
    window.addEventListener('authChange', this.#setupAuthNav.bind(this));
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener('click', () => {
      this.#navigationDrawer.classList.toggle('open');
    });

    document.body.addEventListener('click', (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove('open');
      }

      this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove('open');
        }
      });
    });
  }

  #setupAuthNav() {
    const authNavItem = document.querySelector('#auth-nav-item');
    if (isAuthenticated()) {
      authNavItem.innerHTML = '<a href="javascript:void(0)" id="logout-btn">Logout</a>';
      document.querySelector('#logout-btn').addEventListener('click', () => {
        removeToken();
        window.dispatchEvent(new Event('authChange'));
        window.location.hash = '#/login';
      });
    } else {
      authNavItem.innerHTML = '<a href="#/login">Login</a>';
    }
  }

  async renderPage() {
    let url = getActiveRoute();
    
    // Auth Guard
    if (url === '/login' || url === '/register') {
      if (isAuthenticated()) {
        window.location.hash = '#/';
        return;
      }
    } else {
      if (!isAuthenticated()) {
        window.location.hash = '#/login';
        return;
      }
    }

    const presenter = routes[url] || routes['/'];
    
    // Call destroy on previous presenter to clean up resources (like camera)
    if (this.#currentPresenter && typeof this.#currentPresenter.destroy === 'function') {
      this.#currentPresenter.destroy();
    }
    
    this.#currentPresenter = presenter;

    // View Transitions API
    if (!document.startViewTransition) {
      this.#renderContent(presenter);
    } else {
      document.startViewTransition(() => this.#renderContent(presenter));
    }
  }

  async #renderContent(presenter) {
    this.#content.innerHTML = await presenter.render();
    await presenter.afterRender();
  }
}

export default App;
