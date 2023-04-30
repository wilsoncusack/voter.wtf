import { NextApiRequest, NextApiResponse } from 'next';
import { recoverAddress, hashMessage } from 'viem';
import { supabase } from '../../lib/supabaseClient';
import NounsABI from '../../abis/NounsABI.json';
import { viem } from '../../lib/wagmi';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { prop_id, voter, signed_message, user } = req.body;

      if (!prop_id || !voter || !signed_message || !user) {
        res.status(400).json({ error: 'Missing required parameters' });
        return;
      }

      const message = `like vote by ${voter} on ${prop_id}`;
      const message_hash = hashMessage(message);

      const recovered_address = await recoverAddress({
        hash: message_hash,
        signature: signed_message,
      });

      const votes = await viem.readContract({
        address: '0x9c8ff314c9bc7f6e59a9d9225fb22946427edc03',
        abi: NounsABI,
        functionName: 'getCurrentVotes',
        args: [user],
      });

      if (recovered_address.toLowerCase() === user.toLowerCase()) {
        const { error } = await supabase.from('vote_likes').insert({
          id: `${prop_id}-${voter}-${user}`,
          vote_id: `${prop_id}-${voter}`,
          is_nouns_voter: (votes as bigint) > BigInt(0),
          user: user,
        });

        if (error) {
          res.status(401).json({ error: error });
        } else {
          res.status(200).json({ success: true });
        }
      } else {
        res.status(401).json({ error: 'Invalid signature' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

export default handler;
