export const http = (url: string, options?: RequestInit) =>
  fetch(url, options).then((res) => res.json())