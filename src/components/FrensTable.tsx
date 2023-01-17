import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';

import { Fren } from '../types';
import { useFrens } from '../api';
import { usePrevious } from '../utils/hooks';
import Avatar from './Avatar';
import frensTableStyles from '../styles/FrensTable.module.css';

interface FrensTableProps {
  searchInput: string;
  page: number;
  showFixed: boolean;
  setModalIsOpen: (isOpen: boolean) => void;
  setSelectedFren: (fren: any) => void;
}

export default function FrensTable({
  searchInput,
  page,
  setModalIsOpen,
  setSelectedFren,
}: FrensTableProps) {
  const {
    data: frensData,
    error,
    isValidating,
  } = useFrens({
    searchInput,
    page,
  });
  const prevFrensData = usePrevious(frensData);
  const { frens } = frensData || prevFrensData || {};

  if (error != null)
    return (
      <div style={{ width: '100%', textAlign: 'center' }}>
        There was an error.
      </div>
    );

  return (
    <AnimatePresence mode="wait">
      <motion.div
        animate={isValidating && !frensData ? 'loading' : 'loaded'}
        key={frens.length > 0 ? frens[0].id : 'empty'}
        initial={{ opacity: 1, filter: 'blur(5px) brightness(1.05)' }}
        exit={{ opacity: 0.2, filter: 'blur(5px) brightness(1.05)' }}
        variants={{
          loading: () => ({
            opacity: 0.2,
            filter: 'blur(5px) brightness(1.05)',
          }),
          loaded: {
            opacity: 1,
            filter: 'blur(0px) brightness(1)',
          },
        }}
      >
        <FrensTablePage
          frens={frens}
          setModalIsOpen={setModalIsOpen}
          setSelectedFren={setSelectedFren}
        />
      </motion.div>
    </AnimatePresence>
  );
}

interface FrensTablePageProps {
  frens: Fren[];
  setModalIsOpen: (isOpen: boolean) => void;
  setSelectedFren: (fren: Fren) => void;
}

const FrensTablePage = ({
  frens,
  setModalIsOpen,
  setSelectedFren,
}: FrensTablePageProps) => {
  return (
    <div
      className={`${frensTableStyles.tableWrapper} ${
        frens.length > 0 ? '' : frensTableStyles.noResultsWrapper
      }`}
    >
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
            {frens.map((fren, inx) => (
              <tr key={fren.id} data-verified={fren.verified}>
                <td>
                  {fren.ranking.toLocaleString('en', { useGrouping: true })}
                </td>
                <td>
                  {fren.ens && !fren.ens.match(/^[a-z0-9.-]+(.eth)/g) ? (
                    // Don't show profile modal if the name has special characters
                    <div className={frensTableStyles.ensProfile}>
                      <Image
                        width={34}
                        height={34}
                        className={frensTableStyles.pfp}
                        src={'/img/av-default.png'}
                        alt=""
                        priority={inx < 10}
                      />
                      <span className={frensTableStyles.ensName}>
                        {fren.ens}
                      </span>
                    </div>
                  ) : (
                    <div
                      className={[
                        frensTableStyles.ensProfile,
                        frensTableStyles.link,
                      ].join(' ')}
                      onClick={() => {
                        setSelectedFren(fren);
                        setModalIsOpen(true);
                      }}
                    >
                      <Avatar
                        width={34}
                        height={34}
                        className={frensTableStyles.pfp}
                        src={
                          'https://metadata.ens.domains/mainnet/avatar/' +
                          fren.ens
                        }
                        fallbackSrc="/img/av-default.png"
                        alt=""
                        priority={inx < 10}
                      />
                      <span className={frensTableStyles.ensName}>
                        {fren.ens}
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
                          fill="var(--text-color)"
                        />
                      </svg>
                    </div>
                  )}
                </td>
                <td>
                  <a
                    className={frensTableStyles.ensProfile}
                    href={'https://twitter.com/' + fren.handle}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Image
                      width={34}
                      height={34}
                      className={frensTableStyles.pfp}
                      src={
                        fren.pfp ||
                        'https://unavatar.io/twitter/' +
                          fren.handle +
                          '?fallback=false'
                      }
                      alt=""
                    />
                    <span className={frensTableStyles.ensName}>
                      {'@' + fren.handle}
                    </span>
                  </a>
                </td>
                <td>{fren.followers.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className={frensTableStyles.noResults}>
          No matches found.
          <span>
            Do you have .eth in your Twitter name? <br />
            <a
              href="https://twitter.com/intent/tweet?text=%40ethleaderboard%20add%20me%20pls%20:)"
              target="_blank"
              rel="noreferrer"
            >
              Tweet at @ethleaderboard
            </a>{' '}
            to get added shortly
          </span>
        </div>
      )}
    </div>
  );
};
