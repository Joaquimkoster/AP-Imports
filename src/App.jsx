import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import "./App.css";

function App() {
  return (
    <>
      <Navbar />

      <main>
        {/* HERO COM PRODUTOS 3D */}
        <Hero />

        {/* CATEGORIAS */}
        <section
          id="categorias"
          style={{ minHeight: "60vh", padding: "100px 5%" }}
        >
          <h2>Categorias</h2>
        </section>

        {/* PRODUTOS */}
        <section
          id="produtos"
          style={{ minHeight: "60vh", padding: "100px 5%" }}
        >
          <h2>Produtos</h2>
        </section>

        {/* SOBRE */}
        <section
          id="sobre"
          style={{ minHeight: "40vh", padding: "100px 5%" }}
        >
          <h2>Sobre nós</h2>
        </section>

        {/* CONTATO */}
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