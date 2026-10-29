import { Search, X } from "lucide-react";
import "./Navbar.css";

function Navbar({ search, onSearchChange }) {
  function handleSearch(event) {
    event.preventDefault();
    document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <header className="navbar">
      <div className="navbar-container">
        <form className="navbar-search" role="search" onSubmit={handleSearch}>
          <Search size={18} aria-hidden="true" />
          <input
            type="search"
            placeholder="Buscar produto..."
            aria-label="Buscar produtos"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
          {search && (
            <button type="button" aria-label="Limpar busca" onClick={() => onSearchChange("")}>
              <X size={16} aria-hidden="true" />
            </button>
          )}
        </form>
      </div>
    </header>
  );
}

export default Navbar;
