import { useEffect, useState } from "react";

const useScrollDirection = (element) => {
  const [scrollOffset, setScrollOffset] = useState(0);
  const [lastScroll, setLastScroll] = useState(0);
  const [scrollDirection, setScrollDirection] = useState("UP");

  useEffect(() => {
    let updateScrollDirection = () => {
      /**/
    };
    let lastScrollY = 0;
    if (element && element.addEventListener) {
      lastScrollY = element.scrollTop;
      updateScrollDirection = () => {
        const scrollY = element.scrollTop;
        const direction = scrollY > lastScrollY ? "DOWN" : "UP";

        if (
          direction !== scrollDirection &&
          (scrollY - lastScrollY > 0 || scrollY - lastScrollY < 0)
        ) {
          setScrollDirection(direction);
        }
        setLastScroll(lastScrollY);
        setScrollOffset(scrollY);
        lastScrollY = scrollY > 0 ? scrollY : 0;
      };
      element.addEventListener("scroll", updateScrollDirection);
    }
    return () => {
      if (element && element.removeEventListener) {
        element.removeEventListener("scroll", updateScrollDirection);
      }
    };
  }, [scrollDirection, element]);

  return {
    scrollDirection,
    scrollOffset,
    lastScroll
  };
}

export default useScrollDirection;
