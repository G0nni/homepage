"use client";
import React, { useState, useEffect, useRef } from "react";

// Define interfaces for the structure of your data
interface Link {
  href: string;
  logo: string;
  alt: string;
}

interface Tab {
  name: string;
  links: Link[];
}

export function Tabs() {
  const [tabs, setTabs] = useState<Tab[]>(() => {
    const savedTabs = localStorage.getItem("tabs");
    return savedTabs
      ? JSON.parse(savedTabs)
      : [
          {
            name: "Home",
            links: [
              {
                href: "https://www.youtube.com",
                logo: "https://logo.clearbit.com/youtube.com",
                alt: "Youtube",
              },
              {
                href: "https://www.crunchyroll.com",
                logo: "https://logo.clearbit.com/crunchyroll.com",
                alt: "Crunchyroll",
              },
            ],
          },
          {
            name: "Dev",
            links: [
              {
                href: "https://github.com/G0nni",
                logo: "https://logo.clearbit.com/github.com",
                alt: "Github",
              },
              {
                href: "https://remix.run/docs",
                logo: "https://logo.clearbit.com/remix.run",
                alt: "Remix",
              },
            ],
          },
        ];
  });

  const [activeTab, setActiveTab] = useState<string>(
    tabs[0]?.name || "DefaultTabName",
  );

  const [isSliderMode, setIsSliderMode] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    const checkIfOverflow = () => {
      if (tabsRef.current) {
        const isOverflowing =
          tabsRef.current.scrollWidth > tabsRef.current.offsetWidth;
        setIsSliderMode(isOverflowing);
      }
    };

    checkIfOverflow();
    window.addEventListener("resize", checkIfOverflow);

    return () => window.removeEventListener("resize", checkIfOverflow);
  }, [tabs]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!tabsRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - tabsRef.current.offsetLeft);
    setScrollLeft(tabsRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !tabsRef.current) return;
    e.preventDefault();
    const x = e.pageX - tabsRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Multipliez par 2 pour augmenter la vitesse de défilement
    tabsRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <div className="relative">
      <div
        ref={tabsRef}
        className={`custom-scrollbar flex flex-row gap-2 ${
          isSliderMode ? "overflow-x-auto pb-2" : ""
        }`}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        {tabs.map((tab: Tab, index: number) => (
          <button
            key={index}
            className={`text-normal rounded-md border-none bg-black bg-opacity-30 px-4 py-2 ${
              tab.name === activeTab ? "bg-opacity-50" : ""
            }`}
            onClick={() => setActiveTab(tab.name)}
          >
            {tab.name}
          </button>
        ))}
        <button
          className="text-normal rounded-md border-none bg-black bg-opacity-30 px-5 py-2"
          onClick={() => {
            /* Logique pour ajouter une nouvelle tab ou un lien */
          }}
        >
          +
        </button>
      </div>

      <div className="flex flex-row items-center gap-2 pt-2">
        {tabs
          .find((tab) => tab.name === activeTab)
          ?.links.map((link: Link, linkIndex: number) => (
            <a key={linkIndex} href={link.href}>
              <div
                className="rounded-md border-none bg-black bg-opacity-30 px-2 py-2 hover:scale-110"
                style={{ transition: "transform 0.1s ease" }}
              >
                <img
                  src={link.logo}
                  alt={link.alt}
                  style={{
                    width: 50,
                    borderRadius: 2.5,
                  }}
                />
              </div>
            </a>
          ))}
      </div>
    </div>
  );
}
