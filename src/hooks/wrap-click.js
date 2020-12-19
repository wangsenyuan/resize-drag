import { useCallback, useState, useEffect, useRef } from "react";

export function useClickAndDbClick(onClick, onDbClick, delay = 300) {
  const [click, setClick] = useState({ times: 0 });
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [timerRef]);

  useEffect(() => {
    if (click.times === 1) {
      timerRef.current = setTimeout(() => {
        // simple click
        if (click.times === 1) {
          onClick?.(click.evt);
        }
        setClick({ times: 0 });
      }, delay);
    }
    // click in a delay < 250 = double click detected
    if (click.times === 2) {
      onDbClick?.(click.evt);
      // no need to call setClick here to reset times, timer will do it
    }
  }, [click, onClick, onDbClick]);

  const wrapClick = useCallback(
    (evt) => {
      setClick((click) => {
        return Object.assign({}, click, { times: click.times + 1, evt });
      });
    },
    [setClick]
  );

  return wrapClick;
}

export default useClickAndDbClick;
