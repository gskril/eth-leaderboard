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
        (number <= page + 2 && number >= page - 2) ||
        (arr.length === number + 1 && arr.length > 3) ||
        (page > 2 && number === 0) ? (
          <Fragment>
            {arr.length === number + 1 &&
              arr.length > 3 &&
              number - page > 2 &&
              "..."}
            <PageButton
              number={number}
              setPage={setPage}
              isActive={number === page}
            />
            {page > 2 && number === 0 && "..."}
          </Fragment>
        ) : null
      )}
    </div>
  );
}
