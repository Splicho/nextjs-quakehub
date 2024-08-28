import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import Home from "@/app/page";
import Image from "next/image";
import styles from './navigation.module.css';
import Icon from "../Icon";
import { config } from "@/config/app";

export default function navigation() {
  return (
    <div className="w-full mx-auto max-w-[1440px] p-2 flex items-center">
      <div>
        <Link href="/" className="flex items-center">
          <Image
            src="/Logo.png"
            alt="Logo"
            width={30}
            height={30}
            className="mr-2"
          />
          <span className="flex items-center font-bold">QaukeHub</span>
        </Link>
      </div>
      <div className="flex gap-5 ml-auto">
      <div className="flex gap-5">
        <Link href="/">News</Link>
        <Link href="">Resources</Link>
      </div>
      <div className={styles.separator}></div>
      <Link href={config.socials.discord}>
        <Icon.Discord />
      </Link>
      </div>
    </div>
  );
}
