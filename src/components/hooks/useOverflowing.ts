import { useState, useEffect, useRef } from "react";

export const useOverflowing = (content: string) => {
  const [isOverflowing, setIsOverflowing] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      const overflowing =
        ref.current.scrollWidth > ref.current.clientWidth ||
        ref.current.scrollHeight > ref.current.clientHeight;
      setIsOverflowing(overflowing ? true : false);
    }
  }, [setIsOverflowing, content]);

  return { divRef: ref, isOverflowing };
};
