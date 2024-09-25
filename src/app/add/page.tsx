import { AddComponent } from "@/app/add/content";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Add() {
  return (
    <div className="flex min-h-screen w-full flex-col">
      {/* Fixed Top Navigation */}
      <div className="fixed top-0 w-full backdrop-blur-md bg-background shadow-md z-50 border-b transition-colors duration-500">
        <div className="container mx-auto px-6 py-2 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Search
          </h1>
          <TopNav />
        </div>
      </div>

      {/* Search Component */}
      <div className="flex flex-grow items-center justify-center">
        <AddComponent />
      </div>
    </div>
  );
}

function TopNav() {
  return (
    <nav className={cn("flex items-center space-x-8")}>
      <Link
        href="/"
        className={cn(
          "text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted/40 rounded-full px-4 py-2 dark:hover:text-primary transition-colors duration-300"
        )}
      >
        Home
      </Link>
      <Link
        href="/add"
        className={cn(
          "text-sm font-medium text-foreground hover:text-primary bg-muted rounded-full px-4 py-2 dark:hover:text-primary transition-colors duration-300"
        )}
      >
        Add
      </Link>
    </nav>
  );
}
