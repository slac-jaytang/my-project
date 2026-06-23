export function cn(...classes: (string | Record<string, boolean> | undefined | null | false)[]): string {
  const result: string[] = []
  for (const cls of classes) {
    if (!cls) continue
    if (typeof cls === 'string') {
      result.push(cls)
    } else {
      for (const [key, val] of Object.entries(cls)) {
        if (val) result.push(key)
      }
    }
  }
  return result.join(' ')
}
