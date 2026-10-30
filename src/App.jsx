import { useState } from "react";
import { ArrowDownRight, MessageCircle } from "lucide-react";
import CatalogBanner from "./components/CatalogBanner";
import Products from "./components/Products";
import Contact from "./components/Contact";
import { scrollToSection } from "./utils/scrollToSection";
import "./App.css";

function App() {
  const [search, setSearch] = useState("");

  return (
    <>
      <main>
        <section id="catalogo" className="catalog-container" aria-labelledby="catalog-title">
          <CatalogBanner />
          <Products search={search} onSearchChange={setSearch} />
          <div className="catalog-assistance">
            <span><MessageCircle size={18} aria-hidden="true" /> Dúvidas sobre algum produto? A gente ajuda você a escolher.</span>
            <a href="#contato" onClick={(event) => scrollToSection(event, "contato")}>Converse com a equipe <ArrowDownRight size={19} aria-hidden="true" /></a>
          </div>
        </section>
        <Contact />
      </main>
    </>
  );
}

export default App;
