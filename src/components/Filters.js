import { Fragment, useRef, useState } from "react";
import { useEffect } from "react";
import { useFrens } from "../api";
import filtersStyles from "../styles/Filters.module.css";
import headerStyles from "../styles/Header.module.css";
import PageButtons from "./PageButtons";
import { default as CancelIcon } from "../assets/icons/CancelIcon.svg";
import { default as SearchIcon } from "../assets/icons/SearchIcon.svg";
import { default as ChevronIcon } from "../assets/icons/ChevronIcon.svg";
import { usePrevious } from "../utils/hooks";
import { AnimatePresence, motion } from "framer-motion";
import { useScrollPosition } from "@n8tb1t/use-scroll-position";

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
  filterDivRef,
  showFixed,
  initialQuery,
}) {
  const [isInitial, setIsInitial] = useState(true);
  const [currentSearchInput, setCurrentSearchInput] = useState("");
  const [timeout, setTimeoutVar] = useState(null);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchRef = useRef();
  const searchRefFixed = useRef();
  const searchInputRef = useRef();
  const searchInputRefFixed = useRef();
  const {
    data: frensData,
    error,
    isValidating,
  } = useFrens({
    searchInput,
    page,
  });
  const { count: _count } = frensData || { count: undefined };
  const prevCount = usePrevious(_count);
  const count = _count !== undefined ? _count : prevCount || 0;

  const handleClear = (e) => {
    e.stopPropagation();
    setCurrentSearchInput("");
    showFixed ? searchRefFixed.current.blur() : searchRef.current.blur();
  };

  const openSearch = (e) => {
    e.stopPropagation();
    console.log("opening search...");
    setMobileSearchOpen(true);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [searchInput]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);

  useEffect(() => {
    if (mobileSearchOpen)
      setTimeout(
        () =>
          showFixed
            ? searchInputRefFixed.current.focus()
            : searchInputRef.current.focus(),
        150
      );
  }, [mobileSearchOpen]);

  useEffect(() => {
    if (isInitial) return;
    clearTimeout(timeout);
    searchInput !== currentSearchInput &&
      setTimeoutVar(setTimeout(() => setSearchInput(currentSearchInput), 600));
  }, [currentSearchInput]);

  useEffect(() => {
    if (
      initialQuery.current &&
      initialQuery.current.q &&
      initialQuery.current.q !== currentSearchInput
    ) {
      setCurrentSearchInput(initialQuery.current.q);
    }
    setIsInitial(false);
  }, [initialQuery]);

  return (
    <Fragment>
      <div
        className={`${filtersStyles.filters} ${
          mobileSearchOpen ? filtersStyles.mobileSearchOpen : ""
        } ${currentSearchInput !== "" ? filtersStyles.searchHasValue : ""}`}
        ref={filterDivRef}
      >
        {showFixed && <div className={headerStyles.headerPlaceholder}></div>}
        {!showFixed && (
          <Fragment>
            <button
              onClick={openSearch}
              className={filtersStyles.mobileSearchButtonWrapper}
            >
              <div className={filtersStyles.mobileSearchButton}>
                <SearchIcon />
              </div>
            </button>
            <div
              className={filtersStyles.searchWrapper}
              onBlur={() => setMobileSearchOpen(false)}
            >
              <input
                type="text"
                className={filtersStyles.filtersSearch}
                id="search"
                placeholder="Search..."
                autoComplete="off"
                value={currentSearchInput}
                onChange={(e) => setCurrentSearchInput(e.target.value)}
                ref={searchInputRef}
              />
              <button
                ref={searchRef}
                className={`${filtersStyles.removeButton} ${
                  currentSearchInput === ""
                    ? filtersStyles.removeButtonHidden
                    : ""
                }`}
                onClick={handleClear}
              >
                <CancelIcon />
              </button>
            </div>
            <div className={filtersStyles.spacer}></div>
            <AnimatePresence>
              <motion.div
                layout={mobileSearchOpen ? false : "position"}
                className={filtersStyles.rightSide}
              >
                <div
                  className={`${filtersStyles.frensCount} ${
                    isValidating && !frensData && filtersStyles.hide
                  }`}
                >
                  <strong>
                    {count.toLocaleString("en", { useGrouping: true })}
                  </strong>{" "}
                  <span>name{count !== 1 && "s"}</span>
                </div>
                <PageButtons
                  {...{ page, setPage, count }}
                  hide={isValidating && !frensData}
                  amntPerPage={100}
                />
              </motion.div>
            </AnimatePresence>
          </Fragment>
        )}
      </div>
      <AnimatePresence>
        <motion.div
          layout="position"
          key={showFixed ? "fixed" : "not-fixed"}
          initial={{
            y:
              typeof window !== "undefined" && window.innerWidth > 625
                ? -100
                : 50,
          }}
          animate={{ y: 0 }}
          exit={{
            y:
              typeof window !== "undefined" && window.innerWidth > 625
                ? -100
                : 50,
          }}
          transition={{ duration: 0.15 }}
          className={`${headerStyles.fixedHeaderWrapper} ${
            !showFixed && headerStyles.hideFixed
          } ${mobileSearchOpen && filtersStyles.mobileSearchOpen}`}
        >
          {showFixed && (
            <div className={headerStyles.fixedHeader}>
              <div className={headerStyles.heroTitle}>
                <h1>
                  <span className={headerStyles.heroHighlight}>.eth</span>{" "}
                  Leaderboard
                </h1>
                <a href="https://twitter.com/ethleaderboard" target="_blank">
                  <svg
                    width="22"
                    height="22"
                    role="img"
                    viewBox="0 0 24 24"
                    color="#000"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <title>Twitter icon</title>
                    <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124C7.691 8.094 4.066 6.13 1.64 3.161c-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 13.999-7.496 13.999-13.986 0-.209 0-.42-.015-.63.961-.689 1.8-1.56 2.46-2.548l-.047-.02z"></path>
                  </svg>
                </a>
              </div>
              <button
                onClick={openSearch}
                className={filtersStyles.mobileSearchButtonWrapper}
              >
                <div className={filtersStyles.mobileSearchButton}>
                  <SearchIcon />
                </div>
              </button>
              <div
                className={filtersStyles.searchWrapper}
                onBlur={() => setMobileSearchOpen(false)}
              >
                <input
                  type="text"
                  className={filtersStyles.filtersSearch}
                  id="search"
                  placeholder="Search..."
                  autoComplete="off"
                  value={currentSearchInput}
                  onChange={(e) => setCurrentSearchInput(e.target.value)}
                  ref={searchInputRefFixed}
                />
                <button
                  ref={searchRefFixed}
                  className={`${filtersStyles.removeButton} ${
                    currentSearchInput === ""
                      ? filtersStyles.removeButtonHidden
                      : ""
                  }`}
                  onClick={handleClear}
                >
                  <CancelIcon />
                </button>
              </div>
              <div className={filtersStyles.spacer}></div>
              <button
                onClick={scrollToTop}
                className={`${headerStyles.scrollToTop} ${filtersStyles.scrollToTop}`}
              >
                <ChevronIcon />
                <span>Scroll to top</span>
              </button>
              <div className={filtersStyles.spacer}></div>
              <AnimatePresence>
                <motion.div
                  layout={mobileSearchOpen ? false : "position"}
                  className={filtersStyles.rightSide}
                >
                  <div
                    className={`${
                      isValidating && !frensData && filtersStyles.hide
                    } ${filtersStyles.frensCount} ${headerStyles.mobHidden}`}
                  >
                    <strong>
                      {count.toLocaleString("en", { useGrouping: true })}
                    </strong>{" "}
                    <span>name{count !== 1 && "s"}</span>
                  </div>
                  <PageButtons
                    {...{ page, setPage, count }}
                    hide={isValidating && !frensData}
                    amntPerPage={100}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </Fragment>
  );
}
