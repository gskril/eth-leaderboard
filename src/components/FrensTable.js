import { useFrens } from "../api";
import frensTableStyles from "../styles/FrensTable.module.css";

export default function FrensTable({ frensData }) {
  const { data: frens, error } = useFrens();

  if (error != null) return <div>Error loading todos...</div>;
  if (frens == null) return <div>Loading...</div>;

  if (frens.length === 0) {
    return <div>Try adding a fren</div>;
  }

  return (
    <div className={frensTableStyles.tableWrapper}>
      {frens.length > 0 ? (
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
            {frens.map((fren) => (
              <tr
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
                    <a href={`https://${fren.ens}.xyz`} target="_blank">
                      {fren.ensAvatar && (
                        <img
                          className={frensTableStyles.pfp}
                          src={
                            "/api/avatars/" + fren.ens.split(".")[0] + ".eth"
                          }
                          alt=""
                          loading="lazy"
                        />
                      )}
                      {fren.name}
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
                    href={"https://twitter.com/" + fren.handle}
                    target="_blank"
                  >
                    {fren.twitterPicture && (
                      <img
                        className={frensTableStyles.pfp}
                        src={fren.twitterPicture}
                        alt=""
                        loading="lazy"
                      />
                    )}
                    {"@" + fren.handle}
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
      ) : (
        <span className={frensTableStyles.noResults}>No matches found.</span>
      )}
    </div>
  );
}
