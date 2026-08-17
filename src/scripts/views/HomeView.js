import * as L from 'leaflet';

class HomeView {
  constructor() {
    this.map = null;
    this.markers = [];
  }

  render() {
    return `
      <section class="home-section">
        <div class="home-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
          <h1>Daftar Cerita</h1>
          <button id="btn-push-toggle" class="btn btn-secondary btn-sm" style="display: none;">Enable Push Notifications</button>
        </div>
        
        <div class="search-bar" style="margin-bottom: 1rem;">
          <label for="search-input" class="sr-only">Cari cerita berdasarkan nama atau deskripsi</label>
          <input type="text" id="search-input" placeholder="Cari cerita berdasarkan nama atau deskripsi..." style="width: 100%; padding: 0.5rem; border: 1px solid #ccc; border-radius: 4px;">
        </div>

        <div class="dashboard-layout">
          <div class="story-list-container" id="story-list" tabindex="0" aria-label="Daftar Cerita">
            <p>Loading...</p>
          </div>
          <div class="map-container" id="map" tabindex="0" aria-label="Peta Lokasi Cerita"></div>
        </div>
      </section>
    `;
  }

  initMap() {
    const mapContainer = document.querySelector('#map');
    if (!mapContainer) return;

    this.map = L.map('map').setView([-2.5489, 118.0149], 5);

    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    });
    
    const topoLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenTopoMap'
    });

    osmLayer.addTo(this.map);

    const baseMaps = {
      "OpenStreetMap": osmLayer,
      "Topography": topoLayer
    };

    L.control.layers(baseMaps).addTo(this.map);
    
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }

  addMarkersToMap(stories) {
    if (!this.map) return;

    stories.forEach((story) => {
      if (story.lat && story.lon) {
        const marker = L.marker([story.lat, story.lon]).addTo(this.map);
        marker.bindPopup(`<b>${story.name}</b><br>${story.description.slice(0, 50)}...`);
        this.markers.push({ id: story.id, marker });
      }
    });
  }

  focusMap(story) {
    if (!this.map) return;

    if (story.lat && story.lon) {
      this.map.flyTo([story.lat, story.lon], 15);
      
      const targetMarkerObj = this.markers.find(m => m.id === story.id);
      if (targetMarkerObj) {
        targetMarkerObj.marker.openPopup();
      }
    } else {
      alert('Cerita ini tidak memiliki data lokasi.');
    }
  }

  renderStories(stories, onStoryClick) {
    const listContainer = document.querySelector('#story-list');
    listContainer.innerHTML = '';
    
    if (stories.length === 0) {
      listContainer.innerHTML = '<p>Belum ada cerita.</p>';
      return;
    }

    stories.forEach((story) => {
      const article = document.createElement('article');
      article.classList.add('story-card');
      article.tabIndex = 0;
      article.innerHTML = `
        <img src="${story.photoUrl}" alt="Foto dari ${story.name}" class="story-img" />
        <div class="story-info">
          <div style="display: flex; justify-content: space-between; align-items: start;">
            <h3>${story.name}</h3>
            <button class="btn btn-secondary btn-sm btn-save" data-id="${story.id}" aria-label="Simpan Cerita">🔖 Simpan</button>
          </div>
          <p class="story-date">${new Date(story.createdAt).toLocaleDateString()}</p>
          <p class="story-desc">${story.description.slice(0, 100)}...</p>
        </div>
      `;
      
      const saveBtn = article.querySelector('.btn-save');
      saveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (this.onSaveClick) {
          this.onSaveClick(story);
        }
      });

      article.addEventListener('click', () => {
        onStoryClick(story);
      });
      article.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onStoryClick(story);
        }
      });
      
      listContainer.appendChild(article);
    });
  }

  showError(message) {
    const listContainer = document.querySelector('#story-list');
    listContainer.innerHTML = `<p class="error-message">${message}</p>`;
  }

  bindSearchEvent(handler) {
    const searchInput = document.querySelector('#search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        handler(e.target.value);
      });
    }
  }

  bindSaveEvent(handler) {
    this.onSaveClick = handler;
  }

  bindPushToggleEvent(handler) {
    const btn = document.querySelector('#btn-push-toggle');
    if (btn) {
      btn.addEventListener('click', () => {
        handler();
      });
    }
  }

  updatePushToggleState(isSubscribed) {
    const btn = document.querySelector('#btn-push-toggle');
    if (btn) {
      btn.style.display = 'block';
      if (isSubscribed) {
        btn.textContent = 'Disable Push Notifications';
        btn.classList.replace('btn-secondary', 'btn-primary');
      } else {
        btn.textContent = 'Enable Push Notifications';
        btn.classList.replace('btn-primary', 'btn-secondary');
      }
    }
  }
}

export default HomeView;
