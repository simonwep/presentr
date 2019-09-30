const processbar = document.querySelector('.progress');

const presentr = new Presentr({
    onAction(opt) {
        processbar.style.width = `${(100 * opt.slidePercent)}vw`;
    }
});

