import Head from 'next/head';
import { FallbackProp } from '../lib/util/swr';
import { SWRConfig } from 'swr';

type PageProps = {
  title: string;
  children?: JSX.Element;
  fallback?: FallbackProp;
};

export function Page({ children, title: pageTitle, fallback = {} }: PageProps) {
  const title = pageTitle + ' - Nounsvote.wtf';
  return (
    <SWRConfig value={{ fallback }}>
      <div>
        <Head>
          <title>{title}</title>
        </Head>
        {children}
      </div>
    </SWRConfig>
  );
}
