/**
 * Deep version of apply, doesn't support circular references
 * @param source
 * @param target
 * @returns {*}
 */
export function applyDeep(target = {}, source) {

    for (let k in source) {
        if (target[k] !== null && typeof target[k] === 'object') {
            target[k] = applyDeep(source[k], target[k]);
        } else {
            target[k] = source[k];
        }
    }

    return target;
}
