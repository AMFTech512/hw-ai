/**
 * Returns a promise that takes a minumum amount of time to resolve.
 */
export async function withMinimumDelay<T>(
  promise: Promise<T>,
  delayMillis: number
) {
  const [result] = await Promise.all([
    promise,
    new Promise((resolve) => setTimeout(resolve, delayMillis)),
  ]);
  return result;
}
