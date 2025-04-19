
export const parseQueryParams = (query: Record<string, string | string[]>): Record<string, any> => {
    const result: Record<string, any> = {};

    Object.keys(query).forEach((key) => {
        const value = query[key];

        // Recursive function to process each key with brackets
        const setNestedValue = (object: Record<string, any>, keys: string[], value: string | string[]) => {
            const currentKey = keys.shift()!;

            if (keys.length > 0) {
                // If the next part is an array, initialize it as an array, else as an object
                if (!object[currentKey]) {
                    object[currentKey] = currentKey.endsWith('[]') ? [] : {};
                }

                // Recurse with the remaining keys
                setNestedValue(object[currentKey], keys, value);
            } else {
                // At the last part of the key, assign the value
                if (currentKey.endsWith('[]')) {
                    // If it's an array, ensure that we are pushing into an array
                    if (Array.isArray(object[currentKey])) {
                        (object[currentKey] as string[]).push(...(Array.isArray(value) ? value : [value]));
                    } else {
                        object[currentKey] = Array.isArray(value) ? value : [value];
                    }
                } else {
                    // Otherwise, just set the value
                    object[currentKey] = value;
                }
            }
        };

        // Process each key and split it based on `[` and `]`
        const keys = key.split('[').map(k => k.replace(']', ''));

        setNestedValue(result, keys, value);
    });

    return result;
}