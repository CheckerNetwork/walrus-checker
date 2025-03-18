import { test } from 'zinnia:test'
import { assertEquals } from 'zinnia:assert'
import { measure } from '../lib/measure.js'

test('measure successful retrieval', async () => {
  const requests = []
  const mockFetch = async (url, allOpts) => {
    requests.push(url)
    return { ok: true, status: 200 }
  }

  const result = await measure('https://example.com', 'blobId', mockFetch)
  assertEquals(result, { retrievalSucceeded: true })
  assertEquals(requests, [
    'https://example.com/v1/blobs/blobId'
  ])
})

test('measure failed retrieval', async () => {
  const requests = []
  const mockFetch = async (url, allOpts) => {
    requests.push(url)
    return { ok: false, status: 500 }
  }

  const result = await measure('https://example.com', 'blobId', mockFetch)
  assertEquals(result, { retrievalSucceeded: false })
  assertEquals(requests, [
    'https://example.com/v1/blobs/blobId'
  ])
})

test('measure error on retrieval', async () => {
  const requests = []
  const mockFetch = async (url, allOpts) => {
    requests.push(url)
    throw new Error('FETCH ERROR')
  }

  const result = await measure('https://example.com', 'blobId', mockFetch)
  assertEquals(result, { retrievalSucceeded: false })
  assertEquals(requests, [
    'https://example.com/v1/blobs/blobId'
  ])
})
