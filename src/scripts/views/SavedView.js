class SavedView {
  render() {
    return `
      <section class="saved-section" style="max-width: 800px; margin: 0 auto; padding: 2rem 0;">
        <h1>Cerita Tersimpan</h1>
        <div class="story-list-container" id="saved-story-list" tabindex="0" aria-label="Daftar Cerita Tersimpan" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1rem;">
          <p>Loading...</p>
        </div>
      </section>
    `;
  }

  renderStories(stories, onDeleteClick) {
    const listContainer = document.querySelector('#saved-story-list');
    listContainer.innerHTML = '';
    
    if (stories.length === 0) {
      listContainer.innerHTML = '<p>Belum ada cerita yang disimpan.</p>';
      return;
    }

    stories.forEach((story) => {
      const article = document.createElement('article');
      article.classList.add('story-card');
      article.style.position = 'relative';
      article.innerHTML = `
        <img src="${story.photoUrl}" alt="Foto dari ${story.name}" class="story-img" />
        <div class="story-info">
          <div style="display: flex; justify-content: space-between; align-items: start;">
            <h3>${story.name}</h3>
            <button class="btn btn-sm btn-delete-saved" data-id="${story.id}" style="background-color: #f44336; color: white; border: none; padding: 4px 8px; border-radius: 4px; cursor: pointer;">Hapus</button>
          </div>
          <p class="story-date">${new Date(story.createdAt).toLocaleDateString()}</p>
          <p class="story-desc">${story.description.slice(0, 100)}...</p>
        </div>
      `;
      
      const deleteBtn = article.querySelector('.btn-delete-saved');
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        onDeleteClick(story.id);
      });
      
      listContainer.appendChild(article);
    });
  }

  showError(message) {
    const listContainer = document.querySelector('#saved-story-list');
    listContainer.innerHTML = `<p class="error-message">${message}</p>`;
  }
}

export default SavedView;
