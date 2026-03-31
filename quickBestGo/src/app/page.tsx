import type { Metadata } from 'next';
import RedirectToLang from './RedirectToLang';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function RootPage() {
  return <RedirectToLang />;
}
