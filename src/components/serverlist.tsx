"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Server {
  ip: string;
  port: number;
  name: string;
  map: string;
  players: number;
  max_players: number;
  status: string;
  countryCode: string;
}

export default function Serverlist() {
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const response = await fetch('/api/quake-live-servers');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setServers(data);
      } catch (error) {
        console.error('Error fetching servers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchServers();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <section>
      <div className="rounded-[0.5rem] border">
        <div className="flex flex-col gap-1 p-1">
          {servers.length === 0 ? (
            <p>No servers found</p>
          ) : (
            servers.map((server) => (
              <Link
                key={`${server.ip}:${server.port}`}
                href={`/server/${server.ip}:${server.port}`}
                className="flex justify-between items-center gap-4 p-1 hover:bg-bgSecondary hover:text-white rounded-md transition-colors server-link"
              >
                {/* Show flag based on countryCode */}
                <Image
                  src={`/flags/${server.countryCode}.png`} // Ensure you have flag images named according to country codes
                  alt={`${server.countryCode} Flag`}
                  className="w-6 flex-shrink-0"
                  width={45}
                  height={45}
                />
                <span className="flex-grow">{server.name}</span>
                <div className="flex-shrink-0 w-12 text-center">
                  <span>{`${server.players}/${server.max_players}`}</span>
                </div>
                <span className="flex-shrink-0 w-80 text-center">{server.map}</span>
                <div className="flex-shrink-0 w-32 text-center">
                  <span className="uppercase text-sm font-bold text-orange-400">{server.status}</span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
