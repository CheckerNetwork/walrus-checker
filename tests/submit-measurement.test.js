import { test } from 'zinnia:test'
import { assertEquals, assertRejects } from 'zinnia:assert'
import { submit } from '../lib/submit-measurement.js'

test('submit measurement succeeds', async () => {
  const requests = []
  const mockFetch = async (url, allOpts) => {
    const { signal, ...opts } = allOpts
    requests.push({ url, opts })

    return {
      status: 200,
      ok: true

    }
  }

  const measurement = { retrievalSucceeded: true }
  await submit(measurement, mockFetch)
  assertEquals(requests.length, 1)
  assertEquals(requests, [
    {
      url: 'https://api.checker.network/walrus/measurement',
      opts: {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(measurement)
      }
    }
  ])
})

test('submit measurements fails', async () => {
  const requests = []
  const fetch = async (url, allOpts) => {
    const { signal, ...opts } = allOpts
    requests.push({ url, opts })

    return {
      status: 500,
      ok: false,
      text: async () => 'Internal Server Error'
    }
  }

  const measurement = { retrievalSucceeded: true }
  const err = await assertRejects(async () => await submit(measurement, fetch))
  assertEquals(err.message, 'Failed to submit measurement (500): Internal Server Error')
  assertEquals(requests.length, 1)
  assertEquals(requests, [
    {
      url: 'https://api.checker.network/walrus/measurement',
      opts: {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(measurement)
      }
    }
  ])
})
