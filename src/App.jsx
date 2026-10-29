import { useState } from "react";
import { MessageCircle } from "lucide-react";
import Navbar from "./components/Navbar";
import CatalogBanner from "./components/CatalogBanner";
import Products from "./components/Products";
import Contact from "./components/Contact";
import { whatsappUrl } from "./data/contact";
import "./App.css";

function App() {
  const [search, setSearch] = useState("");
  const sellerUrl = whatsappUrl("Olá! Gostaria de saber mais sobre os produtos da A&P Imports.");

  return (
    <>
      <Navbar search={search} onSearchChange={setSearch} />
      <main>
        <div className="catalog-container">
          <CatalogBanner />
          <Products search={search} onSearchChange={setSearch} />
        </div>
        <Contact />
      </main>
      <a className="floating-contact" href={sellerUrl || "#contato"} aria-label="Falar com a A&P Imports" {...(sellerUrl ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
        <MessageCircle size={28} aria-hidden="true" />
      </a>
    </>
  );
}

export default App;
