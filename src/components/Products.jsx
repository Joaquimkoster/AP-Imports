import { useEffect, useMemo, useState } from "react";
import { Search, ArrowUpRight, ChevronDown, ChevronLeft, ChevronRight, X, PackageSearch, Sparkles } from "lucide-react";
import ScrollScene from "./ScrollScene";
import { whatsappUrl } from "../data/contact";
import "./Products.css";

const categories = [
  { id: "todos", name: "Todos" },
  { id: "eletronicos", name: "Eletrônicos" },
  { id: "perfumes", name: "Perfumes" },
  { id: "lazer-hobby-camping", name: "Lazer, Hobby e Camping" },
  { id: "saude-beleza-moda", name: "Saúde, Beleza e Moda" },
  { id: "ofertas-promocoes", name: "Ofertas e Promoções" },
];

const ITEMS_PER_PAGE = 8;

function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
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

  // FILTRAR E ORDENAR
  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

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
    setSearch("");
    setCategory("todos");
    setSort("default");
    setPage(1);
  }

  // WHATSAPP
  function orderProduct(product) {
    const message = `Olá! Tenho interesse no produto: ${product.name}. Gostaria de mais informações.`;
    const url = whatsappUrl(message);
    if (!url) {
      window.location.hash = "contato";
      return;
    }

    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <section className="products" id="produtos" aria-labelledby="products-title">
      <div className="products-container">

        {/* CABEÇALHO */}
        <div className="products-header">
          <div>
            <span className="products-label">NOSSO CATÁLOGO</span>

            <h2 id="products-title">
              Descubra nossos <span>produtos.</span>
            </h2>
          </div>

          <p>
            Uma seleção de produtos importados para você.
          </p>
        </div>

        <div className="products-controls">
          {/* PESQUISA E ORDENAÇÃO */}
          <div className="products-toolbar">
            <div className="products-search">
              <Search size={20} aria-hidden="true" />

              <input
                type="search"
                placeholder="O que você está procurando?"
                aria-label="Buscar produtos"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
              {search && (
                <button
                  type="button"
                  className="products-search-clear"
                  aria-label="Limpar busca"
                  onClick={() => {
                    setSearch("");
                    setPage(1);
                  }}
                >
                  <X size={16} aria-hidden="true" />
                </button>
              )}
            </div>

            <div className="products-sort-field">
              <select
                className="products-sort"
                value={sort}
                aria-label="Ordenar produtos"
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
              >
                <option value="default">Ordenar: seleção da loja</option>
                <option value="price-low">Menor preço</option>
                <option value="price-high">Maior preço</option>
                <option value="name">Nome A-Z</option>
              </select>
              <ChevronDown size={16} aria-hidden="true" />
            </div>
          </div>

          <div className="products-mobile-category">
            <label htmlFor="products-category-select">Categoria</label>
            <div className="products-category-field">
              <select
                id="products-category-select"
                className="products-category-select"
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value);
                  setPage(1);
                }}
              >
                {categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.id === "todos" ? "Todas as categorias" : item.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} aria-hidden="true" />
            </div>
          </div>

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
        </div>

        {/* CONTADOR */}
        {!loading && !error && (
          <div className="products-results">
            <p className="products-count" aria-live="polite" aria-atomic="true">
              <strong>{String(filteredProducts.length).padStart(2, "0")}</strong>
              {filteredProducts.length === 1 ? "produto encontrado" : "produtos encontrados"}
            </p>
            {hasFilters ? (
              <button type="button" className="products-reset" onClick={resetFilters}>
                <X size={14} aria-hidden="true" />
                Limpar filtros
              </button>
            ) : (
              <span className="products-results-note">Uma seleção para você</span>
            )}
          </div>
        )}

        {/* CARREGAMENTO */}
        {loading && (
          <div className="products-loading" role="status">
            <p className="products-message">Carregando nossa seleção...</p>
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
              {visibleProducts.map((product, index) => (
                <ScrollScene
                  as="article"
                  className="product-card"
                  key={product.id}
                  delay={(index % 3) * 40}
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

                    {product.featured && (
                      <span className="product-badge">
                        <Sparkles size={12} strokeWidth={1.5} aria-hidden="true" />
                        Destaque
                      </span>
                    )}
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
                      onClick={() => orderProduct(product)}
                    >
                      {product.available ? (
                        <span>Consultar<span className="product-button-detail"> produto</span></span>
                      ) : "Indisponível"}

                      {product.available && (
                        <ArrowUpRight size={17} />
                      )}
                    </button>
                  </div>
                </ScrollScene>
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
    </section>
  );
}

export default Products;
