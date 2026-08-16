import { openDB } from 'idb';

const DATABASE_NAME = 'story-share-db';
const DATABASE_VERSION = 1;
const OBJECT_STORE_STORIES = 'stories';
const OBJECT_STORE_OUTBOX = 'outbox_stories';

const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
  upgrade(database) {
    database.createObjectStore(OBJECT_STORE_STORIES, { keyPath: 'id' });
    database.createObjectStore(OBJECT_STORE_OUTBOX, { keyPath: 'id', autoIncrement: true });
  },
});

class IdbHelper {
  // --- Cached Stories (Read-Only offline) ---
  static async getStory(id) {
    return (await dbPromise).get(OBJECT_STORE_STORIES, id);
  }

  static async getAllStories() {
    return (await dbPromise).getAll(OBJECT_STORE_STORIES);
  }

  static async putStory(story) {
    return (await dbPromise).put(OBJECT_STORE_STORIES, story);
  }

  static async deleteStory(id) {
    return (await dbPromise).delete(OBJECT_STORE_STORIES, id);
  }

  static async clearAllStories() {
    return (await dbPromise).clear(OBJECT_STORE_STORIES);
  }

  // --- Outbox (Background Sync) ---
  static async putOutboxStory(storyData) {
    return (await dbPromise).put(OBJECT_STORE_OUTBOX, storyData);
  }

  static async getAllOutboxStories() {
    return (await dbPromise).getAll(OBJECT_STORE_OUTBOX);
  }

  static async deleteOutboxStory(id) {
    return (await dbPromise).delete(OBJECT_STORE_OUTBOX, id);
  }
}

export default IdbHelper;
