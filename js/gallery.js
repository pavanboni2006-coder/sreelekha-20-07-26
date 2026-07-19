/* Pure Static Gallery Controller — Compatible with Vercel, Netlify, and GitHub Pages */
document.addEventListener('DOMContentLoaded', () => {
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.getElementById('lightbox-close');
  const galleryGrid = document.getElementById('gallery-grid');
  const addPhotoBtn = document.getElementById('add-photo-btn');
  const photoUploader = document.getElementById('photo-upload-input');
  const gallerySection = document.getElementById('gallery');

  const STORAGE_KEY = 'akka_client_gallery_photos';

  // Local Storage helper for persistent client photos
  function getClientPhotos() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch(e) {
      return [];
    }
  }

  function saveClientPhoto(photoObj) {
    try {
      const existing = getClientPhotos();
      existing.unshift(photoObj);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, 25)));
    } catch(e) {
      console.warn("Client storage full", e);
    }
  }

  function deleteClientPhoto(id) {
    try {
      const filtered = getClientPhotos().filter(p => p.id !== id && p.src !== id && p.path !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch(e) {}
  }

  // Load photos list from static public/assets/manifest.json and client storage
  async function fetchGalleryPhotos() {
    let manifestPhotos = [];

    try {
      const res = await fetch('public/assets/manifest.json?t=' + Date.now());
      if (res.ok) {
        const data = await res.json();
        manifestPhotos = data.photos || [];
      }
    } catch (e) {}

    const clientPhotos = getClientPhotos();

    // Combine manifest photos and client photos without duplicates
    const combined = [...manifestPhotos];
    clientPhotos.forEach(cp => {
      if (!combined.some(mp => (mp.path === cp.path || mp.src === cp.src || mp.id === cp.id))) {
        combined.push(cp);
      }
    });

    return combined;
  }

  // Render Gallery items
  async function renderGallery() {
    if (!galleryGrid) return;
    const photos = await fetchGalleryPhotos();

    galleryGrid.innerHTML = '';

    if (photos.length === 0) {
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

    photos.forEach((photoData) => {
      const card = document.createElement('div');
      card.className = 'glass-panel gallery-card';
      const imagePath = photoData.src || photoData.path || `public/assets/images/${photoData.filename}`;

      card.innerHTML = `
        <img src="${imagePath}" alt="${photoData.title || 'Sister Memory'}" />
        <button class="gallery-delete-btn" title="Delete Photo" data-id="${photoData.id || imagePath}">🗑️</button>
        <div class="gallery-card-overlay">
          <h3>${photoData.title || 'Precious Memory ❤️'}</h3>
          <p>Click to view full screen</p>
        </div>
      `;

      // Lightbox click
      card.addEventListener('click', (e) => {
        if (e.target.classList.contains('gallery-delete-btn')) return;
        if (lightboxImg && lightboxModal) {
          lightboxImg.src = imagePath;
          lightboxModal.classList.add('active');
        }
      });

      // Delete click
      const deleteBtn = card.querySelector('.gallery-delete-btn');
      if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          deleteClientPhoto(photoData.id || imagePath);
          renderGallery();
        });
      }

      galleryGrid.appendChild(card);
    });
  }

  // Canvas Image Compression helper (resizes images up to 10MB to ~1200px Data URLs)
  function compressImage(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 1200;
          let w = img.width;
          let h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) { h = Math.round((h * maxDim) / w); w = maxDim; }
            else { w = Math.round((w * maxDim) / h); h = maxDim; }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  }

  // File Upload Handler
  async function handleFiles(files) {
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    let successCount = 0;

    for (const file of fileList) {
      const compressedDataUrl = await compressImage(file);
      if (!compressedDataUrl) continue;

      const photoObj = {
        id: 'photo_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
        src: compressedDataUrl,
        path: `public/assets/images/${file.name}`
      };

      saveClientPhoto(photoObj);
      successCount++;
    }

    if (successCount > 0) {
      await renderGallery();
      if (window.confettiEngine) {
        window.confettiEngine.spawn(100);
      }
    }
  }

  // Trigger file selection
  if (addPhotoBtn && photoUploader) {
    addPhotoBtn.addEventListener('click', (e) => {
      photoUploader.click();
    });
  }

  if (photoUploader) {
    photoUploader.addEventListener('change', (e) => {
      handleFiles(e.target.files);
      photoUploader.value = '';
    });
  }

  // Drag & drop support
  if (gallerySection) {
    gallerySection.addEventListener('dragover', (e) => {
      e.preventDefault();
      gallerySection.style.border = '2px dashed var(--primary-pink)';
    });

    gallerySection.addEventListener('dragleave', (e) => {
      e.preventDefault();
      gallerySection.style.border = 'none';
    });

    gallerySection.addEventListener('drop', (e) => {
      e.preventDefault();
      gallerySection.style.border = 'none';
      if (e.dataTransfer && e.dataTransfer.files) {
        handleFiles(e.dataTransfer.files);
      }
    });
  }

  // Lightbox close handlers
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

  // Initial render on page load
  renderGallery();
});
