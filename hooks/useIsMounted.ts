import * as React from 'react';

//https://github.com/wagmi-dev/wagmi/issues/542
export const useIsMounted = () => {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  return mounted;
};
