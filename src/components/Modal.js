import Image from 'next/image'
import useSWR from 'swr'
import ModalStyles from './../styles/Modal.module.css'

export default function ProfileModal({ setIsOpen, fren }) {
	const fetcher = (...args) => fetch(...args).then((res) => res.json())
	const { data, error } = useSWR(
		`https://ens-records.vercel.app/${fren.name}`,
		fetcher
	)

	return (
		<>
			<div className={ModalStyles.modal}>
				<div className={ModalStyles.modalBackground}></div>
				<div className={ModalStyles.modalContent}>
					{error ? (
						<div>Error</div>
					) : !data ? (
						<div>Loading...</div>
					) : (
						<>
							<div className="modalHeader">
								<Image
									src={`https://metadata.ens.domains/mainnet/avatar/${fren.name}`}
									width={100}
									height={100}
								/>
							</div>
							<div>
								<p>{fren.name}</p>
								{data.description ? (
									<p>{data.description}</p>
								) : (
									''
								)}
								<p>
									OpenSea:{' '}
									<a
										href={`https://opensea.io/${data.address}`}
										target="_blank"
									>
										OpenSea
									</a>
								</p>
								<p>
									Twitter:{' '}
									<a
										href={`https://twitter.com/${fren.handle}`}
										target="_blank"
									>
										@{fren.handle}
									</a>
								</p>
								{data.url ? (
									<p>
										Website:{' '}
										<a href={data.url} target="_blank">
											{data.url}
										</a>
									</p>
								) : (
									''
								)}
								{data.github ? (
									<p>
										Github:{' '}
										<a
											href={`https://github.com/${data.github}`}
											target="_blank"
										>
											{data.github}
										</a>
									</p>
								) : (
									''
								)}
							</div>
							<button onClick={() => setIsOpen(false)}>
								Close
							</button>
						</>
					)}
				</div>
			</div>
		</>
	)
}
