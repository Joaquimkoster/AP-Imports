import { useEffect, useId, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

const options = [
  { value: "default", label: "Seleção da loja" },
  { value: "price-low", label: "Menor preço" },
  { value: "price-high", label: "Maior preço" },
  { value: "name", label: "Nome A-Z" },
];

function ProductSort({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const fieldRef = useRef(null);
  const buttonRef = useRef(null);
  const listId = useId();
  const selectedIndex = options.findIndex((option) => option.value === value);

  useEffect(() => {
    if (!open) return;

    function closeOutside(event) {
      if (!fieldRef.current?.contains(event.target)) setOpen(false);
    }

    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open]);

  function select(index) {
    onChange(options[index].value);
    setOpen(false);
    buttonRef.current?.focus();
  }

  function handleKeyDown(event) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        setActiveIndex(selectedIndex);
        setOpen(true);
      } else {
        const direction = event.key === "ArrowDown" ? 1 : -1;
        setActiveIndex((index) => (index + direction + options.length) % options.length);
      }
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (open) select(activeIndex);
      else {
        setActiveIndex(selectedIndex);
        setOpen(true);
      }
    } else if (open && (event.key === "Home" || event.key === "End")) {
      event.preventDefault();
      setActiveIndex(event.key === "Home" ? 0 : options.length - 1);
    } else if (event.key === "Escape") {
      if (open) event.preventDefault();
      setOpen(false);
    } else if (event.key === "Tab") {
      setOpen(false);
    }
  }

  return (
    <div
      className="products-sort-field"
      ref={fieldRef}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        className="products-sort"
        type="button"
        role="combobox"
        aria-label={`Ordenar produtos: ${options[selectedIndex].label}`}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={listId}
        aria-activedescendant={open ? `${listId}-${activeIndex}` : undefined}
        onKeyDown={handleKeyDown}
        onClick={() => {
          setActiveIndex(selectedIndex);
          setOpen((previous) => !previous);
        }}
      >
        <span>{options[selectedIndex].label}</span>
        <ChevronDown size={16} aria-hidden="true" />
      </button>
      {open && (
        <ul className="products-sort-menu" id={listId} role="listbox" aria-label="Ordenar produtos">
          {options.map((option, index) => (
            <li
              key={option.value}
              id={`${listId}-${index}`}
              role="option"
              aria-selected={value === option.value}
              className={`products-sort-option${activeIndex === index ? " is-active" : ""}`}
              onPointerMove={() => setActiveIndex(index)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => select(index)}
            >
              <span>{option.label}</span>
              {value === option.value && <Check size={16} aria-hidden="true" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProductSort;
