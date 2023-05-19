import { getAddress } from 'viem';

export function formatAddress(address: string) {
  const checksum = getAddress(address);
  const prefixLength = 5;
  const suffixLength = 3;
  const prefix = checksum.slice(0, prefixLength);
  const suffix = '...' + checksum.slice(-suffixLength);
  return prefix + suffix;
}

export function ensureTitleCase(name: string) {
  return name.charAt(0).toUpperCase() + name.slice(1);
}
