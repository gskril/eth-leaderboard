import { useRef, useState } from "react";
import { useEffect } from "react";
import { useFrens } from "../api";
import filtersStyles from "../styles/Filters.module.css";
import PageButtons from "./PageButtons";
import { default as CancelIcon } from "../assets/icons/CancelIcon.svg";
import { usePrevious } from "../utils/hooks";
import { AnimatePresence, motion } from "framer-motion";

const FilterOption = ({ category, type, setType, currentType }) => (
  <div className={filtersStyles.filtersOption}>
    <input
      type="radio"
      name={category}
      id={`${category}-${type}`}
      value={type}
      checked={type === currentType}
      onChange={() => setType(type)}
    />
    <label htmlFor={`${category}-${type}`}>{type}</label>
  </div>
);

export default function Filters({
  page,
  setPage,
  searchInput,
  setSearchInput,
}) {
  const [currentSearchInput, setCurrentSearchInput] = useState("");
  const [timeout, setTimeoutVar] = useState(null);
  const searchRef = useRef();
  const { data: frensData, error } = useFrens({
    searchInput,
    page,
  });
  const { count: _count } = frensData || { count: undefined };
  const prevCount = usePrevious(_count);
  const count = _count || prevCount || 0;

  const handleClear = (e) => {
    e.stopPropagation();
    setCurrentSearchInput("");
    searchRef.current.blur();
  };

  useEffect(() => {
    setPage(0);
  }, [searchInput]);

  useEffect(() => {
    console.log("input changed", currentSearchInput);
    clearTimeout(timeout);
    setTimeoutVar(setTimeout(() => setSearchInput(currentSearchInput), 600));
  }, [currentSearchInput]);

  return (
    <div className={filtersStyles.filters}>
      <div className={filtersStyles.searchWrapper}>
        <input
          type="text"
          className={filtersStyles.filtersSearch}
          id="search"
          placeholder="Search..."
          autoComplete="off"
          value={currentSearchInput}
          onChange={(e) => setCurrentSearchInput(e.target.value)}
        />
        <button
          ref={searchRef}
          className={`${filtersStyles.removeButton} ${
            currentSearchInput === "" ? filtersStyles.removeButtonHidden : ""
          }`}
          onClick={handleClear}
        >
          <CancelIcon />
        </button>
      </div>
      <div className={filtersStyles.spacer}></div>
      <AnimatePresence>
        <motion.div layout="position" className={filtersStyles.rightSide}>
          <div className={filtersStyles.frensCount}>
            <strong>{count.toLocaleString("en", { useGrouping: true })}</strong>{" "}
            <span>names</span>
          </div>
          <PageButtons {...{ page, setPage, count }} amntPerPage={100} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
