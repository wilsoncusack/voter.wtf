import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import HeadSVG from '../public/noun652head.svg';

type PromoCardProps = {
  description: string;
  imageUrl: string;
  url: string;
  buttonText: string;
};

const PromoCard: React.FC<PromoCardProps> = ({
  description,
  imageUrl,
  url,
  buttonText,
}) => {
  return (
    <Link className="font-semibold" href={url}>
      <div className="bg-gray-700 rounded-lg p-4 m-6">
        <div className="flex justify-center mb-4">
          <Image src={HeadSVG} alt={description} width={75} height={75} />
        </div>

        {buttonText}
      </div>
    </Link>
  );
};

export default PromoCard;
