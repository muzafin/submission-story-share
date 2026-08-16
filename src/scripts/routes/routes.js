import LoginPresenter from '../presenters/LoginPresenter.js';
import RegisterPresenter from '../presenters/RegisterPresenter.js';
import HomePresenter from '../presenters/HomePresenter.js';
import AddStoryPresenter from '../presenters/AddStoryPresenter.js';
import DetailPresenter from '../presenters/DetailPresenter.js';

const routes = {
  '/': HomePresenter,
  '/login': LoginPresenter,
  '/register': RegisterPresenter,
  '/add-story': AddStoryPresenter,
  '/stories/:id': DetailPresenter
};

export default routes;
