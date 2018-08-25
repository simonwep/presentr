'use strict';

// Utils
import * as _ from './lib/utils';

function Presentr(opt = {}) {

    const that = {

        _init() {

            // Assign default options
            that.options = _.applyDeep({

                slides: '.presentr .slides > section',
                progress: '.presentr .progress',
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

            // Slides
            that._slideIndex = 0;
            that._slides = _.selectAll(that.options.slides);
            that._presentrSlides = that._slides[0].parentElement;
            that._presentrRoot = that._presentrSlides.parentElement;

            // Fragments
            that._fragmentIndex = 0;
            that._fragments = that._slides.map(s => _.selectAll(that.options.fragments, s));

            // Components
            that._progress = document.querySelector(that.options.progress);

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

            _.css(that.options.progress, {
                'position': 'fixed',
                'top': '0',
                'left': '0',
                'width': '100%',
                'height': '0.5em',
                'background': 'black',
                'z-index': '10'
            });

            // Bind shortcuts
            _.on(window, 'keyup', that._keyboardInput);

            // Trigger
            that.jumpSlide(that.options.slideIndex);
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
            that.options.onSlide(that, index, that._slides.length - 1);

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

            // Update _progress
            that._progress.style.width = `${(index / (that._slides.length - 1)) * 100}%`;
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
            that.options.onFragment(that, index, fragments.length - 1);

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