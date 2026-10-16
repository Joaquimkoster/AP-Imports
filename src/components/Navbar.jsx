import { useEffect, useRef, useState } from "react";
import { Search, Menu, X, MessageCircle } from "lucide-react";
import "./Navbar.css";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    const desktop = window.matchMedia("(min-width: 901px)");
    const handleResize = () => {
      if (desktop.matches) setMenuOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    desktop.addEventListener("change", handleResize);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      desktop.removeEventListener("change", handleResize);
    };
  }, [menuOpen]);

  // Detectar quando o usuário rola a página
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Fechar menu mobile
  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""} ${menuOpen ? "menu-open" : ""}`}>
      <div className="navbar-container">

        {/* LOGO */}
        <a href="#inicio" className="navbar-logo" onClick={closeMenu}>
          <img
            src="/images/Logo.webp"
            alt="A&P Imports — início"
            width="1254"
            height="1254"
            fetchPriority="high"
          />
        </a>

        {/* LINKS DE NAVEGAÇÃO */}
        <nav
          id="navbar-navigation"
          aria-label="Navegação principal"
          className={`navbar-links ${menuOpen ? "active" : ""}`}
        >
          <a href="#inicio" onClick={closeMenu}>
            Início
          </a>

          <a href="#categorias" onClick={closeMenu}>
            Categorias
          </a>

          <a href="#produtos" onClick={closeMenu}>
            Produtos
          </a>

          <a href="#sobre" onClick={closeMenu}>
            Sobre
          </a>

          <a href="#contato" onClick={closeMenu}>
            Contato
          </a>
        </nav>

        {/* ÍCONES */}
        <div className="navbar-actions">

          <a
            href="#produtos"
            className="navbar-icon"
            aria-label="Pesquisar produtos"
            onClick={closeMenu}
          >
            <Search size={21} strokeWidth={1.6} />
          </a>

          <a
            href="#contato"
            className="navbar-icon"
            aria-label="Contato pelo WhatsApp"
            onClick={closeMenu}
          >
            <MessageCircle size={21} strokeWidth={1.6} />
          </a>

          {/* BOTÃO MENU MOBILE */}
          <button
            type="button"
            ref={menuButtonRef}
            className="navbar-menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
            aria-expanded={menuOpen}
            aria-controls="navbar-navigation"
          >
            {menuOpen ? (
              <X size={25} />
            ) : (
              <Menu size={25} />
            )}
          </button>

        </div>
      </div>
      {menuOpen && (
        <button
          type="button"
          className="navbar-backdrop"
          aria-label="Fechar menu de navegação"
          onClick={closeMenu}
          tabIndex={-1}
        />
      )}
    </header>
  );
}

export default Navbar;
