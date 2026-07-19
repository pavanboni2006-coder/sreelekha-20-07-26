/* Music Player & Custom MP3 Playlist Controller */
class BirthdayAudioPlayer {
  constructor() {
    this.isPlaying = false;
    this.audioElement = new Audio();
    this.audioElement.loop = false;
    
    // Playlist is empty by default
    this.playlist = [];
    this.currentTrackIndex = -1;

    this.toggleBtn = document.getElementById('music-toggle');
    this.initListeners();
  }

  initListeners() {
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.togglePlay());
    }

    // Audio end listener to automatically play next track in user's playlist
    this.audioElement.addEventListener('ended', () => {
      if (this.playlist.length > 0) {
        let nextIndex = (this.currentTrackIndex + 1) % this.playlist.length;
        this.playTrack(nextIndex);
      } else {
        this.pause();
      }
    });

    // User MP3 file uploader
    const musicUploader = document.getElementById('music-file-input');
    if (musicUploader) {
      musicUploader.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
          if (file && file.type.startsWith('audio/')) {
            const fileURL = URL.createObjectURL(file);
            this.playlist.push({
              id: Date.now() + Math.random(),
              title: file.name.replace(/\.[^/.]+$/, ""),
              duration: "Uploaded Song",
              src: fileURL
            });
          }
        });

        this.updatePlaylistUI();

        // Auto-play first song if not currently playing
        if (!this.isPlaying && this.playlist.length > 0 && this.currentTrackIndex === -1) {
          this.playTrack(0);
        }
      });
    }
  }

  togglePlay() {
    if (this.playlist.length === 0) {
      alert("Please click '🎶 Add Song (.mp3)' to upload your favorite songs first!");
      return;
    }

    if (this.isPlaying) {
      this.pause();
    } else {
      if (this.currentTrackIndex === -1) {
        this.playTrack(0);
      } else {
        this.play();
      }
    }
  }

  play() {
    if (this.playlist.length === 0 || this.currentTrackIndex < 0) return;
    const currentTrack = this.playlist[this.currentTrackIndex];

    if (currentTrack && currentTrack.src) {
      if (this.audioElement.src !== currentTrack.src) {
        this.audioElement.src = currentTrack.src;
      }
      this.audioElement.play().then(() => {
        this.isPlaying = true;
        if (this.toggleBtn) {
          this.toggleBtn.classList.add('playing');
          this.toggleBtn.innerHTML = '🎵';
          this.toggleBtn.title = "Pause Music";
        }
        this.updatePlaylistUI();
      }).catch(err => {
        console.log('Playback notice:', err);
      });
    }
  }

  pause() {
    this.isPlaying = false;
    if (this.toggleBtn) {
      this.toggleBtn.classList.remove('playing');
      this.toggleBtn.innerHTML = '🎶';
      this.toggleBtn.title = "Play Music";
    }
    if (this.audioElement) {
      this.audioElement.pause();
    }
    this.updatePlaylistUI();
  }

  playTrack(index) {
    if (index < 0 || index >= this.playlist.length) return;
    this.currentTrackIndex = index;
    const currentTrack = this.playlist[index];
    this.audioElement.src = currentTrack.src;
    this.play();
  }

  deleteTrack(index) {
    if (index === this.currentTrackIndex) {
      this.pause();
      this.audioElement.src = '';
      this.currentTrackIndex = -1;
    } else if (index < this.currentTrackIndex) {
      this.currentTrackIndex--;
    }
    this.playlist.splice(index, 1);
    if (this.playlist.length === 0) {
      this.currentTrackIndex = -1;
    }
    this.updatePlaylistUI();
  }

  updatePlaylistUI() {
    const playlistContainer = document.getElementById('playlist-container');
    if (!playlistContainer) return;

    playlistContainer.innerHTML = '';

    if (this.playlist.length === 0) {
      const emptyCard = document.createElement('div');
      emptyCard.className = 'glass-panel';
      emptyCard.style.gridColumn = '1 / -1';
      emptyCard.style.textAlign = 'center';
      emptyCard.style.padding = '40px 20px';
      emptyCard.style.borderRadius = '22px';
      emptyCard.innerHTML = `
        <div style="font-size: 2.8rem; margin-bottom: 10px;">🎵</div>
        <h4 style="font-size: 1.3rem; color: #4a2840; margin-bottom: 8px;">No Songs Added Yet</h4>
        <p style="color: var(--text-muted); font-size: 0.95rem; max-width: 400px; margin: 0 auto;">
          Click the <strong>"🎶 Add Song (.mp3)"</strong> button above to add your sister's favorite songs!
        </p>
      `;
      playlistContainer.appendChild(emptyCard);
      return;
    }

    this.playlist.forEach((track, index) => {
      const isCurrent = index === this.currentTrackIndex;
      const card = document.createElement('div');
      card.className = `glass-panel track-card ${isCurrent ? 'active' : ''}`;
      card.style.position = 'relative';
      card.innerHTML = `
        <div class="track-icon">${isCurrent && this.isPlaying ? '▶️' : '🎵'}</div>
        <div class="track-info" style="flex: 1;">
          <h4>${track.title}</h4>
          <p>${track.duration}</p>
        </div>
        <button class="track-delete-btn" title="Remove song" style="background: transparent; border: none; font-size: 1.1rem; cursor: pointer; opacity: 0.7; transition: opacity 0.2s;" data-index="${index}">🗑️</button>
      `;

      card.addEventListener('click', (e) => {
        if (e.target.classList.contains('track-delete-btn')) return;
        this.playTrack(index);
      });

      const delBtn = card.querySelector('.track-delete-btn');
      if (delBtn) {
        delBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.deleteTrack(index);
        });
      }

      playlistContainer.appendChild(card);
    });
  }
}

window.birthdayAudio = new BirthdayAudioPlayer();
document.addEventListener('DOMContentLoaded', () => {
  if (window.birthdayAudio) {
    window.birthdayAudio.updatePlaylistUI();
  }
});
