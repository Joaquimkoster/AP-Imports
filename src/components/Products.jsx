import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, X, PackageSearch } from "lucide-react";
import { scrollToSection } from "../utils/scrollToSection";
import ProductSearch from "./Navbar";
import ProductSort from "./ProductSort";
import "./Products.css";

const categories = [
  { id: "todos", name: "Todos" },
  { id: "eletronicos", name: "Eletrônicos" },
  { id: "perfumes", name: "Perfumes" },
  { id: "lazer-hobby-camping", name: "Lazer, Hobby e Camping" },
  { id: "saude-beleza-moda", name: "Saúde, Beleza e Moda" },
  { id: "ofertas-promocoes", name: "Ofertas e Promoções" },
];

const ITEMS_PER_PAGE = 24;

function Products({ search, onSearchChange }) {
  const resultsRef = useRef(null);
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("todos");
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // CARREGAR PRODUTOS
  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        const response = await fetch(
          `${import.meta.env.BASE_URL}products.json`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("Erro ao carregar produtos");
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error("Formato inválido do catálogo");
        }

        setProducts(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error(err);
          setError(true);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadProducts();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search]);

  useEffect(() => {
    if (resultsRef.current) resultsRef.current.scrollTop = 0;
  }, [category, sort, page, search]);

  // FILTRAR E ORDENAR
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const normalize = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      const matchesSearch = normalize(product.name).includes(normalize(search.trim()));

      const matchesCategory =
        category === "todos" ||
        product.category === category;

      return matchesSearch && matchesCategory;
    });

    result = [...result];

    if (sort === "price-low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sort === "price-high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sort === "name") {
      result.sort((a, b) =>
        a.name.localeCompare(b.name, "pt-BR")
      );
    }

    return result;
  }, [products, search, category, sort]);

  // PAGINAÇÃO
  const totalPages = Math.ceil(
    filteredProducts.length / ITEMS_PER_PAGE
  );

  const visibleProducts = filteredProducts.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  const hasFilters = search !== "" || category !== "todos" || sort !== "default";

  function resetFilters() {
    onSearchChange("");
    setCategory("todos");
    setSort("default");
    setPage(1);
  }

  return (
    <section className="products" id="produtos" aria-labelledby="products-title">
      <div className="products-container">

        <h2 id="products-title" className="sr-only">Catálogo de produtos</h2>
        <div className="products-controls" id="categorias">
          {/* CATEGORIAS */}
          <div className="products-categories" role="group" aria-label="Filtrar por categoria">
            {categories.map((item) => (
              <button
                key={item.id}
                type="button"
                className={
                  category === item.id
                    ? "products-category active"
                    : "products-category"
                }
                aria-pressed={category === item.id}
                onClick={() => {
                  setCategory(item.id);
                  setPage(1);
                }}
              >
                {item.name}
              </button>
            ))}
          </div>
          {!loading && !error && (
            <div className="products-results-actions">
            <ProductSort value={sort} onChange={(value) => { setSort(value); setPage(1); }} />
              <button type="button" className={`products-reset${hasFilters ? "" : " is-hidden"}`} disabled={!hasFilters} aria-hidden={!hasFilters} onClick={resetFilters}>
                <X size={14} aria-hidden="true" />
                Limpar filtros
              </button>
            </div>
          )}
        </div>

        <ProductSearch search={search} onSearchChange={onSearchChange} />

        {/* CONTADOR */}
        {!loading && !error && (
          <div className="products-results">
            <p className="products-count" aria-live="polite" aria-atomic="true">
              <strong>{String(filteredProducts.length).padStart(2, "0")}</strong>
              {filteredProducts.length === 1 ? "produto encontrado" : "produtos encontrados"}
            </p>

          </div>
        )}

        <div className="products-content" ref={resultsRef} role="region" aria-label="Resultados do catálogo" tabIndex={0}>
        {/* CARREGAMENTO */}
        {loading && (
          <div className="products-loading" role="status">
            <p className="sr-only">Carregando nossa seleção...</p>
            <div className="products-grid" aria-hidden="true">
              {Array.from({ length: 3 }, (_, index) => (
                <div className="product-skeleton" key={index} />
              ))}
            </div>
          </div>
        )}

        {/* ERRO */}
        {error && (
          <div className="products-empty" role="status">
            <PackageSearch size={32} strokeWidth={1.2} aria-hidden="true" />
            <h3>Não foi possível carregar os produtos.</h3>
            <p>Atualize a página para tentar novamente.</p>
          </div>
        )}

        {/* GRID */}
        {!loading && !error && (
          <>
            <div className="products-grid">
              {visibleProducts.map((product) => (
                <article
                  className="product-card"
                  key={product.id}
                >
                  <div className="product-image">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      decoding="async"
                      width="600"
                      height="600"
                    />


                  </div>

                  <div className="product-info">
                    <span className="product-category">
                      {categories.find(
                        (item) => item.id === product.category
                      )?.name || product.category}
                    </span>

                    <h3>{product.name}</h3>

                    <strong className="product-price">
                      {Number(product.price).toLocaleString(
                        "pt-BR",
                        {
                          style: "currency",
                          currency: "BRL",
                        }
                      )}
                    </strong>

                    <button
                      type="button"
                      className="product-button"
                      aria-label={product.available ? `Consultar ${product.name}` : `${product.name} indisponível`}
                      disabled={!product.available}
                      onClick={(event) => scrollToSection(event, "contato")}
                    >
                      {product.available ? (
                        <span>Consultar<span className="product-button-detail"> produto</span></span>
                      ) : "Indisponível"}

                      {product.available && (
                        <ArrowUpRight size={17} />
                      )}
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* SEM RESULTADOS */}
            {filteredProducts.length === 0 && (
              <div className="products-empty" role="status">
                <PackageSearch size={32} strokeWidth={1.2} aria-hidden="true" />
                <h3>Nenhum produto por aqui.</h3>
                <p>Tente outro nome ou explore as outras categorias.</p>
                {hasFilters && (
                  <button type="button" className="products-empty-reset" onClick={resetFilters}>
                    Ver todos os produtos <ArrowUpRight size={16} aria-hidden="true" />
                  </button>
                )}
              </div>
            )}

            {/* PAGINAÇÃO */}
            {totalPages > 1 && (
              <div className="products-pagination">
                <button
                  type="button"
                  aria-label="Página anterior"
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                >
                  <ChevronLeft size={19} />
                </button>

                <span>
                  {page} de {totalPages}
                </span>

                <button
                  type="button"
                  aria-label="Próxima página"
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                >
                  <ChevronRight size={19} />
                </button>
              </div>
            )}
          </>
        )}
        </div>
      </div>
    </section>
  );
}

export default Products;
