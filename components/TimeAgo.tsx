import React, { useMemo } from 'react';

type TimeAgoProps = {
  timestamp: number;
  className?: string;
  as?: React.ElementType;
};

const timeAgo = (timestamp: number): string => {
  const now = new Date();
  const timeDifference = Math.floor((now.getTime() - timestamp) / 1000);

  const units: { [key: string]: number } = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, seconds] of Object.entries(units)) {
    const count = Math.floor(timeDifference / seconds);
    if (count >= 1) {
      return `${count} ${unit}${count > 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
};

export function TimeAgo({ className, timestamp, as = 'div' }: TimeAgoProps) {
  const Component = as;

  const time = useMemo(
    () => (timestamp ? timeAgo(timestamp) : '...'),
    [timestamp]
  );

  return <Component className={className}>{time}</Component>;
}
