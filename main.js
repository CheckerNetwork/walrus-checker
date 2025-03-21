/* global Zinnia */

import { DEFAULT_AGGREGATORS } from './lib/nodes.js'
import { getBlobs } from './lib/blobs.js'
import { measure } from './lib/measure.js'
import { MEASUREMENT_DELAY, SUI_NETWORK, WALRUS_STATE_OBJECT_ID } from './lib/constants.js'
import { pickRandomItem } from './lib/random.js'
import { getFullnodeUrl, SuiClient } from './vendor/deno-deps.js'

const suiRpcUrl = getFullnodeUrl(SUI_NETWORK)
const suiClient = new SuiClient({ url: suiRpcUrl })

/**
 * Fetches the active Walrus epoch
 *
 * @param {SuiClient} client SUI client
 * @returns {Promise<number>} Current Walrus epoch
 */
const getActiveWalrusEpoch = async (client) => {
  const object = await client.getObject({
    id: WALRUS_STATE_OBJECT_ID,
    options: { showContent: true }
  })

  return object.data.content.fields.value.fields.epoch
}

while (true) {
  try {
    const activeEpoch = await getActiveWalrusEpoch(suiClient)
    const blobs = await getBlobs(activeEpoch)
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
