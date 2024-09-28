"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
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
import { debounce } from 'lodash';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Player {
  name: string;
  duration: number;
  score: number;
  'plain-name': string;
  // ... other player properties
}

interface Server {
  addr: string;
  name: string;
  mapname: string;
  humans: number;
  maxplayers: number;
  game: string;
  country: {
    code: string;
    name: string;
    continent: string;
  };
  players: Player[];
  spectators: number;
  visibility: "public" | "private" | string;
  continent: string;
  tags: string[];
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
    game: "all",
    tags: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const serversPerPage = 20;

  useEffect(() => {
    fetchServers();
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
      if (
        filters.continent !== "all" &&
        server.country.continent !== filters.continent
      ) {
        return false;
      }

      if (!filters.showFullServers && server.humans >= server.maxplayers) {
        return false;
      }

      if (!filters.showEmptyServers && server.humans === 0) {
        return false;
      }

      if (!filters.showPrivateServers && server.visibility === "private") {
        return false;
      }

      if (
        filters.game !== "all" &&
        server.game.toLowerCase() !== filters.game.toLowerCase()
      ) {
        return false;
      }

      if (
        filters.tags.length > 0 &&
        !filters.tags.every((tag) => server.tags.includes(tag))
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
    };

    return mapImageMap[mapName] || "/maps/placeholder.jpg";
  };

  const debouncedTagsChange = useCallback(
    debounce((tags: string[]) => {
      setFilters((prev) => ({ ...prev, tags }));
    }, 300),
    []
  );

  useEffect(() => {
    const tagArray = Array.isArray(filters.tags) ? filters.tags : filters.tags.split(',');
    debouncedTagsChange(tagArray);
  }, [filters.tags, debouncedTagsChange]);

  const paginatedServers = useMemo(() => {
    const startIndex = (currentPage - 1) * serversPerPage;
    return filteredServers.slice(startIndex, startIndex + serversPerPage);
  }, [filteredServers, currentPage]);

  const totalPages = Math.ceil(filteredServers.length / serversPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleConnect = (serverAddress: string) => {
    const steamConnectURL = `steam://connect/${serverAddress}`;
    window.location.href = steamConnectURL;
  };

  const renderPaginationItems = () => {
    let items = [];
    const rangeStart = Math.max(2, currentPage - 1);
    const rangeEnd = Math.min(totalPages - 1, currentPage + 1);

    items.push(
      <PaginationItem key={1}>
        <PaginationLink
          onClick={() => handlePageChange(1)}
          isActive={currentPage === 1}
          className="cursor-pointer"
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    if (rangeStart > 2) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={() => handlePageChange(i)}
            isActive={currentPage === i}
            className="cursor-pointer"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }

    if (rangeEnd < totalPages - 1) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    if (totalPages > 1) {
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
            className="cursor-pointer"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
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
        onTagsChange={(tags) => {
          setFilters((prev) => ({ ...prev, tags }));
        }}
      />
      <div className="rounded-[0.5rem] border overflow-hidden">
        <div className="flex flex-col">
          {paginatedServers.length === 0 ? (
            <p className="text-center text-muted-foreground p-4">No servers found</p>
          ) : (
            paginatedServers.map((server, index) => (
              <button
                key={server.addr}
                onClick={() => handleServerClick(server)}
                className={`flex justify-between items-center border-b gap-4 pl-3 hover:bg-accent hover:text-white transition-colors server-link
                ${
                  fadeIn ? "opacity-1 translate-y-0" : "opacity-0 translate-y-4"
                } 
                duration-500 delay-[${index * 100}ms]`}
              >
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

                <span className="flex-grow">{server.name}</span>

                <div className="flex-shrink-0 w-12 text-center">
                  <span>{`${server.humans}/${server.maxplayers}`}</span>
                </div>

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

      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              className={`cursor-pointer ${currentPage === 1 ? "pointer-events-none opacity-50" : ""}`}
            />
          </PaginationItem>
          {renderPaginationItems()}
          <PaginationItem>
            <PaginationNext 
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              className={`cursor-pointer ${currentPage === totalPages ? "pointer-events-none opacity-50" : ""}`}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {selectedServer && (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="overflow-y-auto flex flex-col">
            <SheetHeader>
              <SheetTitle className="text-2xl font-bold">
                {selectedServer.name}
              </SheetTitle>
              <SheetDescription className="text-sm text-muted-foreground">
                {selectedServer.addr} • {selectedServer.country.name}
              </SheetDescription>
            </SheetHeader>
            <div className="mt-6 space-y-4 flex-grow">
              <div className="grid grid-cols-2 gap-4">
                <ServerInfoItem label="Map" value={selectedServer.mapname} />
                <ServerInfoItem
                  label="Players"
                  value={`${selectedServer.humans}/${selectedServer.maxplayers}`}
                />
              </div>
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">Players and Spectators</h3>
                <div className="bg-secondary rounded-md overflow-hidden">
                  {selectedServer.players.map((player, index) => (
                    <div
                      key={index}
                      className={`flex justify-between items-center p-2 ${
                        index % 2 === 0 ? "bg-[#312f2d]" : "bg-[#3f3c39]"
                      }`}
                    >
                      <span>{formatPlayerName(player.name)}</span>
                      <span className="text-sm text-muted-foreground">
                        {player.score === 0 ? "Spectator" : `Score: ${player.score}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Total Spectators: {selectedServer.spectators}
                </p>
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
}

function ServerInfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[#312f2d] rounded-md p-3">
      <div className="text-sm font-medium text-muted-foreground">{label}</div>
      <div className="mt-1 text-lg">{value}</div>
    </div>
  );
}

export default ServerList;
