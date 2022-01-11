import { Fragment, useState } from "react";
import { useEffect } from "react/cjs/react.development";
import { useFrens } from "../api";
import frensTableStyles from "../styles/FrensTable.module.css";
import PageButtons from "./PageButtons";
import Image from "next/image";

export default function FrensTable({ verifiedFilter, searchInput }) {
  const [page, setPage] = useState(0);
  const { data: frensData, error } = useFrens({
    verifiedFilter,
    searchInput,
    page,
  });
  const { frens, count } = frensData || {};

  if (error != null) return <div>Error loading todos...</div>;
  if (frens == null) return <div>Loading...</div>;

  if (frens.length === 0) {
    return <div>Try adding a fren</div>;
  }

  return (
    <div className={frensTableStyles.tableWrapper}>
      {frens.length > 0 ? (
        <Fragment>
          <table className={frensTableStyles.profiles}>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Twitter</th>
                <th>Followers</th>
              </tr>
            </thead>
            <tbody>
              {frens.map((fren, inx) => (
                <tr
                  key={fren.id}
                  data-verified={fren.verified}
                  data-avatar={
                    fren.ensAvatar && !fren.ensAvatar.includes("default")
                  }
                >
                  <td>{fren.ranking}</td>
                  <td>
                    {fren.ens === ".eth" ? (
                      fren.name
                    ) : (
                      <a
                        className={frensTableStyles.ensProfile}
                        href={`https://${fren.ens}.xyz`}
                        target="_blank"
                      >
                        <Image
                          layout="fixed"
                          width="34px"
                          height="34px"
                          className={frensTableStyles.pfp}
                          src={
                            "https://metadata.ens.domains/mainnet/avatar/" +
                            fren.ens
                          }
                          alt=""
                          priority={inx < 25}
                        />
                        <span className={frensTableStyles.ensName}>
                          {fren.name}
                        </span>
                        <svg
                          width="16"
                          height="15"
                          viewBox="0 0 16 15"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            opacity="0.3"
                            d="M7.95739 14.7955L15.1165 7.63636L7.95739 0.477273L6.30966 2.1179L10.6349 6.43608H0.5V8.83665H10.6349L6.30966 13.1619L7.95739 14.7955Z"
                            fill="black"
                          />
                        </svg>
                      </a>
                    )}
                  </td>
                  <td>
                    <a
                      className={frensTableStyles.ensProfile}
                      href={"https://twitter.com/" + fren.handle}
                      target="_blank"
                    >
                      {fren.twitterPicture && (
                        <Image
                          layout="fixed"
                          width="34px"
                          height="34px"
                          className={frensTableStyles.pfp}
                          src={"https://unavatar.now.sh/twitter/" + fren.handle}
                          alt=""
                          priority={inx < 25}
                        />
                      )}
                      <span className={frensTableStyles.ensName}>
                        {"@" + fren.handle}
                      </span>
                      <svg
                        width="16"
                        height="15"
                        viewBox="0 0 16 15"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          opacity="0.3"
                          d="M7.95739 14.7955L15.1165 7.63636L7.95739 0.477273L6.30966 2.1179L10.6349 6.43608H0.5V8.83665H10.6349L6.30966 13.1619L7.95739 14.7955Z"
                          fill="black"
                        />
                      </svg>
                    </a>
                  </td>
                  <td>{fren.followers.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <PageButtons amntPerPage={100} {...{ count, page, setPage }} />
        </Fragment>
      ) : (
        <span className={frensTableStyles.noResults}>No matches found.</span>
      )}
    </div>
  );
}
