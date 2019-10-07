const processbar = document.querySelector('.progress');

const presentr = new Presentr({
    slides: '.presentr .slides > section',
    onAction(opt) {
        processbar.style.width = `${(100 * opt.slidePercent)}vw`;
    }
});

