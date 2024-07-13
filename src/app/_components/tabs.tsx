"use client";
import React, { useState, useEffect, useRef, MouseEvent } from "react";
import { ModalAddLink } from "./modalAddLink";
import { ModalAddTab } from "./modalAddTab";
import { ContextMenu } from "./contextMenu";

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

interface ContextMenuState {
  visible: boolean;
  x: number;
  y: number;
  target: string | null;
  type: "tab" | "link" | null;
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
  const [isTabModalOpen, setIsTabModalOpen] = useState(false);
  const [newLinkHref, setNewLinkHref] = useState("");
  const [newLinkLogo, setNewLinkLogo] = useState("");
  const [newLinkAlt, setNewLinkAlt] = useState("");
  const [newTabName, setNewTabName] = useState("");

  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    visible: false,
    x: 0,
    y: 0,
    target: null,
    type: null,
  });

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

    const newLink: Link = {
      href: newLinkHref,
      logo: "https://logo.clearbit.com/" + newLinkHref,
      alt: newLinkAlt,
    };

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

  const handleAddTab = () => {
    if (!newTabName.trim()) {
      return;
    }

    const newTab: Tab = {
      name: newTabName,
      links: [],
    };

    setTabs((prevTabs) => {
      const updatedTabs = [...prevTabs, newTab];
      localStorage.setItem("tabs", JSON.stringify(updatedTabs));
      return updatedTabs;
    });

    setNewTabName("");
    setIsTabModalOpen(false);
  };

  const handleEditTab = (oldName: string, newName: string) => {
    setTabs((prevTabs) => {
      const updatedTabs = prevTabs.map((tab) =>
        tab.name === oldName ? { ...tab, name: newName } : tab,
      );
      localStorage.setItem("tabs", JSON.stringify(updatedTabs));
      return updatedTabs;
    });
  };

  const handleDeleteTab = (tabName: string) => {
    setTabs((prevTabs) => {
      const updatedTabs = prevTabs.filter((tab) => tab.name !== tabName);
      localStorage.setItem("tabs", JSON.stringify(updatedTabs));
      return updatedTabs;
    });
  };

  const handleEditLink = (tabName: string, oldHref: string, newLink: Link) => {
    setTabs((prevTabs) => {
      const updatedTabs = prevTabs.map((tab) => {
        if (tab.name === tabName) {
          return {
            ...tab,
            links: tab.links.map((link) =>
              link.href === oldHref ? newLink : link,
            ),
          };
        }
        return tab;
      });
      localStorage.setItem("tabs", JSON.stringify(updatedTabs));
      return updatedTabs;
    });
  };

  const handleDeleteLink = (tabName: string, href: string) => {
    setTabs((prevTabs) => {
      const updatedTabs = prevTabs.map((tab) => {
        if (tab.name === tabName) {
          return {
            ...tab,
            links: tab.links.filter((link) => link.href !== href),
          };
        }
        return tab;
      });
      localStorage.setItem("tabs", JSON.stringify(updatedTabs));
      return updatedTabs;
    });
  };

  const handleContextMenu = (
    e: MouseEvent,
    type: "tab" | "link",
    target: string,
  ) => {
    e.preventDefault();
    setContextMenu({
      visible: true,
      x: e.clientX,
      y: e.clientY,
      target: target,
      type: type,
    });
  };

  const handleContextMenuClose = () => {
    setContextMenu({ visible: false, x: 0, y: 0, target: null, type: null });
  };

  return (
    <div className="relative" onClick={handleContextMenuClose}>
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
            onContextMenu={(e) => handleContextMenu(e, "tab", tab.name)}
          >
            {tab.name}
          </button>
        ))}
        <button
          className="text-normal rounded-md border-none bg-black bg-opacity-30 px-5 py-2 transition-transform duration-100 ease-in hover:scale-110"
          onClick={() => setIsTabModalOpen(true)}
        >
          +
        </button>
      </div>

      <div className="grid grid-cols-6 gap-2 pt-2 md:grid-cols-7 lg:grid-cols-7">
        {tabs
          .find((tab) => tab.name === activeTab)
          ?.links.map((link: Link, linkIndex: number) => (
            <a
              key={linkIndex}
              href={link.href}
              className="col-span-1"
              onContextMenu={(e) => handleContextMenu(e, "link", link.href)}
            >
              <div className="transition-transform duration-100 ease-in hover:scale-110 hover:bg-opacity-50">
                <img
                  src={link.logo}
                  alt={link.alt}
                  className="overflow-x-hidden rounded-md border-none bg-black bg-opacity-30 object-cover px-2 py-2"
                  style={{ width: "60px", height: "60px" }}
                />
              </div>
            </a>
          ))}
        <button
          style={{ width: "60px", height: "60px" }}
          className="text-normal rounded-md border-none bg-black bg-opacity-30 px-5 py-2 transition-transform duration-100 ease-in hover:scale-110"
          onClick={() => setIsModalOpen(true)}
        >
          +
        </button>
      </div>

      {isModalOpen && (
        <ModalAddLink
          setIsModalOpen={setIsModalOpen}
          handleAddLink={handleAddLink}
          newLinkHref={newLinkHref}
          setNewLinkHref={setNewLinkHref}
          newLinkAlt={newLinkAlt}
          setNewLinkAlt={setNewLinkAlt}
        />
      )}

      {isTabModalOpen && (
        <ModalAddTab
          setIsModalOpen={setIsTabModalOpen}
          handleAddTab={handleAddTab}
          newTabName={newTabName}
          setNewTabName={setNewTabName}
        />
      )}

      {contextMenu.visible && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          type={contextMenu.type}
          target={contextMenu.target}
          onClose={handleContextMenuClose}
          onEdit={(newName) => {
            if (contextMenu.type === "tab") {
              handleEditTab(contextMenu.target!, newName);
            } else if (contextMenu.type === "link") {
              const activeTabObj = tabs.find((tab) => tab.name === activeTab);
              if (activeTabObj) {
                const linkToEdit = activeTabObj.links.find(
                  (link) => link.href === contextMenu.target,
                );
                if (linkToEdit) {
                  handleEditLink(activeTabObj.name, linkToEdit.href, {
                    ...linkToEdit,
                    href: newName,
                  });
                }
              }
            }
          }}
          onDelete={() => {
            if (contextMenu.type === "tab") {
              handleDeleteTab(contextMenu.target!);
            } else if (contextMenu.type === "link") {
              handleDeleteLink(activeTab, contextMenu.target!);
            }
          }}
        />
      )}
    </div>
  );
}
