"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { BsSun, BsMoon } from "react-icons/bs";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme);
  };

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
        <nav className="d-flex gap-4 align-items-baseline">
          <ul className="desktop">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>

          <button onClick={toggleTheme} className="theme-toggle-btn">
            {theme === "light" ? <BsMoon /> : <BsSun />}
          </button>

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
