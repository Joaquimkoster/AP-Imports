import { useEffect, useRef } from "react";
import { MessageCircle, X } from "lucide-react";
import { teamContacts, whatsappUrl } from "../data/contact";

function formatPrice(product) {
  return Number.isFinite(product.price)
    ? product.price.toLocaleString("pt-BR", { style: "currency", currency: product.currency || "BRL" })
    : "Sob consulta";
}

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

  const price = formatPrice(product);
  const message = (name) =>
    `Olá, ${name}! Vi no site da A&P Imports o produto ${product.name}${Number.isFinite(product.price) ? ` (${price})` : ""} e gostaria de mais informações.`;

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
          <img src={product.image} alt={product.name} />
        </div>

        <div className="product-modal-info">
          <span className="product-category">{categoryName}</span>
          <h3 id="product-modal-title">{product.name}</h3>
          <strong className="product-price">{price}</strong>
          {product.description && <p className="product-modal-description">{product.description}</p>}

          {product.available ? (
            <div className="product-modal-actions">
              <span>Peça pelo WhatsApp:</span>
              {teamContacts.map((member) => {
                const url = whatsappUrl(message(member.name), member.whatsapp);
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
