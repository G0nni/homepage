import React, { useEffect, useState } from "react";
import GridLayout, { Layout } from "react-grid-layout";
import { RealTimeHour } from "./RealTimeHours";
import { SearchBar } from "./searchbar";
import { ImageContainer } from "./imageContainer";

const defaultLayout: Layout[] = [
  { i: "hour", x: 0, y: 0, w: 2, h: 2 },
  { i: "search", x: 2, y: 0, w: 4, h: 2 },
  { i: "image", x: 0, y: 2, w: 6, h: 4 },
];

const LAYOUT_KEY = "homepage_layout";

export const Dashboard = () => {
  const [layout, setLayout] = useState<Layout[]>(defaultLayout);

  useEffect(() => {
    const saved = localStorage.getItem(LAYOUT_KEY);
    if (saved) {
      setLayout(JSON.parse(saved));
    }
  }, []);

  const onLayoutChange = (newLayout: Layout[]) => {
    setLayout(newLayout);
    localStorage.setItem(LAYOUT_KEY, JSON.stringify(newLayout));
  };

  return (
    <GridLayout
      className="layout"
      layout={layout}
      cols={6}
      rowHeight={60}
      width={900}
      onLayoutChange={onLayoutChange}
      draggableHandle=".widget-header"
    >
      <div key="hour" className="rounded bg-white/10 p-2">
        <div className="widget-header mb-2 cursor-move font-bold">Heure</div>
        <RealTimeHour />
      </div>
      <div key="search" className="rounded bg-white/10 p-2">
        <div className="widget-header mb-2 cursor-move font-bold">
          Recherche
        </div>
        <SearchBar />
      </div>
      <div key="image" className="rounded bg-white/10 p-2">
        <div className="widget-header mb-2 cursor-move font-bold">Image</div>
        <ImageContainer />
      </div>
    </GridLayout>
  );
};
