/**
 * Deep version of apply, doesn't support circular references
 * @param source
 * @param target
 * @returns {*}
 */
export default function assignDeep(target = {}, source) {

    for (const [key, val] of Object.entries(source)) {
        const targetValue = target[key];

        if (targetValue !== null && typeof targetValue === 'object') {
            target[key] = assignDeep(targetValue, val);
        } else if (typeof val !== 'undefined') {
            target[key] = val;
        }
    }

    return target;
}