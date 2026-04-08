export const http = (url: string, options?: RequestInit) =>
  fetch(url, options).then((res) => {
    if (!res.ok) throw new Error(`Error ${res.status}`);
    return res.json();
  });
