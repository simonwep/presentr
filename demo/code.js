const processbar = document.querySelector('.progress');
const presentr = new Presentr({
    onSlide(opt) {
        processbar.style.width = `${(100 * opt.slidePercent)}vw`;
    }
});