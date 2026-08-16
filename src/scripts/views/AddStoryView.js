import * as L from 'leaflet';

class AddStoryView {
  constructor() {
    this.map = null;
    this.marker = null;
    this.mediaStream = null;
    this.capturedPhotoBlob = null;
  }

  render() {
    return `
      <section class="add-story-section">
        <h1>Tambah Cerita Baru</h1>
        <form id="add-story-form">
          <div class="form-group">
            <label for="description">Deskripsi</label>
            <textarea id="description" name="description" rows="4" required></textarea>
          </div>
          
          <div class="form-group">
            <label>Foto</label>
            <div class="photo-mode-toggle">
              <button type="button" class="btn btn-secondary" id="btn-upload-mode">Upload File</button>
              <button type="button" class="btn btn-secondary" id="btn-camera-mode">Gunakan Kamera</button>
            </div>
            
            <div id="upload-container">
              <label for="photo" class="sr-only">Upload Foto</label>
              <input type="file" id="photo" name="photo" accept="image/*" />
            </div>

            <div id="camera-container" style="display: none;">
              <video id="camera-video" width="100%" autoplay playsinline></video>
              <button type="button" class="btn btn-secondary" id="btn-capture">Ambil Foto</button>
              <canvas id="camera-canvas" style="display: none;"></canvas>
            </div>
            
            <img id="photo-preview" class="photo-preview" alt="Preview Foto" style="display: none; margin-top: 10px; max-width: 100%;" />
          </div>

          <div class="form-group">
            <label>Lokasi (Opsional - Klik pada peta)</label>
            <div id="add-story-map" class="map-container-small" style="height: 300px; margin-bottom: 10px;" tabindex="0" aria-label="Peta untuk memilih lokasi"></div>
            <div class="location-inputs">
              <label for="lat">Latitude</label>
              <input type="number" step="any" id="lat" name="lat" readonly />
              <label for="lon">Longitude</label>
              <input type="number" step="any" id="lon" name="lon" readonly />
            </div>
            <button type="button" class="btn btn-secondary btn-sm" id="btn-clear-location">Hapus Lokasi</button>
          </div>

          <div id="add-error" class="error-message" role="alert"></div>
          <button type="submit" class="btn btn-primary" id="add-button">Kirim Cerita</button>
        </form>
      </section>
    `;
  }

  initMap() {
    const mapContainer = document.querySelector('#add-story-map');
    if (!mapContainer) return;

    this.map = L.map('add-story-map').setView([-2.5489, 118.0149], 4);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);

    this.map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      document.querySelector('#lat').value = lat;
      document.querySelector('#lon').value = lng;

      if (this.marker) {
        this.marker.setLatLng(e.latlng);
      } else {
        this.marker = L.marker(e.latlng).addTo(this.map);
      }
    });

    document.querySelector('#btn-clear-location').addEventListener('click', () => {
      document.querySelector('#lat').value = '';
      document.querySelector('#lon').value = '';
      if (this.marker) {
        this.map.removeLayer(this.marker);
        this.marker = null;
      }
    });
  }

  initCamera() {
    const video = document.querySelector('#camera-video');
    const canvas = document.querySelector('#camera-canvas');
    const btnCapture = document.querySelector('#btn-capture');
    const btnCameraMode = document.querySelector('#btn-camera-mode');
    const btnUploadMode = document.querySelector('#btn-upload-mode');
    const cameraContainer = document.querySelector('#camera-container');
    const uploadContainer = document.querySelector('#upload-container');
    const preview = document.querySelector('#photo-preview');

    btnCameraMode.addEventListener('click', async () => {
      uploadContainer.style.display = 'none';
      cameraContainer.style.display = 'block';
      try {
        this.mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = this.mediaStream;
      } catch (err) {
        alert('Kamera tidak tersedia atau akses ditolak.');
        btnUploadMode.click();
      }
    });

    btnUploadMode.addEventListener('click', () => {
      cameraContainer.style.display = 'none';
      uploadContainer.style.display = 'block';
      this.stopCamera();
    });

    btnCapture.addEventListener('click', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        this.capturedPhotoBlob = blob;
        preview.src = URL.createObjectURL(blob);
        preview.style.display = 'block';
        this.stopCamera();
        cameraContainer.style.display = 'none';
        btnUploadMode.click();
      }, 'image/jpeg');
    });
  }

  initPhotoUpload() {
    const fileInput = document.querySelector('#photo');
    const preview = document.querySelector('#photo-preview');
    
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        this.capturedPhotoBlob = null;
        preview.src = URL.createObjectURL(file);
        preview.style.display = 'block';
      }
    });
  }

  stopCamera() {
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach(track => track.stop());
      this.mediaStream = null;
    }
  }

  getFormData() {
    const description = document.querySelector('#description').value;
    const lat = document.querySelector('#lat').value;
    const lon = document.querySelector('#lon').value;
    const fileInput = document.querySelector('#photo');

    const formData = new FormData();
    formData.append('description', description);
    
    if (lat && lon) {
      formData.append('lat', lat);
      formData.append('lon', lon);
    }

    if (this.capturedPhotoBlob) {
      formData.append('photo', this.capturedPhotoBlob, 'camera-photo.jpg');
    } else if (fileInput.files.length > 0) {
      formData.append('photo', fileInput.files[0]);
    } else {
      throw new Error('Pilih foto terlebih dahulu.');
    }

    return formData;
  }

  bindSubmitEvent(handler) {
    const form = document.querySelector('#add-story-form');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      try {
        const formData = this.getFormData();
        handler(formData);
      } catch (error) {
        this.showError(error.message);
      }
    });
  }

  showLoading() {
    const btn = document.querySelector('#add-button');
    btn.disabled = true;
    btn.textContent = 'Mengirim...';
  }

  hideLoading() {
    const btn = document.querySelector('#add-button');
    btn.disabled = false;
    btn.textContent = 'Kirim Cerita';
  }

  showError(message) {
    const errorEl = document.querySelector('#add-error');
    errorEl.textContent = message;
    errorEl.style.display = 'block';
  }

  hideError() {
    const errorEl = document.querySelector('#add-error');
    errorEl.style.display = 'none';
  }
  
  navigate(url) {
    window.location.hash = url;
  }
}

export default AddStoryView;
