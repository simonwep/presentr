import assignDeep from './utils/assignDeep';
import {off, on}  from './utils/eventListener';

function Presentr(opt = {}) {

    const that = {

        // Assign default options
        options: assignDeep({

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
            },

            // Event listeners
            onInit: () => 0,
            onSlide: () => 0,
            onFragment: () => 0,
            onAction: () => 0

        }, opt),

        _init() {

            // Initialization state
            that._initActive = true;
            const queryAll = (query, base) => Array.from(base.querySelectorAll(query));

            // Slides stuff
            that._slideIndex = null;
            that._slides = queryAll(that.options.slides, document);

            // Fragments stuff
            that._fragmentIndex = 0;

            // Resolve groups
            const {fragmentGroupPrefix} = that.options;
            that._fragments = that._slides.map(s => {
                const groups = {};
                const frags = [];
                const fg = queryAll(that.options.fragments, s);

                // Cluster elements which are grouped
                for (let i = 0; i < fg.length; i++) {
                    const fragment = fg[i];
                    const group = Array.from(fragment.classList).find(v => v.startsWith(fragmentGroupPrefix));

                    if (group) {
                        if (group in groups) {
                            frags[groups[group]].push(fragment);
                        } else {
                            groups[group] = i;
                            frags.push([fragment]);
                        }
                    } else {
                        frags.push([fragment]);
                    }
                }

                return frags;
            });

            // Bind shortcuts
            that._eventListeners = [

                // Listen for key-events
                on(window, 'keyup', e => {
                    const match = cv => cv === e.code || cv === e.key;
                    const {shortcuts} = that.options;
                    const fns = ['nextSlide', 'previousSlide', 'lastSlide', 'firstSlide', 'nextFragment', 'previousFragment']; // Available shortcuts

                    // Find corresponding shortcut action
                    const target = Object.keys(shortcuts).find(v => {
                        const code = shortcuts[v];
                        return Array.isArray(code) ? code.find(match) : match(code);
                    });

                    // Check shortcut was found and execute function
                    target && fns.includes(target) && that[target]();
                }),

                // Listen for touch-events
                on(window, 'touchstart', e => {
                    const x = e && e.touches && e.touches[0] && e.touches[0].clientX;
                    const halfWidth = window.innerWidth / 2;
                    x > halfWidth ? that.nextFragment() : that.previousFragment();
                })
            ];

            // Trigger
            that.jumpSlide(that.options.slideIndex);
            that._initActive = false;

            // Fire init event
            that._emit('onInit');
        },

        // Helper function to fire events
        _emit(name) {
            const fn = that.options[name];

            // Check if presentr is currently in initialization mode and cb is a function
            if (!that._initActive && typeof fn === 'function') {

                // State slide stuff
                const slideIndex = that._slideIndex;
                const slides = that._slides.length - 1;
                const slidePercent = slides === 0 ? 0 : slideIndex / slides;

                // State fragments stuff
                const fragmentIndex = that._fragmentIndex;
                const fragments = that._fragments[slideIndex].length;
                const fragmentPercent = fragments === 0 ? 0 : fragmentIndex / fragments;

                const state = {
                    slideIndex,
                    slides, slidePercent,
                    fragmentIndex,
                    fragments,
                    fragmentPercent
                };

                // Call event-listener
                fn.call(that, state);

                // Call action listener
                that.options.onAction(state);
            }
        },

        firstSlide: () => that.jumpSlide(0),
        lastSlide: () => that.jumpSlide(that._slides.length - 1),
        nextSlide: () => that.jumpSlide(that._slideIndex + 1),
        previousSlide: () => that.jumpSlide(that._slideIndex - 1),
        jumpSlide(index) {
            const {_slides, _fragments, options} = that;

            // Validate
            if (index < 0 || index >= _slides.length) {
                return false;
            }

            const {classes} = options;
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
            that._slideIndex = index;

            // Update fragment index
            that._fragmentIndex = _fragments[index].reduce((ac, groups, ci) => {
                const containsActiveFragment = groups.find(el => el.classList.contains(classes.activeFragment));
                return containsActiveFragment ? ci + 1 : ac;
            }, 0);

            // Fire event
            that._emit('onSlide');
            return true;
        },

        nextFragment: () => that.jumpFragment(that._fragmentIndex + 1),
        previousFragment: () => that.jumpFragment(that._fragmentIndex - 1),
        jumpFragment(index) {
            const fragments = that._fragments[that._slideIndex];

            // Jump to next / previous slide if no further fragments
            if (index < 0) {
                return that.previousSlide();
            } else if (index > fragments.length) {
                return that.nextSlide();
            }

            // Apply class for previous and current fragment(s)
            that._fragmentIndex = index;
            const {activeFragment, currentFragment} = that.options.classes;
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
            that._emit('onFragment');
            return true;
        },

        destroy() {

            // Unbind event-listeners
            that._eventListeners.forEach(args => off(...args));
        },

        get slideIndex() {
            return that._slideIndex;
        },

        get fragmentIndex() {
            return that._fragmentIndex;
        }
    };

    // Init and return factory object
    that._init();
    return that;
}

// Export function to indentify production-version
Presentr.version = '0.0.4';

// Export factory function
export default Presentr;