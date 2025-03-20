import { test } from 'zinnia:test'
import { assertThrows, assertEquals } from 'zinnia:assert'
import { pickRandomNumber } from '../lib/random.js'

test('pickRandomNumber - min greater than max', () => {
  assertThrows(() => pickRandomNumber(2, 1), 'min must be less than or equal to max')
})

test('pickRandomNumber - min equal to max', () => {
  assertEquals(pickRandomNumber(1, 1), 1)
})
