import { useTheme } from "../../context/ThemeContext";

// ──────────────────────────────────────────────────────────────────────────────
// CardWrapper — Functional Component (Task 2)
// Demonstrates: props.children for flexible, reusable container composition
// ──────────────────────────────────────────────────────────────────────────────
function CardWrapper({ title, className = "", children }) {
  const { theme } = useTheme();

  return (
    <div
      className={`
        rounded-xl border backdrop-blur-sm transition-all duration-200
        ${theme === "dark"
          ? "bg-white/[0.04] border-white/[0.06] text-white"
          : "bg-white border-gray-200/60 text-gray-900"
        }
        ${className}
      `}
    >
      {/* Optional card header — conditional rendering with && (Task 4) */}
      {title && (
        <div className={`px-5 pt-4 pb-2 border-b ${
          theme === "dark" ? "border-white/[0.06]" : "border-gray-100"
        }`}>
          <h3 className="font-semibold text-sm tracking-tight">{title}</h3>
        </div>
      )}

      {/* Renders whatever children are composed inside <CardWrapper> */}
      <div className="p-4">{children}</div>
    </div>
  );
}

export default CardWrapper;
