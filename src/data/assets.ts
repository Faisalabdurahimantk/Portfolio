/**
 * Every sculptural layer used on the site. These point at the generated SVG
 * stand-ins in /public/sculpture; replace any `src` with an isolated
 * transparent WebP/PNG (and update width/height) to upgrade the visuals.
 */
export interface SculptureAsset {
  src: string
  width: number
  height: number
  alt: string
}

const asset = (src: string, width: number, height: number, alt = ''): SculptureAsset => ({
  src,
  width,
  height,
  alt,
})

export const sculpture = {
  bust: asset('/sculpture/bust.svg', 1200, 1600, 'Marble bust of a classical figure in profile'),
  doricA: asset('/sculpture/doric-a.svg', 380, 1120, 'Weathered fluted Doric column'),
  doricB: asset('/sculpture/doric-b.svg', 380, 1120, 'Weathered fluted Doric column'),
  fallenColumn: asset('/sculpture/fallen-column.svg', 1100, 560, 'Fallen marble column resting on moss'),
  moss: asset('/sculpture/moss-mound.svg', 2400, 900),
  drapery: asset('/sculpture/drapery.svg', 2400, 1000),
  column: asset('/sculpture/column.svg', 520, 1400, 'Ionic marble column wrapped in climbing flowers'),
  staircase: asset('/sculpture/staircase.svg', 1000, 1300, 'Marble staircase rising into soft light'),
  cloudA: asset('/sculpture/cloud-a.svg', 1200, 600),
  cloudB: asset('/sculpture/cloud-b.svg', 1200, 600),
  forestFar: asset('/sculpture/forest-far.svg', 2400, 900),
  forestMid: asset('/sculpture/forest-mid.svg', 2400, 900),
  forestNear: asset('/sculpture/forest-near.svg', 2400, 900),
}
