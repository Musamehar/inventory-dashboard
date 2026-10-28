import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useTheme } from "./context/ThemeContext";
import ProductForm from "./components/functional/ProductForm";
import ProductList from "./components/functional/ProductList";
import AuditLogger from "./components/class/AuditLogger";

const SEED_PRODUCTS = [
  { id: "SKU-001", name: 'MacBook Pro 14"', category: "Electronics", price: 1999.99, quantity: 25 },
  { id: "SKU-002", name: "Sony WH-1000XM5", category: "Electronics", price: 349.99, quantity: 8 },
  { id: "SKU-003", name: "Nike Air Max 270", category: "Clothing", price: 129.99, quantity: 0 },
  { id: "SKU-004", name: "Ergonomic Office Chair", category: "Furniture", price: 449, quantity: 3 },
  { id: "SKU-005", name: "JavaScript: The Good Parts", category: "Books", price: 29.95, quantity: 42 },
  { id: "SKU-006", name: "Organic Almond Milk", category: "Groceries", price: 5.49, quantity: 60 },
];

function App() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem("inventoryProducts");
      return saved ? JSON.parse(saved) : SEED_PRODUCTS;
    } catch {
      return SEED_PRODUCTS;
    }
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStock, setFilterStock] = useState("All");
  const auditRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("inventoryProducts", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    document.title = `Forma Inventory · ${products.length} Products`;
  }, [products.length]);

  const metrics = useMemo(() => {
    const totalValue = products.reduce((sum, product) => sum + product.price * product.quantity, 0);
    const totalQty = products.reduce((sum, product) => sum + product.quantity, 0);
    const inStock = products.filter((product) => product.quantity > 10).length;
    const lowStock = products.filter((product) => product.quantity > 0 && product.quantity <= 10).length;
    const outOfStock = products.filter((product) => product.quantity === 0).length;
    return { totalValue, totalQty, inStock, lowStock, outOfStock };
  }, [products]);

  const handleAddProduct = useCallback((product) => {
    setProducts((previous) => {
      const exists = previous.find((item) => item.id === product.id);
      if (exists) {
        auditRef.current?.addLog(`Updated "${product.name}"`, "warning");
        return previous.map((item) => (item.id === product.id ? product : item));
      }
      auditRef.current?.addLog(`Added "${product.name}"`, "success");
      return [product, ...previous];
    });
    setEditingProduct(null);
  }, []);

  const handleDelete = useCallback((id) => {
    const product = products.find((item) => item.id === id);
    if (product && window.confirm(`Delete "${product.name}"?`)) {
      auditRef.current?.addLog(`Removed "${product.name}"`, "error");
      setProducts((previous) => previous.filter((item) => item.id !== id));
    }
  }, [products]);

  const handleEdit = useCallback((product) => {
    setEditingProduct(product);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleCancelEdit = useCallback(() => setEditingProduct(null), []);

  const metricItems = [
    { label: "Total products", value: products.length, sub: `${metrics.totalQty} units` },
    { label: "Inventory value", value: `$${metrics.totalValue.toLocaleString("en", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`, sub: "total retail" },
    { label: "In stock", value: metrics.inStock, dot: true, sub: "items available" },
    { label: "Low stock", value: metrics.lowStock, dot: true, sub: "need reorder" },
    { label: "Out of stock", value: metrics.outOfStock, dot: true, sub: "unavailable" },
  ];

  return (
    <div className={`app-shell ${isDark ? "theme-dark" : ""}`}>
      <header className="topbar">
        <a className="brand" href="#" aria-label="Forma inventory home">
          <span className="brand-mark" aria-hidden="true">F</span>
          <span className="brand-name">forma<span>.</span></span>
        </a>
        <div className="topbar-center"><span className="live-dot" /> LIVE INVENTORY <span className="topbar-divider">/</span> STUDIO 01</div>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {isDark ? (
            <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5Z" /></svg>
          )}
          <span>{isDark ? "Light" : "Dark"} mode</span>
        </button>
      </header>

      <main className="page-wrap">
        <section className="hero">
          <div className="hero-copy">
            <p className="eyebrow"><span>01</span> YOUR STOCKROOM, IN FOCUS</p>
            <h1>Good things<br />in <em>good</em> supply<span className="hero-period">.</span></h1>
            <p className="hero-description">A considered view of everything you make, move, and keep.</p>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="art-ring art-ring-one" />
            <div className="art-ring art-ring-two" />
            <span className="art-asterisk">✳</span>
            <div className="art-caption"><span>FORM / FUNCTION</span><span>EST. 2024</span></div>
            <span className="art-index">F—01</span>
          </div>
        </section>

        <section className="metrics-strip" aria-label="Inventory overview">
          {metricItems.map((item, index) => (
            <div className={`metric-item metric-${index + 1}`} key={item.label}>
              <div className="metric-label">
                {item.dot && <span className={`metric-dot dot-${index === 2 ? "green" : index === 3 ? "amber" : "red"}`} />}
                {item.label}
              </div>
              <p className="metric-value">{item.value}</p>
              <p className="metric-sub">{item.sub}</p>
            </div>
          ))}
          <div className="metrics-note"><span>↗</span> A LITTLE MORE<br />ORDER, EVERY DAY.</div>
        </section>

        <div className="workspace">
          <aside className="workspace-aside">
            <div className="section-kicker"><span>01</span> THE BACK OFFICE</div>
            <ProductForm
              onAddProduct={handleAddProduct}
              editingProduct={editingProduct}
              onCancelEdit={handleCancelEdit}
            />
            <div className="activity-panel">
              <div className="section-kicker"><span>02</span> RECENT MOVEMENT</div>
              <AuditLogger ref={auditRef} />
            </div>
          </aside>
          <section className="inventory-section">
            <div className="inventory-heading">
              <div>
                <div className="section-kicker"><span>03</span> THE COLLECTION</div>
                <h2>On the shelves<span>.</span></h2>
              </div>
              <div className="inventory-count"><span>{products.length.toString().padStart(2, "0")}</span> PRODUCTS</div>
            </div>
            <ProductList
              products={products}
              onEdit={handleEdit}
              onDelete={handleDelete}
              filterCategory={filterCategory}
              filterStock={filterStock}
              onCategoryChange={setFilterCategory}
              onStockChange={setFilterStock}
            />
          </section>
        </div>
      </main>
      <footer className="site-footer">
        <span>FORMA <i>·</i> INVENTORY STUDIO</span>
        <span>MADE TO KEEP THINGS MOVING — {new Date().getFullYear()}</span>
      </footer>
    </div>
  );
}

export default App;
