import { useState } from "react";
import { useEffect } from "react";
import filtersStyles from "../styles/Filters.module.css";

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
  verifiedFilter,
  setVerifiedFilter,
  searchInput,
  setSearchInput,
}) {
  const [currentSearchInput, setCurrentSearchInput] = useState("");
  const [timeout, setTimeoutVar] = useState(null);

  useEffect(() => {
    console.log("input changed", currentSearchInput);
    clearTimeout(timeout);
    setTimeoutVar(setTimeout(() => setSearchInput(currentSearchInput), 600));
  }, [currentSearchInput]);

  return (
    <div className={filtersStyles.filters}>
      <input
        type="text"
        className={filtersStyles.filtersSearch}
        id="search"
        placeholder="Search by ENS or Twitter name..."
        autoComplete="off"
        value={currentSearchInput}
        onChange={(e) => setCurrentSearchInput(e.target.value)}
      />
      <div className={filtersStyles.filtersCol}>
        <div>
          <label>Verified on Twitter</label>
          <div className={filtersStyles.filtersOptions}>
            <FilterOption
              category="verified"
              type="All"
              currentType={verifiedFilter}
              setType={setVerifiedFilter}
            />
            <FilterOption
              category="verified"
              type="Yes"
              currentType={verifiedFilter}
              setType={setVerifiedFilter}
            />
            <FilterOption
              category="verified"
              type="No"
              currentType={verifiedFilter}
              setType={setVerifiedFilter}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
