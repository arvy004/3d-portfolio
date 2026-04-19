import { useEffect, useRef } from "react";
import "./styles/Career.css";

const Career = () => {
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
              }, i * 250);
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="career-section section-container" ref={sectionRef}>
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4><span className="apple-highlight">Chief Product Officer</span></h4>
                <h5>Arkire</h5>
              </div>
              <h3>PRESENT</h3>
            </div>
            <p>
              Driving product vision and strategy. Leading the design and development 
              of community-driven platforms, automation tools, and user-centric features. 
              Coordinating cross-functional updates and roadmap execution.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Panther Creek High School</h4>
                <h5>GPA: 4.43 | Rank: 27</h5>
              </div>
              <h3>2024–28</h3>
            </div>
            <p>
              High school education with a focus on STEM and leadership. Actively involved 
              in competitive robotics and technical extracurriculars.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>West Cary Middle School</h4>
                <h5><span className="apple-highlight">Honors Graduate</span></h5>
              </div>
              <h3>2020–23</h3>
            </div>
            <p>
              Completed middle school education with high academic achievement.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
