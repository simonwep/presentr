<h1 align="center">
    <img src="logo.png" alt="Logo">
</h1>

<h3 align="center">
    Minimalistic, Hackable, Fast Presentation Library.
</h3>


<p align="center">
  <img alt="gzip size" src="https://img.badgesize.io/https://raw.githubusercontent.com/Simonwep/presentr/master/dist/presentr.min.js?compression=gzip&style=flat-square">
  <img alt="brotli size" src="https://img.badgesize.io/https://raw.githubusercontent.com/Simonwep/presentr/master/dist/presentr.min.js?compression=brotli&style=flat-square">
  <a href="https://travis-ci.org/Simonwep/presentr"><img
     alt="Build Status"
     src="https://img.shields.io/travis/Simonwep/presentr.svg?style=popout-square"></a>
  <a href="https://www.npmjs.com/package/@simonwep/presentr"><img
     alt="Download count"
     src="https://img.shields.io/npm/dm/@simonwep/presentr.svg?style=popout-square"></a>
  <img alt="No dependencies" src="https://img.shields.io/badge/dependencies-none-27ae60.svg?style=popout-square">
  <a href="https://www.jsdelivr.com/package/npm/@simonwep/presentr"><img
     alt="JSDelivr download count"
     src="https://data.jsdelivr.com/v1/package/npm/@simonwep/presentr/badge"></a>
  <img alt="Current version"
       src="https://img.shields.io/github/tag/Simonwep/presentr.svg?color=3498DB&label=version&style=flat-square">
  <a href="https://www.patreon.com/simonwep"><img
     alt="Support me"
     src="https://img.shields.io/badge/patreon-support-3498DB.svg?style=popout-square"></a>
</p>

<br>

### Features
* No jQuery
* No dependencies
* Hackable / Extensible
* Ultra small

Why another library to provide the ability to create a presentation in your browser?
Isn't there already Revealjs which is good and reliable?
Yeah, thought the same. But I was looking for a library which I can use in combination with React, Vue, Bootstrap, Materialize or whatever library I want.
Something which only provides the essential functionalities like slides and fragments.
So I've decided to write an absolutly basic, simple but functional library to provide these things.

## Setup

### Node
Install package:
```shell
$ npm install @simonwep/presentr --save
```

Include code and style:
```js
import Presentr from 'Presentr';
```
---
### Browser

jsdelivr:
```html
<script src="https://cdn.jsdelivr.net/npm/@simonwep/presentr/dist/presentr.min.js"></script>
```

Directly:
```html
<script src="node_modules/@simonwep/presentr/dist/presentr.min.js"></script>
```

## Usage
```javascript
// Simple example, see optional options for more configuration.
const presentr = new Presentr({

    // Selector for each slide
    slides: '.presentr .slides > section'
});
```

## Optional options
```javascript
const presentr = new Presentr({

     // Query selector to your slides.
    slides: '.presentr .slides > section',

    // Query selector for each fragment of the presentaion.
    fragments: '.frag',

    // Class for slides behind the current one
    previousSlideClass: 'active-slide',

    // Class for slides after the current one
    nextSlideClass: 'next-slide',

    // Class which will be added only to the current slide.
    currentSlideClass: 'current-slide',

    // Same functionality, but for fragments.
    activeFragmentClass: 'active-frag',
    currentFragmentClass: 'current-frag',
    
    /**
     *  Can be used to group fragments.
     *  Eg. Apply to multiple elements 'g-a' and they will 
     *  all get active until the first element wich this group 
     *  has been reached.
     */
    groupPrefix: 'g-',

    // Start index. Does not change the slide sequence.
    slideIndex: 0,

    // Keyboard shortcuts.
    shortcuts: {

        // Jump to next / previous slide
        nextSlide: ['d', 'D'],
        previousSlide: ['a', 'A'],

        // Jump to first / last slide
        firstSlide: ['y', 'Y'],
        lastSlide: ['x', 'X'],

        // Jumpt to next / previous fragement. If the first or last fragment is reached,
        // the next action would jump to the next / previous slide.
        nextFragment: ['ArrowRight', 'ArrowDown'],
        previousFragment: ['ArrowLeft', 'ArrowUp']
    },

    // Will be called on every slide change.
    onSlide(state) {
        state.presentr;        // Current instance
        state.slideIndex;      // Current slide index
        state.slides;          // Slides as HTMLElements (Array)
        state.slidePercent;    // Decimal percent value of how much of your slides are over
        state.fragmentIndex;   // Current fragment index
        state.fragments;       // Fragments as array in an array which index is the slide index
        state.fragmentPercent;  // Same as slidePercent but for fragments on the current slide
    },

    // Will be called on every fragment change.
    onFragment(state) {
        // Same as onSlide
    },

    // Will be called on every slide or fragment change.
    onAction(state) {
        // Same as onSlide
    },

    // Initialization event, will be called on first initialization of presenter.
    onInit(state) {
        // Same as onSlide
    }
});
```

## Methods
* presentr.nextSlide() _- Jump to next slide._
* presentr.previousSlide() _- Jump to previous slide._
* presentr.firstSlide() _- Jump to first slide._
* presentr.lastSlide() _- Jump to last slide._
* presentr.jumpSlide(index`:Number`) _- Jump to a specific slide._
* presentr.nextFragment() _- Jump to next fragment, if end reached the next slide will be shown._
* presentr.previousFragment() _- Jump to previous fragment, if start reached the previous slide will be shown._
* presentr.jumpFragment(index`:Number`) _- Jump to a specific fragment on the current slide._
* presentr.destroy() _- Destroys the presentr instance and unbinds all event-listeners._

## Contributing
If you want to open a issue, create a Pull Request or simply want to know how you can run it on your local machine, please read the [Contributing guide](https://github.com/Simonwep/presentr/blob/master/.github/CONTRIBUTING.md).