import { slice, fromHex } from 'viem';
import { PublicClient } from 'wagmi';

export async function resolveNnsName(address: string, client: PublicClient) {
  try {
    const calldata = '55ea6c47000000000000000000000000' + address.substring(2);
    const res = await client.call({
      data: `0x${calldata}`,
      to: '0x849f92178950f6254db5d16d1ba265e70521ac1b',
    });
    if (res.data) {
      const offset = Number(BigInt(slice(res.data, 0, 32)));
      const length = Number(BigInt(slice(res.data, offset, offset + 32)));
      return (
        fromHex(slice(res.data, offset + 32, offset + 32 + length), 'string') ||
        null
      );
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}
