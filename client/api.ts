export const get = (url: string): any => fetch(url).then((res) => res.json());

export const post = (url: string, body: any): any =>
  fetch(url, {
    body: JSON.stringify(body),
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
