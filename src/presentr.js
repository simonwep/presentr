import assignDeep  from './utils/assign-deep';
import {off, on}   from './utils/event-listener';
import {queryAll}  from './utils/query-all';
import {wrapArray} from './utils/wrap-array';

class Presentr {

    // Current slide-index
    _slideIndex = 0;

    // Event-listener
    _boundEventListener = {
        'slide': [],
        'beforeSlide': [],
        'fragment': [],
        'beforeFragment': [],
        'action': []
    };

    _options = {

        // Query selectors
        slides: '.presentr .slides > section',
        fragments: '.frag',

        // CSS Group prefix
        fragmentGroupPrefix: 'g-',

        // Start index
        slideIndex: 0,

        // CSS classes
        classes: {
            previousSlide: 'previous-slide',
            nextSlide: 'next-slide',
            currentSlide: 'current-slide',
            activeFragment: 'active-frag',
            currentFragment: 'current-frag'
        },

        // Keyboard shortcuts
        shortcuts: {
            nextSlide: ['d', 'D'],
            previousSlide: ['a', 'A'],

            firstSlide: ['y', 'Y'],
            lastSlide: ['x', 'X'],

            nextFragment: ['ArrowRight', 'ArrowDown'],
            previousFragment: ['ArrowLeft', 'ArrowUp']
        }
    };

    constructor(opt = {}) {

        // Override default options
        assignDeep(this._options, opt);

        // Resolve slides and their fragments
        const {fragmentGroupPrefix} = this._options;
        const slides = queryAll(this._options.slides, document);

        this._slides = [];
        for (const slideElement of slides) {
            const groupIndexes = new Map();
            const fragments = queryAll(this._options.fragments, slideElement)
                .map(v => [v]);

            for (let i = 0; i < fragments.length; i++) {
                const group = Array.from(fragments[i][0].classList)
                    .find(v => v.startsWith(fragmentGroupPrefix));

                if (group) {
                    if (groupIndexes.has(group)) {
                        const [arr] = fragments.splice(i, 1);
                        fragments[groupIndexes.get(group)].push(arr[0]);
                        i--;
                    } else {
                        groupIndexes.set(group, i);
                    }
                }
            }

            this._slides.push({
                el: slideElement,
                fragments,
                fragmentIndex: 0
            });
        }

        // Bind shortcuts
        this._eventListeners = [

            // Listen for key-events
            on(window, 'keyup', e => {
                const match = cv => cv === e.code || cv === e.key;
                const {shortcuts} = this._options;
                const fns = ['nextSlide', 'previousSlide', 'lastSlide', 'firstSlide', 'nextFragment', 'previousFragment']; // Available shortcuts

                // Find corresponding shortcut action
                const target = Object.keys(shortcuts).find(v => {
                    const code = shortcuts[v];
                    return Array.isArray(code) ? code.find(match) : match(code);
                });

                // Check shortcut was found and execute function
                target && fns.includes(target) && this[target]();
            }),

            // Listen for touch-events
            on(window, 'touchstart', e => {
                const x = e && e.touches && e.touches[0] && e.touches[0].clientX;
                const halfWidth = window.innerWidth / 2;
                x > halfWidth ? this.nextFragment() : this.previousFragment();
            })
        ];

        // Trigger
        this.jumpSlide(this._options.slideIndex || 0);
    }

    /* eslint-disable callback-return */
    _emit(event, args = {}) {
        for (const cb of this._boundEventListener[event]) {
            if (cb({
                presentr: this,
                ...args
            }) === false) {
                return false;
            }
        }

        return true;
    }

    on(event, cb) {

        if (!(event in this._boundEventListener)) {
            throw new Error(`No such event: ${event}`);
        } else if (typeof cb !== 'function') {
            throw new Error(`Callback must be a function`);
        }

        this._boundEventListener[event].push(cb);
        return this;
    }

    off(event, cb) {
        const callBacks = this._boundEventListener[event];

        if (callBacks) {
            const index = callBacks.indexOf(cb);

            if (~index) {
                callBacks.splice(index, 1);
            }
        }

        return this;
    }

    firstSlide() {
        this.jumpSlide(0);
    }

    lastSlide() {
        this.jumpSlide(this._slides.length - 1);
    }

    nextSlide() {
        this.jumpSlide(this._slideIndex + 1);
    }

    previousSlide() {
        this.jumpSlide(this._slideIndex - 1);
    }

    jumpSlide(index) {
        const {_slides, _options} = this;

        // Validate
        if (index < 0 || index >= _slides.length) {
            return false;
        }

        if (!this._emit('beforeSlide', {
            from: this._slideIndex,
            to: index
        })) return;

        const {classes} = _options;
        const cs = wrapArray(classes.currentSlide);
        const ps = wrapArray(classes.previousSlide);
        const ns = wrapArray(classes.nextSlide);

        for (let i = 0; i < _slides.length; i++) {
            const classl = _slides[i].el.classList;

            if (i === index) {
                classl.remove(...ps);
                classl.remove(...ns);
                classl.add(...cs);
            } else if (i < index) {
                classl.remove(...cs);
                classl.add(...ps);
            } else if (i > index) {
                classl.remove(...cs);
                classl.add(...ns);
            }
        }

        // Apply index
        this._slideIndex = index;

        // Fire event
        this._emit('slide');
        this._emit('action');
        return true;
    }

    nextFragment() {
        this.jumpFragment(this._currentSlide.fragmentIndex + 1);
    }

    previousFragment() {
        this.jumpFragment(this._currentSlide.fragmentIndex - 1);
    }

    jumpFragment(index) {
        const slide = this._currentSlide;

        if (!this._emit('beforeFragment', {
            from: slide.fragmentIndex,
            to: index
        })) return;

        // Jump to next / previous slide if no further fragments
        if (index < 0) {
            return this.previousSlide();
        } else if (index > slide.fragments.length) {
            return this.nextSlide();
        }

        slide.fragmentIndex = index;

        // Apply class for previous and current fragment(s)
        const {activeFragment, currentFragment} = this._options.classes;
        const {fragments} = slide;

        const af = wrapArray(activeFragment);
        const cf = wrapArray(currentFragment);
        for (let i = 0; i < fragments.length; i++) {
            for (const sf of fragments[i]) {
                sf.classList.remove(...cf);
                sf.classList.remove(...af);

                if (i < (index - 1)) {
                    sf.classList.add(...af);
                } else if (i === (index - 1)) {
                    sf.classList.add(...af);
                    sf.classList.add(...cf);
                }
            }
        }

        // Fire events
        this._emit('fragment');
        this._emit('action');
        return true;
    }

    destroy() {

        // Unbind event-listeners
        this._eventListeners.forEach(args => off(...args));
    }

    get _currentSlide() {
        return this._slides[this._slideIndex];
    }

    get totalSlides() {
        return this._slides.length;
    }

    get globalFragmentCount() {
        return this._slides.reduce((acc, cv) => acc + cv.fragments.length, 0);
    }

    get totalFragments() {
        return this._currentSlide.fragments.length;
    }

    get slideIndex() {
        return this._slideIndex;
    }

    get fragmentIndex() {
        return this._currentSlide.fragmentIndex;
    }
}

// Export version
Presentr.version = VERSION;

// Export factory function
export default Presentr;
