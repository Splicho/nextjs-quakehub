import Header from "@/components/header";
import Hero from "@/components/hero";
import Serverlist from "@/components/serverlist";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
      <Header />
      <Hero />
      <main className="max-w-[1440px] p-10 mx-auto">
        <Serverlist />
      </main>
      <Footer />
    </>
  );
}

