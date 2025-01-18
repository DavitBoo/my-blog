import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <header>
      <div className="headerContainer">
        <div className="logoContainer">
          <h1>
            davit's<span className="highlight">blog</span>
          </h1>
        </div>
        <nav>
          <ul>
            <li>
              <Link href="/">Inicio</Link>
            </li>
            <li>
              <Link href="/about-me">Sobre mi</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
