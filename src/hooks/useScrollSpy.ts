import { useEffect, useState } from "react";

export function useScrollSpy(elementIds: string[], offset: number = 100): string {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      for (const id of elementIds) {
        const element = document.getElementById(id);
        if (!element) continue;

        const rect = element.getBoundingClientRect();
        if (rect.top <= offset && rect.bottom > offset) {
          setActiveId(id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [elementIds, offset]);

  return activeId;
}
