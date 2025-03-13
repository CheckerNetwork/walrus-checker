import { test } from 'zinnia:test'
import { assertRejects, assertEquals } from 'zinnia:assert'
import { assertOkResponse } from '../lib/http-assertions.js'

test('assertOkResponse - default error message', async () => {
  const responseMock = { ok: false, status: 500, async text () { return 'ERROR MESSAGE' } }

  const err = await assertRejects(() => assertOkResponse(responseMock))
  assertEquals(err.message, 'Fetch failed (500): ERROR MESSAGE')
})

test('assertOkResponse - custom error message', async () => {
  const responseMock = { ok: false, status: 500, async text () { return 'ERROR MESSAGE' } }

  const err = await assertRejects(() => assertOkResponse(responseMock, 'Custom error message'))
  assertEquals(err.message, 'Custom error message (500): ERROR MESSAGE')
})
