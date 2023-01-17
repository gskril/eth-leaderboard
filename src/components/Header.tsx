import Link from 'next/link';

import { nFormatter } from '../utils/format';
import headerStyles from '../styles/Header.module.css';

interface HeaderProps {
  top10: number;
  top100: number;
  top500: number;
  children: React.ReactNode;
}

export default function Header({
  top10,
  top100,
  top500,
  children,
}: HeaderProps) {
  return (
    <div className={headerStyles.hero}>
      <div className={headerStyles.heroTitle}>
        <h1>
          <Link className={headerStyles.heroTitleLink} href="/">
            <span className={headerStyles.heroHighlight}>.eth</span> Leaderboard
          </Link>
        </h1>
        <a
          className={headerStyles.heroTwitter}
          href="https://twitter.com/ethleaderboard"
          target="_blank"
          rel="noreferrer"
        >
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
      <span className={headerStyles.heroSubtitle}>
        The most followed Twitter accounts with <strong>.eth</strong> names
      </span>
      <div className={headerStyles.floor}>
        <div className={headerStyles.floorSection}>
          <span className={headerStyles.floorNumber}>
            {'> ' + nFormatter(top10, 1)}
          </span>
          <span className={headerStyles.floorSectionLabel}>
            <span className={headerStyles.floorFollowersLabel}>
              Followers for
            </span>{' '}
            <strong>Top 10</strong>
          </span>
        </div>
        <div className={headerStyles.floorSection}>
          <span className={headerStyles.floorNumber}>
            {'> ' + nFormatter(top100, 1)}
          </span>
          <span className={headerStyles.floorSectionLabel}>
            <span className={headerStyles.floorFollowersLabel}>
              Followers for
            </span>{' '}
            <strong>Top 100</strong>
          </span>
        </div>
        <div className={headerStyles.floorSection}>
          <span className={headerStyles.floorNumber}>
            {'> ' + nFormatter(top500, 1)}
          </span>
          <span className={headerStyles.floorSectionLabel}>
            <span className={headerStyles.floorFollowersLabel}>
              Followers for
            </span>{' '}
            <strong>Top 1000</strong>
          </span>
        </div>
      </div>
      {children}
    </div>
  );
}
