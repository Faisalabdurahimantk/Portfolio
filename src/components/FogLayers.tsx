interface FogLayersProps {
  depth: 'far' | 'mid' | 'near'
}

/**
 * One depth plane of fog. The outer `.fog-layer` is driven by scroll, the
 * inner `.fog` banks drift idly — separate elements so the two never fight
 * over the same transform.
 */
export function FogLayers({ depth }: FogLayersProps) {
  return (
    <div className={`fog-layer fog-layer--${depth}`} aria-hidden="true">
      <div className="fog fog--a" />
      <div className="fog fog--b" />
      <div className="fog fog--c" />
    </div>
  )
}
