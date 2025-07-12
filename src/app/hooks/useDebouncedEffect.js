// hooks/useDebouncedEffect.js
import { useEffect } from "react";
import debounce from "lodash.debounce";

export function useDebouncedEffect(callback, deps, delay) {
  useEffect(() => {
    const debounced = debounce(() => {
      callback();
    }, delay);

    debounced();

    return () => debounced.cancel();
  }, [delay, ...deps]);
}
