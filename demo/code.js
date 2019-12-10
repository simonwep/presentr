const processbar = document.querySelector('.progress');

const presentr = new Presentr({
    slides: '.presentr .slides > section'
}).on('action', () => {
    processbar.style.width = `${(100 * (presentr.slideIndex / presentr.totalSlides))}vw`;
});
