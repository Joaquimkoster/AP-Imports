import { useEffect, useState } from "react";
import { Search, Menu, X, MessageCircle } from "lucide-react";
import "./Navbar.css";

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
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
          className={`navbar-links ${menuOpen ? "active" : ""}`}
        >
          <a href="#inicio" onClick={closeMenu}>
            Início
          </a>

          <a href="#produtos" onClick={closeMenu}>
            Produtos
          </a>

          <a href="#categorias" onClick={closeMenu}>
            Categorias
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
          >
            <Search size={21} strokeWidth={1.6} />
          </a>

          <a
            href="#contato"
            className="navbar-icon"
            aria-label="Contato pelo WhatsApp"
          >
            <MessageCircle size={21} strokeWidth={1.6} />
          </a>

          {/* BOTÃO MENU MOBILE */}
          <button
            type="button"
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
    </header>
  );
}

export default Navbar;
