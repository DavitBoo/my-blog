"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { BsSun, BsMoon } from "react-icons/bs";
import { GiCampingTent } from "react-icons/gi"; // Icono para survival theme

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark" | "survival">("light");
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | "survival" | null;
    if (savedTheme) {
      applyTheme(savedTheme);
      setTheme(savedTheme);
    }
  }, []);

  const applyTheme = (newTheme: "light" | "dark" | "survival") => {
    // Remover todas las clases de tema
    document.documentElement.classList.remove("dark", "survival");

    // Aplicar la nueva clase de tema
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (newTheme === "survival") {
      document.documentElement.classList.add("survival");
    }
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "survival") => {
    setTheme(newTheme);
    applyTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    setIsThemeMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleThemeMenu = () => {
    setIsThemeMenuOpen(!isThemeMenuOpen);
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <BsSun />;
      case "dark":
        return <BsMoon />;
      case "survival":
        return <GiCampingTent />;
      default:
        return <BsSun />;
    }
  };

  const menuItems = [
    { href: "/", label: "Inicio" },
    { href: "/blog", label: "Blog" },
    { href: "/now", label: "Ahora" },
    { href: "/sobre-mi", label: "Sobre mi" },
  ];

  const themes = [
    { key: "light", label: "Claro", icon: <BsSun /> },
    { key: "dark", label: "Oscuro", icon: <BsMoon /> },
    { key: "survival", label: "Survival", icon: <GiCampingTent /> },
  ];

  return (
    <header className={`main-header ${isMenuOpen ? "menu-expanded" : ""}`}>
      <div className="container headerContainer">
        <div className="logoContainer">
          <h1>
            davi<span className="highlight">db</span>oo
          </h1>
        </div>
        <nav className="d-flex gap-4 align-items-center">
          <ul className="desktop">
            {menuItems.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>

          {/* Theme Selector */}
          <div className="theme-selector">
            <button onClick={toggleThemeMenu} className="theme-toggle-btn" aria-label="Seleccionar tema">
              {getThemeIcon()}
            </button>

            {isThemeMenuOpen && (
              <div className="theme-menu">
                {themes.map((themeOption) => (
                  <button
                    key={themeOption.key}
                    onClick={() => handleThemeChange(themeOption.key as "light" | "dark" | "survival")}
                    className={`theme-option ${theme === themeOption.key ? "active" : ""}`}
                  >
                    {themeOption.icon}
                    <span>{themeOption.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <RxHamburgerMenu className="menu" onClick={toggleMenu} />
        </nav>
      </div>

      {/* Menú móvil */}
      <ul className="mobile">
        {menuItems.map((item) => (
          <li key={item.href}>
            <Link href={item.href}>{item.label}</Link>
          </li>
        ))}
      </ul>
    </header>
  );
};

export default Header;
