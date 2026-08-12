import { useState, useEffect, useRef, useMemo } from "react";
import PropTypes from "prop-types";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import styles from "./ExploreControls.module.css";

const WEEKDAYS_KO = ["일", "월", "화", "수", "목", "금", "토"];

function pad(n) {
  return String(n).padStart(2, "0");
}

/** @param {Date} d */
function toYMD(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** @param {string} s yyyy-MM-dd */
function parseYMD(s) {
  if (!s) return null;
  const p = s.split("-").map(Number);
  if (p.length !== 3 || p.some(Number.isNaN)) return null;
  const [y, m, day] = p;
  const d = new Date(y, m - 1, day);
  if (
    d.getFullYear() !== y ||
    d.getMonth() !== m - 1 ||
    d.getDate() !== day
  ) {
    return null;
  }
  return d;
}

export default function ExploreDatePicker({
  id,
  value,
  onChange,
  placeholder,
  clearLabel,
  ariaLabel,
  prevMonthAria = "이전 달",
  nextMonthAria = "다음 달",
}) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);

  const selectedDate = useMemo(() => parseYMD(value), [value]);

  const [view, setView] = useState(() => {
    const base = selectedDate ?? new Date();
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  useEffect(() => {
    if (selectedDate) {
      setView(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    }
  }, [selectedDate]);

  const displayText = selectedDate
    ? selectedDate.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : placeholder;

  const year = view.getFullYear();
  const month = view.getMonth();
  const monthLabel = view.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
  });

  const { cells } = useMemo(() => {
    const firstDow = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const list = [];
    for (let i = 0; i < firstDow; i += 1) {
      list.push({ kind: "pad" });
    }
    for (let d = 1; d <= daysInMonth; d += 1) {
      list.push({ kind: "day", day: d });
    }
    return { cells: list };
  }, [year, month]);

  const today = new Date();
  const todayYMD = toYMD(today);

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

  function prevMonth() {
    setView(new Date(year, month - 1, 1));
  }

  function nextMonth() {
    setView(new Date(year, month + 1, 1));
  }

  function selectDay(day) {
    const d = new Date(year, month, day);
    onChange(toYMD(d));
    setOpen(false);
  }

  function clearDate() {
    onChange("");
    setOpen(false);
  }

  return (
    <div className={styles.exploreDate} ref={wrapRef}>
      <button
        type="button"
        id={id}
        className={`${styles.exploreDate__trigger} ${!value ? styles["exploreDate__trigger--empty"] : ""}`}
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((o) => !o)}
      >
        <span>{displayText}</span>
        <Calendar size={18} strokeWidth={2} aria-hidden />
      </button>
      {open && (
        <div className={styles.exploreDate__panel}>
          {value ? (
            <button
              type="button"
              className={styles.exploreDate__clear}
              onClick={clearDate}
            >
              {clearLabel}
            </button>
          ) : null}
          <div className={styles.exploreDate__header}>
            <button
              type="button"
              className={styles.exploreDate__nav}
              onClick={prevMonth}
              aria-label={prevMonthAria}
            >
              <ChevronLeft size={18} />
            </button>
            <span className={styles.exploreDate__monthLabel}>{monthLabel}</span>
            <button
              type="button"
              className={styles.exploreDate__nav}
              onClick={nextMonth}
              aria-label={nextMonthAria}
            >
              <ChevronRight size={18} />
            </button>
          </div>
          <div className={styles.exploreDate__weekdays}>
            {WEEKDAYS_KO.map((w) => (
              <div key={w} className={styles.exploreDate__weekday}>
                {w}
              </div>
            ))}
          </div>
          <div className={styles.exploreDate__grid}>
            {cells.map((cell, idx) => {
              if (cell.kind === "pad") {
                return (
                  <div
                    key={`pad-${idx}`}
                    className={styles.exploreDate__pad}
                  />
                );
              }
              const d = new Date(year, month, cell.day);
              const ymd = toYMD(d);
              const isToday = ymd === todayYMD;
              const isSelected = value === ymd;
              return (
                <button
                  key={ymd}
                  type="button"
                  className={`${styles.exploreDate__day} ${isToday ? styles["exploreDate__day--today"] : ""} ${isSelected ? styles["exploreDate__day--selected"] : ""}`}
                  onClick={() => selectDay(cell.day)}
                >
                  {cell.day}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

ExploreDatePicker.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  clearLabel: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string,
  prevMonthAria: PropTypes.string,
  nextMonthAria: PropTypes.string,
};
