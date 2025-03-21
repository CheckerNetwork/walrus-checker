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
              status: 'Certified',
              startEpoch: 10,
              endEpoch: 20
            },
            {
              blobIdBase64: 'blobId2',
              status: 'Pending',
              startEpoch: 10,
              endEpoch: 20
            },
            {
              blobIdBase64: 'blobId3',
              status: 'Certified',
              startEpoch: 15,
              endEpoch: 20
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
            status: 'Pending',
            startEpoch: 10,
            endEpoch: 20
          },
          {
            blobIdBase64: 'blobId5',
            status: 'Pending',
            startEpoch: 10,
            endEpoch: 20
          },
          {
            blobIdBase64: 'blobId6',
            status: 'Certified',
            startEpoch: 10,
            endEpoch: 20
          },
          {
            blobIdBase64: 'blobId7',
            status: 'Certified',
            startEpoch: 9,
            endEpoch: 12
          }
        ]
      })
    }
  }

  const activeEpoch = 13
  const result = await getBlobs(activeEpoch, mockFetch)
  assertEquals(result, ['blobId', 'blobId6'])
  assertEquals(requests, [
    'https://walruscan.com/api/walscan-backend/testnet/api/blobs?page=0&sortBy=TIMESTAMP&orderBy=DESC&searchStr=&size=20',
    'https://walruscan.com/api/walscan-backend/testnet/api/blobs?page=1&sortBy=TIMESTAMP&orderBy=DESC&searchStr=&size=20'
  ])
})
