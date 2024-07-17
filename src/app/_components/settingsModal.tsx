"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

import Vibrant from "node-vibrant";
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
    [key: string]: any; // Assuming there might be more properties in the user object
  };
  [key: string]: any; // Assuming the session object might contain more properties
};
interface SettingsModalProps {
  session: Session | null;
}

export function SettingsModal({ session }: SettingsModalProps) {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [isAutoThemeEnabled, setIsAutoThemeEnabled] = useState(false);
  const [searchEngine, setSearchEngine] = useState({
    name: "Google",
    url: "https://google.com/search",
  });

  useEffect(() => {
    const storedImage = localStorage.getItem("themeImage");
    if (storedImage) {
      setImagePreviewUrl(storedImage);
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
      localStorage.removeItem("lightVibrant");
      localStorage.removeItem("darkVibrant");
      window.dispatchEvent(new Event("storage"));
    }
  }, [isAutoThemeEnabled]);

  const openSettingsModal = () => {
    setIsSettingsModalOpen(true);
  };

  const closeSettingsModal = () => {
    setIsSettingsModalOpen(false);
  };

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
      setIsSettingsModalOpen(false);
    }
  };

  const extractAndStoreColors = (base64Image?: string) => {
    const imageToUse = base64Image ?? imagePreviewUrl;
    if (!imageToUse) return;

    Vibrant.from(imageToUse)
      .getPalette()
      .then((palette) => {
        const { LightVibrant, DarkVibrant } = palette;
        localStorage.setItem("lightVibrant", JSON.stringify(LightVibrant));
        localStorage.setItem("darkVibrant", JSON.stringify(DarkVibrant));
        window.dispatchEvent(new Event("theme-update"));
      })
      .catch((error) => {
        console.error("Erreur lors de l'extraction des couleurs :", error);
      });
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
        return <AboutSection />;
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
                  window.location.reload();
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
    <>
      <button
        onClick={openSettingsModal}
        className="rounded-md bg-transparent px-3 py-3 font-semibold no-underline transition hover:bg-white/10"
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 30 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M15.3219 10.5C14.2341 10.5 13.1707 10.8226 12.2663 11.4269C11.3618 12.0313 10.6568 12.8902 10.2406 13.8952C9.82428 14.9002 9.71536 16.0061 9.92758 17.073C10.1398 18.1399 10.6636 19.1199 11.4328 19.8891C12.202 20.6583 13.182 21.1821 14.2489 21.3943C15.3158 21.6065 16.4217 21.4976 17.4266 21.0813C18.4316 20.665 19.2906 19.9601 19.895 19.0556C20.4993 18.1512 20.8219 17.0878 20.8219 16C20.8202 14.5418 20.2402 13.1438 19.2091 12.1127C18.1781 11.0816 16.7801 10.5017 15.3219 10.5V10.5ZM15.3219 19.5C14.6297 19.5 13.953 19.2947 13.3774 18.9101C12.8018 18.5255 12.3532 17.9789 12.0883 17.3394C11.8234 16.6998 11.7541 15.9961 11.8891 15.3172C12.0242 14.6382 12.3575 14.0146 12.847 13.5251C13.3365 13.0356 13.9601 12.7023 14.6391 12.5672C15.318 12.4322 16.0217 12.5015 16.6613 12.7664C17.3008 13.0313 17.8474 13.4799 18.232 14.0555C18.6166 14.6311 18.8219 15.3078 18.8219 16C18.8208 16.9279 18.4518 17.8176 17.7956 18.4737C17.1395 19.1299 16.2498 19.4989 15.3219 19.5V19.5Z"
            fill="#FFFDFA"
          />
          <path
            d="M29.0438 20.1449L27.0582 18.5103C27.4102 16.8552 27.4102 15.1446 27.0582 13.4895L29.0438 11.855C29.2728 11.6673 29.4276 11.4043 29.4803 11.113C29.5331 10.8217 29.4804 10.5211 29.3317 10.265L27.2934 6.73485C27.1461 6.47799 26.9121 6.28201 26.6334 6.18202C26.3546 6.08204 26.0494 6.08459 25.7724 6.18923L23.3623 7.09216C22.1068 5.95784 20.6257 5.10178 19.0161 4.58016L18.5932 2.04448C18.5453 1.75225 18.3949 1.48662 18.169 1.29521C17.943 1.10379 17.6563 0.999107 17.3602 0.999913H13.2838C12.9877 0.999118 12.701 1.1038 12.475 1.2952C12.2491 1.4866 12.0987 1.7522 12.0508 2.04441L11.6282 4.58016C10.0186 5.10177 8.53742 5.95782 7.28194 7.09216L4.87163 6.1891C4.59462 6.08454 4.28944 6.08203 4.01075 6.18202C3.73207 6.28201 3.49809 6.47797 3.35075 6.73479L1.31257 10.2652C1.16392 10.5213 1.11127 10.8219 1.16407 11.1132C1.21686 11.4045 1.37164 11.6675 1.60069 11.8551L3.58613 13.4895C3.23413 15.1446 3.23413 16.8552 3.58613 18.5103L1.6005 20.1449C1.37149 20.3325 1.21675 20.5955 1.16399 20.8868C1.11124 21.1782 1.1639 21.4788 1.31257 21.7348L3.35082 25.265C3.49817 25.5218 3.73218 25.7178 4.01091 25.8178C4.28964 25.9178 4.59486 25.9152 4.87188 25.8106L7.282 24.9077C8.53748 26.042 10.0186 26.8981 11.6283 27.4197L12.0509 29.9554C12.0988 30.2476 12.2491 30.5132 12.4751 30.7046C12.701 30.896 12.9877 31.0007 13.2838 30.9999H17.3602C17.6563 31.0007 17.943 30.896 18.169 30.7046C18.3949 30.5132 18.5453 30.2476 18.5932 29.9554L19.0159 27.4197C20.6255 26.898 22.1066 26.042 23.3621 24.9077L25.7724 25.8107C26.0494 25.9153 26.3546 25.9178 26.6332 25.8178C26.9119 25.7178 27.1459 25.5218 27.2933 25.265L29.3313 21.7346C29.48 21.4786 29.5327 21.1781 29.4801 20.8868C29.4274 20.5955 29.2727 20.3325 29.0438 20.1449V20.1449ZM25.8791 23.7149L22.8723 22.5884L22.4169 23.0467C21.1642 24.3094 19.5973 25.215 17.8779 25.67L17.2529 25.8348L16.7251 28.9999H13.9194L13.3918 25.8348L12.7668 25.67C11.0474 25.215 9.48047 24.3094 8.22775 23.0467L7.77244 22.5884L4.76513 23.7149L3.36257 21.285L5.83938 19.246L5.67063 18.6227C5.20655 16.905 5.20655 15.0949 5.67063 13.3771L5.83938 12.7539L3.36257 10.7149L4.76544 8.28498L7.77225 9.41148L8.22756 8.9531C9.48028 7.69045 11.0472 6.78487 12.7666 6.32979L13.3916 6.16504L13.9192 2.99991H16.7251L17.2527 6.16504L17.8777 6.32979C19.5971 6.78487 21.164 7.69045 22.4168 8.9531L22.8721 9.41148L25.8789 8.28498L27.2818 10.7148L24.805 12.7539L24.9738 13.3771C25.4378 15.0949 25.4378 16.905 24.9738 18.6227L24.805 19.246L27.2818 21.285L25.8791 23.7149Z"
            fill="#FFFDFA"
          />
        </svg>
      </button>

      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 text-gray-700">
          <div className="relative flex h-[600px] w-[800px] rounded-lg bg-white p-6 shadow-lg">
            <button
              onClick={closeSettingsModal}
              className="absolute right-0 top-0 mr-4 mt-4 rounded-md bg-gray-200 p-2 text-gray-600 hover:bg-gray-300"
            >
              X
            </button>
            <div className="w-1/5">
              <ul>
                {tabs.map((tab) => (
                  <li key={tab.id} className="mb-2">
                    <button
                      className={`p-2 ${
                        activeTab === tab.id ? "bg-gray-200" : ""
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="w-4/5 p-4">{renderTabContent()}</div>
            {session && (
              <div className="absolute bottom-5 left-5">
                <Link
                  href={"/api/auth/signout"}
                  className="inline-flex items-center justify-center rounded-md bg-red-500/10 p-2 font-semibold no-underline transition hover:bg-red-500/20"
                >
                  <svg
                    fill="#D32F2F"
                    height="20px"
                    width="20px"
                    version="1.1"
                    id="Capa_1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 384.971 384.971"
                  >
                    <g>
                      <g id="Sign_Out">
                        <path
                          d="M180.455,360.91H24.061V24.061h156.394c6.641,0,12.03-5.39,12.03-12.03s-5.39-12.03-12.03-12.03H12.03
                     C5.39,0.001,0,5.39,0,12.031V372.94c0,6.641,5.39,12.03,12.03,12.03h168.424c6.641,0,12.03-5.39,12.03-12.03
                     C192.485,366.299,187.095,360.91,180.455,360.91z"
                        />
                        <path
                          d="M381.481,184.088l-83.009-84.2c-4.704-4.752-12.319-4.74-17.011,0c-4.704,4.74-4.704,12.439,0,17.179l62.558,63.46H96.279
                     c-6.641,0-12.03,5.438-12.03,12.151c0,6.713,5.39,12.151,12.03,12.151h247.74l-62.558,63.46c-4.704,4.752-4.704,12.439,0,17.179
                     c4.704,4.752,12.319,4.752,17.011,0l82.997-84.2C386.113,196.588,386.161,188.756,381.481,184.088z"
                        />
                      </g>
                    </g>
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default SettingsModal;
