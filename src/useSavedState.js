import { useState, useCallback } from "react";

/**
 * @template T
 * @param {string} key
 * @param {T} initialValue
 * @returns {[T, (newState: T) => void]}
 */
export function useSavedState (key, initialValue) {
    const [ state, setState ] = useState(() => {
        const savedValue = localStorage.getItem(key);

        if (savedValue) {
            try {
                return /** @type {T} */(JSON.parse(savedValue));
            }
            catch (e) {}
        }

        return initialValue;
    });

    const saveState = useCallback((/** @type {T} */ newState) => {
        localStorage.setItem(key, JSON.stringify(newState));

        setState(newState);
    }, [key, setState]);

    return [ state, saveState ];
}