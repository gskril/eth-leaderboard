import useSWR from 'swr';
import Styles from './../styles/NftGrid.module.css';

export default function NftGrid({ address }) {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data: allNfts, error } = useSWR(
    `https://api.opensea.io/api/v1/assets?owner=${address}&order_direction=desc&limit=18&include_orders=false`,
    fetcher
  );

  const isLoading = address === 'loading' || !allNfts;

  // Remove videos from the NFTs
  const nfts = allNfts?.assets?.filter((nft) => {
    const image_preview_url = nft.image_preview_url;
    return (
      image_preview_url !== null &&
      !image_preview_url?.includes('mp4') &&
      !image_preview_url?.includes('webm') &&
      !image_preview_url?.includes('ogg')
    );
  });

  if (error || !address) {
    console.error(error ? error : 'No address for NFT grid');
    return null;
  }

  // empty array of 0 items for loading state
  const loadingItems = Array.from({ length: 9 }, () => ({}));

  return (
    <div className={Styles.nfts}>
      {isLoading &&
        loadingItems.map((item) => {
          return (
            // add 'loading' class if isLoading is true
            <div className={[Styles.nftDiv, Styles.loading].join(' ')} />
          );
        })}

      {nfts &&
        nfts.length > 0 &&
        nfts.map((nft) => {
          return (
            <a
              href={nft.permalink}
              className={Styles.nftLink}
              target="_blank"
              rel="noreferrer"
              key={nft.id}
            >
              <div
                style={{
                  backgroundImage: `url(${nft.image_preview_url})`,
                }}
                className={Styles.nftDiv}
              />
            </a>
          );
        })}
    </div>
  );
}
