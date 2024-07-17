import React from "react";

interface SearchEngine {
  name: string;
  url: string;
}

const searchEngines: SearchEngine[] = [
  { name: "Google", url: "https://google.com/search" },
  { name: "Bing", url: "https://bing.com/search" },
  { name: "DuckDuckGo", url: "https://duckduckgo.com" },
  { name: "Qwant", url: "https://qwant.com" },
  { name: "Ecosia", url: "https://ecosia.org/search" },
  { name: "Yahoo", url: "https://search.yahoo.com/search" },
];

interface SearchEngineSelectorProps {
  searchEngine: SearchEngine;
  setSearchEngine: (engine: SearchEngine) => void;
}

const SearchEngineSelector: React.FC<SearchEngineSelectorProps> = ({
  searchEngine,
  setSearchEngine,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedEngine = searchEngines.find(
      (engine) => engine.name === event.target.value,
    );
    if (selectedEngine) {
      setSearchEngine(selectedEngine);
      localStorage.setItem("searchEngine", JSON.stringify(selectedEngine));
      window.dispatchEvent(new Event("storage"));
    }
  };

  return (
    <div>
      <label htmlFor="searchEngine" className="mb-2 block">
        Sélectionner votre moteur de recherche:
      </label>
      <select
        id="searchEngine"
        value={searchEngine.name}
        onChange={handleChange}
        className="rounded-md border p-2"
      >
        {searchEngines.map((engine) => (
          <option key={engine.name} value={engine.name}>
            {engine.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SearchEngineSelector;
