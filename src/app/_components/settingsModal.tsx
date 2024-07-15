"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import SettingsIcon from "~/assets/svg/cil-settings.svg";
import CustomFileInput from "./customFileInput";

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
  }, []);

  const openSettingsModal = () => {
    setIsSettingsModalOpen(true);
  };

  const closeSettingsModal = () => {
    setIsSettingsModalOpen(false);
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const validImageTypes = ["image/gif", "image/jpeg", "image/png"];

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
    };
    reader.readAsDataURL(file);
  };
  const handleThemeChange = (e: {
    target: { value: React.SetStateAction<string> };
  }) => setSelectedTheme(e.target.value);

  const handleAutoThemeChange = (e: {
    target: { checked: boolean | ((prevState: boolean) => boolean) };
  }) => setIsAutoThemeEnabled(e.target.checked);

  const tabs = [
    { id: "general", name: "Général" },
    { id: "theme", name: "Thème" },
    { id: "about", name: "À propos" },
  ];

  const handleSaveImage = () => {
    if (imagePreviewUrl) {
      localStorage.setItem("themeImage", imagePreviewUrl);
      window.dispatchEvent(new Event("storage"));
      setIsSettingsModalOpen(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return <p>Contenu Général</p>;
      case "theme":
        return (
          <div className="flex flex-col space-y-4">
            <div className="flex">
              <div className="w-1/2">
                <div className="mb-4">
                  <label
                    htmlFor="themeImage"
                    className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
                  >
                    Changer l'image
                  </label>
                  <CustomFileInput
                    id="themeImage"
                    name="themeImage"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() =>
                      setImagePreviewUrl(
                        localStorage.getItem("themeImage") ?? "",
                      )
                    }
                    className="w-full rounded-md bg-gray-600 px-4 py-2 text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                  >
                    Supprimer l'image
                  </button>
                  <button
                    onClick={handleSaveImage}
                    className="w-full rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Sauvegarder
                  </button>
                </div>
              </div>
              {imagePreviewUrl && (
                <div className="ml-4 flex-shrink-0">
                  <div
                    className="mt-4 overflow-hidden rounded-lg shadow-lg"
                    style={{
                      width: "175px",
                      height: "300px",
                      borderRadius: "8px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    <img
                      src={imagePreviewUrl}
                      alt="Prévisualisation"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="w-full">
              <div className="mb-4">
                <label
                  htmlFor="themeSelector"
                  className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Choisir le thème
                </label>
                <select
                  id="themeSelector"
                  name="themeSelector"
                  onChange={handleThemeChange}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
                >
                  <option value="light">Clair</option>
                  <option value="dark">Sombre</option>
                </select>
              </div>
              <div className="mb-4 flex items-center">
                <input
                  id="autoTheme"
                  type="checkbox"
                  onChange={handleAutoThemeChange}
                  className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
                />
                <label
                  htmlFor="autoTheme"
                  className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  Changer le thème en fonction de l'image sélectionnée
                </label>
              </div>
            </div>
          </div>
        );
      case "about":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">À propos de l'application</h3>
            <p>
              <strong>Version:</strong> 1.0.0
            </p>
            <p>
              <strong>Description:</strong> Cette application sert de page
              d'accueil pour navigateur, offrant des fonctionnalités avancées
              pour améliorer votre expérience en ligne.
            </p>
            <p>
              <strong>Fonctionnalités:</strong>
            </p>
            <ul className="list-disc pl-5">
              <li>Recherche rapide et efficace</li>
              <li>Organisation des favoris par dossier</li>
              <li>Personnalisation du thème</li>
            </ul>
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
            {" "}
            {/* Modifié ici */}
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
                      className={`p-2 ${activeTab === tab.id ? "bg-gray-200" : ""}`}
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
