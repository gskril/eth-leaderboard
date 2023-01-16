import Image from 'next/image';
import useSWR from 'swr';
import ModalStyles from './../styles/Modal.module.css';
import NftGrid from './NftGrid';
import Avatar from './Avatar';

export default function Modal({ setIsOpen, fren }) {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, error } = useSWR(
    `https://ens-records.vercel.app/${fren.ens}`,
    fetcher
  );

  return (
    <>
      <div className={ModalStyles.modal}>
        <div
          className={ModalStyles.background}
          onClick={() => setIsOpen(false)}
        ></div>
        <div className={ModalStyles.content}>
          <button
            className={ModalStyles.close}
            onClick={() => setIsOpen(false)}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 1.05L10.95 0L6 4.95L1.05 0L0 1.05L4.95 6L0 10.95L1.05 12L6 7.05L10.95 12L12 10.95L7.05 6L12 1.05Z"
                fill="var(--text-color-light)"
              />
            </svg>
          </button>
          {error ? (
            <div>Error</div>
          ) : (
            <>
              <div className={ModalStyles.header}>
                <Avatar
                  className={ModalStyles.headerAvatar}
                  src={`https://metadata.ens.domains/mainnet/avatar/${fren.ens}`}
                  fallbackSrc="/img/av-default.svg"
                  width={100}
                  height={100}
                />
                <div className={ModalStyles.headerContent}>
                  <span className={ModalStyles.headerName}>{fren.ens}</span>
                  <div className={ModalStyles.headerLinks}>
                    <a
                      href={`https://twitter.com/${
                        data && data.twitter ? data.twitter : fren.handle
                      }`}
                      target="_blank"
                    >
                      Twitter
                    </a>
                    <a
                      href={`https://opensea.io/${
                        data && data.address ? data.address : fren.ens
                      }`}
                      target="_blank"
                    >
                      OpenSea
                    </a>
                    {data && data.github ? (
                      <a
                        href={`https://github.com/${data.github}`}
                        target="_blank"
                      >
                        GitHub
                      </a>
                    ) : null}
                    {data && data.url ? (
                      <a href={data.url} target="_blank">
                        Website
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
              {data && data.description ? (
                <p className={ModalStyles.description}>{data.description}</p>
              ) : null}
            </>
          )}
          <NftGrid
            address={data ? (data.address ? data.address : null) : 'loading'}
          />
        </div>
      </div>

      <style global jsx>
        {`
          body {
            overflow: hidden;
          }
        `}
      </style>
    </>
  );
}
