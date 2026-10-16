import { ArrowUpRight, Tags } from "lucide-react";
import "./Categories.css";

const categories = [
  {
    id: "eletronicos",
    name: "Eletrônicos",
    image: "/images/Eletronicos.webp",
  },
  {
    id: "perfumes",
    name: "Perfumes",
    image: "/images/Perfumes.webp",
  },
  {
    id: "lazer-hobby-camping",
    name: "Lazer, Hobby e Camping",
    image: "/images/Lazer.webp",
  },
  {
    id: "saude-beleza-moda",
    name: "Saúde, Beleza e Moda",
    image: "/images/Saude.webp",
  },
  {
    id: "ofertas-promocoes",
    name: "Ofertas e Promoções",
    icon: Tags,
  },
];

function Categories() {
  return (
    <section className="categories" id="categorias" aria-labelledby="categories-title">
      <div className="categories-container">

        <div className="categories-header">
          <div>
            <span className="categories-label">
              NOSSA SELEÇÃO
            </span>

            <h2 id="categories-title">
              Explore nossas <span>categorias.</span>
            </h2>
          </div>

          <p>
            Uma seleção de produtos importados para
            diferentes estilos e necessidades.
          </p>
        </div>

        <div className="categories-grid">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <a
                key={category.id}
                href={`#produtos?categoria=${category.id}`}
                className={`category-card${category.id === "ofertas-promocoes" ? " category-card-offers" : ""}`}
              >
                <div className="category-visual" aria-hidden="true">
                  {category.image ? (
                    <img
                      className="category-image"
                      src={category.image}
                      alt=""
                      loading="lazy"
                      width="1536"
                      height="1024"
                    />
                  ) : (
                    <Icon className="category-icon" size={48} strokeWidth={1.2} />
                  )}
                </div>

                <div className="category-info">
                  <h3>{category.name}</h3>
                  <ArrowUpRight size={18} className="category-arrow" aria-hidden="true" />
                </div>
              </a>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default Categories;
