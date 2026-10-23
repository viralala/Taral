import assert from 'node:assert/strict'
import { WORD_LENGTH, MAX_ATTEMPTS, pickSecret, scoreGuess, validateGuess, isWord, eliminatedLetters } from './logic.js'
import { SECRETS, GUESSES } from './words.js'

const eq = (a, b) => assert.deepEqual(a, b)
assert.equal(WORD_LENGTH, 4)
assert.equal(MAX_ATTEMPTS, 10)

// scoring
eq(scoreGuess('TALE', 'BATH'), { bulls: 1, cows: 1, miss: false })
eq(scoreGuess('TALE', 'TALE'), { bulls: 4, cows: 0, miss: false })
eq(scoreGuess('TALE', 'WHIP'), { bulls: 0, cows: 0, miss: true })
eq(scoreGuess('TALE', 'ETAL'), { bulls: 0, cows: 4, miss: false }) // no position matches
eq(scoreGuess('TALE', 'LATE'), { bulls: 2, cows: 2, miss: false }) // A and E in place; T, L swapped
eq(scoreGuess('tale', 'bAtH'), { bulls: 1, cows: 1, miss: false })

// eliminated letters: only from guesses with 0 bulls and 0 cows
const history = ['BATH', 'WHIP', 'CORN'].map((guess) => ({ guess, ...scoreGuess('TALE', guess) }))
eq([...eliminatedLetters(history)].sort(), ['C', 'H', 'I', 'N', 'O', 'P', 'R', 'W'])
eq([...eliminatedLetters([])], [])

// validation reasons
const reason = (g) => validateGuess(g).reason
assert.equal(validateGuess('BATH').ok, true)
assert.equal(validateGuess('bath').ok, true)
assert.equal(reason('BAT'), 'length')
assert.equal(reason('BATHS'), 'length')
assert.equal(reason('B4TH'), 'letters')
assert.equal(reason('BALL'), 'repeat')
assert.equal(reason('ZQXJ'), 'not-a-word')
for (const g of ['BAT', 'B4TH', 'BALL', 'ZQXJ']) {
  const out = validateGuess(g)
  assert.equal(out.ok, false)
  assert.ok(typeof out.message === 'string' && out.message.length > 0)
}
assert.ok(isWord('tale'))
assert.ok(!isWord('zzzz'))
for (const w of ['FISH', 'KING', 'WORD', 'MAZE', 'BLUE']) assert.ok(isWord(w), w)

// word data
assert.ok(SECRETS.length > 100)
for (const w of SECRETS) {
  assert.equal(validateGuess(w).ok, true, `secret ${w}`)
  assert.ok(GUESSES.has(w))
}
for (const w of GUESSES) assert.ok(w.length === 4 && /^[A-Z]+$/.test(w) && new Set(w).size === 4, w)
for (let i = 0; i < 200; i++) assert.ok(SECRETS.includes(pickSecret()))

console.log(`OK secrets ${SECRETS.length} guesses ${GUESSES.size}`)
