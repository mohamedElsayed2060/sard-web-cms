'use client'

import Image from 'next/image'

export default function CMSImage({ src, alt = '', ...props }) {
  if (!src) return null

  return <Image src={src} alt={alt} unoptimized {...props} />
}
