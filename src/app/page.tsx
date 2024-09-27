import Header from "@/components/header";
import Hero from "@/components/hero";
import Serverlist from "@/components/serverlist";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <main className="max-w-[1440px] mx-auto">
        <Serverlist />
      </main>
    </>
  );
}

