"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox"

interface FilterProps {
  onGameChange: (game: string) => void;
  onContinentChange: (continent: string) => void;
  onShowFullServersChange: (show: boolean) => void;
  onShowEmptyServersChange: (show: boolean) => void;
  onShowPrivateServersChange: (show: boolean) => void;
}

const games = ['All Gamemodes', 'Clan Arena', 'Duel', 'Capture The Flag', 'Team Deathmatch', 'Free For All']; // Updated game modes
const continents = ['All Regions', 'NA', 'EU', 'AS', 'OC']; // Example continents, adjust as needed

export default function Filter({
  onGameChange,
  onContinentChange,
  onShowFullServersChange,
  onShowEmptyServersChange,
  onShowPrivateServersChange
}: FilterProps) {
  return (
    <div className="mb-5 flex gap-5">
      <Select onValueChange={onGameChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Gamemode" />
        </SelectTrigger>
        <SelectContent>
          {games.map((game) => (
            <SelectItem key={game} value={game === 'All Gamemodes' ? 'all' : game}>{game}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select onValueChange={onContinentChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Region" />
        </SelectTrigger>
        <SelectContent>
          {continents.map((continent) => (
            <SelectItem key={continent} value={continent === 'All Regions' ? 'all' : continent}>{continent}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="flex items-center space-x-2 ml-auto">
        <Checkbox id="full-servers" onCheckedChange={onShowFullServersChange} />
        <label htmlFor="full-servers" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Show full servers
        </label>
        <Checkbox id="empty-servers" onCheckedChange={onShowEmptyServersChange} />
        <label htmlFor="empty-servers" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Show empty servers
        </label>
        <Checkbox id="private-servers" onCheckedChange={onShowPrivateServersChange} />
        <label htmlFor="private-servers" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Show private servers
        </label>
      </div>
    </div>
  );
}
