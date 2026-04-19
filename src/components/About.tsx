import { useEffect, useRef } from "react";
import "./styles/About.css";

const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const highlights = entry.target.querySelectorAll(".apple-highlight");
            highlights.forEach((el, i) => {
              setTimeout(() => {
                el.classList.add("highlighted");
              }, i * 200);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
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
