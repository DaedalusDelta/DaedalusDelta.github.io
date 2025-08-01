document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.blog-card').forEach(card => {
    const video = card.querySelector('video.card-video');
    if (!video) return;

    // Play on hover
    card.addEventListener('mouseenter', () => {
      video.play().catch(()=>{});  // ignore any play-promise errors
    });
    // Pause (and rewind) on leave
    card.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
    });
  });
});
