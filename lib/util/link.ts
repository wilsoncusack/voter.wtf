export function getEtherscanLink(address: `0x${string}`, type = 'address') {
  return `https://etherscan.io/${type}/${address}`;
}

export function getNounsLink(id: number | string, type = 'vote') {
  return `https://nouns.wtf/${type}/${id}`;
}

export function replaceURLsWithLink(text: string) {
  const urlRegex =
    /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;

  return text.replace(
    urlRegex,
    '<a style="word-break: break-all; text-decoration:underline" href=$1 target="_blank" rel="noopener noreferrer">$1</a>'
  );
}
