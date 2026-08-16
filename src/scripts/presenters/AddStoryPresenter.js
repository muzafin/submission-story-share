import StoryModel from '../models/StoryModel.js';
import AddStoryView from '../views/AddStoryView.js';

class AddStoryPresenter {
  constructor() {
    this.view = new AddStoryView();
  }

  async render() {
    return this.view.render();
  }

  async afterRender() {
    this.view.initMap();
    this.view.initCamera();
    this.view.initPhotoUpload();
    this.view.bindSubmitEvent(this.handleSubmit.bind(this));
  }

  async handleSubmit(formData) {
    try {
      this.view.hideError();
      this.view.showLoading();

      const response = await StoryModel.addStory(formData);
      if (response.error) {
        throw new Error(response.message);
      }

      alert('Cerita berhasil ditambahkan!');
      this.view.navigate('#/');
      
    } catch (error) {
      this.view.showError(error.message);
    } finally {
      this.view.hideLoading();
    }
  }

  destroy() {
    this.view.stopCamera();
  }
}

export default new AddStoryPresenter();
