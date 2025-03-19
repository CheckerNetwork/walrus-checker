import { test } from 'zinnia:test'
import { assertEquals } from 'zinnia:assert'
import { getBlobs } from '../lib/blobs.js'

test('returns certified blobs', async () => {
  const requests = []
  const mockFetch = async (url, allOpts) => {
    requests.push(url)
    const page = new URL(url).searchParams.get('page')

    if (page === '0') {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          totalPages: 1,
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

    return {
      ok: true,
      status: 200,
      json: async () => ({
        totalPages: 1,
        content: [
          {
            blobIdBase64: 'blobId4',
            status: 'Pending'
          },
          {
            blobIdBase64: 'blobId5',
            status: 'Pending'
          },
          {
            blobIdBase64: 'blobId6',
            status: 'Certified'
          }
        ]
      })
    }
  }

  const result = await getBlobs(mockFetch)
  assertEquals(result, ['blobId', 'blobId3', 'blobId6'])
  assertEquals(requests, [
    'https://walruscan.com/api/walscan-backend/testnet/api/blobs?page=0&sortBy=TIMESTAMP&orderBy=DESC&searchStr=&size=20',
    'https://walruscan.com/api/walscan-backend/testnet/api/blobs?page=1&sortBy=TIMESTAMP&orderBy=DESC&searchStr=&size=20'
  ])
})
