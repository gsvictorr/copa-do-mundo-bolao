'use client';

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "./button"
import { DropdownMenu } from "@radix-ui/react-dropdown-menu"
import { DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./dropdown-menu"
import { useEffect, useState} from "react"


export function ThemeSwitch() {
  const { setTheme, theme } = useTheme()

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
     setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="">
        <Button variant="outline" size={"lg"} className=" cursor-pointer rounded-lg text-xs">
          {theme === "light" ? <Sun className="size-4" /> : theme === "dark" ? <Moon className="size-4" /> : <Sun className="size-4" />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" >
        <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme("light")}>
          Claro
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme("dark")}>
          Escuro
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}