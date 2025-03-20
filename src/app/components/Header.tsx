"use client";

import Link from "next/link";
import React, { useState } from "react";
import { RxHamburgerMenu } from "react-icons/rx";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const menuItems = [
    { href: "/", label: "Inicio" },
    { href: "/blog", label: "Blog" },
    { href: "/now", label: "Ahora" },
    { href: "/sobre-mi", label: "Sobre mi" },
  ];

  return (
    <header className="main-header">
      <div className="container headerContainer">
        <div className="logoContainer">
          <h1>
            davi<span className="highlight">db</span>oo
          </h1>
        </div>
        <nav>
          <ul className="desktop">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
          <RxHamburgerMenu className="menu" onClick={toggleMenu} />
          {isMenuOpen && (
            <ul className="mobile">
              {menuItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
