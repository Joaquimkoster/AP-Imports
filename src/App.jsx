import { ArrowDownRight, MessageCircle } from "lucide-react";
import CatalogBanner from "./components/CatalogBanner";
import Products from "./components/Products";
import Contact from "./components/Contact";
import WhatsAppFloat from "./components/WhatsAppFloat";
import { scrollToSection } from "./utils/scrollToSection";
import "./App.css";

function App() {
  return (
    <>
      <main>
        <section id="catalogo" className="catalog-container" aria-labelledby="catalog-title">
          <CatalogBanner />
          <Products />
          <div className="catalog-assistance">
            <span><MessageCircle size={18} aria-hidden="true" /> Dúvidas sobre algum produto? A gente ajuda você a escolher.</span>
            <a href="#contato" onClick={(event) => scrollToSection(event, "contato")}>Converse com a equipe <ArrowDownRight size={19} aria-hidden="true" /></a>
          </div>
          <Contact />
        </section>
      </main>
      <WhatsAppFloat />
    </>
  );
}

export default App;
