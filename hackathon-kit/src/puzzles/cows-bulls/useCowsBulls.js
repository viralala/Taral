// Headless Cows & Bulls: all game state and actions, no markup or styles.
// Use it to build a completely custom UI, or use <CowsBulls /> for the ready-made one.
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { MAX_ATTEMPTS, WORD_LENGTH, eliminatedLetters, pickSecret, scoreGuess, validateGuess } from './logic.js'

/**
 * const game = useCowsBulls({ onSolve, onFail })
 *
 * Options (all optional):
 *  maxAttempts  number   Default 10.
 *  secret       string   Fixed secret, for tests or a scripted story beat.
 *  onSolve      ({ word, attempts, history }) once, on a win.
 *  onFail       ({ word, history }) once, when attempts run out.
 *  keyboard     boolean  Listen to the physical keyboard. Default true.
 *
 * Returns:
 *  secret, history [{ guess, bulls, cows, miss }], current, error,
 *  status 'playing' | 'won' | 'lost', attemptsLeft, maxAttempts, wordLength,
 *  eliminated  Set of letters proven absent (from 0 bull / 0 cow guesses),
 *  crossed     Set of letters the player crossed out by hand (notes),
 *  noteMode    true when key taps cross letters out instead of typing,
 *  type(ch), back(), submit(), tapKey(ch), toggleCross(ch), setNoteMode(bool), playAgain()
 */
export function useCowsBulls({ maxAttempts = MAX_ATTEMPTS, secret: fixedSecret, onSolve, onFail, keyboard = true } = {}) {
  const [secret, setSecret] = useState(() => (fixedSecret ? fixedSecret.toUpperCase() : pickSecret()))
  const [history, setHistory] = useState([])
  const [current, setCurrent] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState('playing')
  const [crossed, setCrossed] = useState(() => new Set())
  const [noteMode, setNoteMode] = useState(false)

  // Keep the latest callbacks without re-binding the keyboard listener every render.
  const callbacks = useRef({ onSolve, onFail })
  callbacks.current = { onSolve, onFail }

  const eliminated = useMemo(() => eliminatedLetters(history), [history])

  const type = useCallback(
    (ch) => {
      if (status !== 'playing') return
      setError('')
      setCurrent((c) => (c.length < WORD_LENGTH ? c + ch.toUpperCase() : c))
    },
    [status],
  )

  const back = useCallback(() => {
    setError('')
    setCurrent((c) => c.slice(0, -1))
  }, [])

  const submit = useCallback(() => {
    if (status !== 'playing') return
    const v = validateGuess(current)
    if (!v.ok) {
      setError(v.message)
      return
    }
    const guess = current.toUpperCase()
    const next = [...history, { guess, ...scoreGuess(secret, guess) }]
    setHistory(next)
    setCurrent('')
    setError('')
    if (guess === secret) {
      setStatus('won')
      callbacks.current.onSolve?.({ word: secret, attempts: next.length, history: next })
    } else if (next.length >= maxAttempts) {
      setStatus('lost')
      callbacks.current.onFail?.({ word: secret, history: next })
    }
  }, [status, current, history, secret, maxAttempts])

  const toggleCross = useCallback(
    (ch) =>
      setCrossed((s) => {
        const n = new Set(s)
        if (n.has(ch)) n.delete(ch)
        else n.add(ch)
        return n
      }),
    [],
  )

  const tapKey = useCallback((ch) => (noteMode ? toggleCross(ch) : type(ch)), [noteMode, toggleCross, type])

  const playAgain = useCallback(() => {
    setSecret(pickSecret())
    setHistory([])
    setCurrent('')
    setError('')
    setStatus('playing')
    setCrossed(new Set())
    setNoteMode(false)
  }, [])

  useEffect(() => {
    if (!keyboard) return
    const onKey = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      if (e.target.closest?.('input, textarea, [contenteditable="true"]')) return
      if (e.key === 'Enter') {
        if (e.target.closest?.('button')) return
        e.preventDefault()
        submit()
      } else if (e.key === 'Backspace') back()
      else if (/^[a-zA-Z]$/.test(e.key)) type(e.key)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [keyboard, submit, back, type])

  return {
    secret,
    history,
    current,
    error,
    status,
    attemptsLeft: maxAttempts - history.length,
    maxAttempts,
    wordLength: WORD_LENGTH,
    eliminated,
    crossed,
    noteMode,
    type,
    back,
    submit,
    tapKey,
    toggleCross,
    setNoteMode,
    playAgain,
  }
}
