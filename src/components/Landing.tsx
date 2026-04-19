import { PropsWithChildren } from "react";
import "./styles/Landing.css";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv" tabIndex={-1}>
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
              ARNAV
              <br />
              <span>SHELKE</span>
            </h1>
          </div>
          <div className="landing-info">
            <h3>STEM &</h3>
            <h2 className="landing-info-h2">Graphic <br /> Design</h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
