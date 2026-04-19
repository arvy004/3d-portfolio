import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/About.css";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const highlights = sectionRef.current.querySelectorAll(".apple-highlight");

    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 60%",
      once: true,
      onEnter: () => {
        highlights.forEach((el, i) => {
          gsap.delayedCall(i * 0.25, () => {
            el.classList.add("highlighted");
          });
        });
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === sectionRef.current) t.kill();
      });
    };
  }, []);

  return (
    <div className="about-section" id="about" ref={sectionRef}>
      <div className="about-me">
        <h3 className="title">About Me</h3>
        <p className="para">
          A <span className="apple-highlight">creative</span> and driven student, with 3 years of experience in the 
          fields of STEM, Product and Graphic Design. Striving to help 
          the community by initiation of helpful startups. Passionate to 
          combine science with tech to create something{" "}
          <span className="apple-highlight">innovative</span>.
        </p>
      </div>
    </div>
  );
};

export default About;
