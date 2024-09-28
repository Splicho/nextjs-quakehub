"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input";
import { debounce } from 'lodash'; // Make sure to install lodash if you haven't already

interface FilterProps {
  onGameChange: (game: string) => void;
  onContinentChange: (continent: string) => void;
  onShowFullServersChange: (show: boolean) => void;
  onShowEmptyServersChange: (show: boolean) => void;
  onShowPrivateServersChange: (show: boolean) => void;
  onTagsChange: (tags: string[]) => void;
}

const games = ['All Gamemodes', 'Clan Arena', 'Duel', 'Capture The Flag', 'Team Deathmatch', 'Free For All'];
const continents = ['All Regions', 'NA', 'EU', 'AS', 'OC'];

export default function Filter({
  onGameChange,
  onContinentChange,
  onShowFullServersChange,
  onShowEmptyServersChange,
  onShowPrivateServersChange,
  onTagsChange
}: FilterProps) {
  const [tags, setTags] = useState("");

  // Debounce the onTagsChange callback
  const debouncedTagsChange = useCallback(
    debounce((tags: string[]) => onTagsChange(tags), 300),
    [onTagsChange]
  );

  useEffect(() => {
    const tagArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    debouncedTagsChange(tagArray);
  }, [tags, debouncedTagsChange]);

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTags(e.target.value);
  };

  return (
    <div className="mb-5 flex flex-wrap gap-5 items-center">
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
      <Input
        type="text"
        placeholder="Enter tags"
        value={tags}
        onChange={handleTagsChange}
        className="w-[250px]"
      />
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
