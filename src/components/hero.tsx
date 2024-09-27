import dynamic from 'next/dynamic';

const DynamicHero = dynamic(() => import('./DynamicHero'), { ssr: false });

export default function Hero() {
  return <DynamicHero />;
}