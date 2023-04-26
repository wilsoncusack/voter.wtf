export function getEtherscanLink(address: `0x${string}`, type = 'address') {
  return `https://etherscan.io${type}/${address}`;
}
