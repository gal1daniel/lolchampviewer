import ChampionSearch from '@/components/ChampionSearch';
import { Spotlight } from '@/components/ui/Spotlight';
import Image from 'next/image';

export default function Home() {
  return (
    <main className="relative min-h-screen bg-neutral-950 overflow-hidden">
      <div className='opacity-50'>
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20 opacity-0"
        fill="orange"
      />
      </div>
      <div className="absolute inset-0 bg-dot-orange-400/[0.3]"></div>
      <div className="absolute inset-0 bg-gradient-radial to-transparent via-neutral-950/80 from-neutral-950"></div>
      <div className="relative z-20 mx-auto px-4 py-8">
        <div className='flex justify-center flex-col items-center'>
        <Image src={'/Logo.svg'} alt="logo" width={200} height={200} />
        <h1 className="text-4xl font-bold text-center my-8 text-white">League of Legends: <span className='text-main'>Champion Viewer</span></h1>
        </div>
        <ChampionSearch />
      </div>
    </main>
  );
}