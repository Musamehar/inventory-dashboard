function ProductCard({ product, onEdit, onDelete }) {
  const stockState = product.quantity === 0
    ? "out"
    : product.quantity <= 10
      ? "low"
      : "available";
  const stockLabel = stockState === "out"
    ? "Out of stock"
    : stockState === "low"
      ? "Low stock"
      : "In stock";

  return (
    <article className={`product-card card-animate stock-${stockState}`}>
      <div className="product-card-top">
        <span className="product-category">{product.category}</span>
        <span className="stock-status"><span />{stockLabel}</span>
      </div>
      <div className="product-card-main">
        <p className="product-sku">{product.id}</p>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-data">
          <div>
            <span className="data-label">Unit price</span>
            <strong>${parseFloat(product.price).toFixed(2)}</strong>
          </div>
          <div className="quantity-data">
            <span className="data-label">On hand</span>
            <strong>{product.quantity.toString().padStart(2, "0")}<small> units</small></strong>
          </div>
        </div>
        {product.quantity > 0 && product.quantity <= 10 && (
          <p className="stock-note">↗ Replenishment recommended</p>
        )}
        {product.quantity === 0 && <p className="stock-note">Currently unavailable</p>}
      </div>
      <div className="product-actions">
        <button onClick={() => onEdit(product)}>Edit details <span>↗</span></button>
        <button onClick={() => onDelete(product.id)} aria-label={`Remove ${product.name}`}>Remove</button>
      </div>
    </article>
  );
}

export default ProductCard;
