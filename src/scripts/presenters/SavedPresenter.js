import IdbHelper from '../utils/IdbHelper.js';
import SavedView from '../views/SavedView.js';

class SavedPresenter {
  constructor() {
    this.view = new SavedView();
  }

  async render() {
    return this.view.render();
  }

  async afterRender() {
    await this._loadSavedStories();
  }

  async _loadSavedStories() {
    try {
      const stories = await IdbHelper.getAllSavedStories();
      this.view.renderStories(stories, this.onDeleteClick.bind(this));
    } catch (error) {
      this.view.showError('Gagal memuat cerita tersimpan.');
    }
  }

  async onDeleteClick(id) {
    if (confirm('Apakah Anda yakin ingin menghapus cerita ini dari daftar simpanan?')) {
      try {
        await IdbHelper.deleteSavedStory(id);
        alert('Cerita berhasil dihapus.');
        await this._loadSavedStories();
      } catch (e) {
        alert('Gagal menghapus cerita.');
        console.error(e);
      }
    }
  }
}

export default new SavedPresenter();
