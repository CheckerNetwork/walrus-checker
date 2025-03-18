/* global Zinnia */

import { DEFAULT_AGGREGATORS } from './lib/nodes.js'
import { getRecentBlobs } from './lib/blobs.js'
import { measure } from './lib/measure.js'
import { MEASUREMENT_DELAY } from './lib/constants.js'

/**
 * Picks a random item from an array.
 *
 * @template {T}
 * @param {T[]} arr
 * @returns {T}
 */
const pickRandomItem = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)]
}

while (true) {
  try {
    const blobs = await getRecentBlobs()
    console.log(`Found ${blobs.length} blobs`)
    const measurement = await measure(
      pickRandomItem(DEFAULT_AGGREGATORS),
      pickRandomItem(blobs)
    )
    console.log('measurement:', measurement)
    // TODO: Submit measurement to API
    Zinnia.jobCompleted()
  } catch (err) {
    console.error('Error:', err)
  }

  console.log(`Waiting ${MEASUREMENT_DELAY / 1_000} seconds...`)
  await new Promise(resolve => setTimeout(resolve, MEASUREMENT_DELAY))
}
