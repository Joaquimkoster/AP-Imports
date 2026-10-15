import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Categories from "./components/Categories";

import "./App.css";

function App() {
  return (
    <>
      {/* MENU DE NAVEGAÇÃO */}
      <Navbar />

      <main>
        {/* PRIMEIRA SEÇÃO - HERO 3D */}
        <Hero />

        {/* SEGUNDA SEÇÃO - CATEGORIAS */}
        <Categories />

        {/* TERCEIRA SEÇÃO - PRODUTOS */}
        <section
          id="produtos"
          style={{ minHeight: "60vh", padding: "100px 5%" }}
        >
          <h2>Produtos</h2>
        </section>

        {/* QUARTA SEÇÃO - SOBRE */}
        <section
          id="sobre"
          style={{ minHeight: "40vh", padding: "100px 5%" }}
        >
          <h2>Sobre nós</h2>
        </section>

        {/* QUINTA SEÇÃO - CONTATO */}
        <section
          id="contato"
          style={{ minHeight: "40vh", padding: "100px 5%" }}
        >
          <h2>Contato</h2>
        </section>
      </main>
    </>
  );
}

export default App;