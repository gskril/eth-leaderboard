import { useState } from 'react'
import Image from 'next/image'

export default function Avatar(props) {
	const { src, fallbackSrc, ...rest } = props
	const [imgSrc, setImgSrc] = useState(src)

	return (
		<Image
			{...rest}
			src={imgSrc}
			onError={() => {
				setImgSrc(fallbackSrc)
			}}
		/>
	)
}
