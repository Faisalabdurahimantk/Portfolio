const STORY_LINES = [
  { lead: 'Every product', rest: 'begins in the fog.' },
  { lead: 'Clarity is carved,', rest: 'not found.' },
]

/** Editorial interstitials that surface inside the pinned hero stage. */
export function StoryTransition() {
  return (
    <div className="story-lines" aria-hidden="true">
      {STORY_LINES.map((line, i) => (
        <p className={`story-line story-line--${i + 1}`} key={i}>
          <em>{line.lead}</em>
          <br />
          {line.rest}
        </p>
      ))}
    </div>
  )
}

/** Accessible, static version of the interstitial copy for reduced motion. */
export function StoryStatic() {
  return <p className="story-static">{STORY_LINES.map((l) => `${l.lead} ${l.rest}`).join(' ')}</p>
}
