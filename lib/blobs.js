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
 * Returns a list of active certified blob Base64 IDs.
 *
 * @param {number} activeEpoch Active Walrus epoch.
 * @param {typeof globalThis.fetch} [fetch=globalThis.fetch] The fetch function to use.
 * @returns {Promise<string[]>} A list of recent blob Base64 IDs.
 */
export const getBlobs = async (activeEpoch, fetch = globalThis.fetch) => {
  const recentBlobsResponse = await fetchBlobs(0, fetch)
  const recentBlobs = getActiveCertifiedBlobIds(activeEpoch, recentBlobsResponse.content)
  const randomPage = pickRandomNumber(1, recentBlobsResponse.totalPages)
  const randomPageBlobResponse = await fetchBlobs(randomPage, fetch)
  const randomBlobs = getActiveCertifiedBlobIds(activeEpoch, randomPageBlobResponse.content)

  return [...recentBlobs, ...randomBlobs]
}

/**
 * Filters active certified blobs and returns their Base64 IDs.
 *
 * A blob is considered active if its start epoch is less than or equal to the active epoch
 * and its end epoch is greater than the active epoch.
 *
 * @param {number} activeEpoch
 * @param {Blob[]} blobs
 * @returns {string[]}
 */
const getActiveCertifiedBlobIds = (activeEpoch, blobs) =>
  blobs.filter(blob =>
    blob.startEpoch <= activeEpoch &&
    blob.endEpoch > activeEpoch &&
    blob.status === 'Certified'
  ).map(blob => blob.blobIdBase64)

/**
 * Fetches blobs from the WalrusScan API.
 *
 * @param {number} page
 * @param {typeof globalThis.fetch} [fetch=globalThis.fetch]
 * @returns {Promise<WalrusScanResponse>}
 */
const fetchBlobs = async (page, fetch = globalThis.fetch) => {
  const res = await fetch(`https://walruscan.com/api/walscan-backend/mainnet/api/blobs?page=${page}&sortBy=TIMESTAMP&orderBy=DESC&searchStr=&size=20`)
  await assertOkResponse(res, 'Failed to retrieve recent blobs')
  return await res.json()
}
