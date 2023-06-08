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

export function formatDuration(futureBlock: bigint, currentBlock: bigint) {
  const duration = parseInt((futureBlock - currentBlock).toString()) * 12;

  let remaining = Math.abs(duration);

  const days = Math.floor(remaining / (60 * 60 * 24));
  remaining %= 60 * 60 * 24;

  const hours = Math.floor(remaining / (60 * 60));
  remaining %= 60 * 60;

  const minutes = Math.floor(remaining / 60);
  remaining %= 60;

  const seconds = remaining;

  const result = '';

  if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} `;
  }
  if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} `;
  }
  if (minutes > 0) {
    return `${minutes} min${minutes > 1 ? 's' : ''} `;
  }
  if (seconds > 0) {
    return `${seconds} sec${seconds > 1 ? 's' : ''}`;
  }

  return result.trim();
}
