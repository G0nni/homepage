"use client";
import React, { useEffect, useState } from "react";
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";

interface ThemeSelectorProps {
  selectedTheme: string;
  handleThemeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleAutoThemeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isAutoThemeEnabled: boolean;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  selectedTheme,
  handleThemeChange,
  handleAutoThemeChange,
  isAutoThemeEnabled,
}) => {
  const [topColor, setTopColor] = useColor("#121212");
  const [bottomColor, setBottomColor] = useColor("#121212");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const storedTopColor = localStorage.getItem("topColor");
    const storedBottomColor = localStorage.getItem("bottomColor");

    if (storedTopColor && storedBottomColor) {
      setTopColor(JSON.parse(storedTopColor));
      setBottomColor(JSON.parse(storedBottomColor));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("topColor", JSON.stringify(topColor));
    localStorage.setItem("bottomColor", JSON.stringify(bottomColor));
    window.dispatchEvent(new Event("storage"));
    setIsSaved(true);
  };

  return (
    <div className="mt-5 w-full">
      <div className="mb-4">
        <label
          htmlFor="themeSelector"
          className="block text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Choisir le thème
        </label>
        <div className="m-5 flex items-center">
          <input
            id="autoTheme"
            type="checkbox"
            onChange={handleAutoThemeChange}
            checked={isAutoThemeEnabled}
            className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
          />
          <label
            htmlFor="autoTheme"
            className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Changer le thème en fonction de l'image sélectionnée
          </label>
        </div>
        {!isAutoThemeEnabled ? (
          <div className="mt-2 flex flex-col space-x-4 p-5 md:flex-row lg:flex-row">
            <div className="flex-grow">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                Couleur du haut
              </label>
              <ColorPicker
                hideInput={["rgb", "hsv"]}
                color={topColor}
                onChange={setTopColor}
              />
            </div>
            <div className="flex-grow">
              <label className="block text-sm font-medium text-gray-900 dark:text-gray-300">
                Couleur du bas
              </label>
              <ColorPicker
                hideInput={["rgb", "hsv"]}
                color={bottomColor}
                onChange={setBottomColor}
              />
            </div>
          </div>
        ) : (
          ""
        )}
      </div>

      <div className="mb-4">
        <button
          onClick={handleSave}
          className="rounded-md bg-blue-500 px-4 py-2 text-white shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Valider
        </button>
      </div>
    </div>
  );
};

export default ThemeSelector;
