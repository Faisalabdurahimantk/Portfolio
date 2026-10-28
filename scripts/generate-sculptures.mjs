/**
 * Generates the art-directed sculpture layers used across the site.
 *
 * These are original, procedurally drawn SVGs (marble shading, veining,
 * drapery folds, foliage) that act as high-quality stand-ins until real
 * photographic cut-outs are available. Swap any of them by editing
 * src/data/assets.ts — no component changes required.
 *
 * Run: npm run assets
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'sculpture')
mkdirSync(OUT, { recursive: true })

// Deterministic RNG so the assets are stable between runs.
function rng(seed) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
const f = (n) => Math.round(n * 10) / 10

const marbleDefs = (id, seed = 3, freq = '0.004 0.013') => `
  <filter id="${id}" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
    <feTurbulence type="fractalNoise" baseFrequency="${freq}" numOctaves="5" seed="${seed}" result="t"/>
    <feColorMatrix in="t" type="matrix" values="0 0 0 0 0.46  0 0 0 0 0.43  0 0 0 0 0.40  1.4 0 0 0 -0.2" result="ta"/>
    <feComponentTransfer in="ta" result="v"><feFuncA type="table" tableValues="0 0 0 0 0 0 0 0 0 0.22 0 0 0 0 0 0 0 0 0"/></feComponentTransfer>
    <feComposite in="v" in2="SourceAlpha" operator="in" result="vm"/>
    <feGaussianBlur in="vm" stdDeviation="0.5" result="vb"/>
    <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${seed + 9}" result="g"/>
    <feColorMatrix in="g" type="matrix" values="0 0 0 0 0.3  0 0 0 0 0.28  0 0 0 0 0.25  0 0 0 0.09 0" result="ga"/>
    <feComposite in="ga" in2="SourceAlpha" operator="in" result="gm"/>
    <feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="vb"/><feMergeNode in="gm"/></feMerge>
  </filter>`

const blur = (id, d) =>
  `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${d}"/></filter>`

/* ------------------------------------------------------------------ */
/* Marble bust — classical profile facing left, head-and-shoulders.    */
/* ------------------------------------------------------------------ */
function bust() {
  const r = rng(11)
  const sil = `M300 84 C372 78 432 120 446 190 C462 252 442 322 402 372 C390 404 392 446 404 520
    C472 556 540 600 566 680 C576 722 572 760 562 792 L70 792 C48 752 54 700 80 660
    C120 600 190 578 246 560 C250 520 252 482 256 452 C236 446 212 436 201 425
    C192 413 195 403 202 398 C195 393 188 387 191 380 C194 375 199 372 198 369
    C191 364 187 358 192 350 C185 346 177 342 171 334 C167 328 169 321 176 315
    C186 296 196 282 200 268 C198 255 200 239 206 221 C216 168 246 100 300 84 Z`
  const hairRegion = `M204 228 C214 164 248 96 302 82 C376 74 438 118 450 192 C462 252 446 320 410 368
    C392 352 376 338 366 322 C372 300 364 280 346 270 C326 256 300 246 276 240 C252 232 226 228 204 228 Z`

  // Curls: small shaded clusters inside the hair mass. The hairline is
  // defined by the curls themselves so it reads as carved, not as a cap.
  const inHair = (x, y) =>
    ((x - 326) / 130) ** 2 + ((y - 214) / 146) ** 2 < 1 &&
    y < 236 + (x - 204) * 0.6 + Math.sin(x / 14) * 6 &&
    Math.hypot(x - 352, y - 318) > 34
  let curls = ''
  let placed = 0
  while (placed < 620) {
    const x = 190 + r() * 280
    const y = 60 + r() * 330
    if (!inHair(x, y)) continue
    placed++
    const rad = 6 + r() * 7
    curls += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(rad)}" fill="url(#curl)"/>`
    if (r() > 0.6)
      curls += `<path d="M${f(x - rad * 0.6)} ${f(y + rad * 0.2)} a${f(rad * 0.6)} ${f(rad * 0.6)} 0 1 1 ${f(rad)} ${f(-rad * 0.3)}" stroke="#857a6b" stroke-opacity=".45" stroke-width="1.6" fill="none"/>`
  }
  // Fine engraved strands to suggest carving.
  let strands = ''
  for (let i = 0; i < 70; i++) {
    const x = 210 + r() * 240
    const y = 90 + r() * 270
    const a = r() * Math.PI * 2
    const l = 10 + r() * 16
    strands += `<path d="M${f(x)} ${f(y)} q${f(Math.cos(a) * l)} ${f(Math.sin(a) * l)} ${f(Math.cos(a + 1.4) * l)} ${f(Math.sin(a + 1.4) * l)}" stroke="#6f6559" stroke-opacity=".35" stroke-width="2" fill="none" stroke-linecap="round"/>`
  }
  // Drapery folds across the chest (himation over left shoulder).
  let folds = ''
  for (let i = 0; i < 9; i++) {
    const t = i / 8
    const x0 = 60 + t * 90
    const y0 = 700 - t * 40
    const x1 = 330 + t * 230
    const y1 = 560 + t * 20
    const cx = (x0 + x1) / 2 + 20
    const cy = 640 + t * 90
    folds += `<path d="M${f(x0)} ${f(y0 + 90)} Q${f(cx)} ${f(cy + 70)} ${f(x1)} ${f(y1 + 130)}" stroke="#7b7062" stroke-opacity=".5" stroke-width="${f(7 + r() * 8)}" fill="none" filter="url(#b6)"/>`
    folds += `<path d="M${f(x0 + 8)} ${f(y0 + 76)} Q${f(cx + 6)} ${f(cy + 56)} ${f(x1 + 6)} ${f(y1 + 116)}" stroke="#fffaf1" stroke-opacity=".75" stroke-width="${f(4 + r() * 6)}" fill="none" filter="url(#b4)"/>`
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 800" width="1200" height="1600">
<defs>
  ${marbleDefs('marble', 3)}
  ${blur('b4', 4)}${blur('b6', 6)}${blur('b12', 12)}${blur('b22', 22)}${blur('b40', 40)}
  <linearGradient id="skin" x1="0" y1="0" x2="1" y2=".25">
    <stop offset="0" stop-color="#fbf7f0"/><stop offset=".45" stop-color="#ebe3d7"/>
    <stop offset=".8" stop-color="#c8bcab"/><stop offset="1" stop-color="#9f9381"/>
  </linearGradient>
  <radialGradient id="curl" cx=".35" cy=".3" r=".75">
    <stop offset="0" stop-color="#f7f2ea"/><stop offset=".6" stop-color="#ddd4c6"/><stop offset="1" stop-color="#a39886"/>
  </radialGradient>
  <clipPath id="clip"><path d="${sil}"/></clipPath>
  <clipPath id="hclip"><path d="${hairRegion}"/></clipPath>
</defs>
<g filter="url(#marble)">
  <path d="${sil}" fill="url(#skin)"/>
  <g clip-path="url(#clip)">
    <!-- form shadows -->
    <path d="M430 160 C470 300 420 420 430 560 L620 600 L620 100 Z" fill="#6c6153" opacity=".45" filter="url(#b40)"/>
    <path d="M205 430 C250 450 300 452 360 420 L380 470 C320 492 250 488 210 470 Z" fill="#5f5548" opacity=".55" filter="url(#b12)"/>
    <path d="M250 470 C246 520 250 540 246 560 L300 570 C300 530 296 500 300 470 Z" fill="#7d7264" opacity=".3" filter="url(#b22)"/>
    <ellipse cx="236" cy="276" rx="26" ry="12" fill="#6f6457" opacity=".45" filter="url(#b6)"/>
    <ellipse cx="190" cy="342" rx="10" ry="6" fill="#5f5548" opacity=".5" filter="url(#b4)"/>
    <path d="M190 369 C196 371 202 371 208 368" stroke="#5a5045" stroke-width="2.5" fill="none" opacity=".6" filter="url(#b4)"/>
    <ellipse cx="206" cy="392" rx="12" ry="5" fill="#6f6457" opacity=".4" filter="url(#b4)"/>
    <path d="M262 300 C290 360 300 400 330 430" stroke="#7a6f61" stroke-width="30" opacity=".28" fill="none" filter="url(#b22)"/>
    <!-- highlights -->
    <ellipse cx="230" cy="215" rx="40" ry="26" fill="#fff" opacity=".7" filter="url(#b22)"/>
    <ellipse cx="248" cy="340" rx="38" ry="44" fill="#fff" opacity=".45" filter="url(#b22)"/>
    <path d="M196 290 C190 305 182 318 178 326" stroke="#fff" stroke-width="5" opacity=".8" filter="url(#b4)"/>
    <ellipse cx="160" cy="680" rx="110" ry="60" fill="#fff" opacity=".5" filter="url(#b40)"/>
    <!-- eye -->
    <path d="M214 285 C222 279 232 279 240 284 C232 290 222 291 214 285 Z" fill="#cfc4b4"/>
    <path d="M213 284 C222 278 233 278 241 284" stroke="#5f5548" stroke-width="2" fill="none" opacity=".55" filter="url(#b4)"/>
    <!-- ear -->
    <ellipse cx="352" cy="318" rx="17" ry="31" fill="#dcd2c3"/>
    <ellipse cx="356" cy="320" rx="8" ry="18" fill="#7a6f61" opacity=".55" filter="url(#b4)"/>
    <!-- drapery -->
    ${folds}
  </g>
  <g clip-path="url(#clip)">
    <path d="${hairRegion}" fill="#b9ad9b" transform="translate(14 8) scale(.96)" filter="url(#b6)"/>
    ${curls}
    ${strands}
    <path d="M440 170 C470 260 440 340 404 376" stroke="#4f463c" stroke-width="40" opacity=".35" fill="none" filter="url(#b22)"/>
  </g>
</g>
</svg>`
}

/* ------------------------------------------------------------------ */
/* Flowing drapery — the large transitional fabric layer.              */
/* ------------------------------------------------------------------ */
function drapery() {
  const r = rng(5)
  const W = 2400
  const H = 1000
  // Wavy top edge, flat bottom.
  let top = `M0 ${H} L0 380`
  for (let x = 0; x <= W; x += 200) {
    const y = 300 + Math.sin(x / 260) * 110 + (r() - 0.5) * 60
    top += ` S${f(x - 100)} ${f(y - 80)} ${x} ${f(y)}`
  }
  top += ` L${W} ${H} Z`
  let folds = ''
  for (let i = 0; i < 30; i++) {
    const x = (i / 29) * W + (r() - 0.5) * 80
    const sway = 120 + r() * 220
    const w = 26 + r() * 50
    // Diagonal, S-curved folds so the cloth reads as draped, not as a curtain.
    const d = `M${f(x - 200)} 160 C${f(x + sway)} 360 ${f(x - sway * 0.6)} 560 ${f(x + sway * 0.9)} ${H + 40}`
    const dark = r() > 0.5
    folds += `<path d="${d}" stroke="${dark ? '#8b8d89' : '#ffffff'}" stroke-opacity="${dark ? f(0.12 + r() * 0.2) : f(0.45 + r() * 0.35)}" stroke-width="${f(w)}" fill="none" filter="url(#b22)"/>`
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="none">
<defs>
  ${blur('b8', 8)}${blur('b22', 22)}${blur('edge', 18)}
  <linearGradient id="cloth" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#fdfdfb"/><stop offset=".5" stop-color="#efeeea"/><stop offset="1" stop-color="#e9e8e3"/>
  </linearGradient>
  <clipPath id="c"><path d="${top}"/></clipPath>
</defs>
<path d="${top}" fill="url(#cloth)" filter="url(#edge)" opacity=".85"/>
<g clip-path="url(#c)">
  <path d="${top}" fill="url(#cloth)"/>
  ${folds}
  <rect x="0" y="720" width="${W}" height="${H - 720}" fill="#e9e8e3"/>
  <rect x="0" y="560" width="${W}" height="200" fill="#e9e8e3" opacity=".6" filter="url(#b22)"/>
</g>
</svg>`
}

/* ------------------------------------------------------------------ */
/* Ionic column wrapped in flowers — final visual anchor.              */
/* ------------------------------------------------------------------ */
function column() {
  const r = rng(21)
  const W = 520
  const H = 1400
  let flutes = ''
  for (let i = 0; i < 11; i++) {
    const x = 130 + i * 24
    flutes += `<rect x="${x}" y="300" width="12" height="930" rx="6" fill="url(#flute)"/>`
  }
  const petals = (cx, cy, s, hue) => {
    let p = ''
    const n = 5 + Math.floor(r() * 3)
    const rot = r() * 360
    for (let k = 0; k < n; k++) {
      p += `<ellipse cx="${f(cx)}" cy="${f(cy - s * 0.55)}" rx="${f(s * 0.42)}" ry="${f(s * 0.6)}" fill="${hue}" transform="rotate(${f(rot + (k * 360) / n)} ${f(cx)} ${f(cy)})"/>`
    }
    return p + `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(s * 0.22)}" fill="#c9a25e"/>`
  }
  const hues = ['#f6e9df', '#efd6cc', '#f9f3ea', '#e9c9bd', '#f1e3d0']
  let vine = ''
  let flowers = ''
  // Spiral vine around the shaft.
  let d = 'M120 1220'
  for (let y = 1220; y >= 250; y -= 40) {
    const x = 260 + Math.sin(y / 70) * 150
    d += ` L${f(x)} ${y}`
  }
  vine += `<path d="${d}" stroke="#7d8a6a" stroke-width="5" fill="none" opacity=".8"/>`
  for (let i = 0; i < 90; i++) {
    const y = 240 + r() * 1000
    const x = 260 + Math.sin(y / 70) * 150 + (r() - 0.5) * 50
    const lx = x + (r() - 0.5) * 50
    vine += `<ellipse cx="${f(lx)}" cy="${f(y)}" rx="16" ry="6" fill="${r() > 0.5 ? '#8e9b78' : '#a8b291'}" transform="rotate(${f(r() * 180)} ${f(lx)} ${f(y)})"/>`
  }
  // Dense crown of flowers at the capital, sparse along the vine.
  for (let i = 0; i < 46; i++) {
    const cx = 70 + r() * 380
    const cy = 170 + r() * 140
    flowers += petals(cx, cy, 14 + r() * 16, hues[Math.floor(r() * hues.length)])
  }
  for (let i = 0; i < 26; i++) {
    const y = 360 + r() * 860
    const x = 260 + Math.sin(y / 70) * 150
    flowers += petals(x, y, 10 + r() * 12, hues[Math.floor(r() * hues.length)])
  }
  const volute = (cx, dir) =>
    `<circle cx="${cx}" cy="250" r="44" fill="url(#stone)"/><path d="M${cx} 250 m0 -30 a30 30 0 1 ${dir > 0 ? 1 : 0} 0.1 0 m0 12 a18 18 0 1 ${dir > 0 ? 1 : 0} 0.1 0 m0 10 a8 8 0 1 ${dir > 0 ? 1 : 0} 0.1 0" stroke="#8f8474" stroke-width="3" fill="none"/>`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs>
  ${marbleDefs('marble', 8, '0.006 0.02')}
  ${blur('b10', 10)}${blur('b30', 30)}
  <linearGradient id="stone" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#fbf8f2"/><stop offset=".55" stop-color="#e6ddcf"/><stop offset="1" stop-color="#a99d8b"/>
  </linearGradient>
  <linearGradient id="flute" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#9c907f" stop-opacity=".55"/><stop offset=".5" stop-color="#fff" stop-opacity=".3"/><stop offset="1" stop-color="#9c907f" stop-opacity=".1"/>
  </linearGradient>
</defs>
<ellipse cx="260" cy="1365" rx="230" ry="26" fill="#6c6153" opacity=".35" filter="url(#b30)"/>
<g filter="url(#marble)">
  <path d="M120 300 L400 300 L392 1230 L128 1230 Z" fill="url(#stone)"/>
  ${flutes}
  <rect x="70" y="1230" width="380" height="40" rx="6" fill="url(#stone)"/>
  <rect x="40" y="1270" width="440" height="70" rx="4" fill="url(#stone)"/>
  <rect x="100" y="270" width="320" height="34" fill="url(#stone)"/>
  <path d="M60 210 L460 210 L440 262 L80 262 Z" fill="url(#stone)"/>
  ${volute(84, -1)}${volute(436, 1)}
  <rect x="50" y="180" width="420" height="32" fill="url(#stone)"/>
</g>
<g>${vine}${flowers}</g>
</svg>`
}

/* ------------------------------------------------------------------ */
/* Ornate marble staircase — architectural transition.                 */
/* ------------------------------------------------------------------ */
function staircase() {
  const W = 1000
  const H = 1300
  let steps = ''
  const vx = 500
  for (let i = 0; i < 26; i++) {
    const t = i / 25
    const y = 1300 - Math.pow(t, 0.85) * 780
    const half = 520 - t * 330
    const h = 34 - t * 22
    steps += `<path d="M${f(vx - half)} ${f(y)} L${f(vx + half)} ${f(y)} L${f(vx + half)} ${f(y - h * 0.35)} L${f(vx - half)} ${f(y - h * 0.35)} Z" fill="#d6ccbd"/>`
    steps += `<path d="M${f(vx - half)} ${f(y - h * 0.35)} L${f(vx + half)} ${f(y - h * 0.35)} L${f(vx + half - 6)} ${f(y - h)} L${f(vx - half + 6)} ${f(y - h)} Z" fill="url(#tread)"/>`
  }
  let rails = ''
  for (const side of [-1, 1]) {
    for (let i = 0; i < 18; i++) {
      const t = i / 17
      const y = 1240 - Math.pow(t, 0.85) * 740
      const x = vx + side * (560 - t * 350)
      const s = 1 - t * 0.6
      rails += `<path d="M${f(x - 9 * s)} ${f(y)} C${f(x - 16 * s)} ${f(y - 30 * s)} ${f(x - 4 * s)} ${f(y - 50 * s)} ${f(x - 6 * s)} ${f(y - 80 * s)} L${f(x + 6 * s)} ${f(y - 80 * s)} C${f(x + 4 * s)} ${f(y - 50 * s)} ${f(x + 16 * s)} ${f(y - 30 * s)} ${f(x + 9 * s)} ${f(y)} Z" fill="url(#bal)"/>`
    }
    const x0 = vx + side * 580
    const x1 = vx + side * 200
    rails += `<path d="M${x0} ${1150} L${x1} ${430} L${x1} ${448} L${x0} ${1185} Z" fill="url(#bal)"/>`
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs>
  ${marbleDefs('marble', 14, '0.005 0.03')}
  ${blur('b60', 60)}
  <linearGradient id="tread" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#f6f1e8"/><stop offset=".6" stop-color="#ece5da"/><stop offset="1" stop-color="#c7bba9"/>
  </linearGradient>
  <linearGradient id="bal" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#fbf7f0"/><stop offset="1" stop-color="#b6aa98"/>
  </linearGradient>
  <linearGradient id="haze" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#e9e8e3"/><stop offset=".5" stop-color="#e9e8e3" stop-opacity="0"/>
  </linearGradient>
  <radialGradient id="glow" cx=".5" cy=".3" r=".5"><stop offset="0" stop-color="#fffaf0"/><stop offset="1" stop-color="#fffaf0" stop-opacity="0"/></radialGradient>
</defs>
<rect width="${W}" height="${H}" fill="#e4e3de"/>
<rect width="${W}" height="${H}" fill="url(#glow)"/>
<path d="M300 520 L300 120 C300 40 700 40 700 120 L700 520 Z" fill="#f7f2ea"/>
<g filter="url(#marble)">${steps}${rails}</g>
<rect width="${W}" height="${H * 0.6}" fill="url(#haze)"/>
</svg>`
}

/* ------------------------------------------------------------------ */
/* Cream cloud — atmospheric bridge between sections.                  */
/* ------------------------------------------------------------------ */
function cloud(seed) {
  const r = rng(seed)
  const W = 1200
  const H = 600
  let puffs = ''
  for (let i = 0; i < 38; i++) {
    const x = 160 + r() * 880
    const t = 1 - Math.abs(x - 600) / 480
    const y = 380 - r() * 200 * t
    const rad = 60 + r() * 120 * t
    puffs += `<circle cx="${f(x)}" cy="${f(y)}" r="${f(rad)}" fill="url(#puff)"/>`
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs>
  <filter id="soft" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="14"/></filter>
  <radialGradient id="puff" cx=".42" cy=".35" r=".65">
    <stop offset="0" stop-color="#ffffff"/><stop offset=".6" stop-color="#eeeeeb"/><stop offset="1" stop-color="#cfd1cf" stop-opacity=".0"/>
  </radialGradient>
</defs>
<g filter="url(#soft)">${puffs}</g>
</svg>`
}

/* ------------------------------------------------------------------ */
/* Misty pine forest — atmospheric depth layer.                        */
/* ------------------------------------------------------------------ */
function forest(seed, color, minH, maxH, count) {
  const r = rng(seed)
  const W = 2400
  const H = 900
  let trees = ''
  for (let i = 0; i < count; i++) {
    const x = r() * W
    const h = minH + r() * (maxH - minH)
    const w = h * (0.22 + r() * 0.08)
    const base = H
    let d = `M${f(x)} ${f(base - h)}`
    const tiers = 11
    for (let k = 1; k <= tiers; k++) {
      const ty = base - h + (h * 0.9 * k) / tiers
      const tw = (w * k) / tiers
      d += ` L${f(x + tw)} ${f(ty)} L${f(x + tw * 0.72)} ${f(ty - 3)}`
    }
    for (let k = tiers; k >= 1; k--) {
      const ty = base - h + (h * 0.9 * k) / tiers
      const tw = (w * k) / tiers
      d += ` L${f(x - tw * 0.72)} ${f(ty - 3)} L${f(x - tw)} ${f(ty)}`
    }
    d += ` L${f(x - 4)} ${base} L${f(x + 4)} ${base} Z`
    trees += `<path d="${d}" fill="${color}"/>`
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="xMidYMax slice">${trees}<rect y="${H - 120}" width="${W}" height="120" fill="${color}"/></svg>`
}


/* ------------------------------------------------------------------ */
/* Weathered Doric column — standing, chipped slab, cracks.            */
/* ------------------------------------------------------------------ */
function jagged(r, pts, amp) {
  // Roughen a polyline so stone edges read as chipped rather than drawn.
  return pts.map(([x, y], i) => (i === 0 || i === pts.length - 1 ? [x, y] : [x + (r() - 0.5) * amp, y + (r() - 0.5) * amp]))
}
const poly = (pts) => 'M' + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L') + ' Z'

function doricColumn(seed, broken = 0.4) {
  const r = rng(seed)
  const W = 380
  const H = 1120
  const top = 150
  const bot = 1010
  const lx0 = 86, rx0 = 294 // bottom edges
  const lx1 = 98, rx1 = 282 // top edges (entasis)
  // Shaft outline with chipped edges.
  const left = [], right = []
  for (let y = top; y <= bot; y += 22) {
    const t = (y - top) / (bot - top)
    const chip = r() < 0.12 ? 6 + r() * 10 : r() * 2
    left.push([lx1 + (lx0 - lx1) * t + chip, y])
    right.push([rx1 + (rx0 - rx1) * t - (r() < 0.1 ? 6 + r() * 8 : r() * 2), y])
  }
  const shaft = poly([...left, ...right.reverse()])
  // Flutes: alternating shadow/light channels following the taper.
  let flutes = ''
  const n = 12
  for (let i = 0; i < n; i++) {
    const a = (i + 0.5) / n
    const xt = lx1 + (rx1 - lx1) * a
    const xb = lx0 + (rx0 - lx0) * a
    const shade = 0.12 + 0.5 * Math.pow(a, 1.6)
    flutes += `<path d="M${f(xt)} ${top} L${f(xb)} ${bot}" stroke="#5c5e5c" stroke-opacity="${f(shade)}" stroke-width="3.2" filter="url(#b1)"/>`
    flutes += `<path d="M${f(xt - 5)} ${top} L${f(xb - 5)} ${bot}" stroke="#fff" stroke-opacity="${f(0.55 - a * 0.4)}" stroke-width="2.4" filter="url(#b1)"/>`
  }
  // Cracks and chipped patches.
  let cracks = ''
  for (let i = 0; i < 4; i++) {
    let x = 110 + r() * 160
    let y = top + 60 + r() * 700
    let d = `M${f(x)} ${f(y)}`
    for (let k = 0; k < 9; k++) {
      x += (r() - 0.35) * 26
      y += 14 + r() * 30
      d += ` L${f(x)} ${f(y)}`
    }
    cracks += `<path d="${d}" stroke="#3f403e" stroke-opacity=".55" stroke-width="${f(1 + r() * 1.4)}" fill="none"/>`
  }
  let patches = ''
  for (let i = 0; i < 7; i++) {
    const cx = 100 + r() * 180
    const cy = top + 40 + r() * 800
    const pts = []
    const m = 7
    for (let k = 0; k < m; k++) {
      const a = (k / m) * Math.PI * 2
      const rad = 8 + r() * 26
      pts.push([cx + Math.cos(a) * rad, cy + Math.sin(a) * rad * 1.6])
    }
    patches += `<path d="${poly(pts)}" fill="${r() > 0.5 ? '#fbfbf9' : '#9fa19d'}" opacity=".55" filter="url(#b1)"/>`
  }
  // Broken abacus slab, echinus ring, base plinth.
  const slabTop = jagged(r, [[30, 118], [80, 96], [140, 104], [200, 90], [260, 100], [330, 92], [356, 112]], 14)
  const slab = poly([...slabTop, [348, 148], [36, 152]])
  const plinth = poly(jagged(r, [[40, 1036], [340, 1030], [352, 1080], [28, 1086]], 6))
  const brokenTop = broken > 0 ? `<path d="${poly(jagged(r, [[60, 92], [140, 70], [230, 84], [320, 76]], 22).concat([[320, 120], [60, 120]]))}" fill="#e9e9e6" filter="url(#stone)"/>` : ''
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs>
  ${marbleDefs('stone', seed, '0.012 0.05')}
  ${blur('b1', 1)}${blur('b8', 8)}${blur('b30', 30)}
  <linearGradient id="lit" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#d8d9d6"/><stop offset=".22" stop-color="#fbfbf9"/><stop offset=".55" stop-color="#ecece8"/><stop offset="1" stop-color="#9c9e9b"/>
  </linearGradient>
  <linearGradient id="slab" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#fdfdfb"/><stop offset="1" stop-color="#b9bbb7"/>
  </linearGradient>
  <clipPath id="sc"><path d="${shaft}"/></clipPath>
</defs>
<ellipse cx="190" cy="1092" rx="210" ry="22" fill="#1d2410" opacity=".45" filter="url(#b30)"/>
<g filter="url(#stone)">
  <path d="${plinth}" fill="url(#slab)"/>
  <rect x="62" y="1004" width="256" height="34" rx="16" fill="url(#lit)"/>
  <path d="${shaft}" fill="url(#lit)"/>
  <g clip-path="url(#sc)">
    ${flutes}${patches}
    <rect x="60" y="${top}" width="260" height="60" fill="#5c5e5c" opacity=".35" filter="url(#b8)"/>
    ${cracks}
  </g>
  <path d="M70 128 Q190 152 310 128 L300 160 Q190 178 80 160 Z" fill="url(#lit)"/>
  <path d="${slab}" fill="url(#slab)"/>
  ${brokenTop}
</g>
</svg>`
}

/* ------------------------------------------------------------------ */
/* Fallen column — lying across the mound, broken end, rubble.         */
/* ------------------------------------------------------------------ */
function fallenColumn() {
  const r = rng(42)
  const W = 1100
  const H = 560
  const x0 = 60, x1 = 820, cy = 300, rad = 100
  // Body: a long cylinder seen from the side, slightly tapered.
  const body = `M${x0} ${cy - rad * 0.9} L${x1} ${cy - rad} L${x1} ${cy + rad} L${x0} ${cy + rad * 0.9} Z`
  let flutes = ''
  for (let i = 1; i < 11; i++) {
    const t = i / 11
    const y0 = cy - rad * 0.9 + t * rad * 1.8
    const y1 = cy - rad + t * rad * 2
    const shade = 0.12 + 0.55 * Math.pow(t, 1.5)
    flutes += `<path d="M${x0} ${f(y0)} L${x1} ${f(y1)}" stroke="#575956" stroke-opacity="${f(shade)}" stroke-width="3.4" filter="url(#b1)"/>`
    flutes += `<path d="M${x0} ${f(y0 - 5)} L${x1} ${f(y1 - 5)}" stroke="#fff" stroke-opacity="${f(0.6 - t * 0.5)}" stroke-width="2.2" filter="url(#b1)"/>`
  }
  // Broken end: jagged, chunky block with dark crevices.
  const endPts = jagged(r, [[x1 - 30, cy - rad - 6], [x1 + 40, cy - rad - 40], [x1 + 120, cy - rad - 26], [x1 + 150, cy - 30], [x1 + 140, cy + 60], [x1 + 110, cy + rad + 30], [x1 + 30, cy + rad + 14], [x1 - 30, cy + rad]], 18)
  let crev = ''
  for (let i = 0; i < 6; i++) {
    let x = x1 + 10 + r() * 110
    let y = cy - rad + r() * 160
    let d = `M${f(x)} ${f(y)}`
    for (let k = 0; k < 5; k++) {
      x += (r() - 0.5) * 40
      y += 10 + r() * 22
      d += ` L${f(x)} ${f(y)}`
    }
    crev += `<path d="${d}" stroke="#3a3b39" stroke-opacity=".6" stroke-width="2" fill="none"/>`
  }
  const rock = (cx, cyy, s) => {
    const pts = []
    for (let k = 0; k < 8; k++) {
      const a = (k / 8) * Math.PI * 2
      pts.push([cx + Math.cos(a) * s * (0.8 + r() * 0.4), cyy + Math.sin(a) * s * 0.55 * (0.8 + r() * 0.4)])
    }
    return `<path d="${poly(pts)}" fill="url(#rock)"/>`
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
<defs>
  ${marbleDefs('stone', 42, '0.05 0.012')}
  ${blur('b1', 1)}${blur('b24', 24)}
  <linearGradient id="cyl" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#d9dad6"/><stop offset=".18" stop-color="#fbfbf9"/><stop offset=".55" stop-color="#e3e4e0"/><stop offset="1" stop-color="#8e908c"/>
  </linearGradient>
  <linearGradient id="rock" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4f4f1"/><stop offset="1" stop-color="#9d9f9b"/></linearGradient>
  <clipPath id="bc"><path d="${body}"/></clipPath>
</defs>
<ellipse cx="520" cy="${cy + rad + 30}" rx="480" ry="40" fill="#1d2410" opacity=".5" filter="url(#b24)"/>
<g filter="url(#stone)">
  <path d="${body}" fill="url(#cyl)"/>
  <g clip-path="url(#bc)">${flutes}</g>
  <path d="${poly(endPts)}" fill="url(#rock)"/>
  ${crev}
  ${rock(940, 470, 46)}${rock(1030, 480, 30)}${rock(880, 500, 20)}
</g>
</svg>`
}

/* ------------------------------------------------------------------ */
/* Moss mound — soft grassy dome the ruins sit on.                     */
/* ------------------------------------------------------------------ */
function mossMound() {
  const r = rng(77)
  const W = 2400
  const H = 900
  const edge = (x) => 250 + Math.pow((x - W * 0.46) / (W * 0.62), 2) * 520
  let d = `M0 ${H}`
  for (let x = 0; x <= W; x += 40) d += ` L${x} ${f(edge(x))}`
  d += ` L${W} ${H} Z`
  // Blades along the silhouette so the edge reads as grass, not a shape.
  let blades = ''
  const greens = ['#5b6a2c', '#6c7b36', '#4c5a24', '#7c8a44', '#43501e']
  for (let i = 0; i < 2600; i++) {
    const x = r() * W
    const y = edge(x) + r() * 26
    const h = 8 + r() * 18
    blades += `<path d="M${f(x)} ${f(y)} l${f((r() - 0.5) * 6)} ${f(-h)}" stroke="${greens[Math.floor(r() * greens.length)]}" stroke-width="${f(1.2 + r() * 1.6)}" stroke-linecap="round"/>`
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" preserveAspectRatio="xMidYMax slice">
<defs>
  <linearGradient id="moss" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#6e7d38"/><stop offset=".3" stop-color="#56652a"/><stop offset=".7" stop-color="#3c4a1b"/><stop offset="1" stop-color="#28330f"/>
  </linearGradient>
  <radialGradient id="sheen" cx=".45" cy=".25" r=".6"><stop offset="0" stop-color="#9aa860" stop-opacity=".45"/><stop offset="1" stop-color="#9aa860" stop-opacity="0"/></radialGradient>
  <filter id="grass" x="0" y="0" width="100%" height="100%">
    <feTurbulence type="fractalNoise" baseFrequency="0.9 0.08" numOctaves="3" seed="5" result="n"/>
    <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.16  0 0 0 0 0.2  0 0 0 0 0.07  0 0 0 0.75 -0.1" result="g"/>
    <feComposite in="g" in2="SourceAlpha" operator="in" result="gm"/>
    <feTurbulence type="fractalNoise" baseFrequency="1.4 0.12" numOctaves="2" seed="9" result="n2"/>
    <feColorMatrix in="n2" type="matrix" values="0 0 0 0 0.62  0 0 0 0 0.68  0 0 0 0 0.38  0 0 0 0.5 -0.22" result="h"/>
    <feComposite in="h" in2="SourceAlpha" operator="in" result="hm"/>
    <feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="gm"/><feMergeNode in="hm"/></feMerge>
  </filter>
  <filter id="soft"><feGaussianBlur stdDeviation=".5"/></filter>
</defs>
<g filter="url(#grass)">
  <path d="${d}" fill="url(#moss)"/>
  <path d="${d}" fill="url(#sheen)"/>
</g>
<g filter="url(#soft)">${blades}</g>
</svg>`
}

const files = {
  'bust.svg': bust(),
  'drapery.svg': drapery(),
  'column.svg': column(),
  'staircase.svg': staircase(),
  'doric-a.svg': doricColumn(31),
  'doric-b.svg': doricColumn(57),
  'fallen-column.svg': fallenColumn(),
  'moss-mound.svg': mossMound(),
  'cloud-a.svg': cloud(4),
  'cloud-b.svg': cloud(17),
  'forest-far.svg': forest(2, '#a3aea0', 260, 480, 70),
  'forest-mid.svg': forest(9, '#5e6c58', 360, 640, 48),
  'forest-near.svg': forest(23, '#27321f', 520, 860, 26),
}
for (const [name, svg] of Object.entries(files)) {
  writeFileSync(join(OUT, name), svg.replace(/\n\s*/g, '\n'))
  console.log('wrote', name, (svg.length / 1024).toFixed(1) + 'kb')
}
