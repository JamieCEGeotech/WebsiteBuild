document.addEventListener("DOMContentLoaded", function() {
    const faders = document.querySelectorAll('.fade-in');
    const appearOptions = { threshold: 0.15 };
    const appearOnScroll = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                entry.target.classList.remove('visible');
            }
        });
    }, appearOptions);

    faders.forEach(fader => {
        appearOnScroll.observe(fader);
    });
});