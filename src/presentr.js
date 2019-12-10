import assignDeep from './utils/assign-deep';
import {off, on}  from './utils/event-listener';

class Presentr {

    constructor(opt = {}) {
        this._options = assignDeep({

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
        }, opt);

        // Initialization state
        const queryAll = (query, base) => Array.from(base.querySelectorAll(query));

        // Slides stuff
        this._slideIndex = null;
        this._slides = queryAll(this._options.slides, document);

        // Fragments stuff
        this._fragmentIndex = 0;

        // Event-listener
        this._boundEventListener = {
            'slide': [],
            'beforeSlide': [],
            'fragment': [],
            'beforeFragment': [],
            'action': []
        };

        // Resolve groups
        const {fragmentGroupPrefix} = this._options;
        this._fragments = this._slides.map(s => {
            const groups = {};
            const frags = [];
            const fg = queryAll(this._options.fragments, s);

            // Cluster elements which are grouped
            let gindex = 0; // Index ignoring the total amoun of fragments
            for (let i = 0; i < fg.length; i++) {
                const fragment = fg[i];
                const group = Array.from(fragment.classList)
                    .find(v => v.startsWith(fragmentGroupPrefix));

                if (group) {
                    if (group in groups) {

                        frags[groups[group]].push(fragment);
                    } else {
                        groups[group] = gindex;
                        frags.push([fragment]);
                        gindex++;
                    }
                } else {
                    frags.push([fragment]);
                    gindex++;
                }
            }

            return frags;
        });

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
        this.jumpSlide(this._options.slideIndex);
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
        const {_slides, _fragments, _options} = this;

        // Validate
        if (index < 0 || index >= _slides.length) {
            return false;
        }

        if (!this._emit('beforeSlide', {
            from: this._slideIndex,
            to: index
        })) return;

        const {classes} = _options;
        for (let i = 0; i < _slides.length; i++) {
            const classl = _slides[i].classList;

            if (i === index) {
                classl.add(classes.currentSlide);
                classl.remove(classes.previousSlide);
                classl.remove(classes.nextSlide);
            } else if (i < index) {
                classl.remove(classes.currentSlide);
                classl.add(classes.previousSlide);
            } else if (i > index) {
                classl.remove(classes.currentSlide);
                classl.add(classes.nextSlide);
            }
        }

        // Apply index
        this._slideIndex = index;

        // Update fragment index
        this._fragmentIndex = _fragments[index].reduce((ac, groups, ci) => {
            const containsActiveFragment = groups.find(el => el.classList.contains(classes.activeFragment));
            return containsActiveFragment ? ci + 1 : ac;
        }, 0);

        // Fire event
        this._emit('slide');
        this._emit('action');
        return true;
    }

    nextFragment() {
        this.jumpFragment(this._fragmentIndex + 1);
    }

    previousFragment() {
        this.jumpFragment(this._fragmentIndex - 1);
    }

    jumpFragment(index) {
        const fragments = this._fragments[this._slideIndex];

        if (!this._emit('beforeFragment', {
            from: this._fragmentIndex,
            to: index
        })) return;

        // Jump to next / previous slide if no further fragments
        if (index < 0) {
            return this.previousSlide();
        } else if (index > fragments.length) {
            return this.nextSlide();
        }

        // Apply class for previous and current fragment(s)
        this._fragmentIndex = index;
        const {activeFragment, currentFragment} = this._options.classes;
        for (let i = 0, group; i < fragments.length && (group = fragments[i]); i++) {
            const afAction = i < index ? 'add' : 'remove';
            const cfAction = i === index - 1 ? 'add' : 'remove';

            // Apply classes to groups
            for (let j = 0, cl; j < group.length && (cl = group[j].classList); j++) {
                cl[afAction](activeFragment);

                // Prevent removing a class-name which got used for both active and current fragmentsl
                if (activeFragment !== currentFragment) {
                    cl[cfAction](currentFragment);
                }
            }
        }

        // Fire event
        this._emit('fragment');
        this._emit('action');
        return true;
    }

    destroy() {

        // Unbind event-listeners
        this._eventListeners.forEach(args => off(...args));
    }

    get totalSlides() {
        return this._slides.length - 1;
    }

    get globalFragmentCount() {
        return this._fragments.reduce((acc, cv) => acc + cv.length, 0);
    }

    get totalFragments() {
        return this._fragments[this._slideIndex].length - 1;
    }

    get slideIndex() {
        return this._slideIndex;
    }

    get fragmentIndex() {
        return this._fragmentIndex;
    }
}

// Export version
Presentr.version = VERSION;

// Export factory function
export default Presentr;
