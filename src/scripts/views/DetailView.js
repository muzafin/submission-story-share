class DetailView {
  constructor() {}

  render() {
    return `
      <section class="detail-section">
        <h1>Detail Cerita</h1>
        <div id="detail-content" class="detail-content" tabindex="0" aria-label="Konten detail cerita">
          <p>Loading...</p>
        </div>
      </section>
    `;
  }

  renderStory(story) {
    const container = document.querySelector('#detail-content');
    container.innerHTML = `
      <div class="story-detail-card">
        <img src="${story.photoUrl}" alt="Foto dari ${story.name}" class="story-detail-img" />
        <div class="story-detail-info">
          <h2>${story.name}</h2>
          <p class="story-date">${new Date(story.createdAt).toLocaleDateString()}</p>
          <p class="story-desc">${story.description}</p>
        </div>
      </div>
    `;
  }

  showError(message) {
    const container = document.querySelector('#detail-content');
    container.innerHTML = `<p class="error-message">${message}</p>`;
  }
}

export default DetailView;
