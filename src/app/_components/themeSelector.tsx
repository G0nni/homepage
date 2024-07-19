"use client";
import React, { useEffect } from "react";
import { ColorPicker, useColor, type IColor } from "react-color-palette";
import "react-color-palette/css";

interface ThemeSelectorProps {
  handleAutoThemeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isAutoThemeEnabled: boolean;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  handleAutoThemeChange,
  isAutoThemeEnabled,
}) => {
  const [topColor, setTopColor] = useColor("#65bad7");
  const [bottomColor, setBottomColor] = useColor("#7a7e46");

  const isValidColor = (color: unknown): color is IColor => {
    if (typeof color !== "object" || color === null) return false;
    const colorObj = color as IColor;
    return (
      typeof colorObj.hex === "string" &&
      typeof colorObj.rgb === "object" &&
      typeof colorObj.rgb.r === "number" &&
      typeof colorObj.rgb.g === "number" &&
      typeof colorObj.rgb.b === "number" &&
      typeof colorObj.rgb.a === "number" &&
      typeof colorObj.hsv === "object" &&
      typeof colorObj.hsv.h === "number" &&
      typeof colorObj.hsv.s === "number" &&
      typeof colorObj.hsv.v === "number" &&
      typeof colorObj.hsv.a === "number"
    );
  };

  useEffect(() => {
    const storedTopColor = localStorage.getItem("topColor");
    const storedBottomColor = localStorage.getItem("bottomColor");

    if (storedTopColor && storedBottomColor) {
      try {
        const parsedTopColor: unknown = JSON.parse(storedTopColor);
        const parsedBottomColor: unknown = JSON.parse(storedBottomColor);
        if (isValidColor(parsedTopColor) && isValidColor(parsedBottomColor)) {
          setTopColor(parsedTopColor);
          setBottomColor(parsedBottomColor);
          console.log("Colors loaded from localStorage");
        } else {
          console.error("Parsed colors are not valid IColor objects");
        }
      } catch (error) {
        console.error("Error parsing colors from localStorage", error);
      }
    }
  }, [setTopColor, setBottomColor]);

  const handleSave = () => {
    localStorage.setItem("topColor", JSON.stringify(topColor));
    localStorage.setItem("bottomColor", JSON.stringify(bottomColor));
    window.dispatchEvent(new Event("storage"));
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
            Changer le thème en fonction de l&apos;image sélectionnée
          </label>
        </div>
        {!isAutoThemeEnabled ? (
          <>
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
            <div className="mb-4">
              <button
                onClick={handleSave}
                className="rounded-md bg-indigo-600 px-4 py-2 text-white shadow-sm hover:bg-indigo-700 focus:outline-none"
              >
                Valider
              </button>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default ThemeSelector;
