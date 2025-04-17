// components/landing/Navbar.tsx
import { ThemeToggle } from "@/components/theme-toggle";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/80 backdrop-blur-md shadow-xs"
          : "bg-transparent"
      }`}
      role="banner"
    >
      <nav
        className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto"
        aria-label="Main navigation"
        role="navigation"
      >
        <a
          href="/"
          className="flex items-center"
          tabIndex={0}
          aria-label="SophistAI Home"
        >
          <img
            src="/logo-lightmode.svg"
            alt="SophistAI logo light"
            className="dark:hidden h-7 sm:h-8 w-auto mx-auto"
          />
          <img
            src="/logo-darkmode.svg"
            alt="SophistAI logo dark"
            className="hidden dark:block h-7 sm:h-8 w-auto mx-auto"
          />
          {/* <span className="ml-2 font-medium text-lg">SophistAI</span> */}
        </a>
        <ul
          className="flex items-center gap-4"
          role="tablist"
          aria-label="Primary"
        >
          {/* <li role="presentation">
            <Button
              asChild
              variant="ghost"
              className="hidden sm:flex"
              tabIndex={0}
            >
              <a
                href="#about"
                role="tab"
                aria-selected="true"
                aria-current="page"
              >
                About
              </a>
            </Button>
          </li>
          <li role="presentation">
            <Button
              asChild
              variant="ghost"
              className="hidden sm:flex"
              tabIndex={0}
            >
              <a href="#features" role="tab" aria-selected="false">
                Features
              </a>
            </Button>
          </li>
          <li role="presentation">
            <Button
              asChild
              variant="ghost"
              className="hidden sm:flex"
              tabIndex={0}
            >
              <a href="#pricing" role="tab" aria-selected="false">
                Pricing
              </a>
            </Button>
          </li> */}
          <li role="presentation" className="ml-2">
            <ThemeToggle />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
