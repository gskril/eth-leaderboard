import { Fragment } from 'react';

import pageButtonStyles from '../styles/PageButtons.module.css';

type PageButtonProps = {
  number: number;
  page: number;
  setPage: (page: number) => void;
  isActive: boolean;
};

const PageButton = ({ number, page, setPage, isActive }: PageButtonProps) => (
  <button
    className={`${pageButtonStyles.button} ${
      isActive && pageButtonStyles.activeButton
    } ${
      !(page + 2 > number && number > page - 2) &&
      pageButtonStyles.excludeOnMobile
    }`}
    onClick={() => !isActive && setPage(number)}
  >
    {number + 1}
  </button>
);

interface PageButtonsProps {
  page: number;
  setPage: (page: number) => void;
  count: number;
  amntPerPage: number;
  hide: boolean;
}

export default function PageButtons({
  page,
  setPage,
  count,
  amntPerPage,
  hide,
}: PageButtonsProps) {
  return (
    <div
      className={`${pageButtonStyles.buttonWrapper} ${
        hide && pageButtonStyles.hide
      }`}
    >
      {[...Array(Math.ceil(count / amntPerPage)).keys()].map((number, _, arr) =>
        arr.length > 1 &&
        ((number <= page + 1 && number >= page - 1) ||
          (arr.length === number + 1 && arr.length > 2) ||
          (page > 1 && number === 0)) ? (
          <Fragment key={number}>
            {arr.length === number + 1 &&
              arr.length > 2 &&
              number - page > 2 && (
                <span
                  key={`${number}-dots`}
                  className={pageButtonStyles.dotsSpan}
                >
                  ...
                </span>
              )}
            <PageButton
              key={number}
              number={number}
              setPage={setPage}
              isActive={number === page}
              page={page}
            />
            {page > 2 && number === 0 && (
              <span
                key={`${number}-dots`}
                className={pageButtonStyles.dotsSpan}
              >
                ...
              </span>
            )}
          </Fragment>
        ) : null
      )}
    </div>
  );
}
