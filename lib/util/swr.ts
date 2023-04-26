export type FallbackProp = {
  [key: string]: any;
};

export const fetcher = async (url: string) =>
  fetch(url).then(res => res.json());
