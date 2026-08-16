import StoryModel from '../models/StoryModel.js';
import DetailView from '../views/DetailView.js';
import { parseActivePathname } from '../routes/url-parser.js';

class DetailPresenter {
  constructor() {
    this.view = new DetailView();
  }

  async render() {
    return this.view.render();
  }

  async afterRender() {
    try {
      const urlSegments = parseActivePathname();
      const storyId = urlSegments.id;
      
      const story = await StoryModel.getStoryDetail(storyId);
      this.view.renderStory(story);
    } catch (error) {
      this.view.showError(error.message);
    }
  }
}

export default new DetailPresenter();
