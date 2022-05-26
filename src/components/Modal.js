import Image from 'next/image'
import useSWR from 'swr'
import ModalStyles from './../styles/Modal.module.css'
import { useState, useEffect } from 'react'

export default function Modal({ setIsOpen, fren }) {
	const fetcher = (...args) => fetch(...args).then((res) => res.json())
	const { data, error } = useSWR(
		`https://ens-records.vercel.app/${fren.ens}`,
		fetcher
	)

	const [allNfts, setAllNfts] = useState([])

	const loadNfts = async (address) => {
		const nfts = await fetch(
			`https://api.opensea.io/api/v1/assets?owner=${address}&order_direction=desc&limit=18&include_orders=false`
		)
			.then((res) => res.json())
			.then((res) => res.assets)
			.catch((err) => console.log(err))

		return nfts
	}

	useEffect(async () => {
		if (data && data.address) {
			const nfts = await loadNfts(data.address)
			setAllNfts(nfts)
		}
	}, [data])

	const [scrollPosition, setScrollPosition] = useState(0)

	return (
		<>
			<div className={ModalStyles.modal}>
				<div
					className={ModalStyles.background}
					onClick={() => setIsOpen(false)}
				></div>
				<div
					className={ModalStyles.content}
					onScroll={(e) => {
						setScrollPosition(e.target.scrollTop)
					}}
				>
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
								<Image
									className={ModalStyles.headerAvatar}
									src={`https://metadata.ens.domains/mainnet/avatar/${fren.ens}`}
									width={100}
									height={100}
								/>
								<div className={ModalStyles.headerContent}>
									<span className={ModalStyles.headerName}>
										{fren.ens}
									</span>
									<div className={ModalStyles.headerLinks}>
										<a
											href={`https://twitter.com/${
												data && data.twitter
													? data.twitter
													: fren.handle
											}`}
											target="_blank"
										>
											Twitter
										</a>
										<a
											href={`https://opensea.io/${
												data && data.address
													? data.address
													: fren.ens
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
								<p className={ModalStyles.description}>
									{data.description}
								</p>
							) : null}
							{data && allNfts.length > 0 ? (
								<div className={ModalStyles.nfts}>
									{allNfts.map((nft) => {
										if (
											!nft.image_preview_url ||
											nft.image_preview_url.includes(
												'.webm'
											) ||
											nft.image_preview_url.includes(
												'.mp4'
											)
										)
											return
										return (
											<a
												href={nft.permalink}
												className={ModalStyles.nftLink}
												target="_blank"
												rel="noreferrer"
											>
												<div
													style={{
														backgroundImage: `url(${nft.image_preview_url})`,
													}}
													className={
														ModalStyles.nftDiv
													}
													key={nft.id}
												></div>
											</a>
										)
									})}
								</div>
							) : null}
							{allNfts.length > 0 ? (
								<div
									className={ModalStyles.bottomGradient}
									style={{
										bottom: -scrollPosition,
									}}
								></div>
							) : null}
						</>
					)}
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
	)
}
