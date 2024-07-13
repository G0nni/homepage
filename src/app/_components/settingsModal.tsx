"use client";
import React, { useState } from "react";
import Image from "next/image";
import SettingsIcon from "~/assets/svg/cil-settings.svg";

export function SettingsModal() {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("light");
  const [isAutoThemeEnabled, setIsAutoThemeEnabled] = useState(false);

  const openSettingsModal = () => {
    setIsSettingsModalOpen(true);
  };

  const closeSettingsModal = () => {
    setIsSettingsModalOpen(false);
    window.location.reload();
  };
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      // Image size exceeds 5MB
      alert("La taille de l'image ne doit pas dépasser 5 Mo");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result as string;
      setImagePreviewUrl(base64Image);
      localStorage.setItem("themeImage", base64Image);
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

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return <p>Contenu Général</p>;
      case "theme":
        return (
          <div>
            <div className="mb-4">
              <label
                htmlFor="themeImage"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Changer l'image
              </label>
              <input
                type="file"
                id="themeImage"
                name="themeImage"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-gray-400 dark:placeholder-gray-400"
              />
              {imagePreviewUrl && (
                <img
                  src={imagePreviewUrl}
                  alt="Prévisualisation"
                  className="mt-4 max-h-40 w-full rounded-lg object-cover"
                />
              )}
            </div>
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
                {/* Ajoutez d'autres options de thème ici */}
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
