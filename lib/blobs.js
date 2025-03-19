import { assertOkResponse } from './http-assertions.js'
import { pickRandomNumber } from './random.js'

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
 * @typedef {{
 * content: Blob[],
 * totalPages: number
 * }} WalrusScanResponse
 */

/**
 * Returns a list of certified blob Base64 IDs.
 *
 * @param {typeof globalThis.fetch} [fetch=globalThis.fetch] The fetch function to use.
 * @returns {Promise<string[]>} A list of recent blob Base64 IDs.
 */
export const getBlobs = async (fetch = globalThis.fetch) => {
  // TODO: Filter out blobs by start and end epoch
  const recentBlobsResponse = await fetchBlobs(0, fetch)
  const recentBlobs = getCertifiedBlobIds(recentBlobsResponse.content)
  const randomPage = pickRandomNumber(1, recentBlobsResponse.totalPages)
  const randomPageBlobResponse = await fetchBlobs(randomPage, fetch)
  const randomBlobs = getCertifiedBlobIds(randomPageBlobResponse.content)

  return [...recentBlobs, ...randomBlobs]
}

/**
 * Filters certified blobs returns their Base64 IDs.
 *
 * @param {Blob[]} blobs
 * @returns {string[]}
 */
const getCertifiedBlobIds = (blobs) => blobs.filter(blob => blob.status === 'Certified').map(blob => blob.blobIdBase64)

/**
 * Fetches blobs from the WalrusScan API.
 *
 * @param {number} page
 * @param {typeof globalThis.fetch} [fetch=globalThis.fetch]
 * @returns {Promise<WalrusScanResponse>}
 */
const fetchBlobs = async (page, fetch = globalThis.fetch) => {
  const res = await fetch(`https://walruscan.com/api/walscan-backend/testnet/api/blobs?page=${page}&sortBy=TIMESTAMP&orderBy=DESC&searchStr=&size=20`)
  await assertOkResponse(res, 'Failed to retrieve recent blobs')
  return await res.json()
}
