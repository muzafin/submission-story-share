import CONFIG from '../config.js';
import { getToken } from '../utils/auth-token.js';
import IdbHelper from '../utils/IdbHelper.js';

class StoryModel {
  static async getAllStories() {
    try {
      const response = await fetch(`${CONFIG.BASE_URL}/stories`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const responseJson = await response.json();
      if (!response.ok) {
        throw new Error(responseJson.message || 'Failed to fetch stories');
      }

      // Sync to IDB
      await IdbHelper.clearAllStories();
      for (const story of responseJson.listStory) {
        await IdbHelper.putStory(story);
      }

      return responseJson.listStory;
    } catch (error) {
      // Fallback to IndexedDB if offline
      console.warn('Network failed, returning offline stories from IDB');
      const offlineStories = await IdbHelper.getAllStories();
      return offlineStories;
    }
  }

  static async getStoryDetail(id) {
    try {
      const response = await fetch(`${CONFIG.BASE_URL}/stories/${id}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const responseJson = await response.json();
      if (!response.ok) {
        throw new Error(responseJson.message || 'Failed to fetch story detail');
      }
      return responseJson.story;
    } catch (error) {
      const offlineStory = await IdbHelper.getStory(id);
      if (offlineStory) return offlineStory;
      throw new Error('Offline and story not found in cache');
    }
  }

  static async addStory(formData) {
    try {
      const response = await fetch(`${CONFIG.BASE_URL}/stories`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
      });

      const responseJson = await response.json();
      if (!response.ok) {
        throw new Error(responseJson.message || 'Failed to add story');
      }
      return responseJson;
    } catch (error) {
      // If offline, save to IDB outbox for background sync
      if (!navigator.onLine) {
        console.warn('Offline: Saving story to outbox for background sync');
        
        // We can't save FormData directly to IDB easily, so we serialize it
        const storyData = {
          description: formData.get('description'),
          lat: formData.get('lat') ? parseFloat(formData.get('lat')) : null,
          lon: formData.get('lon') ? parseFloat(formData.get('lon')) : null,
          photo: formData.get('photo'), // File object can be stored in IDB
          token: getToken() // We need token to sync later in background
        };
        
        await IdbHelper.putOutboxStory(storyData);
        
        // Register sync event
        if ('serviceWorker' in navigator && 'SyncManager' in window) {
          const swRegistration = await navigator.serviceWorker.ready;
          await swRegistration.sync.register('sync-new-stories');
        }
        
        return { error: false, message: 'Disimpan secara offline. Akan dikirim otomatis saat online.' };
      }
      throw error;
    }
  }
}

export default StoryModel;
