function ProductPrice({ product }) {
  const format = (value) => value.toLocaleString("pt-BR", {
    style: "currency",
    currency: product.currency || "BRL",
  });
  const hasPrice = Number.isFinite(product.price);

  return (
    <div className="product-pricing">
      <strong className="product-price">
        {hasPrice ? format(product.price) : "Preço não informado"}
      </strong>
    </div>
  );
}

export default ProductPrice;
