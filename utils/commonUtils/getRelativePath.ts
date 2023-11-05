export const getRelativePath = (fullUrl: string | URL, baseUrl: string | undefined) => {
  const url = new URL(fullUrl)
  if (!baseUrl) return ""
  const base = new URL(baseUrl)
  let relativePath = url.pathname

  // baseURL의 pathname을 제거합니다.
  if (relativePath.startsWith(base.pathname)) {
    relativePath = relativePath.substring(base.pathname.length)
  }

  // 슬래시(/)로 시작한다면 제거합니다.
  if (relativePath.startsWith('/')) {
    relativePath = relativePath.substring(1)
  }

  return relativePath
}
