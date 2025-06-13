import { useEffect, useState } from "react";

const useDebounce = (value: string, delay: number) => {
  const [debounceVal, setDebounceVal] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => {
      setDebounceVal(value);
    }, delay);

    return () => {
      clearTimeout(id);
    };
  }, [value, delay]);

  return debounceVal;
};

export default useDebounce;
