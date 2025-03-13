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
  if (!res.ok) {
    throw new Error(`Failed to submit measurement (status=${res.status})`, {
      cause: new Error(await res.text().catch(() => null))
    })
  }
}
