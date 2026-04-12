import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { ChevronDown } from "lucide-react";
import styles from "./ExploreControls.module.css";

export default function ExploreSelect({
  id,
  value,
  onChange,
  options,
  ariaLabel,
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const selected = options.find((o) => o.value === value);
  const selectedLabel = selected?.label ?? "";

  useEffect(() => {
    if (!open) return;
    function handleDown(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleDown);
    return () => document.removeEventListener("mousedown", handleDown);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className={styles.exploreSelect} ref={wrapRef}>
      <button
        type="button"
        id={id}
        className={styles.exploreSelect__trigger}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => !o)}
      >
        <span className={styles.exploreSelect__triggerText}>
          {selectedLabel}
        </span>
        <ChevronDown
          size={18}
          strokeWidth={2.25}
          className={`${styles.exploreSelect__chevron} ${open ? styles["exploreSelect__chevron--open"] : ""}`}
          aria-hidden
        />
      </button>
      {open && (
        <ul className={styles.exploreSelect__panel} role="listbox">
          {options.map((o) => (
            <li key={o.value === "" ? "__empty" : o.value} role="none">
              <button
                type="button"
                role="option"
                className={`${styles.exploreSelect__option} ${value === o.value ? styles["exploreSelect__option--selected"] : ""}`}
                aria-selected={value === o.value}
                onClick={() => {
                  onChange(o.value);
                  setOpen(false);
                }}
              >
                {o.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

ExploreSelect.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    }),
  ).isRequired,
  ariaLabel: PropTypes.string,
};
