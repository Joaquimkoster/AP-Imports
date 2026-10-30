import { Search, X } from "lucide-react";
import "./Navbar.css";

function ProductSearch({ search, onSearchChange }) {
  function handleSearch(event) {
    event.preventDefault();
    document.querySelector(".products-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="product-search">
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
  );
}

export default ProductSearch;
