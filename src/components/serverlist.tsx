"use client";

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import Filter from "@/components/ui/filter";
import { Button } from "./ui/button";

interface Player {
  name: string;
  duration: number;
  score: number;
  "plain-name": string;
}

interface Server {
  addr: string;
  name: string;
  mapname: string;
  humans: number;
  maxplayers: number;
  game: string; // Changed from gamestate to game
  country: {
    code: string;
    name: string;
    continent: string;
  };
  players: Player[];
  visibility: "public" | "private" | string;
  continent: string; // Added continent property
}

const colorMap: Record<string, string> = {
  "^0": "black",
  "^1": "red",
  "^2": "green",
  "^3": "yellow",
  "^4": "blue",
  "^5": "cyan",
  "^6": "pink",
  "^7": "white",
};

function formatPlayerName(name: string): JSX.Element {
  const parts = name.split(/(\^[0-7])/);
  return (
    <>
      {parts.map((part, index) =>
        colorMap[part] ? null : (
          <span
            key={index}
            style={{ color: colorMap[parts[index - 1]] || "inherit" }}
          >
            {part}
          </span>
        )
      )}
    </>
  );
}

function ServerList() {
  const [servers, setServers] = useState<Server[]>([]);
  const [filteredServers, setFilteredServers] = useState<Server[]>([]);
  const [filters, setFilters] = useState({
    continent: "all",
    showFullServers: true,
    showEmptyServers: true,
    showPrivateServers: true,
    game: "all", // Changed from gameMode to game
    // Remove or rename any other occurrence of 'game' or 'gameMode'
    // ... other filter states
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    fetchServers();
    // Add this to trigger the fade-in effect after component mount
    setTimeout(() => setFadeIn(true), 100);
  }, []);

  useEffect(() => {
    if (servers.length > 0) {
      applyFilters();
    }
  }, [servers, filters]);

  const fetchServers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/quakelist");
      const data = await response.json();
      const serversArray = Object.values(data) as Server[];
      setServers(serversArray);
    } catch (error) {
      console.error("Error fetching servers:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    const filtered = servers.filter((server) => {
      // Filter by continent
      if (
        filters.continent !== "all" &&
        server.country.continent !== filters.continent
      ) {
        return false;
      }

      // Filter full servers
      if (!filters.showFullServers && server.humans >= server.maxplayers) {
        return false;
      }

      // Filter empty servers
      if (!filters.showEmptyServers && server.humans === 0) {
        return false;
      }

      // Filter private servers
      if (!filters.showPrivateServers && server.visibility === "private") {
        return false;
      }

      // Filter by game mode
      if (
        filters.game !== "all" &&
        server.game.toLowerCase() !== filters.game.toLowerCase()
      ) {
        return false;
      }

      return true;
    });
    setFilteredServers(filtered);
  };

  const handleServerClick = (server: Server) => {
    setSelectedServer(server);
    setIsSheetOpen(true);
  };

  const getMapImage = (mapName: string) => {
    const mapImageMap: { [key: string]: string } = {
      bloodrun: "/maps/bloodrun.jpg",
      campgrounds: "/maps/campgrounds.jpg",
      furiousheights: "/maps/furiousheights.jpg",
      houseofdecay: "/maps/houseofdecay.jpg",
      toxicity: "/maps/toxicity.jpg",
      almostlost: "/maps/almostlost.webp",
      lostworld: "/maps/lostworld.webp",
      aerowalk: "/maps/aerowalk.webp",
      tornado: "/maps/tornado.jpg",
      overkill: "/maps/overkill.jpg",
      // Add more map-to-image mappings as needed
    };

    return mapImageMap[mapName] || "/maps/placeholder.jpg";
  };

  if (isLoading) {
    return (
      <section>
        <div className="rounded-[0.5rem] border">
          <div className="flex flex-col gap-1 p-1">
            {Array.from({ length: 50 }).map((_, index) => (
              <div
                key={index}
                className="flex justify-between items-center gap-4 p-1 rounded-md"
              >
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
      <Filter
        onGameChange={(game) => setFilters((prev) => ({ ...prev, game }))}
        onContinentChange={(continent) => {
          console.log("Continent changed to:", continent);
          setFilters((prev) => ({ ...prev, continent }));
        }}
        onShowFullServersChange={(show) =>
          setFilters((prev) => ({ ...prev, showFullServers: show }))
        }
        onShowEmptyServersChange={(show) =>
          setFilters((prev) => ({ ...prev, showEmptyServers: show }))
        }
        onShowPrivateServersChange={(show) =>
          setFilters((prev) => ({ ...prev, showPrivateServers: show }))
        }
      />
      <div className="rounded-[0.5rem] border overflow-hidden">
        <div className="flex flex-col">
          {filteredServers.length === 0 ? (
            <p>No servers found</p>
          ) : (
            filteredServers.map((server, index) => (
              <button
                key={server.addr}
                onClick={() => handleServerClick(server)}
                className={`flex justify-between items-center border-b gap-4 pl-3 hover:bg-accent hover:text-white transition-colors server-link
                ${
                  fadeIn ? "opacity-1 translate-y-0" : "opacity-0 translate-y-4"
                } 
                duration-500 delay-[${index * 100}ms]`}
              >
                {/* Country Flag */}
                <Image
                  src={
                    server.country.code
                      ? `/flags/${server.country.code.toLowerCase()}.png`
                      : "/flags/placeholder.png"
                  }
                  alt={`${server.country.name || "Unknown"} Flag`}
                  className="w-6 flex-shrink-0"
                  width={24}
                  height={24}
                />

                {/* Server Name */}
                <span className="flex-grow">{server.name}</span>

                {/* Player Count */}
                <div className="flex-shrink-0 w-12 text-center">
                  <span>{`${server.humans}/${server.maxplayers}`}</span>
                </div>

                {/* Map Name and Image */}
                <span className="flex-shrink-0 w-80 text-center relative p-2">
                  {server.mapname}
                  <div className="absolute inset-0 flex items-center justify-center z-0">
                    <Image
                      src={getMapImage(server.mapname)}
                      alt={server.mapname || "Placeholder Map"}
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
          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="text-2xl font-bold">
                {selectedServer.name}
              </SheetTitle>
              <SheetDescription className="text-sm text-muted-foreground">
                {selectedServer.addr} • {selectedServer.country.name}
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <ServerInfoItem label="Map" value={selectedServer.mapname} />
                <ServerInfoItem
                  label="Players"
                  value={`${selectedServer.humans}/${selectedServer.maxplayers}`}
                />
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Players</h3>
                <div className="bg-[#33312e] rounded-md overflow-hidden">
                  {selectedServer.players.map((player, index) => (
                    <div
                      key={index}
                      className={`flex justify-between items-center p-2 ${
                        index % 2 === 0 ? "bg-[#33312e]" : "bg-[#2b2927]"
                      }`}
                    >
                      <span>{formatPlayerName(player.name)}</span>
                      <span className="text-sm text-muted-foreground">
                        Score: {player.score}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Button
                variant="connect"
                className="w-full"
                onClick={() => handleConnect(selectedServer.addr)}
              >
                Connect to Server
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </section>
  );
  function handleConnect(serverAddress: string) {
    const steamConnectURL = `steam://connect/${serverAddress}`;
    window.location.href = steamConnectURL;
  }
}

function ServerInfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#33312e] rounded-md p-3">
      <div className="text-sm font-medium text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg">{value}</div>
    </div>
  );
}

export default ServerList;
