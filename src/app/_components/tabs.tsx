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
  const [tabs, setTabs] = useState<Tab[]>([
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
  ]);

  useEffect(() => {
    // This code now runs only on the client, after mounting
    const savedTabs = localStorage.getItem("tabs");
    if (savedTabs) {
      setTabs(JSON.parse(savedTabs));
    }
  }, []);

  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.name || "Home");
  const [isSliderMode, setIsSliderMode] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLinkHref, setNewLinkHref] = useState("");
  const [newLinkLogo, setNewLinkLogo] = useState("");
  const [newLinkAlt, setNewLinkAlt] = useState("");

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

  const handleAddLink = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted");

    const newLink: Link = {
      href: newLinkHref,
      logo: newLinkLogo,
      alt: newLinkAlt,
    };

    console.log("Adding link...", newLink);

    setTabs((prevTabs) => {
      const updatedTabs = prevTabs.map((tab) => {
        if (tab.name === activeTab) {
          return {
            ...tab,
            links: [...tab.links, newLink],
          };
        }
        return tab;
      });
      // Save the updated tabs to localStorage
      localStorage.setItem("tabs", JSON.stringify(updatedTabs));
      return updatedTabs;
    });

    // Clear form fields
    setNewLinkHref("");
    setNewLinkLogo("");
    setNewLinkAlt("");
    setIsModalOpen(false);
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
          className="text-normal rounded-md border-none bg-black bg-opacity-30 px-5 py-2 transition-transform duration-100 ease-in hover:scale-110"
          onClick={() => setIsModalOpen(true)}
        >
          +
        </button>
      </div>

      <div className="grid grid-cols-6 gap-2 pt-2 md:grid-cols-7 lg:grid-cols-7">
        {tabs
          .find((tab) => tab.name === activeTab)
          ?.links.map((link: Link, linkIndex: number) => (
            <a key={linkIndex} href={link.href} className="col-span-1">
              <div className="transition-transform duration-100 ease-in hover:scale-110 hover:bg-opacity-50">
                <img
                  src={link.logo}
                  alt={link.alt}
                  className="rounded-md border-none bg-black bg-opacity-30 object-cover px-2 py-2"
                />
              </div>
            </a>
          ))}
        <button
          className="text-normal rounded-md border-none bg-black bg-opacity-30 px-5 py-2 transition-transform duration-100 ease-in hover:scale-110"
          onClick={() => setIsModalOpen(true)}
        >
          +
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-auto w-11/12 max-w-md rounded-lg bg-white p-6 shadow-lg">
            <form onSubmit={handleAddLink} className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-800">
                Add a New Link
              </h3>
              <div>
                <label
                  htmlFor="newLinkHref"
                  className="block text-sm font-medium text-gray-700"
                >
                  Link URL
                </label>
                <input
                  type="url"
                  id="newLinkHref"
                  value={newLinkHref}
                  onChange={(e) => setNewLinkHref(e.target.value)}
                  placeholder="https://example.com"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="newLinkLogo"
                  className="block text-sm font-medium text-gray-700"
                >
                  Logo URL
                </label>
                <input
                  type="url"
                  id="newLinkLogo"
                  value={newLinkLogo}
                  onChange={(e) => setNewLinkLogo(e.target.value)}
                  placeholder="https://logo.example.com"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="newLinkAlt"
                  className="block text-sm font-medium text-gray-700"
                >
                  Alt Text
                </label>
                <input
                  type="text"
                  id="newLinkAlt"
                  value={newLinkAlt}
                  onChange={(e) => setNewLinkAlt(e.target.value)}
                  placeholder="Description"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Add Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
