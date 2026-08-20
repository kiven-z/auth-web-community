/**
 * 延迟指定毫秒后 resolve
 * @param milliseconds 延迟毫秒数，默认 20
 * @returns Promise
 */
export function delay(milliseconds = 20): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}
