import { useEffect, useRef } from "react";
import { MessageCircle, Package, X } from "lucide-react";
import { teamContacts, whatsappUrl } from "../data/contact";
import ProductPrice from "./ProductPrice";

function ProductModal({ product, categoryName, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
      previous?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="product-modal-backdrop" onClick={onClose}>
      <div
        className="product-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <button ref={closeRef} type="button" className="product-modal-close" aria-label="Fechar" onClick={onClose}>
          <X size={20} aria-hidden="true" />
        </button>

        <div className="product-modal-image">
          {product.image ? (
            <img src={product.image} alt={product.name} />
          ) : (
            <span className="product-image-empty" aria-hidden="true">
              <Package size={56} strokeWidth={1.1} />
              <small>Foto em breve</small>
            </span>
          )}
        </div>

        <div className="product-modal-info">
          <span className="product-category">{categoryName}</span>
          <h3 id="product-modal-title">{product.name}</h3>
          <ProductPrice product={product} />
          {product.category === "medicamentos" && (
            <dl className="product-specifications">
              <div><dt>Dose / concentração</dt><dd>{product.dosage || "Não informada no catálogo"}</dd></div>
              {product.totalAmount && <div><dt>Conteúdo total</dt><dd>{product.totalAmount}</dd></div>}
              <div><dt>Apresentação</dt><dd>{product.presentation}</dd></div>
            </dl>
          )}
          {product.description && <p className="product-modal-description">{product.description}</p>}

          {product.available ? (
            <div className="product-modal-actions">
              <span>Fale com a equipe pelo WhatsApp:</span>
              {teamContacts.map((member) => {
                const url = whatsappUrl("Olá!", member.whatsapp);
                return url ? (
                  <a
                    key={member.name}
                    className="product-modal-whatsapp"
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MessageCircle size={18} aria-hidden="true" />
                    Falar com {member.name}
                  </a>
                ) : null;
              })}
            </div>
          ) : (
            <p className="product-modal-unavailable">Produto indisponível no momento.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
