/**
 * Deep version of apply, doesn't support circular references
 * @param source
 * @param target
 * @returns {*}
 */
export default function assignDeep(target = {}, source) {

    for (const [key, val] of Object.entries(source)) {
        if (target[key] !== null && typeof target[key] === 'object') {
            target[key] = assignDeep(val, target[key]);
        } else {
            target[key] = val;
        }
    }

    return target;
}