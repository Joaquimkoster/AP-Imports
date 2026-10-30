import { ShieldCheck, Package, Headphones } from "lucide-react";
import "./CatalogBanner.css";

function CatalogBanner() {
  return (
    <div className="catalog-banner" aria-labelledby="catalog-title">
      <div className="banner-brand">
        <img src="/images/Logo.webp" alt="A&P Imports" width="180" height="180" />
      </div>
      <div className="banner-content">
        <span className="banner-eyebrow">PRODUTOS IMPORTADOS</span>
        <h1 id="catalog-title">Qualidade sem <span>fronteiras.</span></h1>
        <p>Perfumes, eletrônicos, acessórios e muito mais.</p>
        <div className="banner-benefits">
          <span><ShieldCheck aria-hidden="true" /><span>Qualidade e<br /><strong>confiança</strong></span></span>
          <span><Package aria-hidden="true" /><span>Produtos<br /><strong>selecionados</strong></span></span>
          <span><Headphones aria-hidden="true" /><span>Atendimento<br /><strong>personalizado</strong></span></span>
        </div>
      </div>
    </div>
  );
}

export default CatalogBanner;
