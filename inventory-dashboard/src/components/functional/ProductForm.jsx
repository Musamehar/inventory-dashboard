import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "../../context/ThemeContext";

const CATEGORIES = ["Electronics", "Clothing", "Groceries", "Furniture", "Books", "Other"];

const EMPTY_FORM = { name: "", category: "Electronics", price: "", quantity: "" };

// ──────────────────────────────────────────────────────────────────────────────
// ProductForm — Functional Component (Tasks 2, 4, 5)
// Hooks used: useState, useEffect, useRef, useCallback
// ──────────────────────────────────────────────────────────────────────────────
function ProductForm({ onAddProduct, editingProduct, onCancelEdit }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [form, setForm]     = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const titleRef            = useRef(null);

  // useEffect: auto-focus the product name input on mount (Task 5)
  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  // useEffect: populate form when editing an existing product (Task 5)
  useEffect(() => {
    if (editingProduct) {
      setForm({
        name:     editingProduct.name,
        category: editingProduct.category,
        price:    String(editingProduct.price),
        quantity: String(editingProduct.quantity),
      });
      titleRef.current?.focus();
    } else {
      setForm(EMPTY_FORM);
    }
  }, [editingProduct]);

  // useCallback: stable reference for the change handler (Task 5)
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  // Validation
  const validate = () => {
    const errs = {};
    if (!form.name.trim())                 errs.name     = "Product name is required";
    if (!form.price || isNaN(form.price) || parseFloat(form.price) < 0)
                                           errs.price    = "Enter a valid price";
    if (!form.quantity || isNaN(form.quantity) || parseInt(form.quantity) < 0)
                                           errs.quantity = "Enter a valid quantity";
    return errs;
  };

  // useCallback: stable onSubmit handler (Task 5)
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const errs = validate();
      if (Object.keys(errs).length) {
        setErrors(errs);
        return;
      }

      const product = {
        id:       editingProduct ? editingProduct.id : `SKU-${Date.now()}`,
        name:     form.name.trim(),
        category: form.category,
        price:    parseFloat(form.price),
        quantity: parseInt(form.quantity),
      };

      onAddProduct(product);
      setForm(EMPTY_FORM);
      setErrors({});
      titleRef.current?.focus();
    },
    [form, editingProduct, onAddProduct]
  );

  const inputClass = "form-input";
  const labelClass = "form-label";

  const isEditing = Boolean(editingProduct);

  return (
    <form
      onSubmit={handleSubmit}
      className={`product-form ${isDark ? "is-dark" : ""}`}
    >
      {/* Ternary conditional rendering (Task 4) */}
      <h2 className="form-heading">
        {isEditing ? "Edit Product" : "New Product"}
      </h2>

      {/* Product Name — useRef attached (Task 5) */}
      <div className="form-field">
        <label className={labelClass} htmlFor="product-name">Name</label>
        <input
          id="product-name"
          ref={titleRef}
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product name"
          className={inputClass}
        />
        {/* Conditional rendering with && (Task 4) */}
        {errors.name && <p className="text-rose-500 text-[11px] mt-1 font-medium">{errors.name}</p>}
      </div>

      {/* Category */}
      <div className="form-field">
        <label className={labelClass} htmlFor="product-category">Category</label>
        <select
          id="product-category"
          name="category"
          value={form.category}
          onChange={handleChange}
          className={inputClass}
        >
          {/* Array.map() with key prop (Task 4) */}
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Price & Quantity */}
      <div className="form-pair">
        <div>
          <label className={labelClass} htmlFor="product-price">Price</label>
          <input
            id="product-price"
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="0.00"
            min="0"
            step="0.01"
            className={inputClass}
          />
          {errors.price && <p className="text-rose-500 text-[11px] mt-1 font-medium">{errors.price}</p>}
        </div>
        <div>
          <label className={labelClass} htmlFor="product-quantity">Quantity</label>
          <input
            id="product-quantity"
            type="number"
            name="quantity"
            value={form.quantity}
            onChange={handleChange}
            placeholder="0"
            min="0"
            className={inputClass}
          />
          {errors.quantity && <p className="text-rose-500 text-[11px] mt-1 font-medium">{errors.quantity}</p>}
        </div>
      </div>

      {/* Submit / Cancel */}
      <div className="flex gap-2">
        <button
          type="submit"
          className="submit-button"
        >
          {isEditing ? "Save Changes" : "Add Product"}
        </button>
        {/* Logical && — only show cancel when editing (Task 4) */}
        {isEditing && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="cancel-button"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default ProductForm;
