"use client";
import React, {
  useState,
  useEffect,
  useRef,
  type MouseEvent,
  type WheelEvent,
} from "react";
import { ModalAddLink } from "./modalAddLink";
import { ModalAddTab } from "./modalAddTab";
import { ContextMenu } from "./contextMenu";

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isValidLink = (link: unknown): link is Link => {
      return (
        typeof link === "object" &&
        link !== null &&
        "href" in link &&
        typeof (link as Link).href === "string" &&
        "logo" in link &&
        typeof (link as Link).logo === "string" &&
        "alt" in link &&
        typeof (link as Link).alt === "string"
      );
    };

    const isValidTab = (tab: unknown): tab is Tab => {
      return (
        typeof tab === "object" &&
        tab !== null &&
        "name" in tab &&
        typeof (tab as Tab).name === "string" &&
        "links" in tab &&
        Array.isArray((tab as Tab).links) &&
        (tab as Tab).links.every(isValidLink)
      );
    };
    const isValidTabs = (tabs: unknown): tabs is Tab[] => {
      return Array.isArray(tabs) && tabs.every(isValidTab);
    };

    setTimeout(() => {
      const savedTabs = localStorage.getItem("tabs");
      if (savedTabs) {
        try {
          const parsedTabs: unknown = JSON.parse(savedTabs);
          if (isValidTabs(parsedTabs)) {
            setTabs(parsedTabs);
          } else {
            console.error("Invalid tabs data in localStorage");
          }
        } catch (error) {
          console.error("Error parsing tabs from localStorage", error);
        }
      }
      setIsLoading(false);
    }, 300);
  }, []);

  const [activeTab, setActiveTab] = useState<string>(tabs[0]?.name ?? "Home");
  const [isSliderMode, setIsSliderMode] = useState(false);
  const tabsRef = useRef<HTMLDivElement>(null);
  const contextMenuRef = useRef<HTMLDivElement>(null);

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

    window.dispatchEvent(new Event("storage"));

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
    const walk = (x - startX) * 2;
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
      localStorage.setItem("tabs", JSON.stringify(updatedTabs));
      return updatedTabs;
    });

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
    if (tabsRef.current) {
      const { left, top } = tabsRef.current.getBoundingClientRect();
      setContextMenu({
        visible: true,
        x: e.clientX - left,
        y: e.clientY - top,
        target: target,
        type: type,
      });
    }
  };

  const handleContextMenuClose = () => {
    setContextMenu({ visible: false, x: 0, y: 0, target: null, type: null });
  };

  const handleOutsideClick = () => {
    if (contextMenuRef.current) {
      handleContextMenuClose();
    }
  };

  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    if (tabsRef.current) {
      tabsRef.current.scrollLeft += e.deltaY;
    }
  };

  useEffect(() => {
    if (contextMenu.visible) {
      window.addEventListener("click", handleOutsideClick);
    } else {
      window.removeEventListener("click", handleOutsideClick);
    }

    return () => {
      window.removeEventListener("click", handleOutsideClick);
    };
  }, [contextMenu.visible]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center pt-10">
        <svg
          className="h-8 w-8 animate-spin text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={tabsRef}
        className={`custom-scrollbar flex flex-row gap-2 ${
          isSliderMode ? "overflow-x-auto" : ""
        }`}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onWheel={handleWheel}
      >
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`${
              tab.name === activeTab ? "bg-opacity-50" : ""
            } whitespace-nowrap rounded-md bg-black bg-opacity-30 px-5 py-2 hover:bg-opacity-50`}
            onClick={() => setActiveTab(tab.name)}
            onContextMenu={(e) => handleContextMenu(e, "tab", tab.name)}
          >
            {tab.name}
          </button>
        ))}
        <button
          className="text-normal rounded-md bg-black bg-opacity-30 px-5 py-2 hover:bg-opacity-50"
          onClick={() => setIsTabModalOpen(true)}
        >
          +
        </button>
      </div>

      <div className="grid grid-cols-6 gap-2 pt-2 md:grid-cols-7 lg:grid-cols-7">
        {tabs
          .find((tab) => tab.name === activeTab)
          ?.links.map((link, linkIndex) => (
            <a
              key={linkIndex}
              href={link.href}
              className="col-span-1"
              onContextMenu={(e) => handleContextMenu(e, "link", link.href)}
            >
              <div
                className="group relative transition-transform duration-100 ease-in hover:z-10 hover:scale-110 hover:bg-opacity-50"
                style={{ width: "60px", height: "60px" }}
              >
                <img
                  src={link.logo}
                  alt={link.alt}
                  className="overflow-x-hidden rounded-md border-none bg-black bg-opacity-30 object-cover px-2 py-2"
                  style={{ width: "60px", height: "60px" }}
                />
                <p className="pointer-events-none absolute left-1/2 top-[110%] -translate-x-1/2 transform text-center text-sm opacity-0 transition-opacity duration-100 ease-in-out group-hover:opacity-100">
                  {link.alt}
                </p>
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
        <div ref={contextMenuRef} className="z-50">
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
        </div>
      )}
    </div>
  );
}
