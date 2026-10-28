import { useMemo } from "react";
import ProductCard from "./ProductCard";
import CardWrapper from "./CardWrapper";
import { useTheme } from "../../context/ThemeContext";

const CATEGORIES = ["All", "Electronics", "Clothing", "Groceries", "Furniture", "Books", "Other"];
const STOCK_FILTERS = ["All", "In Stock", "Low Stock", "Out of Stock"];

// ──────────────────────────────────────────────────────────────────────────────
// ProductList — Functional Component (Tasks 2, 4, 5)
// Hooks used: useMemo for filtered list computation
// ──────────────────────────────────────────────────────────────────────────────
function ProductList({ products, onEdit, onDelete, filterCategory, filterStock, onCategoryChange, onStockChange }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // useMemo: compute filtered products only when dependencies change (Task 5)
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const catMatch = filterCategory === "All" || p.category === filterCategory;
      const stockMatch =
        filterStock === "All" ||
        (filterStock === "Out of Stock" && p.quantity === 0) ||
        (filterStock === "Low Stock"    && p.quantity > 0 && p.quantity <= 10) ||
        (filterStock === "In Stock"     && p.quantity > 10);
      return catMatch && stockMatch;
    });
  }, [products, filterCategory, filterStock]);

  const pillBase = "filter-pill";
  const pillActive = "active";
  const pillInactive = "";

  return (
    <div className="product-list">
      {/* Section header */}
      <div className="list-summary">
        <div>
          <h2 className="sr-only">Products</h2>
          {/* Dynamic JS expression (Task 4) */}
          <p className="filter-result-count">
            {filteredProducts.length} of {products.length} items
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="filter-controls">
        {/* Category filter — Array.map() with key props (Task 4) */}
        <div className="filter-row">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`${pillBase} ${filterCategory === cat ? pillActive : pillInactive}`}
              aria-pressed={filterCategory === cat}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Stock status filter — Array.map() with key props (Task 4) */}
        <div className="filter-row stock-row">
          {STOCK_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => onStockChange(s)}
              className={`${pillBase} ${filterStock === s ? pillActive : pillInactive}`}
              aria-pressed={filterStock === s}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Conditional rendering with ternary — empty state (Task 4) */}
      {filteredProducts.length === 0 ? (
        <CardWrapper>
          <div className="text-center py-16">
            <div className={`w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center ${
              isDark ? "bg-white/[0.04]" : "bg-gray-50"
            }`}>
              <svg className={`w-5 h-5 ${isDark ? "text-gray-600" : "text-gray-300"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className={`text-sm font-medium ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              {/* Ternary for empty vs filtered empty (Task 4) */}
              {products.length === 0
                ? "No products yet"
                : "No matching products"}
            </p>
            <p className={`text-xs mt-1 ${
              isDark ? "text-gray-600" : "text-gray-400"
            }`}>
              {/* Logical && (Task 4) */}
              {products.length === 0
                ? "Add your first product to get started"
                : "Try adjusting your filters"}
            </p>
          </div>
        </CardWrapper>
      ) : (
        /* Product grid — Array.map() with unique key props (Task 4) */
        <div className="product-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductList;
