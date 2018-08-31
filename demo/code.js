const processbar = document.querySelector('.progress');

const presentr = new Presentr({
    onAction(opt) {
        processbar.style.width = `${(100 * opt.slidePercent)}vw`;
    }
});

window.addEventListener('touchstart', e => {
    const x = e && e.touches && e.touches[0] && e.touches[0].clientX;
    const halfWidth = window.innerWidth / 2;
    x > halfWidth ? presentr.nextFragment() : presentr.previousFragment();
});