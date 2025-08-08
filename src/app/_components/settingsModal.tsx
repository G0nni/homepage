"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import defaultImage from "~/images/default.jpg";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogTrigger,
} from "../../components/ui/dialog";
import ColorThief from "color-thief-browser";
import ImageUploader from "./imageUploader";
import ThemeSelector from "./themeSelector";
import AboutSection from "./aboutSection";
import SearchEngine from "./searchEngineSelector";
import { Post } from "./post";

interface SearchEngine {
  name: string;
  url: string;
}

type Session = {
  user: {
    id: string;
    [key: string]: unknown; // Assuming there might be more properties in the user object
  };
  [key: string]: unknown; // Assuming the session object might contain more properties
};
interface SettingsModalProps {
  session: Session | null;
}

export function SettingsModal({ session }: SettingsModalProps) {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [isAutoThemeEnabled, setIsAutoThemeEnabled] = useState(false);
  const [searchEngine, setSearchEngine] = useState({
    name: "Google",
    url: "https://google.com/search",
  });

  useEffect(() => {
    const storedImage = localStorage.getItem("themeImage") ?? defaultImage.src;
    if (storedImage) {
      setImagePreviewUrl(storedImage);
    } else {
      setImagePreviewUrl(defaultImage.src);
    }
    // Read the autoThemeEnabled value from localStorage and initialize isAutoThemeEnabled state
    const storedAutoTheme = localStorage.getItem("autoThemeEnabled");
    const isAutoEnabled = storedAutoTheme === "true";
    setIsAutoThemeEnabled(isAutoEnabled); // This will correctly set the state based on localStorage

    // If auto theme is enabled, attempt to extract and store colors
    if (isAutoEnabled) {
      extractAndStoreColors();
    }

    const storedSearchEngine = localStorage.getItem("searchEngine");
    if (storedSearchEngine) {
      try {
        const parsedEngine: unknown = JSON.parse(storedSearchEngine);
        if (
          typeof parsedEngine === "object" &&
          parsedEngine !== null &&
          "name" in parsedEngine &&
          "url" in parsedEngine
        ) {
          setSearchEngine(parsedEngine as SearchEngine);
        }
      } catch (error) {
        console.error("Failed to parse search engine from localStorage", error);
      }
    }
  }, []);

  useEffect(() => {
    if (isAutoThemeEnabled) {
      extractAndStoreColors();
    } else {
      window.dispatchEvent(new Event("storage"));
    }
  }, [isAutoThemeEnabled]);

  // open/close handled by Dialog

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const validImageTypes = [
      "image/gif",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!file) {
      alert("Aucun fichier sélectionné.");
      return;
    }

    if (!validImageTypes.includes(file.type)) {
      alert("Fichier invalide, veuillez sélectionner une image ou un gif.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("La taille de l'image ne doit pas dépasser 5 Mo");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result as string;
      setImagePreviewUrl(base64Image);
      if (isAutoThemeEnabled) {
        extractAndStoreColors(base64Image);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleAutoThemeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setIsAutoThemeEnabled(isChecked);
    localStorage.setItem("autoThemeEnabled", isChecked ? "true" : "false");
    window.dispatchEvent(new Event("storage"));
  };

  const tabs = [
    { id: "general", name: "Général" },
    { id: "theme", name: "Thème" },
    { id: "about", name: "À propos" },
    { id: "reset", name: "Reset" },
  ];

  const handleSaveImage = () => {
    if (imagePreviewUrl) {
      localStorage.setItem("themeImage", imagePreviewUrl);
      window.dispatchEvent(new Event("storage"));
      // Fermeture de la modal gérée par Dialog
    }
  };

  const extractAndStoreColors = (base64Image?: string) => {
    const imageToUse = base64Image ?? imagePreviewUrl;
    if (!imageToUse) return;

    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    img.src = imageToUse;
    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        const dominant = colorThief.getColor(img);
        // Pour garder la logique, on stocke la couleur dominante dans lightVibrant ET darkVibrant
        localStorage.setItem("lightVibrant", JSON.stringify(dominant));
        localStorage.setItem("darkVibrant", JSON.stringify(dominant));
        window.dispatchEvent(new Event("theme-update"));
      } catch (error) {
        console.error("Erreur lors de l'extraction des couleurs :", error);
      }
    };
    img.onerror = (error) => {
      console.error(
        "Erreur lors du chargement de l'image pour l'extraction de couleur :",
        error,
      );
    };
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <div className="flex flex-col gap-10">
            <h3 className="text-lg font-semibold">
              Personnalisez vos paramètres ici
            </h3>
            <SearchEngine
              searchEngine={searchEngine}
              setSearchEngine={setSearchEngine}
            />
            <Post session={session} />
          </div>
        );
      case "theme":
        return (
          <div className="max-h-full overflow-y-auto">
            <p className="mb-4">Personnalisez votre thème ici</p>
            <ImageUploader
              imagePreviewUrl={imagePreviewUrl}
              setImagePreviewUrl={setImagePreviewUrl}
              handleImageChange={handleImageChange}
              handleSaveImage={handleSaveImage}
            />
            <ThemeSelector
              handleAutoThemeChange={handleAutoThemeChange}
              isAutoThemeEnabled={isAutoThemeEnabled}
            />
          </div>
        );
      case "about":
        return (
          <div className="max-h-full overflow-y-auto">
            <AboutSection />
          </div>
        );
      case "reset":
        return (
          <div>
            <p>Voulez vous réinitialiser les paramètres ?</p>
            <button
              onClick={() => {
                if (
                  window.confirm(
                    "Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?",
                  )
                ) {
                  localStorage.clear();
                  window.dispatchEvent(new Event("storage"));
                }
              }}
              className="mt-4 rounded-md bg-red-500 px-4 py-2 text-white"
            >
              Réinitialiser
            </button>
          </div>
        );
      default:
        return <p>Contenu par défaut</p>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="rounded-lg bg-neutral-200 p-2 shadow-md transition hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:bg-neutral-800 dark:hover:bg-neutral-700"
          aria-label="Ouvrir les paramètres"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-neutral-600 dark:text-neutral-300"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.01c1.527-.878 3.276.87 2.398 2.398a1.724 1.724 0 001.01 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.01 2.573c.878 1.527-.87 3.276-2.398 2.398a1.724 1.724 0 00-2.573 1.01c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.572-1.01c-1.528.878-3.277-.87-2.399-2.398a1.724 1.724 0 00-1.01-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.01-2.572c-.878-1.528.87-3.277 2.399-2.399.996.574 2.25.096 2.572-1.01z"
            />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      </DialogTrigger>
      <DialogContent className="absolute left-1/2 top-1/2 z-50 flex max-w-2xl -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center overflow-hidden rounded-xl border border-neutral-200 bg-white p-0 text-neutral-900 shadow-xl dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100">
        <div className="sticky top-0 z-10 flex w-full items-center justify-center border-b border-neutral-200 bg-white/95 px-6 pb-3 pt-6 dark:border-neutral-800 dark:bg-neutral-900/95">
          <DialogTitle className="flex items-center gap-2 text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
            Paramètres
            <svg
              width="22"
              height="22"
              viewBox="0 0 30 30"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="inline-block align-middle text-neutral-400 dark:text-neutral-500"
            >
              <path
                d="M15.3219 10.5C14.2341 10.5 13.1707 10.8226 12.2663 11.4269C11.3618 12.0313 10.6568 12.8902 10.2406 13.8952C9.82428 14.9002 9.71536 16.0061 9.92758 17.073C10.1398 18.1399 10.6636 19.1199 11.4328 19.8891C12.202 20.6583 13.182 21.1821 14.2489 21.3943C15.3158 21.6065 16.4217 21.4976 17.4266 21.0813C18.4316 20.665 19.2906 19.9601 19.895 19.0556C20.4993 18.1512 20.8219 17.0878 20.8219 16C20.8202 14.5418 20.2402 13.1438 19.2091 12.1127C18.1781 11.0816 16.7801 10.5017 15.3219 10.5V10.5ZM15.3219 19.5C14.6297 19.5 13.953 19.2947 13.3774 18.9101C12.8018 18.5255 12.3532 17.9789 12.0883 17.3394C11.8234 16.6998 11.7541 15.9961 11.8891 15.3172C12.0242 14.6382 12.3575 14.0146 12.847 13.5251C13.3365 13.0356 13.9601 12.7023 14.6391 12.5672C15.318 12.4322 16.0217 12.5015 16.6613 12.7664C17.3008 13.0313 17.8474 13.4799 18.232 14.0555C18.6166 14.6311 18.8219 15.3078 18.8219 16C18.8208 16.9279 18.4518 17.8176 17.7956 18.4737C17.1395 19.1299 16.2498 19.4989 15.3219 19.5V19.5Z"
                fill="currentColor"
              />
            </svg>
          </DialogTitle>
          <DialogClose asChild>
            <button className="ml-auto rounded-full bg-neutral-100 p-2 text-neutral-500 shadow-sm transition hover:bg-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700">
              <span className="text-2xl leading-none">×</span>
            </button>
          </DialogClose>
        </div>
        <div className="flex h-[500px] w-full flex-col md:flex-row">
          <aside className="w-full flex-shrink-0 border-neutral-200 bg-neutral-50 px-4 py-4 md:w-1/4 md:border-r dark:border-neutral-800 dark:bg-neutral-900">
            <ul className="space-y-2">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <button
                    className={`w-full rounded-md border border-transparent px-3 py-2 text-left font-medium transition-all duration-200 ${activeTab === tab.id ? "border-neutral-300 bg-neutral-200 text-neutral-900 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100" : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.name}
                  </button>
                </li>
              ))}
            </ul>
            {session && (
              <div className="mt-8">
                <Link
                  href={"/api/auth/signout"}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-red-500/10 px-3 py-2 font-medium text-red-500 transition hover:bg-red-500/20 hover:text-red-700"
                >
                  <svg
                    fill="#D32F2F"
                    height="18px"
                    width="18px"
                    version="1.1"
                    id="Capa_1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384.971 384.971"
                  >
                    <g>
                      <g id="Sign_Out">
                        <path d="M180.455,360.91H24.061V24.061h156.394c6.641,0,12.03-5.39,12.03-12.03s-5.39-12.03-12.03-12.03H12.03 C5.39,0.001,0,5.39,0,12.031V372.94c0,6.641,5.39,12.03,12.03,12.03h168.424c6.641,0,12.03-5.39,12.03-12.03 C192.485,366.299,187.095,360.91,180.455,360.91z" />
                        <path d="M381.481,184.088l-83.009-84.2c-4.704-4.752-12.319-4.74-17.011,0c-4.704,4.74-4.704,12.439,0,17.179l62.558,63.46H96.279 c-6.641,0-12.03,5.438-12.03,12.151c0,6.713,5.39,12.151,12.03,12.151h247.74l-62.558,63.46c-4.704,4.752-4.704,12.439,0,17.179 c4.704,4.752,12.319,4.752,17.011,0l82.997-84.2C386.113,196.588,386.161,188.756,381.481,184.088z" />
                      </g>
                    </g>
                  </svg>
                  Déconnexion
                </Link>
              </div>
            )}
          </aside>
          <main className="w-full flex-1 overflow-y-auto rounded-xl bg-white px-6 py-6 md:rounded-l-none dark:bg-neutral-900">
            <div className="min-h-[300px]">{renderTabContent()}</div>
          </main>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SettingsModal;
