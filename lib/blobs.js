import { assertOkResponse } from './http-assertions.js'

/**
 * @typedef {{
 * blobId: string,
 * blobIdBase64: string,
 * objectId: string,
 * status: string,
 * startEpoch: number,
 * endEpoch: number,
 * size: number,
 * timestamp: number
 * }} Blob
 */

/**
 * Returns a list of recent confirmed blobs.
 *
 * @param {typeof globalThis.fetch} fetch The fetch function to use.
 * @returns {Promise<string[]>} A list of recent blob Base64 IDs.
 */
export const getRecentBlobs = async (fetch = globalThis.fetch) => {
  const res = await fetch('https://walruscan.com/api/walscan-backend/testnet/api/blobs?page=0&sortBy=TIMESTAMP&orderBy=DESC&searchStr=&size=20')
  await assertOkResponse(res, 'Failed to retrieve recent blobs')
  const blobs = await res.json()

  return blobs.content.reduce((acc, /** @type {Blob} */ blob) => {
    if (blob.status === 'Certified') {
      acc.push(blob.blobIdBase64)
    }
    return acc
  }, [])
}
