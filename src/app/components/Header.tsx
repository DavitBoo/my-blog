"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { BsSun, BsMoon } from "react-icons/bs";
import { GiCampingTent } from "react-icons/gi";

type ThemeType = "light" | "dark" | "survival";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState<ThemeType>("light");
  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  const getCookie = (name: string): string | null => {
    if (typeof document === 'undefined') return null;
    
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(';').shift() || null;
    }
    return null;
  };

  // Función para establecer cookies
  const setCookie = (name: string, value: string, days: number = 365) => {
    if (typeof document === 'undefined') return;
    
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  };

  // Get sys theme
  const getSystemTheme = (): "light" | "dark" => {
    if (typeof window === 'undefined') return "light";
    
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches 
      ? "dark" 
      : "light";
  };

  useEffect(() => {
    const savedTheme = getCookie("theme") as ThemeType | null;
    
    let initialTheme: ThemeType;
    
    if (savedTheme && ["light", "dark", "survival"].includes(savedTheme)) {
      // Just using theme saved on cookies
      initialTheme = savedTheme;
    } else {
      // Use sys config if no cookie for theme setup
      const systemTheme = getSystemTheme();
      initialTheme = systemTheme;

      setCookie("theme", systemTheme);
    }
    
    setTheme(initialTheme);
    applyTheme(initialTheme);

  }, []);

  const applyTheme = (newTheme: ThemeType) => {
    if (typeof document === 'undefined') return;
    
    document.documentElement.classList.remove("dark", "survival");
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else if (newTheme === "survival") {
      document.documentElement.classList.add("survival");
    }
  };

  const handleThemeChange = (newTheme: ThemeType) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    setCookie("theme", newTheme);
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
                    onClick={() => handleThemeChange(themeOption.key as ThemeType)}
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