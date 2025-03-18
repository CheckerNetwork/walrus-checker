import { assertOkResponse } from './http-assertions.js'
/**
 *
 * @param {{retrievalSucceeded: boolean}} measurement
 * @param {typeof globalThis.fetch} fetch
 */
export const submit = async (measurement, fetch = globalThis.fetch) => {
  const res = await fetch('https://api.checker.network/walrus/measurement', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(measurement)
  })

  await assertOkResponse(res, 'Failed to submit measurement')
}
