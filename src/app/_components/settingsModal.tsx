"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import SettingsIcon from "~/assets/svg/cil-settings.svg";
import CustomFileInput from "./customFileInput";
import Vibrant from "node-vibrant";
import ImageUploader from "./imageUploader";
import ThemeSelector from "./themeSelector";
import AboutSection from "./aboutSection";

export function SettingsModal() {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("light");
  const [isAutoThemeEnabled, setIsAutoThemeEnabled] = useState(false);

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

  const handleThemeChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSelectedTheme(e.target.value);
    window.dispatchEvent(new Event("storage"));
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
    const imageToUse = base64Image || imagePreviewUrl;
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
        return <p>Contenu Général</p>;
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
              selectedTheme={selectedTheme}
              handleThemeChange={handleThemeChange}
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
        <Image src={SettingsIcon} alt="Settings icon" width={30} height={30} />
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
            <div className="w-1/6">
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
            <div className="w-5/6 p-4">{renderTabContent()}</div>
          </div>
        </div>
      )}
    </>
  );
}

export default SettingsModal;
