/* Masonry Gallery & Lightbox Controller */
document.addEventListener('DOMContentLoaded', () => {
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const galleryGrid = document.getElementById('gallery-grid');
  const photoUploader = document.getElementById('photo-upload-input');

  // Key for local storage
  const STORAGE_KEY = 'akka_uploaded_gallery_photos';

  // Load photos from LocalStorage
  function getStoredPhotos() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch(e) {
      console.error("Could not load photos", e);
      return [];
    }
  }

  function savePhotos(photos) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
    } catch(e) {
      console.warn("Storage size limit reached for images", e);
      alert("Note: Image saved for this session. For permanent storage, keep images under 2MB each.");
    }
  }

  // Render Gallery
  function renderGallery() {
    if (!galleryGrid) return;
    const photos = getStoredPhotos();

    galleryGrid.innerHTML = '';

    if (photos.length === 0) {
      // Empty state box
      const emptyState = document.createElement('div');
      emptyState.style.gridColumn = '1 / -1';
      emptyState.style.textAlign = 'center';
      emptyState.style.padding = '60px 20px';
      emptyState.style.borderRadius = '24px';
      emptyState.className = 'glass-panel';
      emptyState.innerHTML = `
        <div style="font-size: 3.2rem; margin-bottom: 15px;">📸</div>
        <h3 style="font-size: 1.5rem; color: #4a2840; margin-bottom: 10px;">Your Gallery is Empty</h3>
        <p style="color: var(--text-muted); font-size: 1rem; max-width: 450px; margin: 0 auto;">
          Click the <strong>"📷 Add / Replace Photos"</strong> button above to upload your favorite memories with Akka!
        </p>
      `;
      galleryGrid.appendChild(emptyState);
      return;
    }

    photos.forEach((photoData, index) => {
      const card = document.createElement('div');
      card.className = 'glass-panel gallery-card';
      card.innerHTML = `
        <img src="${photoData.src}" alt="${photoData.title || 'Sister Memory'}" />
        <button class="gallery-delete-btn" title="Delete Photo" data-index="${index}">🗑️</button>
        <div class="gallery-card-overlay">
          <h3>${photoData.title || 'Precious Memory ❤️'}</h3>
          <p>Click to expand</p>
        </div>
      `;

      // Lightbox Click
      card.addEventListener('click', (e) => {
        if (e.target.classList.contains('gallery-delete-btn')) return;
        if (lightboxImg && lightboxModal) {
          lightboxImg.src = photoData.src;
          lightboxModal.classList.add('active');
        }
      });

      // Delete Photo Click
      const deleteBtn = card.querySelector('.gallery-delete-btn');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          deletePhoto(index);
        });
      }

      galleryGrid.appendChild(card);
    });
  }

  function deletePhoto(index) {
    const photos = getStoredPhotos();
    photos.splice(index, 1);
    savePhotos(photos);
    renderGallery();
  }

  // Handle Lightbox Close
  if (lightboxClose) {
    lightboxClose.addEventListener('click', () => {
      if (lightboxModal) lightboxModal.classList.remove('active');
    });
  }

  if (lightboxModal) {
    lightboxModal.addEventListener('click', (e) => {
      if (e.target === lightboxModal) {
        lightboxModal.classList.remove('active');
      }
    });
  }

  // Handle Photo Upload Input
  if (photoUploader) {
    photoUploader.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      if (files.length === 0) return;

      const currentPhotos = getStoredPhotos();
      let processed = 0;

      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(evt) {
          currentPhotos.unshift({
            src: evt.target.result,
            title: file.name.replace(/\.[^/.]+$/, "") || 'Special Memory ❤️'
          });
          processed++;

          if (processed === files.length) {
            savePhotos(currentPhotos);
            renderGallery();
            if (window.confettiEngine) {
              window.confettiEngine.spawn(80);
            }
          }
        };
        reader.readAsDataURL(file);
      });

      photoUploader.value = '';
    });
  }

  // Initial render
  renderGallery();
});
