/**
 * Create an object composed of the picked object properties
 * @param object The source object
 * @param keys Array of keys to pick
 * @returns An object with only the picked keys
 */
export function pick<T extends object, K extends keyof T>(object: T, keys: K[]): Pick<T, K> {
    return keys.reduce((obj, key) => {
        if (object && Object.hasOwn(object, key)) {
            obj[key] = object[key];
        }
        return obj;
    }, {} as Pick<T, K>);
}
