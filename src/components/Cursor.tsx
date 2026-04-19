import { useEffect, useRef, useCallback } from "react";
import "./styles/Cursor.css";
import gsap from "gsap";

const Cursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    mousePos.current.x = e.clientX;
    mousePos.current.y = e.clientY;
  }, []);
  
  useEffect(() => {
    let hover = false;
    const cursor = cursorRef.current!;
    
    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    
    const animate = () => {
      if (!hover) {
        const delay = 6;
        cursorPos.current.x += (mousePos.current.x - cursorPos.current.x) / delay;
        cursorPos.current.y += (mousePos.current.y - cursorPos.current.y) / delay;
        gsap.set(cursor, { x: cursorPos.current.x, y: cursorPos.current.y });
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    const cursorElements = document.querySelectorAll("[data-cursor]");
    
    cursorElements.forEach((item) => {
      const element = item as HTMLElement;
      const handleMouseOver = (e: MouseEvent) => {
        const target = e.currentTarget as HTMLElement;
        const rect = target.getBoundingClientRect();

        if (element.dataset.cursor === "icons") {
          cursor.classList.add("cursor-icons");
          gsap.to(cursor, { x: rect.left, y: rect.top, duration: 0.15, ease: "power2.out" });
          cursor.style.setProperty("--cursorH", `${rect.height}px`);
          hover = true;
        }
        if (element.dataset.cursor === "disable") {
          cursor.classList.add("cursor-disable");
        }
      };
      
      const handleMouseOut = () => {
        cursor.classList.remove("cursor-disable", "cursor-icons");
        hover = false;
      };
      
      element.addEventListener("mouseover", handleMouseOver, { passive: true });
      element.addEventListener("mouseout", handleMouseOut, { passive: true });
    });
    
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleMouseMove]);

  return <div className="cursor-main" ref={cursorRef}></div>;
};

export default Cursor;
