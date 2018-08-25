/**
 * Add an eventlistener to an element.
 * @param element
 * @param event
 * @param fn Callback
 * @param options Optional options
 * @return Array passed arguments
 */
export const on = eventListener.bind(null, 'addEventListener');

/**
 * Removes an eventlistener to an element.
 * @param element
 * @param event
 * @param fn Callback
 * @param options Optional options
 * @return Array passed arguments
 */
export const off = eventListener.bind(null, 'removeEventListener');

function eventListener(method, element, event, fn, ctx, options = {}) {
    element[method](event, fn, {capture: false, ...options});
}

/**
 * Deep version of apply, doesn't support circular references
 * @param source
 * @param target
 * @returns {*}
 */
export function applyDeep(target = {}, source) {

    for (let k in source) {
        if (!(k in target)) {
            target[k] = source[k];
        } else if (typeof target[k] === 'object') {
            target[k] = applyDeep(source[k], target[k]);
        } else {
            target[k] = source[k];
        }
    }

    return target;
}

/**
 * Function to append styles to the document header.
 * Will append the styles before all head content so it gets the lowest priority and can be overidden.
 */
export function css(el, props) {

    // Create unique identifier or use existing
    let selector;
    if (el instanceof HTMLElement) {
        const id = `id-${Math.floor(Math.random() * 1e10)}`;
        selector = `.${id}`;
        el.classList.add(id);
    } else {
        selector = el;
    }

    // Create style string
    let styles = '';
    for (let k in props) {
        styles += `${k}:${props[k]};`;
    }

    // Apppend styles
    const styleNode = document.createElement('style');
    styleNode.innerHTML = `${selector}{${styles}}`;
    document.head.insertAdjacentElement('afterbegin', styleNode);
}

/**
 * Query-selector, returns array.
 * @param query
 * @param base
 * @returns {T[]}
 */
export function selectAll(query, base = document) {
    return Array.from(base.querySelectorAll(query));
}