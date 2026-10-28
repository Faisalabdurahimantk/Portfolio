import type { ImgHTMLAttributes } from 'react'
import type { SculptureAsset } from '../data/assets'

type SculptureImageProps = {
  asset: SculptureAsset
  priority?: boolean
  /** Hide from assistive tech even if the asset carries alt text. */
  decorative?: boolean
} & Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'width' | 'height' | 'alt'>

/** Sized, lazily decoded sculpture layer. Decorative unless the asset has alt text. */
export function SculptureImage({ asset, priority = false, decorative = false, ...rest }: SculptureImageProps) {
  return (
    <img
      src={asset.src}
      width={asset.width}
      height={asset.height}
      alt={decorative ? '' : asset.alt}
      aria-hidden={decorative || !asset.alt ? true : undefined}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      {...rest}
    />
  )
}
