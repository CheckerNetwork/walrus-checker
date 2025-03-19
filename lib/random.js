/**
 * Picks a random number between min and max (inclusive).
 *
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export const pickRandomNumber = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

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
