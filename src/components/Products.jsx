import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowUpRight, ChevronLeft, ChevronRight, X, PackageSearch, Package } from "lucide-react";
import ProductSearch from "./Navbar";
import ProductSort from "./ProductSort";
import ProductModal from "./ProductModal";
import ProductPrice from "./ProductPrice";
import "./Products.css";

const categories = [
  { id: "todos", name: "Todos" },
  { id: "eletronicos", name: "Eletrônicos" },
  { id: "notebooks", name: "Notebooks" },
  { id: "perfumes", name: "Perfumes" },
  { id: "beleza", name: "Beleza" },
  { id: "saude", name: "Saúde" },
  { id: "moda", name: "Moda" },
  { id: "casa", name: "Casa" },
  { id: "alimentos", name: "Alimentos" },
  { id: "medicamentos", name: "Medicamentos" },
];

const ROWS_PER_PAGE = 5;
const MOBILE_QUERY = "(max-width: 600px)";

// 5 linhas por página: 3 colunas no desktop, 2 no celular
function useItemsPerPage(onChange) {
  const [columns, setColumns] = useState(() =>
    window.matchMedia(MOBILE_QUERY).matches ? 2 : 3
  );

  useEffect(() => {
    const media = window.matchMedia(MOBILE_QUERY);
    const update = () => {
      setColumns(media.matches ? 2 : 3);
      onChange();
    };
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, [onChange]);

  return columns * ROWS_PER_PAGE;
}

function Products() {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState("todos");
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(1);
  const resetPage = useCallback(() => setPage(1), []);
  const itemsPerPage = useItemsPerPage(resetPage);
  const [selected, setSelected] = useState(null);
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
      const normalize = (value) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
      const searchableText = [product.name, product.description, product.dosage, product.presentation, product.totalAmount].filter(Boolean).join(" ");
      const matchesSearch = normalize(searchableText).includes(normalize(search.trim()));

      const matchesCategory =
        category === "todos" ||
        product.category === category;

      return matchesSearch && matchesCategory;
    });

    result = [...result];

    if (sort === "price-low" || sort === "price-high") {
      result.sort((a, b) => {
        const aHasPrice = Number.isFinite(a.price);
        const bHasPrice = Number.isFinite(b.price);

        if (!aHasPrice || !bHasPrice) {
          return Number(bHasPrice) - Number(aHasPrice);
        }

        return sort === "price-low" ? a.price - b.price : b.price - a.price;
      });
    }

    if (sort === "newest") {
      result.sort((a, b) => b.id - a.id);
    }

    if (sort === "default") {
      // Intercala as categorias para a vitrine não começar com um tipo só
      const groups = new Map();
      result.forEach((item) => {
        if (!groups.has(item.category)) groups.set(item.category, []);
        groups.get(item.category).push(item);
      });
      const queues = [...groups.values()];
      const mixed = [];
      while (queues.some((queue) => queue.length)) {
        queues.forEach((queue) => queue.length && mixed.push(queue.shift()));
      }
      result = mixed;
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
    filteredProducts.length / itemsPerPage
  );

  const visibleProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const hasFilters = search !== "" || category !== "todos" || sort !== "default";

  const closeModal = useCallback(() => setSelected(null), []);

  function handleSearchChange(value) {
    setSearch(value);
    resetPage();
  }

  function changePage(value) {
    setPage(value);
    document.getElementById("categorias")?.scrollIntoView({
      block: "start",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
    });
  }

  function resetFilters() {
    setSearch("");
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
          <ProductSort
            className="products-category-field"
            label="Filtrar por categoria"
            prefix="Categoria: "
            options={categories.map((item) => ({ value: item.id, label: item.name }))}
            value={category}
            onChange={(value) => { setCategory(value); setPage(1); }}
          />
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

        <ProductSearch search={search} onSearchChange={handleSearchChange} />

        {/* CONTADOR */}
        {!loading && !error && (
          <div className="products-results">
            <p className="products-count" aria-live="polite" aria-atomic="true">
              <strong>{String(filteredProducts.length).padStart(2, "0")}</strong>
              {filteredProducts.length === 1 ? "produto encontrado" : "produtos encontrados"}
            </p>

          </div>
        )}

        <div className="products-content" role="region" aria-label="Resultados do catálogo" tabIndex={0}>
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
                  <button type="button" className="product-image" aria-label={`Ver detalhes de ${product.name}`} onClick={() => setSelected(product)}>
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        loading="lazy"
                        decoding="async"
                        width="600"
                        height="600"
                      />
                    ) : (
                      <span className="product-image-empty" aria-hidden="true">
                        <Package size={44} strokeWidth={1.1} />
                        <small>Foto em breve</small>
                      </span>
                    )}
                  </button>

                  <div className="product-info">
                    <span className="product-category">
                      {categories.find(
                        (item) => item.id === product.category
                      )?.name || product.category}
                    </span>

                    <h3>{product.name}</h3>

                    {product.category === "medicamentos" && (
                      <p className="product-presentation">
                        {product.dosage || "Dose não informada"}
                        {product.totalAmount && ` · Total: ${product.totalAmount}`}
                      </p>
                    )}

                    <ProductPrice product={product} />

                    <button
                      type="button"
                      className="product-button"
                      aria-label={`Ver detalhes de ${product.name}`}
                      onClick={() => setSelected(product)}
                    >
                      <span>{product.available ? "Falar com a equipe" : "Ver detalhes"}</span>
                      <ArrowUpRight size={17} />
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
                  onClick={() => changePage(page - 1)}
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
                  onClick={() => changePage(page + 1)}
                >
                  <ChevronRight size={19} />
                </button>
              </div>
            )}
          </>
        )}
        </div>
      </div>

      {selected && (
        <ProductModal
          product={selected}
          categoryName={categories.find((item) => item.id === selected.category)?.name || selected.category}
          onClose={closeModal}
        />
      )}
    </section>
  );
}

export default Products;
