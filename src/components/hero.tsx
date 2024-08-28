import Link from "next/link";
import React from "react";

export default function hero() {
  return (
    <section className="relative flex justify-center text-center p-48">
      <div className="absolute inset-0 z-0 w-full h-full overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover opacity-35"
          autoPlay
          muted
          loop
        >
          <source src="/video/hero-intro.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"></div>
      </div>
      <div className="relative z-10 flex flex-col items-center gap-5">
        <Link
          href="/"
          className="flex items-center gap-1 bg-green-600/30 border border-green-600 rounded-full pl-3 pr-3 pt-0.5 pb-0.5 text-[12px] text-green-300"
        >
          🎉 QuakeHub v1.0 is out
        </Link>
        <h1 className="text-5xl font-bold tracking-tighter text-white">
          Real-Time{" "}
          <span className="bg-gradient-to-r from-red-500 to-red-800 bg-clip-text text-transparent">
            Quake Live
          </span>{" "}
          Server Tracking
        </h1>
        <p className="text-zinc-500">
          Track, monitor, and join QuakeLive servers with live data from Steam.
        </p>
      </div>
    </section>
  );
}
