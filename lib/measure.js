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
  const url = `${nodeAddress}/v1/blobs/${blobBase64Id}`
  try {
    console.log(`Retrieving blob from ${url}`)
    const response = await pTimeout(
      fetch(url),
      { milliseconds: RETRIEVE_TIMEOUT }
    )

    console.log(`Finished blob retrieval from ${url}: ${response.ok}`)
    return { retrievalSucceeded: response.ok }
  } catch (err) {
    console.error(`Failed to retrieve blob from ${url}: ${err}`)
    return { retrievalSucceeded: false }
  }
}
