/* Interactive Birthday Cake Handler */
document.addEventListener('DOMContentLoaded', () => {
  const cakeContainer = document.getElementById('interactive-cake');
  const cakeHint = document.getElementById('cake-hint');
  const flames = document.querySelectorAll('.candle-flame');
  let candlesLit = flames.length;

  if (!cakeContainer) return;

  function blowOutCandle(flame) {
    if (flame.classList.contains('blown-out')) return;

    flame.classList.add('blown-out');
    candlesLit--;

    // Trigger sparkler confetti burst near cake
    if (window.confettiEngine) {
      window.confettiEngine.spawn(40);
    }

    if (candlesLit <= 0) {
      if (cakeHint) {
        cakeHint.innerText = '🎂 Yay! Make a wish! Happy Birthday Akka! ✨';
        cakeHint.style.color = '#d44d75';
        cakeHint.style.fontWeight = '700';
      }

      // Fireworks celebration!
      if (window.fireworksEngine) {
        window.fireworksEngine.triggerMultiple(6);
      }
    }
  }

  cakeContainer.addEventListener('click', (e) => {
    // If user clicks anywhere on cake, blow out a candle or all candles
    const unlit = Array.from(flames).filter(f => !f.classList.contains('blown-out'));
    if (unlit.length > 0) {
      blowOutCandle(unlit[0]);
    } else {
      // Relight for fun!
      flames.forEach(f => f.classList.remove('blown-out'));
      candlesLit = flames.length;
      if (cakeHint) {
        cakeHint.innerText = '✨ Tap the cake to blow out candles! 🎂';
      }
    }
  });
});
