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
* Native mobile-support

Why another library to provide the ability to create a presentation in your browser?
Isn't there already Revealjs which is good and reliable?
Yeah, thought the same. But I was looking for a library which I can use in combination with React, Vue, Bootstrap, Materialize or whatever library I want.
Something which only provides the very essential functionalities to control slides and fragments.

## Setup

### Node
Install package:
```shell
$ npm install @simonwep/presentr --save
```

Include code and style:
```js
import presentr from '@simonwep/presentr';
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
    slides: '.slide',
    fragments: '.frag'
});
```

## Optional options
```javascript
const presentr = new Presentr({

     // Query selector to your slides.
    slides: '.slide',

    // Query selector for each fragment of the presentaion.
    fragments: '.frag',

    /**
     *  Can be used to group fragments.
     *  Apply to multiple elements 'g-a' and they will 
     *  all get active until the first element wich this group 
     *  has been reached.
     */
    fragmentGroupPrefix: 'g-',

    // Start index. Does not change the slide sequence.
    slideIndex: 0,

    // CSS Classes to get control the appereance of slides and fragments.
    // It's possible to use arrays
    classes: {
        previousSlide: 'previous-slide', // Class for slides behind the current one
        nextSlide: 'next-slide',         // Class for slides after the current one
        currentSlide: 'current-slide',   // Class which will be added only to the current slide.

        // Same functionality, just for fragments.
        activeFragment: 'active-frag',
        currentFragment: 'current-frag'
    },

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
    }
});
```

## Events
Since version `1.1.x` Presentr is event-driven. Use the `on(event, cb)` and `off(event, cb)` functions to bind / unbind eventlistener.

| Event      | Description | Arguments |
| -------------- | ----------- | ----------- | 
| `action`       | Fires both on `slide` and `fragment` | `{presentr: PickrInstance}` |
| `beforeSlide`  | Before slide changes | `{presentr: PickrInstance, from: slideIndex, to: slideIndex}` |
| `slide`        | Slide changed | `{presentr: PickrInstance}` |
| `beforeFragment` | Before fragment changes | `{presentr: PickrInstance, from: fragmentIndex, to: fragmentIndex}` |
| `fragment`     | Fragment changed | `PickrInstance` |

> Example:
```js
presentr.on('action', () => {
    console.log('action');
}).on('beforeSlide', obj => {
    console.log('beforeSlide', obj);
    // Return false explicitly to block slide
}).on('beforeFragment', obj => {
    console.log('beforeFragment', obj);
    // Return false explicitly to block fragment
}).on('slide', () => {
    console.log('slide');
}).on('fragment', () => {
    console.log('fragment');
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

## Getters
* presentr.totalSlides _- Total amount of slides._
* presentr.totalFragments _- Total amount of fragments in current slide._
* presentr.slideIndex _- Current slide index._
* presentr.fragmentIndex _- Current fragment index in slide._
* presentr.globalFragmentCount _- Total amount of fragments on all slides combined._

## Contributing
If you want to open a issue, create a Pull Request or simply want to know how you can run it on your local machine, please read the [Contributing guide](https://github.com/Simonwep/presentr/blob/master/.github/CONTRIBUTING.md).
