import StoryModel from '../models/StoryModel.js';
import HomeView from '../views/HomeView.js';
import { checkIsSubscribed, isPushSupported, subscribePushNotification, unsubscribePushNotification } from '../utils/push-manager.js';
import IdbHelper from '../utils/IdbHelper.js';

class HomePresenter {
  constructor() {
    this.view = new HomeView();
    this.stories = [];
  }

  async render() {
    return this.view.render();
  }

  async afterRender() {
    this.view.initMap();
    try {
      this.stories = await StoryModel.getAllStories();
      this.view.renderStories(this.stories, this.onStoryClick.bind(this));
      this.view.addMarkersToMap(this.stories);

      // Search Handler
      this.view.bindSearchEvent(this.handleSearch.bind(this));

      // Bookmark Handler
      this.view.bindSaveEvent(this.handleSaveStory.bind(this));

      // Push Notification Initialization
      if (isPushSupported()) {
        const isSubscribed = await checkIsSubscribed();
        this.view.updatePushToggleState(isSubscribed);
        this.view.bindPushToggleEvent(this.handlePushToggle.bind(this));
      }

    } catch (error) {
      this.view.showError(error.message);
    }
  }

  onStoryClick(story) {
    this.view.focusMap(story);
  }

  async handleSaveStory(story) {
    try {
      await IdbHelper.putSavedStory(story);
      alert('Cerita berhasil disimpan! Lihat di menu Simpan.');
    } catch (e) {
      alert('Gagal menyimpan cerita.');
      console.error(e);
    }
  }

  handleSearch(query) {
    const q = query.toLowerCase();
    const filtered = this.stories.filter(story => 
      story.name.toLowerCase().includes(q) || 
      story.description.toLowerCase().includes(q)
    );
    this.view.renderStories(filtered, this.onStoryClick.bind(this));
  }

  async handlePushToggle() {
    try {
      const isSubscribed = await checkIsSubscribed();
      if (isSubscribed) {
        await unsubscribePushNotification();
        this.view.updatePushToggleState(false);
        alert('Berhasil berhenti berlangganan notifikasi.');
      } else {
        await subscribePushNotification();
        this.view.updatePushToggleState(true);
        alert('Berhasil berlangganan notifikasi.');
      }
    } catch (error) {
      alert(`Gagal mengubah status notifikasi: ${error.message}`);
    }
  }
}

export default new HomePresenter();
