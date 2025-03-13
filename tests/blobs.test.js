import { test } from 'zinnia:test'
import { assertEquals } from 'zinnia:assert'
import { getRecentBlobs } from '../lib/blobs.js'

test('returns certified blobs', async () => {
  const requests = []
  const mockFetch = async (url, allOpts) => {
    requests.push(url)
    return {
      ok: true,
      status: 200,
      json: async () => ({
        content: [
          {
            blobIdBase64: 'blobId',
            status: 'Certified'
          },
          {
            blobIdBase64: 'blobId2',
            status: 'Pending'
          },
          {
            blobIdBase64: 'blobId3',
            status: 'Certified'
          }
        ]
      })
    }
  }

  const result = await getRecentBlobs(mockFetch)
  assertEquals(result, ['blobId', 'blobId3'])
  assertEquals(requests, [
    'https://walruscan.com/api/walscan-backend/testnet/api/blobs?page=0&sortBy=TIMESTAMP&orderBy=DESC&searchStr=&size=20'
  ])
})
