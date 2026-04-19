import { useEffect, useRef, useCallback } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollSmoother, ScrollTrigger);
export let smoother: ScrollSmoother;

const Navbar = () => {
  const resizeTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
  
  const handleResize = useCallback(() => {
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }
    resizeTimeoutRef.current = setTimeout(() => {
      ScrollSmoother.refresh(true);
    }, 150);
  }, []);
  
  const handleLinkClick = useCallback((e: MouseEvent) => {
    if (window.innerWidth > 1024) {
      e.preventDefault();
      const elem = e.currentTarget as HTMLAnchorElement;
      const section = elem.getAttribute("data-href");
      if (section && smoother) {
        smoother.scrollTo(section, true, "top top");
      }
    }
  }, []);
  
  useEffect(() => {
    smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1.7,
      speed: 1.7,
      effects: true,
      autoResize: true,
      ignoreMobileResize: true,
    });

    smoother.scrollTop(0);
    smoother.paused(true);

    const links = document.querySelectorAll(".header ul a");
    links.forEach((elem) => {
      const element = elem as HTMLAnchorElement;
      element.addEventListener("click", handleLinkClick);
    });
    
    window.addEventListener("resize", handleResize, { passive: true });
    
    return () => {
      window.removeEventListener("resize", handleResize);
      links.forEach((elem) => {
        const element = elem as HTMLAnchorElement;
        element.removeEventListener("click", handleLinkClick);
      });
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
      if (smoother) {
        smoother.kill();
      }
    };
  }, [handleResize, handleLinkClick]);
  return (
    <>
      <div className="header">
        <a href="/#" className="navbar-title" data-cursor="disable">
          AS
        </a>
        <a
          href="#"
          className="navbar-connect"
          data-cursor="disable"
        >
          Arnav Shelke
        </a>
        <ul>
          <li>
            <a data-href="#about" href="#about">
              <HoverLinks text="ABOUT" />
            </a>
          </li>
          <li>
            <a data-href="#work" href="#work">
              <HoverLinks text="WORK" />
            </a>
          </li>
          <li>
            <a data-href="#contact" href="#contact">
              <HoverLinks text="CONTACT" />
            </a>
          </li>
        </ul>
      </div>

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
