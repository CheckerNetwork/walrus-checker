/**
 * Picks a random item from an array.
 *
 * @template {T}
 * @param {T[]} arr
 * @returns {T}
 */
export const pickRandomItem = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)]
}
