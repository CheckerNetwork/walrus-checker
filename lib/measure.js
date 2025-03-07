import pTimeout from '../vendor/p-timeout.js'
import { RETRIEVE_TIMEOUT } from './constants.js'

/**
 * Performs a retrieval for given node and blob and returns measurement results.
 *
 * @param {string} node
 * @param {string} blobId
 * @returns { Promise<{ retrievalSucceeded: boolean }> }
 */
export const measure = async (node, blobId, fetch = globalThis.fetch) => {
  let retrievalSucceeded = true
  try {
    await pTimeout(
      fetch(`${node}/v1/blobs/${blobId}`),
      { milliseconds: RETRIEVE_TIMEOUT }
    )
  } catch (err) {
    console.error(err)
    retrievalSucceeded = false
  }

  return { retrievalSucceeded }
}
