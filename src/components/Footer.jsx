import React from "react";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

function Footer() {
  return (
    <footer className="footer">
      <div className="attribution-card">
        <p>Created By Anass El Amrany</p>
        <a 
          href="https://www.linkedin.com/in/anass-elamrany" 
          target="_blank" 
          rel="noopener noreferrer"
          className="linkedin-link"
        >
          <LinkedInIcon className="linkedin-icon" />
        </a>
      </div>
    </footer>
  );
}

export default Footer;