import { ArrowUpRight, Gem, Layers3, Sparkles } from "lucide-react";
import "./About.css";

const values = [
  {
    icon: Gem,
    title: "Cuidado na seleção",
    description: "Uma seleção que valoriza os detalhes de cada produto.",
  },
  {
    icon: Layers3,
    title: "Diferentes possibilidades",
    description: "Tecnologia, perfumaria, beleza e lazer em um só lugar.",
  },
  {
    icon: Sparkles,
    title: "Seu estilo, suas escolhas",
    description: "Produtos para acompanhar sua rotina e o que você gosta.",
  },
];

function About() {
  return (
    <section id="sobre" className="about" aria-labelledby="about-title">
      <div className="about-container">
        <div className="about-brand">
          <div className="about-brand-orbit" aria-hidden="true" />
          <img
            src="/images/Logo.webp"
            alt="A&P Imports"
            className="about-logo"
            width="1254"
            height="1254"
            loading="lazy"
          />
          <div className="about-brand-caption">
            <span>ESCOLHAS QUE INSPIRAM</span>
            <p>Um mundo de possibilidades.<br />O seu jeito de viver.</p>
          </div>
        </div>

        <div className="about-content">
          <span className="about-label">SOBRE A A&P IMPORTS</span>
          <h2 id="about-title">Mais possibilidades.<br /><span>Mais do seu mundo.</span></h2>
          <p className="about-intro">
            Acreditamos que uma boa escolha faz diferença no dia a dia.
            Por isso, reunimos produtos importados para diferentes estilos,
            interesses e momentos — de um novo perfume à tecnologia que
            acompanha você.
          </p>

          <ul className="about-values">
            {values.map(({ icon: Icon, title, description }) => (
              <li key={title}>
                <span className="about-value-icon" aria-hidden="true">
                  <Icon size={21} strokeWidth={1.4} />
                </span>
                <div>
                  <h3>{title}</h3>
                  <p>{description}</p>
                </div>
              </li>
            ))}
          </ul>

          <a className="about-link" href="#produtos">
            Encontre sua próxima escolha
            <ArrowUpRight size={19} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}

export default About;
