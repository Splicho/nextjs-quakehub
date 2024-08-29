"use client";

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Skeleton } from './ui/skeleton';
import { Sheet, SheetContent } from '@/components/ui/sheet';

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

  const getMapImage = (mapName: string) => {
    const mapImageMap: { [key: string]: string } = {
      'bloodrun': '/maps/bloodrun.jpg',
      'campgrounds': '/maps/campgrounds.jpg',
      'furiousheights': '/maps/furiousheights.jpg',
      'houseofdecay': '/maps/houseofdecay.jpg',
      'toxicity': '/maps/toxicity.jpg',
      'almostlost': '/maps/almostlost.webp',
      'lostworld': '/maps/lostworld.webp',
      'aerowalk': '/maps/aerowalk.webp',
      'tornado': '/maps/tornado.jpg',
      'overkill': '/maps/overkill.jpg',
      // Add more map-to-image mappings as needed
    };
    
    return mapImageMap[mapName] || '/maps/placeholder.jpg';
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
      <div className="rounded-[0.5rem] border overflow-hidden">
        <div className="flex flex-col">
          {servers.length === 0 ? (
            <p>No servers found</p>
          ) : (
            servers.map((server, index) => (
              <button
                key={`${server.ip || 'no-ip'}:${server.port || 'no-port'}-${index}`}
                onClick={() => handleServerClick(server)}
                className={`flex justify-between items-center border-b gap-4 pl-3 hover:bg-accent hover:text-white transition-colors server-link
                ${fadeIn ? 'opacity-1 translate-y-0' : 'opacity-0 translate-y-4'} 
                duration-500 delay-[${index * 100}ms]`}
              >
                {/* Country Flag */}
                <Image
                  src={server.countryCode ? `/flags/${server.countryCode}.png` : '/flags/placeholder.png'}
                  alt={`${server.countryCode || 'Unknown'} Flag`}
                  className="w-6 flex-shrink-0"
                  width={24}
                  height={24}
                />
    
                {/* Server Name */}
                <span className="flex-grow">{server.name}</span>
    
                {/* Player Count */}
                <div className="flex-shrink-0 w-12 text-center">
                  <span>{`${server.players}/${server.max_players}`}</span>
                </div>
    
                {/* Map Name and Image */}
                <span className="flex-shrink-0 w-80 text-center relative p-2">
                  {server.map}
                  <div className="absolute inset-0 flex items-center justify-center z-0">
                    <Image
                      src={getMapImage(server.map)}
                      alt={server.map || 'Placeholder Map'}
                      layout="fill"
                      objectFit="cover"
                      className="opacity-50 transition-opacity ease-in duration-500 levelsnapshot"
                    />
                  </div>
                </span>
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
          </SheetContent>
        </Sheet>
      )}
    </section>
  );
}
