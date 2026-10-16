import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import Products from "./components/Products";

import "./App.css";

function App() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Categories />
        <Products />

        <section id="sobre" className="info-section">
          <h2>Sobre nós</h2>
        </section>

        <section id="contato" className="info-section">
          <h2>Contato</h2>
        </section>
      </main>
    </>
  );
}

export default App;
