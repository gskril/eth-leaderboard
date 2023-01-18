import { useRef, useEffect } from 'react';

export function usePrevious(value: number) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef<number>();

  // Store current value in ref
  useEffect(() => {
    if (value !== undefined) ref.current = value;
  }, [value]); // Only re-run if value changes

  // Return previous value (happens before update in useEffect above)
  return ref.current;
}
