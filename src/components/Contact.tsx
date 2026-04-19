import { useState } from "react";
import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";

const Contact = () => {
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (event: any) => {
    event.preventDefault();
    setIsSubmitting(true);
    setResult("Sending...");
    
    const formData = new FormData(event.target);
    formData.append("access_key", "b325b240-6d24-42ab-9acb-66e6384312aa");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully!");
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>
        <div className="contact-wrapper">
          <div className="contact-flex">
          <div className="contact-box">
            <h4>Connect</h4>
            <p>
              919-434-5490
            </p>
            <p>
              aashelke4@students.wcpss.net
            </p>
            <h4>Location</h4>
            <p>
              Cary, North Carolina, NC 27560
            </p>
          </div>
          <div className="contact-box">
            <h4>Education Highlights</h4>
            <p>
              Panther Creek High School — Class of 2028
            </p>
            <p>
              GPA: 4.43 | Class Rank: 27
            </p>
            <p>
              Adobe Certified Professional — Visual Design
            </p>
          </div>
          <div className="contact-box">
            <h2>
              Designed and Developed <br /> by <span>Arnav Shelke</span>
            </h2>
            <h5>
              <MdCopyright /> 2026
            </h5>
          </div>
          </div>
          <div className="contact-form-box">
            <h4>Send a Message</h4>
            <form onSubmit={onSubmit} className="contact-form">
              <input type="text" name="name" placeholder="Your Name" required />
              <input type="email" name="email" placeholder="Your Email" required />
              <textarea name="message" placeholder="Your Message" required rows={4}></textarea>
              <button type="submit" disabled={isSubmitting} className="submit-btn">
                {isSubmitting ? "Sending..." : "Submit Form"}
                {!isSubmitting && <MdArrowOutward />}
              </button>
            </form>
            <span className="form-result">{result}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
