import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { MessageCircle, Package, X } from "lucide-react";
import { teamContacts, whatsappUrl } from "../data/contact";
import ProductPrice from "./ProductPrice";

function ProductModal({ product, categoryName, onClose }) {
  const closeRef = useRef(null);
  const backdropRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    const previous = document.activeElement;
    const overflow = document.body.style.overflow;
    const background = Array.from(document.body.children)
      .filter((element) => element !== backdropRef.current)
      .map((element) => ({ element, inert: element.inert }));

    background.forEach(({ element }) => { element.inert = true; });
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
      if (event.key !== "Tab") return;

      const focusable = Array.from(dialogRef.current.querySelectorAll(
        'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])'
      )).filter((element) => element.getClientRects().length > 0);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const outside = !dialogRef.current.contains(document.activeElement);

      if (event.shiftKey && (document.activeElement === first || outside)) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && (document.activeElement === last || outside)) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      background.forEach(({ element, inert }) => { element.inert = inert; });
      document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus?.({ preventScroll: true });
    };
  }, [onClose]);

  return createPortal(
    <div className="product-modal-backdrop" ref={backdropRef} onClick={onClose}>
      <div
        className="product-modal"
        ref={dialogRef}
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
                const url = whatsappUrl(`Olá, tudo bem? Gostei do ${product.name}, pode me falar mais sobre?`, member.whatsapp);
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
    </div>,
    document.body
  );
}

export default ProductModal;
