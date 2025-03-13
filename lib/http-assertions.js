/**
 * @param {Response} res
 * @param {string} [errorMsg]
 */
export async function assertOkResponse (res, errorMsg) {
  if (res.ok) return

  let body
  try {
    body = await res.text()
  } catch {}
  const err = new Error(`${errorMsg ?? 'Fetch failed'} (${res.status}): ${body?.trimEnd()}`)
  err.statusCode = res.status
  err.serverMessage = body
  throw err
}
