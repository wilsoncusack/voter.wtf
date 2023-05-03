import { getAddress } from 'viem';

export function formatAddress(address: string) {
  const checksum = getAddress(address);
  return (
    '0x' +
    checksum.slice(0, 4) +
    '...' +
    checksum.slice(checksum.length - 5, checksum.length - 1)
  );
}
