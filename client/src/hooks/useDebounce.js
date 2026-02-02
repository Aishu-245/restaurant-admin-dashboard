import { useState, useEffect } from 'react';

/**
 * Custom hook for debouncing values
 * Delays updating the returned value until after the specified delay
 * @param {any} value - The value to debounce
 * @param {number} delay - Delay in milliseconds (default: 300ms)
 * @returns {any} - The debounced value
 */
export function useDebounce(value, delay = 300) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // Set a timeout to update the debounced value
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // Cleanup function - clears timeout if value changes before delay expires
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
}
