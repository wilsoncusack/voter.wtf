import { getAddress } from 'viem';

export function formatAddress(address: string, chars = 8) {
  const checksum = getAddress(address);
  const prefixLength = chars / 2;
  const suffixLength = chars - prefixLength;
  const prefix = '0x' + checksum.slice(0, prefixLength);
  const suffix = '...' + checksum.slice(-suffixLength);
  return prefix + suffix;
}

export function ensureTitleCase(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}
