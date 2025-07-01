import React from "react";
import { FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="container d-flex align-items-center justify-content-between gap-4">
          <div>
            <p>📍 Vitoria-Gasteiz</p>
            <p>© 2025 — Todos los derechos reservados</p>
          </div>
          <div className="d-flex gap-4 social-icons">
            <a href="" target="_blank">
              <FaInstagram />
            </a>
            •
            <a href="" target="_blank">
              <FaLinkedin />
            </a>
            •
            <a href="" target="_blank">
              <FaGithub />
            </a>
            •
            <a href="" target="_blank">
              <MdEmail />
            </a>
          </div>
      </div>
    </footer>
  );
};

export default Footer;
