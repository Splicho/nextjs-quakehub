"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox"

import React from "react";

export default function filter() {
  return (
    <div className="mb-5 flex gap-5">
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Gamemode" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Clan Arena">Clan Arena</SelectItem>
          <SelectItem value="Team Deathmatch">Team Deathmatch</SelectItem>
          <SelectItem value="Duel">Duel</SelectItem>
          <SelectItem value="Capture The Flag">Capture The Flag</SelectItem>
          <SelectItem value="Free For All">Free For All</SelectItem>
          <SelectItem value="Attack & Defend">Attack & Defend</SelectItem>
          <SelectItem value="Race">Race</SelectItem>
          <SelectItem value="Freeze Tag">Freeze Tag</SelectItem>
          <SelectItem value="Red Rover">Red Rover</SelectItem>
        </SelectContent>
      </Select>
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select Region" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Europe">Europe</SelectItem>
          <SelectItem value="North America">North America</SelectItem>
          <SelectItem value="South America">South America</SelectItem>
          <SelectItem value="Asia">Asia</SelectItem>
          <SelectItem value="Oceanic">Oceanic</SelectItem>
          <SelectItem value="Africa">Africa</SelectItem>
        </SelectContent>
      </Select>

      <div className="flex items-center space-x-2 ml-auto">
      <Checkbox id="full-servers" />
      <label
        htmlFor="full-servers"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Show full servers
      </label>
      <Checkbox id="empty-servers" />
      <label
        htmlFor="empty-servers"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Show empty servers
      </label>
      <Checkbox id="private-servers" />
      <label
        htmlFor="private-servers"
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        Show private servers
      </label>
    </div>


    </div>
  );
}
