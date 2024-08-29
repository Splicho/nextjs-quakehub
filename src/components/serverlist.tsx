"use client"

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Skeleton } from './ui/skeleton';
import { Sheet, SheetTrigger, SheetContent } from '@/components/ui/sheet';

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
  const [fadeIn, setFadeIn] = useState(false);
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

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
        setFadeIn(true);
      }
    };

    fetchServers();
  }, []);

  const handleServerClick = (server: Server) => {
    setSelectedServer(server);
    setIsSheetOpen(true);
  };

  if (loading) {
    return (
      <section>
        <div className="rounded-[0.5rem] border">
          <div className="flex flex-col gap-1 p-1">
            {Array.from({ length: 50 }).map((_, index) => (
              <div key={index} className="flex justify-between items-center gap-4 p-1 rounded-md">
                <Skeleton className="w-6 h-6 flex-shrink-0" />
                <Skeleton className="flex-grow h-6" />
                <Skeleton className="flex-shrink-0 w-12 h-6 text-center" />
                <Skeleton className="flex-shrink-0 w-80 h-6 text-center" />
                <Skeleton className="flex-shrink-0 w-80 h-6 text-center" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="rounded-[0.5rem] border">
        <div className="flex flex-col gap-1 p-1">
          {servers.length === 0 ? (
            <p>No servers found</p>
          ) : (
            servers.map((server, index) => (
              <button
                key={`${server.ip || 'no-ip'}:${server.port || 'no-port'}-${index}`}
                onClick={() => handleServerClick(server)}
                className={`flex justify-between items-center gap-4 p-1 hover:bg-bgSecondary hover:text-white rounded-md transition-colors server-link
                ${fadeIn ? 'opacity-1 translate-y-0' : 'opacity-0 translate-y-4'} 
                transition-opacity transition-transform duration-500 delay-[${index * 100}ms]
                `}
              >
                <Image
                  src={`/flags/${server.countryCode}.png`}
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
              </button>
            ))
          )}
        </div>
      </div>

      {selectedServer && (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent>
            <h2 className="text-xl font-bold mb-4">Server Details</h2>
            <p>Name: {selectedServer.name}</p>
            <p>IP: {selectedServer.ip}</p>
            <p>Port: {selectedServer.port}</p>
            <p>Map: {selectedServer.map}</p>
            <p>Players: {selectedServer.players}/{selectedServer.max_players}</p>
            <p>Status: {selectedServer.status}</p>
            {/* Add more dummy data as needed */}
          </SheetContent>
        </Sheet>
      )}
    </section>
  );
}
