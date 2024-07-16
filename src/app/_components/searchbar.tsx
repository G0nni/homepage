"use client";
import React, { useState, useEffect } from "react";
interface SearchEngine {
  name: string;
  url: string;
}
export function SearchBar() {
  const [searchEngine, setSearchEngine] = useState({
    name: "Google",
    url: "https://google.com/search",
  });

  useEffect(() => {
    const loadEngine = () => {
      const engine = localStorage.getItem("searchEngine");
      if (engine) {
        try {
          const parsedEngine: unknown = JSON.parse(engine);
          if (
            typeof parsedEngine === "object" &&
            parsedEngine !== null &&
            "name" in parsedEngine &&
            "url" in parsedEngine
          ) {
            setSearchEngine(parsedEngine as SearchEngine);
          }
        } catch (error) {
          console.error(
            "Failed to parse search engine from localStorage",
            error,
          );
        }
      }
    };

    // Load initial search engine from localStorage
    loadEngine();

    // Define a function to handle storage changes

    // Add event listener for storage changes
    window.addEventListener("storage", loadEngine);

    // Cleanup by removing the event listener
    return () => {
      window.removeEventListener("storage", loadEngine);
    };
  }, []);

  return (
    <form action={searchEngine.url} method="get">
      <input
        className="h-3rem w-25rem rounded-md border-none bg-black bg-opacity-30 px-5 text-sm font-normal leading-normal text-white placeholder-white outline-none md:w-30rem lg:w-30rem"
        type="text"
        name="q"
        placeholder={`Rechercher sur ${searchEngine.name}`}
        autoComplete="off"
        required
      />
    </form>
  );
}
