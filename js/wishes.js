/* Wishes Wall Controller & LocalStorage Store */
document.addEventListener('DOMContentLoaded', () => {
  const wishesGrid = document.getElementById('wishes-grid');
  const addWishBtn = document.getElementById('add-wish-btn');
  const wishModal = document.getElementById('wish-modal');
  const wishModalClose = document.getElementById('wish-modal-close');
  const wishForm = document.getElementById('wish-form');

  // Initial preset wishes
  const defaultWishes = [
    { text: "Happy Birthday Akka! Wishing you endless joy, love and health! 🎉", author: "Amma & Nanna ❤️" },
    { text: "To the best sister ever, thank you for always inspiring me! Stay blessed! ✨", author: "Your Sweet Sister 🌸" },
    { text: "May all your dreams come true this year! Have a fantastic birthday! 🎂", author: "Family & Loved Ones 💕" }
  ];

  function loadWishes() {
    const saved = localStorage.getItem('akka_birthday_wishes');
    const wishes = saved ? JSON.parse(saved) : defaultWishes;
    renderWishes(wishes);
  }

  function renderWishes(wishes) {
    if (!wishesGrid) return;
    wishesGrid.innerHTML = '';
    wishes.forEach(w => {
      const card = document.createElement('div');
      card.className = 'glass-panel wish-card';
      card.innerHTML = `
        <p>"${w.text}"</p>
        <div class="wish-author">— ${w.author}</div>
      `;
      wishesGrid.appendChild(card);
    });
  }

  function saveWish(newWish) {
    const saved = localStorage.getItem('akka_birthday_wishes');
    const wishes = saved ? JSON.parse(saved) : defaultWishes;
    wishes.unshift(newWish);
    localStorage.setItem('akka_birthday_wishes', JSON.stringify(wishes));
    renderWishes(wishes);

    if (window.confettiEngine) {
      window.confettiEngine.spawn(60);
    }
  }

  if (addWishBtn && wishModal) {
    addWishBtn.addEventListener('click', () => wishModal.classList.add('active'));
  }

  if (wishModalClose && wishModal) {
    wishModalClose.addEventListener('click', () => wishModal.classList.remove('active'));
  }

  if (wishModal) {
    wishModal.addEventListener('click', (e) => {
      if (e.target === wishModal) wishModal.classList.remove('active');
    });
  }

  if (wishForm) {
    wishForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const nameInput = document.getElementById('wish-author-input');
      const textInput = document.getElementById('wish-text-input');

      if (nameInput.value.trim() && textInput.value.trim()) {
        saveWish({
          author: nameInput.value.trim(),
          text: textInput.value.trim()
        });
        nameInput.value = '';
        textInput.value = '';
        wishModal.classList.remove('active');
      }
    });
  }

  loadWishes();
});
