'use strict';

// Utils
import * as _ from './lib/utils';

function Presentr(opt = {}) {

    const that = {

        _init() {

            // Assign default options
            that.options = _.applyDeep({

                slides: '.presentr .slides > section',
                fragments: '.frag',

                activeSlideClass: 'active',
                currentSlideClass: 'current-slide',
                activeFragmentClass: 'active',
                currentFragmentClass: 'current-frag',

                slideIndex: 0,

                shortcuts: {
                    nextSlide: ['d', 'D'],
                    previousSlide: ['a', 'A'],
                    nextFragment: ['ArrowRight', 'ArrowDown'],
                    previousFragment: ['ArrowLeft', 'ArrowUp']
                },

                onSlide: () => 0,
                onFragment: () => 0

            }, opt);

            this._initActive = true;

            // Slides
            that._slideIndex = 0;
            that._slides = _.selectAll(that.options.slides);
            that._presentrSlides = that._slides[0].parentElement;
            that._presentrRoot = that._presentrSlides.parentElement;

            // Fragments
            that._fragmentIndex = 0;
            that._fragments = that._slides.map(s => _.selectAll(that.options.fragments, s));

            // Inject styles
            _.css(that._presentrRoot, {'overflow': 'hidden'});
            _.css(that._presentrSlides, {
                'position': 'fixed',
                'display': 'flex',
                'top': '0',
                'left': '0',
                'width': '100vw',
                'height': '100vh'
            });

            _.css(that.options.slides, {
                'flex-shrink': '0',
                'width': '100vw',
                'height': '100vh'
            });

            // Bind shortcuts
            _.on(window, 'keyup', that._keyboardInput);

            // Trigger
            that.jumpSlide(that.options.slideIndex);
            this._initActive = false;
        },

        // Helper function to fire events
        _fireEvent(name) {
            const fn = this.options[name];

            // Check if presentr is currently in initialization mode and cb is a function
            if (!this._initActive && typeof fn === 'function') {

                // Pre-calculations cause slides and fragments starts at one, not zero.
                const presentr = this;
                const slideIndex = this._slideIndex + 1;
                const slides = this._slides.length - 1;
                const slidePercent = slideIndex / slides;
                const fragmentIndex = this._fragmentIndex + 1;
                const fragments = this._fragments.length - 1;
                const fragmentPercent = fragmentIndex / fragments;

                // Call event-listener
                fn({presentr, slideIndex, slides, slidePercent, fragmentIndex, fragments, fragmentPercent});
            }
        },

        _keyboardInput(e) {
            const match = cv => cv === e.code || cv === e.key;
            const {shortcuts} = that.options;
            const fns = ['nextSlide', 'previousSlide', 'nextFragment', 'previousFragment']; // Available shortcuts

            // Check if multiple keys are binded
            const target = Object.keys(shortcuts).find(v => {
                const code = shortcuts[v];
                return Array.isArray(code) ? code.find(match) : match(code);
            });

            // Check shortcut and execute
            target && fns.includes(target) && that[target]();
        },

        nextSlide: () => that.jumpSlide(that._slideIndex + 1),
        previousSlide: () => that.jumpSlide(that._slideIndex - 1),
        jumpSlide(index) {

            // Validate
            if (index < 0 || index >= that._slides.length) {
                return false;
            }

            // Fire event
            that._fireEvent('onSlide');

            // Apply index
            that._slideIndex = index;

            // Update offset
            that._presentrSlides.style.left = `-${index * 100}vw`;

            // Set active class
            for (let i = 0, cl, n = that._slides.length; i < n && (cl = that._slides[i].classList); i++) {
                cl[i <= index ? 'add' : 'remove'](that.options.activeSlideClass);
                cl[i === index ? 'add' : 'remove'](that.options.currentSlideClass);
            }

            // Update fragment index
            that._fragmentIndex = that._fragments[index].reduce((ac, cv, ci) => cv.classList.contains(that.options.activeFragmentClass) ? ci + 1 : ac, 0);
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

            // Fire event
            that._fireEvent('onFragment');

            // Apply index
            that._fragmentIndex = index;
            for (let i = 0, cl, n = fragments.length; i < n && (cl = fragments[i].classList); i++) {
                cl[i < index ? 'add' : 'remove'](that.options.activeFragmentClass);
                cl[i === index - 1 ? 'add' : 'remove'](that.options.currentFragmentClass);
            }

            return true;
        },

        // Remove shortcuts
        destroy: () => _.off(window, 'keyup', that._keyboardInput),

        // Version
        version: '0.0.1'
    };

    that._init();
    return that;
}

module.exports = Presentr;