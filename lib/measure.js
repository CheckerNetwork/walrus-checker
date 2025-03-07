import pTimeout from '../vendor/p-timeout.js'
import { RETRIEVE_TIMEOUT } from './constants.js'

/**
 * Performs a retrieval for given node and blob and returns measurement results.
 *
 * @param {string} nodeAddress
 * @param {string} blobBase64Id
 * @param {typeof globalThis.fetch} fetch
 * @returns {Promise<{ retrievalSucceeded: boolean }> }
 */
export const measure = async (nodeAddress, blobBase64Id, fetch = globalThis.fetch) => {
  let retrievalSucceeded = true
  try {
    const response = await pTimeout(
      fetch(`${nodeAddress}/v1/blobs/${blobBase64Id}`),
      { milliseconds: RETRIEVE_TIMEOUT }
    )

    if (!response.ok) {
      retrievalSucceeded = false
    }
  } catch (err) {
    console.error(err)
    retrievalSucceeded = false
  }

  return { retrievalSucceeded }
}
