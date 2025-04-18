import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Filter, X, Search } from "lucide-react";

interface CategorySelectorProps {
  categories: string[];
  value: string;
  onChange: (cat: string) => void;
}

export default function CategorySelector({
  categories,
  value,
  onChange,
}: CategorySelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal on outside click or Escape
  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent | KeyboardEvent) {
      if (e instanceof KeyboardEvent && e.key === "Escape") setOpen(false);
      if (
        e instanceof MouseEvent &&
        modalRef.current &&
        !modalRef.current.contains(e.target as Node)
      )
        setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    document.addEventListener("keydown", handle);
    return () => {
      document.removeEventListener("mousedown", handle);
      document.removeEventListener("keydown", handle);
    };
  }, [open]);

  // Filtered categories
  const filtered = search
    ? categories.filter((c) => c.toLowerCase().includes(search.toLowerCase()))
    : categories;

  return (
    <>
      <button
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-background dark:bg-background border border-border dark:border-border text-foreground dark:text-foreground font-medium shadow-sm hover:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 min-w-[180px] cursor-pointer"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        type="button"
      >
        <Filter className="text-primary" size={20} />
        <span className="truncate">{value ? value : "All Categories"}</span>
        <svg
          width="18"
          height="18"
          fill="none"
          viewBox="0 0 20 20"
          className="ml-auto text-muted-foreground"
        >
          <path
            d="M6 8l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-20 flex items-center justify-center bg-black/30 dark:bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-modal="true"
            role="dialog"
          >
            <motion.div
              ref={modalRef}
              className="relative bg-background dark:bg-background rounded-2xl shadow-2xl border border-border dark:border-border w-full max-w-md mx-4 p-6 flex flex-col gap-4"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
                transition: { type: "spring", stiffness: 120, damping: 18 },
              }}
              exit={{ scale: 0.96, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span
                  className="text-lg font-bold text-foreground"
                  style={{ fontFamily: "var(--font-geist-sans)" }}
                >
                  Select Category
                </span>
                <button
                  className="p-2 rounded-full hover:bg-primary/10 text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  type="button"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex items-center gap-2 bg-background dark:bg-background border border-border dark:border-border rounded-lg px-3 py-2 mb-2">
                <Search className="text-muted-foreground" size={18} />
                <input
                  className="flex-1 bg-transparent outline-none text-foreground dark:text-foreground font-medium placeholder:text-muted-foreground"
                  placeholder="Search categories…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoFocus
                  aria-label="Search categories"
                />
              </div>
              <div className="overflow-y-auto max-h-64 flex flex-col gap-1 pr-1">
                <button
                  className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${
                    !value
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-primary/10 text-foreground dark:text-foreground"
                  }`}
                  onClick={() => {
                    onChange("");
                    setOpen(false);
                  }}
                  type="button"
                >
                  All Categories
                </button>
                {filtered.length === 0 && (
                  <span className="text-muted-foreground px-4 py-2 text-sm">
                    No categories found.
                  </span>
                )}
                {filtered.map((cat) => (
                  <button
                    key={cat}
                    className={`w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${
                      value === cat
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-primary/10 text-foreground dark:text-foreground"
                    }`}
                    onClick={() => {
                      onChange(cat);
                      setOpen(false);
                    }}
                    type="button"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
