import { useEffect, useRef, useState } from 'react'
import { useCowsBulls } from './useCowsBulls.js'
import './cows-bulls.css'

/**
 * Cows & Bulls: Wordle with no colours. Feedback is counts only.
 * Ready-made view. Depends only on React and ./cows-bulls.css (no Tailwind, no UI kit).
 *
 * Props (all optional, works standalone):
 *  maxAttempts  number  Default 10.
 *  secret       string  Fixed 4-letter secret, for tests or a scripted story beat.
 *  onSolve      ({ word, attempts, history }) called once when guessed.
 *  onFail       ({ word, history }) called once when attempts run out.
 *  onExit       () optional; shows an "Exit" button when provided.
 *  showReplay   boolean Default true. Set false if the story handles what comes next.
 *  className    string  Extra class on the root.
 * history = [{ guess, bulls, cows, miss }].
 *
 * Theming: override the --cb-* CSS variables on .cb (see cows-bulls.css).
 * Fully custom UI: use the useCowsBulls() hook instead.
 */

const ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM']

function Count({ n, kind }) {
  return (
    <span className={`cb-count cb-count--${kind}`}>
      <span className="cb-dots" aria-hidden="true">
        {Array.from({ length: n }, (_, i) => (
          <span key={i} />
        ))}
      </span>
      {n} {kind === 'bull' ? (n === 1 ? 'bull' : 'bulls') : n === 1 ? 'cow' : 'cows'}
    </span>
  )
}

export function CowsBulls({ maxAttempts, secret, onSolve, onFail, onExit, showReplay = true, className = '' }) {
  const g = useCowsBulls({ maxAttempts, secret, onSolve, onFail })
  const endRef = useRef(null)
  const [shake, setShake] = useState(0)

  useEffect(() => {
    if (g.error) setShake((n) => n + 1)
  }, [g.error])

  useEffect(() => {
    if (!g.history.length) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    endRef.current?.scrollIntoView?.({ block: 'nearest', behavior: reduce ? 'auto' : 'smooth' })
  }, [g.history.length])

  const slots = Array.from({ length: g.wordLength }, (_, i) => g.current[i] || '')
  const won = g.status === 'won'

  return (
    <div className={`cb ${className}`}>
      <header className="cb-head">
        <div>
          <h2 className="cb-title">Cows &amp; Bulls</h2>
          <p className="cb-sub">Wordle with no colours</p>
        </div>
        <div className="cb-head-right">
          <span className="cb-pill" aria-label={`${g.attemptsLeft} attempts left`}>
            {g.attemptsLeft} / {g.maxAttempts}
          </span>
          {onExit && (
            <button type="button" className="cb-btn cb-btn--ghost" onClick={onExit}>
              Exit
            </button>
          )}
        </div>
      </header>

      <p className="cb-rules">
        <b>Bull</b> = right letter, right spot. <b>Cow</b> = right letter, wrong spot. No repeated letters.
        <span>Secret TALE, guess BATH: 1 bull (A), 1 cow (T). Zero of both turns the row red and greys out its letters.</span>
      </p>

      <ol className="cb-history" aria-label="Guess history">
        {g.history.length === 0 && <li className="cb-empty">No guesses yet. Type a {g.wordLength}-letter word.</li>}
        {g.history.map((h, i) => (
          <li key={i} className={`cb-row${h.miss ? ' cb-row--miss' : ''}`}>
            <span className="cb-num">{i + 1}</span>
            <span className="cb-tiles">
              {[...h.guess].map((c, j) => (
                <span key={j} className="cb-tile cb-tile--sm">
                  {c}
                </span>
              ))}
            </span>
            <span className="cb-score" aria-label={`${h.bulls} bulls, ${h.cows} cows`}>
              <Count n={h.bulls} kind="bull" />
              <Count n={h.cows} kind="cow" />
            </span>
          </li>
        ))}
        <li ref={endRef} aria-hidden="true" />
      </ol>

      {g.status === 'playing' ? (
        <div className="cb-play">
          <div key={shake} className={`cb-tiles cb-current${shake ? ' cb-shake' : ''}`} aria-label="Current guess">
            {slots.map((c, i) => (
              <span key={i} className={`cb-tile${c ? ' cb-tile--filled' : ''}${i === g.current.length ? ' cb-tile--active' : ''}`}>
                {c}
              </span>
            ))}
          </div>
          <p role="alert" className="cb-error">
            {g.error}
          </p>

          <div className="cb-keys" aria-label="Keyboard">
            {ROWS.map((row, ri) => (
              <div key={row} className="cb-keyrow">
                {ri === 2 && (
                  <button type="button" className="cb-key cb-key--wide cb-key--enter" onClick={g.submit}>
                    Enter
                  </button>
                )}
                {[...row].map((k) => {
                  const out = g.eliminated.has(k)
                  const crossed = g.crossed.has(k)
                  return (
                    <button
                      key={k}
                      type="button"
                      onClick={() => g.tapKey(k)}
                      aria-pressed={crossed}
                      aria-label={out ? `${k}, not in the word` : crossed ? `${k}, crossed out` : k}
                      className={`cb-key${out ? ' cb-key--out' : ''}${crossed ? ' cb-key--crossed' : ''}`}
                    >
                      {k}
                    </button>
                  )
                })}
                {ri === 2 && (
                  <button type="button" className="cb-key cb-key--wide" onClick={g.back} aria-label="Backspace">
                    Back
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className={`cb-notes${g.noteMode ? ' cb-notes--on' : ''}`}
              onClick={() => g.setNoteMode(!g.noteMode)}
              aria-pressed={g.noteMode}
            >
              {g.noteMode ? 'Notes on: tap letters to cross out' : 'Notes off: tap to cross out letters'}
            </button>
          </div>
        </div>
      ) : (
        <div className={`cb-end cb-end--${won ? 'won' : 'lost'}`}>
          <h3 className="cb-end-title">{won ? 'Cracked it!' : 'Out of tries'}</h3>
          <p>{won ? `You found ${g.secret} in ${g.history.length} ${g.history.length === 1 ? 'guess' : 'guesses'}.` : 'The secret word was:'}</p>
          <span className="cb-tiles">
            {[...g.secret].map((c, i) => (
              <span key={i} className="cb-tile cb-tile--filled">
                {c}
              </span>
            ))}
          </span>
          {showReplay && (
            <button type="button" className="cb-btn" onClick={g.playAgain}>
              Play again
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default CowsBulls
