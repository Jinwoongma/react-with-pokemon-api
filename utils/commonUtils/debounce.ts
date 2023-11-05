export function debounce<F extends (...args: any[]) => any>(func: F, wait: number) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const debouncedFunc = (...args: Parameters<F>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => func(...args), wait)
  }

  // cancel 함수 추가
  debouncedFunc.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  return debouncedFunc as F & { cancel: () => void }
}
