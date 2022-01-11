import { Fragment } from "react";
import pageButtonStyles from "../styles/PageButtons.module.css";

const PageButton = ({ number, setPage, isActive }) => (
  <button
    className={`${pageButtonStyles.button} ${
      isActive && pageButtonStyles.activeButton
    }`}
    onClick={() => !isActive && setPage(number)}
  >
    {number + 1}
  </button>
);

export default function PageButtons({ page, setPage, count, amntPerPage }) {
  return (
    <div className={pageButtonStyles.buttonWrapper}>
      {[...Array(Math.ceil(count / amntPerPage)).keys()].map((number, _, arr) =>
        (number <= page + 1 && number >= page - 1) ||
        (arr.length === number + 1 && arr.length > 2) ||
        (page > 1 && number === 0) ? (
          <Fragment>
            {arr.length === number + 1 &&
              arr.length > 2 &&
              number - page > 2 && (
                <span className={pageButtonStyles.dotsSpan}>...</span>
              )}
            <PageButton
              key={number}
              number={number}
              setPage={setPage}
              isActive={number === page}
            />
            {page > 2 && number === 0 && (
              <span className={pageButtonStyles.dotsSpan}>...</span>
            )}
          </Fragment>
        ) : null
      )}
    </div>
  );
}
